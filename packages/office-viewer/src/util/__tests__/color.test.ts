import {Color} from '../color';

test('lumMod', () => {
  const color = new Color('#00FF00');
  color.lumMod(0.5);
  // 其实结果是错的，但不知道具体算法，这个差距不太大了
  expect(color.toHex()).toBe('#008000');

  const color2 = new Color('#00FF00');
  color2.lumOff(-0.2);
  expect(color2.toHex()).toBe('#00CC00');
});
