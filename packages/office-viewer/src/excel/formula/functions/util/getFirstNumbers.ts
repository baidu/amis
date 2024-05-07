import {EvalResult} from '../../eval/EvalResult';
import {getNumber} from './getNumber';
import {getNumbers} from './getNumbers';

/**
 * 获取参数中的数字，如果是数组则取第一个
 */
export function getFirstNumbers(
  args: EvalResult[],
  booleanToNumber: boolean
): number[] {
  if (args.length === 1 && Array.isArray(args[0])) {
    return getNumbers(args[0], undefined, booleanToNumber);
  }
  const numbers: number[] = [];
  for (let arg of args) {
    if (Array.isArray(arg)) {
      if (arg.length > 0) {
        arg = arg[0];
      }
    }
    const num = getNumber(arg, undefined, booleanToNumber);
    if (num !== undefined) {
      numbers.push(num);
    }
  }
  return numbers;
}
