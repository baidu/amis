import moment from 'moment';
import {PlainObject} from '../types';
import isPlainObject from 'lodash/isPlainObject';
import groupBy from 'lodash/groupBy';
import {
  createObject,
  isObject,
  setVariable,
  qsstringify,
  keyToPath,
  string2regExp,
  deleteVariable
} from './helper';
import {Enginer} from './tpl';
import uniqBy from 'lodash/uniqBy';
import uniq from 'lodash/uniq';
import transform from 'lodash/transform';

const UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

export const prettyBytes = (num: number) => {
  if (!Number.isFinite(num)) {
    throw new TypeError(`Expected a finite number, got ${typeof num}: ${num}`);
  }

  const neg = num < 0;

  if (neg) {
    num = -num;
  }

  if (num < 1) {
    return (neg ? '-' : '') + num + ' B';
  }

  const exponent = Math.min(
    Math.floor(Math.log(num) / Math.log(1000)),
    UNITS.length - 1
  );
  const numStr = Number((num / Math.pow(1000, exponent)).toPrecision(3));
  const unit = UNITS[exponent];

  return (neg ? '-' : '') + numStr + ' ' + unit;
};

const entityMap: {
  [propName: string]: string;
} = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;'
};
export const escapeHtml = (str: string) =>
  String(str).replace(/[&<>"'\/]/g, function (s) {
    return entityMap[s];
  });

export function formatDuration(value: number): string {
  const unit = ['秒', '分', '时', '天', '月', '季', '年'];
  const steps = [1, 60, 3600, 86400, 2592000, 7776000, 31104000];
  let len = steps.length;
  const parts = [];

  while (len--) {
    if (steps[len] && value >= steps[len]) {
      parts.push(Math.floor(value / steps[len]) + unit[len]);
      value %= steps[len];
    } else if (len === 0 && value) {
      parts.push((value.toFixed ? value.toFixed(2) : '0') + unit[0]);
    }
  }

  return parts.join('');
}

function makeSorter(
  key: string,
  method?: 'alpha' | 'numerical',
  order?: 'desc' | 'asc'
) {
  return function (a: any, b: any) {
    if (!a || !b) {
      return 0;
    }

    const va = resolveVariable(key, a);
    const vb = resolveVariable(key, b);
    let result = 0;

    if (method === 'numerical') {
      result = (parseFloat(va) || 0) - (parseFloat(vb) || 0);
    } else {
      result = String(va).localeCompare(String(vb));
    }

    return result * (order === 'desc' ? -1 : 1);
  };
}

const timeUnitMap: {
  [propName: string]: string;
} = {
  year: 'Y',
  month: 'M',
  week: 'w',
  weekday: 'W',
  day: 'd',
  hour: 'h',
  minute: 'm',
  min: 'm',
  second: 's',
  millisecond: 'ms'
};

export const relativeValueRe =
  /^(.+)?(\+|-)(\d+)(minute|min|hour|day|week|month|year|weekday|second|millisecond)s?$/i;
export const filterDate = (
  value: string,
  data: object = {},
  format = 'X',
  utc: boolean = false
): moment.Moment => {
  let m,
    mm = utc ? moment.utc : moment;

  if (typeof value === 'string') {
    value = value.trim();
  }

  value = tokenize(value, data);

  if (value && typeof value === 'string' && (m = relativeValueRe.exec(value))) {
    const date = new Date();
    const step = parseInt(m[3], 10);
    const from = m[1]
      ? filterDate(m[1], data, format, utc)
      : mm(
          /(minute|min|hour|second)s?/.test(m[4])
            ? [
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
                date.getHours(),
                date.getMinutes(),
                date.getSeconds()
              ]
            : [date.getFullYear(), date.getMonth(), date.getDate()]
        );

    return m[2] === '-'
      ? from.subtract(step, timeUnitMap[m[4]] as moment.DurationInputArg2)
      : from.add(step, timeUnitMap[m[4]] as moment.DurationInputArg2);
    //   return from[m[2] === '-' ? 'subtract' : 'add'](step, mapping[m[4]] || m[4]);
  } else if (value === 'now') {
    return mm();
  } else if (value === 'today') {
    const date = new Date();
    return mm([date.getFullYear(), date.getMonth(), date.getDate()]);
  } else {
    return mm(value, format);
  }
};

