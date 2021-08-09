import type { ResizeOptions } from 'sharp';
import type { Readable, Stream } from 'stream';
import { PassThrough } from 'stream';
import ffmpegBinary from '@ffmpeg-installer/ffmpeg';
import type { FfprobeData } from 'fluent-ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import tmp from 'tmp';
import util from 'util';
import Boom from 'boom';
import { VideoErrors } from './video.errors';

const createTempFilename = util.promisify(tmp.tmpName);

export class VideoService {
  constructor() {
    ffmpeg.setFfmpegPath(ffmpegBinary.path);
  }

  public async resize(file: Readable, options: ResizeOptions): Promise<Stream> {
    const codecStream = new PassThrough();
    const resizeStream = new PassThrough();

    file.pipe(codecStream);
    file.pipe(resizeStream);
    const codecName = await this.getCodecName(codecStream);

    if (!codecName) {
      throw Boom.badData(VideoErrors.CannotResolveVideoCodec);
    }

    return ffmpeg()
      .input(resizeStream)
      .size(`${options.height}x${options.width}`)
      .format(codecName)
      .pipe();
  }

  public async metadata(file: Readable): Promise<FfprobeData> {
    return await new Promise((resolve, reject) => {
      ffmpeg()
        .input(file)
        .ffprobe((err, data) => {
          if (err) {
            reject(err);
          }

          resolve(data);
        });
    });
  }

  public async getCodecName(file: Readable): Promise<string | undefined> {
    const metadata = await this.metadata(file);
    const videoStream = metadata.streams.find(
      (stream) => stream.codec_type === 'video',
    );

    return videoStream?.codec_name;
  }

  public async thumbnail(
    file: Readable,
    options: { second: number },
  ): Promise<Stream> {
    const tempFileName = `${await createTempFilename()}.png`;

    return await new Promise((resolve, reject) => {
      ffmpeg()
        .input(file)
        .outputOption('-frames:v 1')
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
