import { ImageService } from '../image.service';
import type { FastifyInstance } from 'fastify';

export const createMetadataHandler = (
  path: string,
  fastify: FastifyInstance,
) => {
  fastify.post(path, async (request) => {
    const fileToProcess = await request.file();
    const imageService = new ImageService();

    return await imageService.metadata(fileToProcess.file);
  });
};
