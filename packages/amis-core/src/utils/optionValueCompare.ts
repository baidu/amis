import {OptionValue, Option} from '../types';
import {isObject} from './helper';
import isEqual from 'lodash/isEqual';

export function getOptionValue(
  value: OptionValue,
  valueField: string = 'value'
) {
  return isObject(value) &&
    value &&
    (value as Option).hasOwnProperty(valueField)
    ? (value as Option)[valueField]
    : value;
}

export function getOptionValueBindField(valueField: string = 'value') {
  return (value: OptionValue) => getOptionValue(value, valueField);
}

export function matchOptionValue(
  a: OptionValue,
  b: Option,
  valueField: string = 'value'
) {
  // a 可能为 Option, 此时需要取其value
  const aValue = getOptionValue(a, valueField);
  const bValue = b[valueField || 'value'];
  return isObject(aValue)
    ? isEqual(aValue, bValue)
    : // 当值均为 undefined 时，不应该判定相等
      aValue !== undefined &&
        bValue !== undefined &&
        String(bValue) === String(aValue);
}

export function optionValueCompare(
  a: OptionValue,
  valueField: string = 'value'
) {
  return (b: Option) => matchOptionValue(a, b, valueField);
}
