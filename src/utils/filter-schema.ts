import {evalExpression, filter} from './tpl';

import {Schema, PlainObject} from '../types';
import {injectPropsToObject} from './helper';

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
  blackList: Array<string> = ['addOn'],
  props?: any
): PlainObject {
  const exprProps: PlainObject = {};
  let ctx: any = null;

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
        if (
          !ctx &&
          props &&
          typeof value === 'string' &&
          ~value.indexOf('__props')
        ) {
          ctx = injectPropsToObject(data, {
            __props: props
          });
        }

        value =
          parts[2] === 'On'
            ? evalExpression(value, ctx || data)
            : filter(value, ctx || data);
      }

      exprProps[key] = value;
    }
  });

  return exprProps;
}
