/**
 * 获取单元格的位置信息
 */

import {binarySearch} from '../../../util/binarySearch';

import {Position} from './Position';
import {Sheet} from '../../sheet/Sheet';
import {Region, ViewRange} from '../../sheet/ViewRange';

/**
 * 在 viewRange 内查找到 col 的位置
 */
function findColInViewRange(col: number, viewRange: ViewRange | null) {
  if (!viewRange) {
    return null;
  }

  let colIndex = binarySearch(viewRange.cols, col);

  if (colIndex !== -1) {
    return {
      x: viewRange.colSizes[colIndex].offset,
      width: viewRange.colSizes[colIndex].size
    };
  }

  return null;
}

/**
 * 在 viewRange 内查找到 row 的位置
 */
function findRowInViewRange(row: number, viewRange: ViewRange | null) {
  if (!viewRange) {
    return null;
  }
  let rowIndex = binarySearch(viewRange.rows, row);

  if (rowIndex !== -1) {
    return {
      y: viewRange.rowSizes[rowIndex].offset,
      height: viewRange.rowSizes[rowIndex].size
    };
  }

  return null;
}

/**
 * 获取单元格的行位置
 */
export function getCellRowPosition(sheet: Sheet, region: Region, row: number) {
  const viewRange = sheet.getViewRange();
  const frozenViewRange = sheet.getFrozenViewRange();
  if (region === 'normal' && viewRange) {
    return findRowInViewRange(row, viewRange);
  }

  if (region === 'top-left-frozen' && frozenViewRange) {
    return findRowInViewRange(row, frozenViewRange.topLeftViewRange);
  }

  if (region === 'left-frozen' && frozenViewRange) {
    return findRowInViewRange(row, frozenViewRange.leftViewRange);
  }

  if (region === 'top-frozen' && frozenViewRange) {
    return findRowInViewRange(row, frozenViewRange.topViewRange);
  }

  return null;
}

/**
 * 获取单元格的列位置
 */
export function getCellColPosition(sheet: Sheet, region: Region, col: number) {
  const viewRange = sheet.getViewRange();
  const frozenViewRange = sheet.getFrozenViewRange();

  if (region === 'normal' && viewRange) {
    return findColInViewRange(col, viewRange);
  }
  if (region === 'top-left-frozen' && frozenViewRange) {
    return findColInViewRange(col, frozenViewRange.topLeftViewRange);
  }

  if (region === 'left-frozen' && frozenViewRange) {
    return findColInViewRange(col, frozenViewRange.leftViewRange);
  }

  if (region === 'top-frozen' && frozenViewRange) {
    return findColInViewRange(col, frozenViewRange.topViewRange);
  }

  return null;
}

/**
 * 获取某个单元格的位置信息
 * @param sheet 工作表
 * @param region 区域
 * @param col 行
 * @param row 列
 * @returns
 */
export function getCellPosition(
  sheet: Sheet,
  region: Region,
  col: number,
  row: number
): Position | null {
  const colPosition = getCellColPosition(sheet, region, col);
  const rowPosition = getCellRowPosition(sheet, region, row);

  if (colPosition && rowPosition) {
    return {
      x: colPosition.x,
      y: rowPosition.y,
      width: colPosition.width,
      height: rowPosition.height
    };
  }

  return null;
}

/**
 * 获取某个单元格的位置信息，但考虑了合并单元格的情况
 * @param workbook 工作簿
 * @param region 区域
 * @param col 行
 * @param row 列
 * @returns
 */
export function getCellPositionWithMerge(
  sheet: Sheet,
  region: Region,
  col: number,
  row: number
) {
  const colPosition = getCellColPosition(sheet, region, col);
  const rowPosition = getCellRowPosition(sheet, region, row);

  const mergeCells = sheet.getMergeCells();

  if (colPosition && rowPosition) {
    for (const mergeCell of mergeCells) {
      const {startRow, endRow, startCol, endCol} = mergeCell;
      if (
        row >= startRow &&
        row <= endRow &&
        col >= startCol &&
        col <= endCol
      ) {
        for (let i = startRow; i <= endRow; i++) {
          if (i !== row) {
            rowPosition.height += sheet.getRowHeight(i);
          }
        }
        for (let i = startCol; i <= endCol; i++) {
          if (i !== col) {
            colPosition.width += sheet.getColWidth(i);
          }
        }
      }
    }
    return {
      x: colPosition.x,
      y: rowPosition.y,
      width: colPosition.width,
      height: rowPosition.height
    };
  }

  return null;
}
