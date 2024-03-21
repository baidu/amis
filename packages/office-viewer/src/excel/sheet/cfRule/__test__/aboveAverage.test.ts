import {getAverageValue} from '../aboveAverage';

test('getAverageValue - empty array', () => {
  const values: number[] = [];
  expect(getAverageValue(values)).toBeNull();
});

test('getAverageValue - single value', () => {
  const values: number[] = [5];
  expect(getAverageValue(values)).toEqual(5);
});

test('getAverageValue - multiple values', () => {
  const values: number[] = [1, 2, 3, 4, 5];
  expect(getAverageValue(values)).toEqual(3);
});
