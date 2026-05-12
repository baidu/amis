import {registerTplEnginer, filter, Enginer} from './tpl';
import template from 'lodash/template';
import {getFilters} from './tpl-builtin';
import React from 'react';
import moment from 'moment';

const imports = {
  default: undefined,
  moment: moment,
  countDown: (end: any) => {
    if (!end) {
      return '--';
    }

    let date = new Date(parseInt(end, 10) * 1000);
    let now = Date.now();

    if (date.getTime() < now) {
      return '已结束';
    }

    return Math.ceil((date.getTime() - now) / (1000 * 60 * 60 * 24)) + '天';
  },
  formatDate: (
    value: any,
    format: string = 'LLL',
    inputFormat: string = ''
  ) => {
    // 当模板里 value 是用户配置 / 接口返回的脏数据时：
    //   1) 字符串解析失败时 moment(value, inputFormat) 返回 invalid moment，
    //      .format() 静默返回字符串 "Invalid date" 直接渲染到页面里。
    //   2) value 为 null/undefined 时 moment 默认会回退到 "现在"（now），
    //      会让 typo 字段（如 data.creatAt）静默渲染成今天的日期。
    // 这里两种情况都做守卫：null/undefined 回显空串，无法解析回显原值。
    if (value == null || value === '') {
      return '';
    }
    const m = moment(value, inputFormat);
    if (!m.isValid()) {
      return String(value);
    }
    return m.format(format);
  }
};

// 缓存一下提升性能
const EVAL_CACHE: {[key: string]: Function} = {};

function lodashCompile(str: string, data: object) {
  try {
    const filters = getFilters();
    const finnalImports = {
      ...filters,
      formatTimeStamp: filters.date,
      formatNumber: filters.number,
      defaultValue: filters.defaut,
      ...imports
    };
    delete finnalImports.default; // default 是个关键字，不能 imports 到 lodash 里面去。
    const fn =
      EVAL_CACHE[str] ||
      (EVAL_CACHE[str] = template(str, {
        imports: finnalImports,
        variable: 'data',

        // 如果不传这个，默认模板语法也存在 ${xxx} 语法，这个跟内置语法规则冲突。
        // 为了不带来困惑，禁用掉这种用法。
        interpolate: /<%=([\s\S]+?)%>/g
      }));

    return fn.call(data, data);
  } catch (e) {
    return `<span class="text-danger">${e.message}</span>`;
  }
}

export function register(): Enginer & {name: string} {
  return {
    name: 'lodash',
    test: (str: string) => !!~str.indexOf('<%'),
    compile: (str: string, data: object) => lodashCompile(str, data),
    asyncCompile: (str: string, data: object) => lodashCompile(str, data)
  };
}
