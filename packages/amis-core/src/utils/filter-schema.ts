import {
  evalExpression,
  evalExpressionWithConditionBuilder,
  filter
} from './tpl';
import {PlainObject} from '../types';
import {injectPropsToObject, mapObject} from './helper';
import isPlainObject from 'lodash/isPlainObject';
import {tokenize} from './tokenize';
import {classnames, type ClassValue} from '../theme';

/**
 * 计算下发给子组件的className，处理对象类型的className，将其中的表达式计算出来，避免被classnames识别为true
 *
 * @param value - CSS类名值
 * @param ctx - 数据域
 */
export function filterClassNameObject(
  classValue: ClassValue,
  ctx: Record<string, any> = {}
) {
  let result = classValue;

  if (classValue && typeof classValue === 'string') {
    result = tokenize(classValue, ctx);
  } else if (classValue && isPlainObject(classValue)) {
    result = mapObject(
      classValue,
      (value: any) =>
        typeof value === 'string' ? evalExpression(value, ctx) : value,
      undefined,
      (key: string) => tokenize(key, ctx)
    );
  }

  return result;
}

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
  ignoreList: Array<string> = ['addOn', 'ref'],
  props?: any
): PlainObject {
  const exprProps: PlainObject = {};
  let ctx: any = null;

  Object.getOwnPropertyNames(schema).forEach(key => {
    if (ignoreList && ~ignoreList.indexOf(key)) {
      return;
    }

    let parts = /^(.*)(On|Expr|(?:c|C)lassName)(Raw)?$/.exec(key);
    const type = parts?.[2];
    let value: any = schema[key];

    if (
      value &&
      (typeof value === 'string' ||
        Object.prototype.toString.call(value) === '[object Object]') &&
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
          value =
            props?.[key] ||
            evalExpressionWithConditionBuilder(value, ctx || data);
        } else {
          value = filter(value, ctx || data);
        }
      }

      // classNameExpr 做合并处理
      if (/className$/i.test(key) && props?.[key]) {
        value = classnames(value, props[key]);
      }

      exprProps[key] = value;
    } else if (
      (type === 'className' || type === 'ClassName') &&
      !props?.[key] && // 如果 props 里面有则是 props 优先
      value &&
      (typeof value === 'string' || isPlainObject(value))
    ) {
      exprProps[`${key}Raw`] = value;
      exprProps[key] = filterClassNameObject(value, data);
    }
  });

  return exprProps;
}

export function hasExprPropertiesChanged(
  schema: PlainObject,
  prevSchema: PlainObject
) {
  return Object.getOwnPropertyNames(schema).some(key => {
    let parts = /^(.*)(On|Expr|(?:c|C)lassName)(Raw)?$/.exec(key);
    if (parts) {
      return schema[key] !== prevSchema[key];
    }

    return false;
  });
}

export default getExprProperties;
