import { getAdapter } from './adapter.utils';
import { AdapterEnum } from './adapter.types';
import { requestReplyAdapter } from './requestReply.adapter';
import { AdapterErrors } from './adapter.errors';

describe('AdapterUtils', () => {
  describe('getAdapter', () => {
    it('should throw error', () => {
      expect(() => getAdapter('NonexistentAdapter')).toThrowError(AdapterErrors.AdapterNotFound);
    });

    it('should return RequestReplyAdapter', () => {
      const adapter = getAdapter(AdapterEnum.RequestReply);

      expect(adapter).toStrictEqual(requestReplyAdapter);
    });
  });

});
