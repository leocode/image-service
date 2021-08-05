import type { AdapterParams } from '../../common/schemas';
import { adapterParamsSchema } from '../../common/schemas';
import { getAdapter } from '../../../adapters/adapter.utils';
import type { FastifyInstance } from 'fastify';
import { VideoService } from '../video.service';
import type { FastifySchema } from 'fastify/types/schema';

type ResizeQuery = { width: number; height: number; codecName: string };

const resizeQuerySchema = {
  type: 'object',
  properties: {
    height: { type: 'number' },
    width: { type: 'number' },
    codecName: { type: 'string' },
  },
  required: ['height', 'width', 'codecName'],
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
    async (request, reply) => {
      const fileToProcess = await request.file();
      const adapterName = request.params.adapter;
      const adapter = getAdapter(adapterName);
      const resizeOptions = request.query;
      const videoService = new VideoService();

      const result = await videoService.resize(fileToProcess.file, {
        height: resizeOptions.height,
        width: resizeOptions.width,
        codecName: resizeOptions.codecName,
      });

      return await adapter.handleFile(result);
    },
  );
};
