export function safeAdd(arg1: number, arg2: number) {
  let digits1, digits2, maxDigits;
  try {
    digits1 = arg1.toString().split('.')[1].length;
  } catch (e) {
    digits1 = 0;
  }
  try {
    digits2 = arg2.toString().split('.')[1].length;
  } catch (e) {
    digits2 = 0;
  }
  maxDigits = Math.pow(10, Math.max(digits1, digits2));
  return (arg1 * maxDigits + arg2 * maxDigits) / maxDigits;
}

//减
export function safeSub(arg1: number, arg2: number) {
  let digits1, digits2, maxDigits;
  try {
    digits1 = arg1.toString().split('.')[1].length;
  } catch (e) {
    digits1 = 0;
  }
  try {
    digits2 = arg2.toString().split('.')[1].length;
  } catch (e) {
    digits2 = 0;
  }
  maxDigits = Math.pow(10, Math.max(digits1, digits2));
  return (arg1 * maxDigits - arg2 * maxDigits) / maxDigits;
}

export function numberFormatter(num: number | string, precision: number = 0) {
  const ZERO = 0;
  const number = +num;
  if (typeof number === 'number' && !isNaN(number)) {
    const regexp = precision ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(\d{3})+$)/g;
    return number.toFixed(precision).replace(regexp, '$1,');
  }
  return ZERO.toFixed(precision);
}
