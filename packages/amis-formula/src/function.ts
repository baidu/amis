import {Evaluator} from './evalutor';
import {FunctionMap} from './types';

export const functions: FunctionMap = {};

export function registerFunction(
  name: string,
  fn: (input: any, ...args: any[]) => any
): void {
  functions[`fn${name}`] = fn;
  Evaluator.setDefaultFunctions(functions);
}

/**
 * 设置自定义函数，functions中找不到处理的函数时执行
 * @param fn
 */
export function setFormulaEvalHandler(
  fn: (path: string, data?: object, ...args: any[]) => any
): void {
  Evaluator.setFormulaEvalHandler(fn);
}
