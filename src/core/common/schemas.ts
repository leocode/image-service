import { ADAPTERS } from '../../adapters/adapter.types';

export const adapterParamsSchema = {
  type: 'object',
  properties: {
    adapter: {
      type: 'string',
      enum: ADAPTERS,
    },
  },
};

export type AdapterParams = { adapter: string };

export const fileBodySchema = {
  type: 'object',
  properties: {
    file: { type: 'object' },
  },
  required: ['file'],
};
