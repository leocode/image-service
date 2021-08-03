import type { ResizeOptions } from 'sharp';
import type { Readable } from 'stream';
import ffmpegBinary from '@ffmpeg-installer/ffmpeg';
import type { FfprobeData } from 'fluent-ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';

export class VideoService {
  constructor() {
    ffmpeg.setFfmpegPath(ffmpegBinary.path);
  }

  public resize(file: Readable, options: ResizeOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      ffmpeg()
        .input(file)
        .on('end', () => {
          resolve(fs.promises.readFile('test.mp4'));
        })
        .on('error', (err) => {
          console.log('an error happened: ' + err.message);
          reject(err);
        })
        .size(`${options.height}x${options.width}`)
        .format('mp4')
        // TODO: Pass stream to fastify response somehow, do not create files
        .saveToFile('test.mp4');

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
