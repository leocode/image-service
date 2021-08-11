import type { AdapterParams } from '../../common/schemas';
import { adapterParamsSchema } from '../../common/schemas';
import { getAdapter } from '../../../adapters/adapter.utils';
import type { FastifyInstance } from 'fastify';
import { VideoService } from '../video.service';

type ResizeQuery = { width: number; height: number; codecName: string };

const resizeQuerySchema = {
  type: 'object',
  properties: {
    height: { type: 'number' },
    width: { type: 'number' },
    codecName: { type: 'string' },
  },
  required: ['height', 'width'],
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
      const adapterName = request.params.adapter;
      const adapter = getAdapter(adapterName);
      const resizeOptions = request.query;
      const videoService = new VideoService();

      // If `codecName` is provided we can operate directly on streams which is faster
      // Without `codecName` video file needs to be saved to resolve the codec
      if (resizeOptions.codecName) {
        const fileToProcess = await request.file();

        const result = await videoService.resizeStream(fileToProcess.file, {
          height: resizeOptions.height,
          width: resizeOptions.width,
          codecName: resizeOptions.codecName,
        });

        return adapter.handleFile(result);
      } else {
        const [file] = await request.saveRequestFiles();

        const result = await videoService.resizeFile(file.filepath, {
          height: resizeOptions.height,
          width: resizeOptions.width,
        });

        return adapter.handleFile(result);
      }
    },
  );
};
