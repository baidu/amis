import {CT_CfRule} from '../../../openxml/ExcelTypes';
import {gt, gte, lte} from '../../../util/number';
import {toNumber} from '../../data/toNumber';
import {CellInfo} from '../../types/CellInfo';
import {RangeRef} from '../../types/RangeRef';
import {Sheet} from '../Sheet';
import {applyCfRuleDxf} from './applyCfRuleDxf';

export function getAverageValue(values: number[]) {
  if (values.length === 0) {
    return null;
  }
  const sum = values.reduce((prev, curr) => prev + curr, 0);
  return sum / values.length;
}

/**
 * 对大于或小于平均值的应用样式
 */
export function aboveAverage(
  sheet: Sheet,
  cellInfo: CellInfo,
  ranges: RangeRef[],
  cfRule: CT_CfRule
): boolean {
  if (cellInfo.value === '') {
    return false;
  }
  const rangeCache = sheet.getRangeCache();
  let rangeAverage = rangeCache.get(ranges, 'average');

  if (!rangeAverage) {
    const rangeValues = sheet.getCellValueByRanges(ranges);
    if (rangeValues.length === 0) {
      return false;
    }
    const values: number[] = [];
    rangeValues.map(value => {
      if (value.text === '') {
        return;
      }
      values.push(toNumber(value.value));
    });

    rangeAverage = getAverageValue(values);
    if (rangeAverage === null) {
      return false;
    }
    rangeCache.set(ranges, 'average', rangeAverage);
  }
  const value = parseFloat(cellInfo.value);

  if (cfRule.aboveAverage === false) {
    if (cfRule.equalAverage === true) {
      if (lte(value, rangeAverage)) {
        applyCfRuleDxf(cfRule, sheet, cellInfo);
        return true;
      }
    } else {
      if (lte(value, rangeAverage)) {
        applyCfRuleDxf(cfRule, sheet, cellInfo);
        return true;
      }
    }
  } else {
    if (cfRule.equalAverage === true) {
      if (gte(value, rangeAverage)) {
        applyCfRuleDxf(cfRule, sheet, cellInfo);
        return true;
      }
    } else {
      if (gt(value, rangeAverage)) {
        applyCfRuleDxf(cfRule, sheet, cellInfo);
        return true;
      }
    }
  }
  return false;
}
