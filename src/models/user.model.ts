import mongoose, { Schema, Document } from 'mongoose';

export enum UserRole {
  User = 'user',
  Admin = 'admin',
}
export interface IUser extends Document {
  email: string;
  password: string;
  name?: string;
  role: UserRole;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      required: [true, 'Role is required'],
    },
    name: {
      type: String,
    },
    lastLoginAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<IUser>('User', userSchema);
