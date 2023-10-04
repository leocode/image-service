import type { AdapterInterface } from './adapter.interface';

export const requestReplyAdapter: AdapterInterface = {
  handleFile: async (command) => ({file: command.file, info: command.info}),
};
