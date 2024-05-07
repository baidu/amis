import {EvalResult} from '../../eval/EvalResult';

import {getNumber, getNumberOrThrow} from './getNumber';

type NumOr = number | undefined;

/**
 *
 * 获取参数中的数字
 * @param args
 * @param process 自定义检查函数
 * @returns
 */
export function getNumber2DArray(args: EvalResult): NumOr[][] {
  const numbers: NumOr[][] = [];
  if (Array.isArray(args)) {
    for (const arg of args) {
      const array = [];
      if (Array.isArray(arg)) {
        for (const a of arg) {
          let num = getNumber(a);
          array.push(num);
        }
      } else {
        let num = getNumber(arg);
        array.push(num);
      }
      numbers.push(array);
    }
  } else {
    let num = getNumber(args);
    numbers.push([num]);
  }
  return numbers;
}

export function getNumber2DArrayOrThrow(args: EvalResult): number[][] {
  const numbers: number[][] = [];
  if (Array.isArray(args)) {
    for (const arg of args) {
      const array = [];
      if (Array.isArray(arg)) {
        for (const a of arg) {
          let num = getNumberOrThrow(a);
          array.push(num);
        }
      } else {
        let num = getNumberOrThrow(arg);
        array.push(num);
      }
      numbers.push(array);
    }
  } else {
    let num = getNumberOrThrow(args);
    numbers.push([num]);
  }
  return numbers;
}
