import {ViewRange} from '../../../sheet/ViewRange';
import {getFrozenRange} from './getFrozenRange';

/**
 * 获取左上角冻结区域的访问
 */

export function getFrozenTopLeftViewPointRange(
  xSplit: number,
  ySplit: number,
  leftShift: number,
  topShift: number,
  getRowHeight: (index: number) => number,
  getColWidth: (index: number) => number
): ViewRange {
  const {
    indexes: rows,
    startOffset: startRowOffset,
    sizes: rowSizes,
    length: height
  } = getFrozenRange(ySplit, topShift, getRowHeight);

  const {
    indexes: cols,
    startOffset: startColOffset,
    sizes: colSizes,
    length: width
  } = getFrozenRange(xSplit, leftShift, getColWidth);

  return {
    region: 'top-left-frozen',
    rows,
    rowSizes,
    height,
    startRowOffset,
    cols,
    colSizes,
    width,
    startColOffset
  };
}
