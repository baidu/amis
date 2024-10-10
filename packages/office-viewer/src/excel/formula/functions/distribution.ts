/**
 * 统计分布相关的函数，主要参考 fast-formula-parser 里的实现
 * https://github.com/LesterLyu/fast-formula-parser
 */

import FormulaError from '../FormulaError';
import {EvalResult} from '../eval/EvalResult';
import {regFunc} from './functions';
import {
  getNumber,
  getNumberOrThrow,
  getNumberWithDefault
} from './util/getNumber';
import {getBoolean} from './util/getBoolean';
import {getNumbers} from './util/getNumbers';
import {jStat} from './util/jStat';
import {MathFunctions} from './util/MathFunctions';
import {get2DArrayOrThrow} from './util/get2DArrayOrThrow';
import {UNIQUE} from './reference';

regFunc('BETA.DIST', (...arg: EvalResult[]) => {
  let x = getNumberOrThrow(arg[0]);
  const alpha = getNumberOrThrow(arg[1]);
  const beta = getNumberOrThrow(arg[2]);
  const cumulative = getBoolean(arg[3], true);
  let a = getNumber(arg[4], 0)!;
  let b = getNumber(arg[5], 1)!;
  if (alpha <= 0 || beta <= 0 || x < a || x > b || a === b) {
    throw FormulaError.NUM;
  }
  x = (x - a) / (b - a);
  return cumulative
    ? jStat.beta.cdf(x, alpha, beta)
    : jStat.beta.pdf(x, alpha, beta) / (b - a);
});

regFunc('BETA.INV', (...arg: EvalResult[]) => {
  const probability = getNumberOrThrow(arg[0]);
  const alpha = getNumberOrThrow(arg[1]);
  const beta = getNumberOrThrow(arg[2]);
  const a = getNumber(arg[3], 0)!;
  const b = getNumber(arg[4], 1)!;
  if (probability < 0 || probability > 1 || alpha <= 0 || beta <= 0 || a >= b) {
    throw FormulaError.NUM;
  }
  return jStat.beta.inv(probability, alpha, beta) * (b - a) + a;
});

regFunc('BINOM.DIST', (...arg: EvalResult[]) => {
  const x = getNumberOrThrow(arg[0]);
  const n = getNumberOrThrow(arg[1]);
  const p = getNumberOrThrow(arg[2]);
  const cumulative = getBoolean(arg[3], true);
  if (x < 0 || n < 0 || p < 0 || p > 1) {
    throw FormulaError.NUM;
  }
  return cumulative ? jStat.binomial.cdf(x, n, p) : jStat.binomial.pdf(x, n, p);
});

regFunc('BINOM.DIST.RANGE', (...arg: EvalResult[]) => {
  const trials = getNumberOrThrow(arg[0]);
  const probabilityS = getNumberOrThrow(arg[1]);
  const numberS = getNumberOrThrow(arg[2]);
  const numberS2 = getNumberWithDefault(arg[3], numberS);
  if (
    trials < 0 ||
    probabilityS < 0 ||
    probabilityS > 1 ||
    numberS < 0 ||
    numberS > trials ||
    numberS2 < numberS ||
    numberS2 > trials
  )
    throw FormulaError.NUM;

  let result = 0;
  for (let i = numberS; i <= numberS2; i++) {
    result +=
      MathFunctions.COMBIN(trials, i) *
      Math.pow(probabilityS, i) *
      Math.pow(1 - probabilityS, trials - i);
  }
  return result;
});

regFunc('BINOM.INV', (...arg: EvalResult[]) => {
  const trials = getNumberOrThrow(arg[0]);
  const probabilityS = getNumberOrThrow(arg[1]);
  const alpha = getNumberOrThrow(arg[2]);
  if (
    trials < 0 ||
    probabilityS < 0 ||
    probabilityS > 1 ||
    alpha < 0 ||
    alpha > 1
  )
    throw FormulaError.NUM;

  let x = 0;
  while (x <= trials) {
    if (jStat.binomial.cdf(x, trials, probabilityS) >= alpha) {
      return x;
    }
    x++;
  }

  throw FormulaError.NUM;
});

regFunc('CHISQ.DIST', (...arg: EvalResult[]) => {
  const x = getNumberOrThrow(arg[0]);
  const df = getNumberOrThrow(arg[1]);
  const cumulative = getBoolean(arg[2], true);
  if (x < 0 || df < 1) {
    throw FormulaError.NUM;
  }
  return cumulative ? jStat.chisquare.cdf(x, df) : jStat.chisquare.pdf(x, df);
});

regFunc('CHISQ.DIST.RT', (...arg: EvalResult[]) => {
  const x = getNumberOrThrow(arg[0]);
  const degFreedom = Math.trunc(getNumberOrThrow(arg[1]));
  if (x < 0 || degFreedom < 1 || degFreedom > 10 ** 10) {
    throw FormulaError.NUM;
  }
  return 1 - jStat.chisquare.cdf(x, degFreedom);
});

regFunc('CHISQ.INV', (...arg: EvalResult[]) => {
  const probability = getNumberOrThrow(arg[0]);
  const degFreedom = Math.trunc(getNumberOrThrow(arg[1]));
  if (
    probability < 0 ||
    probability > 1 ||
    degFreedom < 1 ||
    degFreedom > 10 ** 10
  ) {
    throw FormulaError.NUM;
  }

  return jStat.chisquare.inv(probability, degFreedom);
});

regFunc('CHISQ.INV.RT', (...arg: EvalResult[]) => {
  const probability = getNumberOrThrow(arg[0]);
  const degFreedom = Math.trunc(getNumberOrThrow(arg[1]));
  if (
    probability < 0 ||
    probability > 1 ||
    degFreedom < 1 ||
    degFreedom > 10 ** 10
  ) {
    throw FormulaError.NUM;
  }

  return jStat.chisquare.inv(1 - probability, degFreedom);
});

