import { ImageService } from '../image.service';
import type { FastifyInstance } from 'fastify';
import type { FastifySchema } from 'fastify/types/schema';
import Boom from 'boom';
import { Errors } from '../../common/common.errors';

const thumbnailQuerySchema = {
  type: 'object',
  properties: {
    width: { type: 'number' },
    height: { type: 'number' },
  },
};

type ThumbnailQuery = { width: number; height: number };

export const createThumbnailHandler = (
  path: string,
  fastify: FastifyInstance,
  options: { baseSchema: FastifySchema },
) => {
  fastify.post<{
    Querystring: ThumbnailQuery;
  }>(
    path,
    {
      schema: {
        ...options.baseSchema,
        querystring: thumbnailQuerySchema,
      },
    },
    async (request) => {
      const fileToProcess = await request.file();

      if (!fileToProcess) {
        throw Boom.badRequest(Errors.FileIsRequired);
      }

      const { height, width } = request.query;
      const imageService = new ImageService();

      return imageService.resize(fileToProcess.file, {
        height,
        width,
      });
    },
  );
};
