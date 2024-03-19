/**
 * 处理选区相关的工具函数
 */

import {ViewRange} from '../../../sheet/ViewRange';
import {RangeRef} from '../../../types/RangeRef';
import {decodeAddress} from './decodeAddress';
import {numberToLetters} from './numberToLetters';

/**
 * 解析选区字符串，比如 A1:B2
 */
export function parseRange(range: string): RangeRef {
  if (range.indexOf(':') !== -1) {
    const parts = range.split(':');
    if (parts.length !== 2) {
      throw new Error('range 格式错误');
    }
    const [start, end] = parts;
    const startRange = decodeAddress(start);
    const endRange = decodeAddress(end);
    return {
      startRow: startRange.row,
      startCol: startRange.col,
      endRow: endRange.row,
      endCol: endRange.col
    };
  } else {
    const startRange = decodeAddress(range);
    return {
      startRow: startRange.row,
      startCol: startRange.col,
      endRow: startRange.row,
      endCol: startRange.col
    };
  }
}

/**
 * 将 RangeRef 转换为字符串
 */
export function rangeRefToString(rangeRef: RangeRef) {
  return (
    numberToLetters(rangeRef.startCol) +
    (rangeRef.startRow + 1) +
    ':' +
    numberToLetters(rangeRef.endCol) +
    (rangeRef.endRow + 1)
  );
}

/**
 * 扩展选区，取这两个选区合并后最大值
 * @param range1
 * @param range2
 * @returns
 */
export function mergeRange(range1: RangeRef, range2: RangeRef) {
  return {
    startRow: Math.min(range1.startRow, range2.startRow),
    startCol: Math.min(range1.startCol, range2.startCol),
    endRow: Math.max(range1.endRow, range2.endRow),
    endCol: Math.max(range1.endCol, range2.endCol)
  };
}

/**
 * 判断一个选区是否在另一个选区内
 * @param 主选区
 * @param 被包含的选区
 */
export function inRange(range: RangeRef, otherRange: RangeRef) {
  return (
    range.startRow <= otherRange.startRow &&
    range.startCol <= otherRange.startCol &&
    range.endRow >= otherRange.endRow &&
    range.endCol >= otherRange.endCol
  );
}

/**
 * 判断两个选区是否相等
 * @param range1
 * @param range2
 */
export function rangeEqual(range1: RangeRef, range2: RangeRef) {
  return (
    range1.startRow === range2.startRow &&
    range1.startCol === range2.startCol &&
    range1.endRow === range2.endRow &&
    range1.endCol === range2.endCol
  );
}

/**
 * 判断两个选区是否相交
 */
export function rangeIntersect(range1: RangeRef, range2: RangeRef) {
  return (
    range1.startRow <= range2.endRow &&
    range1.endRow >= range2.startRow &&
    range1.startCol <= range2.endCol &&
    range1.endCol >= range2.startCol
  );
}

/**
 * 这个单元格是否是个合并单元格
 * @param range
 * @param mergeCells
 * @returns
 */
export function isMergeCell(range: RangeRef, mergeCells: RangeRef[]) {
  return mergeCells.some(mergeCell => rangeEqual(mergeCell, range));
}

/**
 * 是否是单个单元格
 * @param range
 */
export function isSingleCell(range: RangeRef) {
  return range.startRow === range.endRow && range.startCol === range.endCol;
}

/**
 * 判断单元格是否在选区内
 */
export function isCellInRange(range: RangeRef, row: number, col: number) {
  return (
    range.startRow <= row &&
    range.startCol <= col &&
    range.endRow >= row &&
    range.endCol >= col
  );
}

/**
 * 基于 viewRange 构建出 RangeRef
 */
export function viewRangeToRangeRef(viewRange: ViewRange) {
  const rows = viewRange.rows;
  const cols = viewRange.cols;

  return {
    startRow: rows[0],
    startCol: cols[0],
    endRow: rows[rows.length - 1],
    endCol: cols[cols.length - 1]
  };
}
