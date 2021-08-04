import type { FastifyInstance } from 'fastify';
import { createMetadataHandler } from './handlers/metadata.handler';
import { createResizeHandler } from './handlers/resize.handler';
import { createThumbnailHandler } from './handlers/thumbnail.handler';

export const videoController = async (fastify: FastifyInstance) => {
  createMetadataHandler('/metadata', fastify);

  createResizeHandler('/:adapter/resize', fastify);

  createThumbnailHandler('/:adapter/thumbnail', fastify);
};
