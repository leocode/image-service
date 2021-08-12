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
