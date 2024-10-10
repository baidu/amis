import {Sheet} from '../../sheet/Sheet';
import {ViewRange} from '../../sheet/ViewRange';
import {Rect} from '../Rect';

/**
 * 在 viewRange 中找到 row 和 col 的位置
 */

export function findPositionInViewRange(
  currentSheet: Sheet,
  row: number,
  col: number,
  viewRange: ViewRange
): Rect {
  const rowIndex = viewRange.rows.indexOf(row);
  const colIndex = viewRange.cols.indexOf(col);
  let rowSize;
  let colSize;
  if (rowIndex !== -1 && colIndex !== -1) {
    rowSize = viewRange.rowSizes[rowIndex];
    colSize = viewRange.colSizes[colIndex];
    return {
      x: colSize.offset,
      y: rowSize.offset,
      width: colSize.size,
      height: rowSize.size
    };
  }

  const cellPosition = currentSheet.getCellPosition(row, col);
  return {
    x: cellPosition.x,
    y: cellPosition.y,
    width: cellPosition.width,
    height: cellPosition.height
  };
}
