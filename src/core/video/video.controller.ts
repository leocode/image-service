import type { FastifyInstance } from 'fastify';
import Boom from 'boom';
import { adapterParamsSchema, fileBodySchema } from '../common/schemas';
import { createMetadataHandler } from './handlers/metadata.handler';
import { createResizeHandler } from './handlers/resize.handler';

export const videoController = async (fastify: FastifyInstance) => {
  createMetadataHandler('/metadata', fastify);

  createResizeHandler('/:adapter/resize', fastify);

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
};
