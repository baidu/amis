/**
 * 来自 fast-formula-parser
 */

import FormulaError from '../FormulaError';
import {EvalResult, isErrorValue} from '../eval/EvalResult';
import {regFunc} from './functions';
import {getBoolean} from './util/getBoolean';
import {loopArgs} from './util/loopArgs';
import {ISNA} from './information';
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

function getNumLogicalValue(params: EvalResult[]) {
  let numTrue = 0,
    numFalse = 0;
  loopArgs(params, val => {
    const type = typeof val;
    if (type === 'string') {
      if (val === 'TRUE') val = true;
      else if (val === 'FALSE') val = false;
    } else if (type === 'number') val = Boolean(val);

    if (typeof val === 'boolean') {
      if (val === true) numTrue++;
      else numFalse++;
    }
  });
  return [numTrue, numFalse];
}

regFunc('AND', (...params: EvalResult[]) => {
  const [numTrue, numFalse] = getNumLogicalValue(params);
  // OR returns #VALUE! if no logical values are found.
  if (numTrue === 0 && numFalse === 0) {
    throw FormulaError.VALUE;
  }

  return numTrue > 0 && numFalse === 0;
});

regFunc('FALSE', () => false);

regFunc(
  'IF',
  (
    logicalTest: EvalResult,
    valueIfTrue: EvalResult,
    valueIfFalse: EvalResult = false
  ) => {
    logicalTest = getBoolean(logicalTest);
    return logicalTest ? valueIfTrue : valueIfFalse;
  }
);

regFunc('IFERROR', (value: EvalResult, valueIfError: EvalResult) => {
  return isErrorValue(value) ? valueIfError : value;
});

regFunc('IFS', (...params: EvalResult[]) => {
  if (params.length % 2 !== 0) {
    throw FormulaError.VALUE;
  }
  for (let i = 0; i < params.length / 2; i += 2) {
    const logicalTest = getBoolean(params[i * 2]);
    const valueIfTrue = params[i * 2 + 1];
    if (logicalTest) {
      return valueIfTrue;
    }
  }
  throw FormulaError.NA;
});

regFunc(
  'IFNA',
  (value: EvalResult, valueIfNa: EvalResult, other: EvalResult) => {
    if (other !== undefined) {
      throw FormulaError.TOO_MANY_ARGS('IFNA');
    }
    return ISNA(value) ? valueIfNa : value;
  }
);

regFunc('NOT', (logical: EvalResult) => {
  return !getBoolean(logical);
});

regFunc('OR', (...params: EvalResult[]) => {
  const [numTrue, numFalse] = getNumLogicalValue(params);

  // OR returns #VALUE! if no logical values are found.
  if (numTrue === 0 && numFalse === 0) {
    throw FormulaError.VALUE;
  }

  return numTrue > 0;
});

regFunc('TRUE', () => true);

regFunc('SWITCH', function SWITCH() {
  let result;

  if (arguments.length > 0) {
    const targetValue = getSingleValue(arguments[0]);
    const argc = arguments.length - 1;
    const switchCount = Math.floor(argc / 2);
    let switchSatisfied = false;
    const hasDefaultClause = argc % 2 !== 0;
    const defaultClause =
      argc % 2 === 0 ? null : arguments[arguments.length - 1];

    if (switchCount) {
      for (let index = 0; index < switchCount; index++) {
        if (targetValue === arguments[index * 2 + 1]) {
          result = arguments[index * 2 + 2];
          switchSatisfied = true;
          break;
        }
      }
    }

    if (!switchSatisfied) {
      if (hasDefaultClause) {
        return result;
      }
      throw FormulaError.NA;
    }
  } else {
    throw FormulaError.VALUE;
  }

  return result;
});

regFunc('XOR', (...params: EvalResult[]) => {
  const [numTrue, numFalse] = getNumLogicalValue(params);

  // XOR returns #VALUE! if no logical values are found.
  if (numTrue === 0 && numFalse === 0) {
    throw FormulaError.VALUE;
  }

  return numTrue % 2 === 1;
});
