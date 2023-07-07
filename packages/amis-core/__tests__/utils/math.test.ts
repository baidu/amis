import {safeAdd, safeSub} from '../../src/utils/math';

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
