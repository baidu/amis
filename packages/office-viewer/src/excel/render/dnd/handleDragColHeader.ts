import {MAX_ROW} from '../Consts';
import {dragState} from './handleMousedown';
/**
 * 处理拖拽列表头扩展选区
 */
export function handleDragColHeader(offsetX: number, offsetY: number) {
  if (!dragState.selection) {
    console.warn('没有 selection');
    return;
  }

  // 做 hitTest，判断是否拖到了其它列表头
  const hitTestResult = dragState.workbook
    ?.getActiveSheet()
    .hitTest(offsetX, offsetY);

  const col = dragState.selection.activeCell.startCol;

  // 后续要支持多选得改这里
  const firstCellRange = dragState.selection.cellRanges[0];

  if (hitTestResult) {
    // 还不支持跨区域拖拽
    if (hitTestResult.region !== dragState.region) {
      console.warn('不支持跨区域拖拽');
      return;
    }
    // 说明移动到别的列了
    if (hitTestResult.startCol !== col) {
      const startCol = Math.min(col, hitTestResult.startCol);
      const endCol = Math.max(col, hitTestResult.startCol);
      if (
        startCol === firstCellRange.startCol &&
        endCol === firstCellRange.endCol
      ) {
        return;
      }
      firstCellRange.startCol = startCol;
      firstCellRange.endCol = endCol;
      firstCellRange.startRow = 0;
      firstCellRange.endRow = MAX_ROW;
      dragState.workbook?.uiEvent.emit('CHANGE_SELECTION', dragState.selection);
    } else {
      // 如果在当前列移动，需要判断和现有选区是否有变化
      if (firstCellRange.startCol !== firstCellRange.endCol) {
        firstCellRange.startCol = col;
        firstCellRange.endCol = col;
        firstCellRange.startRow = 0;
        firstCellRange.endRow = MAX_ROW;
        dragState.workbook?.uiEvent.emit(
          'CHANGE_SELECTION',
          dragState.selection
        );
      }
    }
  }
}
