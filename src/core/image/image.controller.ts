import type { FastifyInstance } from 'fastify';
import { createResizeHandler } from './handlers/resize.handler';
import { createMetadataHandler } from './handlers/metadata.handler';
import { createCropHandler } from './handlers/crop.handler';
import { createThumbnailHandler } from './handlers/thumbnail.handler';

export const imageController = async (fastify: FastifyInstance) => {
  createMetadataHandler('/metadata', fastify);
  createThumbnailHandler('/thumbnail', fastify);
  createCropHandler('/:adapter/crop', fastify);
  createResizeHandler('/:adapter/resize', fastify);
};
