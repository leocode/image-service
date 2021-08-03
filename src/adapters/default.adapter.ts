import type { Adapter } from './adapter.types';

export const defaultAdapter: Adapter = {
  handleFile: (fileStream) => fileStream,
};
