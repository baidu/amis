import {Options} from '../types';
import isPlainObject from 'lodash/isPlainObject';

export function normalizeOptions(
  options: string | {[propName: string]: string} | Array<string> | Options,
  share: {
    values: Array<any>;
    options: Array<any>;
  } = {
    values: [],
    options: []
  },
  valueField = 'value'
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
    Array.isArray(options as Array<string>) &&
    typeof (options as Array<string>)[0] === 'string'
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
    return (options as Options)
      .filter(item => item !== null && item !== undefined)
      .map(item => {
        const value = item && item[valueField];
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

        if (typeof option.children !== 'undefined') {
          option.children = normalizeOptions(
            option.children,
            share,
            valueField
          );
        } else if (value !== undefined) {
          share.values.push(value);
          share.options.push(option);
        }

        return option;
      });
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
