import type { AdapterInterface } from './adapter.interface';

export const requestReplyAdapter: AdapterInterface = {
  handleFile: async (command) => {
    const info: any = {
      fileName: command.fileName,
    };
    if ('*/*' !== command.mimeType) {
      info.contentType = command.mimeType;
    }
    return {
      file: command.file,
      info,
    };
  },
};
