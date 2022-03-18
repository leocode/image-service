import { VideoService } from '../video.service';
import Boom from 'boom';
import { Errors } from '../../common/common.errors';
import { handleResponse } from '../../common/response.handler';
import { getAdapter } from '../../../adapters/adapter.utils';
import type { AdapterParams } from '../../common/schemas';
import { adapterParamsSchema } from '../../common/schemas';
import { FileTypeEnum } from '../../../adapters/adapter.types';
import type { CommonHandlerParams } from '../../common/common.handler';

const thumbnailQuerySchema = {
  type: 'object',
  properties: {
    second: { type: 'number' },
  },
};

type ThumbnailQuery = { second: number };
const DEFAULT_THUMBNAIL_SECOND = 1;

export const createThumbnailHandler = ({ path, fastify, options }: CommonHandlerParams) => {
  fastify.post<{
    Params: AdapterParams;
    Querystring: ThumbnailQuery;
  }>(
    path,
    {
      schema: {
        ...options.baseSchema,
        params: adapterParamsSchema,
        querystring: thumbnailQuerySchema,
      },
    },
    async (request, reply) => {
      const fileToProcess = await request.file();

      if (!fileToProcess) {
        throw Boom.badRequest(Errors.FileIsRequired);
      }

      const videoService = new VideoService();
      const adapterName = request.params.adapter;
      const adapter = getAdapter(adapterName);

      const file = await videoService.thumbnail(fileToProcess.file, {
        second: request.query.second ?? DEFAULT_THUMBNAIL_SECOND,
      });
      const adapterResult = await adapter.handleFile({ file, fileType: FileTypeEnum.Video, requestBody: request.body });
      return await handleResponse(adapterResult, reply);
    },
  );
};
