import {Workbook} from '../../Workbook';
import {Canvas} from '../Canvas';
import {SheetSelection} from './SheetSelection';
import {drawSelectionHeaderHighlight} from './drawSelectionHeaderHighlight';

/**
 * 绘制全选的选区
 */
export function drawAllSelection(
  workbook: Workbook,
  canvas: Canvas,
  selection: SheetSelection
) {
  const x = 0;
  const y = 0;
  const {width, height} = workbook.getViewpointSize();
  const renderOptions = workbook.renderOptions;

  // 绘制选中的单元格
  canvas.drawStrokeRect(
    x,
    y,
    width,
    height,
    renderOptions.selectionBorderColor,
    2
  );

  // 绘制选中区表头的高亮
  drawSelectionHeaderHighlight(workbook, canvas, x, y, width, height);
}
