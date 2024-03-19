import {GridLineOptions} from '../../sheet/ExcelRenderOptions';
import {Sheet} from '../../sheet/Sheet';
import {ViewRange} from '../../sheet/ViewRange';
import {SheetCanvas, Line} from '../SheetCanvas';

/**
 * 生成网格线
 */
export function generateGridLines(
  currentSheet: Sheet,
  viewRange: ViewRange,
  width: number,
  height: number
) {
  const {rows, rowSizes, cols, colSizes} = viewRange;

  const lines: Line[] = [];

  // 水平线
  for (let index = 0; index < rows.length; index++) {
    let currentRowOffset = rowSizes[index].offset;
    lines.push({
      x1: 0,
      y1: currentRowOffset,
      x2: width,
      y2: currentRowOffset
    });
  }

  // 垂直线
  for (let index = 0; index < cols.length; index++) {
    let currentColOffset = colSizes[index].offset;
    lines.push({
      x1: currentColOffset,
      y1: 0,
      x2: currentColOffset,
      y2: height
    });
  }

  return lines;
}

/**
 * 绘制网格线
 */
export function drawGridLines(
  currentSheet: Sheet,
  viewRange: ViewRange,
  canvas: SheetCanvas,
  height: number,
  width: number,
  gridLineOptions: GridLineOptions
) {
  if (!currentSheet.showGridLines()) {
    return;
  }

  const lines = generateGridLines(currentSheet, viewRange, width, height);

  canvas.drawLines(lines, gridLineOptions.gridLineColor);
}
