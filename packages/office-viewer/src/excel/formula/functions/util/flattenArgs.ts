import {EvalResult, UnionValue, isUnionValue} from '../../eval/EvalResult';

/**
 * 将结果打平成一维数组
 */
export function flattenArgs(args: EvalResult[]): EvalResult[] {
  const result: EvalResult[] = [];

  for (const arg of args) {
    if (Array.isArray(arg)) {
      for (const item of arg) {
        result.push(...flattenArgs([item]));
      }
    } else if (isUnionValue(arg)) {
      result.push(...flattenArgs((arg as UnionValue).children));
    } else {
      result.push(arg);
    }
  }

  return result;
}
