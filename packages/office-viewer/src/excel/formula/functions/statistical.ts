/**
 * 统计相关的函数，主要参考 fast-formula-parser 里的实现
 * https://github.com/LesterLyu/fast-formula-parser
 */

import FormulaError from '../FormulaError';
import {EvalResult} from '../eval/EvalResult';
import {regFunc} from './functions';
import {getNumberOrThrow} from './util/getNumber';
import {getNumbers} from './util/getNumbers';
import {getFirstNumbers} from './util/getFirstNumbers';
import {loopArgs} from './util/loopArgs';
import {parseCriteria} from '../parser/parseCriteria';
import {evalCriterial} from '../eval/evalCriterial';
import {jStat} from './util/jStat';
import {evalIFS} from './util/evalIFS';
import {evalIF} from './util/evalIF';
import {getBooleanWithDefault} from './util/getBoolean';
import {FLOOR} from './math';

regFunc('AVEDEV', (...arg: EvalResult[]) => {
  const numbers = getNumbers(arg);
  let sum = numbers.reduce((acc, cur) => acc + cur, 0);
  const avg = sum / numbers.length;
  sum = 0;
  for (let i = 0; i < numbers.length; i++) {
    sum += Math.abs(numbers[i] - avg);
  }
  return sum / numbers.length;
});

regFunc('AVERAGE', (...arg: EvalResult[]) => {
  const numbers = getFirstNumbers(arg, true);
  return numbers.reduce((acc, cur) => acc + cur, 0) / numbers.length;
});

regFunc('AVERAGEIF', (...arg: EvalResult[]) => {
  const numbers = evalIF(arg) as number[];
  return numbers.reduce((acc, cur) => acc + cur, 0) / numbers.length;
});

regFunc('AVERAGEIFS', (...arg: EvalResult[]) => {
  const numbers = evalIFS(arg) as number[];
  return numbers.reduce((acc, cur) => acc + cur, 0) / numbers.length;
});

regFunc('AVERAGEA', (...args: EvalResult[]) => {
  let sum = 0;
  let cnt = 0;
  // 目前是瞎试出来的，不确定是不是对的
  for (const arg of args) {
    if (Array.isArray(arg)) {
      // 如果是数组，只有数组里的数字才会参与计算
      for (const item of arg) {
        if (typeof item === 'number') {
          sum += item;
          cnt++;
        }
        if (typeof item === 'string') {
          cnt++;
        }
      }
    } else if (typeof arg === 'string') {
      sum += parseFloat(arg);
      cnt++;
    } else if (typeof arg === 'boolean') {
      sum += arg ? 1 : 0;
      cnt++;
    } else if (typeof arg === 'number') {
      sum += arg;
      cnt++;
    }
  }

  return sum / cnt;
});

regFunc('COUNT', (...args: EvalResult[]) => {
  let cnt = 0;
  loopArgs(args, arg => {
    if (typeof arg === 'number') {
      cnt++;
    }
    if (typeof arg === 'string') {
      arg = arg.replace(/%$/, '');
      const num = parseFloat(arg);
      if (!isNaN(num)) {
        cnt++;
      }
    }
  });
  return cnt;
});

regFunc('COUNTA', (...args: EvalResult[]) => {
  let cnt = 0;
  loopArgs(args, arg => {
    if (typeof arg !== undefined) {
      cnt++;
    }
  });
  return cnt;
});

regFunc('COUNTIF', (range: EvalResult, criteriaArg: EvalResult) => {
  let cnt = 0;
  const criteria = parseCriteria(criteriaArg as string | number);
  loopArgs([range], arg => {
    if (typeof arg === 'number' && evalCriterial(criteria, arg)) {
      cnt++;
    }
    if (typeof arg === 'string') {
      if (arg.endsWith('%')) {
        arg = arg.replace(/%$/, '');
        const num = parseFloat(arg);
        if (!isNaN(num) && evalCriterial(criteria, num)) {
          cnt++;
        }
      } else if (evalCriterial(criteria, arg)) {
        cnt++;
      }
    }
    if (typeof arg === 'boolean' && evalCriterial(criteria, arg)) {
      cnt++;
    }
  });
  return cnt;
});

regFunc('COUNTIFS', (...args: EvalResult[]) => {
  const range = evalIFS(args);
  return range.length;
});

regFunc('COUNTBLANK', (...args: EvalResult[]) => {
  let cnt = 0;
  loopArgs(args, arg => {
    if (arg === undefined || arg === null || arg === '') {
      cnt++;
    }
  });
  return cnt;
});