regFunc('CHISQ.TEST', (...arg: EvalResult[]) => {
  const actual = get2DArrayOrThrow(arg[0]);
  const expected = get2DArrayOrThrow(arg[1]);

  if (
    actual.length !== expected.length ||
    actual[0].length !== expected[0].length ||
    (actual.length === 1 && actual[0].length === 1)
  )
    throw FormulaError.NA;

  const row = actual.length;
  const col = actual[0].length;
  let dof = (row - 1) * (col - 1);
  if (row === 1) dof = col - 1;
  else dof = row - 1;
  let xsqr = 0;

  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      if (
        typeof actual[i][j] !== 'number' ||
        typeof expected[i][j] !== 'number'
      )
        continue;
      if (expected[i][j] === 0) {
        throw FormulaError.DIV0;
      }
      xsqr +=
        Math.pow((actual[i][j] as number) - (expected[i][j] as number), 2) /
        (expected[i][j] as number);
    }
  }

  // Get independent by X square and its degree of freedom
  let p = Math.exp(-0.5 * xsqr);
  if (dof % 2 === 1) {
    p = p * Math.sqrt((2 * xsqr) / Math.PI);
  }
  let k = dof;
  while (k >= 2) {
    p = (p * xsqr) / k;
    k = k - 2;
  }
  let t = p,
    a = dof;
  while (t > 0.000000000000001 * p) {
    a = a + 2;
    t = (t * xsqr) / a;
    p = p + t;
  }
  return 1 - p;
});

regFunc('CONFIDENCE.NORM', (...arg: EvalResult[]) => {
  const alpha = getNumberOrThrow(arg[0]);
  const std = getNumberOrThrow(arg[1]);
  const size = Math.trunc(getNumberOrThrow(arg[2]));
  if (alpha <= 0 || alpha >= 1 || std <= 0 || size <= 0) {
    throw FormulaError.NUM;
  }
  return jStat.normalci(1, alpha, std, size)[1] - 1;
});

regFunc('CONFIDENCE.T', (...arg: EvalResult[]) => {
  const alpha = getNumberOrThrow(arg[0]);
  const std = getNumberOrThrow(arg[1]);
  const size = Math.trunc(getNumberOrThrow(arg[2]));
  if (alpha <= 0 || alpha >= 1 || std <= 0 || size <= 0) {
    throw FormulaError.NUM;
  }
  return jStat.tci(1, alpha, std, size)[1] - 1;
});

regFunc('CORREL', (...arg: EvalResult[]) => {
  const data1 = getNumbers([arg[0]]);
  const data2 = getNumbers([arg[1]]);
  if (data1.length !== data2.length) {
    throw FormulaError.NA;
  }
  if (data2.length <= 1) {
    throw FormulaError.DIV0;
  }

  return jStat.corrcoeff(data1, data2);
});

regFunc('COVARIANCE.P', (...arg: EvalResult[]) => {
  const data1 = getNumbers([arg[0]]);
  const data2 = getNumbers([arg[1]]);
  if (data1.length !== data2.length) {
    throw FormulaError.NA;
  }
  if (data2.length <= 1) {
    throw FormulaError.DIV0;
  }

  const mean1 = jStat.mean(data1),
    mean2 = jStat.mean(data2);
  let result = 0;
  for (let i = 0; i < data1.length; i++) {
    result += (data1[i] - mean1) * (data2[i] - mean2);
  }
  return result / data1.length;
});

regFunc('COVARIANCE.S', (...arg: EvalResult[]) => {
  const data1 = getNumbers([arg[0]]);
  const data2 = getNumbers([arg[1]]);
  if (data1.length !== data2.length) {
    throw FormulaError.NA;
  }
  if (data2.length <= 1) {
    throw FormulaError.DIV0;
  }

  return jStat.covariance(data1, data2);
});

regFunc('DEVSQ', (...arg: EvalResult[]) => {
  const data = getNumbers(arg);
  const mean = jStat.mean(data);
  let result = 0;
  for (let i = 0; i < data.length; i++) {
    result += Math.pow(data[i] - mean, 2);
  }
  return result;
});

regFunc('EXPON.DIST', (...arg: EvalResult[]) => {
  const x = getNumberOrThrow(arg[0]);
  const lambda = getNumberOrThrow(arg[1]);
  const cumulative = getBoolean(arg[2], true);
  if (x < 0 || lambda <= 0) {
    throw FormulaError.NUM;
  }
  return cumulative
    ? jStat.exponential.cdf(x, lambda)
    : jStat.exponential.pdf(x, lambda);
});

regFunc('F.DIST', (...arg: EvalResult[]) => {
  const x = getNumberOrThrow(arg[0]);
  let d1 = getNumberOrThrow(arg[1]);
  let d2 = getNumberOrThrow(arg[2]);
  const cumulative = getBoolean(arg[3], true);
  // If x is negative, F.DIST returns the #NUM! error value.
  // If deg_freedom1 < 1, F.DIST returns the #NUM! error value.
  // If deg_freedom2 < 1, F.DIST returns the #NUM! error value.
  if (x < 0 || d1 < 1 || d2 < 1) {
    throw FormulaError.NUM;
  }

  // If deg_freedom1 or deg_freedom2 is not an integer, it is truncated.
  d1 = Math.trunc(d1);
  d2 = Math.trunc(d2);

  return cumulative
    ? jStat.centralF.cdf(x, d1, d2)
    : jStat.centralF.pdf(x, d1, d2);
});

