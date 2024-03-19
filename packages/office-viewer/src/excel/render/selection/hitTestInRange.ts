import {Region, ViewRange} from '../../sheet/ViewRange';
import {RangeRef} from '../../types/RangeRef';
import {MAX_COL, MAX_ROW} from '../Consts';
import {findCell} from './findCell';

import {findInViewRangeX} from './findInViewRangeX';
import {findInViewRangeY} from './findInViewRangeY';
import {HitTestResult} from './hitTest';

/**
 * 检查是否点中了左上角冻结区域
 */
export function hitTestInRange(
  region: Region,
  range: ViewRange | undefined | null,
  offsetX: number,
  offsetY: number,
  rowHeaderWidth: number,
  colHeaderHeight: number,
  gridLineHitRange: number,
  mergeCells: RangeRef[]
): HitTestResult | null {
  if (!range) {
    return null;
  }

  // 点击到顶部区域的表头
  if (
    offsetY < colHeaderHeight &&
    offsetX >= rowHeaderWidth &&
    offsetX < range.width
  ) {
    const {col, width, x, type} = findInViewRangeX(
      offsetX,
      range,
      gridLineHitRange,
      true
    );
    return {
      type,
      region,
      startRow: 0,
      startCol: col,
      endRow: MAX_ROW,
      endCol: col,
      x,
      y: 0,
      width,
      height: colHeaderHeight
    };
  }

  // 点击到左侧区域的表头
  if (
    offsetX < rowHeaderWidth &&
    offsetY >= colHeaderHeight &&
    offsetY < range.height
  ) {
    const {row, height, y, type} = findInViewRangeY(
      offsetY,
      range,
      gridLineHitRange,
      true
    );
    return {
      type,
      region,
      startRow: row,
      startCol: 0,
      endRow: row,
      endCol: MAX_COL,
      x: 0,
      y,
      width: rowHeaderWidth,
      height
    };
  }

  // 点击单元格
  if (offsetX < range.width && offsetY < range.height) {
    return findCell(
      region,
      offsetX,
      offsetY,
      gridLineHitRange,
      range,
      mergeCells
    );
  }

  return null;
}
