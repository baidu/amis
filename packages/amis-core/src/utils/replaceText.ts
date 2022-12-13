/**
 * 对文本进行替换
 */

import {cloneDeep} from 'lodash';
import {isObject, JSONTraverse} from './helper';

export function replaceText(
  schema: any,
  replaceText?: {[propName: string]: string},
  replaceTextIgnoreKeys?: String[]
) {
  if (!replaceText) {
    return schema;
  }
  const _schema = cloneDeep(schema);
  // 进行文本替换
  if (replaceText && isObject(replaceText)) {
    const replaceKeys = Object.keys(replaceText);
    replaceKeys.sort((a, b) => b.length - a.length); // 避免用户将短的放前面
    const IgnoreKeys = new Set(replaceTextIgnoreKeys || []);
    JSONTraverse(_schema, (value: any, key: string, object: any) => {
      if (typeof value === 'string' && !IgnoreKeys.has(key)) {
        for (const replaceKey of replaceKeys) {
          if (~value.indexOf(replaceKey)) {
            value = object[key] = value.replaceAll(
              replaceKey,
              replaceText[replaceKey]
            );
          }
        }
      }
    });
  }
  return _schema;
}
