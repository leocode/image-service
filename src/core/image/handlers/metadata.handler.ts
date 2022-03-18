import { ImageService } from '../image.service';
import Boom from 'boom';
import { Errors } from '../../common/common.errors';
import type { CommonHandlerParams } from '../../common/common.handler';

export const createMetadataHandler = ({ path, fastify, options }: CommonHandlerParams) => {
  fastify.post(path, { schema: options.baseSchema }, async (request) => {
    const fileToProcess = await request.file();

    if (!fileToProcess) {
      throw Boom.badRequest(Errors.FileIsRequired);
    }

    const imageService = new ImageService();

    return await imageService.metadata(fileToProcess.file);
  });
};
