import type { Adapter } from './adapter.types';

// Dummy implementation. TODO: https://github.com/leocode/image-service/issues/4
export const requestReplyAdapter: Adapter = {
  handleFile: (fileStream) => fileStream,
};
