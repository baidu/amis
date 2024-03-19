import {CT_Dxf, CT_Table} from '../../../openxml/ExcelTypes';
import {presetTableStyles} from '../../io/excel/preset/presetTableStyles';
import {CellInfo} from '../../types/CellInfo';
import {RangeRef} from '../../types/RangeRef';
import {Sheet} from '../Sheet';
import {applyDxf} from '../applyDxf';
import {buildTableStyle} from './buildTableStyle';
import {calcTableRelativePosition} from './calcTableRelativePosition';

export function applyTableStyle(
  cellInfo: CellInfo,
  tablePart: CT_Table,
  ref: RangeRef,
  sheet: Sheet,
  row: number,
  col: number
) {
  const headerRowCount = tablePart.headerRowCount ?? 1;
  let totalsRowShown = tablePart.totalsRowShown || true;
  let totalsRowCount = tablePart.totalsRowCount || 0;
  // 这是来自 MS-OI29500 P291 的说明，如果 totalsRowCount 为 0，那么 totalsRowShown 必须为 true
  if (totalsRowCount > 0) {
    totalsRowShown = true;
  }
  const tableStyleInfo = tablePart.tableStyleInfo;
  if (!tableStyleInfo) {
    console.warn('表格缺少 tableStyleInfo 字段', tablePart);
    return;
  }
  const name = tableStyleInfo.name;
  // 表格名称
  if (!name) {
    console.warn('表格缺少 name 字段', tablePart);
    return;
  }

  const tableStyle = presetTableStyles[name];

  if (!tableStyle) {
    console.warn('未知的表格样式', name);
    return;
  }

  const tablePosition = calcTableRelativePosition(
    ref,
    r => sheet.isRowHidden(r),
    c => sheet.isColHidden(c),
    row,
    col,
    headerRowCount,
    totalsRowCount,
    totalsRowShown
  );

  const showFirstColumn = tableStyleInfo.showFirstColumn || false;
  const showLastColumn = tableStyleInfo.showLastColumn || false;
  const showRowStripes = tableStyleInfo.showRowStripes || false;
  const showColumnStripes = tableStyleInfo.showColumnStripes || false;

  const dxfs = tableStyle.dxfs.dxf || [];

  const tableStyles = buildTableStyle(tableStyle);

  if (tableStyles.wholeTable !== undefined) {
    applyDxf(cellInfo, dxfs[tableStyles.wholeTable]);
  }

  if (
    showRowStripes &&
    tablePosition.rowType === 'odd' &&
    tableStyles.firstRowStripe !== undefined
  ) {
    applyDxf(cellInfo, dxfs[tableStyles.firstRowStripe]);
  }

  if (
    showColumnStripes &&
    tablePosition.colType === 'odd' &&
    tableStyles.firstColumnStripe !== undefined
  ) {
    applyDxf(cellInfo, dxfs[tableStyles.firstColumnStripe]);
  }

  if (
    tablePosition.rowType === 'header' &&
    tableStyles.headerRow !== undefined
  ) {
    applyDxf(cellInfo, dxfs[tableStyles.headerRow]);
  }

  if (tablePosition.rowType === 'total' && tableStyles.totalRow !== undefined) {
    applyDxf(cellInfo, dxfs[tableStyles.totalRow]);
  }

  if (
    showFirstColumn &&
    tablePosition.colPosition === 'first' &&
    tableStyles.firstColumn !== undefined
  ) {
    applyDxf(cellInfo, dxfs[tableStyles.firstColumn]);
  }

  if (
    showLastColumn &&
    tablePosition.colPosition === 'last' &&
    tableStyles.lastColumn !== undefined
  ) {
    applyDxf(cellInfo, dxfs[tableStyles.lastColumn]);
  }

  // 表格内部添加默认白色分隔线，目前不知道这样做是否正确
  if (!cellInfo.border) {
    cellInfo.border = {
      bottom: {
        color: {
          rgb: 'FFFFFFFF'
        },
        style: 'thin'
      },
      right: {
        color: {
          rgb: 'FFFFFFFF'
        },
        style: 'thin'
      }
    };
  }
}
