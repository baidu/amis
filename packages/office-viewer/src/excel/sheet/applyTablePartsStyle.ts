import {isCellInRange, parseRange} from '../io/excel/util/Range';
import {CellInfo} from '../types/CellInfo';
import {Sheet} from './Sheet';
import {applyTableStyle} from './table/applyTableStyle';

/**
 * 对单元格应用表格样式
 */
export function applyTablePartsStyle(sheet: Sheet, cellInfo: CellInfo) {
  const row = cellInfo.row;
  const col = cellInfo.col;
  for (const tablePart of sheet.getTableParts()) {
    if (!tablePart.ref) {
      console.warn('表格缺少 ref 字段', tablePart);
      continue;
    }
    const ref = parseRange(tablePart.ref);

    if (isCellInRange(ref, row, col)) {
      applyTableStyle(cellInfo, tablePart, ref, sheet, row, col);
    }
  }
}
