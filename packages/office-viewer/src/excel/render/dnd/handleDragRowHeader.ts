import {MAX_COL} from '../Consts';
import {dragState} from './handleMousedown';
/**
 * 处理拖拽行表头扩展选区
 */

export function handleDragRowHeader(offsetX: number, offsetY: number) {
  // 没有 selection 的情况不大可能，但避免出错
  if (!dragState.selection) {
    console.warn('没有 selection');
    return;
  }
  // 做 hitTest，判断是否拖到了其它行表头
  const hitTestResult = dragState.workbook
    ?.getActiveSheet()
    .hitTest(offsetX, offsetY);

  const row = dragState.selection.activeCell.startRow;

  // 后续要支持多选得改这里
  const firstCellRange = dragState.selection.cellRanges[0];

  if (hitTestResult) {
    // 还不支持跨区域拖拽
    if (hitTestResult.region !== dragState.region) {
      console.warn('不支持跨区域拖拽');
      return;
    }
    // 说明移动到别的行了
    if (hitTestResult.startRow !== row) {
      const startRow = Math.min(row, hitTestResult.startRow);
      const endRow = Math.max(row, hitTestResult.startRow);
      if (
        startRow === firstCellRange.startRow &&
        endRow === firstCellRange.endRow
      ) {
        return;
      }
      firstCellRange.startRow = startRow;
      firstCellRange.endRow = endRow;
      firstCellRange.startCol = 0;
      firstCellRange.endCol = MAX_COL;
      dragState.workbook?.uiEvent.emit('CHANGE_SELECTION', dragState.selection);
    } else {
      // 如果在当前行移动，需要判断和现有选区是否有变化
      if (firstCellRange.startRow !== firstCellRange.endRow) {
        firstCellRange.endRow = firstCellRange.startRow;
        firstCellRange.startCol = 0;
        firstCellRange.endCol = MAX_COL;
        dragState.workbook?.uiEvent.emit(
          'CHANGE_SELECTION',
          dragState.selection
        );
      }
    }
  }
}
