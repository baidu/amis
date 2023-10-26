/**
 * 对文本进行替换
 */
import cloneDeep from 'lodash/cloneDeep';
import {isObject, JSONTraverse} from './helper';

export function replaceText(
  schema: any,
  replaceText?: {[propName: string]: string},
  replaceTextIgnoreKeys?:
    | String[]
    | ((key: string, value: any, object: any) => boolean)
) {
  // 进行文本替换
  if (replaceText && isObject(replaceText)) {
    let replicaSchema = cloneDeep(schema);
    const replaceKeys = Object.keys(replaceText);
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

    JSONTraverse(replicaSchema, (value: any, key: string, object: any) => {
      const descriptor = Object.getOwnPropertyDescriptor(object, key);
      if (
        typeof value === 'string' &&
        descriptor?.writable &&
        !ignore(key, value, object)
      ) {
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

    return replicaSchema;
  }
  return schema;
}
