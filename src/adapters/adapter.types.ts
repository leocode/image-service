import type { Stream } from 'stream';

export const AdapterEnum = {
  requestReply: 'request-reply',
} as const;

export const ADAPTERS = Object.values(AdapterEnum);

export type AdapterType = typeof AdapterEnum[keyof typeof AdapterEnum]

export type BasicAdapterCommand<T> = {
  file: Stream,
  fileType: 'image' | 'video', // Info if processed media file is image or video
  requestBody?: T, // Request body - important it the future to process extra parameters (e.g in S3 integration)
};

export type AdapterResult = {
  info?: any,
  file?: Stream,
};
