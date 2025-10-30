import { FastifyInstance } from 'fastify';
import { LoginRequest, RegisterRequest } from '../types/auth.interface';
import { validateRequest } from '../middleware/validateRequest';
import { LoginRequestSchema, RegisterRequestSchema } from '../dto/auth.dto';
import { AuthService } from '../services/auth.service';
import { BadRequestFoundError } from '../error';

export async function AuthRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: LoginRequest }>(
    '/login',
    { preHandler: validateRequest({ body: LoginRequestSchema }) },
    async (request, reply) => {
      const tokens = await AuthService.loginUser(request.body);
      return reply.status(200).send({
        success: true,
        tokens,
      });
    }
  );

  fastify.post<{ Body: RegisterRequest }>(
    '/register',
    { preHandler: validateRequest({ body: RegisterRequestSchema }) },
    async (request, reply) => {
      await AuthService.registerUser(request.body);
      return reply.status(201).send({
        success: true,
      });
    }
  );

  fastify.post<{ Body: RegisterRequest }>('/generate-access-token', async (request, reply) => {
    if (!request.headers['x-refresh-token']) {
      throw new BadRequestFoundError('Provide Refresh token');
    }
    const result = await AuthService.refreshAccessToken(
      request.headers['x-refresh-token']!! as string
    );
    return reply.status(200).send({
      success: true,
      tokens: result,
    });
  });
}
