import type { ResizeOptions } from 'sharp';
import type { Readable, Stream } from 'stream';
import ffmpegBinary from '@ffmpeg-installer/ffmpeg';
import ffprobeBinary from '@ffprobe-installer/ffprobe';
import type { FfprobeData } from 'fluent-ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import tmp from 'tmp';
import util from 'util';
import type { ExecFileException } from 'child_process';
import { execFile } from 'child_process';
import exiftool from '@mcmics/dist-exiftool';
import Boom from 'boom';
import type { VideoMetadata } from './video.types';
import { Orientation } from '../common/common.types';
import { VideoErrors } from './video.errors';
import type { BaseFileInfo } from '../common/schemas';
import path from 'path';

const createTempFilename = util.promisify(tmp.tmpName);

type VideoResizeOptions = {
  codecName: string;
} & ResizeOptions;

const VIDEO_TYPE = 'video';
const THUMBNAIL_EXTENSION = 'png';
const THUMBNAIL_MIME_TYPE = 'image/png';

export class VideoService {
  constructor() {
    ffmpeg.setFfmpegPath(ffmpegBinary.path);
    ffmpeg.setFfprobePath(ffprobeBinary.path);
  }

  public resizeStream(file: Readable, options: VideoResizeOptions): Stream {
    return ffmpeg()
      .input(file)
      .size(`${options.height}x${options.width}`)
      .format(options.codecName)
      .pipe();
  }

  public async resizeFile(
    filePath: string,
    options: ResizeOptions,
  ): Promise<Stream> {
    const codecName = await this.getCodecName(fs.createReadStream(filePath));

    if (!codecName) {
      throw Boom.badRequest(VideoErrors.CannotResolveCodecName);
    }

    return ffmpeg(filePath)
      .size(`${options.height}x${options.width}`)
      .format(codecName)
      .pipe();
  }

  public async metadata(file: Readable): Promise<VideoMetadata> {
    return await new Promise((resolve, reject) => {
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
          orientation:
            height > width ? Orientation.Portrait : Orientation.Landscape,
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
          VideoErrors.CannotRunVideoProcessingService,
        );
      }

      file.pipe(exifToolProcess.stdin);
    });
  }

  private async getFfprobeData(file: Readable): Promise<FfprobeData> {
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

  private async getCodecName(file: Readable): Promise<string | undefined> {
    const metadata = await this.getFfprobeData(file);
    const videoStream = metadata.streams.find(
      (stream) => stream.codec_type === VIDEO_TYPE,
    );

    return videoStream?.codec_name;
  }

  public async thumbnail(
    file: Readable,
    options: { second: number, fileName: string },
  ): Promise<{ file: Stream, fileInfo: BaseFileInfo }> {
    const tempFileName = `${await createTempFilename()}.${THUMBNAIL_EXTENSION}`;
    const fileInfo = {
      fileName: `${path.basename(options.fileName, path.extname(options.fileName))}.${THUMBNAIL_EXTENSION}`,
      mimeType: THUMBNAIL_MIME_TYPE,
    };

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
          resolve({ file: fs.createReadStream(tempFileName), fileInfo });
        })
        .run();
    });
  }
}
