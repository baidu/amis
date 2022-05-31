import {PlainObject} from '../types';
import {isPureVariable} from './isPureVariable';
import {resolveVariableAndFilter} from './resolveVariableAndFilter';
import {tokenize} from './tokenize';
import isPlainObject from 'lodash/isPlainObject';
import {createObject, deleteVariable, setVariable} from './object';

export function resolveMapping(
  value: any,
  data: PlainObject,
  defaultFilter = '| raw'
) {
  return typeof value === 'string' && isPureVariable(value)
    ? resolveVariableAndFilter(value, data, defaultFilter, () => '')
    : typeof value === 'string' && ~value.indexOf('$')
    ? tokenize(value, data, defaultFilter)
    : value;
}

export function dataMapping(
  to: any,
  from: PlainObject = {},
  ignoreFunction: boolean | ((key: string, value: any) => boolean) = false,
  convertKeyToPath?: boolean
): any {
  if (Array.isArray(to)) {
    return to.map(item =>
      dataMapping(item, from, ignoreFunction, convertKeyToPath)
    );
  } else if (typeof to === 'string') {
    return resolveMapping(to, from);
  } else if (!isPlainObject(to)) {
    return to;
  }

  let ret = {};
  Object.keys(to).forEach(key => {
    const value = to[key];
    let keys: Array<string>;

    if (typeof ignoreFunction === 'function' && ignoreFunction(key, value)) {
      // 如果被ignore，不做数据映射处理。
      setVariable(ret, key, value, convertKeyToPath);
    } else if (key === '&' && value === '$$') {
      ret = {
        ...ret,
        ...from
      };
    } else if (key === '&') {
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
                convertKeyToPath
              )
            )
          : resolveMapping(value, from);

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
    } else if (value === '$$') {
      setVariable(ret, key, from, convertKeyToPath);
    } else if (value && value[0] === '$') {
      const v = resolveMapping(value, from);
      setVariable(ret, key, v, convertKeyToPath);

      if (v === '__undefined') {
        deleteVariable(ret, key);
      }
    } else if (
      isPlainObject(value) &&
      (keys = Object.keys(value)) &&
      keys.length === 1 &&
      keys[0][0] === '$' &&
      isPlainObject(value[keys[0]])
    ) {
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
      const arr = Array.isArray(from[keys[0].substring(1)])
        ? from[keys[0].substring(1)]
        : [];
      const mapping = value[keys[0]];

      (ret as PlainObject)[key] = arr.map((raw: object) =>
        dataMapping(
          mapping,
          createObject(from, raw),
          ignoreFunction,
          convertKeyToPath
        )
      );
    } else if (isPlainObject(value)) {
      setVariable(
        ret,
        key,
        dataMapping(value, from, ignoreFunction, convertKeyToPath),
        convertKeyToPath
      );
    } else if (Array.isArray(value)) {
      setVariable(
        ret,
        key,
        value.map((value: any) =>
          isPlainObject(value)
            ? dataMapping(value, from, ignoreFunction, convertKeyToPath)
            : resolveMapping(value, from)
        ),
        convertKeyToPath
      );
    } else if (typeof value == 'string' && ~value.indexOf('$')) {
      setVariable(ret, key, resolveMapping(value, from), convertKeyToPath);
    } else if (typeof value === 'function' && ignoreFunction !== true) {
      setVariable(ret, key, value(from), convertKeyToPath);
    } else {
      setVariable(ret, key, value, convertKeyToPath);

      if (value === '__undefined') {
        deleteVariable(ret, key);
      }
    }
  });

  return ret;
}
