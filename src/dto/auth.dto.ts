import Joi from 'joi';
import { UserRole } from '../models/user.model';

export const LoginRequestSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const RegisterRequestSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(16).required(),
  name: Joi.string().required(),
  role: Joi.string().valid(UserRole.Admin, UserRole.User).required(),
});
