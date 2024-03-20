import {Workbook} from '../../Workbook';
import {Canvas} from '../Canvas';
import {MAX_COL, MAX_ROW} from '../Consts';
import {SheetSelection} from './SheetSelection';
import {drawAllSelection} from './drawAllSelection';
import {drawCellSelection} from './drawCellSelection';
import {drawColSelection} from './drawColSelection';
import {drawRowSelection} from './drawRowSelection';

/**
 * 绘制选择区域
 * @param workbook
 * @param canvas
 * @param selection
 */
export function drawCellRanges(
  workbook: Workbook,
  canvas: Canvas,
  selection: SheetSelection
) {
  if (!selection) {
    return;
  }
  for (const range of selection.cellRanges) {
    if (range.endCol === MAX_COL && range.endRow === MAX_ROW) {
      drawAllSelection(workbook, canvas, selection);
    } else if (range.endCol === MAX_COL) {
      drawRowSelection(workbook, canvas, selection, range);
    } else if (range.endRow === MAX_ROW) {
      drawColSelection(workbook, canvas, selection, range);
    } else {
      drawCellSelection(workbook, canvas, selection, range);
    }
  }
}
