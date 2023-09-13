import {
  ST_DropCap,
  ST_HAnchor,
  ST_HeightRule,
  ST_VAnchor,
  ST_Wrap
} from '../Types';

export interface FramePr {
  readonly anchorLock?: boolean;
  readonly dropCap?: ST_DropCap;
  readonly width: number;
  readonly height: number;
  readonly wrap?: ST_Wrap;
  readonly lines?: number;
  readonly anchor: {
    readonly horizontal: ST_HAnchor;
    readonly vertical: ST_VAnchor;
  };
  readonly space?: {
    readonly horizontal: number;
    readonly vertical: number;
  };
  readonly rule?: ST_HeightRule;
}
