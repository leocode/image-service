import type { FastifyInstance } from 'fastify';
import { createResizeHandler } from './resize/resize.handler';
import { createMetadataHandler } from './resize/metadata.handler';
import { createCropHandler } from './resize/crop.handler';
import { createThumbnailHandler } from './resize/thumbnail.handler';

export const imageController = async (fastify: FastifyInstance) => {
  const baseSchema = {
    tags: ['image'],
    consumes: ['multipart/form-data'],
    body: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
      required: ['file'],
    },
  };

  createMetadataHandler('/metadata', fastify, { schema: baseSchema });
  createThumbnailHandler('/thumbnail', fastify, { schema: baseSchema });
  createCropHandler('/:adapter/crop', fastify, { schema: baseSchema });
  createResizeHandler('/:adapter/resize', fastify, { schema: baseSchema });
};
