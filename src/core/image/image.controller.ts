import type { FastifyInstance } from 'fastify';
import { createResizeHandler } from './handlers/resize.handler';
import { createMetadataHandler } from './handlers/metadata.handler';
import { createCropHandler } from './handlers/crop.handler';
import { createThumbnailHandler } from './handlers/thumbnail.handler';
import type {FastifySchema} from 'fastify/types/schema';

export const imageController = async (fastify: FastifyInstance) => {
  const baseSchema: FastifySchema = {
    tags: ['image'],
    consumes: ['multipart/form-data'],
  };

  createMetadataHandler({ path: '/metadata', fastify, options: { baseSchema } });
  createThumbnailHandler({ path: '/:adapter/thumbnail', fastify, options: { baseSchema } });
  createCropHandler({ path: '/:adapter/crop', fastify, options: { baseSchema } });
  createResizeHandler({ path: '/:adapter/resize', fastify, options: { baseSchema } });
};
