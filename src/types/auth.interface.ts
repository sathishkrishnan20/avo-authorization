import { UserRole } from '../models/user.model';

declare module 'fastify' {
  interface FastifyRequest {
    user?: DecodedToken;
  }
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export interface DecodedToken {
  userId: string;
  role: UserRole;
}
