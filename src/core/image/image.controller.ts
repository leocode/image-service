import type { FastifyInstance } from 'fastify';
import { createResizeHandler } from './handlers/resize.handler';
import { createMetadataHandler } from './handlers/metadata.handler';
import { createCropHandler } from './handlers/crop.handler';

export const imageController = async (fastify: FastifyInstance) => {
  const baseSchema = {
    tags: ['image'],
    consumes: ['multipart/form-data'],
  };

  createMetadataHandler({ path: '/metadata', fastify, options: { baseSchema } });
  createThumbnailHandler({ path: '/:adapter/thumbnail', fastify, options: { baseSchema } });
  createCropHandler({ path: '/:adapter/crop', fastify, options: { baseSchema } });
  createResizeHandler({ path: '/:adapter/resize', fastify, options: { baseSchema } });
};
