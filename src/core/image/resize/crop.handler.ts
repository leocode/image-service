import type { AdapterParams } from '../../common/schemas';
import { adapterParamsSchema } from '../../common/schemas';
import { getAdapter } from '../../../adapters/adapter.utils';
import { ImageService } from '../image.service';
import type { FastifyInstance } from 'fastify';
import type { Region } from 'sharp';
import type { FastifySchema } from 'fastify/types/schema';

const cropQuerySchema = {
  type: 'object',
  properties: {
    left: { type: 'number' },
    top: { type: 'number' },
    width: { type: 'number' },
    height: { type: 'number' },
  },
};

export const createCropHandler = (
  path: string,
  fastify: FastifyInstance,
  options: { schema: FastifySchema },
) => {
  fastify.post<{
    Params: AdapterParams;
    Querystring: Region;
  }>(
    path,
    {
      schema: {
        params: adapterParamsSchema,
        querystring: cropQuerySchema,
        ...options.schema,
      },
    },
    async (request) => {
      const fileToProcess = await request.file();
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

      return adapter.handleFile(file);
    },
  );
};
