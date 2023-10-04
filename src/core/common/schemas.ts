import { AVAILABLE_ADAPTERS } from '../../adapters/adapter.types';

export const adapterParamsSchema = {
  type: 'object',
  properties: {
    adapter: {
      type: 'string',
      enum: AVAILABLE_ADAPTERS,
    },
  },
};

export type AdapterParams = { adapter: string };
export type BaseFileInfo = {
  fileName: string,
  mimeType: string,
};
