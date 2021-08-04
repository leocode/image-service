import type { ResizeOptions } from 'sharp';
import type { Readable, Writable } from 'stream';
import ffmpegBinary from '@ffmpeg-installer/ffmpeg';
import type { FfprobeData } from 'fluent-ffmpeg';
import ffmpeg from 'fluent-ffmpeg';

type VideoResizeOptions = {
  codecName: string;
} & ResizeOptions

export class VideoService {
  constructor() {
    ffmpeg.setFfmpegPath(ffmpegBinary.path);
  }

  public resize(file: Readable, options: VideoResizeOptions): Writable {
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
}
