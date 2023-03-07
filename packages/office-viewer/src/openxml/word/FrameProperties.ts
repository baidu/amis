import {HeightRule} from './type/HeightRule';

export enum DropCapType {
  NONE = 'none',
  DROP = 'drop',
  MARGIN = 'margin'
}

export enum FrameAnchorType {
  MARGIN = 'margin',
  PAGE = 'page',
  TEXT = 'text'
}

export enum FrameWrap {
  AROUND = 'around',
  AUTO = 'auto',
  NONE = 'none',
  NOT_BESIDE = 'notBeside',
  THROUGH = 'through',
  TIGHT = 'tight'
}

export interface FrameProperties {
  readonly anchorLock?: boolean;
  readonly dropCap?: DropCapType;
  readonly width: number;
  readonly height: number;
  readonly wrap?: FrameWrap;
  readonly lines?: number;
  readonly anchor: {
    readonly horizontal: FrameAnchorType;
    readonly vertical: FrameAnchorType;
  };
  readonly space?: {
    readonly horizontal: number;
    readonly vertical: number;
  };
  readonly rule?: HeightRule;
}
