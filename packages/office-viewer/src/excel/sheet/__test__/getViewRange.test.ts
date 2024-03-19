// import {getRange, getRange, getRangeInLength} from '../getViewRange';

import {findStartInCache, getRange} from '../getViewRange';

const cacheExample = [
  {offset: 0, size: 5},
  {offset: 20, size: 0},
  {offset: 20, size: 10},
  {offset: 30, size: 10},
  {offset: 60, size: 10},
  {offset: 80, size: 5},
  {offset: 100, size: 10}
];

test('searchIndex', () => {
  expect(findStartInCache(cacheExample, 1)).toBe(0);
  expect(findStartInCache(cacheExample, 20)).toBe(1);
  expect(findStartInCache(cacheExample, 30)).toBe(2);
  expect(findStartInCache(cacheExample, 35)).toBe(3);
  expect(findStartInCache(cacheExample, 80)).toBe(5);
  expect(findStartInCache(cacheExample, 90)).toBe(6);
  expect(findStartInCache(cacheExample, 110)).toBe(6);
});

const sizeFunc = () => 20;

test('simple.1', () => {
  // 正好显示 3 个
  const range = getRange(0, 0, 60, sizeFunc);

  expect(range.indexes).toEqual([0, 1, 2]);
  expect(range.sizes).toEqual([
    {size: 20, offset: 0},
    {size: 20, offset: 20},
    {size: 20, offset: 40}
  ]);
});

test('simple.2', () => {
  // 有 offset 但小于默认长度，显示 4 个
  const range = getRange(15, 0, 60, sizeFunc);

  expect(range.indexes).toEqual([0, 1, 2, 3]);
  expect(range.sizes).toEqual([
    {
      size: 20,
      offset: -15
    },
    {
      size: 20,
      offset: 5
    },
    {
      size: 20,
      offset: 25
    },
    {
      size: 20,
      offset: 45
    }
  ]);
});

test('simple.3', () => {
  // 有 offset 但小于默认长度，显示 4 个
  const range = getRange(15, 0, 60, sizeFunc);

  expect(range).toEqual({
    indexes: [0, 1, 2, 3],
    sizes: [
      {
        size: 20,
        offset: -15
      },
      {
        size: 20,
        offset: 5
      },
      {
        size: 20,
        offset: 25
      },
      {
        size: 20,
        offset: 45
      }
    ],
    length: 60,
    startOffset: -15
  });
});
