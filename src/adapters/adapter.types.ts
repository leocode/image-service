import type { Stream } from 'stream';

export const ADAPTERS = ['default', 'foo'] as const;

export type Adapter = {
  handleFile: (file: Stream) => unknown;
};
