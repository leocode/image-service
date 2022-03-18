import type { FastifyInstance } from 'fastify';
import { createMetadataHandler } from './handlers/metadata.handler';
import { createResizeHandler } from './handlers/resize.handler';
import { createThumbnailHandler } from './handlers/thumbnail.handler';

export const videoController = async (fastify: FastifyInstance) => {
  const baseSchema = {
    tags: ['video'],
    consumes: ['multipart/form-data'],
  };

  createMetadataHandler({ path: '/metadata', fastify, options: { baseSchema } });
  createResizeHandler({ path: '/:adapter/resize', fastify, options: { baseSchema } });
  createThumbnailHandler({ path: '/:adapter/thumbnail', fastify, options: { baseSchema } });
};
