/**
 * 绘制选择整行的选框
 * @param workbook
 * @param canvas
 * @param selection
 * @param range
 */

import {Workbook} from '../../Workbook';
import {RangeRef} from '../../types/RangeRef';
import {Canvas} from '../Canvas';
import {SheetSelection} from './SheetSelection';
import {drawSelectionHeaderHighlight} from './drawSelectionHeaderHighlight';
import {getRangePosition} from './getRangePosition';

export function drawRowSelection(
  workbook: Workbook,
  canvas: Canvas,
  selection: SheetSelection,
  range: RangeRef
) {
  let {x, y, width, height} = getRangePosition(
    workbook,
    selection.region,
    range
  );

  console.log('drawRowSelection', x, y, width, height, range);
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
