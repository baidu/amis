import {EvalResult} from './EvalResult';

export function toString(evalResult: EvalResult) {
  if (typeof evalResult === 'boolean') {
    return evalResult ? 'TRUE' : 'FALSE';
  }
  return '' + evalResult;
}
