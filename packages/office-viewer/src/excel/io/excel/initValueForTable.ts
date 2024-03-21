import {IWorksheet} from '../../types/IWorksheet';
import {parseRange} from './util/Range';
import {makeBlankValue} from './util/makeBlankValue';

/**
 * 表格渲染需要有值，所以加个空值
 */
export function initValueForTable(worksheet: IWorksheet) {
  const tableParts = worksheet.tableParts || [];

  for (const tablePart of tableParts) {
    if (!tablePart.ref) {
      console.warn('表格缺少 ref 字段', tablePart);
      continue;
    }
    const ref = parseRange(tablePart.ref);
    makeBlankValue(worksheet.cellData, ref);
  }
}
