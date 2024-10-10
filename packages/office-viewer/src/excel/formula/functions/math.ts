/**
 * 数学相关的函数，主要参考 fast-formula-parser 里的实现
 * https://github.com/LesterLyu/fast-formula-parser
 */

import FormulaError from '../FormulaError';
import {EvalResult} from '../eval/EvalResult';
import {Factorials, factorial, factorialDouble} from './util/Factorials';
import {functions, regFunc} from './functions';
import {
  getNumber,
  getNumberOrThrow,
  getNumberWithDefault
} from './util/getNumber';
import {getNumbers} from './util/getNumbers';
import {getNumber2DArray} from './util/getNumbersWithUndefined';
import {getString, getStringOrThrow} from './util/getString';
import {parseCriteria} from '../parser/parseCriteria';
import {evalCriterial} from '../eval/evalCriterial';
import {getArray} from './util/getArray';
import {evalIFS} from './util/evalIFS';

// https://support.microsoft.com/en-us/office/abs-function-3420200f-5628-4e8c-99da-c99d7c87713c
regFunc('ABS', (arg: EvalResult) => {
  const num = getNumberOrThrow(arg);
  return Math.abs(num);
});

// https://support.microsoft.com/en-us/office/arabic-function-9a8da418-c17b-4ef9-a657-9370a30a674f
regFunc('ARABIC', (...args: EvalResult[]) => {
  const str = getStringOrThrow(args[0]);
  const roman = str.toUpperCase();
  if (
    !/^M*(?:D?C{0,3}|C[MD])(?:L?X{0,3}|X[CL])(?:V?I{0,3}|I[XV])$/.test(roman)
  ) {
    throw FormulaError.VALUE;
  }
  let r = 0;
  roman.replace(/[MDLV]|C[MD]?|X[CL]?|I[XV]?/g, function (i) {
    r +=
      {
        M: 1000,
        CM: 900,
        D: 500,
        CD: 400,
        C: 100,
        XC: 90,
        L: 50,
        XL: 40,
        X: 10,
        IX: 9,
        V: 5,
        IV: 4,
        I: 1
      }[i] || 0;
    return '';
  });

  return r;
});

// https://support.microsoft.com/en-us/office/base-function-2ef61411-aee9-4f29-a811-1c42456c6342
regFunc('BASE', (...args: EvalResult[]) => {
  const numbers = getNumbers(args);
  if (numbers.length < 2) {
    throw FormulaError.VALUE;
  }
  const number = numbers[0];
  if (number < 0 || number >= 2 ** 53) {
    throw FormulaError.NUM;
  }

  const radix = numbers[1];
  if (radix < 2 || radix > 36) {
    throw FormulaError.NUM;
  }
  const minLength = numbers.length > 2 ? numbers[2] : 0;
  if (minLength < 0) {
    throw FormulaError.NUM;
  }
  const result = number.toString(radix).toUpperCase();
  const res =
    new Array(Math.max(minLength + 1 - result.length, 0)).join('0') + result;
  return res;
});

// https://support.microsoft.com/en-us/office/ceiling-function-0a5cd7c8-0720-4f0a-bd2c-c943e510899f
function CEILING(...args: EvalResult[]) {
  const numbers = getNumbers(args);
  if (numbers.length !== 2) {
    throw FormulaError.VALUE;
  }
  const number = numbers[0];
  const significance = numbers[1];

  if (significance === 0) {
    return 0;
  }

  if ((number / significance) % 1 === 0) {
    return number;
  }
  const absSignificance = Math.abs(significance);
  const times = Math.floor(Math.abs(number) / absSignificance);
  if (number < 0) {
    // round down, away from zero
    const roundDown = significance < 0;
    return roundDown
      ? -absSignificance * (times + 1)
      : -absSignificance * times;
  } else {
    return (times + 1) * absSignificance;
  }
}

regFunc('CEILING', CEILING);

// https://support.microsoft.com/en-us/office/ceiling-math-function-80f95d2f-b499-4eee-9f16-f795a8e306c8
regFunc('CEILING.MATH', (...args: EvalResult[]) => {
  const number = getNumberOrThrow(args[0]);
  const significance = getNumber(args[1], number > 0 ? 1 : -1)!;
  const mode = getNumber(args[2], 0)!;
  if (number >= 0) {
    return CEILING(number, significance);
  }
  // if round down, away from zero, then significance
  const offset = mode ? significance : 0;
  return CEILING(number, significance) - offset;
});

