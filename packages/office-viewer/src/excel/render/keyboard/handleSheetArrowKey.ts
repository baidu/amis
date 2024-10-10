import {Workbook} from '../../Workbook';
import {MAX_COL, MAX_ROW} from '../Consts';

/**
 * 在 sheet canvas 上的事件
 */
export function handleSheetCanvasKeydown(e: KeyboardEvent, workbook: Workbook) {
  const currentSheet = workbook.getActiveSheet();

  const activeCell = currentSheet.selection?.activeCell;

  if (!activeCell) {
    return;
  }

  let changeActiveCell = false;
  if (e.key === 'ArrowUp') {
    activeCell.startRow = Math.max(0, activeCell.startRow - 1);
    changeActiveCell = true;
  }

  if (e.key === 'ArrowDown') {
    activeCell.startRow = Math.min(MAX_ROW, activeCell.startRow + 1);
    changeActiveCell = true;
  }

  if (e.key === 'ArrowLeft') {
    activeCell.startCol = Math.max(0, activeCell.startCol - 1);
    changeActiveCell = true;
  }

  if (e.key === 'ArrowRight') {
    activeCell.startCol = Math.min(MAX_COL, activeCell.startCol + 1);
    changeActiveCell = true;
  }

  if (changeActiveCell) {
    e.preventDefault();
    activeCell.endRow = activeCell.startRow;
    activeCell.endCol = activeCell.startCol;
    if (currentSheet.selection) {
      currentSheet.selection.cellRanges = [activeCell];
      workbook.uiEvent.emit('CHANGE_SELECTION', currentSheet.selection);
    }
  }
}
