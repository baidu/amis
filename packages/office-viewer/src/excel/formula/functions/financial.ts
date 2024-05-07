/**
 * 财务相关的函数，主要参考 formulajs 里的实现
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
import {getDateOrThrow} from './util/getDateOrThrow';
import {DATEDIF, DAYS, DAYS360, YEARFRAC, parseDate, parseDates} from './date';

function lastCoupDateBeforeSettlement(
  settlement: Date,
  maturity: string | Date,
  frequency: number
) {
  let date = parseDate(maturity);
  date.setFullYear(settlement.getFullYear());

  if (date < settlement) {
    date.setFullYear(date.getFullYear() + 1);
  }

  // Adjust the date based on the coupon frequency until date is later than settlement
  while (date > settlement) {
    date.setMonth(date.getMonth() + -12 / frequency);
  }

  return date;
}

function validateFrequency(frequency: number) {
  // Return error if frequency is neither 1, 2, or 4
  if ([1, 2, 4].indexOf(frequency) === -1) {
    throw FormulaError.NUM;
  }

  return frequency;
}

function validateBasis(basis: number) {
  // Return error if basis is neither 0, 1, 2, 3, or 4
  if ([0, 1, 2, 3, 4].indexOf(basis) === -1) {
    throw FormulaError.NUM;
  }

  return basis;
}

function PMT(
  rate: number,
  nper: number,
  pv: number,
  fv: number,
  type: number
): number {
  // Credits: algorithm inspired by Apache OpenOffice
  fv = fv || 0;
  type = type || 0;

  // Return payment
  let result;

  if (rate === 0) {
    result = (pv + fv) / nper;
  } else {
    const term = Math.pow(1 + rate, nper);

    result =
      type === 1
        ? ((fv * rate) / (term - 1) + (pv * rate) / (1 - 1 / term)) / (1 + rate)
        : (fv * rate) / (term - 1) + (pv * rate) / (1 - 1 / term);
  }

  return -result;
}

function PPMT(
  rate: number,
  per: number,
  nper: number,
  pv: number,
  fv: number,
  type: number
): number {
  fv = fv || 0;
  type = type || 0;

  return PMT(rate, nper, pv, fv, type) - IPMT(rate, per, nper, pv, fv, type);
}

function IPMT(
  rate: number,
  per: number,
  nper: number,
  pv: number,
  fv: number,
  type: number
) {
  // Credits: algorithm inspired by Apache OpenOffice
  fv = fv || 0;
  type = type || 0;

  // Compute payment
  const payment = PMT(rate, nper, pv, fv, type);

  // Compute interest
  let interest =
    per === 1
      ? type === 1
        ? 0
        : -pv
      : type === 1
      ? FV(rate, per - 2, payment, pv, 1) - payment
      : FV(rate, per - 1, payment, pv, 0);

  // Return interest
  return interest * rate;
}

function FV(
  rate: number,
  nper: number,
  payment: number,
  value: number,
  type: number
): number {
  // Credits: algorithm inspired by Apache OpenOffice
  value = value || 0;
  type = type || 0;

  // Return future value
  let result;

  if (rate === 0) {
    result = value + payment * nper;
  } else {
    const term = Math.pow(1 + rate, nper);

    result =
      type === 1
        ? value * term + (payment * (1 + rate) * (term - 1)) / rate
        : value * term + (payment * (term - 1)) / rate;
  }

  return -result;
}

// TODO: 看起来这个实现并不准确 firstInterest 和 frequency 参数都没用上
regFunc('ACCRINT', (...arg: EvalResult[]) => {
  const issue = parseDate(arg[0] as string);
  const firstInterest = parseDate(arg[1] as string);
  const settlement = parseDate(arg[2] as string);
  const rate = getNumberOrThrow(arg[3]);
  const par = getNumberOrThrow(arg[4]);
  const frequency = validateFrequency(getNumberOrThrow(arg[5]));
  const basis = validateBasis(getNumberWithDefault(arg[6], 0));
  // Return error if either rate or par are lower than or equal to zero
  if (rate <= 0 || par <= 0) {
    throw FormulaError.NUM;
  }

  // Return error if settlement is before or equal to issue
  if (settlement <= issue) {
    throw FormulaError.NUM;
  }

  // Compute accrued interest
  return par * rate * YEARFRAC(issue, settlement, basis);
});

regFunc('COUPDAYS', (...arg: EvalResult[]) => {
  const settlement = parseDate(arg[0] as string);
  const maturity = parseDate(arg[1] as string);
  const frequency = validateFrequency(getNumberOrThrow(arg[2]));
  const basis = validateBasis(getNumberWithDefault(arg[3], 0));

  // Return error if settlement is after or equal to maturity
  if (settlement >= maturity) {
    throw FormulaError.NUM;
  }

  if (basis === 1) {
    let date = lastCoupDateBeforeSettlement(settlement, maturity, frequency);
    let nextDate = new Date(date);

    // Set month of the nextDate to the next coupon month
    nextDate.setMonth(nextDate.getMonth() + 12 / frequency);

    return DATEDIF(date, nextDate, 'd');
  }

  let numOfDays;

  switch (basis) {
    case 0:
    case 2:
    case 4:
      numOfDays = 360;
      break;
    case 3:
      numOfDays = 365;
      break;
    default:
      throw FormulaError.NUM;
  }

  return numOfDays / frequency;
});

regFunc('CUMIPMT', (...arg: EvalResult[]) => {
  const rate = getNumberOrThrow(arg[0]);
  const nper = getNumberOrThrow(arg[1]);
  const pv = getNumberOrThrow(arg[2]);
  let startPeriod = getNumberOrThrow(arg[3]);
  const endPeriod = getNumberOrThrow(arg[4]);
  const type = getNumberWithDefault(arg[5], 0);

  // Return error if either rate, nper, pv, startPeriod, or endPeriod are lower than or equal to zero
  if (rate <= 0 || nper <= 0 || pv <= 0 || startPeriod <= 0 || endPeriod <= 0) {
    throw FormulaError.NUM;
  }

  // Return error if startPeriod is greater than endPeriod
  if (startPeriod > endPeriod) {
    throw FormulaError.NUM;
  }

  const payment = PMT(rate, nper, pv, 0, type);
  let interest = 0;

  if (startPeriod === 1) {
    if (type === 0) {
      interest = -pv;
    }

    startPeriod++;
  }

  for (let i = startPeriod; i <= endPeriod; i++) {
    interest +=
      type === 1
        ? FV(rate, i - 2, payment, pv, 1) - payment
        : FV(rate, i - 1, payment, pv, 0);
  }

  interest *= rate;

  return interest;
});

regFunc('CUMPRINC', (...arg: EvalResult[]) => {
  const rate = getNumberOrThrow(arg[0]);
  const nper = getNumberOrThrow(arg[1]);
  const pv = getNumberOrThrow(arg[2]);
  let startPeriod = getNumberOrThrow(arg[3]);
  const endPeriod = getNumberOrThrow(arg[4]);
  const type = getNumberWithDefault(arg[5], 0);

  // Return error if either rate, nper, or value are lower than or equal to zero
  if (rate <= 0 || nper <= 0 || pv <= 0) {
    throw FormulaError.NUM;
  }

  // Return error if start < 1, end < 1, or start > end
  if (startPeriod < 1 || endPeriod < 1 || startPeriod > endPeriod) {
    throw FormulaError.NUM;
  }

  // Return error if type is neither 0 nor 1
  if (type !== 0 && type !== 1) {
    throw FormulaError.NUM;
  }

  // Compute cumulative principal
  const payment = PMT(rate, nper, pv, 0, type);
  let principal = 0;

  if (startPeriod === 1) {
    principal = type === 0 ? payment + pv * rate : payment;

    startPeriod++;
  }

  for (let i = startPeriod; i <= endPeriod; i++) {
    principal +=
      type > 0
        ? payment - (FV(rate, i - 2, payment, pv, 1) - payment) * rate
        : payment - FV(rate, i - 1, payment, pv, 0) * rate;
  }

  // Return cumulative principal
  return principal;
});

regFunc('DB', (...arg: EvalResult[]) => {
  const cost = getNumberOrThrow(arg[0]);
  const salvage = getNumberOrThrow(arg[1]);
  const life = getNumberOrThrow(arg[2]);
  const period = getNumberOrThrow(arg[3]);
  const month = getNumberWithDefault(arg[4], 12);

  // Return error if any of the parameters is negative
  if (cost < 0 || salvage < 0 || life < 0 || period < 0) {
    throw FormulaError.NUM;
  }

  // Return error if month is not an integer between 1 and 12
  if ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].indexOf(month) === -1) {
    throw FormulaError.NUM;
  }

  // Return error if period is greater than life
  if (period > life) {
    throw FormulaError.NUM;
  }

  // Return 0 (zero) if salvage is greater than or equal to cost
  if (salvage >= cost) {
    return 0;
  }

  // Rate is rounded to three decimals places
  const rate = +(1 - Math.pow(salvage / cost, 1 / life)).toFixed(3);

  // Compute initial depreciation
  const initial = (cost * rate * month) / 12;

  // Compute total depreciation
  let total = initial;
  let current = 0;
  const ceiling = period === life ? life - 1 : period;

  for (let i = 2; i <= ceiling; i++) {
    current = (cost - total) * rate;
    total += current;
  }

  // Depreciation for the first and last periods are special cases
  if (period === 1) {
    // First period
    return initial;
  } else if (period === life) {
    // Last period

    return (cost - total) * rate;
  } else {
    return current;
  }
});

regFunc('DDB', (...arg: EvalResult[]) => {
  const cost = getNumberOrThrow(arg[0]);
  const salvage = getNumberOrThrow(arg[1]);
  const life = getNumberOrThrow(arg[2]);
  const period = getNumberOrThrow(arg[3]);
  const factor = getNumberWithDefault(arg[4], 2);

  // Return error if any of the parameters is negative or if factor is null
  if (cost < 0 || salvage < 0 || life < 0 || period < 0 || factor <= 0) {
    throw FormulaError.NUM;
  }

  // Return error if period is greater than life
  if (period > life) {
    throw FormulaError.NUM;
  }

  // Return 0 (zero) if salvage is greater than or equal to cost
  if (salvage >= cost) {
    return 0;
  }

  // Compute depreciation
  let total = 0;
  let current = 0;

  for (let i = 1; i <= period; i++) {
    current = Math.min(
      (cost - total) * (factor / life),
      cost - salvage - total
    );
    total += current;
  }

  // Return depreciation
  return current;
});

regFunc('DISC', (...arg: EvalResult[]) => {
  const settlement = parseDate(arg[0] as string);
  const maturity = parseDate(arg[1] as string);
  const pr = getNumberOrThrow(arg[2]);
  const redemption = getNumberOrThrow(arg[3]);
  const basis = validateBasis(getNumberWithDefault(arg[4], 0));

  if (pr <= 0 || redemption <= 0) {
    throw FormulaError.NUM;
  }

  if (settlement >= maturity) {
    throw FormulaError.VALUE;
  }

  let basisVal, diff;
  switch (basis) {
    case 0:
      basisVal = 360;
      diff = DAYS360(settlement, maturity, false);
      break;
    case 1:
      basisVal = 365;
      diff = DATEDIF(settlement, maturity, 'D');
      break;
    case 2:
      basisVal = 360;
      diff = DATEDIF(settlement, maturity, 'D');
      break;
    case 3:
      basisVal = 365;
      diff = DATEDIF(settlement, maturity, 'D');
      break;
    case 4:
      basisVal = 360;
      diff = DAYS360(settlement, maturity, true);
      break;
    default:
      throw FormulaError.NUM;
  }

  return (((redemption - pr) / redemption) * basisVal) / diff;
});

regFunc('DOLLARDE', (...arg: EvalResult[]) => {
  const fractional_dollar = getNumberOrThrow(arg[0]);
  let fraction = parseInt(getNumberOrThrow(arg[1]) + '', 10);

  // Return error if fraction is negative
  if (fraction < 0) {
    throw FormulaError.NUM;
  }

  // Return error if fraction is greater than or equal to 0 and less than 1
  if (fraction >= 0 && fraction < 1) {
    throw FormulaError.DIV0;
  }

  // Compute integer part
  let result = parseInt(fractional_dollar + '', 10);

  // Add decimal part
  result +=
    ((fractional_dollar % 1) *
      Math.pow(10, Math.ceil(Math.log(fraction) / Math.LN10))) /
    fraction;

  // Round result
  const power = Math.pow(10, Math.ceil(Math.log(fraction) / Math.LN2) + 1);
  result = Math.round(result * power) / power;

  // Return converted dollar price
  return result;
});

regFunc('DOLLARFR', (...arg: EvalResult[]) => {
  const decimal_dollar = getNumberOrThrow(arg[0]);
  let fraction = parseInt(getNumberOrThrow(arg[1]) + '', 10);
  // Return error if fraction is negative
  if (fraction < 0) {
    throw FormulaError.NUM;
  }

  // Return error if fraction is greater than or equal to 0 and less than 1
  if (fraction >= 0 && fraction < 1) {
    throw FormulaError.DIV0;
  }

  // Compute integer part
  let result = parseInt(decimal_dollar + '', 10);

  // Add decimal part
  result +=
    (decimal_dollar % 1) *
    Math.pow(10, -Math.ceil(Math.log(fraction) / Math.LN10)) *
    fraction;

  // Return converted dollar price
  return result;
});

regFunc('EFFECT', (...arg: EvalResult[]) => {
  const nominal_rate = getNumberOrThrow(arg[0]);
  const npery = parseInt(getNumberOrThrow(arg[1]) + '', 10);

  // Return error if nominal_rate <= 0 or npery < 1
  if (nominal_rate <= 0 || npery < 1) {
    throw FormulaError.NUM;
  }

  // Return effective annual interest rate
  return Math.pow(1 + nominal_rate / npery, npery) - 1;
});

regFunc('FV', (...arg: EvalResult[]) => {
  const rate = getNumberOrThrow(arg[0]);
  const nper = getNumberOrThrow(arg[1]);
  const payment = getNumberOrThrow(arg[2]);
  const pv = getNumberOrThrow(arg[3]);
  const type = getNumberWithDefault(arg[4], 0);

  // Return future value
  return FV(rate, nper, payment, pv, type);
});

regFunc('FVSCHEDULE', (...arg: EvalResult[]) => {
  const principal = getNumberOrThrow(arg[0]);
  const schedule = getNumbers([arg[1]]);

  // Return error if either principal or schedule is lower than or equal to zero
  if (principal <= 0) {
    throw FormulaError.NUM;
  }

  const n = schedule.length;
  let future = principal;

  // Apply all interests in schedule

  for (let i = 0; i < n; i++) {
    // Apply scheduled interest
    future *= 1 + schedule[i];
  }

  // Return future value
  return future;
});

regFunc('IPMT', (...arg: EvalResult[]) => {
  const rate = getNumberOrThrow(arg[0]);
  const per = getNumberOrThrow(arg[1]);
  const nper = getNumberOrThrow(arg[2]);
  const pv = getNumberOrThrow(arg[3]);
  const fv = getNumberWithDefault(arg[4], 0);
  const type = getNumberWithDefault(arg[5], 0);

  // Return interest payment
  return IPMT(rate, per, nper, pv, fv, type);
});

regFunc('IRR', (...args: EvalResult[]) => {
  const values = getNumbers([args[0]]);
  let guess = getNumberWithDefault(args[1], 0.1);

  // Calculates the resulting amount
  const irrResult = (values: number[], dates: number[], rate: number) => {
    const r = rate + 1;
    let result = values[0];

    for (let i = 1; i < values.length; i++) {
      result += values[i] / Math.pow(r, (dates[i] - dates[0]) / 365);
    }

    return result;
  };

  // Calculates the first derivation
  const irrResultDeriv = (values: number[], dates: number[], rate: number) => {
    const r = rate + 1;
    let result = 0;

    for (let i = 1; i < values.length; i++) {
      const frac = (dates[i] - dates[0]) / 365;
      result -= (frac * values[i]) / Math.pow(r, frac + 1);
    }

    return result;
  };

  // Initialize dates and check that values contains at least one positive value and one negative value
  const dates: number[] = [];
  let positive = false;
  let negative = false;

  for (let i = 0; i < values.length; i++) {
    dates[i] = i === 0 ? 0 : dates[i - 1] + 365;

    if (values[i] > 0) {
      positive = true;
    }

    if (values[i] < 0) {
      negative = true;
    }
  }

  // Return error if values does not contain at least one positive value and one negative value
  if (!positive || !negative) {
    throw FormulaError.NUM;
  }

  // Initialize guess and resultRate
  guess = guess === undefined ? 0.1 : guess;
  let resultRate = guess;

  // Set maximum epsilon for end of iteration
  const epsMax = 1e-10;

  // Implement Newton's method
  let newRate, epsRate, resultValue;
  let contLoop = true;
  do {
    resultValue = irrResult(values, dates, resultRate);
    newRate =
      resultRate - resultValue / irrResultDeriv(values, dates, resultRate);
    epsRate = Math.abs(newRate - resultRate);
    resultRate = newRate;
    contLoop = epsRate > epsMax && Math.abs(resultValue) > epsMax;
  } while (contLoop);

  // Return internal rate of return
  return resultRate;
});

regFunc('ISPMT', (...arg: EvalResult[]) => {
  const rate = getNumberOrThrow(arg[0]);
  const per = getNumberOrThrow(arg[1]);
  const nper = getNumberOrThrow(arg[2]);
  const pv = getNumberOrThrow(arg[3]);

  // Return interest payment
  return pv * rate * (per / nper - 1);
});

export function NPV(...arg: EvalResult[]) {
  const args = getNumbers(arg);

  // Lookup rate
  const rate = args[0];

  // Initialize net present value
  let value = 0;

  // Loop on all values
  for (let j = 1; j < args.length; j++) {
    value += args[j] / Math.pow(1 + rate, j);
  }

  // Return net present value
  return value;
}

regFunc('MIRR', (...arg: EvalResult[]) => {
  const values = getNumbers([arg[0]]);
  const finance_rate = getNumberOrThrow(arg[1]);
  const reinvest_rate = getNumberOrThrow(arg[2]);

  // Initialize number of values
  const n = values.length;

  // Lookup payments (negative values) and incomes (positive values)
  const payments = [];
  const incomes = [];

  for (let i = 0; i < n; i++) {
    if (values[i] < 0) {
      payments.push(values[i]);
    } else {
      incomes.push(values[i]);
    }
  }

  // Return modified internal rate of return
  const num = -NPV(reinvest_rate, incomes) * Math.pow(1 + reinvest_rate, n - 1);
  const den = NPV(finance_rate, payments) * (1 + finance_rate);

  return Math.pow(num / den, 1 / (n - 1)) - 1;
});

regFunc('NOMINAL', (...arg: EvalResult[]) => {
  const rate = getNumberOrThrow(arg[0]);
  const npery = parseInt(getNumberOrThrow(arg[1]) + '', 10);

  // Return error if rate <= 0 or npery < 1
  if (rate <= 0 || npery < 1) {
    throw FormulaError.NUM;
  }

  // Return nominal annual interest rate
  return (Math.pow(rate + 1, 1 / npery) - 1) * npery;
});

regFunc('NPER', (...arg: EvalResult[]) => {
  const rate = getNumberOrThrow(arg[0]);
  const payment = getNumberOrThrow(arg[1]);
  const pv = getNumberOrThrow(arg[2]);
  const fv = getNumberWithDefault(arg[3], 0);
  const type = getNumberWithDefault(arg[4], 0);

  // Return number of periods
  if (rate === 0) {
    return -(pv + fv) / payment;
  } else {
    const num = payment * (1 + rate * type) - fv * rate;
    const den = pv * rate + payment * (1 + rate * type);

    return Math.log(num / den) / Math.log(1 + rate);
  }
});

regFunc('NPV', NPV);

regFunc('PDURATION', (...arg: EvalResult[]) => {
  const rate = getNumberOrThrow(arg[0]);
  const pv = getNumberOrThrow(arg[1]);
  const fv = getNumberWithDefault(arg[2], 0);

  // Return error if rate <=0
  if (rate <= 0) {
    throw FormulaError.NUM;
  }

  // Return number of periods
  return (Math.log(fv) - Math.log(pv)) / Math.log(1 + rate);
});

regFunc('PMT', (...arg: EvalResult[]) => {
  const rate = getNumberOrThrow(arg[0]);
  const nper = getNumberOrThrow(arg[1]);
  const pv = getNumberOrThrow(arg[2]);
  const fv = getNumberWithDefault(arg[3], 0);
  const type = getNumberWithDefault(arg[4], 0);

  // Return payment
  return PMT(rate, nper, pv, fv, type);
});

regFunc('PPMT', (...arg: EvalResult[]) => {
  const rate = getNumberOrThrow(arg[0]);
  const per = getNumberOrThrow(arg[1]);
  const nper = getNumberOrThrow(arg[2]);
  const pv = getNumberOrThrow(arg[3]);
  const fv = getNumberWithDefault(arg[4], 0);
  const type = getNumberWithDefault(arg[5], 0);

  // Return principal payment
  return PPMT(rate, per, nper, pv, fv, type);
});

regFunc('PRICEDISC', (...arg: EvalResult[]) => {
  const settlement = parseDate(arg[0] as string);
  const maturity = parseDate(arg[1] as string);
  const discount = getNumberOrThrow(arg[2]);
  const redemption = getNumberOrThrow(arg[3]);
  const basis = validateBasis(getNumberWithDefault(arg[4], 0));

  if (discount <= 0 || redemption <= 0) {
    throw FormulaError.NUM;
  }

  if (settlement >= maturity) {
    throw FormulaError.VALUE;
  }

  let basisVal, diff;
  switch (basis) {
    case 0:
      basisVal = 360;
      diff = DAYS360(settlement, maturity, false);
      break;
    case 1:
      basisVal = 365;
      diff = DATEDIF(settlement, maturity, 'D');
      break;
    case 2:
      basisVal = 360;
      diff = DATEDIF(settlement, maturity, 'D');
      break;
    case 3:
      basisVal = 365;
      diff = DATEDIF(settlement, maturity, 'D');
      break;
    case 4:
      basisVal = 360;
      diff = DAYS360(settlement, maturity, true);
      break;
    default:
      throw FormulaError.NUM;
  }

  return redemption - (discount * redemption * diff) / basisVal;
});

regFunc('PV', (...arg: EvalResult[]) => {
  const rate = getNumberOrThrow(arg[0]);
  const nper = getNumberOrThrow(arg[1]);
  const payment = getNumberOrThrow(arg[2]);
  const fv = getNumberWithDefault(arg[3], 0);
  const type = getNumberWithDefault(arg[4], 0);

  // Return present value
  return rate === 0
    ? -payment * nper - fv
    : (((1 - Math.pow(1 + rate, nper)) / rate) * payment * (1 + rate * type) -
        fv) /
        Math.pow(1 + rate, nper);
});

regFunc('RATE', (...arg: EvalResult[]) => {
  const nper = getNumberOrThrow(arg[0]);
  const pmt = getNumberOrThrow(arg[1]);
  const pv = getNumberOrThrow(arg[2]);
  const fv = getNumberWithDefault(arg[3], 0);
  let type = getNumberWithDefault(arg[4], 0);
  const guess = getNumberWithDefault(arg[5], 0.1);

  const epsMax = 1e-10;
  const iterMax = 20;
  let rate = guess;

  type = type ? 1 : 0;

  for (let i = 0; i < iterMax; i++) {
    if (rate <= -1) {
      throw FormulaError.NUM;
    }

    let y, f;

    if (Math.abs(rate) < epsMax) {
      y = pv * (1 + nper * rate) + pmt * (1 + rate * type) * nper + fv;
    } else {
      f = Math.pow(1 + rate, nper);
      y = pv * f + pmt * (1 / rate + type) * (f - 1) + fv;
    }

    if (Math.abs(y) < epsMax) {
      return rate;
    }

    let dy;

    if (Math.abs(rate) < epsMax) {
      dy = pv * nper + pmt * type * nper;
    } else {
      f = Math.pow(1 + rate, nper);
      const df = nper * Math.pow(1 + rate, nper - 1);
      dy =
        pv * df +
        pmt * (1 / rate + type) * df +
        pmt * (-1 / (rate * rate)) * (f - 1);
    }

    rate -= y / dy;
  }

  return rate;
});

regFunc('RRI', (...arg: EvalResult[]) => {
  const nper = getNumberOrThrow(arg[0]);
  const pv = getNumberOrThrow(arg[1]);
  const fv = getNumberOrThrow(arg[2]);

  // Return error if nper, pv, or fv are lower than or equal to zero
  if (nper <= 0 || pv <= 0 || fv <= 0) {
    throw FormulaError.NUM;
  }

  // Return equivalent interest rate
  return Math.pow(fv / pv, 1 / nper) - 1;
});

regFunc('SLN', (...arg: EvalResult[]) => {
  const cost = getNumberOrThrow(arg[0]);
  const salvage = getNumberOrThrow(arg[1]);
  const life = getNumberOrThrow(arg[2]);

  // Return error if life equal to 0 (zero)
  if (life === 0) {
    throw FormulaError.NUM;
  }

  // Return straight-line depreciation
  return (cost - salvage) / life;
});

regFunc('SYD', (...arg: EvalResult[]) => {
  const cost = getNumberOrThrow(arg[0]);
  const salvage = getNumberOrThrow(arg[1]);
  const life = getNumberOrThrow(arg[2]);
  const per = parseInt(getNumberOrThrow(arg[3]) + '', 10);

  // Return error if life equal to 0 (zero)
  if (life === 0) {
    throw FormulaError.NUM;
  }

  // Return error if per is lower than 1 or greater than life
  if (per < 1 || per > life) {
    throw FormulaError.NUM;
  }

  // Return straight-line depreciation
  return ((cost - salvage) * (life - per + 1) * 2) / (life * (life + 1));
});

regFunc('TBILLEQ', (...arg: EvalResult[]) => {
  const settlement = parseDate(arg[0] as string);
  const maturity = parseDate(arg[1] as string);
  const discount = getNumberOrThrow(arg[2]);

  // Return error if discount is lower than or equal to zero
  if (discount <= 0) {
    throw FormulaError.NUM;
  }

  // Return error if settlement is greater than maturity
  if (settlement > maturity) {
    throw FormulaError.NUM;
  }

  // Return error if maturity is more than one year after settlement
  if (maturity.getTime() - settlement.getTime() > 365 * 24 * 60 * 60 * 1000) {
    throw FormulaError.NUM;
  }

  // Return bond-equivalent yield
  return (
    (365 * discount) / (360 - discount * DAYS360(settlement, maturity, false))
  );
});

regFunc('TBILLPRICE', (...arg: EvalResult[]) => {
  const settlement = parseDate(arg[0] as string);
  const maturity = parseDate(arg[1] as string);
  const discount = getNumberOrThrow(arg[2]);

  // Return error if discount is lower than or equal to zero
  if (discount <= 0) {
    throw FormulaError.NUM;
  }

  // Return error if settlement is greater than maturity
  if (settlement > maturity) {
    throw FormulaError.NUM;
  }

  // Return error if maturity is more than one year after settlement
  if (maturity.getTime() - settlement.getTime() > 365 * 24 * 60 * 60 * 1000) {
    throw FormulaError.NUM;
  }

  // Return bond-equivalent yield
  return 100 * (1 - (discount * DAYS360(settlement, maturity, false)) / 360);
});

regFunc('TBILLYIELD', (...arg: EvalResult[]) => {
  const settlement = parseDate(arg[0] as string);
  const maturity = parseDate(arg[1] as string);
  const price = getNumberOrThrow(arg[2]);

  // Return error if price is lower than or equal to zero
  if (price <= 0) {
    throw FormulaError.NUM;
  }

  // Return error if settlement is greater than maturity
  if (settlement > maturity) {
    throw FormulaError.NUM;
  }

  // Return error if maturity is more than one year after settlement
  if (maturity.getTime() - settlement.getTime() > 365 * 24 * 60 * 60 * 1000) {
    throw FormulaError.NUM;
  }

  // Return bond-equivalent yield
  return ((100 - price) / (price * DAYS360(settlement, maturity, false))) * 360;
});

regFunc('XIRR', (...arg: EvalResult[]) => {
  const values = getNumbers([arg[0]]);
  const dates = parseDates(arg[1] as string[]);
  const guess = getNumberWithDefault(arg[2], 0.1);

  // Calculates the resulting amount
  const irrResult = (values: number[], dates: Date[], rate: number) => {
    const r = rate + 1;
    let result = values[0];

    for (let i = 1; i < values.length; i++) {
      result += values[i] / Math.pow(r, DAYS(dates[i], dates[0]) / 365);
    }

    return result;
  };

  // Calculates the first derivation
  const irrResultDeriv = (values: number[], dates: Date[], rate: number) => {
    const r = rate + 1;
    let result = 0;

    for (let i = 1; i < values.length; i++) {
      const frac = DAYS(dates[i], dates[0]) / 365;
      result -= (frac * values[i]) / Math.pow(r, frac + 1);
    }

    return result;
  };

  // Check that values contains at least one positive value and one negative value
  let positive = false;
  let negative = false;

  for (let i = 0; i < values.length; i++) {
    if (values[i] > 0) {
      positive = true;
    }

    if (values[i] < 0) {
      negative = true;
    }
  }

  // Return error if values does not contain at least one positive value and one negative value
  if (!positive || !negative) {
    throw FormulaError.NUM;
  }

  let resultRate = guess;

  // Set maximum epsilon for end of iteration
  const epsMax = 1e-10;

  // Implement Newton's method
  let newRate, epsRate, resultValue;
  let contLoop = true;

  do {
    resultValue = irrResult(values, dates, resultRate);
    newRate =
      resultRate - resultValue / irrResultDeriv(values, dates, resultRate);
    epsRate = Math.abs(newRate - resultRate);
    resultRate = newRate;
    contLoop = epsRate > epsMax && Math.abs(resultValue) > epsMax;
  } while (contLoop);

  // Return internal rate of return
  return resultRate;
});

regFunc('XNPV', (...arg: EvalResult[]) => {
  const rate = getNumberOrThrow(arg[0]);
  const values = getNumbers([arg[1]]);
  const dates = parseDates(arg[2] as string[]);

  let result = 0;

  for (let i = 0; i < values.length; i++) {
    result += values[i] / Math.pow(1 + rate, DAYS(dates[i], dates[0]) / 365);
  }

  return result;
});
