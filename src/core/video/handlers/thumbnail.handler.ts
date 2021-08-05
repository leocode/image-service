import type { FastifyInstance } from 'fastify';
import { VideoService } from '../video.service';
import type { FastifySchema } from 'fastify/types/schema';

const thumbnailQuerySchema = {
  type: 'object',
  properties: {
    second: { type: 'number' },
  },
};

type ThumbnailQuery = { second: number };
const DEFAULT_THUMBNAIL_SECOND = 1;

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
      const videoService = new VideoService();

      return await videoService.thumbnail(fileToProcess.file, {
        second: request.query.second ?? DEFAULT_THUMBNAIL_SECOND,
      });
    },
  );
};
