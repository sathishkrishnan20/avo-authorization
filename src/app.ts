import Fastify from 'fastify';
import sensible from 'fastify-sensible';
import dotenv from 'dotenv';
import { AppError } from './error';
import cors from '@fastify/cors';
import { AuthRoutes } from './routes/auth.router';
import { UserRoutes } from './routes/user.router';
import { authorizeToken } from './middleware/authorizeToken';
import { authorizeRole } from './middleware/authorizeRole';
import { UserRole } from './models/user.model';
import { AdminRoutes } from './routes/admin.router';

dotenv.config();

export function buildApp() {
  const app = Fastify({
    logger: {
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    },
  });

  // plugins
  app.register(sensible);
  app.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Enable cookies
  });

  app.register(AuthRoutes, { prefix: '/api/auth' });

  app.register(
    (userScope, _opts, done) => {
      userScope.addHook('preHandler', authorizeToken);
      userScope.addHook('preHandler', authorizeRole([UserRole.User]));
      userScope.register(UserRoutes);
      done();
    },
    { prefix: '/api/user' }
  );

  app.register(
    (userScope, _opts, done) => {
      userScope.addHook('preHandler', authorizeToken);
      userScope.addHook('preHandler', authorizeRole([UserRole.Admin]));
      userScope.register(AdminRoutes);
      done();
    },
    { prefix: '/api/admin' }
  );

  app.setErrorHandler((error, request, reply) => {
    if (error instanceof AppError) {
      // Handle custom AppErrors
      reply.status(error.statusCode).send({ message: error.message, success: false });
    } else if (error.validation) {
      // Handle fastify validation errors (if using schema)
      reply
        .status(400)
        .send({ message: 'Validation error', details: error.validation, success: false });
    } else {
      console.error('Unexpected Error');
      // Unknown/unexpected errors
      request.log.error(error);
      reply.status(500).send({ message: 'Internal server error', success: false });
    }
  });
  // health
  app.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

  return app;
}
