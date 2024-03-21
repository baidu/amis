import {Workbook} from '../../Workbook';
import {rangeToHTML} from './buildHTML/rangeToHTML';

/**
 * 复制选区，生成 HTML 表格数据
 * @param range 选区
 * @param mergeCells 合并单元格
 */
export function copySelection(workbook: Workbook) {
  const currentSheet = workbook.getActiveSheet();
  const selection = currentSheet.getSelection();
  if (!selection?.cellRanges) {
    console.warn('没有 selection');
    return;
  }

  if (selection.cellRanges.length === 0) {
    return;
  }

  const {tsv, table} = rangeToHTML(workbook, selection.cellRanges[0]);

  navigator.clipboard.write([
    new ClipboardItem({
      'text/plain': new Blob([tsv.join('\n')], {type: 'text/plain'}),
      'text/html': new Blob([table], {type: 'text/html'})
    })
  ]);
  workbook.uiEvent.emit('COPY_SELECTION');
}
