/**
 * 来自 fast-formula-parser
 */

import FormulaError from '../FormulaError';
import {EvalResult} from '../eval/EvalResult';
import {regFunc} from './functions';
import {getNumberOrThrow, getNumberWithDefault} from './util/getNumber';
import {getBoolean} from './util/getBoolean';
import {getStringOrThrow} from './util/getString';
import {loopArgs} from './util/loopArgs';
import {flattenArgs} from './util/flattenArgs';

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const d1900 = new Date(Date.UTC(1900, 0, 1));
const WEEK_STARTS = [
  undefined,
  0,
  1,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  1,
  2,
  3,
  4,
  5,
  6,
  0
];
const WEEK_TYPES = [
  undefined,
  [1, 2, 3, 4, 5, 6, 7],
  [7, 1, 2, 3, 4, 5, 6],
  [6, 0, 1, 2, 3, 4, 5],
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  [7, 1, 2, 3, 4, 5, 6],
  [6, 7, 1, 2, 3, 4, 5],
  [5, 6, 7, 1, 2, 3, 4],
  [4, 5, 6, 7, 1, 2, 3],
  [3, 4, 5, 6, 7, 1, 2],
  [2, 3, 4, 5, 6, 7, 1],
  [1, 2, 3, 4, 5, 6, 7]
];
const WEEKEND_TYPES = [
  undefined,
  [6, 0],
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  undefined,
  undefined,
  undefined,
  [0],
  [1],
  [2],
  [3],
  [4],
  [5],
  [6]
];

// Formats: h:mm:ss A, h:mm A, H:mm, H:mm:ss, H A
const timeRegex = /^\s*(\d\d?)\s*(:\s*\d\d?)?\s*(:\s*\d\d?)?\s*(pm|am)?\s*$/i;
// 12-3, 12/3
const dateRegex1 = /^\s*((\d\d?)\s*([-\/])\s*(\d\d?))([\d:.apm\s]*)$/i;
// 3-Dec, 3/Dec
const dateRegex2 =
  /^\s*((\d\d?)\s*([-/])\s*(jan\w*|feb\w*|mar\w*|apr\w*|may\w*|jun\w*|jul\w*|aug\w*|sep\w*|oct\w*|nov\w*|dec\w*))([\d:.apm\s]*)$/i;
// Dec-3, Dec/3
const dateRegex3 =
  /^\s*((jan\w*|feb\w*|mar\w*|apr\w*|may\w*|jun\w*|jul\w*|aug\w*|sep\w*|oct\w*|nov\w*|dec\w*)\s*([-/])\s*(\d\d?))([\d:.apm\s]*)$/i;

function parseSimplifiedDate(text: string): Date {
  const fmt1 = text.match(dateRegex1);
  const fmt2 = text.match(dateRegex2);
  const fmt3 = text.match(dateRegex3);
  if (fmt1) {
    text = fmt1[1] + fmt1[3] + new Date().getFullYear() + fmt1[5];
  } else if (fmt2) {
    text = fmt2[1] + fmt2[3] + new Date().getFullYear() + fmt2[5];
  } else if (fmt3) {
    text = fmt3[1] + fmt3[3] + new Date().getFullYear() + fmt3[5];
  }
  return new Date(Date.parse(`${text} UTC`));
}

/**
 * Parse time string to date in UTC.
 * @param {string} text
 */
function parseTime(text: string) {
  const res = text.match(timeRegex);
  if (!res) return;

  //  ["4:50:55 pm", "4", ":50", ":55", "pm", ...]
  const minutes = res[2] ? res[2] : ':00';
  const seconds = res[3] ? res[3] : ':00';
  const ampm = res[4] ? ' ' + res[4] : '';

  const date = new Date(
    Date.parse(`1/1/1900 ${res[1] + minutes + seconds + ampm} UTC`)
  );
  let now = new Date();
  now = new Date(
    Date.UTC(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      now.getMinutes(),
      now.getSeconds(),
      now.getMilliseconds()
    )
  );

  return new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
      date.getUTCMilliseconds()
    )
  );
}

/**
 * Parse a UTC date to excel serial number.
 * @param {Date|number} date - A UTC date.
 */
function toSerial(date: number | Date): number {
  if (date instanceof Date) {
    date = date.getTime();
  }
  const addOn = date > -2203891200000 ? 2 : 1;
  return Math.floor((date - d1900.getTime()) / 86400000) + addOn;
}

/**
 * Parse an excel serial number to UTC date.
 * @param serial
 */
