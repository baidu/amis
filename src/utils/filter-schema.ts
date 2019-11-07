import {evalExpression, filter} from './tpl';

import {Schema, PlainObject} from '../types';

/**
 * 处理 Props 数据，所有带 On 结束的做一次
 *
 * xxxOn
 * xxxExpr
 *
 *
 * @param schema
 * @param data
 */
export default function getExprProperties(
  schema: PlainObject,
  data: object = {},
  blackList: Array<string> = ['addOn']
): PlainObject {
  const exprProps: PlainObject = {};

  Object.getOwnPropertyNames(schema).forEach(key => {
    if (blackList && ~blackList.indexOf(key)) {
      return;
    }

    let parts = /^(.*)(On|Expr)$/.exec(key);
    let value: any = schema[key];

    if (
      value &&
      typeof value === 'string' &&
      parts &&
      (parts[2] === 'On' || parts[2] === 'Expr')
    ) {
      key = parts[1];

      if (parts[2] === 'On' || parts[2] === 'Expr') {
        value =
          parts[2] === 'On' ? evalExpression(value, data) : filter(value, data);
      }

      exprProps[key] = value;
    }
  });

  return exprProps;
}
