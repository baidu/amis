import {CT_CfRule} from '../../../openxml/ExcelTypes';
import {CellInfo} from '../../types/CellInfo';
import {Sheet} from '../Sheet';
import {applyCfRuleDxf} from './applyCfRuleDxf';
/**
 * 空内容
 */
export function containsBlanks(
  sheet: Sheet,
  cellInfo: CellInfo,
  cfRule: CT_CfRule
): boolean {
  if (cellInfo.value.trim() === '') {
    applyCfRuleDxf(cfRule, sheet, cellInfo);
    return true;
  }

  return false;
}
