import type { FastifyInstance } from 'fastify';
import Boom from 'boom';
import { adapterParamsSchema, fileBodySchema } from '../common/schemas';
import { createResizeHandler } from './resize/resize.handler';
import { createMetadataHandler } from './resize/metadata.handler';

export const imageController = (fastify: FastifyInstance) => {
  createMetadataHandler(fastify);

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

  fastify.post(
    '/:adapter/crop',
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

  createResizeHandler(fastify);
};
