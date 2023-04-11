/**
 * Shape 相关的定义
 */

import {Path} from './Path';

export interface ShapeGuide {
  // 名称
  n: string;
  // 公式
  f: string;
}

// http://webapp.docx4java.org/OnlineDemo/ecma376/DrawingML/rect.html
export interface Rect {
  b: string;
  l: string;
  r: string;
  t: string;
}

export interface Shape {
  avLst?: ShapeGuide[];
  gdLst?: ShapeGuide[];

  rect?: Rect;

  pathLst?: Path[];
}
