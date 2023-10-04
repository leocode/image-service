import { ImageService } from '../image.service';
import Boom from 'boom';
import { Errors } from '../../common/common.errors';
import { getAdapter } from '../../../adapters/adapter.utils';
import type { AdapterParams } from '../../common/schemas';
import { adapterParamsSchema } from '../../common/schemas';
import { handleResponse } from '../../common/response.handler';
import { FileTypeEnum } from '../../../adapters/adapter.types';
import type { CommonHandlerParams } from '../../common/common.handler';

const thumbnailQuerySchema = {
  type: 'object',
  properties: {
    width: { type: 'number' },
    height: { type: 'number' },
  },
};

type ThumbnailQuery = { width: number; height: number };

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

      const { height, width } = request.query;
      const imageService = new ImageService();
      const adapterName = request.params.adapter;
      const adapter = getAdapter(adapterName);

      const file = imageService.resize(fileToProcess.file, {
        height,
        width,
      });

      const adapterResult = await adapter.handleFile({ file, fileType: FileTypeEnum.Image, requestBody: request.body });
      return await handleResponse(adapterResult, reply);
    },
  );
};
