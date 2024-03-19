import {getCellRowPosition} from '../selection/getCellPosition';
import {dragState} from './handleMousedown';

/**
 * 处理拖拽网格线，调整行高
 */
export function handleDragRowGrid(mouseEvent: MouseEvent) {
  const {pageY} = mouseEvent;
  const shiftY = pageY - dragState.dragStart.pageY;
  const workbook = dragState.workbook!;
  const sheet = workbook.getActiveSheet();
  const rowPosition = getCellRowPosition(
    sheet,
    dragState.region,
    dragState.row
  );
  if (rowPosition) {
    // 拖拽的网格线是在底部
    const startY = rowPosition.y + rowPosition.height;
    // 不可以拖动超过当前行的位置，这样就变成负值了
    let lineY = Math.max(rowPosition.y, startY + shiftY);

    dragState.tmpRowHeight = Math.max(0, lineY - rowPosition.y);

    workbook.uiEvent.emit('DRAG_ROW_GRID_LINE', lineY);
  }
}
