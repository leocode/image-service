import type { Stream } from 'stream';
import { requestReplyAdapter } from './requestReply.adapter';

export const AdapterEnum = {
  'request-reply': requestReplyAdapter,
} as const;

export const ADAPTERS = Object.keys(AdapterEnum);

export type AdapterType = keyof typeof AdapterEnum

export type Adapter = {
  handleFile: (file: Stream) => unknown;
};
