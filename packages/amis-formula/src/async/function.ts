import {AsyncEvaluator} from './evalutor';
import {FunctionMap} from '../types';

export const functionsForAsync: FunctionMap = {};

export function registerFunctionForAsync(
  name: string,
  fn: (input: any, ...args: any[]) => any
): void {
  functionsForAsync[`fn${name}`] = fn;
  AsyncEvaluator.setDefaultFunctions(functionsForAsync);
}
