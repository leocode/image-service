import { ImageService } from '../image.service';
import type { FastifyInstance } from 'fastify';
import type { FastifySchema } from 'fastify/types/schema';

export const createMetadataHandler = (
  path: string,
  fastify: FastifyInstance,
  options: { schema: FastifySchema },
) => {
  fastify.post(path, { ...options }, async (request) => {
    const fileToProcess = await request.file();
    const imageService = new ImageService();

    return imageService.metadata(fileToProcess.file);
  });
};
