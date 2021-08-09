import type { Stream } from 'stream';
import { Readable } from 'stream';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export const getTestImage = async (): Promise<Readable> => {
  const image = await getTestImageBuffer();

  return Readable.from(image);
};

export const TEST_IMAGE_PATH = 'test/resources/test-image.jpg';

export const getTestImageBuffer = async (): Promise<Buffer> => {
  return await fs.promises.readFile(path.join(process.cwd(), TEST_IMAGE_PATH));
};

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
