import {
  CT_CustomFilter,
  ST_FilterOperator
} from '../../../../openxml/ExcelTypes';
import {OperatorTypeUI} from './OperatorTypeUI';

/**
 * 将界面上的操作符转换为 xml 中的操作符
 */
export function fromOperatorUI(
  operator: OperatorTypeUI,
  value: string
): CT_CustomFilter {
  if (operator === 'contains') {
    return {
      operator: 'equal',
      val: `*${value}*`
    };
  }
  if (operator === 'beginsWith') {
    return {
      operator: 'equal',
      val: `${value}*`
    };
  }

  if (operator === 'endsWith') {
    return {
      operator: 'equal',
      val: `*${value}`
    };
  }

  if (operator === 'notContains') {
    return {
      operator: 'notEqual',
      val: `*${value}*`
    };
  }

  if (operator === 'notBeginsWith') {
    return {
      operator: 'notEqual',
      val: `${value}*`
    };
  }

  if (operator === 'notEndsWith') {
    return {
      operator: 'notEqual',
      val: `*${value}`
    };
  }

  // 前面应该已经处理完了
  return {
    operator: operator as ST_FilterOperator,
    val: value
  };
}
