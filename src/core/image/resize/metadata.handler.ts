import { ImageService } from '../image.service';
import type { FastifyInstance } from 'fastify';

export const createMetadataHandler = (fastify: FastifyInstance) => {
  fastify.post('/metadata', async (request) => {
    const fileToProcess = await request.file();
    const imageService = new ImageService();

    return imageService.metadata(fileToProcess.file);
  });
};
