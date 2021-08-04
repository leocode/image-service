import type { ResizeOptions } from 'sharp';
import type { Readable } from 'stream';
import ffmpegBinary from '@ffmpeg-installer/ffmpeg';
import type { FfprobeData } from 'fluent-ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
import { Writable } from 'stream';

export class VideoService {
  constructor() {
    ffmpeg.setFfmpegPath(ffmpegBinary.path);
  }

  public resize(file: Readable, options: ResizeOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      ffmpeg()
        .input(file)
        .on('end', () => {
          resolve(true);
        })
        .on('error', (err) => {
          reject(err);
        })
        .size(`${options.height}x${options.width}`)
        .format('h264')
        .pipe(undefined, {end: true});
    });
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