regFunc('F.DIST.RT', (...arg: EvalResult[]) => {
  const x = getNumberOrThrow(arg[0]);
  let d1 = getNumberOrThrow(arg[1]);
  let d2 = getNumberOrThrow(arg[2]);
  // If deg_freedom2 < 1 F.DIST.RT returns the #NUM! error value.
  // If x is negative, F.DIST.RT returns the #NUM! error value.
  if (x < 0 || d1 < 1 || d2 < 1) {
    throw FormulaError.NUM;
  }

  // If deg_freedom1 or deg_freedom2 is not an integer, it is truncated.
  d1 = Math.trunc(d1);
  d2 = Math.trunc(d2);

  return 1 - jStat.centralF.cdf(x, d1, d2);
});

regFunc('F.INV', (...arg: EvalResult[]) => {
  const probability = getNumberOrThrow(arg[0]);
  let d1 = Math.trunc(getNumberOrThrow(arg[1]));
  let d2 = Math.trunc(getNumberOrThrow(arg[2]));
  // If probability < 0 or probability > 1, F.INV returns the #NUM! error value.
  if (probability < 0.0 || probability > 1.0) {
    throw FormulaError.NUM;
  }
  // If deg_freedom1 < 1, or deg_freedom2 < 1, F.INV returns the #NUM! error value.
  if (d1 < 1.0 || d2 < 1.0) {
    throw FormulaError.NUM;
  }

  // If deg_freedom1 or deg_freedom2 is not an integer, it is truncated.
  d1 = Math.trunc(d1);
  d2 = Math.trunc(d2);

  return jStat.centralF.inv(probability, d1, d2);
});

regFunc('F.INV.RT', (...arg: EvalResult[]) => {
  const probability = getNumberOrThrow(arg[0]);
  let d1 = Math.trunc(getNumberOrThrow(arg[1]));
  let d2 = Math.trunc(getNumberOrThrow(arg[2]));
  // If Probability is < 0 or probability is > 1, F.INV.RT returns the #NUM! error value.
  if (probability < 0.0 || probability > 1.0) {
    throw FormulaError.NUM;
  }

  // If Deg_freedom1 is < 1, or Deg_freedom2 is < 1, F.INV.RT returns the #NUM! error value.
  if (d1 < 1.0 || d1 >= Math.pow(10, 10)) {
    throw FormulaError.NUM;
  }

  // If Deg_freedom2 is < 1 or Deg_freedom2 is ≥ 10^10, F.INV.RT returns the #NUM! error value.
  if (d2 < 1.0 || d2 >= Math.pow(10, 10)) {
    throw FormulaError.NUM;
  }
  // If Deg_freedom1 or Deg_freedom2 is not an integer, it is truncated.
  d1 = Math.trunc(d1);
  d2 = Math.trunc(d2);

  return jStat.centralF.inv(1.0 - probability, d1, d2);
});

regFunc('F.TEST', (...arg: EvalResult[]) => {
  const array1 = getNumbers([arg[0]]);
  const array2 = getNumbers([arg[1]]);

  // filter out values that are not number
  const x1 = [],
    x2 = [];
  let x1Mean = 0,
    x2Mean = 0;
  for (let i = 0; i < Math.max(array1.length, array2.length); i++) {
    if (typeof array1[i] === 'number') {
      x1.push(array1[i]);
      x1Mean += array1[i];
    }
    if (typeof array2[i] === 'number') {
      x2.push(array2[i]);
      x2Mean += array2[i];
    }
  }
  if (x1.length <= 1 || x2.length <= 1) throw FormulaError.DIV0;

  x1Mean /= x1.length;
  x2Mean /= x2.length;
  let s1 = 0,
    s2 = 0; // sample variance S^2
  for (let i = 0; i < x1.length; i++) {
    s1 += (x1Mean - x1[i]) ** 2;
  }
  s1 /= x1.length - 1;
  for (let i = 0; i < x2.length; i++) {
    s2 += (x2Mean - x2[i]) ** 2;
  }
  s2 /= x2.length - 1;
  // P(F<=f) one-tail * 2
  return jStat.centralF.cdf(s1 / s2, x1.length - 1, x2.length - 1) * 2;
});

regFunc('FISHER', (...arg: EvalResult[]) => {
  const x = getNumberOrThrow(arg[0]);
  if (x <= -1 || x >= 1) {
    throw FormulaError.NUM;
  }
  return 0.5 * Math.log((1 + x) / (1 - x));
});

regFunc('FISHERINV', (...arg: EvalResult[]) => {
  const x = getNumberOrThrow(arg[0]);
  return (Math.exp(2 * x) - 1) / (Math.exp(2 * x) + 1);
});

regFunc('FORECAST', (...arg: EvalResult[]) => {
  const x = getNumberOrThrow(arg[0]);
  const knownYs = getNumbers([arg[1]]);
  const knownXs = getNumbers([arg[2]]);
  if (knownXs.length !== knownYs.length) {
    throw FormulaError.NA;
  }

  // filter out values that are not number
  const filteredY = [],
    filteredX = [];
  let xAllEqual = true;
  for (let i = 0; i < knownYs.length; i++) {
    if (typeof knownYs[i] !== 'number' || typeof knownXs[i] !== 'number') {
      continue;
    }
    filteredY.push(knownYs[i]);
    filteredX.push(knownXs[i]);
    if (knownXs[i] !== knownXs[0]) {
      xAllEqual = false;
    }
  }
  if (xAllEqual) {
    throw FormulaError.DIV0;
  }
  const yMean = jStat.mean(filteredY);
  const xMean = jStat.mean(filteredX);
  let numerator = 0,
    denominator = 0;
  for (let i = 0; i < filteredY.length; i++) {
    numerator += (filteredX[i] - xMean) * (filteredY[i] - yMean);
    denominator += (filteredX[i] - xMean) ** 2;
  }
  const b = numerator / denominator;
  const a = yMean - b * xMean;
  return a + b * x;
});

