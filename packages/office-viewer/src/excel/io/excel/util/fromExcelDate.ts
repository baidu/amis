const pasteCache: Record<string, number> = {};

/**
 * 将 Excel 日期转换为 Date 对象
 * 来自 https://github.com/RaschidJFR/js-excel-date-convert
 * @param excelDate Excel 日期
 * @param date1904 是否使用 1904 年作为基准
 */

export function fromExcelDate(excelDate: number | string, date1904: boolean) {
  const cacheKey = `${excelDate}-${date1904}`;
  if (pasteCache[cacheKey]) {
    return new Date(pasteCache[cacheKey]);
  }
  if (typeof excelDate === 'string') {
    excelDate = parseInt(excelDate, 10);
  }
  const daysIn4Years = 1461;
  const daysIn70years = Math.round(25567.5 + 1); // +1 because of the leap-year bug
  const daysFrom1900 = excelDate + (date1904 ? daysIn4Years + 1 : 0);
  const daysFrom1970 = daysFrom1900 - daysIn70years;
  const secondsFrom1970 = daysFrom1970 * (3600 * 24);
  const utc = new Date(secondsFrom1970 * 1000);
  pasteCache[cacheKey] = utc.getTime();
  return utc;
}

/**
 * Encode date to excel
 * @param {Date} date
 * @param {boolean} [date1904] Whether to use the 1904 Date System. See https://bettersolutions.com/excel/dates-times/1904-date-system.htm
 * @author Raschid JF Rafaelly <hello&commat;raschidjdr.dev>
 */
export function toExcelDate(date: Date, date1904: boolean = false) {
  // see https://bettersolutions.com/excel/dates-times/1904-date-system.htm
  const daysIn4Years = 1461;
  const daysIn70years = Math.round(25567.5 + 1); // +1 because of the leap-year bug
  const daysFrom1970 = date.getTime() / 1000 / 3600 / 24;
  const daysFrom1900 = daysFrom1970 + daysIn70years;
  const daysFrom1904Jan2nd = daysFrom1900 - daysIn4Years - 1;
  return Math.round(date1904 ? daysFrom1904Jan2nd : daysFrom1900);
}