export function parseDuration(str: string): moment.Duration | undefined {
  const matches =
    /^((?:\-|\+)?(?:\d*\.)?\d+)(minute|min|hour|day|week|month|quarter|year|weekday|second|millisecond)s?$/.exec(
      str
    );

  if (matches) {
    const duration = moment.duration(parseFloat(matches[1]), matches[2] as any);

    if (moment.isDuration(duration)) {
      return duration;
    }
  }

  return;
}

// 主要用于解决 0.1+0.2 结果的精度问题导致太长
export function stripNumber(number: number) {
  if (typeof number === 'number') {
    return parseFloat(number.toPrecision(12));
  } else {
    return number;
  }
}

export const filters: {
  [propName: string]: (input: any, ...args: any[]) => any;
} = {
  map: (input: Array<unknown>, fn: string, ...arg: any) =>
    Array.isArray(input) && filters[fn]
      ? input.map(item => filters[fn](item, ...arg))
      : input,
  html: (input: string) => escapeHtml(input),
  json: (input, tabSize: number | string = 2) =>
    tabSize
      ? JSON.stringify(input, null, parseInt(tabSize as string, 10))
      : JSON.stringify(input),
  toJson: input => {
    let ret;
    try {
      ret = JSON.parse(input);
    } catch (e) {
      ret = null;
    }
    return ret;
  },
  toInt: input => (typeof input === 'string' ? parseInt(input, 10) : input),
  toFloat: input => (typeof input === 'string' ? parseFloat(input) : input),
  raw: input => input,
  now: () => new Date(),
  toDate: (input: any, inputFormat = '') => {
    const data = moment(input, inputFormat);
    data.add();
    return data.isValid() ? data.toDate() : undefined;
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
  url_encode: input => encodeURIComponent(input),
  url_decode: input => decodeURIComponent(input),
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
    key: string,
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
      (Number(input) || 0) - Number(getStrOrVariable(step, this))
    );
  },
  plus(input, step = 1) {
    return stripNumber(
      (Number(input) || 0) + Number(getStrOrVariable(step, this))
    );
  },
  times(input, step = 1) {
    return stripNumber(
      (Number(input) || 0) * Number(getStrOrVariable(step, this))
    );
  },
  division(input, step = 1) {
    return stripNumber(
      (Number(input) || 0) / Number(getStrOrVariable(step, this))
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
      ? filterDate(input, this, inputFormat).format(outputFormat)
      : '';
  },
  asArray: input => (Array.isArray(input) ? input : input ? [input] : input),
  concat(input, ...args: any[]) {
    return Array.isArray(input)
      ? input.concat(...args.map(arg => getStrOrVariable(arg, this)))
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
      arg1 = arg1 ? getStrOrVariable(arg1, this) : '';
      fn = value => arg1 == value;
    } else if (directive === 'isIn') {
      let list: any = arg1 ? getStrOrVariable(arg1, this) : [];

      list = str2array(list);
      list = Array.isArray(list) ? list : list ? [list] : [];
      fn = value => (list.length ? !!~list.indexOf(value) : true);
    } else if (directive === 'notIn') {
      let list: Array<any> = arg1 ? getStrOrVariable(arg1, this) : [];
      list = str2array(list);
      list = Array.isArray(list) ? list : list ? [list] : [];
      fn = value => !~list.indexOf(value);
    } else {
      if (directive !== 'match') {
        directive = 'match';
        arg1 = expOrDirective;
      }
      arg1 = arg1 ? getStrOrVariable(arg1, this) : '';

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

  lowerCase: input =>
    input && typeof input === 'string' ? input.toLowerCase() : input,
  upperCase: input =>
    input && typeof input === 'string' ? input.toUpperCase() : input,

  isTrue(input, trueValue, falseValue) {
    return getConditionValue(input, !!input, trueValue, falseValue, this);
  },
  isFalse(input, trueValue, falseValue) {
    return getConditionValue(input, !input, trueValue, falseValue, this);
  },
  isMatch(input, matchArg, trueValue, falseValue) {
    matchArg = getStrOrVariable(matchArg, this as any);
    return getConditionValue(
      input,
      matchArg && string2regExp(`${matchArg}`, false).test(String(input)),
      trueValue,
      falseValue,
      this
    );
  },
  notMatch(input, matchArg, trueValue, falseValue) {
    matchArg = getStrOrVariable(matchArg, this as any);
    return getConditionValue(
      input,
      matchArg && !string2regExp(`${matchArg}`, false).test(String(input)),
      trueValue,
      falseValue,
      this
    );
  },
  isEquals(input, equalsValue, trueValue, falseValue) {
    equalsValue = /^\d+$/.test(equalsValue)
      ? parseInt(equalsValue, 10)
      : getStrOrVariable(equalsValue, this as any);
    return getConditionValue(
      input,
      input === equalsValue,
      trueValue,
      falseValue,
      this
    );
  },
  notEquals(input, equalsValue, trueValue, falseValue) {
    equalsValue = /^\d+$/.test(equalsValue)
      ? parseInt(equalsValue, 10)
      : getStrOrVariable(equalsValue, this as any);
    return getConditionValue(
      input,
      input !== equalsValue,
      trueValue,
      falseValue,
      this
    );
  }
};

/**
 * 如果当前传入字符为：'xxx'或者"xxx"，则返回字符xxx
 * 否则去数据域中，获取变量xxx
 *
 * @param value 传入字符
 * @param data 数据域
 */
function getStrOrVariable(value: string, data: any) {
  return /^('|")(.*)\1$/.test(value)
    ? RegExp.$2
    : /^-?\d+$/.test(value)
    ? parseInt(value, 10)
    : /^(-?\d+)\.\d+?$/.test(value)
    ? parseFloat(value)
    : /^\[.*\]$/.test(value)
    ? value
        .substring(1, value.length - 1)
        .split(/\s*,\s*/)
        .filter(item => item)
    : /,/.test(value)
    ? value.split(/\s*,\s*/).filter(item => item)
    : resolveVariable(value, data);
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

function getConditionValue(
  input: string,
  isTrue: boolean,
  trueValue: string,
  falseValue: string,
  data: any
) {
  return isTrue || (!isTrue && falseValue)
    ? getStrOrVariable(isTrue ? trueValue : falseValue, data)
    : input;
}

export function registerFilter(
  name: string,
  fn: (input: any, ...args: any[]) => any
): void {
  filters[name] = fn;
}

export function getFilters() {
  return filters;
}

export function pickValues(names: string, data: object) {
  let arr: Array<string>;
  if (!names || ((arr = names.split(',')) && arr.length < 2)) {
    let idx = names.indexOf('~');
    if (~idx) {
      let key = names.substring(0, idx);
      let target = names.substring(idx + 1);
      return {
        [key]: resolveVariable(target, data)
      };
    }
    return resolveVariable(names, data);
  }

  let ret: any = {};
  arr.forEach(name => {
    let idx = name.indexOf('~');
    let target = name;

    if (~idx) {
      target = name.substring(idx + 1);
      name = name.substring(0, idx);
    }

    setVariable(ret, name, resolveVariable(target, data));
  });
  return ret;
}

function objectGet(data: any, path: string) {
  if (typeof data[path] !== 'undefined') {
    return data[path];
  }

  let parts = keyToPath(path.replace(/^{|}$/g, ''));
  return parts.reduce((data, path) => {
    if ((isObject(data) || Array.isArray(data)) && path in data) {
      return (data as {[propName: string]: any})[path];
    }

    return undefined;
  }, data);
}

function parseJson(str: string, defaultValue?: any) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return defaultValue;
  }
}

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()!.split(';').shift();
  }
  return undefined;
}

