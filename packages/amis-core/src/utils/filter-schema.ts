import {evalExpression, filter} from './tpl';
import {PlainObject} from '../types';
import {injectPropsToObject, mapObject} from './helper';
import isPlainObject from 'lodash/isPlainObject';
import cx from 'classnames';
import {tokenize} from './tokenize';

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
export function getExprProperties(
  schema: PlainObject,
  data: object = {},
  blackList: Array<string> = ['addOn', 'ref'],
  props?: any
): PlainObject {
  const exprProps: PlainObject = {};
  let ctx: any = null;

  Object.getOwnPropertyNames(schema).forEach(key => {
    if (blackList && ~blackList.indexOf(key)) {
      return;
    }

    let parts = /^(.*)(On|Expr|(?:c|C)lassName)(Raw)?$/.exec(key);
    const type = parts?.[2];
    let value: any = schema[key];

    if (
      value &&
      typeof value === 'string' &&
      parts?.[1] &&
      (type === 'On' || type === 'Expr')
    ) {
      key = parts[1];

      if (type === 'On' || type === 'Expr') {
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

        if (type === 'On') {
          value = props?.[key] || evalExpression(value, ctx || data);
        } else {
          value = filter(value, ctx || data);
        }
      }

      exprProps[key] = value;
    } else if (
      (type === 'className' || type === 'ClassName') &&
      !props?.[key] && // 如果 props 里面有则是 props 优先
      value &&
      (typeof value === 'string' || isPlainObject(value))
    ) {
      exprProps[`${key}Raw`] = value;
      exprProps[key] =
        typeof value === 'string'
          ? tokenize(value, data)
          : mapObject(
              value,
              (value: any) =>
                typeof value === 'string' ? evalExpression(value, data) : value,
              undefined,
              (key: string) => tokenize(key, data)
            );
    }
  });

  return exprProps;
}

export default getExprProperties;
