import type { AdapterResult, BasicAdapterCommand } from './adapter.types';

export interface AdapterInterface {
  handleFile(command: BasicAdapterCommand<any>): Promise<AdapterResult>
}
