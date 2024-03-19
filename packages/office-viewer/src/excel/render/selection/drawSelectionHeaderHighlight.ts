import {Workbook} from '../../Workbook';
import {Canvas} from '../Canvas';

/**
 * 绘制选中区表头的高亮
 */
export function drawSelectionHeaderHighlight(
  workbook: Workbook,
  canvas: Canvas,
  x: number,
  y: number,
  width: number,
  height: number
) {
  const {rowHeaderWidth, colHeaderHeight} = workbook
    .getActiveSheet()
    .getRowColSize();
  const renderOptions = workbook.renderOptions;
  if (rowHeaderWidth > 0 && colHeaderHeight > 0) {
    // 绘制上方表头的高亮
    canvas.drawAlphaRect(
      x,
      0,
      width,
      colHeaderHeight,
      renderOptions.selectionBackgroundColor,
      renderOptions.selectionBackgroundOpacity
    );
    // 绘制左侧表头的高亮
    canvas.drawAlphaRect(
      0,
      y,
      rowHeaderWidth,
      height,
      renderOptions.selectionBackgroundColor,
      renderOptions.selectionBackgroundOpacity
    );
  }
}
