import {
  CT_Border,
  CT_CellAlignment,
  CT_Fill,
  CT_Font
} from '../../openxml/ExcelTypes';
import {CellData} from './worksheet/CellData';
import {DataBarDisplay} from './DataBarDisplay';
import {IconNames} from '../io/excel/preset/presetIcons';

/**
 * 单元格信息，主要是用于展现
 */

export interface CellInfo {
  /**
   * 行号
   */
  row: number;

  /**
   * 列号
   */
  col: number;

  /**
   * 字体
   */
  font: CT_Font;

  /**
   * 背景色
   */
  fill?: CT_Fill;

  /**
   * 边框
   */
  border?: CT_Border;

  /**
   * 最终展现的文本
   */
  text: string;

  /**
   * 文本对齐方式
   */
  alignment?: CT_CellAlignment;

  /**
   * dataBar 展现配置
   */
  dataBarDisplay?: DataBarDisplay;

  /**
   * 图标，用于 iconSet
   */
  icon?: IconNames;

  /**
   * 原始值，可能是空字符串
   */
  value: string;

  /**
   * 原始数据
   */
  cellData: CellData;

  /**
   * 是否需要裁剪，这个用来支持自动裁剪，参考 autoClip.ts
   */
  needClip?: boolean;
}