regFunc('LARGE', (...args: EvalResult[]) => {
  const numbers = getNumbers([args[0]]);
  const k = getNumberOrThrow(args[1]);
  if (k < 1) {
    throw FormulaError.VALUE;
  }
  if (k > numbers.length) {
    throw FormulaError.NUM;
  }
  numbers.sort((a, b) => b - a);
  return numbers[k - 1];
});

function LINEST(knownY: number[], knownX: number[]) {
  const meanY = jStat.mean(knownY);
  const meanX = jStat.mean(knownX);
  const n = knownX.length;
  let num = 0;
  let den = 0;

  for (let i = 0; i < n; i++) {
    num += (knownX[i] - meanX) * (knownY[i] - meanY);
    den += Math.pow(knownX[i] - meanX, 2);
  }

  const m = num / den;
  const b = meanY - m * meanX;

  return [m, b];
}

regFunc('LINEST', (...args: EvalResult[]) => {
  const knownY = getNumbers([args[0]]);
  const knownX = getNumbers([args[1]]);
  return LINEST(knownY, knownX);
});

regFunc('LOGEST', (...args: EvalResult[]) => {
  const knownY = getNumbers([args[0]]);
  const knownX = getNumbers([args[1]]);
  if (knownY.length !== knownX.length) {
    throw FormulaError.VALUE;
  }

  for (let i = 0; i < knownY.length; i++) {
    knownY[i] = Math.log(knownY[i]);
  }

  const result = LINEST(knownY, knownX);
  result[0] = Math.round(Math.exp(result[0]) * 1000000) / 1000000;
  result[1] = Math.round(Math.exp(result[1]) * 1000000) / 1000000;

  return result;
});

regFunc('TREND', (...arg: EvalResult[]) => {
  const knownY = getNumbers([arg[0]]);
  const knownX = getNumbers([arg[1]]);
  const newValues = getNumbers([arg[2]]);
  const linest = LINEST(knownY, knownX);
  const m = linest[0];
  const b = linest[1];
  const result = [];
  for (let i = 0; i < newValues.length; i++) {
    result.push(m * newValues[i] + b);
  }
  return result;
});

export function initial(array: number[], idx?: number) {
  idx = idx || 1;

  if (!array || typeof array.slice !== 'function') {
    return array;
  }

  return array.slice(0, array.length - idx);
}

export function rest(array: number[], idx?: number) {
  idx = idx || 1;

  if (!array || typeof array.slice !== 'function') {
    return array;
  }

  return array.slice(idx);
}

regFunc('TRIMMEAN', (...args: EvalResult[]) => {
  const range = getNumbers([args[0]]);
  const percent = getNumberOrThrow(args[1]);
  if (percent < 0 || percent > 1) {
    throw FormulaError.NUM;
  }
  const trim = FLOOR(range.length * percent, 2) / 2;

  return jStat.mean(
    initial(
      rest(
        range.sort((a, b) => a - b),
        trim
      ),
      trim
    )
  );
});

regFunc('SMALL', (...args: EvalResult[]) => {
  const numbers = getNumbers([args[0]]);
  const k = getNumberOrThrow(args[1]);
  if (k < 1) {
    throw FormulaError.VALUE;
  }
  if (k > numbers.length) {
    throw FormulaError.NUM;
  }
  numbers.sort((a, b) => a - b);
  return numbers[k - 1];
});

regFunc('MAX', (...args: EvalResult[]) => {
  const numbers = getNumbers(args);
  if (numbers.length === 0) {
    return 0;
  }
  return Math.max(...numbers);
});

regFunc('MAXIFS', (...args: EvalResult[]) => {
  const numbers = evalIFS(args) as number[];
  if (numbers.length === 0) {
    return 0;
  }
  return Math.max(...numbers);
});

regFunc('MAXA', (...args: EvalResult[]) => {
  const numbers = getNumbers(args, undefined, true);
  if (numbers.length === 0) {
    return 0;
  }
  return Math.max(...numbers);
});

regFunc('MEDIAN', (...args: EvalResult[]) => {
  const numbers = getNumbers(args);
  if (numbers.length === 0) {
    return 0;
  }
  numbers.sort((a, b) => a - b);
  const mid = Math.floor(numbers.length / 2);
  if (numbers.length % 2 === 0) {
    return (numbers[mid - 1] + numbers[mid]) / 2;
  } else {
    return numbers[mid];
  }
});

regFunc('MIN', (...args: EvalResult[]) => {
  const numbers = getNumbers(args);
  if (numbers.length === 0) {
    return 0;
  }
  return Math.min(...numbers);
});

regFunc('MINIFS', (...args: EvalResult[]) => {
  const numbers = evalIFS(args) as number[];
  if (numbers.length === 0) {
    return 0;
  }
  return Math.min(...numbers);
});

