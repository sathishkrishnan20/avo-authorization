import { FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';
import { DecodedToken } from '../types/auth.interface';
import { InvalidOrExpiredToken, UnAuthorizedError } from '../error';

export async function authorizeToken(request: FastifyRequest, reply: FastifyReply) {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnAuthorizedError('Authorization header missing or invalid');
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    console.log('Decoded', decoded);
    request.user = decoded;
  } catch (err: any) {
    request.log.error(err);
    throw new InvalidOrExpiredToken('Invalid or expired token');
  }
}
