import {CT_CfRule, ST_TimePeriod} from '../../../openxml/ExcelTypes';
import {CellInfo} from '../../types/CellInfo';
import {RangeRef} from '../../types/RangeRef';
import {Sheet} from '../Sheet';
import {applyCfRuleDxf} from './applyCfRuleDxf';
import {fromExcelDate} from '../../io/excel/util/fromExcelDate';

function isToday(date: Date) {
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

function isYesterday(date: Date) {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  return (
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()
  );
}

function isTomorrow(date: Date) {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  return (
    date.getFullYear() === tomorrow.getFullYear() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getDate() === tomorrow.getDate()
  );
}

function isThisMonth(date: Date) {
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth()
  );
}

function isLastMonth(date: Date) {
  const now = new Date();
  const lastMonth = new Date(now);
  lastMonth.setMonth(now.getMonth() - 1);
  return (
    date.getFullYear() === lastMonth.getFullYear() &&
    date.getMonth() === lastMonth.getMonth()
  );
}

function isNextMonth(date: Date) {
  const now = new Date();
  const nextMonth = new Date(now);
  nextMonth.setMonth(now.getMonth() + 1);
  return (
    date.getFullYear() === nextMonth.getFullYear() &&
    date.getMonth() === nextMonth.getMonth()
  );
}

function isThisWeek(date: Date) {
  const now = new Date();
  const day = now.getDay();
  const start = new Date(now);
  start.setDate(now.getDate() - day);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 7);
  return date >= start && date < end;
}

function isLastWeek(date: Date) {
  const now = new Date();
  const day = now.getDay();
  const start = new Date(now);
  start.setDate(now.getDate() - day - 7);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 7);
  return date >= start && date < end;
}

function isNextWeek(date: Date) {
  const now = new Date();
  const day = now.getDay();
  const start = new Date(now);
  start.setDate(now.getDate() - day + 7);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 7);
  return date >= start && date < end;
}

function isLast7Days(date: Date) {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - 7);
  start.setHours(0, 0, 0, 0);
  return date >= start && date < now;
}

export function checkDate(date: Date, timePeriod: ST_TimePeriod) {
  switch (timePeriod) {
    case 'today':
      return isToday(date);
    case 'yesterday':
      return isYesterday(date);
    case 'tomorrow':
      return isTomorrow(date);
    case 'last7Days':
      return isLast7Days(date);
    case 'thisMonth':
      return isThisMonth(date);
    case 'lastMonth':
      return isLastMonth(date);
    case 'nextMonth':
      return isNextMonth(date);
    case 'thisWeek':
      return isThisWeek(date);
    case 'lastWeek':
      return isLastWeek(date);
    case 'nextWeek':
      return isNextWeek(date);
    default:
      return false;
  }
}

/**
 * 时间相关的判断，这里不依赖公式
 */

export function timePeriod(
  sheet: Sheet,
  cellInfo: CellInfo,
  ranges: RangeRef[],
  cfRule: CT_CfRule
): boolean {
  const timePeriod = cfRule.timePeriod;
  if (!timePeriod) {
    return false;
  }

  const dateValue = cellInfo.value;

  if (dateValue === undefined) {
    return false;
  }

  // 这是天，要先转成秒

  const date = fromExcelDate(dateValue, sheet.workbook.is1904());

  if (checkDate(date, timePeriod)) {
    applyCfRuleDxf(cfRule, sheet, cellInfo);
    return true;
  }

  return false;
}
