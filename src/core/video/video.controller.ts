import type { FastifyInstance } from 'fastify';
import { createMetadataHandler } from './handlers/metadata.handler';
import { createResizeHandler } from './handlers/resize.handler';
import { createThumbnailHandler } from './handlers/thumbnail.handler';

export const videoController = async (fastify: FastifyInstance) => {
  const schema = {
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

  createMetadataHandler('/metadata', fastify, { schema });

  createResizeHandler('/:adapter/resize', fastify, { schema });

  createThumbnailHandler('/:adapter/thumbnail', fastify, { schema });
};
