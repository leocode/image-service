import type { Region, ResizeOptions } from 'sharp';
import sharp from 'sharp';
import type { Readable, Stream } from 'stream';
import type { ExecFileException } from 'child_process';
import { execFile } from 'child_process';
import exiftool from '@mcmics/dist-exiftool';
import type { ImageMetadata } from './image.types';
import Boom from 'boom';
import { ImageErrors } from './image.errors';
import { Orientation } from '../common/common.types';

export class ImageService {
  public resize(file: Readable, options: ResizeOptions): Stream {
    return file.pipe(sharp().resize(options));
  }

  public crop(file: Readable, region: Region): Stream {
    return file.pipe(sharp().extract(region));
  }

  public metadata(file: Readable): Promise<ImageMetadata> {
    return new Promise((resolve, reject) => {
      const extractMetadataFromExifTool: (
        error: ExecFileException | null,
        stdout: string,
        stderr: string
      ) => void = (error, stdout, stderr) => {
        if (error) {
          reject(error);
        }
        const [metadata] = JSON.parse(stdout);

        const width = metadata.ImageWidth;
        const height = metadata.ImageHeight;
        resolve({
          width,
          height,
          mimeType: metadata.MIMEType,
          orientation:
            height > width ? Orientation.Portrait : Orientation.Landscape,
        });
      };

      const exifToolProcess = execFile(
        exiftool,
        ['-json', '-'],
        extractMetadataFromExifTool,
      );

      if (!exifToolProcess.stdin) {
        throw Boom.badImplementation(
          ImageErrors.CannotRunImageProcessingService,
        );
      }

      file.pipe(exifToolProcess.stdin);
    });
  }
}
