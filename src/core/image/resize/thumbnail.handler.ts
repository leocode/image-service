import { ImageService } from '../image.service';
import type { FastifyInstance } from 'fastify';
import type { FastifySchema } from 'fastify/types/schema';

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
  options: { schema: FastifySchema },
) => {
  fastify.post<{
    Querystring: ThumbnailQuery;
  }>(
    path,
    {
      schema: {
        querystring: thumbnailQuerySchema,
        ...options.schema,
      },
    },
    async (request) => {
      const fileToProcess = await request.file();
      const { height, width } = request.query;
      const imageService = new ImageService();

      return imageService.resize(fileToProcess.file, {
        height,
        width,
      });
    },
  );
};
