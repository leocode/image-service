import Boom from 'boom';
import { AdapterErrors } from './adapter.errors';
import type { AdapterEnum} from './adapter.types';
import { AdapterMap } from './adapter.types';

export const getAdapter = (adapterName: string) => {
  const adapter = AdapterMap[adapterName as AdapterEnum];

  if (!adapter) {
    throw Boom.badRequest(AdapterErrors.AdapterNotFound);
  }

  return adapter;
};
