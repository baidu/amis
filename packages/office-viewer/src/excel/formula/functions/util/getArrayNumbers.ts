import {EvalResult} from '../../eval/EvalResult';
import {getNumber} from './getNumber';

/**
 *
 * 获取参数中的数字
 * @param args
 * @param process 自定义检查函数
 * @returns
 */
export function getArrayNumbers(args: EvalResult): number[] {
  const numbers: number[] = [];
  if (Array.isArray(args)) {
    for (const arg of args) {
      const num = getNumber(arg);
      if (num !== undefined) {
        numbers.push(num);
      }
    }
  } else {
    let num = getNumber(args);
    if (num !== undefined) {
      numbers.push(num);
    }
  }
  return numbers;
}
