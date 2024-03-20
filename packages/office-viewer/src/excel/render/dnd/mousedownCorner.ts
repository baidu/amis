import {Workbook} from '../../Workbook';
import {selectAll} from './selectAll';

/**
 * 点击到全选
 * @param workbook
 * @param hitTestResult
 * @returns
 */
export function mousedownCorner(workbook: Workbook) {
  return selectAll(workbook.getActiveSheet().getIndex());
}
