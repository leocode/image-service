import type { AdapterInterface } from './adapter.interface';

export const requestReplyAdapter: AdapterInterface = {
  handleFile: async (command) => {
    return { file: command.file };
  },
};
