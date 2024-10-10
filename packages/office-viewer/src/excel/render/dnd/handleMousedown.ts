/**
 * 处理拖拽事件，包括单元格和表头部分
 */

import {Workbook} from '../../Workbook';
import {SheetSelection} from '../selection/SheetSelection';
import {HitTestResult} from '../selection/hitTest';
import {DragState} from './DragState';
import {handleMousemove} from './handleMousemove';
import {handleMouseup} from './handleMouseup';
import {mousedownColHeader} from './mousedownColHeader';
import {mousedownCorner} from './mousedownCorner';
import {mousedownRowHeader} from './mousedownRowHeader';
import {mousedownCell} from './mousedownCell';

const DRAG_STATE_DEFAULT: DragState = {
  isDragging: false,
  dragStart: {
    pageX: 0,
    pageY: 0,
    offsetX: 0,
    offsetY: 0
  },
  row: 0,
  col: 0,
  tmpRowHeight: 0,
  tmpColWidth: 0,
  region: 'normal',
  dragType: 'cell'
};

export const dragState: DragState = JSON.parse(
  JSON.stringify(DRAG_STATE_DEFAULT)
);

export function resetDragState() {
  Object.assign(dragState, DRAG_STATE_DEFAULT);
}

/**
 * 鼠标按下事件
 */
export function handleMousedown(
  workbook: Workbook,
  hitTestResult: HitTestResult,
  container: HTMLElement,
  mouseEvent: MouseEvent
) {
  // 只处理左键
  if (mouseEvent.button !== 0) {
    return;
  }
  let newSelection: SheetSelection | null = null;
  if (hitTestResult.type === 'cell') {
    newSelection = mousedownCell(workbook, hitTestResult);
  }
  if (hitTestResult.type === 'row-header') {
    newSelection = mousedownRowHeader(workbook, hitTestResult);
  }
  if (hitTestResult.type === 'col-header') {
    newSelection = mousedownColHeader(workbook, hitTestResult);
  }
  if (hitTestResult.type === 'corner') {
    newSelection = mousedownCorner(workbook);
  }

  const zoomLevel = workbook.getActiveSheet().getZoomLevel();

  dragState.workbook = workbook;
  dragState.container = container;
  dragState.region = hitTestResult.region;
  dragState.dragStart = {
    pageX: mouseEvent.pageX,
    pageY: mouseEvent.pageY,
    offsetX: mouseEvent.offsetX / zoomLevel,
    offsetY: mouseEvent.offsetY / zoomLevel
  };
  dragState.row = hitTestResult.startRow;
  dragState.col = hitTestResult.startCol;

  dragState.dragType = hitTestResult.type;
  if (newSelection) {
    dragState.selection = newSelection;
    workbook.uiEvent.emit('CHANGE_SELECTION', newSelection);
  }

  document.addEventListener('mousemove', handleMousemove, true);
  document.addEventListener('touchmove', handleMousemove, true);

  document.addEventListener('mouseup', handleMouseup);
  document.addEventListener('touchend', handleMouseup);
}