export const resolveVariable = (path?: string, data: any = {}): any => {
  if (!path || !data || typeof path !== 'string') {
    return undefined;
  }

  let [ns, varname] = path.split(':');

  if (!varname && ns) {
    varname = ns;
    ns = '';
  }

  if (ns === 'window') {
    data = window;
  } else if (ns === 'ls' || ns === 'ss') {
    let parts = keyToPath(varname.replace(/^{|}$/g, ''));
    const key = parts.shift()!;
    const raw =
      ns === 'ss' ? sessionStorage.getItem(key) : localStorage.getItem(key);

    if (typeof raw === 'string') {
      const data = parseJson(raw, raw);

      if (isObject(data) && parts.length) {
        return objectGet(data, parts.join('.'));
      }

      return data;
    }

    return undefined;
  } else if (ns === 'cookie') {
    const key = varname.replace(/^{|}$/g, '').trim();
    return getCookie(key);
  }

  if (varname === '$$') {
    return data;
  } else if (varname[0] === '$') {
    varname = path.substring(1);
  } else if (varname === '&') {
    return data;
  }

  return objectGet(data, varname);
};

export function isPureVariable(path?: any): path is string {
  return typeof path === 'string'
    ? /^\$(?:((?:\w+\:)?[a-z0-9_.][a-z0-9_.\[\]]*)|{[^}{]+})$/i.test(path)
    : false;
}
export const resolveVariableAndFilter = (
  path?: string,
  data: object = {},
  defaultFilter: string = '| html',
  fallbackValue = (value: any) => value
): any => {
  if (!path) {
    return undefined;
  }

  const m =
    /^(\\)?\$(?:((?:\w+\:)?[a-z0-9_.][a-z0-9_.\[\]]*)|{([\s\S]+)})$/i.exec(
      path
    );

  if (!m) {
    return undefined;
  }

  const [_, escape, key, key2] = m;

  // 如果是转义如： `\$abc` => `$abc`
  if (escape) {
    return _.substring(1);
  }

  let finalKey: string = key || key2;

  // 先只支持一层吧
  finalKey = finalKey.replace(
    /(\\|\\\$)?\$(?:([a-zA-Z0-9_.][a-zA-Z0-9_.\[\]]*)|{([^}{]+)})/g,
    (_, escape) => {
      return escape
        ? _.substring(1)
        : resolveVariableAndFilter(_, data, defaultFilter);
    }
  );

  // 默认 html 转义
  if (!~finalKey.indexOf('|')) {
    finalKey += defaultFilter;
  }

  let paths = finalKey.split(/\s*\|\s*/g);
  let originalKey = finalKey;
  finalKey = paths.shift() as string;

  let ret = resolveVariable(finalKey, data);

  let prevConInputChanged = false; // 前一个类三元过滤器生效，则跳过后续类三元过滤器

  return ret == null &&
    !~originalKey.indexOf('default') &&
    !~originalKey.indexOf('now')
    ? fallbackValue(ret)
    : paths.reduce((input, filter) => {
        let params = filter
          .replace(
            /([^\\])\\([\:\\])/g,
            (_, affix, content) =>
              `${affix}__${content === ':' ? 'colon' : 'slash'}__`
          )
          .split(':')
          .map(item =>
            item.replace(/__(slash|colon)__/g, (_, type) =>
              type === 'colon' ? ':' : '\\'
            )
          );
        let key = params.shift() as string;

        if (
          ~[
            'isTrue',
            'isFalse',
            'isMatch',
            'isEquals',
            'notMatch',
            'notEquals'
          ].indexOf(key)
        ) {
          if (prevConInputChanged) {
            return input;
          } else {
            const result = filters[key].call(data, input, ...params);
            prevConInputChanged = result !== input;
            return result;
          }
        } else {
          // 后面再遇到非类三元filter就重置了吧，不影响再后面的其他三元filter
          prevConInputChanged = false;
        }

        return (filters[key] || filters.raw).call(data, input, ...params);
      }, ret);
};

export const tokenize = (
  str: string,
  data: object,
  defaultFilter: string = '| html'
) => {
  if (!str || typeof str !== 'string') {
    return str;
  }

  return str.replace(
    /(\\)?\$(?:((?:\w+\:)?[a-z0-9_\.][a-z0-9_\.\[\]]*|&|\$)|{([^}{]+?)})/gi,
    (_, escape, key1, key2, index, source) => {
      if (!escape && key1 === '$') {
        const prefix = source[index - 1];
        return prefix === '='
          ? encodeURIComponent(JSON.stringify(data))
          : qsstringify(data);
      }

      return escape
        ? _.substring(1)
        : resolveVariableAndFilter(_, data, defaultFilter) ?? '';
    }
  );
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
    compile: (str: string, data: object, defaultFilter = '| html') =>
      tokenize(str, data, defaultFilter)
  };
}
