import {ST_FilterOperator} from '../../../openxml/ExcelTypes';
import {gt, gte, lt, lte} from '../../../util/number';
import {CellValueNum} from './CellValueNum';

/**
 * 判断是否匹配
 * @param operator
 * @param val
 * @param cellValueNum
 */
export function evalCustomFilter(
  operator: ST_FilterOperator | undefined,
  val: string,
  cellValueNum: CellValueNum
) {
  val = val.toLowerCase();
  const value = cellValueNum.value.toLowerCase();
  const num = cellValueNum.num;
  operator = operator || 'equal';

  switch (operator) {
    case 'equal':
      if (val.startsWith('*') && val.endsWith('*')) {
        return value.includes(val.slice(1, -1));
      }
      if (val.endsWith('*')) {
        return value.startsWith(val.slice(0, -1));
      }
      if (val.startsWith('*')) {
        return value.endsWith(val.slice(1));
      }

      return value === val;

    case 'notEqual':
      if (val.startsWith('*') && val.endsWith('*')) {
        return !value.includes(val.slice(1, -1));
      }
      if (val.endsWith('*')) {
        return !value.startsWith(val.slice(0, -1));
      }
      if (val.startsWith('*')) {
        return !value.endsWith(val.slice(1));
      }
      return value !== val;

    case 'lessThan':
      if (num === undefined) {
        return false;
      }
      return lt(num, parseFloat(val));

    case 'lessThanOrEqual':
      if (num === undefined) {
        return false;
      }
      return lte(num, parseFloat(val));

    case 'greaterThan':
      if (num === undefined) {
        return false;
      }
      return gt(num, parseFloat(val));

    case 'greaterThanOrEqual':
      if (num === undefined) {
        return false;
      }
      return gte(num, parseFloat(val));
  }
  return false;
}
