import {RangeRef} from '../../types/RangeRef';

/**
 * 将单元格转成合并单元格
 * @param row
 * @param col
 * @param mergeCells
 */
export function cellToMergeCell(
  row: number,
  col: number,
  mergeCells: RangeRef[]
): RangeRef {
  for (const mergeCell of mergeCells) {
    const {startRow, endRow, startCol, endCol} = mergeCell;
    if (row >= startRow && row <= endRow && col >= startCol && col <= endCol) {
      return {
        ...mergeCell
      };
    }
  }

  return {
    startRow: row,
    startCol: col,
    endRow: row,
    endCol: col
  };
}
