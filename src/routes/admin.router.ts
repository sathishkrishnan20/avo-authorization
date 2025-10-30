import { FastifyInstance } from 'fastify';
import { UserService } from '../services/user.service';

export async function AdminRoutes(fastify: FastifyInstance) {
  fastify.get('/', async (request, reply) => {
    const result = await UserService.getUser(request.user?.userId!);
    return reply.status(200).send({
      success: true,
      result,
    });
  });
}
