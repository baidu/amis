import {CT_CfRule} from '../../../openxml/ExcelTypes';
import {CellInfo} from '../../types/CellInfo';
import {RangeRef} from '../../types/RangeRef';
import {Sheet} from '../Sheet';
import {applyCfRuleDxf} from './applyCfRuleDxf';

/**
 * 对重复值应用样式
 */
export function duplicateValues(
  sheet: Sheet,
  cellInfo: CellInfo,
  ranges: RangeRef[],
  cfRule: CT_CfRule
): boolean {
  const rangeCache = sheet.getRangeCache();
  let rangeDuplicateValues = rangeCache.get(ranges, 'duplicateValues');
  if (!rangeDuplicateValues) {
    rangeDuplicateValues = new Set();
    const allValues = new Set();
    const rangeValues = sheet.getCellValueByRanges(ranges);
    for (const value of rangeValues) {
      if (value.text === '') {
        continue;
      }
      if (allValues.has(value.text)) {
        rangeDuplicateValues.add(value.text);
      } else {
        allValues.add(value.text);
      }
    }
    rangeCache.set(ranges, 'duplicateValues', rangeDuplicateValues);
  }

  if (rangeDuplicateValues.has(cellInfo.value)) {
    applyCfRuleDxf(cfRule, sheet, cellInfo);
    return true;
  }

  return false;
}
