import type { Stream } from 'stream';
import { requestReplyAdapter } from './requestReply.adapter';

export const enum FileTypeEnum {
  Image = 'Image',
  Video = 'Video',
}

export enum AdapterEnum {
  RequestReply = 'request-reply',
}

export const AdapterMap = {
  [AdapterEnum.RequestReply]: requestReplyAdapter,
} as const;

export const AVAILABLE_ADAPTERS = Object.values(AdapterEnum);

export type BasicAdapterCommand<T> = {
  file: Stream,
  info?: any,
  fileType: FileTypeEnum,
  requestBody?: T, // Request body - important it the future to process extra parameters (e.g in S3 integration)
};

export type AdapterResult = {
  info?: any,
  file?: Stream,
};
