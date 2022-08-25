// 主要用于解决 0.1+0.2 结果的精度问题导致太长
export function stripNumber(number: number) {
  if (typeof number === 'number' && !Number.isInteger(number)) {
    return parseFloat(number.toPrecision(12));
  } else {
    return number;
  }
}