function toDate(serial: number) {
  if (serial < 0) {
    throw FormulaError.VALUE;
  }
  if (serial <= 60) {
    return new Date(d1900.getTime() + (serial - 1) * 86400000);
  }
  return new Date(d1900.getTime() + (serial - 2) * 86400000);
}

export function parseDateWithExtra(serialOrString: string | Date) {
  if (serialOrString instanceof Date) {
    return {date: serialOrString, isDateGiven: true};
  }

  let isDateGiven = true,
    date;
  if (!isNaN(Number(serialOrString))) {
    const serial = Number(serialOrString);
    date = toDate(serial);
  } else {
    // support time without date
    date = parseTime(serialOrString);

    if (!date) {
      date = parseSimplifiedDate(serialOrString);
    } else {
      isDateGiven = false;
    }
  }
  return {date, isDateGiven};
}

export function parseDate(serialOrString: string | Date) {
  return parseDateWithExtra(serialOrString).date;
}

export function parseDates(...dates: EvalResult[]) {
  return flattenArgs(dates).map(date => parseDate(date as string));
}

function compareDateIgnoreTime(date1: Date, date2: Date) {
  return (
    date1.getUTCFullYear() === date2.getUTCFullYear() &&
    date1.getUTCMonth() === date2.getUTCMonth() &&
    date1.getUTCDate() === date2.getUTCDate()
  );
}

function isLeapYear(year: number) {
  if (year === 1900) {
    return true;
  }
  return new Date(year, 1, 29).getMonth() === 1;
}

regFunc('DATE', (...arg: EvalResult[]) => {
  let year = getNumberOrThrow(arg[0]);
  const month = getNumberOrThrow(arg[1]);
  const day = getNumberOrThrow(arg[2]);
  if (year < 0 || year >= 10000) {
    throw FormulaError.NUM;
  }

  // If year is between 0 (zero) and 1899 (inclusive), Excel adds that value to 1900 to calculate the year.
  if (year < 1900) {
    year += 1900;
  }

  return toSerial(Date.UTC(year, month - 1, day));
});

export function DATEDIF(startDate: Date, endDate: Date, unit: string) {
  unit = unit.toLowerCase();
  if (startDate > endDate) {
    throw FormulaError.NUM;
  }
  const yearDiff = endDate.getUTCFullYear() - startDate.getUTCFullYear();
  const monthDiff = endDate.getUTCMonth() - startDate.getUTCMonth();
  const dayDiff = endDate.getUTCDate() - startDate.getUTCDate();
  let offset;
  switch (unit) {
    case 'y':
      offset = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? -1 : 0;
      return offset + yearDiff;
    case 'm':
      offset = dayDiff < 0 ? -1 : 0;
      return yearDiff * 12 + monthDiff + offset;
    case 'd':
      return Math.floor(endDate.getTime() - startDate.getTime()) / MS_PER_DAY;
    case 'md':
      // The months and years of the dates are ignored.
      startDate.setUTCFullYear(endDate.getUTCFullYear());
      if (dayDiff < 0) {
        startDate.setUTCMonth(endDate.getUTCMonth() - 1);
      } else {
        startDate.setUTCMonth(endDate.getUTCMonth());
      }
      return Math.floor(endDate.getTime() - startDate.getTime()) / MS_PER_DAY;
    case 'ym':
      // The days and years of the dates are ignored
      offset = dayDiff < 0 ? -1 : 0;
      return (offset + yearDiff * 12 + monthDiff) % 12;
    case 'yd':
      // The years of the dates are ignored.
      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        startDate.setUTCFullYear(endDate.getUTCFullYear() - 1);
      } else {
        startDate.setUTCFullYear(endDate.getUTCFullYear());
      }
      return Math.floor(endDate.getTime() - startDate.getTime()) / MS_PER_DAY;
  }
  throw FormulaError.VALUE;
}

regFunc('DATEDIF', (...arg: EvalResult[]) => {
  const startDate = parseDate(arg[0] as string);
  const endDate = parseDate(arg[1] as string);
  const unit = getStringOrThrow(arg[2]).toLowerCase();

  return DATEDIF(startDate, endDate, unit);
});

regFunc('DATEVALUE', (dateText: EvalResult) => {
  dateText = parseDate(dateText as string);
  const {date, isDateGiven} = parseDateWithExtra(dateText);
  if (!isDateGiven) {
    return 0;
  }
  const serial = toSerial(date);
  if (serial < 0 || serial > 2958465) {
    throw FormulaError.VALUE;
  }
  return serial;
});

