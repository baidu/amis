import {OptionValue, Option} from '../types';
import {isObject} from './helper';

export function matchOptionValue(
  a: OptionValue,
  b: Option,
  valueField: string = 'value'
) {
  return isObject(a)
    ? a === b[valueField || 'value']
    : String(b[valueField || 'value']) === String(a);
}

export function optionValueCompare(
  a: OptionValue,
  valueField: string = 'value'
) {
  return (b: Option) => matchOptionValue(a, b, valueField);
}
