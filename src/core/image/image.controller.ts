import type { FastifyInstance } from 'fastify';
import { createResizeHandler } from './resize/resize.handler';
import { createMetadataHandler } from './resize/metadata.handler';
import { createCropHandler } from './resize/crop.handler';
import { createThumbnailHandler } from './resize/thumbnail.handler';

export const imageController = async (fastify: FastifyInstance) => {
  const schema = {
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

  createMetadataHandler('/metadata', fastify, { schema });
  createThumbnailHandler('/thumbnail', fastify, { schema });
  createCropHandler('/:adapter/crop', fastify, { schema });
  createResizeHandler('/:adapter/resize', fastify, { schema });
};
