import {extendsFilters, FilterContext, filters} from 'amis-formula';
import moment from 'moment';
import {makeSorter} from './makeSorter';
import transform from 'lodash/transform';
import groupBy from 'lodash/groupBy';
import uniqBy from 'lodash/uniqBy';
import uniq from 'lodash/uniq';
import {createObject, pickValues} from './object';
import {string2regExp} from './string2regExp';
import {resolveVariable} from './resolveVariable';
import {escapeHtml} from './escapeHtml';
import {formatDuration} from './formatDuration';
import {prettyBytes} from './prettyBytes';
import {stripNumber} from './stripNumber';
import {filterDate} from './date';

function conditionalFilter(
  input: any,
  hasAlternate: boolean,
  filterContext: FilterContext,
  test: any,
  trueValue: any,
  falseValue: any,
  astOffset: number = 1
) {
  debugger;

  (hasAlternate || test) && skipRestTest(filterContext.restFilters);
  const result = test ? trueValue : falseValue;
  const ast = test
    ? filterContext.filter?.args[0 + astOffset]
    : filterContext.filter?.args[1 + astOffset];

  return test || hasAlternate
    ? getStrOrVariable(result, filterContext.data, ast) ?? result
    : input;
}

/**
 * 如果当前传入字符为：'xxx'或者"xxx"，则返回字符xxx
 * 否则去数据域中，获取变量xxx
 *
 * @param value 传入字符
 * @param data 数据域
 */
function getStrOrVariable(value: any, data: any, ast?: any) {
  // 通过读取 ast 来判断，只有 literal 才可能是变量，也可能是字符串
  // 其他的直接返回值即可。
  if (ast?.type && ast.type !== 'literal') {
    return value;
  }

  return typeof value === 'string' && /,/.test(value)
    ? value.split(/\s*,\s*/).filter(item => item)
    : typeof value === 'string'
    ? resolveVariable(value, data)
    : value;
}

function str2array(list: any) {
  if (list && typeof list === 'string') {
    if (/^\[.*\]$/.test(list)) {
      return list
        .substring(1, list.length - 1)
        .split(/\s*,\s*/)
        .filter(item => item);
    } else {
      return list.split(/\s*,\s*/).filter(item => item);
    }
  }
  return list;
}

function skipRestTest(restFilters: Array<{name: string}>) {
  while (
    ~[
      'isTrue',
      'isFalse',
      'isMatch',
      'isEquals',
      'notMatch',
      'notEquals'
    ].indexOf(restFilters[0]?.name)
  ) {
    restFilters.shift();
  }
}

