import {removeEventListener} from './removeEventListener';
import {dragState, resetDragState} from './handleMousedown';

export function handleMouseup() {
  dragState.isDragging = false;
  removeEventListener();

  if (dragState.dragType === 'col-grid') {
    dragState.workbook?.uiEvent.emit(
      'DRAG_COL_GRID_LINE_END',
      dragState.col,
      dragState.tmpColWidth
    );
  }
  if (dragState.dragType === 'row-grid') {
    dragState.workbook?.uiEvent.emit(
      'DRAG_ROW_GRID_LINE_END',
      dragState.row,
      dragState.tmpRowHeight
    );
  }

  resetDragState();
}
