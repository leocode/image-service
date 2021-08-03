import type { Metadata, Region, ResizeOptions } from 'sharp';
import sharp from 'sharp';
import type { Readable, Stream } from 'stream';

export class ImageService {
  public resize(file: Readable, options: ResizeOptions): Stream {
    return file.pipe(sharp().resize(options));
  }

  public crop(file: Readable, region: Region): Stream {
    return file.pipe(sharp().extract(region));
  }

  public metadata(file: Readable): Promise<Metadata> {
    return new Promise((resolve, reject) => {
      file.pipe(
        sharp().metadata((err, metadata) => {
          if (err) {
            reject(err);
          }
          resolve(metadata);
        }),
      );
    });
  }
}
