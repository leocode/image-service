import Boom from 'boom';
import { AdapterErrors } from './adapter.errors';
import type { AdapterType } from './adapter.types';
import { AdapterEnum } from './adapter.types';

export const getAdapter = (adapterName: string) => {
  const adapter = AdapterEnum[adapterName as AdapterType];

  if (!adapter) {
    throw Boom.badRequest(AdapterErrors.AdapterNotFound);
  }

  return adapter;
};
