import {CSSStyle} from '../../Style';
import {Paragraph} from '../Paragraph';
import {Table} from '../Table';
import {ST_Merge} from '../../Types';

export interface TcPr {
  cssStyle?: CSSStyle;

  // 如果为 true 的话就不自动加空格
  hideMark?: boolean;

  vMerge?: ST_Merge;

  gridSpan?: number;

  rowSpan?: number;

  /**
   * 内部 border，需要作用于非第一列的单元格
   */
  insideBorder?: {
    H?: string;
    V?: string;
  };
}

type TcChild = Paragraph | Table;

export class Tc {
  properties: TcPr = {};
  children: TcChild[] = [];

  add(child: TcChild) {
    if (child) {
      this.children.push(child);
    }
  }
}
