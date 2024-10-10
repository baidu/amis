import {CT_CfRule} from '../../../openxml/ExcelTypes';
import {CellInfo} from '../../types/CellInfo';
import {Sheet} from '../Sheet';
import {applyCfRuleDxf} from './applyCfRuleDxf';
/**
 * 包含错误
 */
export function containsErrors(
  sheet: Sheet,
  cellInfo: CellInfo,
  cfRule: CT_CfRule
): boolean {
  if (
    typeof cellInfo.cellData === 'object' &&
    cellInfo.cellData.type === 'error'
  ) {
    applyCfRuleDxf(cfRule, sheet, cellInfo);
    return true;
  }

  return false;
}
