import type { FastifyInstance } from 'fastify';
import { createMetadataHandler } from './handlers/metadata.handler';
import { createResizeHandler } from './handlers/resize.handler';
import { createThumbnailHandler } from './handlers/thumbnail.handler';

export const videoController = async (fastify: FastifyInstance) => {
  const baseSchema = {
    tags: ['video'],
    consumes: ['multipart/form-data'],
    body: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
      required: ['file'],
    },
  };

  createMetadataHandler('/metadata', fastify, { baseSchema });

  createResizeHandler('/:adapter/resize', fastify, { baseSchema });

  createThumbnailHandler('/:adapter/thumbnail', fastify, { baseSchema });
};
