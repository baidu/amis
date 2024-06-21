import {RangeRef} from '../types/RangeRef';
import {CellData, hasValue} from '../types/worksheet/CellData';
import {DisplayData} from './Sheet';
import {ViewRange} from './ViewRange';

/**
 * 计算单元格的高宽，主要是得考虑合并单元格的情况
 * @param row
 * @param col
 * @param rowHeight
 * @param colWidth
 * @param mergeCells
 * @returns
 */
export function calcCellDisplaySize(
  row: number,
  col: number,
  rowHeight: number,
  colWidth: number,
  getRowHeight: (row: number) => number,
  getColWidth: (row: number) => number,
  mergeCells: RangeRef[]
) {
  let displayWidth = colWidth;
  let displayHeight = rowHeight;
  let isMergeCell = false;
  let matchMergeCell: RangeRef | undefined = undefined;
  // 用于标识是哪个合并单元格
  let mergeCellId = '';
  for (const mergeCell of mergeCells) {
    const {startRow, endRow, startCol, endCol} = mergeCell;

    if (row >= startRow && row <= endRow && col >= startCol && col <= endCol) {
      mergeCellId = `${startRow}-${endRow}-${startCol}-${endCol}`;
      isMergeCell = true;
      matchMergeCell = mergeCell;
      // 补上合并单元格的高宽
      if (startRow !== endRow) {
        for (let i = row + 1; i <= endRow; i++) {
          displayHeight += getRowHeight(i);
        }
      }
      if (startCol !== endCol) {
        for (let i = col + 1; i <= endCol; i++) {
          displayWidth += getColWidth(i);
        }
      }
    }
  }

  return {
    isMergeCell,
    mergeCell: matchMergeCell,
    mergeCellId,
    displayHeight,
    displayWidth
  };
}

/**
 * 返回可视区域的数据及位置信息，拆分函数方便但要测试
 */

export function getViewPointData(
  getSheetRowData: (row: number) => CellData[],
  getMergeCells: () => RangeRef[],
  getRowHeight: (index: number) => number,
  getColWidth: (index: number) => number,
  viewRange: ViewRange
): DisplayData[] {
  const {rows, rowSizes, cols, colSizes} = viewRange;

  const displayData: DisplayData[] = [];

  const mergeCells = getMergeCells();

  // 已经渲染的合并单元格
  const renderedMergeCell = new Set();

  let rIndex = 0;
  for (let rowIndex of rows) {
    const rowHeight = rowSizes[rIndex].size;
    const rowData = getSheetRowData(rowIndex);

    let cIndex = 0;
    for (let colIndex of cols) {
      const colWidth = colSizes[cIndex].size;

      if (rowData[colIndex] !== undefined) {
        const value = rowData[colIndex];
        let displayWidth = colWidth;
        let displayHeight = rowHeight;
        let needClear = false;
        // 是否忽略渲染，这种情况主要是发生在合并单元格的时候
        let ignore = false;
        if (mergeCells.length) {
          const displaySize = calcCellDisplaySize(
            rowIndex,
            colIndex,
            rowHeight,
            colWidth,
            getRowHeight,
            getColWidth,
            mergeCells
          );
          if (displaySize.isMergeCell) {
            displayWidth = displaySize.displayWidth;
            displayHeight = displaySize.displayHeight;
            if (hasValue(value)) {
              needClear = true;
              renderedMergeCell.add(displaySize.mergeCellId);
            } else {
              // 没有值的情况下，不需要渲染
              ignore = true;

              // 还有另一个情况是在合并单元格下，第一个单元格不再显示，这时需要手动将第一个单元格信息补上
              // 目前这个逻辑是比较复杂，但目前这样做性能最好
              if (
                !renderedMergeCell.has(displaySize.mergeCellId) &&
                displaySize.mergeCell
              ) {
                // 反算第一个单元格的位置
                let x = colSizes[cIndex].offset;
                let y = rowSizes[rIndex].offset;
                const {startCol, startRow} = displaySize.mergeCell;

                // 当前单元格相对于第一个单元格在 x 方向的偏移
                let xOffset = 0;
                for (let i = startCol; i < colIndex; i++) {
                  xOffset += getColWidth(i);
                }

                x -= xOffset;

                // 当前单元格相对于第一个单元格在 y 方向的偏移
                let yOffset = 0;
                for (let i = startRow; i < rowIndex; i++) {
                  yOffset += getRowHeight(i);
                }

                y -= yOffset;

                const value = getSheetRowData(startRow)[startCol];

                displayData.push({
                  x,
                  y,
                  width: displayWidth + xOffset,
                  height: displayHeight + yOffset,
                  row: startRow,
                  col: startCol,
                  value,
                  needClear: true
                });
                // 避免再次添加
                renderedMergeCell.add(displaySize.mergeCellId);
              }
            }
          }
        }

        if (!ignore) {
          displayData.push({
            x: colSizes[cIndex].offset,
            y: rowSizes[rIndex].offset,
            width: displayWidth,
            height: displayHeight,
            row: rowIndex,
            col: colIndex,
            value,
            needClear
          });
        }
      }

      cIndex++;
    }

    rIndex++;
  }

  return displayData;
}
