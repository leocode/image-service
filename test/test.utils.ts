import type { Stream } from 'stream';
import { PassThrough, Readable } from 'stream';
import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import sharp from 'sharp';

const TEST_RESOURCES_PATH = path.join(process.cwd(), 'test/resources/');

export const TEST_IMAGE_PATH = path.join(TEST_RESOURCES_PATH, 'test-image.jpg');

export const getTestImage = async (): Promise<Readable> => {
  const image = await getTestImageBuffer();

  return Readable.from(image);
};

export const getTestImageBuffer = async (): Promise<Buffer> => {
  return await fs.promises.readFile(TEST_IMAGE_PATH);
};

export const TEST_VIDEO_PATH = path.join(TEST_RESOURCES_PATH, 'test-video.mp4');
export const TEST_VIDEO_1_SECOND_SCREENSHOT_PATH = path.join(
  TEST_RESOURCES_PATH,
  'test-video-1-second-thumbnail.png',
);

export const getTestVideo = async (): Promise<Readable> => {
  const video = await getTestVideoBuffer();

  return Readable.from(video);
};

export const getTestVideoBuffer = (): Promise<Buffer> => {
  return fs.promises.readFile(TEST_VIDEO_PATH);
};

export const getVideoMetadata = async (videoToCompare: Stream): Promise<any> =>
  await new Promise((resolve, reject) => {
    ffmpeg(videoToCompare.pipe(new PassThrough())).ffprobe((err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });

export const streamToBuffer = (stream: Stream): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const data: any[] = [];

    stream.on('data', (chunk) => {
      data.push(chunk);
    });

    stream.on('end', () => {
      resolve(Buffer.concat(data));
    });

    stream.on('error', (err) => {
      reject(err);
    });
  });
};

export const getImageDimensions = async (resizedImage: Stream) => {
  const dimensions = await sharp(await streamToBuffer(resizedImage)).metadata();

  return {
    height: dimensions.height,
    width: dimensions.width,
  };
};

export const JPEG_MIME_TYPE = 'image/jpeg';
