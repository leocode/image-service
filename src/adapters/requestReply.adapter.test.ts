import { requestReplyAdapter } from './requestReply.adapter';
import {
  getTestImage,
} from '../../test/test.utils';
import { FileTypeEnum } from './adapter.types';

describe('RequestReplyAdapter', () => {
  describe('handleFile', () => {
    it('should return file', async () => {
      const image = await getTestImage();

      const adapterResult = await requestReplyAdapter.handleFile({ file: image, fileType: FileTypeEnum.image, requestBody: {}});

      expect(adapterResult).toMatchObject({
        file: image,
      });
    });
  });

});