regFunc('DAY', (dateText: EvalResult) => {
  const date = parseDate(dateText as string);
  return date.getUTCDate();
});

export function DAYS(endDate: EvalResult, startDate: EvalResult) {
  endDate = parseDate(endDate as string).getTime();
  startDate = parseDate(startDate as string).getTime();
  let offset = 0;
  if (startDate < -2203891200000 && -2203891200000 < endDate) {
    offset = 1;
  }
  return Math.floor(endDate - startDate) / MS_PER_DAY + offset;
}

regFunc('DAYS', DAYS);

export function DAYS360(start_date: Date, end_date: Date, method: boolean) {
  const sm = start_date.getMonth();
  let em = end_date.getMonth();
  let sd, ed;

  if (method) {
    sd = start_date.getDate() === 31 ? 30 : start_date.getDate();
    ed = end_date.getDate() === 31 ? 30 : end_date.getDate();
  } else {
    const smd = new Date(start_date.getFullYear(), sm + 1, 0).getDate();
    const emd = new Date(end_date.getFullYear(), em + 1, 0).getDate();
    sd = start_date.getDate() === smd ? 30 : start_date.getDate();

    if (end_date.getDate() === emd) {
      if (sd < 30) {
        em++;
        ed = 1;
      } else {
        ed = 30;
      }
    } else {
      ed = end_date.getDate();
    }
  }

  return (
    360 * (end_date.getFullYear() - start_date.getFullYear()) +
    30 * (em - sm) +
    (ed - sd)
  );
}

regFunc(
  'DAYS360',
  (startDate: EvalResult, endDate: EvalResult, method: EvalResult) => {
    startDate = parseDate(startDate as string);
    endDate = parseDate(endDate as string);
    // default is US method
    method = getBoolean(method, false)!;

    return DAYS360(startDate, endDate, method);
  }
);

regFunc('EDATE', (startDate: EvalResult, months: EvalResult) => {
  startDate = parseDate(startDate as string);
  months = getNumberOrThrow(months);
  startDate.setUTCMonth(startDate.getUTCMonth() + months);
  return toSerial(startDate);
});

regFunc('EOMONTH', (startDate: EvalResult, months: EvalResult) => {
  startDate = parseDate(startDate as string);
  months = getNumberOrThrow(months);
  startDate.setUTCMonth(startDate.getUTCMonth() + months + 1, 0);
  return toSerial(startDate);
});

regFunc('HOUR', (dateText: EvalResult) => {
  const date = parseDate(dateText as string);
  return date.getUTCHours();
});

