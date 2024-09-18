import {Evaluator} from './evalutor';
import {FunctionDocMap, FunctionDocItem} from './types';

export function registerFunction(
  name: string,
  fn: (input: any, ...args: any[]) => any
): void {
  Evaluator.extendDefaultFunctions({
    [`fn${name}`]: fn
  });
}

export const functionDocs: FunctionDocMap = {};

export function registerFunctionDoc(groupName: string, item: FunctionDocItem) {
  if (functionDocs[groupName]) {
    functionDocs[groupName].push(item);
  } else {
    functionDocs[groupName] = [item];
  }
}
