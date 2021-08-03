import type { FastifyInstance } from 'fastify';
import { createResizeHandler } from './resize/resize.handler';
import { createMetadataHandler } from './resize/metadata.handler';
import { createCropHandler } from './resize/crop.handler';
import { createThumbnailHandler } from './resize/thumbnail.handler';

export const imageController = (fastify: FastifyInstance) => {
  createMetadataHandler('/metadata', fastify);
  createThumbnailHandler('/thumbnail', fastify);
  createCropHandler('/:adapter/crop', fastify);
  createResizeHandler('/:adapter/resize', fastify);
};
