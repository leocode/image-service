import Boom from 'boom';
import { AdapterErrors } from './adapter.errors';
import { defaultAdapter } from './default.adapter';
import type { ADAPTERS } from './adapter.types';

export const getAdapter = (adapterName: string) => {
  switch (adapterName as typeof ADAPTERS[number]) {
    case 'default': {
      return defaultAdapter;
    }
  }

  throw Boom.badRequest(AdapterErrors.AdapterNotFound);
};
