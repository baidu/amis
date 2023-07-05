import {arraySlice} from '../../src/utils/arraySlice';

test(`arrayslice:test`, () => {
  const testArray = [0, 1, 2, 3, 4, 5];
  expect(arraySlice(testArray, ':')).toEqual([0, 1, 2, 3, 4, 5]);
  expect(arraySlice(testArray, '0,3,4')).toEqual([0, 3, 4]);
  expect(arraySlice(testArray, '1:2')).toEqual([1]);
  expect(arraySlice(testArray, '0:-2')).toEqual([0, 1, 2, 3]);
  expect(arraySlice(testArray, '1:-2')).toEqual([1, 2, 3]);
  expect(arraySlice(testArray, '0,1:-2')).toEqual([0, 1, 2, 3]);
});
