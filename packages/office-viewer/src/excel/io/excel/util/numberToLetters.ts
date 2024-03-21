/**
 * 数字转成字母名，这个输入是从 0 开始，所以不需要加 1
 */

export function numberToLetters(num: number) {
  let letters = '';
  while (num >= 0) {
    letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[num % 26] + letters;
    num = Math.floor(num / 26) - 1;
  }
  return letters;
}
