import {CellValueNum} from '../CellValueNum';
import {filters} from '../filters';
import {toExcelDate} from '../../../io/excel/util/fromExcelDate';

const values: CellValueNum[] = [...Array(5)].map((_, i) => {
  return {
    row: i,
    num: i,
    value: i.toString()
  };
});

test('equal', () => {
  const hiddenRows = filters(values, {
    filter: [
      {
        val: '1'
      }
    ]
  });
  expect(hiddenRows).toEqual(new Set([0, 2, 3, 4]));
});

test('equal2', () => {
  const hiddenRows = filters(values, {
    filter: [
      {
        val: '1'
      },
      {val: '2'}
    ]
  });
  expect(hiddenRows).toEqual(new Set([0, 3, 4]));
});

const datesData: CellValueNum[] = [
  {
    row: 1,
    num: 1,
    value: String(toExcelDate(new Date(Date.parse('2019-01-01T00:00:00.000Z'))))
  },
  {
    row: 2,
    num: 2,
    value: String(toExcelDate(new Date(Date.parse('2020-01-01T00:00:00.000Z'))))
  },
  {
    row: 3,
    num: 3,
    value: String(toExcelDate(new Date(Date.parse('2020-02-01T00:00:00.000Z'))))
  }
];

test('date-group-year', () => {
  const hiddenRows = filters(datesData, {
    dateGroupItem: [
      {
        dateTimeGrouping: 'year',
        year: 2020
      }
    ]
  });

  expect(hiddenRows).toEqual(new Set([1]));
});

test('date-group-month', () => {
  const hiddenRows = filters(datesData, {
    dateGroupItem: [
      {
        dateTimeGrouping: 'month',
        year: 2020,
        month: 2
      }
    ]
  });

  expect(hiddenRows).toEqual(new Set([1, 2]));
});

test('date-group-day', () => {
  const hiddenRows = filters(datesData, {
    dateGroupItem: [
      {
        dateTimeGrouping: 'day',
        year: 2020,
        month: 2,
        day: 1
      }
    ]
  });

  expect(hiddenRows).toEqual(new Set([1, 2]));
});