regFunc('FREQUENCY', (...arg: EvalResult[]) => {
  const dataArray = getNumbers([arg[0]]);
  const binsArray = getNumbers([arg[1]]);
  const binsArrayFiltered = [];
  for (let i = 0; i < binsArray.length; i++) {
    if (typeof binsArray[i] !== 'number') continue;
    binsArrayFiltered.push(binsArray[i]);
  }
  binsArrayFiltered.sort();
  binsArrayFiltered.push(Infinity);

  const result: number[][] = [];
  for (let j = 0; j < binsArrayFiltered.length; j++) {
    result[j] = [];
    result[j][0] = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const curr = dataArray[i];
      if (curr <= binsArrayFiltered[j]) {
        result[j][0]++;
      }
    }
  }
  // return a 2d array
  return result;
});

regFunc('GAMMA', (...arg: EvalResult[]) => {
  const x = getNumberOrThrow(arg[0]);
  if (x === 0 || (x < 0 && x === Math.trunc(x))) {
    throw FormulaError.NUM;
  }
  return jStat.gammafn(x);
});

regFunc('GAMMA.DIST', (...arg: EvalResult[]) => {
  const x = getNumberOrThrow(arg[0]);
  const alpha = getNumberOrThrow(arg[1]);
  const beta = getNumberOrThrow(arg[2]);
  const cumulative = getBoolean(arg[3], true);
  // If x < 0, GAMMA.DIST returns the #NUM! error value.
  // If alpha ≤ 0 or if beta ≤ 0, GAMMA.DIST returns the #NUM! error value.
  if (x < 0 || alpha <= 0 || beta <= 0) {
    throw FormulaError.NUM;
  }

  return cumulative
    ? jStat.gamma.cdf(x, alpha, beta)
    : jStat.gamma.pdf(x, alpha, beta);
});

regFunc('GAMMA.INV', (...arg: EvalResult[]) => {
  const probability = getNumberOrThrow(arg[0]);
  const alpha = getNumberOrThrow(arg[1]);
  const beta = getNumberOrThrow(arg[2]);
  // If probability < 0 or probability > 1, GAMMA.INV returns the #NUM! error value.
  // If alpha ≤ 0 or if beta ≤ 0, GAMMA.INV returns the #NUM! error value.
  if (probability < 0 || probability > 1 || alpha <= 0 || beta <= 0) {
    throw FormulaError.NUM;
  }

  return jStat.gamma.inv(probability, alpha, beta);
});

regFunc('GAMMALN', (...arg: EvalResult[]) => {
  const x = getNumberOrThrow(arg[0]);
  // If x is nonnumeric, GAMMALN returns the #VALUE! error value.
  // If x ≤ 0, GAMMALN returns the #NUM! error value.
  if (x <= 0) {
    throw FormulaError.NUM;
  }

  return jStat.gammaln(x);
});

regFunc('GAMMALN.PRECISE', (...arg: EvalResult[]) => {
  const x = getNumberOrThrow(arg[0]);
  // If x is nonnumeric, GAMMALN.PRECISE returns the #VALUE! error value.
  // If x ≤ 0, GAMMALN.PRECISE returns the #NUM! error value.
  if (x <= 0) {
    throw FormulaError.NUM;
  }

  return jStat.gammaln(x);
});

regFunc('GAUSS', (...arg: EvalResult[]) => {
  const z = getNumberOrThrow(arg[0]);
  return jStat.normal.cdf(z, 0, 1) - 0.5;
});

regFunc('GEOMEAN', (...arg: EvalResult[]) => {
  const data = getNumbers(arg);
  if (data.length === 0) {
    throw FormulaError.DIV0;
  }
  let result = 1;
  for (let i = 0; i < data.length; i++) {
    result *= data[i];
  }
  return Math.pow(result, 1 / data.length);
});

regFunc('GROWTH', (...arg: EvalResult[]) => {
  let knownY = getNumbers([arg[0]]);
  let knownX = getNumbers([arg[1]]);
  let isKnownXOmitted = knownX.length === 0;
  if (knownX.length === 0) {
    knownX = [];
    for (let i = 1; i <= knownY.length; i++) {
      knownX.push(i);
    }
  } else {
    if (knownX.length !== knownY.length) {
      throw FormulaError.REF;
    }
  }

  const X = getNumbers([arg[2]]);
  let newX: number[][];
  if (X.length === 0 && isKnownXOmitted) {
    const newValue = [];
    for (let i = 1; i <= knownY.length; i++) {
      newValue.push(i);
    }
    newX = [newValue];
  } else if (X.length === 0) {
    // @ts-ignore 没看懂先按这个写法
    newX = Array.isArray(knownX[0]) ? knownX : [knownX];
  } else {
    // @ts-ignore 没看懂先按这个写法
    newX = Array.isArray(X[0]) ? X : [X];
  }
  const useConst = getBoolean(arg[3], true);

  // Calculate sums over the data:
  const n = knownY.length;
  let avg_x = 0,
    avg_y = 0,
    avg_xy = 0,
    avg_xx = 0;
  for (let i = 0; i < n; i++) {
    const x = knownX[i];
    const y = Math.log(knownY[i]);
    avg_x += x;
    avg_y += y;
    avg_xy += x * y;
    avg_xx += x * x;
  }
  avg_x /= n;
  avg_y /= n;
  avg_xy /= n;
  avg_xx /= n;

  // Compute linear regression coefficients:
  let beta;
  let alpha;
  if (useConst) {
    beta = (avg_xy - avg_x * avg_y) / (avg_xx - avg_x * avg_x);
    alpha = avg_y - beta * avg_x;
  } else {
    beta = avg_xy / avg_xx;
    alpha = 0;
  }

  // Compute and return result array:
  const new_y = [];
  for (let i = 0; i < newX.length; i++) {
    new_y[i] = [];
    for (let j = 0; j < newX[0].length; j++) {
      // @ts-ignore 没看懂先按这个写法
      new_y[i][j] = Math.exp(alpha + beta * newX[i][j]);
    }
  }
  return new_y;
});

