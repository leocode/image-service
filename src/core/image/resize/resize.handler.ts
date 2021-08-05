import type { AdapterParams } from '../../common/schemas';
import { adapterParamsSchema } from '../../common/schemas';
import { getAdapter } from '../../../adapters/adapter.utils';
import { ImageService } from '../image.service';
import type { FastifyInstance } from 'fastify';
import type { FastifySchema } from 'fastify/types/schema';

type ResizeQuery = { width: number; height: number };

const resizeQuerySchema = {
  type: 'object',
  properties: {
    height: { type: 'number' },
    width: { type: 'number' },
  },
};

export const createResizeHandler = (
  path: string,
  fastify: FastifyInstance,
  options: { schema: FastifySchema },
) => {
  fastify.post<{
    Params: AdapterParams;
    Querystring: ResizeQuery;
  }>(
    path,
    {
      schema: {
        params: adapterParamsSchema,
        querystring: resizeQuerySchema,
        ...options.schema,
      },
    },
    async (request) => {
      const fileToProcess = await request.file();
      const adapterName = request.params.adapter;
      const adapter = getAdapter(adapterName);
      const resizeOptions = request.query;
      const imageService = new ImageService();

      const file = await imageService.resize(fileToProcess.file, {
        height: resizeOptions.height,
        width: resizeOptions.width,
      });

      return adapter.handleFile(file);
    },
  );
};
