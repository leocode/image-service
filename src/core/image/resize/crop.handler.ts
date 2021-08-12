import type { AdapterParams } from '../../common/schemas';
import { adapterParamsSchema } from '../../common/schemas';
import { getAdapter } from '../../../adapters/adapter.utils';
import { ImageService } from '../image.service';
import type { FastifyInstance } from 'fastify';
import type { Region } from 'sharp';
import Boom from 'boom';
import { Errors } from '../../common/common.errors';
import { handleResponse } from '../../common/response.handler';
import { FileTypeEnum } from '../../../adapters/adapter.types';

const cropQuerySchema = {
  type: 'object',
  properties: {
    left: { type: 'number' },
    top: { type: 'number' },
    width: { type: 'number' },
    height: { type: 'number' },
  },
};

export const createCropHandler = (path: string, fastify: FastifyInstance) => {
  fastify.post<{
    Params: AdapterParams;
    Querystring: Region;
  }>(
    path,
    {
      schema: {
        params: adapterParamsSchema,
        querystring: cropQuerySchema,
      },
    },
    async (request, reply) => {
      const fileToProcess = await request.file();

      if (!fileToProcess) {
        throw Boom.badRequest(Errors.FileIsRequired);
      }

      const adapterName = request.params.adapter;
      const adapter = getAdapter(adapterName);
      const { top, left, height, width } = request.query;
      const imageService = new ImageService();

      const file = await imageService.crop(fileToProcess.file, {
        top,
        left,
        height,
        width,
      });

      const adapterResult = await adapter.handleFile({ file, fileType: FileTypeEnum.image, requestBody: request.body });
      return await handleResponse(adapterResult, reply);
    },
  );
};
