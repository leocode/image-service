import type { AdapterParams } from '../../common/schemas';
import { adapterParamsSchema } from '../../common/schemas';
import { getAdapter } from '../../../adapters/adapter.utils';
import { VideoService } from '../video.service';
import Boom from 'boom';
import { Errors } from '../../common/common.errors';
import { handleResponse } from '../../common/response.handler';
import { FileTypeEnum } from '../../../adapters/adapter.types';
import type { CommonHandlerParams } from '../../common/common.handler';

type ResizeQuery = { width: number; height: number; codecName: string };

const resizeQuerySchema = {
  type: 'object',
  properties: {
    height: { type: 'number' },
    width: { type: 'number' },
  },
  required: ['height', 'width'],
};

export const createResizeHandler = ({ path, fastify, options }: CommonHandlerParams) => {
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

      // If `codecName` is provided we can operate directly on streams which is faster
      // Without `codecName` video file needs to be saved to resolve the codec
      if (resizeOptions.codecName) {
        const fileToProcess = await request.file();

        const file = await videoService.resizeStream(fileToProcess.file, {
          height: resizeOptions.height,
          width: resizeOptions.width,
          codecName: resizeOptions.codecName,
        });

        const adapterResult = await adapter.handleFile({ file, fileType: FileTypeEnum.Video, requestBody: request.body });
        return await handleResponse(adapterResult, reply);
      } else {
        const [fileToProcess] = await request.saveRequestFiles();

        if (!fileToProcess) {
          throw Boom.badRequest(Errors.FileIsRequired);
        }

        const file = await videoService.resizeFile(fileToProcess.filepath,
          {
            height: resizeOptions.height,
            width: resizeOptions.width,
          });

        const adapterResult = await adapter.handleFile({ file, fileType: FileTypeEnum.Video, requestBody: request.body });
        return await handleResponse(adapterResult, reply);
      }
    },
  );
};
