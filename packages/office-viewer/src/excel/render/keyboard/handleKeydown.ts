/**
 * 处理键盘事件
 */

import {Workbook} from '../../Workbook';

import {handleCopy} from './handleCopy';
import {handleSelectAll} from './handleSelectAll';
import {handleSheetCanvasKeydown} from './handleSheetArrowKey';

export function handleKeydown(e: KeyboardEvent, workbook: Workbook) {
  handleSelectAll(e, workbook);
  handleCopy(e, workbook);
  handleSheetCanvasKeydown(e, workbook);
}