regFunc('HARMEAN', (...arg: EvalResult[]) => {
  const data = getNumbers(arg);
  if (data.length === 0) {
    throw FormulaError.DIV0;
  }
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i] === 0) {
      throw FormulaError.DIV0;
    }
    sum += 1 / data[i];
  }
  return data.length / sum;
});

regFunc('HYPGEOM.DIST', (...arg: EvalResult[]) => {
  const sample_s = Math.trunc(getNumberOrThrow(arg[0]));
  const number_sample = Math.trunc(getNumberOrThrow(arg[1]));
  const population_s = Math.trunc(getNumberOrThrow(arg[2]));
  const number_pop = Math.trunc(getNumberOrThrow(arg[3]));
  const cumulative = getBoolean(arg[4], true);
  // // If number_pop ≤ 0, HYPGEOM.DIST returns the #NUM! error value.
  if (
    number_pop <= 0 ||
    sample_s < 0 ||
    number_sample <= 0 ||
    population_s <= 0
  ) {
    throw FormulaError.NUM;
  }

  // // If number_sample ≤ 0 or number_sample > number_population, HYPGEOM.DIST returns the #NUM! error value.
  if (number_sample > number_pop) {
    throw FormulaError.NUM;
  }
  // // If population_s ≤ 0 or population_s > number_population, HYPGEOM.DIST returns the #NUM! error value.
  if (population_s > number_pop) {
    throw FormulaError.NUM;
  }

  // If sample_s < 0 or sample_s is greater than the lesser of number_sample or population_s, HYPGEOM.DIST returns the #NUM! error value.
  // Google and Mircrosoft has different version on this funtion
  if (number_sample < sample_s || population_s < sample_s) {
    throw FormulaError.NUM;
  }
  // If sample_s is less than the larger of 0 or (number_sample - number_population + population_s), HYPGEOM.DIST returns the #NUM! error value.
  if (sample_s < number_sample - number_pop + population_s) {
    throw FormulaError.NUM;
  }

  function pdf(x: number, n: number, M: number, N: number) {
    return (
      (MathFunctions.COMBIN(M, x) * MathFunctions.COMBIN(N - M, n - x)) /
      MathFunctions.COMBIN(N, n)
    );
  }

  function cdf(x: number, n: number, M: number, N: number) {
    let result = 0;
    for (let i = 0; i <= x; i++) {
      result += pdf(i, n, M, N);
    }
    return result;
  }

  return cumulative
    ? cdf(sample_s, number_sample, population_s, number_pop)
    : pdf(sample_s, number_sample, population_s, number_pop);
});

regFunc('INTERCEPT', (...arg: EvalResult[]) => {
  const knownY = getNumbers([arg[0]]);
  const knownX = getNumbers([arg[1]]);
  if (knownX.length !== knownY.length) {
    throw FormulaError.NA;
  }

  // filter out values that are not number
  const filteredY = [],
    filteredX = [];
  let xAllEqual = true;
  for (let i = 0; i < knownY.length; i++) {
    if (typeof knownY[i] !== 'number' || typeof knownX[i] !== 'number') {
      continue;
    }
    filteredY.push(knownY[i]);
    filteredX.push(knownX[i]);
    if (knownX[i] !== knownX[0]) {
      xAllEqual = false;
    }
  }
  if (xAllEqual) {
    throw FormulaError.DIV0;
  }
  const yMean = jStat.mean(filteredY);
  const xMean = jStat.mean(filteredX);
  let numerator = 0,
    denominator = 0;
  for (let i = 0; i < filteredY.length; i++) {
    numerator += (filteredX[i] - xMean) * (filteredY[i] - yMean);
    denominator += (filteredX[i] - xMean) ** 2;
  }
  return yMean - (numerator / denominator) * xMean;
});

regFunc('KURT', (...arg: EvalResult[]) => {
  const range = getNumbers(arg);
  if (range.length <= 3) {
    throw FormulaError.DIV0;
  }
  let sum = range.reduce((acc, val) => acc + val, 0);
  const n = range.length;
  const mean = sum / n;
  let sigma = 0;
  for (let i = 0; i < n; i++) {
    sigma += Math.pow(range[i] - mean, 4);
  }
  sigma = sigma / Math.pow(jStat.stdev(range, true), 4);
  return (
    ((n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3))) * sigma -
    (3 * (n - 1) * (n - 1)) / ((n - 2) * (n - 3))
  );
});

regFunc('LOGNORM.DIST', (...arg: EvalResult[]) => {
  const x = getNumberOrThrow(arg[0]);
  const mean = getNumberOrThrow(arg[1]);
  const sd = getNumberOrThrow(arg[2]);
  const cumulative = getBoolean(arg[3], true);
  if (x <= 0 || sd <= 0) {
    throw FormulaError.NUM;
  }
  return cumulative
    ? jStat.lognormal.cdf(x, mean, sd)
    : jStat.lognormal.pdf(x, mean, sd);
});

regFunc('LOGNORM.INV', (...arg: EvalResult[]) => {
  const probability = getNumberOrThrow(arg[0]);
  const mean = getNumberOrThrow(arg[1]);
  const sd = getNumberOrThrow(arg[2]);
  if (probability < 0 || probability > 1 || sd <= 0) {
    throw FormulaError.NUM;
  }
  return jStat.lognormal.inv(probability, mean, sd);
});

