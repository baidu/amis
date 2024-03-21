/**
 * 清楚数字的小数点后多余的0
 */

export function stripNumber(number: number, precision = 16) {
  if (typeof number === 'number' && !Number.isInteger(number)) {
    return parseFloat(number.toPrecision(precision));
  } else {
    return number;
  }
}
