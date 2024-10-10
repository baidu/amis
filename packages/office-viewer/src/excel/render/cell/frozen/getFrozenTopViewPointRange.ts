import {ViewRange} from '../../../sheet/ViewRange';
import {HiddenRange, IndexInfo, getRange} from '../../../sheet/getViewRange';

import {getFrozenRange} from './getFrozenRange';

/**
 * 获取顶部冻结的范围
 * @param ySplit
 * @param width
 * @param scrollLeft
 * @param getRowHeight
 * @param getColWidth
 * @param colPositionCache
 * @param colHiddenRange
 * @returns
 */

export function getFrozenTopViewPointRange(
  ySplit: number,
  width: number,
  scrollLeft: number,
  leftShift: number,
  topShift: number,
  getRowHeight: (index: number) => number,
  getColWidth: (index: number) => number,
  colPositionCache: IndexInfo[] = [],
  colHiddenRange: HiddenRange[] = []
): ViewRange {
  const {
    indexes: cols,
    startOffset: startColOffset,
    sizes: colSizes
  } = getRange(
    scrollLeft,
    leftShift,
    width,
    getColWidth,
    colHiddenRange,
    colPositionCache
  );

  const {
    indexes: rows,
    startOffset: startRowOffset,
    sizes: rowSizes,
    length: height
  } = getFrozenRange(ySplit, topShift, getRowHeight);

  return {
    region: 'top-frozen',
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
