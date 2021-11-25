import type { FastifyInstance } from 'fastify';
import { createResizeHandler } from './handlers/resize.handler';
import { createMetadataHandler } from './handlers/metadata.handler';
import { createCropHandler } from './handlers/crop.handler';

export const imageController = async (fastify: FastifyInstance) => {
  const baseSchema = {
    tags: ['image'],
    consumes: ['multipart/form-data'],
  };

  createMetadataHandler('/metadata', fastify, { baseSchema });
  createCropHandler('/:adapter/crop', fastify, { baseSchema });
  createResizeHandler('/:adapter/resize', fastify, { baseSchema });
};
