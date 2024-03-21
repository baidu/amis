import {CT_CfRule} from '../../../openxml/ExcelTypes';
import {CellInfo} from '../../types/CellInfo';
import {RangeRef} from '../../types/RangeRef';
import {Sheet} from '../Sheet';
import {applyCfRuleDxf} from './applyCfRuleDxf';

/**
 * 对不重复值应用样式
 */

export function uniqueValues(
  sheet: Sheet,
  cellInfo: CellInfo,
  ranges: RangeRef[],
  cfRule: CT_CfRule
): boolean {
  const rangeCache = sheet.getRangeCache();
  let rangeUniqueValues = rangeCache.get(ranges, 'uniqueValues');
  if (!rangeUniqueValues) {
    rangeUniqueValues = new Set();
    const allValues = new Set();
    const rangeValues = sheet.getCellValueByRanges(ranges);
    for (const value of rangeValues) {
      if (value.text === '') {
        continue;
      }
      if (allValues.has(value.text)) {
        rangeUniqueValues.delete(value.text);
      } else {
        allValues.add(value.text);
        rangeUniqueValues.add(value.text);
      }
    }
    rangeCache.set(ranges, 'uniqueValues', rangeUniqueValues);
  }

  if (rangeUniqueValues.has(cellInfo.value)) {
    applyCfRuleDxf(cfRule, sheet, cellInfo);
    return true;
  }
  return false;
}
