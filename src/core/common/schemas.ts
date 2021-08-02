const ADAPTERS = ['foo', 'bar'];

export const adapterParamsSchema = {
  type: 'object',
  properties: {
    adapter: {
      type: 'string',
      enum: ADAPTERS,
    },
  },
};

export const fileBodySchema = {
  type: 'object',
  properties: {
    file: { type: 'object' },
  },
  required: ['file'],
};