regFunc('NEGBINOM.DIST', (...arg: EvalResult[]) => {
  const x = Math.trunc(getNumberOrThrow(arg[0]));
  const r = Math.trunc(getNumberOrThrow(arg[1]));
  const p = getNumberOrThrow(arg[2]);
  const cumulative = getBoolean(arg[3], true);
  if (x < 0 || r <= 0 || p <= 0 || p >= 1) {
    throw FormulaError.NUM;
  }
  return cumulative ? jStat.negbin.cdf(x, r, p) : jStat.negbin.pdf(x, r, p);
});

regFunc('NORM.DIST', (...arg: EvalResult[]) => {
  const x = getNumberOrThrow(arg[0]);
  const mean = getNumberOrThrow(arg[1]);
  const sd = getNumberOrThrow(arg[2]);
  const cumulative = getBoolean(arg[3], true);
  if (sd <= 0) {
    throw FormulaError.NUM;
  }
  return cumulative
    ? jStat.normal.cdf(x, mean, sd)
    : jStat.normal.pdf(x, mean, sd);
});

regFunc('NORM.INV', (...arg: EvalResult[]) => {
  const probability = getNumberOrThrow(arg[0]);
  const mean = getNumberOrThrow(arg[1]);
  const sd = getNumberOrThrow(arg[2]);

  // If probability <= 0 or if probability >= 1, NORM.INV returns the #NUM! error value.
  if (probability <= 0 || probability >= 1) {
    throw FormulaError.NUM;
  }
  // If standard_dev ≤ 0, NORM.INV returns the #NUM! error value.
  if (sd <= 0) {
    throw FormulaError.NUM;
  }
  // If mean = 0 and standard_dev = 1, NORM.INV uses the standard normal distribution (see NORMS.INV).
  // if(mean === 0 && standard_dev === 1){
  // }

  return jStat.normal.inv(probability, mean, sd);
});

function NORM_S_DIST(...arg: EvalResult[]) {
  const z = getNumberOrThrow(arg[0]);
  const cumulative = getBoolean(arg[1], true);
  return cumulative ? jStat.normal.cdf(z, 0, 1) : jStat.normal.pdf(z, 0, 1);
}

regFunc('NORM.S.DIST', NORM_S_DIST);

regFunc('NORM.S.INV', (...arg: EvalResult[]) => {
  const probability = getNumberOrThrow(arg[0]);
  // If probability <= 0 or probability >= 1, NORM.S.INV returns the #NUM! error value.
  if (probability <= 0 || probability >= 1) {
    throw FormulaError.NUM;
  }

  return jStat.normal.inv(probability, 0, 1);
});

const SQRT2PI = 2.5066282746310002;

regFunc('PHI', (...arg: EvalResult[]) => {
  const x = getNumberOrThrow(arg[0]);
  return Math.exp(-0.5 * x * x) / SQRT2PI;
});

regFunc('POISSON.DIST', (...arg: EvalResult[]) => {
  let x = getNumberOrThrow(arg[0]);
  const mean = getNumberOrThrow(arg[1]);
  const cumulative = getBoolean(arg[2], true);
  if (x < 0 || mean <= 0) {
    throw FormulaError.NUM;
  }
  x = Math.trunc(x);
  return cumulative ? jStat.poisson.cdf(x, mean) : jStat.poisson.pdf(x, mean);
});

regFunc('PROB', (...arg: EvalResult[]) => {
  const x_range = getNumbers([arg[0]]);
  const prob_range = getNumbers([arg[1]]);
  if (arg[2] === undefined) {
    return 0;
  }
  const lower_limit = getNumberOrThrow(arg[2]);
  const upper_limit = getNumberWithDefault(arg[3], lower_limit);

  if (lower_limit === upper_limit) {
    return x_range.indexOf(lower_limit) >= 0
      ? prob_range[x_range.indexOf(lower_limit)]
      : 0;
  }

  const sorted = x_range.sort((a, b) => a - b);
  const n = sorted.length;
  let result = 0;

  for (let i = 0; i < n; i++) {
    if (sorted[i] >= lower_limit && sorted[i] <= upper_limit) {
      result += prob_range[x_range.indexOf(sorted[i])];
    }
  }

  return result;
});

regFunc('QUARTILE', QUARTILE_INC);

regFunc('QUARTILE.EXC', (array: EvalResult[], quart: number) => {
  const data = getNumbers(array);
  quart = getNumberOrThrow(quart);
  switch (quart) {
    case 1:
      return PERCENTILE_EXC(data, 0.25);
    case 2:
      return PERCENTILE_EXC(data, 0.5);
    case 3:
      return PERCENTILE_EXC(data, 0.75);
    default:
      throw FormulaError.NUM;
  }
});

function QUARTILE_INC(array: EvalResult[], quart: number) {
  const data = getNumbers(array);
  quart = getNumberOrThrow(quart);
  switch (quart) {
    case 1:
      return PERCENTILE_INC(data, 0.25);
    case 2:
      return PERCENTILE_INC(data, 0.5);
    case 3:
      return PERCENTILE_INC(data, 0.75);
    default:
      throw FormulaError.NUM;
  }
}

regFunc('QUARTILE.INC', QUARTILE_INC);

function PERCENTILE_EXC(array: number[], k: number) {
  array = array.sort((a, b) => a - b);
  const n = array.length;

  if (k < 1 / (n + 1) || k > 1 - 1 / (n + 1)) {
    throw FormulaError.NUM;
  }

  const l = k * (n + 1) - 1;
  const fl = Math.floor(l);

  return l === fl
    ? array[l]
    : array[fl] + (l - fl) * (array[fl + 1] - array[fl]);
}