// https://support.microsoft.com/en-us/office/ceiling-precise-function-f366a774-527a-4c92-ba49-af0a196e66cb
regFunc('CEILING.PRECISE', (...args: EvalResult[]) => {
  const number = getNumberOrThrow(args[0]);
  const significance = getNumber(args[1], 1)!;
  return CEILING(number, Math.abs(significance));
});

function COMBIN(number: number, numberChosen: number) {
  if (number < 0 || numberChosen < 0 || number < numberChosen) {
    throw FormulaError.NUM;
  }
  const nFactorial = FACT(number),
    kFactorial = FACT(numberChosen);
  return nFactorial / kFactorial / FACT(number - numberChosen);
}

// https://support.microsoft.com/en-us/office/combin-function-12a3f276-0a21-423a-8de6-06990aaf638a
regFunc('COMBIN', (...args: EvalResult[]) => {
  const numbers = getNumbers(args);
  if (numbers.length !== 2) {
    throw FormulaError.VALUE;
  }
  return COMBIN(numbers[0], numbers[1]);
});

// https://support.microsoft.com/en-us/office/combina-function-efb49eaa-4f4c-4cd2-8179-0ddfcf9d035d
regFunc('COMBINA', (...args: EvalResult[]) => {
  const number = getNumberOrThrow(args[0]);
  const numberChosen = getNumberOrThrow(args[1]);
  if ((number === 0 || number === 1) && numberChosen === 0) {
    return 1;
  }
  if (number < 0 || numberChosen < 0) {
    throw FormulaError.NUM;
  }
  return COMBIN(number + numberChosen - 1, number - 1);
});

regFunc('DECIMAL', (...args: EvalResult[]) => {
  if (args.length != 2) {
    throw FormulaError.VALUE;
  }
  const text = getStringOrThrow(args[0]);
  let radix = getNumberOrThrow(args[1]);

  radix = Math.trunc(radix);
  if (radix < 2 || radix > 36) {
    throw FormulaError.NUM;
  }
  const res = parseInt(text, radix);
  if (isNaN(res)) {
    throw FormulaError.NUM;
  }
  return res;
});

regFunc('DEGREES', (arg: EvalResult) => {
  const num = getNumberOrThrow(arg);
  return (num * 180) / Math.PI;
});

regFunc('EVEN', (arg: EvalResult) => {
  const num = getNumberOrThrow(arg);
  return CEILING(num, -2);
});

regFunc('EXP', (arg: EvalResult) => {
  const num = getNumberOrThrow(arg);
  return Math.exp(num);
});

function FACT(num: number) {
  num = Math.trunc(num);
  if (num > 170 || num < 0) {
    throw FormulaError.NUM;
  }
  if (num <= 100) {
    return Factorials[num];
  }
  return factorial(num);
}

regFunc('FACT', (arg: EvalResult) => {
  const num = getNumberOrThrow(arg);
  return FACT(num);
});

regFunc('FACTDOUBLE', (arg: EvalResult) => {
  let number = getNumberOrThrow(arg);
  number = Math.trunc(number);
  if (number < -1) {
    throw FormulaError.NUM;
  }
  if (number === -1) {
    return 1;
  }

  return factorialDouble(number);
});

export function FLOOR(number: number, significance: number) {
  if (significance === 0) {
    return 0;
  }
  if (number > 0 && significance < 0) {
    throw FormulaError.NUM;
  }
  if ((number / significance) % 1 === 0) {
    return number;
  }
  const absSignificance = Math.abs(significance);
  const times = Math.floor(Math.abs(number) / absSignificance);
  if (number < 0) {
    // round down, away from zero
    const roundDown = significance < 0;
    return roundDown
      ? -absSignificance * times
      : -absSignificance * (times + 1);
  } else {
    // toward zero
    return times * absSignificance;
  }
}

regFunc('FLOOR', (...args: EvalResult[]) => {
  const number = getNumberOrThrow(args[0]);
  const significance = getNumber(args[1], 0)!;
  return FLOOR(number, significance);
});

