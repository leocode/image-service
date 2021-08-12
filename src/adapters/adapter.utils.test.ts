import { getAdapter } from './adapter.utils';
import { AdapterEnum } from './adapter.types';
import { requestReplyAdapter } from './requestReply.adapter';
import { AdapterErrors } from './adapter.errors';

describe('AdapterUtils', () => {
  describe('getAdapter', () => {
    it('should throw error', async () => {
      expect(() => getAdapter('NonexistentAdapter')).toThrowError(AdapterErrors.AdapterNotFound);
    });

    it('should return RequestReplyAdapter', async () => {
      const adapter = await getAdapter(AdapterEnum.requestReply);

      expect(adapter).toStrictEqual(requestReplyAdapter);
    });
  });

});
