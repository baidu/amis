import FormulaError from '../../FormulaError';
import {EvalResult} from '../../eval/EvalResult';

/**
 *
 * 获取参数中的布尔值
 * @param arg
 * @param defaultValue 默认值
 * @returns
 */
export function getBoolean(
  arg: EvalResult,
  defaultValue?: boolean
): boolean | undefined {
  if (typeof arg === 'number') {
    if (arg === 0) {
      return false;
    }
    return true;
  }
  if (typeof arg === 'string') {
    if (arg === 'TRUE') {
      return true;
    }
    if (arg === 'FALSE') {
      return false;
    }
  }
  if (typeof arg === 'boolean') {
    return arg;
  }

  if (defaultValue !== undefined) {
    return defaultValue;
  }

  return undefined;
}

export function getBooleanOrThrow(arg: EvalResult): boolean {
  const result = getBoolean(arg);
  if (result === undefined) {
    throw new FormulaError('VALUE');
  }
  return result;
}

export function getBooleanWithDefault(
  arg: EvalResult,
  defaultValue: boolean
): boolean {
  return getBoolean(arg, defaultValue)!;
}
