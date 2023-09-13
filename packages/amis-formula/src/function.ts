import {Evaluator} from './evalutor';
import {FunctionMap, FunctionDocMap, FunctionDocItem} from './types';

export const functions: FunctionMap = {};

export function registerFunction(
  name: string,
  fn: (input: any, ...args: any[]) => any
): void {
  functions[`fn${name}`] = fn;
  Evaluator.setDefaultFunctions(functions);
}

export let functionDocs: FunctionDocMap = {};

export function registerFunctionDoc(groupName: string, item: FunctionDocItem) {
  if (functionDocs[groupName]) {
    functionDocs[groupName].push(item);
  } else {
    functionDocs[groupName] = [item];
  }
}
