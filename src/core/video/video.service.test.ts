import { VideoService } from './video.service';
import {
  getTestVideo,
  getVideoMetadata,
  streamToBuffer,
  TEST_VIDEO_1_SECOND_SCREENSHOT_PATH,
  TEST_VIDEO_PATH,
} from '../../../test/test.utils';
import * as fs from 'fs';
import jimp from 'jimp';
import { Orientation } from '../common/common.types';

describe('VideoService', () => {
  let videoService: VideoService;
  beforeEach(() => {
    videoService = new VideoService();
  });

  describe('#resize', () => {
    it('should resize passed video stream', async () => {
      const expectedDimensions = 100;
      const video = await getTestVideo();

      const resizedVideo = videoService.resizeStream(video, {
        height: expectedDimensions,
        width: expectedDimensions,
        codecName: 'h264',
      });

      const resizedVideoMetadata = await getVideoMetadata(resizedVideo);
      const [videoStream] = resizedVideoMetadata.streams;

      expect(videoStream.height).toEqual(expectedDimensions);
      expect(videoStream.width).toEqual(expectedDimensions);
    });
    it('should resize passed video file', async () => {
      // on windows there could be EOF error - check https://github.com/fluent-ffmpeg/node-fluent-ffmpeg/pull/985
      // given
      const expectedDimensions = 100;

      // when
      const resizedVideo = await videoService.resizeFile(TEST_VIDEO_PATH, {
        height: expectedDimensions,
        width: expectedDimensions,
      });

      // then
      const resizedVideoMetadata = await getVideoMetadata(resizedVideo);
      const [videoStream] = resizedVideoMetadata.streams;

      expect(videoStream.height).toEqual(expectedDimensions);
      expect(videoStream.width).toEqual(expectedDimensions);
    });
  });

  describe('#metadata', () => {
    it('should retrieve metadata of passed file', async () => {
      const video = await getTestVideo();

      const metadata = await videoService.metadata(video);

      expect(metadata).toMatchObject({
        duration: '3.34 s',
        orientation: Orientation.Landscape,
        width: 1920,
        height: 1080,
        mimeType: 'video/mp4',
      });
    });
  });

  describe('#thumbnail', () => {
    it('should create thumbnail of passed file', async () => {
      const video = await getTestVideo();
      const thumbnail = await videoService.thumbnail(video, { second: 1 });

      const expectedImage = await jimp.read(
        await streamToBuffer(
          fs.createReadStream(TEST_VIDEO_1_SECOND_SCREENSHOT_PATH),
        ),
      );
      const actualImage = await jimp.read(await streamToBuffer(thumbnail));

      const ACCEPTED_DISTANCE = 0.15;
      expect(jimp.distance(expectedImage, actualImage)).toBeLessThan(
        ACCEPTED_DISTANCE,
      );
    });
  });
});
