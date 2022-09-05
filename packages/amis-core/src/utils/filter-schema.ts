import {evalExpression, filter} from './tpl';
import {PlainObject} from '../types';
import {injectPropsToObject, mapObject} from './helper';
import isPlainObject from 'lodash/isPlainObject';
import cx from 'classnames';

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
  blackList: Array<string> = ['addOn'],
  props?: any
): PlainObject {
  const exprProps: PlainObject = {};
  let ctx: any = null;

  Object.getOwnPropertyNames(schema).forEach(key => {
    if (blackList && ~blackList.indexOf(key)) {
      return;
    }

    let parts = /^(.*)(On|Expr|(?:c|C)lassName)(Raw)?$/.exec(key);
    let value: any = schema[key];

    if (
      value &&
      typeof value === 'string' &&
      parts?.[1] &&
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

        if (parts[2] === 'On') {
          value = props[key] || evalExpression(value, ctx || data);
        } else {
          value = filter(value, ctx || data);
        }
      }

      exprProps[key] = value;
    } else if (
      value &&
      isPlainObject(value) &&
      (parts?.[2] === 'className' || parts?.[2] === 'ClassName')
    ) {
      key = parts[1] + parts[2];
      exprProps[`${key}Raw`] = value;
      exprProps[key] = cx(
        mapObject(value, (value: any) =>
          typeof value === 'string' ? evalExpression(value, data) : value
        )
      );
    }
  });

  return exprProps;
}

export default getExprProperties;
