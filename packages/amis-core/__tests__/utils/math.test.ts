import {safeAdd, safeSub, numberFormatter} from '../../src/utils/math';

test(`math safeAdd:test`, () => {
  expect(safeAdd(0.1, 0.2)).toEqual(0.3);
  expect(safeAdd(0.111, 0.455)).toEqual(0.566);
  expect(safeAdd(NaN, 1)).toEqual(NaN);
  expect(safeAdd(NaN, NaN)).toEqual(NaN);
});

test(`math safeSub:test`, () => {
  expect(safeSub(0.8, 0.1)).toEqual(0.7);
  expect(safeSub(0.1, 0.111111)).toEqual(-0.011111);
  expect(safeAdd(NaN, 1)).toEqual(NaN);
  expect(safeAdd(NaN, NaN)).toEqual(NaN);
});

test('numberFormatter:test', () => {
  expect(numberFormatter(0)).toEqual('0');
  expect(numberFormatter(0.123)).toEqual('0.123');
  expect(numberFormatter(0.123, 0)).toEqual('0');
  expect(numberFormatter(0, 2)).toEqual('0.00');
  expect(numberFormatter(0, 8)).toEqual('0.00000000');
  expect(numberFormatter(123456)).toEqual('123,456');
  expect(numberFormatter(123456, 2)).toEqual('123,456.00');
  expect(numberFormatter(1234567890000)).toEqual('1,234,567,890,000');
  expect(numberFormatter(1234567890000, 4)).toEqual('1,234,567,890,000.0000');
  expect(numberFormatter(1000000000000000)).toEqual('1,000,000,000,000,000');
});
