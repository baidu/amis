import FormulaError from '../../FormulaError';
import {EvalResult} from '../../eval/EvalResult';

export function getString(
  arg: EvalResult,
  defaultValue?: string
): string | undefined {
  if (Array.isArray(arg)) {
    return getString(arg[0], defaultValue);
  }
  if (typeof arg === 'number') {
    return arg + '';
  }
  if (typeof arg === 'string') {
    return arg;
  }
  if (typeof arg === 'boolean') {
    if (arg) {
      return 'TRUE';
    }
    return 'FALSE';
  }
  if (defaultValue !== undefined) {
    return defaultValue;
  }
  return undefined;
}

export function getStringOrThrow(arg: EvalResult): string {
  const str = getString(arg);
  if (str === undefined) {
    throw FormulaError.VALUE;
  }
  return str;
}

export function getStringWithDefault(
  arg: EvalResult,
  defaultValue: string
): string {
  return getString(arg, defaultValue)!;
}
