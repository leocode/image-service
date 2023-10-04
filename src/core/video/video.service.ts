import type {Readable, Stream} from 'stream';
import ffmpegBinary from '@ffmpeg-installer/ffmpeg';
import ffprobeBinary from '@ffprobe-installer/ffprobe';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import tmp from 'tmp';
import util from 'util';
import type {ExecFileException} from 'child_process';
import {execFile} from 'child_process';
import exiftool from '@mcmics/dist-exiftool';
import Boom from 'boom';
import type {VideoMetadata} from './video.types';
import {Orientation} from '../common/common.types';
import {VideoErrors} from './video.errors';
import type {BaseFileInfo} from '../common/schemas';
import path from 'path';

const createTempFilename = util.promisify(tmp.tmpName);

const THUMBNAIL_EXTENSION = 'png';
const THUMBNAIL_MIME_TYPE = 'image/png';

type StreamResizeOptions = {
    codecName: string;
} & VideoResizeOptions;

type VideoResizeOptions = {
    height: number;
    width: number;
}

enum VideoFormat {
    MP4 = 'mp4',
    MKV = 'mkv',
}

export class VideoService {
  constructor() {
    ffmpeg.setFfmpegPath(ffmpegBinary.path);
    ffmpeg.setFfprobePath(ffprobeBinary.path);
  }

  public resizeStream(file: Readable, options: StreamResizeOptions): Stream {
    return ffmpeg()
      .input(file)
      .size(`${options.height}x${options.width}`)
      .format(options.codecName)
      .pipe();
  }

  public async resizeFile(
    filePath: string,
    options: VideoResizeOptions,
  ): Promise<Stream> {
    const {ext} = path.parse(filePath);
    const format = ext.substring(1);

    if (format === VideoFormat.MP4) {
      return ffmpeg()
        .input(filePath)
        .size(`${options.height}x${options.width}`)
        .toFormat(format)
      // https://github.com/fluent-ffmpeg/node-fluent-ffmpeg/issues/932
        .outputOptions('-movflags frag_keyframe+empty_moov')
        .pipe();
    }

    if (format === VideoFormat.MKV) {
      return ffmpeg()
        .input(filePath)
        .toFormat('matroska')
        .size(`${options.height}x${options.width}`)
        .pipe();
    }

    return ffmpeg()
      .input(filePath)
      .size(`${options.height}x${options.width}`)
      .pipe();
  }

  public async metadata(file: Readable): Promise<VideoMetadata> {
    return await new Promise((resolve, reject) => {
      const extractMetadataFromExifTool: (
                error: ExecFileException | null,
                stdout: string,
                stderr: string
            ) => void = (error, stdout) => {
              file.emit('close');
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
        ['-json', '-n', '-'],
        extractMetadataFromExifTool,
      );

      if (!exifToolProcess.stdin) {
        throw Boom.badImplementation(
          VideoErrors.CannotRunVideoProcessingService,
        );
      }

      file.pipe(exifToolProcess.stdin).on('error', (e) => {
        // Exif tool seems to close the stream as soon as it reads the data.
        // https://stackoverflow.com/questions/51839293/epipe-error-in-node-js
      });

    });
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
          resolve({file: fs.createReadStream(tempFileName), fileInfo});
        })
        .run();
    });
  }
}
