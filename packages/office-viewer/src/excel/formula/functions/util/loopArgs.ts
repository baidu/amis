import {EvalResult, UnionValue, isUnionValue} from '../../eval/EvalResult';

export function loopArgs(args: EvalResult[], hook: (arg: EvalResult) => void) {
  for (const arg of args) {
    if (Array.isArray(arg)) {
      for (const item of arg) {
        loopArgs([item], hook);
      }
    } else if (isUnionValue(arg)) {
      loopArgs((arg as UnionValue).children, hook);
    } else {
      hook(arg);
    }
  }
}
