import Boom from 'boom';
import { AdapterErrors } from './adapter.errors';
import type { AdapterType } from './adapter.types';
import { ADAPTERS } from './adapter.types';
import { requestReplyAdapter } from './requestReply.adapter';

export const getAdapter = (adapterName: string) => {
  switch (adapterName as AdapterType) {
    case ADAPTERS.requestReply: {
      return requestReplyAdapter;
    }
  }

  throw Boom.badRequest(AdapterErrors.AdapterNotFound);
};
