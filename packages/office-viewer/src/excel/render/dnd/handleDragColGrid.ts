import {getCellColPosition} from '../selection/getCellPosition';
import {dragState} from './handleMousedown';

/**
 * 处理拖拽网格线，调整列宽
 */
export function handleDragColGrid(mouseEvent: MouseEvent) {
  const {pageX} = mouseEvent;
  const shiftX = pageX - dragState.dragStart.pageX;
  const workbook = dragState.workbook!;
  const sheet = workbook.getActiveSheet();
  const colPosition = getCellColPosition(
    sheet,
    dragState.region,
    dragState.col
  );
  if (colPosition) {
    // 拖拽的网格线是在右边
    const startX = colPosition.x + colPosition.width;
    // 不可以拖动超过当前列的位置，这样就变成负值了
    let lineX = Math.max(colPosition.x, startX + shiftX);

    dragState.tmpColWidth = Math.max(0, lineX - colPosition.x);

    workbook.uiEvent.emit('DRAG_COL_GRID_LINE', lineX);
  }
}
