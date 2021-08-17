import { requestReplyAdapter } from './requestReply.adapter';
import {
  getTestImage, getTestVideo,
} from '../../test/test.utils';
import { FileTypeEnum } from './adapter.types';

describe('RequestReplyAdapter', () => {
  describe('handleFile', () => {
    it('should return image file', async () => {
      const image = await getTestImage();

      const adapterResult = await requestReplyAdapter.handleFile({ file: image, fileType: FileTypeEnum.image, requestBody: {}});

      expect(adapterResult).toMatchObject({
        file: image,
      });
    });

    it('should return video file', async () => {
      const video = await getTestVideo();

      const adapterResult = await requestReplyAdapter.handleFile({ file: video, fileType: FileTypeEnum.video, requestBody: {}});

      expect(adapterResult).toMatchObject({
        file: video,
      });
    });
  });

});
