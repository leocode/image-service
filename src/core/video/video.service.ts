import type { ResizeOptions } from 'sharp';
import type { Readable, Stream } from 'stream';
import ffmpegBinary from '@ffmpeg-installer/ffmpeg';
import type { FfprobeData } from 'fluent-ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import tmp from 'tmp';
import util from 'util';

const createTempFilename = util.promisify(tmp.tmpName);

type VideoResizeOptions = {
  codecName: string;
} & ResizeOptions

export class VideoService {
  constructor() {
    ffmpeg.setFfmpegPath(ffmpegBinary.path);
  }

  public resize(file: Readable, options: VideoResizeOptions): Stream {
    return ffmpeg()
      .input(file)
      .size(`${options.height}x${options.width}`)
      .format(options.codecName)
      .pipe();
  }

  public metadata(file: Readable): Promise<FfprobeData> {
    return new Promise((resolve, reject) => {
      ffmpeg().input(file).ffprobe((err, data) => {
        if (err) {
          reject(err);
        }

        resolve(data);
      });
    });
  }

  public async thumbnail(file: Readable, options: { second: number }): Promise<Stream> {
    const tempFileName = `${await createTempFilename()}.png`;

    return new Promise((resolve, reject) => {
      ffmpeg()
        .input(file).outputOption('-frames:v 1')
        .output(tempFileName)
        .seek(options.second)
        .on('error', (err) => {
          reject(err);
        })
        .on('end', () => {
          resolve(fs.createReadStream(tempFileName));
        })
        .run();
    });
  }
}
