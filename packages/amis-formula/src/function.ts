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
