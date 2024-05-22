import {
  DeleteEventContext,
  InsertEventContext,
  MoveEventContext
} from '../plugin';
import {EditorNodeType} from '../store/node';
import {EditorDNDManager} from './index';

/**
 * 每种拖拽模式都需要实现这些约定。
 */
export interface DNDModeInterface {
  readonly dnd: EditorDNDManager;
  readonly region: EditorNodeType;

  enter: (e: DragEvent, ghost: HTMLElement) => void;

  leave: (e: DragEvent, ghost: HTMLElement) => void;

  over: (e: DragEvent, ghost: HTMLElement) => void;

  getDropBeforeId: () => string | undefined;

  dispose: () => void;

  getDropPosition?: () => 'top' | 'bottom' | 'left' | 'right' | undefined;

  interruptionDrop?: () => boolean; // 是否中断 drop 事件
}
