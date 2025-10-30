import {
  ConflictError,
  InvalidOrExpiredToken,
  InvalidPasswordError,
  NotFoundError,
} from '../error';
import { LoginRequest, RegisterRequest } from '../types/auth.interface';
import { UserModel, UserRole } from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RefreshTokenModel } from '../models/refreshToken.model';
import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY_DAYS } from '../config/constant';

const generateAccessToken = (userId: string, role: UserRole) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET!, { expiresIn: ACCESS_TOKEN_EXPIRY });
};

const generateRefreshToken = (tokenId: string, userId: string) => {
  return jwt.sign({ tokenId, userId }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: `${REFRESH_TOKEN_EXPIRY_DAYS}d`,
  });
};

export const AuthService = {
  registerUser: async ({ email, password, name, role }: RegisterRequest) => {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw new ConflictError('Email Already Exists');
    }
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);
    await UserModel.create({ name, email, role, password: encryptedPassword });
    return {
      success: true,
      message: 'User Registered Successfully',
    };
  },

  loginUser: async ({ email, password }: LoginRequest) => {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new InvalidPasswordError();
    }

    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
    const token = await RefreshTokenModel.create({ userId: user._id, expiresAt }); // Created a separate Collection for
    //  Storing the Refresh Tokens considering that we would support multiple devices
    //  and multiple browsers/ Multiple Login at same time, along with that we can store the source meta, but currently i am not focused on it

    const accessToken = generateAccessToken(user._id as string, user.role);
    const refreshToken = generateRefreshToken(token._id as string, user._id as string);
    return {
      accessToken,
      refreshToken,
    };
  },

  refreshAccessToken: async (refreshToken: string) => {
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as {
        tokenId: string;
        userId: string;
      };
    } catch (err) {
      throw new InvalidOrExpiredToken('Invalid or expired refresh token');
    }
    const { tokenId, userId } = decoded;
    const tokenInfo = await RefreshTokenModel.findById(tokenId);
    if (!tokenInfo) {
      throw new InvalidOrExpiredToken('Token not found or Expired');
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    const accessToken = generateAccessToken(user._id as string, user.role);
    return {
      accessToken,
    };
  },
};
