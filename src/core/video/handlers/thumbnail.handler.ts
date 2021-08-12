import type { FastifyInstance } from 'fastify';
import { VideoService } from '../video.service';
import Boom from 'boom';
import { Errors } from '../../common/common.errors';

const thumbnailQuerySchema = {
  type: 'object',
  properties: {
    second: { type: 'number' },
  },
};

type ThumbnailQuery = { second: number; };
const DEFAULT_THUMBNAIL_SECOND = 1;

export const createThumbnailHandler = (
  path: string,
  fastify: FastifyInstance,
) => {
  fastify.post<{
    Querystring: ThumbnailQuery;
  }>(
    path,
    {
      schema: {
        querystring: thumbnailQuerySchema,
      },
    },
    async (request) => {
      const fileToProcess = await request.file();

      if (!fileToProcess) {
        throw Boom.badRequest(Errors.FileIsRequired);
      }

      const videoService = new VideoService();

      return await videoService.thumbnail(fileToProcess.file, {
        second: request.query.second ?? DEFAULT_THUMBNAIL_SECOND,
      });
    },
  );
};
