import type { AdapterParams } from '../../common/schemas';
import { adapterParamsSchema } from '../../common/schemas';
import { getAdapter } from '../../../adapters/adapter.utils';
import type { FastifyInstance } from 'fastify';
import { VideoService } from '../video.service';
import type { FastifySchema } from 'fastify/types/schema';
import Boom from 'boom';
import { Errors } from '../../common/common.errors';
import { handleResponse } from '../../common/response.handler';
import { FileTypeEnum } from '../../../adapters/adapter.types';
import * as mime from 'mime-types';

type ResizeQuery = { width: number; height: number; codecName: string };

const resizeQuerySchema = {
  type: 'object',
  properties: {
    height: { type: 'number' },
    width: { type: 'number' },
  },
  required: ['height', 'width'],
};

export const createResizeHandler = (
  path: string,
  fastify: FastifyInstance,
  options: { baseSchema: FastifySchema },
) => {
  fastify.post<{
    Params: AdapterParams;
    Querystring: ResizeQuery;
  }>(
    path,
    {
      schema: {
        ...options.baseSchema,
        params: adapterParamsSchema,
        querystring: resizeQuerySchema,
      },
    },
    async (request, reply) => {
      const adapterName = request.params.adapter;
      const adapter = getAdapter(adapterName);
      const resizeOptions = request.query;
      const videoService = new VideoService();
      const [fileToProcess] = await request.saveRequestFiles();

      if (!fileToProcess) {
        throw Boom.badRequest(Errors.FileIsRequired);
      }

      const format = mime.extension(fileToProcess.mimetype);

      if (!format) {
        throw Boom.badRequest(Errors.MimeTypeNotRecognized);
      }

      const file = await videoService.resizeFile({
        format,
        path: fileToProcess.filepath,
      }, {
        height: resizeOptions.height,
        width: resizeOptions.width,
      });

      const adapterResult = await adapter.handleFile({
        file,
        fileType: FileTypeEnum.Video,
        mimeType: fileToProcess.mimetype,
        fileName: fileToProcess.filename,
        requestBody: request.body,
      });
      return await handleResponse(adapterResult, reply);
    },
  );
};
