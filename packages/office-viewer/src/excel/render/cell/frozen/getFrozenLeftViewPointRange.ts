import {ViewRange} from '../../../sheet/ViewRange';
import {IndexInfo, getRange} from '../../../sheet/getViewRange';
import {getFrozenRange} from './getFrozenRange';

/**
 * 获取左边冻结的范围
 * @param xSplit
 * @param height
 * @param scrollTop
 * @param getRowHeight
 * @param getColWidth
 * @param rowPositionCache
 * @param rowHiddenRange
 * @returns
 */

export function getFrozenLeftViewPointRange(
  xSplit: number,
  height: number,
  scrollTop: number,
  leftShift: number,
  topShift: number,
  getRowHeight: (index: number) => number,
  getColWidth: (index: number) => number,
  rowPositionCache: IndexInfo[] = []
): ViewRange {
  const {
    indexes: rows,
    startOffset: startRowOffset,
    sizes: rowSizes
  } = getRange(scrollTop, topShift, height, getRowHeight, [], rowPositionCache);
  const {
    indexes: cols,
    startOffset: startColOffset,
    sizes: colSizes,
    length: width
  } = getFrozenRange(xSplit, leftShift, getColWidth);
  return {
    region: 'left-frozen',
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
