import type { Stream } from 'stream';

export const enum FileTypeEnum {
  image = 'image',
  video = 'video',
}

export const AdapterEnum = {
  requestReply: 'request-reply',
} as const;

export const ADAPTERS = Object.values(AdapterEnum);

export type AdapterType = typeof AdapterEnum[keyof typeof AdapterEnum]

export type BasicAdapterCommand<T> = {
  file: Stream,
  fileType: FileTypeEnum,
  requestBody?: T, // Request body - important it the future to process extra parameters (e.g in S3 integration)
};

export type AdapterResult = {
  info?: any,
  file?: Stream,
};
