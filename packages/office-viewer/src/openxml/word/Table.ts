/**
 * http://officeopenxml.com/WPtable.php
 */

import {parseSize} from '../../word/parse/parseSize';
import Word from '../../Word';
import {CSSStyle} from '../Style';

import {Properties} from './properties/Properties';
import type {Tr} from './table/Tr';
import {parseTablePr} from '../../word/parse/parseTablePr';
import {Tc} from './table/Tc';
import {parseTr} from '../../word/parse/parseTr';

export type TblLookKey =
  | 'firstRow'
  | 'firstRow'
  | 'lastRow'
  | 'firstColumn'
  | 'lastColumn'
  | 'noHBand'
  | 'noVBand';

export interface TablePr extends Properties {
  /**
   * 表格标题
   */
  tblCaption?: string;

  /**
   * 单元格样式
   */
  tcCSSStyle?: CSSStyle;

  /**
   * 内部 border，需要作用于非第一列的单元格
   */
  insideBorder?: {
    H?: string;
    V?: string;
  };

  /**
   * 条件格式
   */
  tblLook?: Record<TblLookKey, boolean>;

  /**
   * 行间隔
   */
  rowBandSize?: number;

  /**
   * 列间隔
   */
  colBandSize?: number;
}

export interface GridCol {
  w: string;
}

export class Table {
  properties: TablePr = {};
  tblGrid: GridCol[] = [];
  trs: Tr[] = [];
}
