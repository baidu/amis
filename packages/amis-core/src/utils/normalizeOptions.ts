import {Options} from '../types';
import isPlainObject from 'lodash/isPlainObject';
import {filterTree, mapTree} from './helper';

export function normalizeOptions(
  options:
    | string
    | {[propName: string]: string}
    | Array<string | number>
    | Options,
  share: {
    values: Array<any>;
    options: Array<any>;
  } = {
    values: [],
    options: []
  },
  valueField = 'value',
  enableNodePath = false,
  pathSeparator = '/'
): Options {
  if (typeof options === 'string') {
    return options.split(',').map(item => {
      const idx = share.values.indexOf(item);
      if (~idx) {
        return share.options[idx];
      }

      const option = {
        label: item,
        // 添加 option 的 value 根据 valueField 来
        // 否则某些情况下多余字段会有影响
        [valueField]: item
      };

      share.values.push(option.value);
      share.options.push(option);

      return option;
    });
  } else if (
    Array.isArray(options as Array<string | number>) &&
    (typeof (options as Array<string | number>)[0] === 'string' ||
      typeof (options as Array<string | number>)[0] === 'number')
  ) {
    return (options as Array<string>).map(item => {
      const idx = share.values.indexOf(item);
      if (~idx) {
        return share.options[idx];
      }

      const option = {
        label: item,
        [valueField]: item
      };

      share.values.push(option[valueField]);
      share.options.push(option);

      return option;
    });
  } else if (Array.isArray(options as Options)) {
    return mapTree(
      filterTree(
        options as Options,
        item => item !== null && item !== undefined
      ),
      (item, key, level, paths) => {
        let value = item && item[valueField];

        // 如果开启了路径模式，则将 value 转成 'xxx/xxx' 的形式
        if (typeof value === 'string' && value.includes(pathSeparator)) {
          // 已经是这种形式了，不处理
        } else if (enableNodePath && paths && paths.length) {
          const values = paths
            .map(p => p[valueField])
            .filter(item => typeof item !== 'undefined');
          const last = values[paths.length - 1];
          if (typeof last === 'string' && last.includes(pathSeparator)) {
            value = last + pathSeparator + value;
          } else if (values.length) {
            values.push(value);
            value = values.join(pathSeparator);
          }
        }

        const idx =
          value !== undefined && !item.children
            ? share.values.indexOf(value)
            : -1;

        if (~idx) {
          return share.options[idx];
        }

        const option = {
          ...item,
          [valueField]: value
        };

        return option;
      }
    );
  } else if (isPlainObject(options)) {
    return Object.keys(options).map(key => {
      const idx = share.values.indexOf(key);
      if (~idx) {
        return share.options[idx];
      }

      const option = {
        label: (options as {[propName: string]: string})[key] as string,
        [valueField]: key
      };

      share.values.push(option.value);
      share.options.push(option);

      return option;
    });
  }

  return [];
}
