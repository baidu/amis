import {CT_CfRule} from '../../../openxml/ExcelTypes';
import {CellInfo} from '../../types/CellInfo';
import {Sheet} from '../Sheet';
import {applyCfRuleDxf} from './applyCfRuleDxf';
/**
 * 包含文本
 */
export function containsText(
  sheet: Sheet,
  cellInfo: CellInfo,
  cfRule: CT_CfRule
): boolean {
  if (!cfRule.text) {
    return false;
  }

  if (cellInfo.value.includes(cfRule.text)) {
    applyCfRuleDxf(cfRule, sheet, cellInfo);
    return true;
  }

  return false;
}
