/**
 * 计算条件格式
 */

import {CT_CfRule} from '../../openxml/ExcelTypes';
import {isCellInRange, parseRange} from '../io/excel/util/Range';
import {CellInfo} from '../types/CellInfo';
import {RangeRef} from '../types/RangeRef';
import {Sheet} from './Sheet';
import {aboveAverage} from './cfRule/aboveAverage';
import {cellIs} from './cfRule/cellIs';
import {colorScale} from './cfRule/colorScale';
import {dataBar} from './cfRule/dataBar';
import {duplicateValues} from './cfRule/duplicateValues';
import {iconSet} from './cfRule/iconSet';
import {timePeriod} from './cfRule/timePeriod';
import {top10} from './cfRule/top10';
import {uniqueValues} from './cfRule/uniqueValues';
import {containsText} from './cfRule/containsText';
import {containsBlanks} from './cfRule/containsBlanks';
import {containsErrors} from './cfRule/containsErrors';
import {notContainsText} from './cfRule/notContainsText';

function evalRule(
  sheet: Sheet,
  cellInfo: CellInfo,
  ranges: RangeRef[],
  rule: CT_CfRule
): boolean {
  const type = rule.type;

  switch (type) {
    case 'cellIs':
      return cellIs(sheet, cellInfo, rule);

    case 'uniqueValues':
      return uniqueValues(sheet, cellInfo, ranges, rule);

    case 'duplicateValues':
      return duplicateValues(sheet, cellInfo, ranges, rule);

    case 'aboveAverage':
      return aboveAverage(sheet, cellInfo, ranges, rule);

    case 'top10':
      return top10(sheet, cellInfo, ranges, rule);

    case 'colorScale':
      return colorScale(sheet, cellInfo, ranges, rule);

    case 'dataBar':
      return dataBar(sheet, cellInfo, ranges, rule);

    case 'iconSet':
      return iconSet(sheet, cellInfo, ranges, rule);

    case 'timePeriod':
      return timePeriod(sheet, cellInfo, ranges, rule);

    case 'containsText':
      return containsText(sheet, cellInfo, rule);

    case 'notContainsText':
      return notContainsText(sheet, cellInfo, rule);

    case 'containsBlanks':
      return containsBlanks(sheet, cellInfo, rule);

    case 'containsErrors':
      return containsErrors(sheet, cellInfo, rule);

    default:
      console.warn('未知的条件格式类型', type);
  }
  return false;
}

export function applyConditionalFormat(
  sheet: Sheet,
  cellInfo: CellInfo,
  row: number,
  col: number
) {
  const conditionalFormatting = sheet.getConditionalFormatting();
  for (const formatting of conditionalFormatting) {
    const sqref = formatting.sqref;
    if (!sqref) {
      continue;
    }
    const ranges = sqref.split(' ').map(parseRange);
    for (const range of ranges) {
      if (isCellInRange(range, row, col)) {
        const cfRules = formatting.cfRule || [];
        for (const rule of cfRules) {
          try {
            const evalResult = evalRule(sheet, cellInfo, ranges, rule);
            if (rule.stopIfTrue && evalResult) {
              break;
            }
          } catch (error) {
            console.warn('条件格式处理失败', error);
          }
        }
      }
    }
  }
}
