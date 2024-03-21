const CURSOR_MAP = {
  'drawing': 'default',
  'cell': 'cell',
  'row-header': 'e-resize',
  'row-grid': 'row-resize',
  'col-header': 's-resize',
  'col-grid': 'col-resize',
  'corner': 'cell'
};

import {HitTestResult} from './hitTest';

/**
 * 根据 hitTest 结果更新鼠标样式
 */

export function updateCursor(
  container: HTMLElement,
  hitTestResult: HitTestResult | null,
  pointerOnLink: boolean | string
) {
  if (hitTestResult && hitTestResult.type in CURSOR_MAP) {
    container.style.cursor = CURSOR_MAP[hitTestResult.type];

    if (pointerOnLink) {
      container.style.cursor = 'pointer';
    }
  }
}
