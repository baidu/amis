import {Workbook} from '../../Workbook';
import {selectAll} from '../dnd/selectAll';

/**
 * 复制
 */
export function handleSelectAll(e: KeyboardEvent, workbook: Workbook) {
  if (e.metaKey || e.ctrlKey) {
    // 全选
    if (e.key === 'a') {
      const sheetIndex = workbook.getActiveSheet().getIndex();
      workbook.uiEvent.emit('CHANGE_SELECTION', selectAll(sheetIndex));
      e.preventDefault();
    }
  }
}
