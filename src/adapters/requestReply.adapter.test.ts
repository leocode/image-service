import { requestReplyAdapter } from './requestReply.adapter';
import {
  getTestImage, getTestVideo,
} from '../../test/test.utils';
import { FileTypeEnum } from './adapter.types';

describe('RequestReplyAdapter', () => {
  describe('handleFile', () => {
    it('should return image file', async () => {
      const image = await getTestImage();

      const adapterResult = await requestReplyAdapter.handleFile({
        file: image,
        fileType: FileTypeEnum.Image,
        fileName: 'test-image.jpg',
        mimeType: 'image/jpg',
        requestBody: {},
      });

      expect(adapterResult).toMatchObject({
        file: image,
      });
    });

    it('should return video file', async () => {
      const video = await getTestVideo();

      const adapterResult = await requestReplyAdapter.handleFile({
        file: video,
        fileType: FileTypeEnum.Video,
        fileName: 'test-video.mp4',
        mimeType: 'video/mp4',
        requestBody: {},
      });

      expect(adapterResult).toMatchObject({
        file: video,
      });
    });
  });

});
