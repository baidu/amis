import {CellValueNum} from '../CellValueNum';
import {customFilter} from '../customFilter';

const values: CellValueNum[] = [...Array(10)].map((_, i) => {
  return {
    row: i,
    num: i,
    value: i.toString()
  };
});

test('equal', () => {
  const hiddenRows = customFilter(values, {
    customFilter: [
      {
        operator: 'equal',
        val: '1'
      }
    ]
  });
  expect(hiddenRows).toEqual(new Set([0, 2, 3, 4, 5, 6, 7, 8, 9]));
});

test('notEqual', () => {
  const hiddenRows = customFilter(values, {
    customFilter: [
      {
        operator: 'notEqual',
        val: '1'
      }
    ]
  });
  expect(hiddenRows).toEqual(new Set([1]));
});

test('lessThan', () => {
  const hiddenRows = customFilter(values, {
    customFilter: [
      {
        operator: 'lessThan',
        val: '5'
      }
    ]
  });
  expect(hiddenRows).toEqual(new Set([5, 6, 7, 8, 9]));
});

test('lessThanOrEqual', () => {
  const hiddenRows = customFilter(values, {
    customFilter: [
      {
        operator: 'lessThanOrEqual',
        val: '5'
      }
    ]
  });
  expect(hiddenRows).toEqual(new Set([6, 7, 8, 9]));
});

test('greaterThan', () => {
  const hiddenRows = customFilter(values, {
    customFilter: [
      {
        operator: 'greaterThan',
        val: '5'
      }
    ]
  });
  expect(hiddenRows).toEqual(new Set([0, 1, 2, 3, 4, 5]));
});

test('greaterThanOrEqual', () => {
  const hiddenRows = customFilter(values, {
    customFilter: [
      {
        operator: 'greaterThanOrEqual',
        val: '5'
      }
    ]
  });
  expect(hiddenRows).toEqual(new Set([0, 1, 2, 3, 4]));
});

test('and equal', () => {
  const hiddenRows = customFilter(values, {
    and: true,
    customFilter: [
      {
        operator: 'greaterThanOrEqual',
        val: '2'
      },
      {
        operator: 'greaterThanOrEqual',
        val: '3'
      }
    ]
  });
  expect(hiddenRows).toEqual(new Set([0, 1, 2]));
});

test('or equal', () => {
  const hiddenRows = customFilter(values, {
    and: false,
    customFilter: [
      {
        operator: 'equal',
        val: '2'
      },
      {
        operator: 'equal',
        val: '4'
      }
    ]
  });
  expect(hiddenRows).toEqual(new Set([0, 1, 3, 5, 6, 7, 8, 9]));
});

const strValues: CellValueNum[] = [
  {
    row: 1,
    value: 'ab',
    num: 1
  },
  {
    row: 2,
    value: 'bc',
    num: 2
  },
  {
    row: 3,
    value: 'cd',
    num: 3
  },
  {
    row: 4,
    value: 'de',
    num: 4
  },
  {
    row: 5,
    value: 'ef',
    num: 5
  }
];

test('startsWith', () => {
  const hiddenRows = customFilter(strValues, {
    customFilter: [
      {
        val: 'e*'
      }
    ]
  });
  expect(hiddenRows).toEqual(new Set([1, 2, 3, 4]));
});

test('not startsWith', () => {
  const hiddenRows = customFilter(strValues, {
    customFilter: [
      {
        operator: 'notEqual',
        val: 'e*'
      }
    ]
  });
  expect(hiddenRows).toEqual(new Set([5]));
});

test('endsWith', () => {
  const hiddenRows = customFilter(strValues, {
    customFilter: [
      {
        val: '*e'
      }
    ]
  });
  expect(hiddenRows).toEqual(new Set([1, 2, 3, 5]));
});

test('not endsWith', () => {
  const hiddenRows = customFilter(strValues, {
    customFilter: [
      {
        operator: 'notEqual',
        val: '*e'
      }
    ]
  });
  expect(hiddenRows).toEqual(new Set([4]));
});

test('contains', () => {
  const hiddenRows = customFilter(strValues, {
    customFilter: [
      {
        val: '*e*'
      }
    ]
  });
  expect(hiddenRows).toEqual(new Set([1, 2, 3]));
});

test('not contains', () => {
  const hiddenRows = customFilter(strValues, {
    customFilter: [
      {
        operator: 'notEqual',
        val: '*e*'
      }
    ]
  });
  expect(hiddenRows).toEqual(new Set([4, 5]));
});
