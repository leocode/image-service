import type { Stream } from 'stream';
import { requestReplyAdapter } from './requestReply.adapter';

export const enum FileTypeEnum {
  image = 'image',
  video = 'video',
}

export enum AdapterEnum {
  'RequestReply' = 'request-reply',
}

export const AdapterMap = {
  [AdapterEnum.RequestReply]: requestReplyAdapter,
} as const;

export const ADAPTERS = Object.values(AdapterEnum);

export type BasicAdapterCommand<T> = {
  file: Stream,
  fileType: FileTypeEnum,
  mimeType: string,
  fileName: string,
  requestBody?: T, // Request body - important it the future to process extra parameters (e.g in S3 integration)
};

export type AdapterResult = {
  info?: any,
  file?: Stream,
};
