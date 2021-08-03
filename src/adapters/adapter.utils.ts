import Boom from 'boom';
import { AdapterErrors } from './adapter.errors';
import type { AdapterType } from './adapter.types';
import { AdapterEnum } from './adapter.types';
import { requestReplyAdapter } from './requestReply.adapter';

export const getAdapter = (adapterName: string) => {
  switch (adapterName as AdapterType) {
    case AdapterEnum.requestReply: {
      return requestReplyAdapter;
    }
  }

  throw Boom.badRequest(AdapterErrors.AdapterNotFound);
};
