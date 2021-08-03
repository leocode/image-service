import { ImageService } from './image.service';
import { getTestImage, getTestImageBuffer, streamToBuffer } from '../../../test/test.utils';
import type { Region } from 'sharp';
import sharp from 'sharp';

import getColors from 'get-image-colors';


describe('ImageService', () => {
  let imageService: ImageService;
  beforeEach(() => {
    imageService = new ImageService();
  });

  describe('#resize', () => {
    it('should resize passed image', async () => {
      const expectedDimensions = 20;
      const image = await getTestImage();

      const resizedImage = imageService.resize(image, {height: expectedDimensions});

      const resizedImageMetadata = await sharp(await streamToBuffer(resizedImage)).metadata();
      expect(resizedImageMetadata).toMatchObject({
        width: expectedDimensions,
        height: expectedDimensions,
      });
    });
  });

  describe('#crop', () => {
    it('should crop passed image', async () => {
      const expectedDimensions = 1;
      const cropOptions = {top: expectedDimensions, height: expectedDimensions, width: expectedDimensions, left: expectedDimensions} as Region;
      const image = await getTestImage();

      const croppedImage = imageService.crop(image, cropOptions);

      const croppedImageMetadata = await sharp(await streamToBuffer(croppedImage)).metadata();
      expect(croppedImageMetadata).toMatchObject({
        width: expectedDimensions,
        height: expectedDimensions,
      });
    });

    it('should crop proper region of the image', async () => {
      const expectedDimensions = 1;
      const expectedColor = '#043404';
      const cropOptions = {top: expectedDimensions, height: expectedDimensions, width: expectedDimensions, left: expectedDimensions} as Region;
      const image = await getTestImage();

      const croppedImage = imageService.crop(image, cropOptions);

      const colors = await getColors(await streamToBuffer(croppedImage), 'image/jpeg');
      expect(colors.length).toEqual(1);
      expect(colors[0].hex()).toEqual(expectedColor);
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