function PERCENTILE_INC(array: number[], k: number) {
  array = array.sort((a, b) => a - b);
  const n = array.length;
  const l = k * (n - 1);
  const fl = Math.floor(l);

  return l === fl
    ? array[l]
    : array[fl] + (l - fl) * (array[fl + 1] - array[fl]);
}

regFunc('PERCENTILE.INC', (array: EvalResult[], k: number) => {
  return PERCENTILE_INC(getNumbers(array), k);
});

regFunc('PERCENTILE.EXC', (array: EvalResult[], k: number) => {
  return PERCENTILE_EXC(getNumbers(array), k);
});

regFunc(
  'PERCENTRANK.EXC',
  (arr: EvalResult[], x: number, significance: number) => {
    let array = getNumbers(arr) as number[];
    x = getNumberOrThrow(x);
    significance = getNumberWithDefault(significance, 3);

    array = array.sort((a, b) => a - b);
    const uniques = UNIQUE.apply(null, array);
    const n = array.length;
    const m = uniques.length;
    const power = Math.pow(10, significance);
    let result = 0;
    let match = false;
    let i = 0;

    while (!match && i < m) {
      if (x === uniques[i]) {
        result = (array.indexOf(uniques[i]) + 1) / (n + 1);
        match = true;
      } else if (x >= uniques[i] && (x < uniques[i + 1] || i === m - 1)) {
        result =
          (array.indexOf(uniques[i]) +
            1 +
            (x - uniques[i]) / (uniques[i + 1] - uniques[i])) /
          (n + 1);
        match = true;
      }

      i++;
    }

    return Math.floor(result * power) / power;
  }
);

regFunc(
  'PERCENTRANK.INC',
  (arr: EvalResult[], x: number, significance: number) => {
    let array = getNumbers(arr) as number[];
    x = getNumberOrThrow(x);
    significance = getNumberWithDefault(significance, 3);

    array = array.sort((a, b) => a - b);
    const uniques = UNIQUE.apply(null, array);
    const n = array.length;
    const m = uniques.length;
    const power = Math.pow(10, significance);
    let result = 0;
    let match = false;
    let i = 0;

    while (!match && i < m) {
      if (x === uniques[i]) {
        result = array.indexOf(uniques[i]) / (n - 1);
        match = true;
      } else if (x >= uniques[i] && (x < uniques[i + 1] || i === m - 1)) {
        result =
          (array.indexOf(uniques[i]) +
            (x - uniques[i]) / (uniques[i + 1] - uniques[i])) /
          (n - 1);
        match = true;
      }

      i++;
    }

    return Math.floor(result * power) / power;
  }
);

regFunc('STANDARDIZE', (...arg: EvalResult[]) => {
  const x = getNumberOrThrow(arg[0]);
  const mean = getNumberOrThrow(arg[1]);
  const sd = getNumberOrThrow(arg[2]);
  if (sd <= 0) {
    throw FormulaError.NUM;
  }
  return (x - mean) / sd;
});

export const standardDeviation = (arr: number[], usePopulation = false) => {
  const mean = arr.reduce((acc, val) => acc + val, 0) / arr.length;
  return Math.sqrt(
    arr
      .reduce((acc: number[], val) => acc.concat((val - mean) ** 2), [])
      .reduce((acc, val) => acc + val, 0) /
      (arr.length - (usePopulation ? 0 : 1))
  );
};

regFunc('STDEV', (...arg: EvalResult[]) => {
  const data = getNumbers(arg);
  return standardDeviation(data);
});

regFunc('STDEV.S', (...arg: EvalResult[]) => {
  const data = getNumbers(arg);
  return standardDeviation(data);
});

regFunc('STDEV.P', (...arg: EvalResult[]) => {
  const data = getNumbers(arg);
  return standardDeviation(data, true);
});

regFunc('STDEVA', (...arg: EvalResult[]) => {
  const numbers = getNumbers(arg, undefined, true);
  if (numbers.length === 0) {
    return 0;
  }
  const v = jStat.variance(numbers, true);
  return Math.sqrt(v);
});

regFunc('STDEVPA', (...arg: EvalResult[]) => {
  const numbers = getNumbers(arg, undefined, true);
  if (numbers.length === 0) {
    return 0;
  }
  const v = jStat.variance(numbers, false);
  return Math.sqrt(v);
});

regFunc('STEYX', (...arg: EvalResult[]) => {
  const knownY = getNumbers([arg[0]]);
  const knownX = getNumbers([arg[1]]);

  const meanX = jStat.mean(knownX);
  const meanY = jStat.mean(knownY);
  const n = knownX.length;
  let lft = 0;
  let num = 0;
  let den = 0;

  for (let i = 0; i < n; i++) {
    lft += Math.pow(knownY[i] - meanY, 2);
    num += (knownX[i] - meanX) * (knownY[i] - meanY);
    den += Math.pow(knownX[i] - meanX, 2);
  }

  return Math.sqrt((lft - (num * num) / den) / (n - 2));
});

regFunc('T.DIST', (...arg: EvalResult[]) => {
  const x = getNumberOrThrow(arg[0]);
  const degFreedom = getNumberOrThrow(arg[1]);
  const cumulative = getBoolean(arg[2], true);
  if (degFreedom < 1) {
    throw FormulaError.NUM;
  }
  return cumulative
    ? jStat.studentt.cdf(x, degFreedom)
    : jStat.studentt.pdf(x, degFreedom);
});

regFunc('T.DIST.2T', (...arg: EvalResult[]) => {
  const x = getNumberOrThrow(arg[0]);
  const degFreedom = getNumberOrThrow(arg[1]);
  // If degFreedom < 1, T.DIST.2T returns the #NUM! error value.
  // If x < 0, then T.DIST.2T returns the #NUM! error value.
  if (degFreedom < 1 || x < 0) {
    throw FormulaError.NUM;
  }

  return (1 - jStat.studentt.cdf(x, degFreedom)) * 2;
});