extendsFilters({
  map(input: Array<unknown>, fn: string, ...arg: any) {
    return Array.isArray(input) && filters[fn]
      ? input.map(item => filters[fn].call(this, item, ...arg))
      : input;
  },
  html: (input: string) => {
    if (input == null) {
      return input;
    }
    return escapeHtml(input);
  },
  json: (input, tabSize: number | string = 2) =>
    tabSize
      ? JSON.stringify(input, null, parseInt(tabSize as string, 10))
      : JSON.stringify(input),
  toJson: input => {
    // 如果不是字符串，不处理
    if (typeof input !== 'string') {
      return input;
    }

    try {
      return JSON.parse(input);
    } catch (e) {
      return null;
    }
  },
  toInt: input => (typeof input === 'string' ? parseInt(input, 10) : input),
  toFloat: input => (typeof input === 'string' ? parseFloat(input) : input),
  raw: input => input,
  now: () => new Date(),
  toDate: (input: any, inputFormat = '') => {
    const date = moment(input, inputFormat);
    return date.isValid() ? date.toDate() : undefined;
  },
  fromNow: (input: any, inputFormat = '') =>
    moment(input, inputFormat).fromNow(),
  dateModify: (
    input: any,
    modifier: 'add' | 'subtract' | 'endOf' | 'startOf' = 'add',
    amount = 0,
    unit = 'days'
  ) => {
    if (!(input instanceof Date)) {
      input = new Date();
    }

    if (modifier === 'endOf' || modifier === 'startOf') {
      return moment(input)
        [modifier === 'endOf' ? 'endOf' : 'startOf'](amount || 'day')
        .toDate();
    }

    return moment(input)
      [modifier === 'add' ? 'add' : 'subtract'](parseInt(amount, 10) || 0, unit)
      .toDate();
  },
  date: (input, format = 'LLL', inputFormat = 'X') =>
    moment(input, inputFormat).format(format),
  number: input => {
    let parts = String(input).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  },
  trim: input => (typeof input === 'string' ? input.trim() : input),
  percent: (input, decimals = 0) => {
    input = parseFloat(input) || 0;
    decimals = parseInt(decimals, 10) || 0;

    let whole = input * 100;
    let multiplier = Math.pow(10, decimals);

    return (
      (Math.round(whole * multiplier) / multiplier).toFixed(decimals) + '%'
    );
  },
  duration: input => (input ? formatDuration(input) : input),
  bytes: input => (input ? prettyBytes(parseFloat(input)) : input),
  round: (input, decimals = 2) => {
    if (isNaN(input)) {
      return 0;
    }

    decimals = parseInt(decimals, 10) ?? 2;

    let multiplier = Math.pow(10, decimals);
    return (Math.round(input * multiplier) / multiplier).toFixed(decimals);
  },
  truncate: (input, length, end) => {
    if (typeof input !== 'string') {
      return input;
    }

    end = end || '...';

    if (length == null) {
      return input;
    }

    length = parseInt(length, 10) || 200;

    return input.substring(0, length) + (input.length > length ? end : '');
  },
  url_encode: input => {
    if (input == null) {
      return '';
    }
    return encodeURIComponent(input);
  },
  url_decode: (input: string) => {
    let result;

    try {
      result = decodeURIComponent(input);
    } catch (e) {
      console.warn(
        `[amis] ${e?.name ?? 'URIError'}: input string is not valid.`
      );
    }
    return result;
  },
  default: (input, defaultValue, strict = false) =>
    (strict ? input : input ? input : undefined) ??
    (() => {
      try {
        if (defaultValue === 'undefined') {
          return undefined;
        }

        return JSON.parse(defaultValue);
      } catch (e) {
        return defaultValue;
      }
    })(),
  join: (input, glue) => (input && input.join ? input.join(glue) : input),
  split: (input, delimiter = ',') =>
    typeof input === 'string' ? input.split(delimiter) : input,
  sortBy: (
    input: any,
    key: string = '&',
    method: 'alpha' | 'numerical' = 'alpha',
    order?: 'asc' | 'desc'
  ) =>
    Array.isArray(input) ? input.sort(makeSorter(key, method, order)) : input,
  objectToArray: (
    input: any,
    label: string = 'label',
    value: string = 'value'
  ) =>
    transform(
      input,
      (result: any, v, k) => {
        (result || (result = [])).push({
          [label]: v,
          [value]: k
        });
      },
      []
    ),
  unique: (input: any, key?: string) =>
    Array.isArray(input) ? (key ? uniqBy(input, key) : uniq(input)) : input,
  topAndOther: (
    input: any,
    len: number = 10,
    labelField: string = 'name',
    restLabel = '其他'
  ) => {
    if (Array.isArray(input) && len) {
      const grouped = groupBy(input, (item: any) => {
        const index = input.indexOf(item) + 1;
        return index >= len ? len : index;
      });

      return Object.keys(grouped).map((key, index) => {
        const group = grouped[key];
        const obj = group.reduce((obj, item) => {
          Object.keys(item).forEach(key => {
            if (!obj.hasOwnProperty(key) || key === 'labelField') {
              obj[key] = item[key];
            } else if (
              typeof item[key] === 'number' &&
              typeof obj[key] === 'number'
            ) {
              obj[key] += item[key];
            } else if (
              typeof item[key] === 'string' &&
              /^(?:\-|\.)\d/.test(item[key]) &&
              typeof obj[key] === 'number'
            ) {
              obj[key] += parseFloat(item[key]) || 0;
            } else if (
              typeof item[key] === 'string' &&
              typeof obj[key] === 'string'
            ) {
              obj[key] += `, ${item[key]}`;
            } else {
              obj[key] = item[key];
            }
          });

          return obj;
        }, {});

        if (index === len - 1) {
          obj[labelField] = restLabel || '其他';
        }
        return obj;
      });
    }
    return input;
  },
  first: input => input && input[0],
  nth: (input, nth = 0) => input && input[nth],
  last: input => input && (input.length ? input[input.length - 1] : null),
  minus(input, step = 1) {
    return stripNumber(
      (Number(input) || 0) -
        Number(getStrOrVariable(step, this.data, this.filter?.args[0]))
    );
  },
  plus(input, step = 1) {
    return stripNumber(
      (Number(input) || 0) +
        Number(getStrOrVariable(step, this.data, this.filter?.args[0]))
    );
  },
  times(input, step = 1) {
    return stripNumber(
      (Number(input) || 0) *
        Number(getStrOrVariable(step, this.data, this.filter?.args[0]))
    );
  },
  division(input, step = 1) {
    return stripNumber(
      (Number(input) || 0) /
        Number(getStrOrVariable(step, this.data, this.filter?.args[0]))
    );
  },
  count: (input: any) =>
    Array.isArray(input) || typeof input === 'string' ? input.length : 0,
  sum: (input, field) => {
    if (!Array.isArray(input)) {
      return input;
    }
    const restult = input.reduce(
      (sum, item) =>
        sum + (parseFloat(field ? pickValues(field, item) : item) || 0),
      0
    );
    return stripNumber(restult);
  },
  abs: (input: any) => (typeof input === 'number' ? Math.abs(input) : input),
  pick: (input, path = '&') =>
    Array.isArray(input) && !/^\d+$/.test(path)
      ? input.map((item, index) =>
          pickValues(path, createObject({index}, item))
        )
      : pickValues(path, input),
  pick_if_exist: (input, path = '&') =>
    Array.isArray(input)
      ? input.map(item => resolveVariable(path, item) || item)
      : resolveVariable(path, input) || input,
  str2date: function (input, inputFormat = 'X', outputFormat = 'X') {
    return input
      ? filterDate(input, this.data, inputFormat).format(outputFormat)
      : '';
  },
  asArray: input => (Array.isArray(input) ? input : input ? [input] : input),
  concat(input, ...args: any[]) {
    return Array.isArray(input)
      ? input.concat(
          ...args.map((arg, index) =>
            getStrOrVariable(arg, this.data, this.filter?.args[index])
          )
        )
      : input;
  },
  filter: function (input, keys, expOrDirective, arg1) {
    if (!Array.isArray(input) || !keys || !expOrDirective) {
      return input;
    }

    let directive = expOrDirective;
    let fn: (value: any, key: string, item: any) => boolean = () => true;

    if (directive === 'isTrue') {
      fn = value => !!value;
    } else if (directive === 'isFalse') {
      fn = value => !value;
    } else if (directive === 'isExists') {
      fn = value => typeof value !== 'undefined';
    } else if (directive === 'equals' || directive === 'equal') {
      arg1 = arg1
        ? getStrOrVariable(arg1, this.data, this.filter?.args[2])
        : '';
      fn = value => arg1 == value;
    } else if (directive === 'isIn') {
      let list: any = arg1
        ? getStrOrVariable(arg1, this.data, this.filter?.args[2])
        : [];

      list = str2array(list);
      list = Array.isArray(list) ? list : list ? [list] : [];
      fn = value => (list.length ? !!~list.indexOf(value) : true);
    } else if (directive === 'notIn') {
      let list: Array<any> = arg1
        ? getStrOrVariable(arg1, this.data, this.filter?.args[2])
        : [];
      list = str2array(list);
      list = Array.isArray(list) ? list : list ? [list] : [];
      fn = value => !~list.indexOf(value);
    } else {
      if (directive !== 'match') {
        directive = 'match';
        arg1 = expOrDirective;
      }
      arg1 = arg1
        ? getStrOrVariable(arg1, this.data, this.filter?.args[2])
        : '';

      // 比对的值是空时直接返回。
      if (!arg1) {
        return input;
      }

      let reg = string2regExp(`${arg1}`, false);
      fn = value => reg.test(String(value));
    }

    // 判断keys是否为*
    const isAsterisk = /\s*\*\s*/.test(keys);
    keys = keys.split(/\s*,\s*/);
    return input.filter((item: any) =>
      // 当keys为*时从item中获取key
      (isAsterisk ? Object.keys(item) : keys).some((key: string) =>
        fn(resolveVariable(key, item), key, item)
      )
    );
  },
  base64Encode(str) {
    return btoa(
      encodeURIComponent(str).replace(
        /%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
          return String.fromCharCode(('0x' + p1) as any);
        }
      )
    );
  },

  base64Decode(str) {
    return decodeURIComponent(
      atob(str)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
  },

  substring: (input, start, end) => {
    return input && typeof input === 'string'
      ? input.substring(start, end)
      : input;
  },

  lowerCase: input =>
    input && typeof input === 'string' ? input.toLowerCase() : input,
  upperCase: input =>
    input && typeof input === 'string' ? input.toUpperCase() : input,

  isTrue(input, trueValue, falseValue) {
    const hasAlternate = arguments.length > 2;
    return conditionalFilter(
      input,
      hasAlternate,
      this,
      !!input,
      trueValue,
      falseValue,
      0
    );
  },
  isFalse(input, trueValue, falseValue) {
    const hasAlternate = arguments.length > 2;
    return conditionalFilter(
      input,
      hasAlternate,
      this,
      !input,
      trueValue,
      falseValue,
      0
    );
  },
  isMatch(input, matchArg, trueValue, falseValue) {
    const hasAlternate = arguments.length > 3;
    matchArg =
      getStrOrVariable(matchArg, this.data as any, this.filter?.args[0]) ??
      matchArg;
    return conditionalFilter(
      input,
      hasAlternate,
      this,
      matchArg && string2regExp(`${matchArg}`, false).test(String(input)),
      trueValue,
      falseValue
    );
  },
  notMatch(input, matchArg, trueValue, falseValue) {
    const hasAlternate = arguments.length > 3;
    matchArg =
      getStrOrVariable(matchArg, this.data as any, this.filter?.args[0]) ??
      matchArg;
    return conditionalFilter(
      input,
      hasAlternate,
      this,
      matchArg && !string2regExp(`${matchArg}`, false).test(String(input)),
      trueValue,
      falseValue
    );
  },
  isEquals(input, equalsValue, trueValue, falseValue) {
    equalsValue =
      getStrOrVariable(equalsValue, this.data as any, this.filter?.args[0]) ??
      equalsValue;

    const hasAlternate = arguments.length > 3;
    return conditionalFilter(
      input,
      hasAlternate,
      this,
      input === equalsValue,
      trueValue,
      falseValue
    );
  },
  notEquals(input, equalsValue, trueValue, falseValue) {
    equalsValue =
      getStrOrVariable(equalsValue, this.data as any, this.filter?.args[0]) ??
      equalsValue;

    const hasAlternate = arguments.length > 3;
    return conditionalFilter(
      input,
      hasAlternate,
      this,
      input !== equalsValue,
      trueValue,
      falseValue
    );
  }
});
