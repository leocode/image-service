import type { ResizeOptions } from 'sharp';
import type { Readable, Stream } from 'stream';
import ffmpegBinary from '@ffmpeg-installer/ffmpeg';
import ffprobeBinary from '@ffprobe-installer/ffprobe';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import tmp from 'tmp';
import util from 'util';
import type { ExecFileException } from 'child_process';
import { execFile } from 'child_process';
import exiftool from '@mcmics/dist-exiftool';
import Boom from 'boom';
import { ImageErrors } from '../image/image.errors';
import type { VideoMetadata } from './video.types';

const createTempFilename = util.promisify(tmp.tmpName);

type VideoResizeOptions = {
  codecName: string;
} & ResizeOptions;

export class VideoService {
  constructor() {
    ffmpeg.setFfmpegPath(ffmpegBinary.path);
    ffmpeg.setFfprobePath(ffprobeBinary.path);
  }

  public resize(file: Readable, options: VideoResizeOptions): Stream {
    return ffmpeg()
      .input(file)
      .size(`${options.height}x${options.width}`)
      .format(options.codecName)
      .pipe();
  }

  public async metadata(file: Readable): Promise<VideoMetadata> {
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
          duration: metadata.Duration,
          orientation: height > width ? 'portrait' : 'landscape',
          mimeType: metadata.MIMEType,
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
