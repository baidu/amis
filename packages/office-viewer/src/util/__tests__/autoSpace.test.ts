import {cjkspace} from '../autoSpace';

test('autoSpace', async () => {
  expect(cjkspace('a中'.split(''))).toBe('a 中');
});

test('autoSpace 2', async () => {
  expect(cjkspace('abc中def，测试'.split(''))).toBe('abc 中 def，测试');
});
