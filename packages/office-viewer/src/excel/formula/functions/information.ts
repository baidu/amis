/**
 * 来自 fast-formula-parser
 */

import FormulaError from '../FormulaError';
import {EvalResult, isErrorValue} from '../eval/EvalResult';
import {regFunc} from './functions';
import {getNumberOrThrow} from './util/getNumber';
import {getSingleValue} from './util/getSingleValue';

const error2Number = {
  '#NULL!': 1,
  '#DIV/0!': 2,
  '#VALUE!': 3,
  '#REF!': 4,
  '#NAME?': 5,
  '#NUM!': 6,
  '#N/A': 7
};

type error2NumberKey = keyof typeof error2Number;

regFunc('ERROR.TYPE', (value: EvalResult) => {
  if (typeof value === 'object' && 'type' in value && value.type === 'Error') {
    return error2Number[value.value as error2NumberKey];
  }
  throw FormulaError.NA;
});

regFunc('ISBLANK', (value: EvalResult) => {
  return value === undefined || value === null || value === '';
});

regFunc('ISERR', (value: EvalResult) => {
  return (
    value &&
    typeof value === 'object' &&
    'type' in value &&
    value.type === 'Error' &&
    value.value !== '#N/A'
  );
});

regFunc('ISERROR', (value: EvalResult) => {
  return isErrorValue(value);
});

regFunc('ISEVEN', (value: EvalResult) => {
  return !(Math.floor(Math.abs(getNumberOrThrow(value))) & 1);
});

regFunc('ISODD', (value: EvalResult) => {
  return !!(Math.floor(Math.abs(getNumberOrThrow(value))) & 1);
});

regFunc('ISLOGICAL', (value: EvalResult) => {
  return typeof value === 'boolean';
});

export function ISNA(value: EvalResult) {
  return (
    value &&
    typeof value === 'object' &&
    'type' in value &&
    value.type === 'Error' &&
    value.value === '#N/A'
  );
}

regFunc('ISNA', ISNA);

regFunc('ISNONTEXT', (value: EvalResult) => {
  return typeof getSingleValue(value) !== 'string';
});

regFunc('ISNUMBER', (value: EvalResult) => {
  return typeof getSingleValue(value) === 'number';
});

regFunc('ISTEXT', (value: EvalResult) => {
  return typeof getSingleValue(value) === 'string';
});

regFunc('N', (value: EvalResult) => {
  value = getSingleValue(value);
  if (typeof value === 'number') {
    return value;
  } else if (typeof value === 'boolean') {
    return value ? 1 : 0;
  } else if (isErrorValue(value)) {
    throw FormulaError.VALUE;
  } else {
    return 0;
  }
});

regFunc('NA', () => {
  throw FormulaError.NA;
});

regFunc('TYPE', (value: EvalResult) => {
  if (typeof value === 'number') {
    return 1;
  } else if (typeof value === 'string') {
    return 2;
  } else if (typeof value === 'boolean') {
    return 4;
  } else if (value === undefined || value === null) {
    return 16;
  } else if (isErrorValue(value)) {
    return 16;
  } else if (Array.isArray(value)) {
    return 64;
  } else {
    return 0;
  }
});
