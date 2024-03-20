import type {Workbook} from '../../Workbook';
import {Region} from '../../sheet/ViewRange';
import {SheetSelection} from '../selection/SheetSelection';
import {HitTestResult} from '../selection/hitTest';

export interface DragState {
  workbook?: Workbook;
  container?: HTMLElement;
  isDragging: boolean;
  // 拖拽开始的位置，使用相对于 Page 的位置
  dragStart: {
    pageX: number;
    pageY: number;
    offsetX: number;
    offsetY: number;
  };
  // 行和列，主要是用于在 header 拖拽
  row: number;
  col: number;
  // 临时行高和列宽，用于拖拽时的临时结果
  tmpRowHeight: number;
  tmpColWidth: number;
  dragType: HitTestResult['type'];
  region: Region;
  selection?: SheetSelection;
}
