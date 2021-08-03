import type { Stream } from 'stream';

export const ADAPTERS = {
  requestReply: 'request-reply',
} as const;

export type AdapterType = typeof ADAPTERS[keyof typeof ADAPTERS]

export type Adapter = {
  handleFile: (file: Stream) => unknown;
};
