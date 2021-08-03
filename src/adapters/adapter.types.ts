import type { Stream } from 'stream';

export const AdapterEnum = {
  requestReply: 'request-reply',
} as const;

export const ADAPTERS = Object.values(AdapterEnum);

export type AdapterType = typeof AdapterEnum[keyof typeof AdapterEnum]

export type Adapter = {
  handleFile: (file: Stream) => unknown;
};