regFunc('FLOOR.MATH', (...args: EvalResult[]) => {
  const number = getNumberOrThrow(args[0]);
  const significance = getNumber(args[1], number > 0 ? 1 : -1)!;
  const mode = getNumber(args[2], 0)!;

  // The Mode argument does not affect positive numbers.
  if (mode === 0 || number >= 0) {
    // away from zero
    return FLOOR(number, Math.abs(significance));
  }
  // towards zero, add a significance
  return FLOOR(number, significance) + significance;
});

regFunc('FLOOR.PRECISE', (...args: EvalResult[]) => {
  const number = getNumberOrThrow(args[0]);

  const significance = getNumber(args[1], 1)!;
  return FLOOR(number, Math.abs(significance));
});

regFunc('GCD', (...args: EvalResult[]) => {
  const numbers = getNumbers(args, arg => {
    if (arg === undefined) {
      throw FormulaError.VALUE;
    }
    if (arg < 0 || arg > 9007199254740990) {
      throw FormulaError.NUM;
    }

    return Math.trunc(arg);
  });

  // http://rosettacode.org/wiki/Greatest_common_divisor#JavaScript
  let i,
    y,
    n = numbers.length,
    x = Math.abs(numbers[0]);

  for (i = 1; i < n; i++) {
    y = Math.abs(numbers[i]);

    while (x && y) {
      x > y ? (x %= y) : (y %= x);
    }
    x += y;
  }
  return x;
});

regFunc('INT', (arg: EvalResult) => {
  const num = getNumberOrThrow(arg);
  return Math.floor(num);
});

regFunc('ISO.CEILING', (...args: EvalResult[]) => {
  return functions.get('CEILING.PRECISE')!(...args);
});

regFunc('LCM', (...args: EvalResult[]) => {
  const numbers = getNumbers(args, arg => {
    if (arg === undefined) {
      throw FormulaError.VALUE;
    }
    if (arg < 0 || arg > 9007199254740990) {
      throw FormulaError.NUM;
    }

    return Math.trunc(arg);
  });

  let n = numbers.length,
    a = Math.abs(numbers[0]);

  for (let i = 1; i < n; i++) {
    let b = Math.abs(numbers[i]),
      c = a;

    while (a && b) {
      a > b ? (a %= b) : (b %= a);
    }
    a = Math.abs(c * numbers[i]) / (a + b);
  }
  return a;
});

regFunc('LN', (arg: EvalResult) => {
  const num = getNumberOrThrow(arg);
  return Math.log(num);
});

regFunc('LOG', (...args: EvalResult[]) => {
  const number = getNumberOrThrow(args[0]);
  const base = getNumber(args[1], 10)!;
  return Math.log(number) / Math.log(base);
});

regFunc('LOG10', (arg: EvalResult) => {
  const num = getNumberOrThrow(arg);
  return Math.log10(num);
});

function getNum(num: number | undefined): number {
  if (num === undefined) {
    throw FormulaError.VALUE;
  }
  return num;
}

regFunc('MDETERM', (...args: EvalResult[]) => {
  if (args.length !== 1) {
    throw FormulaError.VALUE;
  }
  const array = getNumber2DArray(args[0]);
  if (array.length === 0) {
    throw FormulaError.VALUE;
  }
  if (!Array.isArray(array[0])) {
    throw FormulaError.VALUE;
  }
  if (array[0].length !== array.length) {
    throw FormulaError.VALUE;
  }
  const numRow = array.length,
    numCol = array[0].length;
  let det = 0,
    diagLeft,
    diagRight;

  if (numRow === 1) {
    return array[0][0] || 0;
  } else if (numRow === 2) {
    if (!Array.isArray(array[1])) {
      throw FormulaError.VALUE;
    }

    return (
      getNum(array[0][0]) * getNum(array[1][1]) -
      getNum(array[0][1]) * getNum(array[1][0])
    );
  }

  for (let col = 0; col < numCol; col++) {
    diagLeft = getNum(array[0][col]);
    diagRight = getNum(array[0][col]);

    for (let row = 1; row < numRow; row++) {
      const rowArray = array[row];
      if (!Array.isArray(rowArray) || rowArray === undefined) {
        throw FormulaError.VALUE;
      }

      diagRight *= getNum(rowArray[(((col + row) % numCol) + numCol) % numCol]);
      diagLeft *= getNum(rowArray[(((col - row) % numCol) + numCol) % numCol]);
    }

    det += diagRight - diagLeft;
  }

  return det;
});

