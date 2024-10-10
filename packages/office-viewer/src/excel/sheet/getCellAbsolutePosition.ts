import {IndexInfo} from './getViewRange';

function findSizeInCache(
  index: number,
  positionCache: IndexInfo[],
  getSize: (index: number) => number
) {
  if (positionCache[index] !== undefined) {
    return positionCache[index];
  } else {
    const lastIndex = Math.max(0, positionCache.length - 1);
    for (let i = lastIndex; i <= index; i++) {
      const size = getSize(i);
      if (i !== 0) {
        positionCache[i] = {
          offset: positionCache[i - 1].offset + positionCache[i - 1].size,
          size
        };
      } else {
        positionCache[i] = {
          offset: 0,
          size
        };
      }
    }
    return positionCache[index];
  }
}

/**
 *  获取单元格的绝对位置
 */
export function getCellAbsolutePosition(
  row: number,
  col: number,
  getRowHeight: (index: number) => number,
  rowPositionCache: IndexInfo[] = [],
  getColWidth: (index: number) => number,
  colPositionCache: IndexInfo[] = []
) {
  const rowPosition = findSizeInCache(row, rowPositionCache, getRowHeight);
  const colPosition = findSizeInCache(col, colPositionCache, getColWidth);

  return {
    x: colPosition.offset,
    y: rowPosition.offset,
    width: colPosition.size,
    height: rowPosition.size
  };
}
