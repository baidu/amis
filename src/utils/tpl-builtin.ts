import {PlainObject} from '../types';
import isPlainObject from 'lodash/isPlainObject';
import {createObject, setVariable, deleteVariable} from './helper';
import {Enginer} from './tpl';
import {
  prettyBytes,
  escapeHtml,
  formatDuration,
  filterDate,
  relativeValueRe,
  parseDuration,
  getFilters,
  registerFilter,
  pickValues,
  resolveVariable,
  isPureVariable,
  resolveVariableAndFilter,
  tokenize,
  stripNumber
} from 'amis-formula';

export {
  prettyBytes,
  escapeHtml,
  formatDuration,
  filterDate,
  relativeValueRe,
  parseDuration,
  getFilters,
  registerFilter,
  pickValues,
  resolveVariable,
  isPureVariable,
  resolveVariableAndFilter,
  tokenize,
  stripNumber
};

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

function matchSynatax(str: string) {
  let from = 0;
  while (true) {
    const idx = str.indexOf('$', from);
    if (~idx) {
      const nextToken = str[idx + 1];

      // 如果没有下一个字符，或者下一个字符是引号或者空格
      // 这个一般不是取值用法
      if (!nextToken || ~['"', "'", ' '].indexOf(nextToken)) {
        from = idx + 1;
        continue;
      }

      // 如果上个字符是转义也不是取值用法
      const prevToken = str[idx - 1];
      if (prevToken && prevToken === '\\') {
        from = idx + 1;
        continue;
      }

      return true;
    } else {
      break;
    }
  }
  return false;
}

export function register(): Enginer & {name: string} {
  return {
    name: 'builtin',
    test: (str: string) => typeof str === 'string' && matchSynatax(str),
    removeEscapeToken: (str: string) =>
      typeof str === 'string' ? str.replace(/\\\$/g, '$') : str,
    compile: (str: string, data: object, defaultFilter = '| html') => {
      try {
        return tokenize(str, data, defaultFilter);
      } catch (e) {
        return `error: ${e.message}`;
      }
    }
  };
}
