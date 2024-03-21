import {ST_DateTimeGrouping} from '../../../openxml/ExcelTypes';

export type DateGroupItem = {
  date: Date;
  dateTimeGrouping: ST_DateTimeGrouping;
};

export function inDateGroupItems(dateGroupItems: DateGroupItem[], date: Date) {
  let inGroup = false;

  for (const item of dateGroupItems) {
    const {date: groupDate, dateTimeGrouping} = item;
    switch (dateTimeGrouping) {
      case 'year':
        if (date.getFullYear() === groupDate.getFullYear()) {
          inGroup = true;
        }
        break;

      case 'month':
        if (
          date.getFullYear() === groupDate.getFullYear() &&
          date.getMonth() === groupDate.getMonth()
        ) {
          inGroup = true;
        }
        break;

      case 'day':
        if (
          date.getFullYear() === groupDate.getFullYear() &&
          date.getMonth() === groupDate.getMonth() &&
          date.getDate() === groupDate.getDate()
        ) {
          inGroup = true;
        }
        break;

      case 'hour':
        if (
          date.getFullYear() === groupDate.getFullYear() &&
          date.getMonth() === groupDate.getMonth() &&
          date.getDate() === groupDate.getDate() &&
          date.getHours() === groupDate.getHours()
        ) {
          inGroup = true;
        }
        break;

      case 'minute':
        if (
          date.getFullYear() === groupDate.getFullYear() &&
          date.getMonth() === groupDate.getMonth() &&
          date.getDate() === groupDate.getDate() &&
          date.getHours() === groupDate.getHours() &&
          date.getMinutes() === groupDate.getMinutes()
        ) {
          inGroup = true;
        }
        break;

      case 'second':
        if (
          date.getFullYear() === groupDate.getFullYear() &&
          date.getMonth() === groupDate.getMonth() &&
          date.getDate() === groupDate.getDate() &&
          date.getHours() === groupDate.getHours() &&
          date.getMinutes() === groupDate.getMinutes() &&
          date.getSeconds() === groupDate.getSeconds()
        ) {
          inGroup = true;
        }
        break;

      default:
        break;
    }
  }

  return inGroup;
}
