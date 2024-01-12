/**
 * 对文本进行替换
 */
import cloneDeep from 'lodash/cloneDeep';
import {isObject, JSONValueMap} from './helper';

export function replaceText(
  schema: any,
  replaceText?: {[propName: string]: string},
  replaceTextIgnoreKeys?:
    | String[]
    | ((key: string, value: any, object: any) => boolean)
) {
  // 进行文本替换
  if (replaceText && isObject(replaceText)) {
    const replaceKeys = Object.keys(replaceText);
    if (!replaceKeys.length) {
      return schema;
    }
    replaceKeys.sort((a, b) => b.length - a.length); // 避免用户将短的放前面
    const IgnoreKeys = new Set(
      Array.isArray(replaceTextIgnoreKeys) ? replaceTextIgnoreKeys : []
    );
    const ignore =
      typeof replaceTextIgnoreKeys === 'function'
        ? replaceTextIgnoreKeys
        : (key: string) => {
            return IgnoreKeys.has(key);
          };

    return JSONValueMap(schema, (value: any, key: string, object: any) => {
      if (typeof value === 'string' && !ignore(key, value, object)) {
        for (const replaceKey of replaceKeys) {
          if (~value.indexOf(replaceKey)) {
            return value.replaceAll(replaceKey, replaceText[replaceKey]);
          }
        }
      }
      return value;
    });
  }
  return schema;
}
