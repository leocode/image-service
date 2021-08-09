import type { Stream } from 'stream';
import { requestReplyAdapter } from './requestReply.adapter';

export enum AdapterEnum {
  'RequestReply' = 'request-reply'
}

export const AdapterMap = {
  [AdapterEnum.RequestReply]: requestReplyAdapter,
} as const;

export const ADAPTERS = Object.values(AdapterEnum);

export type Adapter = {
  handleFile: (file: Stream) => unknown;
};