regFunc('MMULT', (...args: EvalResult[]) => {
  const array1 = getNumber2DArray(args[0]);
  const array2 = getNumber2DArray(args[1]);
  const aNumRows = array1.length,
    aNumCols = array1[0].length,
    bNumRows = array2.length,
    bNumCols = array2[0].length,
    m = new Array(aNumRows); // initialize array of rows

  if (aNumCols !== bNumRows) {
    throw FormulaError.VALUE;
  }

  for (let r = 0; r < aNumRows; r++) {
    m[r] = new Array(bNumCols); // initialize the current row
    for (let c = 0; c < bNumCols; c++) {
      m[r][c] = 0; // initialize the current cell
      for (let i = 0; i < aNumCols; i++) {
        const v1 = array1[r][i],
          v2 = array2[i][c];
        if (typeof v1 !== 'number' || typeof v2 !== 'number') {
          throw FormulaError.VALUE;
        }

        m[r][c] += array1[r][i]! * array2[i][c]!;
      }
    }
  }
  return m;
});

regFunc('MOD', (...args: EvalResult[]) => {
  const number = getNumberOrThrow(args[0]);
  const divisor = getNumberOrThrow(args[1]);
  if (divisor === 0) {
    throw FormulaError.DIV0;
  }

  return number - divisor * Math.floor(number / divisor);
});

regFunc('MROUND', (...args: EvalResult[]) => {
  const number = getNumberOrThrow(args[0]);
  const multiple = getNumberOrThrow(args[1]);
  if (multiple === 0) {
    return 0;
  }
  if ((number > 0 && multiple < 0) || (number < 0 && multiple > 0)) {
    throw FormulaError.NUM;
  }
  if ((number / multiple) % 1 === 0) {
    return number;
  }
  return Math.round(number / multiple) * multiple;
});

regFunc('MULTINOMIAL', (...args: EvalResult[]) => {
  const numbers = getNumbers(args);
  let numerator = 0,
    denominator = 1;
  for (const num of numbers) {
    if (num < 0) {
      throw FormulaError.NUM;
    }
    numerator += num;
    denominator *= factorial(num);
  }
  return factorial(numerator) / denominator;
});

regFunc('MUNIT', (arg: EvalResult) => {
  const dimension = parseInt(getNumberOrThrow(arg) + '', 10);
  if (dimension < 0) {
    throw FormulaError.NUM;
  }
  if (!dimension || dimension <= 0) {
    throw FormulaError.VALUE;
  }

  return Array(dimension)
    .fill(0)
    .map(() => Array(dimension).fill(0))
    .map((el, i) => {
      el[i] = 1;
      return el;
    });
});

regFunc('ODD', (arg: EvalResult) => {
  const number = getNumberOrThrow(arg);
  if (number === 0) {
    return 1;
  }
  let temp = Math.ceil(Math.abs(number));
  temp = temp & 1 ? temp : temp + 1;
  return number > 0 ? temp : -temp;
});

regFunc('PI', () => Math.PI);

regFunc('POWER', (...args: EvalResult[]) => {
  const number = getNumberOrThrow(args[0]);
  const power = getNumberOrThrow(args[1]);
  return number ** power;
});

regFunc('PRODUCT', (...args: EvalResult[]) => {
  const numbers = getNumbers(args);
  return numbers.reduce((prev, cur) => prev * cur, 1);
});

regFunc('QUOTIENT', (...args: EvalResult[]) => {
  const number = getNumberOrThrow(args[0]);
  const divisor = getNumberOrThrow(args[1]);
  if (divisor === 0) {
    throw FormulaError.DIV0;
  }
  return Math.trunc(number / divisor);
});

regFunc('RADIANS', (arg: EvalResult) => {
  const degrees = getNumberOrThrow(arg);
  return (degrees * Math.PI) / 180;
});

regFunc('RAND', () => Math.random());

function RANK(number: EvalResult, ref: EvalResult, order: EvalResult) {
  const num = getNumberOrThrow(number);
  const array = getNumbers([ref]);
  const ord = getNumberWithDefault(order, 0);
  const sorted = array.slice().sort((a, b) => a - b);
  const index = sorted.indexOf(num);
  if (index === -1) {
    throw FormulaError.NA;
  }
  return ord === 0 ? array.length - index : index + 1;
}
regFunc('RANK', RANK);

regFunc('RANK.EQ', RANK);

