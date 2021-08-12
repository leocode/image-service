import { ImageService } from '../image.service';
import type { FastifyInstance } from 'fastify';
import type { FastifySchema } from 'fastify/types/schema';
import Boom from 'boom';
import { Errors } from '../../common/common.errors';

export const createMetadataHandler = (
  path: string,
  fastify: FastifyInstance,
  options: { schema: FastifySchema },
) => {
  fastify.post(path, { ...options }, async (request) => {
    const fileToProcess = await request.file();

    if (!fileToProcess) {
      throw Boom.badRequest(Errors.FileIsRequired);
    }

    const imageService = new ImageService();

    return imageService.metadata(fileToProcess.file);
  });
};
