import {PlainObject} from '../types';
import {isPureVariable} from './isPureVariable';
import {resolveVariableAndFilter} from './resolveVariableAndFilter';
import {tokenize} from './tokenize';
import isPlainObject from 'lodash/isPlainObject';
import {createObject, deleteVariable, setVariable} from './object';

export function resolveMapping(
  value: any,
  data: PlainObject,
  defaultFilter = '| raw',
  ignoreIfNotMatch = false
) {
  const result =
    typeof value === 'string' && isPureVariable(value)
      ? resolveVariableAndFilter(value, data, defaultFilter, () => '')
      : typeof value === 'string' && ~value.indexOf('$')
      ? tokenize(value, data, defaultFilter)
      : value;

  if (ignoreIfNotMatch && (result == null || result === '')) {
    return value;
  }

  return result;
}

/**
 * 遍历对象，对每个字符串 key 进行数据映射
 * @param value 要映射的对象
 * @param data 数据上下文
 */
export function resolveMappingObject(value: PlainObject, data: PlainObject) {
  for (const key of Object.keys(value)) {
    if (typeof value[key] === 'string') {
      value[key] = resolveMapping(value[key], data);
    }
  }
  return value;
}

export function dataMapping(
  to: any,
  from: PlainObject = {},
  ignoreFunction: boolean | ((key: string, value: any) => boolean) = false,
  convertKeyToPath?: boolean,
  ignoreIfNotMatch = false
): any {
  if (Array.isArray(to)) {
    return to.map(item =>
      dataMapping(
        item,
        from,
        ignoreFunction,
        convertKeyToPath,
        ignoreIfNotMatch
      )
    );
  } else if (typeof to === 'string') {
    return resolveMapping(to, from, undefined, ignoreIfNotMatch);
  } else if (!isPlainObject(to)) {
    return to;
  }

  let ret = {};
  const keys = Object.keys(to);

  if (keys.length === 1 && keys[0][0] === '$' && isPlainObject(to[keys[0]])) {
    // from[keys[0].substring(1)] &&
    // Array.isArray(from[keys[0].substring(1)])
    // 支持只取数组中的部分值这个需求
    // 如:
    // data: {
    //   items: {
    //     '$rows': {
    //        id: '$id',
    //        forum_id: '$forum_id'
    //      }
    //   }
    // }
    const left = resolveMapping(keys[0], from, '| raw');
    if (!Array.isArray(left) && ignoreIfNotMatch) {
      (ret as PlainObject)[keys[0]] = to[keys[0]];
    } else {
      const arr = Array.isArray(left) ? left : [];
      const mapping = to[keys[0]];

      ret = arr.map((raw: object) =>
        dataMapping(
          mapping,
          createObject(from, {
            item: raw,
            ...raw
          }),
          ignoreFunction,
          convertKeyToPath,
          ignoreIfNotMatch
        )
      );
    }
  } else {
    const objectKeys = Object.keys(to);
    // 如果存在  '&' 作为 key，则特殊处理
    // 就是无论这个 key 的位置在什么地方始终都是当放在最前面
    const idx = objectKeys.indexOf('&');
    if (~idx) {
      const value = to['&'];
      objectKeys.splice(idx, 1);

      if (value === '$$') {
        ret = {
          ...ret,
          ...from
        };
      } else {
        let keys: Array<string>;
        const v =
          isPlainObject(value) &&
          (keys = Object.keys(value)) &&
          keys.length === 1 &&
          from[keys[0].substring(1)] &&
          Array.isArray(from[keys[0].substring(1)])
            ? from[keys[0].substring(1)].map((raw: object) =>
                dataMapping(
                  value[keys[0]],
                  createObject(from, raw),
                  ignoreFunction,
                  convertKeyToPath,
                  ignoreIfNotMatch
                )
              )
            : resolveMapping(value, from, undefined, ignoreIfNotMatch);

        if (Array.isArray(v) || typeof v === 'string') {
          ret = v;
        } else if (typeof v === 'function') {
          ret = {
            ...ret,
            ...v(from)
          };
        } else {
          ret = {
            ...ret,
            ...v
          };
        }
      }
    }

    objectKeys.forEach(key => {
      const value = to[key];

      if (typeof ignoreFunction === 'function' && ignoreFunction(key, value)) {
        // 如果被ignore，不做数据映射处理。
        setVariable(ret, key, value, convertKeyToPath);
      } else if (value === '$$') {
        setVariable(ret, key, from, convertKeyToPath);
      } else if (
        typeof value === 'string' &&
        value.length > 0 &&
        value[0] === '$'
      ) {
        const v = resolveMapping(value, from, undefined, ignoreIfNotMatch);
        setVariable(ret, key, v, convertKeyToPath);

        if (v === '__undefined') {
          deleteVariable(ret, key);
        }
      } else if (isPlainObject(value) || Array.isArray(value)) {
        setVariable(
          ret,
          key,
          dataMapping(
            value,
            from,
            ignoreFunction,
            convertKeyToPath,
            ignoreIfNotMatch
          ),
          convertKeyToPath
        );
      } else if (typeof value == 'string' && ~value.indexOf('$')) {
        setVariable(
          ret,
          key,
          resolveMapping(value, from, undefined, ignoreIfNotMatch),
          convertKeyToPath
        );
      } else if (typeof value === 'function' && ignoreFunction !== true) {
        setVariable(ret, key, value(from), convertKeyToPath);
      } else {
        setVariable(ret, key, value, convertKeyToPath);

        if (value === '__undefined') {
          deleteVariable(ret, key);
        }
      }
    });
  }

  return ret;
}
