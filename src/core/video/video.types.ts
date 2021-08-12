import type { Orientation } from '../common/common.types';

export type VideoMetadata = {
  width: number;
  height: number;
  duration: string;
  orientation: Orientation;
  mimeType: string;
};
