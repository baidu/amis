/**
 * 判断字符串是否为数字
 */
export function isNumeric(str: string) {
  return !isNaN(parseFloat(str));
}
