import {ST_FilterOperator} from '../../../../openxml/ExcelTypes';
import {OperatorTypeUI} from './OperatorTypeUI';

/**
 * 将 xml 中的操作符转换为界面上的操作符，界面操作的格式会更多
 */

export function toOperatorUI(
  operator: ST_FilterOperator,
  value: string
): OperatorTypeUI {
  if (operator === 'equal') {
    if (value.startsWith('*') && value.endsWith('*')) {
      return 'contains';
    }
    if (value.endsWith('*')) {
      return 'beginsWith';
    }
    if (value.startsWith('*')) {
      return 'endsWith';
    }
  }

  if (operator === 'notEqual') {
    if (value.startsWith('*') && value.endsWith('*')) {
      return 'notContains';
    }
    if (value.endsWith('*')) {
      return 'notBeginsWith';
    }
    if (value.startsWith('*')) {
      return 'notEndsWith';
    }
  }

  return operator;
}
