import {reigsterTplEnginer, filter} from './tpl';
import template = require('lodash/template');
import {filters} from './tpl-builtin';
import React from 'react';
import moment from 'moment';

const imports = {
  ...filters,
  formatTimeStamp: filters.date,
  formatNumber: filters.number,
  defaultValue: filters.defaut,
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
  formatDate: (value: any, format: string = 'LLL', inputFormat: string = '') =>
    moment(value, inputFormat).format(format)
};
delete imports.default; // default 是个关键字，不能 imports 到 lodash 里面去。
function lodashCompile(str: string, data: object) {
  try {
    const fn = template(str, {
      imports: imports,
      variable: 'data'
    });

    return fn(data);
  } catch (e) {
    return `<span class="text-danger">${e.message}</span>`;
  }
}

reigsterTplEnginer('lodash', {
  test: str => !!~str.indexOf('<%'),
  compile: (str: string, data: object) => lodashCompile(str, data)
});