regFunc('T.DIST.RT', (...arg: EvalResult[]) => {
  const x = getNumberOrThrow(arg[0]);
  const degFreedom = getNumberOrThrow(arg[1]);
  // If degFreedom < 1, T.DIST.RT returns the #NUM! error value.
  // If x < 0, then T.DIST.RT returns the #NUM! error value.
  if (degFreedom < 1) {
    throw FormulaError.NUM;
  }

  return 1 - jStat.studentt.cdf(x, degFreedom);
});

function T_INV_2T(probability: number, deg_freedom: number) {
  if (probability <= 0 || probability > 1 || deg_freedom < 1) {
    throw FormulaError.NUM;
  }

  return Math.abs(jStat.studentt.inv(probability / 2, deg_freedom));
}

// regFunc('T.TEST', (...arg: EvalResult[]) => {
//   const array1 = getNumbers([arg[0]]);
//   const array2 = getNumbers([arg[1]]);
//   const mean_x = jStat.mean(array1);
//   const mean_y = jStat.mean(array2);
//   let s_x = 0;
//   let s_y = 0;
//   let i;

//   for (i = 0; i < array1.length; i++) {
//     s_x += Math.pow(array1[i] - mean_x, 2);
//   }

//   for (i = 0; i < array2.length; i++) {
//     s_y += Math.pow(array2[i] - mean_y, 2);
//   }

//   s_x = s_x / (array1.length - 1);
//   s_y = s_y / (array2.length - 1);

//   const t =
//     Math.abs(mean_x - mean_y) /
//     Math.sqrt(s_x / array1.length + s_y / array2.length);

//   return T_INV_2T(t, array1.length + array2.length - 2);
// });

regFunc('T.INV', (...arg: EvalResult[]) => {
  const probability = getNumberOrThrow(arg[0]);
  let degFreedom = getNumberOrThrow(arg[1]);
  // If probability <= 0 or if probability > 1, T.INV returns the #NUM! error value.
  // If deg_freedom < 1, T.INV returns the #NUM! error value.
  if (probability <= 0 || probability > 1 || degFreedom < 1) {
    throw FormulaError.NUM;
  }

  // If degFreedom is not an integer, it is truncated.
  degFreedom = degFreedom % 1 === 0 ? degFreedom : Math.trunc(degFreedom);

  return jStat.studentt.inv(probability, degFreedom);
});

regFunc('T.INV.2T', (...arg: EvalResult[]) => {
  const probability = getNumberOrThrow(arg[0]);
  let degFreedom = getNumberOrThrow(arg[1]);
  // If probability <= 0 or if probability > 1, T.INV.2T returns the #NUM! error value.
  // If deg_freedom < 1, T.INV.2T returns the #NUM! error value.
  if (probability <= 0 || probability > 1 || degFreedom < 1) {
    throw FormulaError.NUM;
  }

  // If degFreedom is not an integer, it is truncated.
  degFreedom = degFreedom % 1 === 0 ? degFreedom : Math.trunc(degFreedom);

  return jStat.studentt.inv(1 - probability / 2, degFreedom);
});

regFunc('WEIBULL.DIST', (...arg: EvalResult[]) => {
  const x = getNumberOrThrow(arg[0]);
  const alpha = getNumberOrThrow(arg[1]);
  const beta = getNumberOrThrow(arg[2]);
  const cumulative = getBoolean(arg[3], true);
  if (x < 0 || alpha <= 0 || beta <= 0) {
    throw FormulaError.NUM;
  }
  return cumulative
    ? 1 - Math.exp(-Math.pow(x / beta, alpha))
    : (Math.pow(x, alpha - 1) * Math.exp(-Math.pow(x / beta, alpha)) * alpha) /
        Math.pow(beta, alpha);
});

export function VAR(...arg: EvalResult[]) {
  const data = getNumbers(arg);
  if (data.length <= 1) {
    throw FormulaError.DIV0;
  }
  const mean = jStat.mean(data);
  let result = 0;
  for (let i = 0; i < data.length; i++) {
    result += Math.pow(data[i] - mean, 2);
  }
  return result / (data.length - 1);
}

regFunc('VAR', VAR);

regFunc('VAR.S', VAR);

export function VARP(data: number[]) {
  if (data.length <= 1) {
    throw FormulaError.DIV0;
  }
  const n = data.length;
  const mean = jStat.mean(data);
  let sigma = 0;
  let result;

  for (let i = 0; i < n; i++) {
    sigma += Math.pow(data[i] - mean, 2);
  }

  result = sigma / n;

  if (isNaN(result)) {
    throw FormulaError.NUM;
  }
  return result;
}

regFunc('VAR.P', (...arg: EvalResult[]) => {
  const data = getNumbers(arg);
  if (data.length <= 1) {
    throw FormulaError.DIV0;
  }
  return VARP(data);
});

function AVERAGE(...args: EvalResult[]) {
  const range = getNumbers(args);

  if (range.length === 0) {
    throw FormulaError.DIV0;
  }

  const n = range.length;
  let sum = 0;
  let count = 0;
  let result;

  for (let i = 0; i < n; i++) {
    sum += range[i];
    count += 1;
  }

  result = sum / count;

  if (isNaN(result)) {
    throw FormulaError.NUM;
  }

  return result;
}

regFunc('Z.TEST', (...arg: EvalResult[]) => {
  const array = getNumbers([arg[0]]);
  const x = getNumberOrThrow(arg[1]);
  const sigma = getNumber(arg[3]) || standardDeviation(array);
  const n = array.length;

  return 1 - NORM_S_DIST((AVERAGE(array) - x) / (sigma / Math.sqrt(n)), true);
});
