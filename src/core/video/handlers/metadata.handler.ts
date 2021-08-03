import type { FastifyInstance } from 'fastify';
import { VideoService } from '../video.service';

export const createMetadataHandler = (
  path: string,
  fastify: FastifyInstance,
) => {
  fastify.post(path, async (request) => {
    const fileToProcess = await request.file();
    const videoService = new VideoService();

    return videoService.metadata(fileToProcess.file);
  });
};
