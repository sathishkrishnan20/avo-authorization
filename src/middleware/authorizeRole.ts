import { FastifyReply, FastifyRequest } from 'fastify';
import { UserRole } from '../models/user.model';
import { DecodedToken } from '../types/auth.interface';
import { AccessForbiddenError } from '../error';

export const authorizeRole = (allowedRoles: UserRole[]) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user;
    if (!allowedRoles.includes(user?.role!)) {
      throw new AccessForbiddenError('You do not have access to this resource');
    }
  };
};
