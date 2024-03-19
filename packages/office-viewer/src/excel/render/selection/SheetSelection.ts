import {Region} from '../../sheet/ViewRange';
import {RangeRef} from '../../types/RangeRef';
import {HitTestResult} from './hitTest';

/**
 * 选区定义，叫 SheetSelection 主要是为了避免和浏览器的 Selection 混淆
 */
export type SheetSelection = {
  selectType: HitTestResult['type'];

  /**
   * 选区所在的 sheet 的区域信息
   */
  region: Region;

  /**
   * 用户名
   */
  user: string;

  /**
   * 当前选区所在的 sheet 索引
   */
  sheetIndex: number;

  /**
   * 激活的单元格
   */
  activeCell: RangeRef;

  /**
   * 选区，对应 sqref 属性
   */
  cellRanges: RangeRef[];
};