regFunc(
  'RANK.AVG',
  (number: EvalResult, ref: EvalResult, order: EvalResult) => {
    const num = getNumberOrThrow(number);
    const array = getNumbers([ref]);
    const ord = getNumberWithDefault(order, 0);
    const sorted = array.slice().sort((a, b) => a - b);
    const index = sorted.indexOf(num);
    if (index === -1) {
      throw FormulaError.NA;
    }
    const count = sorted.filter(v => v === num).length;
    return ord === 0
      ? array.length - index - (count - 1) / 2
      : index + 1 + (count - 1) / 2;
  }
);

regFunc('RANDBETWEEN', (...args: EvalResult[]) => {
  const bottom = getNumberOrThrow(args[0]);
  const top = getNumberOrThrow(args[1]);
  if (bottom > top) {
    throw FormulaError.NUM;
  }

  return Math.floor(Math.random() * (top - bottom + 1) + bottom);
});

regFunc('ROMAN', (...args: EvalResult[]) => {
  const number = getNumberOrThrow(args[0]);
  const form = getNumber(args[1], 0);
  if (form !== 0) {
    throw Error('ROMAN: only allows form=0 (classic form).');
  }
  // The MIT License
  // Copyright (c) 2008 Steven Levithan
  const digits = String(number).split('');
  if (digits.length === 0) {
    throw FormulaError.VALUE;
  }
  const key = [
    '',
    'C',
    'CC',
    'CCC',
    'CD',
    'D',
    'DC',
    'DCC',
    'DCCC',
    'CM',
    '',
    'X',
    'XX',
    'XXX',
    'XL',
    'L',
    'LX',
    'LXX',
    'LXXX',
    'XC',
    '',
    'I',
    'II',
    'III',
    'IV',
    'V',
    'VI',
    'VII',
    'VIII',
    'IX'
  ];
  let roman = '',
    i = 3;
  while (i--) {
    roman = (key[+digits.pop()! + i * 10] || '') + roman;
  }
  return new Array(+digits.join('') + 1).join('M') + roman;
});

regFunc('ROUND', (...args: EvalResult[]) => {
  const number = getNumberOrThrow(args[0]);
  const digits = getNumberOrThrow(args[1]);
  const multiplier = Math.pow(10, Math.abs(digits));
  const sign = number > 0 ? 1 : -1;
  if (digits > 0) {
    return (sign * Math.round(Math.abs(number) * multiplier)) / multiplier;
  } else if (digits === 0) {
    return sign * Math.round(Math.abs(number));
  } else {
    return sign * Math.round(Math.abs(number) / multiplier) * multiplier;
  }
});

regFunc('ROUNDDOWN', (...args: EvalResult[]) => {
  const number = getNumberOrThrow(args[0]);
  const digits = getNumberOrThrow(args[1]);
  const multiplier = Math.pow(10, Math.abs(digits));
  const sign = number > 0 ? 1 : -1;
  if (digits > 0) {
    const offset = (1 / multiplier) * 0.5;
    return (
      (sign * Math.round((Math.abs(number) - offset) * multiplier)) / multiplier
    );
  } else if (digits === 0) {
    const offset = 0.5;
    return sign * Math.round(Math.abs(number) - offset);
  } else {
    const offset = multiplier * 0.5;
    return (
      sign * Math.round((Math.abs(number) - offset) / multiplier) * multiplier
    );
  }
});

regFunc('ROUNDUP', (...args: EvalResult[]) => {
  const number = getNumberOrThrow(args[0]);
  const digits = getNumberOrThrow(args[1]);
  const multiplier = Math.pow(10, Math.abs(digits));
  const sign = number > 0 ? 1 : -1;
  if (digits > 0) {
    const offset = (1 / multiplier) * 0.5;
    return (
      (sign * Math.round((Math.abs(number) + offset) * multiplier)) / multiplier
    );
  } else if (digits === 0) {
    const offset = 0.5;
    return sign * Math.round(Math.abs(number) + offset);
  } else {
    const offset = multiplier * 0.5;
    return (
      sign * Math.round((Math.abs(number) + offset) / multiplier) * multiplier
    );
  }
});

