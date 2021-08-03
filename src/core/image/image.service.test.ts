import { ImageService } from './image.service';
import {
  getTestImage,
  JPEG_MIME_TYPE,
  getImageDimensions,
  streamToBuffer,
} from '../../../test/test.utils';
import type { Region } from 'sharp';

import getColors from 'get-image-colors';
import { Orientation } from '../common/common.types';

describe('ImageService', () => {
  let imageService: ImageService;
  beforeEach(() => {
    imageService = new ImageService();
  });

  describe('#resize', () => {
    it('should resize passed image', async () => {
      const expectedDimensions = 20;
      const image = await getTestImage();

      const resizedImage = imageService.resize(image, {
        height: expectedDimensions,
      });

      const resizedImageDimensions = await getImageDimensions(resizedImage);
      expect(resizedImageDimensions).toMatchObject({
        width: expectedDimensions,
        height: expectedDimensions,
      });
    });
  });

  describe('#crop', () => {
    it('should crop passed image', async () => {
      const expectedDimensions = 1;
      const cropOptions = {
        top: expectedDimensions,
        height: expectedDimensions,
        width: expectedDimensions,
        left: expectedDimensions,
      } as Region;
      const image = await getTestImage();

      const croppedImage = imageService.crop(image, cropOptions);

      const croppedImageDimensions = await getImageDimensions(croppedImage);
      expect(croppedImageDimensions).toMatchObject({
        width: expectedDimensions,
        height: expectedDimensions,
      });
    });

    it('should crop proper region of the image', async () => {
      const expectedDimensions = 1;
      const expectedColor = '#043404';
      const cropOptions = {
        top: expectedDimensions,
        height: expectedDimensions,
        width: expectedDimensions,
        left: expectedDimensions,
      } as Region;
      const image = await getTestImage();

      const croppedImage = imageService.crop(image, cropOptions);

      const colors = await getColors(
        await streamToBuffer(croppedImage),
        JPEG_MIME_TYPE,
      );
      expect(colors).toHaveLength(1);
      expect(colors[0].hex()).toBe(expectedColor);
    });
  });

  describe('#metadata', () => {
    it('should retrieve metadata of passed file', async () => {
      const image = await getTestImage();

      const metadata = await imageService.metadata(image);

      expect(metadata).toMatchObject({
        orientation: Orientation.Landscape,
        width: 200,
        height: 200,
        mimeType: JPEG_MIME_TYPE,
      });
    });
  });
});
