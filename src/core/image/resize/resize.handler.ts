import type { AdapterParams } from '../../common/schemas';
import { adapterParamsSchema } from '../../common/schemas';
import { getAdapter } from '../../../adapters/adapter.utils';
import { ImageService } from '../image.service';
import type { FastifyInstance } from 'fastify';
import { handleResponse } from '../../common/response.handler';

type ResizeQuery = { width: number; height: number };

const resizeQuerySchema = {
  type: 'object',
  properties: {
    height: { type: 'number' },
    width: { type: 'number' },
  },
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
      const adapterName = request.params.adapter;
      const adapter = getAdapter(adapterName);
      const resizeOptions = request.query;
      const imageService = new ImageService();

      const file = await imageService.resize(fileToProcess.file, {
        height: resizeOptions.height,
        width: resizeOptions.width,
      });

      const adapterResult = await adapter.handleFile({ file, fileType: 'image', requestBody: request.body });
      return await handleResponse(adapterResult, reply);
    },
  );
};
