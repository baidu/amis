import moment from 'moment';
import {createObject} from './object';
import {tokenize} from './tokenize';
import {resolveVariableAndFilter} from './resolveVariableAndFilter';

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

  // todo
  const date = new Date();
  value = resolveVariableAndFilter(
    value,
    createObject(data, {
      now: mm().toDate(),
      today: mm([date.getFullYear(), date.getMonth(), date.getDate()])
    }),
    '| raw'
  );

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
    // 优先通过指定格式解析，如果失败，则通过默认格式解析
    const date =
      [mm(value, format), mm(value)].find(item => item.isValid())! || mm(value);
    return utc ? date.local() : date;
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

/**
 * 解析日期，先尝试用 format 解析，如果失败，再尝试用其他标准格式解析
 * @param value
 * @param format
 * @returns
 */
export function normalizeDate(
  value: any,
  format?: string,
  options?: {
    utc?: boolean; // utc还原成本地时间
  }
) {
  if (!value || value === '0') {
    return undefined;
  }

  const v = options?.utc
    ? moment.utc(value, format).local()
    : moment(value, format, true);
  if (v.isValid()) {
    return v;
  }

  if (typeof value === 'string' || typeof value === 'number') {
    let formats = ['', 'YYYY-MM-DD HH:mm:ss', 'X'];

    if (/^\d{10}((\.\d+)*)$/.test(value.toString())) {
      formats = ['X', 'x', 'YYYY-MM-DD HH:mm:ss', ''];
    } else if (/^\d{13}((\.\d+)*)$/.test(value.toString())) {
      formats = ['x', 'X', 'YYYY-MM-DD HH:mm:ss', ''];
    }

    while (formats.length) {
      const format = formats.shift()!;
      const date = moment(value, format);

      if (date.isValid()) {
        return date;
      }
    }
  }

  return undefined;
}
