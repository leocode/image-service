import { ImageService } from './image.service';
import { getTestImage, getTestImageBuffer, streamToBuffer } from '../../../test/test.utils';
import type { Region } from 'sharp';
import sharp from 'sharp';

describe('ImageService', () => {
  let imageService: ImageService;
  beforeEach(() => {
    imageService = new ImageService();
  });

  describe('#resize', () => {
    it('should resize passed image', async () => {
      const expectedDimensions = 20;
      const image = await getTestImage();

      const result = imageService.resize(image, {height: expectedDimensions});

      const resizedImageMetadata = await sharp(await streamToBuffer(result)).metadata();
      expect(resizedImageMetadata).toMatchObject({
        width: expectedDimensions,
        height: expectedDimensions,
      });
    });
  });

  describe('#crop', () => {
    it('should crop passed image', async () => {
      const cropOptions = {top: 1, height: 1, width: 1, left: 1} as Region;
      const image = await getTestImage();

      const result = imageService.crop(image, cropOptions);

      const resizedImageMetadata = await sharp(await streamToBuffer(result)).metadata();
      expect(resizedImageMetadata).toMatchObject({
        width: 1,
        height: 1,
      });
    });
  });

  describe('#metadata', () => {
    it('should retrieve metadata of passed file', async () => {
      const image = await getTestImage();
      const expectedMetadata = await sharp(await getTestImageBuffer()).metadata();

      const metadata = await imageService.metadata(image);

      expect(expectedMetadata).toMatchObject(metadata);
    });
  });
});
