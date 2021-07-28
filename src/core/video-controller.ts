import type { FastifyInstance } from 'fastify';
import Boom from 'boom';
import { adapterParamsSchema, fileBodySchema } from './schemas';

export async function videoController(fastify: FastifyInstance) {
  fastify.post('/metadata', {}, () => {
    throw Boom.notImplemented();
  });

  fastify.post(
    '/:adapter/resize',
    {
      schema: {
        params: adapterParamsSchema,
        body: fileBodySchema,
      },
    },
    () => {
      throw Boom.notImplemented();
    },
  );

  fastify.post(
    '/:adapter/thumbnail',
    {
      schema: {
        params: adapterParamsSchema,
        body: fileBodySchema,
      },
    },
    () => {
      throw Boom.notImplemented();
    },
  );
}
