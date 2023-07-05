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
