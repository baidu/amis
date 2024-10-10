import FormulaError from '../../FormulaError';
import {EvalResult} from '../../eval/EvalResult';

export function getDateOrThrow(arg: EvalResult): Date {
  if (Array.isArray(arg)) {
    return getDateOrThrow(arg[0]);
  }
  if (arg instanceof Date) {
    return arg;
  }
  throw FormulaError.VALUE;
}
