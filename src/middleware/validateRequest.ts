// src/middleware/validateRequest.ts
import { FastifyReply, FastifyRequest } from 'fastify';
import Joi, { ObjectSchema } from 'joi';

interface ValidationSchemas {
  body?: ObjectSchema;
  query?: ObjectSchema;
  params?: ObjectSchema;
}

export function validateRequest(schemas: ValidationSchemas) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      if (schemas.body) {
        const { error, value } = schemas.body.validate(request.body, { abortEarly: false });
        if (error) {
          return reply.status(400).send({
            success: false,
            message: 'Body validation failed',
            errors: error.details.map((d) => d.message),
          });
        }
        (request as any).body = value;
      }

      if (schemas.query) {
        const { error, value } = schemas.query.validate(request.query, { abortEarly: false });
        if (error) {
          return reply.status(400).send({
            success: false,
            message: 'Query validation failed',
            errors: error.details.map((d) => d.message),
          });
        }
        (request as any).query = value;
      }

      if (schemas.params) {
        const { error, value } = schemas.params.validate(request.params, { abortEarly: false });
        if (error) {
          return reply.status(400).send({
            success: false,
            message: 'Params validation failed',
            errors: error.details.map((d) => d.message),
          });
        }
        (request as any).params = value;
      }
    } catch (err) {
      request.log.error(err);
      return reply.status(500).send({ success: false, message: 'Validation middleware error' });
    }
  };
}
