/**
 * 获取默认 val，20.1.10.56
 *
 * @param width
 * @param height
 */
export function presetVal(w: number, h: number) {
  const ss = Math.min(w, h);
  const ssd2 = ss / 6;
  const ssd6 = ss / 6;
  const ssd8 = ss / 8;
  const ssd32 = ss / 32;
  const ssd16 = ss / 16;
  return {
    't': 0,

    '3cd4': 16200000,
    '3cd8': 8100000,
    '5cd8': 13500000,
    '7cd8': 18900000,
    'b': h,
    'cd2': 10800000,
    'cd4': 5400000,
    'cd8': 2700000,
    h,
    'hd2': h / 2,
    'hd3': h / 3,
    'hd4': h / 4,
    'hd6': h / 6,
    'hd8': h / 8,
    'l': 0,
    'ls': Math.max(w, h),
    'r': w,

    ss,
    ssd2,
    ssd6,
    ssd8,
    ssd16,
    ssd32,

    'hc': w / 2,

    'vc': h / 2,
    w,
    'wd2': w / 2,
    'wd3': w / 3,
    'wd4': w / 4,
    'wd6': w / 6,
    'wd8': w / 8,
    'wd10': w / 10,
    'wd16': w / 16,
    'wd32': w / 32
  };
}