regFunc('SERIESSUM', (argX, argN, argM, ...args: EvalResult[]) => {
  const x = getNumberOrThrow(argX);
  const n = getNumberOrThrow(argN);
  const m = getNumberOrThrow(argM);
  let i = 0;
  let result = 0;
  const coefficients = getNumbers(args);
  for (const coefficient of coefficients) {
    if (i === 0) {
      result = coefficient * Math.pow(x, n);
    } else {
      result += coefficient * Math.pow(x, n + i * m);
    }
    i++;
  }

  return result;
});

regFunc('SIGN', (arg: EvalResult) => {
  const num = getNumberOrThrow(arg);
  return num > 0 ? 1 : num < 0 ? -1 : 0;
});

regFunc('SQRT', (arg: EvalResult) => {
  const num = getNumberOrThrow(arg);
  if (num < 0) {
    throw FormulaError.NUM;
  }
  return Math.sqrt(num);
});

regFunc('SQRTPI', (arg: EvalResult) => {
  const num = getNumberOrThrow(arg);
  if (num < 0) {
    throw FormulaError.NUM;
  }
  return Math.sqrt(num * Math.PI);
});

regFunc('SUM', (...args: EvalResult[]) => {
  const sum = getNumbers(args).reduce((prev, cur) => prev + cur, 0);
  return sum;
});

regFunc(
  'SUMIF',
  (range: EvalResult, criteria: EvalResult, sumRange: EvalResult) => {
    const parsedCriteria = parseCriteria(criteria as string);
    const numbers = getArray([range]) as number[];
    const sumNumbers = sumRange ? getNumbers([sumRange]) : numbers;
    if (numbers.length !== sumNumbers.length) {
      throw FormulaError.VALUE;
    }
    let sum = 0;
    for (let i = 0; i < numbers.length; i++) {
      if (evalCriterial(parsedCriteria, numbers[i])) {
        sum += sumNumbers[i];
      }
    }
    return sum;
  }
);

regFunc('SUMIFS', (...args: EvalResult[]) => {
  const numbers = evalIFS(args) as number[];
  return numbers.reduce((prev, cur) => prev + cur, 0);
});

regFunc('SUMPRODUCT', (array1Arg, ...args: EvalResult[]) => {
  const array1 = getNumber2DArray(array1Arg);
  const arrays = args.map(arg => getNumber2DArray(arg));
  if (arrays.length === 0) {
    throw FormulaError.VALUE;
  }

  for (const array of arrays) {
    if (array1[0].length !== array[0].length || array1.length !== array.length)
      throw FormulaError.VALUE;
    for (let i = 0; i < array1.length; i++) {
      for (let j = 0; j < array1[0].length; j++) {
        if (typeof array1[i][j] !== 'number') {
          array1[i][j] = 0;
        }
        if (typeof array[i][j] !== 'number') {
          array[i][j] = 0;
        }
        array1[i][j]! *= array[i][j]!;
      }
    }
  }
  let result = 0;

  array1.forEach(row => {
    row.forEach(value => {
      result += value || 0;
    });
  });

  return result;
});

regFunc('SUMSQ', (...args: EvalResult[]) => {
  const numbers = getNumbers(args);
  return numbers.reduce((prev, cur) => prev + cur ** 2, 0);
});

regFunc('SUMX2MY2', (arrayX: EvalResult, arrayY: EvalResult) => {
  const x = getNumbers([arrayX]);
  const y = getNumbers([arrayY]);
  if (x.length !== y.length) {
    throw FormulaError.VALUE;
  }
  return x.reduce((prev, cur, i) => prev + cur ** 2 - y[i] ** 2, 0);
});

regFunc('SUMX2PY2', (arrayX: EvalResult, arrayY: EvalResult) => {
  const x = getNumbers([arrayX]);
  const y = getNumbers([arrayY]);
  if (x.length !== y.length) {
    throw FormulaError.VALUE;
  }
  return x.reduce((prev, cur, i) => prev + cur ** 2 + y[i] ** 2, 0);
});

regFunc('SUMXMY2', (arrayX: EvalResult, arrayY: EvalResult) => {
  const x = getNumbers([arrayX]);
  const y = getNumbers([arrayY]);
  if (x.length !== y.length) {
    throw FormulaError.VALUE;
  }
  return x.reduce((prev, cur, i) => prev + (cur - y[i]) ** 2, 0);
});

regFunc('TRUNC', (arg: EvalResult) => {
  const num = getNumberOrThrow(arg);
  return num >= 0 ? Math.floor(num) : Math.ceil(num);
});
