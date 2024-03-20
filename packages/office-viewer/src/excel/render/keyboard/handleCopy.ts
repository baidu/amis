import {Workbook} from '../../Workbook';
import {copySelection} from '../selection/copySelection';

/**
 * 复制
 */
export function handleCopy(e: KeyboardEvent, workbook: Workbook) {
  if (e.metaKey || e.ctrlKey) {
    // 全选
    if (e.key === 'a') {
      console.log('SELECT ALL');
    }
    // 复制
    if (e.key === 'c') {
      copySelection(workbook);
    }
  }
}
