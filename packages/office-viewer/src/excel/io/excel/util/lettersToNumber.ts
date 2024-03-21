/**
 * 将字母转成数字
 */
export function lettersToNumber(letters: string) {
  for (var p = 0, n = 0; p < letters.length; p++) {
    n = letters[p].charCodeAt(0) - 64 + n * 26;
  }
  return n;
}