regFunc('MINA', (...args: EvalResult[]) => {
  const numbers = getNumbers(args, undefined, true);
  if (numbers.length === 0) {
    return 0;
  }
  return Math.min(...numbers);
});

function MODE_MULT(range: number[]) {
  const n = range.length;
  const count: Record<number, number> = {};
  let maxItems = [];
  let max = 0;
  let currentItem;

  for (let i = 0; i < n; i++) {
    currentItem = range[i];
    count[currentItem] = count[currentItem] ? count[currentItem] + 1 : 1;

    if (count[currentItem] > max) {
      max = count[currentItem];
      maxItems = [];
    }

    if (count[currentItem] === max) {
      maxItems[maxItems.length] = currentItem;
    }
  }

  return maxItems;
}

regFunc('MODE.MULT', (...args: EvalResult[]) => {
  const range = getNumbers(args);
  return MODE_MULT(range);
});

regFunc('MODE.SNGL', (...args: EvalResult[]) => {
  const range = getNumbers(args);
  if (range instanceof Error) {
    return range;
  }

  return MODE_MULT(range).sort((a, b) => a - b)[0];
});

export function PEARSON(array1: number[], array2: number[]) {
  const meanX = jStat.mean(array2);
  const meanY = jStat.mean(array1);
  const n = array2.length;
  let num = 0;
  let den1 = 0;
  let den2 = 0;

  for (let i = 0; i < n; i++) {
    num += (array2[i] - meanX) * (array1[i] - meanY);
    den1 += Math.pow(array2[i] - meanX, 2);
    den2 += Math.pow(array1[i] - meanY, 2);
  }

  return num / Math.sqrt(den1 * den2);
}

regFunc('PEARSON', (...args: EvalResult[]) => {
  const array1 = getNumbers([args[0]]);
  const array2 = getNumbers([args[1]]);
  return PEARSON(array1, array2);
});

regFunc('PERMUTATIONA', (...args: EvalResult[]) => {
  const number = getNumberOrThrow(args[0]);
  const number_chosen = getNumberOrThrow(args[1]);
  return Math.pow(number, number_chosen);
});

regFunc('PERMUT', (...args: EvalResult[]) => {
  const n = getNumberOrThrow(args[0]);
  const k = getNumberOrThrow(args[1]);
  if (n < 0 || k < 0) {
    throw FormulaError.NUM;
  }
  if (n < k) {
    throw FormulaError.NUM;
  }
  return jStat.factorial(n) / jStat.factorial(n - k);
});

regFunc('RSQ', (...args: EvalResult[]) => {
  const knownY = getNumbers([args[0]]);
  const knownX = getNumbers([args[1]]);
  return Math.pow(PEARSON(knownY, knownX), 2);
});

regFunc('SLOPE', (...args: EvalResult[]) => {
  const knownY = getNumbers([args[0]]);
  const knownX = getNumbers([args[1]]);
  const meanX = jStat.mean(knownX);
  const meanY = jStat.mean(knownY);
  const n = knownX.length;
  let num = 0;
  let den = 0;

  for (let i = 0; i < n; i++) {
    num += (knownX[i] - meanX) * (knownY[i] - meanY);
    den += Math.pow(knownX[i] - meanX, 2);
  }

  return num / den;
});

regFunc('SKEW', (...args: EvalResult[]) => {
  const range = getNumbers(args);
  const mean = jStat.mean(range);
  const n = range.length;
  let sigma = 0;

  for (let i = 0; i < n; i++) {
    sigma += Math.pow(range[i] - mean, 3);
  }

  return (
    (n * sigma) / ((n - 1) * (n - 2) * Math.pow(jStat.stdev(range, true), 3))
  );
});

regFunc('SKEW.P', (...args: EvalResult[]) => {
  const range = getNumbers(args);
  const mean = jStat.mean(range);
  const n = range.length;
  let m2 = 0;
  let m3 = 0;

  for (let i = 0; i < n; i++) {
    m3 += Math.pow(range[i] - mean, 3);
    m2 += Math.pow(range[i] - mean, 2);
  }

  m3 = m3 / n;
  m2 = m2 / n;

  return m3 / Math.pow(m2, 3 / 2);
});

export function VARA(numbers: number[]) {
  if (numbers.length === 0) {
    return 0;
  }
  return jStat.variance(numbers, true);
}

regFunc('VARA', (...args: EvalResult[]) => {
  const numbers = getNumbers(args, undefined, true);
  return VARA(numbers);
});

regFunc('VARPA', (...args: EvalResult[]) => {
  const numbers = getNumbers(args, undefined, true);
  if (numbers.length === 0) {
    return 0;
  }
  return jStat.variance(numbers, false);
});
