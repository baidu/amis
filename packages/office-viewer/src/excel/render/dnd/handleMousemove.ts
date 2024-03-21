import {getMouseRelativePosition} from './getMouseRelativePosition';
import {handleDragCell} from './handleDragCell';
import {handleDragColGrid} from './handleDragColGrid';
import {handleDragColHeader} from './handleDragColHeader';
import {handleDragRowGrid} from './handleDragRowGrid';
import {handleDragRowHeader} from './handleDragRowHeader';
import {dragState} from './handleMousedown';

/**
 * 鼠标拖拽过程中
 */
export function handleMousemove(mouseEvent: MouseEvent) {
  dragState.isDragging = true;

  let {offsetX, offsetY} = getMouseRelativePosition(
    dragState.container!,
    mouseEvent
  );
  const zoomLevel = dragState.workbook!.getActiveSheet().getZoomLevel();
  offsetX = offsetX / zoomLevel;
  offsetY = offsetY / zoomLevel;

  offsetX = Math.round(offsetX);
  offsetY = Math.round(offsetY);

  const dragType = dragState.dragType;

  if (dragType === 'cell') {
    handleDragCell(offsetX, offsetY);
  }

  if (dragType === 'row-grid') {
    handleDragRowGrid(mouseEvent);
  }

  if (dragType === 'col-grid') {
    handleDragColGrid(mouseEvent);
  }

  if (dragType === 'row-header') {
    handleDragRowHeader(offsetX, offsetY);
  }

  if (dragType === 'col-header') {
    handleDragColHeader(offsetX, offsetY);
  }
}
