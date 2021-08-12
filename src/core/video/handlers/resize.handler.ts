import type { AdapterParams } from '../../common/schemas';
import { adapterParamsSchema } from '../../common/schemas';
import { getAdapter } from '../../../adapters/adapter.utils';
import type { FastifyInstance } from 'fastify';
import { VideoService } from '../video.service';
import Boom from 'boom';
import { Errors } from '../../common/common.errors';
import { handleResponse } from '../../common/response.handler';
import { FileTypeEnum } from '../../../adapters/adapter.types';

type ResizeQuery = { width: number; height: number, codecName: string };

const resizeQuerySchema = {
  type: 'object',
  properties: {
    height: { type: 'number' },
    width: { type: 'number' },
    codecName: { type: 'string' },
  },
  required: ['height', 'width', 'codecName'],
};

export const createResizeHandler = (path: string, fastify: FastifyInstance) => {
  fastify.post<{
    Params: AdapterParams;
    Querystring: ResizeQuery;
  }>(
    path,
    {
      schema: {
        params: adapterParamsSchema,
        querystring: resizeQuerySchema,
      },
    },
    async (request, reply) => {
      const fileToProcess = await request.file();

      if (!fileToProcess) {
        throw Boom.badRequest(Errors.FileIsRequired);
      }

      const adapterName = request.params.adapter;
      const adapter = getAdapter(adapterName);
      const resizeOptions = request.query;
      const videoService = new VideoService();

      const file = await videoService.resize(fileToProcess.file, {
        height: resizeOptions.height,
        width: resizeOptions.width,
        codecName: resizeOptions.codecName,
      });

      const adapterResult = await adapter.handleFile({ file, fileType: FileTypeEnum.video, requestBody: request.body });
      return await handleResponse(adapterResult, reply);
    },
  );
};
