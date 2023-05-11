import {ST_PathFillMode} from '../Types';

export interface IPath {
  type: 'moveTo' | 'lnTo' | 'arcTo' | 'cubicBezTo' | 'quadBezTo' | 'close';
}

export interface PathPoint {
  x: string;
  y: string;
}

export interface LnTo extends IPath {
  pt: PathPoint;
}

export interface MoveTo extends IPath {
  pt: PathPoint;
}

export interface ArcTo extends IPath {
  wR: string;
  hR: string;
  stAng: string;
  swAng: string;
}

export interface QuadBezTo extends IPath {
  pts: PathPoint[];
}

export interface CubicBezTo extends IPath {
  pts: PathPoint[];
}

export interface Close extends IPath {}

export type ShapeDefine =
  | MoveTo
  | LnTo
  | ArcTo
  | QuadBezTo
  | CubicBezTo
  | Close;

export interface Path {
  h?: number;
  w?: number;
  fill?: ST_PathFillMode;
  extrusionOk?: boolean;
  stroke?: boolean;
  defines: ShapeDefine[];
}
