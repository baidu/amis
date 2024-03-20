import {Workbook} from '../../Workbook';

/**
 * 粘贴时触发
 */
export function handlePaste(e: ClipboardEvent, workbook: Workbook) {
  const html = e.clipboardData?.getData('text/html');
  if (!html) {
    return;
  }

  const element = document.createElement('div');
  element.innerHTML = html;

  const trs = element.querySelectorAll('table tr');

  // TODO: 将表格转成数据
}
