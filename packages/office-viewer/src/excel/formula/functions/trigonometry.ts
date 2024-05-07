/**
 * 三角相关的函数，主要参考 fast-formula-parser 里的实现
 * https://github.com/LesterLyu/fast-formula-parser
 */

import FormulaError from '../FormulaError';
import {EvalResult} from '../eval/EvalResult';
import {functions, regFunc} from './functions';
import {getNumberOrThrow} from './util/getNumber';

const MAX_NUMBER = 2 ** 27 - 1;

regFunc('AGGREGATE', (...args: EvalResult[]) => {
  const function_num = getNumberOrThrow(args[0]);
  const options = getNumberOrThrow(args[1]);
  const ref1 = args[2];
  const ref2 = args[3];
  switch (function_num) {
    case 1:
      return functions.get('AVERAGE')!(ref1);
    case 2:
      return functions.get('COUNT')!(ref1);
    case 3:
      return functions.get('COUNTA')!(ref1);
    case 4:
      return functions.get('MAX')!(ref1);
    case 5:
      return functions.get('MIN')!(ref1);
    case 6:
      return functions.get('PRODUCT')!(ref1);
    case 7:
      return functions.get('STDEV.S')!(ref1);
    case 8:
      return functions.get('STDEV.P')!(ref1);
    case 9:
      return functions.get('SUM')!(ref1);
    case 10:
      return functions.get('VAR.S')!(ref1);
    case 11:
      return functions.get('VAR.P')!(ref1);
    case 12:
      return functions.get('MEDIAN')!(ref1);
    case 13:
      return functions.get('MODE.SNGL')!(ref1);
    case 14:
      return functions.get('LARGE')!(ref1, ref2);
    case 15:
      return functions.get('SMALL')!(ref1, ref2);
    case 16:
      return functions.get('PERCENTILE.INC')!(ref1, ref2);
    case 17:
      return functions.get('QUARTILE.INC')!(ref1, ref2);
    case 18:
      return functions.get('PERCENTILE.EXC')!(ref1, ref2);
    case 19:
      return functions.get('QUARTILE.EXC')!(ref1, ref2);
  }
  throw FormulaError.VALUE;
});

regFunc('ACOS', (arg: EvalResult) => {
  const number = getNumberOrThrow(arg);
  if (number > 1 || number < -1) {
    throw FormulaError.NUM;
  }
  return Math.acos(number);
});

regFunc('ACOSH', (arg: EvalResult) => {
  const number = getNumberOrThrow(arg);
  if (number < 1) {
    throw FormulaError.NUM;
  }
  return Math.acosh(number);
});

regFunc('ACOT', (arg: EvalResult) => {
  const number = getNumberOrThrow(arg);
  return Math.PI / 2 - Math.atan(number);
});

regFunc('ACOTH', (arg: EvalResult) => {
  const number = getNumberOrThrow(arg);
  if (Math.abs(number) <= 1) {
    throw FormulaError.NUM;
  }
  return Math.atanh(1 / number);
});

regFunc('ASIN', (arg: EvalResult) => {
  const number = getNumberOrThrow(arg);
  if (number > 1 || number < -1) {
    throw FormulaError.NUM;
  }
  return Math.asin(number);
});

regFunc('ASINH', (arg: EvalResult) => {
  const number = getNumberOrThrow(arg);
  return Math.asinh(number);
});

regFunc('ATAN', (arg: EvalResult) => {
  const number = getNumberOrThrow(arg);
  return Math.atan(number);
});

regFunc('ATAN2', (arg1: EvalResult, arg2: EvalResult) => {
  const x = getNumberOrThrow(arg1);
  const y = getNumberOrThrow(arg2);
  if (y === 0 && x === 0) {
    throw FormulaError.DIV0;
  }
  return Math.atan2(y, x);
});

regFunc('ATANH', (arg: EvalResult) => {
  const number = getNumberOrThrow(arg);
  if (Math.abs(number) > 1) {
    throw FormulaError.NUM;
  }
  return Math.atanh(number);
});

regFunc('COS', (arg: EvalResult) => {
  const number = getNumberOrThrow(arg);
  if (Math.abs(number) > MAX_NUMBER) {
    throw FormulaError.NUM;
  }
  return Math.cos(number);
});

regFunc('COSH', (arg: EvalResult) => {
  const number = getNumberOrThrow(arg);
  return Math.cosh(number);
});

regFunc('COT', (arg: EvalResult) => {
  const number = getNumberOrThrow(arg);
  if (Math.abs(number) > MAX_NUMBER) {
    throw FormulaError.NUM;
  }

  if (number === 0) {
    throw FormulaError.DIV0;
  }

  return 1 / Math.tan(number);
});

regFunc('COTH', (arg: EvalResult) => {
  const number = getNumberOrThrow(arg);
  if (number === 0) {
    throw FormulaError.DIV0;
  }

  return 1 / Math.tanh(number);
});

regFunc('CSC', (arg: EvalResult) => {
  const number = getNumberOrThrow(arg);
  if (Math.abs(number) > MAX_NUMBER) {
    throw FormulaError.NUM;
  }
  return 1 / Math.sin(number);
});

regFunc('CSCH', (arg: EvalResult) => {
  const number = getNumberOrThrow(arg);
  if (number === 0) {
    throw FormulaError.DIV0;
  }
  return 1 / Math.sinh(number);
});

regFunc('SEC', (arg: EvalResult) => {
  const number = getNumberOrThrow(arg);
  if (Math.abs(number) > MAX_NUMBER) {
    throw FormulaError.NUM;
  }
  return 1 / Math.cos(number);
});

regFunc('SECH', (arg: EvalResult) => {
  const number = getNumberOrThrow(arg);
  return 1 / Math.cosh(number);
});

regFunc('SIN', (arg: EvalResult) => {
  const number = getNumberOrThrow(arg);
  if (Math.abs(number) > MAX_NUMBER) {
    throw FormulaError.NUM;
  }
  return Math.sin(number);
});

regFunc('SINH', (arg: EvalResult) => {
  const number = getNumberOrThrow(arg);
  return Math.sinh(number);
});

regFunc('TAN', (arg: EvalResult) => {
  const number = getNumberOrThrow(arg);
  if (Math.abs(number) > MAX_NUMBER) {
    throw FormulaError.NUM;
  }
  return Math.tan(number);
});

regFunc('TANH', (arg: EvalResult) => {
  const number = getNumberOrThrow(arg);
  return Math.tanh(number);
});
