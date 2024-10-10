import {getRankValue} from '../top10';

const values = [1, 2, 3, 4, 5, 6, 7, 8];

test('top.1', () => {
  const cfRule = {
    rank: 1
  };
  expect(getRankValue(values, cfRule)).toEqual(8);
});

test('top.2', () => {
  const cfRule = {
    rank: 2
  };
  expect(getRankValue(values, cfRule)).toEqual(7);
});

test('bottom.1', () => {
  const cfRule = {
    rank: 1,
    bottom: true
  };
  expect(getRankValue(values, cfRule)).toEqual(1);
});

test('bottom.2', () => {
  const cfRule = {
    rank: 2,
    bottom: true
  };
  expect(getRankValue(values, cfRule)).toEqual(2);
});

test('top-percent.1', () => {
  const cfRule = {
    rank: 1,
    percent: true
  };
  expect(getRankValue(values, cfRule)).toEqual(8);
});

test('top-percent.20', () => {
  const cfRule = {
    rank: 20,
    percent: true
  };
  expect(getRankValue(values, cfRule)).toEqual(7);
});

test('bottom-percent.1', () => {
  const cfRule = {
    rank: 1,
    bottom: true,
    percent: true
  };
  expect(getRankValue(values, cfRule)).toEqual(1);
});
