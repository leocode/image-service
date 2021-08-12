import type { Orientation } from '../common/common.types';

export type ImageMetadata = {
  width: number;
  height: number;
  orientation: Orientation;
  mimeType: string;
};
