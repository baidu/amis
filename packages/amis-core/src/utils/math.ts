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

export function numberFormatter(num: number | string, precision?: number) {
  const ZERO = 0;
  const number = +num;
  const finalP =
    typeof precision === 'number'
      ? precision
      : number.toString().split('.')[1]?.length || 0;
  if (typeof number === 'number' && !isNaN(number)) {
    const regexp = finalP ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(\d{3})+$)/g;
    return number.toFixed(finalP).replace(regexp, '$1,');
  }
  return ZERO.toFixed(finalP);
}

// 还原千分符格式化的值，并保留小数点后的精度
export function numberReverter(value: string | number | undefined) {
  if (!value) return '';
  const stringValue = value.toString();
  const withoutCommas = stringValue.replace(/,/g, '');

  // 如果原始字符串有小数点，保留小数部分的精度
  if (stringValue.includes('.')) {
    const decimalPlaces = stringValue.split('.')[1].length;
    return Number(withoutCommas).toFixed(decimalPlaces);
  }

  // 对于整数，直接返回转换后的数字
  return withoutCommas;
}

/**
 * 判断一个数字是否为整数，且在给定范围内
 *
 * @param num 要判断的数字
 * @param options 范围选项，包括 start、end、left、right
 * @param options.start 范围起始值
 * @param options.end 范围结束值
 * @param options.left 范围的左边界类型，默认为 'inclusive'，可选值为 'inclusive'(闭区间) 或 'exclusive'(开区间)
 * @param options.right 范围的右边界类型，默认为 'inclusive'，可选值为 'inclusive'(闭区间) 或 'exclusive'(开区间)
 * @returns 如果数字在给定范围内则返回 true，否则返回 false
 */
export function isIntegerInRange(
  num: number,
  options: {
    start: number;
    end: number;
    left: 'inclusive' | 'exclusive';
    right: 'inclusive' | 'exclusive';
  }
) {
  const {start, end, left = 'inclusive', right = 'inclusive'} = options || {};

  if (num == null || typeof num !== 'number' || !Number.isSafeInteger(num)) {
    return false;
  }

  if (left === 'exclusive' && right === 'exclusive') {
    return num > start && num < end;
  } else if (left === 'inclusive' && right === 'exclusive') {
    return num >= start && num < end;
  } else if (left === 'exclusive' && right === 'inclusive') {
    return num > start && num <= end;
  } else {
    return num >= start && num <= end;
  }
}