function ISOWEEKNUM(dateText: EvalResult) {
  const date = parseDate(dateText as string);
  // https://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = d.getUTCDay();
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

regFunc('ISOWEEKNUM', ISOWEEKNUM);

regFunc('MINUTE', (dateText: EvalResult) => {
  const date = parseDate(dateText as string);
  return date.getUTCMinutes();
});

regFunc('MONTH', (dateText: EvalResult) => {
  const date = parseDate(dateText as string);
  return date.getUTCMonth() + 1;
});

regFunc(
  'NETWORKDAYS',
  (startDate: EvalResult, endDate: EvalResult, holidays: EvalResult) => {
    startDate = parseDate(startDate as string);
    endDate = parseDate(endDate as string);
    let sign = 1;
    if (startDate > endDate) {
      sign = -1;
      const temp = startDate;
      startDate = endDate;
      endDate = temp;
    }
    const holidaysArr: Date[] = [];
    if (holidays !== undefined) {
      loopArgs([holidays], item => {
        holidaysArr.push(parseDate(item as string));
      });
    }
    let numWorkDays = 0;
    while (startDate <= endDate) {
      // Skips Sunday and Saturday
      if (startDate.getUTCDay() !== 0 && startDate.getUTCDay() !== 6) {
        let found = false;
        for (let i = 0; i < holidaysArr.length; i++) {
          if (compareDateIgnoreTime(startDate, holidaysArr[i])) {
            found = true;
            break;
          }
        }
        if (!found) numWorkDays++;
      }
      startDate.setUTCDate(startDate.getUTCDate() + 1);
    }
    return sign * numWorkDays;
  }
);

regFunc(
  'NETWORKDAYS.INTL',
  (
    startDate: EvalResult,
    endDate: EvalResult,
    weekend: EvalResult,
    holidays: EvalResult
  ) => {
    startDate = parseDate(startDate as string);
    endDate = parseDate(endDate as string);
    let sign = 1;
    if (startDate > endDate) {
      sign = -1;
      const temp = startDate;
      startDate = endDate;
      endDate = temp;
    }
    if (weekend === '1111111') {
      return 0;
    }

    weekend = weekend || 1;
    // Using 1111111 will always return 0.

    // using weekend string, i.e, 0000011
    if (typeof weekend === 'string' && Number(weekend).toString() !== weekend) {
      if (weekend.length !== 7) throw FormulaError.VALUE;
      weekend = weekend.charAt(6) + weekend.slice(0, 6);
      const weekendArr = [];
      for (let i = 0; i < weekend.length; i++) {
        if (weekend.charAt(i) === '1') weekendArr.push(i);
      }
      weekend = weekendArr;
    } else {
      // using weekend number
      if (typeof weekend !== 'number') throw FormulaError.VALUE;
      weekend = WEEKEND_TYPES[weekend];
    }

    const holidaysArr: Date[] = [];
    if (holidays !== undefined) {
      loopArgs([holidays], item => {
        holidaysArr.push(parseDate(item as string));
      });
    }
    let numWorkDays = 0;
    while (startDate <= endDate) {
      let skip = false;
      if (Array.isArray(weekend)) {
        for (let i = 0; i < weekend.length; i++) {
          if (weekend[i] === startDate.getUTCDay()) {
            skip = true;
            break;
          }
        }
      }

      if (!skip) {
        let found = false;
        for (let i = 0; i < holidaysArr.length; i++) {
          if (compareDateIgnoreTime(startDate, holidaysArr[i])) {
            found = true;
            break;
          }
        }
        if (!found) numWorkDays++;
      }
      startDate.setUTCDate(startDate.getUTCDate() + 1);
    }
    return sign * numWorkDays;
  }
);

regFunc('NOW', () => {
  const now = new Date();
  return (
    toSerial(
      Date.UTC(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        now.getHours(),
        now.getMinutes(),
        now.getSeconds(),
        now.getMilliseconds()
      )
    ) +
    (3600 * now.getHours() + 60 * now.getMinutes() + now.getSeconds()) / 86400
  );
});

regFunc('SECOND', (dateText: EvalResult) => {
  const date = parseDate(dateText as string);
  return date.getUTCSeconds();
});

regFunc('TIME', (hour: EvalResult, minute: EvalResult, second: EvalResult) => {
  hour = getNumberOrThrow(hour);
  minute = getNumberOrThrow(minute);
  second = getNumberOrThrow(second);
  if (
    hour < 0 ||
    hour > 32767 ||
    minute < 0 ||
    minute > 32767 ||
    second < 0 ||
    second > 32767
  ) {
    throw FormulaError.NUM;
  }
  return (3600 * hour + 60 * minute + second) / 86400;
});

regFunc('TIMEVALUE', (timeText: EvalResult) => {
  timeText = parseDate(timeText as string);
  return (
    (3600 * timeText.getUTCHours() +
      60 * timeText.getUTCMinutes() +
      timeText.getUTCSeconds()) /
    86400
  );
});

regFunc('TODAY', () => {
  const now = new Date();
  return toSerial(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
});

regFunc('WEEKDAY', (serialOrString: EvalResult, returnType: EvalResult) => {
  const date = parseDate(serialOrString as string);
  returnType = getNumberWithDefault(returnType, 1);
  const day = date.getUTCDay();
  const weekTypes = WEEK_TYPES[returnType];
  if (!weekTypes) {
    throw FormulaError.NUM;
  }
  return weekTypes[day];
});

regFunc('WEEKNUM', (serialOrString: EvalResult, returnType: EvalResult) => {
  const date = parseDate(serialOrString as string);
  returnType = getNumberWithDefault(returnType, 1);
  if (returnType === 21) {
    return ISOWEEKNUM(serialOrString);
  }
  const weekStart = WEEK_STARTS[returnType];
  if (weekStart === undefined) {
    throw FormulaError.NUM;
  }
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const offset = yearStart.getUTCDay() < weekStart ? 1 : 0;
  return (
    Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7) +
    offset
  );
});

regFunc(
  'WORKDAY',
  (startDate: EvalResult, days: EvalResult, holidays: EvalResult) => {
    return WORKDAY_INTL(startDate, days, 1, holidays);
  }
);

function WORKDAY_INTL(
  startDate: EvalResult,
  days: EvalResult,
  weekend: EvalResult,
  holidays: EvalResult
) {
  startDate = parseDate(startDate as string);
  days = getNumberOrThrow(days);

  weekend = weekend || 1;
  // Using 1111111 will always return value error.
  if (weekend === '1111111') {
    throw FormulaError.VALUE;
  }

  // using weekend string, i.e, 0000011
  if (typeof weekend === 'string' && Number(weekend).toString() !== weekend) {
    if (weekend.length !== 7) throw FormulaError.VALUE;
    weekend = weekend.charAt(6) + weekend.slice(0, 6);
    const weekendArr = [];
    for (let i = 0; i < weekend.length; i++) {
      if (weekend.charAt(i) === '1') weekendArr.push(i);
    }
    weekend = weekendArr;
  } else {
    // using weekend number
    if (typeof weekend !== 'number') throw FormulaError.VALUE;
    weekend = WEEKEND_TYPES[weekend];
    if (weekend == null) throw FormulaError.NUM;
  }

  const holidaysArr: Date[] = [];
  if (holidays !== undefined) {
    loopArgs([holidays], item => {
      holidaysArr.push(parseDate(item as string));
    });
  }
  startDate.setUTCDate(startDate.getUTCDate() + 1);
  let cnt = 0;
  while (cnt < days) {
    let skip = false;
    for (let i = 0; i < weekend.length; i++) {
      if (weekend[i] === startDate.getUTCDay()) {
        skip = true;
        break;
      }
    }

    if (!skip) {
      let found = false;
      for (let i = 0; i < holidaysArr.length; i++) {
        if (compareDateIgnoreTime(startDate, holidaysArr[i])) {
          found = true;
          break;
        }
      }
      if (!found) cnt++;
    }
    startDate.setUTCDate(startDate.getUTCDate() + 1);
  }
  return toSerial(startDate) - 1;
}

regFunc('WORKDAY.INTL', WORKDAY_INTL);

regFunc('YEAR', (dateText: EvalResult) => {
  const date = parseDate(dateText as string);
  return date.getUTCFullYear();
});

export function YEARFRAC(startDate: Date, endDate: Date, basis: number) {
  if (startDate > endDate) {
    const temp = startDate;
    startDate = endDate;
    endDate = temp;
  }

  if (basis < 0 || basis > 4) throw FormulaError.VALUE;

  // https://github.com/LesterLyu/formula.js/blob/develop/lib/date-time.js#L508
  let sd = startDate.getUTCDate();
  const sm = startDate.getUTCMonth() + 1;
  const sy = startDate.getUTCFullYear();
  let ed = endDate.getUTCDate();
  const em = endDate.getUTCMonth() + 1;
  const ey = endDate.getUTCFullYear();

  switch (basis) {
    case 0:
      // US (NASD) 30/360
      if (sd === 31 && ed === 31) {
        sd = 30;
        ed = 30;
      } else if (sd === 31) {
        sd = 30;
      } else if (sd === 30 && ed === 31) {
        ed = 30;
      }
      return (
        Math.abs(ed + em * 30 + ey * 360 - (sd + sm * 30 + sy * 360)) / 360
      );
    case 1:
      // Actual/actual
      if (ey - sy < 2) {
        const yLength = isLeapYear(sy) && sy !== 1900 ? 366 : 365;
        const days = DAYS(endDate, startDate);
        return days / yLength;
      } else {
        const years = ey - sy + 1;
        const days =
          (new Date(ey + 1, 0, 1).getTime() - new Date(sy, 0, 1).getTime()) /
          1000 /
          60 /
          60 /
          24;
        const average = days / years;
        return DAYS(endDate, startDate) / average;
      }
    case 2:
      // Actual/360
      return Math.abs(DAYS(endDate, startDate) / 360);
    case 3:
      // Actual/365
      return Math.abs(DAYS(endDate, startDate) / 365);
    case 4:
      // European 30/360
      return (
        Math.abs(ed + em * 30 + ey * 360 - (sd + sm * 30 + sy * 360)) / 360
      );
  }
  throw FormulaError.VALUE;
}

regFunc(
  'YEARFRAC',
  (startDate: EvalResult, endDate: EvalResult, basis: EvalResult) => {
    startDate = parseDate(startDate as string);
    endDate = parseDate(endDate as string);

    basis = Math.trunc(getNumberWithDefault(basis, 0));

    return YEARFRAC(startDate, endDate, basis);
  }
);
