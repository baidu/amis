/**
 * 工程相关的函数，主要参考 fast-formula-parser 里的实现
 * https://github.com/LesterLyu/fast-formula-parser
 */

import FormulaError from '../FormulaError';
import {EvalResult} from '../eval/EvalResult';
import {regFunc} from './functions';
import {getNumber, getNumberOrThrow} from './util/getNumber';
import {getString, getStringOrThrow} from './util/getString';

import {jStat} from './util/jStat';
import {bessel} from './util/bessel';
import {TextFunctions} from './util/TextFunctions';
import {loopArgs} from './util/loopArgs';

const MAX_OCT = 536870911, // OCT2DEC(3777777777)
  MIN_OCT = -536870912, // OCT2DEC4000000000)
  MAX_HEX = 549755813887,
  MIN_HEX = -549755813888,
  MAX_BIN = 511, // BIN2DEC(111111111)
  MIN_BIN = -512; // BIN2DEC(1000000000)

const numberRegex = /^\s?[+-]?\s?[0-9]+[.]?[0-9]*([eE][+\-][0-9]+)?\s?$/;
const IMWithoutRealRegex =
  /^\s?([+-]?\s?([0-9]+[.]?[0-9]*([eE][+\-][0-9]+)?)?)\s?[ij]\s?$/;
const IMRegex =
  /^\s?([+-]?\s?[0-9]+[.]?[0-9]*([eE][+\-][0-9]+)?)\s?([+-]?\s?([0-9]+[.]?[0-9]*([eE][+\-][0-9]+)?)?)\s?[ij]\s?$/;

function parseIM(textOrNumber: EvalResult) {
  textOrNumber = textOrNumber as number | string;
  let real = 0,
    im = 0,
    unit = 'i';
  if (typeof textOrNumber === 'number') return {real: textOrNumber, im, unit};
  if (typeof textOrNumber === 'boolean') throw FormulaError.VALUE;
  let match = textOrNumber.match(numberRegex);
  if (match) {
    real = Number(match[0]);
    return {real, im, unit};
  }
  match = textOrNumber.match(IMWithoutRealRegex);
  if (match) {
    im = Number(/^\s?[+-]?\s?$/.test(match[1]) ? match[1] + '1' : match[1]);
    unit = match[0].slice(-1);
    return {real, im, unit};
  }
  match = textOrNumber.match(IMRegex);
  if (match) {
    real = Number(match[1]);
    im = Number(/^\s?[+-]?\s?$/.test(match[3]) ? match[3] + '1' : match[3]);
    unit = match[0].slice(-1);
    return {real, im, unit};
  }
  throw FormulaError.NUM;
}

regFunc('BESSELI', (...args: EvalResult[]) => {
  let x = getNumberOrThrow(args[0]);
  let n = Math.trunc(getNumberOrThrow(args[1]));
  if (n < 0) {
    throw FormulaError.NUM;
  }
  return bessel.besseli(x, n);
});

regFunc('BESSELJ', (...args: EvalResult[]) => {
  let x = getNumberOrThrow(args[0]);
  let n = Math.trunc(getNumberOrThrow(args[1]));
  if (n < 0) {
    throw FormulaError.NUM;
  }
  return bessel.besselj(x, n);
});

regFunc('BESSELK', (...args: EvalResult[]) => {
  let x = getNumberOrThrow(args[0]);
  let n = Math.trunc(getNumberOrThrow(args[1]));
  if (n < 0) {
    throw FormulaError.NUM;
  }
  return bessel.besselk(x, n);
});

regFunc('BESSELY', (...args: EvalResult[]) => {
  let x = getNumberOrThrow(args[0]);
  let n = Math.trunc(getNumberOrThrow(args[1]));
  if (n < 0) {
    throw FormulaError.NUM;
  }
  return bessel.bessely(x, n);
});

regFunc('BIN2DEC', (number: EvalResult) => {
  number = getNumberOrThrow(number);
  let numberStr = number.toString();

  if (numberStr.length > 10) {
    throw FormulaError.NUM;
  }

  if (numberStr.length === 10 && numberStr.substring(0, 1) === '1') {
    return parseInt(numberStr.substring(1), 2) + MIN_BIN;
  } else {
    return parseInt(numberStr, 2);
  }
});

regFunc('BIN2HEX', (number: EvalResult, places: EvalResult) => {
  number = getNumberOrThrow(number);
  places = getNumber(places);
  const numberStr = number.toString();
  if (numberStr.length > 10) {
    throw FormulaError.NUM;
  }
  if (numberStr.length === 10 && numberStr.substring(0, 1) === '1') {
    return (parseInt(numberStr.substring(1), 2) + 1099511627264)
      .toString(16)
      .toUpperCase();
  }
  // convert BIN to HEX
  const result = parseInt(number + '', 2).toString(16);

  if (places === undefined) {
    return result.toUpperCase();
  } else {
    if (places < 0) {
      throw FormulaError.NUM;
    }
    // truncate places in case it is not an integer
    places = Math.trunc(places);
    if (places >= result.length) {
      return (
        TextFunctions.REPT('0', places - result.length) + result
      ).toUpperCase();
    } else {
      throw FormulaError.NUM;
    }
  }
});

regFunc('BIN2OCT', (number: EvalResult, places: EvalResult) => {
  number = getNumberOrThrow(number);
  places = getNumber(places);
  let numberStr = number.toString();
  if (numberStr.length > 10) {
    throw FormulaError.NUM;
  }
  if (numberStr.length === 10 && numberStr.substr(0, 1) === '1') {
    return (parseInt(numberStr.substr(1), 2) + 1073741312).toString(8);
  }

  let result = parseInt(number + '', 2).toString(8);
  if (places === undefined) {
    return result.toUpperCase();
  } else {
    if (places < 0) {
      throw FormulaError.NUM;
    }
    // truncate places in case it is not an integer
    places = Math.trunc(places);
    if (places >= result.length) {
      return TextFunctions.REPT('0', places - result.length) + result;
    } else {
      throw FormulaError.NUM;
    }
  }
});

regFunc('BITAND', (number1: EvalResult, number2: EvalResult) => {
  number1 = getNumberOrThrow(number1, true);
  number2 = getNumberOrThrow(number2, true);
  if (number1 < 0 || number2 < 0) {
    throw FormulaError.NUM;
  }
  // check if they are non-integer, if yes, return error
  if (Math.floor(number1) !== number1 || Math.floor(number2) !== number2) {
    throw FormulaError.NUM;
  }
  if (number1 > 281474976710655 || number2 > 281474976710655) {
    throw FormulaError.NUM;
  }

  return number1 & number2;
});

regFunc('BITLSHIFT', (number: EvalResult, shiftAmount: EvalResult) => {
  number = getNumberOrThrow(number, true);
  shiftAmount = Math.trunc(getNumberOrThrow(shiftAmount, true));
  if (Math.abs(shiftAmount) > 53) {
    throw FormulaError.NUM;
  }

  if (number < 0 || Math.floor(number) !== number || number > 281474976710655) {
    throw FormulaError.NUM;
  }
  const result =
    shiftAmount >= 0
      ? number * 2 ** shiftAmount
      : Math.trunc(number / 2 ** -shiftAmount);
  if (result > 281474976710655) {
    throw FormulaError.NUM;
  } else {
    return result;
  }
});

regFunc('BITOR', (number1: EvalResult, number2: EvalResult) => {
  number1 = getNumberOrThrow(number1, true);
  number2 = getNumberOrThrow(number2, true);
  if (number1 < 0 || number2 < 0) {
    throw FormulaError.NUM;
  }
  // check if they are non-integer, if yes, return error
  if (Math.floor(number1) !== number1 || Math.floor(number2) !== number2) {
    throw FormulaError.NUM;
  }
  if (number1 > 281474976710655 || number2 > 281474976710655) {
    throw FormulaError.NUM;
  }

  return number1 | number2;
});

regFunc('BITRSHIFT', (number: EvalResult, shiftAmount: EvalResult) => {
  number = getNumberOrThrow(number, true);
  shiftAmount = Math.trunc(getNumberOrThrow(shiftAmount, true));
  if (Math.abs(shiftAmount) > 53) {
    throw FormulaError.NUM;
  }

  if (number < 0 || Math.floor(number) !== number || number > 281474976710655) {
    throw FormulaError.NUM;
  }
  const result =
    shiftAmount >= 0
      ? Math.trunc(number / 2 ** shiftAmount)
      : number * 2 ** -shiftAmount;
  if (result > 281474976710655) {
    throw FormulaError.NUM;
  } else {
    return result;
  }
});

regFunc('BITXOR', (number1: EvalResult, number2: EvalResult) => {
  number1 = getNumberOrThrow(number1, true);
  number2 = getNumberOrThrow(number2, true);
  if (number1 < 0 || number2 < 0) {
    throw FormulaError.NUM;
  }
  // check if they are non-integer, if yes, return error
  if (Math.floor(number1) !== number1 || Math.floor(number2) !== number2) {
    throw FormulaError.NUM;
  }
  if (number1 > 281474976710655 || number2 > 281474976710655) {
    throw FormulaError.NUM;
  }

  return number1 ^ number2;
});

function COMPLEX(realNum: number, iNum: number, suffix: string = 'i') {
  if (suffix !== 'i' && suffix !== 'j') {
    throw FormulaError.VALUE;
  }
  if (realNum === 0 && iNum === 0) {
    return 0;
  } else if (realNum === 0) {
    if (iNum === 1) {
      return suffix;
    } else if (iNum === -1) {
      return '-' + suffix;
    } else {
      return iNum.toString() + suffix;
    }
  } else if (iNum === 0) {
    return realNum.toString();
  } else {
    let sign = iNum > 0 ? '+' : '';
    if (iNum === 1) {
      return realNum.toString() + sign + suffix;
    } else if (iNum === -1) {
      return realNum.toString() + sign + '-' + suffix;
    } else {
      return realNum.toString() + sign + iNum.toString() + suffix;
    }
  }
}

regFunc('COMPLEX', (...args: EvalResult[]) => {
  const realNum = getNumberOrThrow(args[0]);
  const iNum = getNumberOrThrow(args[1]);
  const suffix = getString(args[2], 'i');
  return COMPLEX(realNum, iNum, suffix);
});

// 来自 formulajs 里的实现，很多地方类型待优化
regFunc('CONVERT', (...args: EvalResult[]) => {
  let number = getNumberOrThrow(args[0]);
  let from_unit = getStringOrThrow(args[1]);
  let to_unit = getStringOrThrow(args[2]);

  // List of units supported by CONVERT and units defined by the International System of Units
  // [Name, Symbol, Alternate symbols, Quantity, ISU, CONVERT, Conversion ratio]
  const units = [
    ['a.u. of action', '?', null, 'action', false, false, 1.05457168181818e-34],
    [
      'a.u. of charge',
      'e',
      null,
      'electric_charge',
      false,
      false,
      1.60217653141414e-19
    ],
    [
      'a.u. of energy',
      'Eh',
      null,
      'energy',
      false,
      false,
      4.35974417757576e-18
    ],
    [
      'a.u. of length',
      'a?',
      null,
      'length',
      false,
      false,
      5.29177210818182e-11
    ],
    ['a.u. of mass', 'm?', null, 'mass', false, false, 9.10938261616162e-31],
    ['a.u. of time', '?/Eh', null, 'time', false, false, 2.41888432650516e-17],
    ['admiralty knot', 'admkn', null, 'speed', false, true, 0.514773333],
    ['ampere', 'A', null, 'electric_current', true, false, 1],
    [
      'ampere per meter',
      'A/m',
      null,
      'magnetic_field_intensity',
      true,
      false,
      1
    ],
    ['ångström', 'Å', ['ang'], 'length', false, true, 1e-10],
    ['are', 'ar', null, 'area', false, true, 100],
    [
      'astronomical unit',
      'ua',
      null,
      'length',
      false,
      false,
      1.49597870691667e-11
    ],
    ['bar', 'bar', null, 'pressure', false, false, 100000],
    ['barn', 'b', null, 'area', false, false, 1e-28],
    ['becquerel', 'Bq', null, 'radioactivity', true, false, 1],
    ['bit', 'bit', ['b'], 'information', false, true, 1],
    ['btu', 'BTU', ['btu'], 'energy', false, true, 1055.05585262],
    ['byte', 'byte', null, 'information', false, true, 8],
    ['candela', 'cd', null, 'luminous_intensity', true, false, 1],
    ['candela per square metre', 'cd/m?', null, 'luminance', true, false, 1],
    ['coulomb', 'C', null, 'electric_charge', true, false, 1],
    ['cubic ångström', 'ang3', ['ang^3'], 'volume', false, true, 1e-30],
    ['cubic foot', 'ft3', ['ft^3'], 'volume', false, true, 0.028316846592],
    ['cubic inch', 'in3', ['in^3'], 'volume', false, true, 0.000016387064],
    [
      'cubic light-year',
      'ly3',
      ['ly^3'],
      'volume',
      false,
      true,
      8.46786664623715e-47
    ],
    ['cubic metre', 'm3', ['m^3'], 'volume', true, true, 1],
    ['cubic mile', 'mi3', ['mi^3'], 'volume', false, true, 4168181825.44058],
    [
      'cubic nautical mile',
      'Nmi3',
      ['Nmi^3'],
      'volume',
      false,
      true,
      6352182208
    ],
    [
      'cubic Pica',
      'Pica3',
      ['Picapt3', 'Pica^3', 'Picapt^3'],
      'volume',
      false,
      true,
      7.58660370370369e-8
    ],
    ['cubic yard', 'yd3', ['yd^3'], 'volume', false, true, 0.764554857984],
    ['cup', 'cup', null, 'volume', false, true, 0.0002365882365],
    ['dalton', 'Da', ['u'], 'mass', false, false, 1.66053886282828e-27],
    ['day', 'd', ['day'], 'time', false, true, 86400],
    ['degree', '°', null, 'angle', false, false, 0.0174532925199433],
    [
      'degrees Rankine',
      'Rank',
      null,
      'temperature',
      false,
      true,
      0.555555555555556
    ],
    ['dyne', 'dyn', ['dy'], 'force', false, true, 0.00001],
    ['electronvolt', 'eV', ['ev'], 'energy', false, true, 1.60217656514141],
    ['ell', 'ell', null, 'length', false, true, 1.143],
    ['erg', 'erg', ['e'], 'energy', false, true, 1e-7],
    ['farad', 'F', null, 'electric_capacitance', true, false, 1],
    ['fluid ounce', 'oz', null, 'volume', false, true, 0.0000295735295625],
    ['foot', 'ft', null, 'length', false, true, 0.3048],
    ['foot-pound', 'flb', null, 'energy', false, true, 1.3558179483314],
    ['gal', 'Gal', null, 'acceleration', false, false, 0.01],
    ['gallon', 'gal', null, 'volume', false, true, 0.003785411784],
    ['gauss', 'G', ['ga'], 'magnetic_flux_density', false, true, 1],
    ['grain', 'grain', null, 'mass', false, true, 0.0000647989],
    ['gram', 'g', null, 'mass', false, true, 0.001],
    ['gray', 'Gy', null, 'absorbed_dose', true, false, 1],
    [
      'gross registered ton',
      'GRT',
      ['regton'],
      'volume',
      false,
      true,
      2.8316846592
    ],
    ['hectare', 'ha', null, 'area', false, true, 10000],
    ['henry', 'H', null, 'inductance', true, false, 1],
    ['hertz', 'Hz', null, 'frequency', true, false, 1],
    ['horsepower', 'HP', ['h'], 'power', false, true, 745.69987158227],
    [
      'horsepower-hour',
      'HPh',
      ['hh', 'hph'],
      'energy',
      false,
      true,
      2684519.538
    ],
    ['hour', 'h', ['hr'], 'time', false, true, 3600],
    [
      'imperial gallon (U.K.)',
      'uk_gal',
      null,
      'volume',
      false,
      true,
      0.00454609
    ],
    [
      'imperial hundredweight',
      'lcwt',
      ['uk_cwt', 'hweight'],
      'mass',
      false,
      true,
      50.802345
    ],
    [
      'imperial quart (U.K)',
      'uk_qt',
      null,
      'volume',
      false,
      true,
      0.0011365225
    ],
    [
      'imperial ton',
      'brton',
      ['uk_ton', 'LTON'],
      'mass',
      false,
      true,
      1016.046909
    ],
    ['inch', 'in', null, 'length', false, true, 0.0254],
    ['international acre', 'uk_acre', null, 'area', false, true, 4046.8564224],
    ['IT calorie', 'cal', null, 'energy', false, true, 4.1868],
    ['joule', 'J', null, 'energy', true, true, 1],
    ['katal', 'kat', null, 'catalytic_activity', true, false, 1],
    ['kelvin', 'K', ['kel'], 'temperature', true, true, 1],
    ['kilogram', 'kg', null, 'mass', true, true, 1],
    ['knot', 'kn', null, 'speed', false, true, 0.514444444444444],
    ['light-year', 'ly', null, 'length', false, true, 9460730472580800],
    ['litre', 'L', ['l', 'lt'], 'volume', false, true, 0.001],
    ['lumen', 'lm', null, 'luminous_flux', true, false, 1],
    ['lux', 'lx', null, 'illuminance', true, false, 1],
    ['maxwell', 'Mx', null, 'magnetic_flux', false, false, 1e-18],
    ['measurement ton', 'MTON', null, 'volume', false, true, 1.13267386368],
    [
      'meter per hour',
      'm/h',
      ['m/hr'],
      'speed',
      false,
      true,
      0.00027777777777778
    ],
    ['meter per second', 'm/s', ['m/sec'], 'speed', true, true, 1],
    ['meter per second squared', 'm?s??', null, 'acceleration', true, false, 1],
    ['parsec', 'pc', ['parsec'], 'length', false, true, 30856775814671900],
    [
      'meter squared per second',
      'm?/s',
      null,
      'kinematic_viscosity',
      true,
      false,
      1
    ],
    ['metre', 'm', null, 'length', true, true, 1],
    ['miles per hour', 'mph', null, 'speed', false, true, 0.44704],
    ['millimetre of mercury', 'mmHg', null, 'pressure', false, false, 133.322],
    ['minute', '?', null, 'angle', false, false, 0.000290888208665722],
    ['minute', 'min', ['mn'], 'time', false, true, 60],
    ['modern teaspoon', 'tspm', null, 'volume', false, true, 0.000005],
    ['mole', 'mol', null, 'amount_of_substance', true, false, 1],
    ['morgen', 'Morgen', null, 'area', false, true, 2500],
    ['n.u. of action', '?', null, 'action', false, false, 1.05457168181818e-34],
    ['n.u. of mass', 'm?', null, 'mass', false, false, 9.10938261616162e-31],
    ['n.u. of speed', 'c?', null, 'speed', false, false, 299792458],
    [
      'n.u. of time',
      '?/(me?c??)',
      null,
      'time',
      false,
      false,
      1.28808866778687e-21
    ],
    ['nautical mile', 'M', ['Nmi'], 'length', false, true, 1852],
    ['newton', 'N', null, 'force', true, true, 1],
    [
      'œrsted',
      'Oe ',
      null,
      'magnetic_field_intensity',
      false,
      false,
      79.5774715459477
    ],
    ['ohm', 'Ω', null, 'electric_resistance', true, false, 1],
    ['ounce mass', 'ozm', null, 'mass', false, true, 0.028349523125],
    ['pascal', 'Pa', null, 'pressure', true, false, 1],
    ['pascal second', 'Pa?s', null, 'dynamic_viscosity', true, false, 1],
    ['pferdestärke', 'PS', null, 'power', false, true, 735.49875],
    ['phot', 'ph', null, 'illuminance', false, false, 0.0001],
    [
      'pica (1/6 inch)',
      'pica',
      null,
      'length',
      false,
      true,
      0.00035277777777778
    ],
    [
      'pica (1/72 inch)',
      'Pica',
      ['Picapt'],
      'length',
      false,
      true,
      0.00423333333333333
    ],
    ['poise', 'P', null, 'dynamic_viscosity', false, false, 0.1],
    ['pond', 'pond', null, 'force', false, true, 0.00980665],
    ['pound force', 'lbf', null, 'force', false, true, 4.4482216152605],
    ['pound mass', 'lbm', null, 'mass', false, true, 0.45359237],
    ['quart', 'qt', null, 'volume', false, true, 0.000946352946],
    ['radian', 'rad', null, 'angle', true, false, 1],
    ['second', '?', null, 'angle', false, false, 0.00000484813681109536],
    ['second', 's', ['sec'], 'time', true, true, 1],
    [
      'short hundredweight',
      'cwt',
      ['shweight'],
      'mass',
      false,
      true,
      45.359237
    ],
    ['siemens', 'S', null, 'electrical_conductance', true, false, 1],
    ['sievert', 'Sv', null, 'equivalent_dose', true, false, 1],
    ['slug', 'sg', null, 'mass', false, true, 14.59390294],
    ['square ångström', 'ang2', ['ang^2'], 'area', false, true, 1e-20],
    ['square foot', 'ft2', ['ft^2'], 'area', false, true, 0.09290304],
    ['square inch', 'in2', ['in^2'], 'area', false, true, 0.00064516],
    [
      'square light-year',
      'ly2',
      ['ly^2'],
      'area',
      false,
      true,
      8.95054210748189e31
    ],
    ['square meter', 'm?', null, 'area', true, true, 1],
    ['square mile', 'mi2', ['mi^2'], 'area', false, true, 2589988.110336],
    ['square nautical mile', 'Nmi2', ['Nmi^2'], 'area', false, true, 3429904],
    [
      'square Pica',
      'Pica2',
      ['Picapt2', 'Pica^2', 'Picapt^2'],
      'area',
      false,
      true,
      0.00001792111111111
    ],
    ['square yard', 'yd2', ['yd^2'], 'area', false, true, 0.83612736],
    ['statute mile', 'mi', null, 'length', false, true, 1609.344],
    ['steradian', 'sr', null, 'solid_angle', true, false, 1],
    ['stilb', 'sb', null, 'luminance', false, false, 0.0001],
    ['stokes', 'St', null, 'kinematic_viscosity', false, false, 0.0001],
    ['stone', 'stone', null, 'mass', false, true, 6.35029318],
    ['tablespoon', 'tbs', null, 'volume', false, true, 0.0000147868],
    ['teaspoon', 'tsp', null, 'volume', false, true, 0.00000492892],
    ['tesla', 'T', null, 'magnetic_flux_density', true, true, 1],
    ['thermodynamic calorie', 'c', null, 'energy', false, true, 4.184],
    ['ton', 'ton', null, 'mass', false, true, 907.18474],
    ['tonne', 't', null, 'mass', false, false, 1000],
    ['U.K. pint', 'uk_pt', null, 'volume', false, true, 0.00056826125],
    ['U.S. bushel', 'bushel', null, 'volume', false, true, 0.03523907],
    ['U.S. oil barrel', 'barrel', null, 'volume', false, true, 0.158987295],
    ['U.S. pint', 'pt', ['us_pt'], 'volume', false, true, 0.000473176473],
    ['U.S. survey mile', 'survey_mi', null, 'length', false, true, 1609.347219],
    [
      'U.S. survey/statute acre',
      'us_acre',
      null,
      'area',
      false,
      true,
      4046.87261
    ],
    ['volt', 'V', null, 'voltage', true, false, 1],
    ['watt', 'W', null, 'power', true, true, 1],
    ['watt-hour', 'Wh', ['wh'], 'energy', false, true, 3600],
    ['weber', 'Wb', null, 'magnetic_flux', true, false, 1],
    ['yard', 'yd', null, 'length', false, true, 0.9144],
    ['year', 'yr', null, 'time', false, true, 31557600]
  ];

  // Binary prefixes
  // [Name, Prefix power of 2 value, Previx value, Abbreviation, Derived from]
  const binary_prefixes: Record<string, any[]> = {
    Yi: ['yobi', 80, 1208925819614629174706176, 'Yi', 'yotta'],
    Zi: ['zebi', 70, 1180591620717411303424, 'Zi', 'zetta'],
    Ei: ['exbi', 60, 1152921504606846976, 'Ei', 'exa'],
    Pi: ['pebi', 50, 1125899906842624, 'Pi', 'peta'],
    Ti: ['tebi', 40, 1099511627776, 'Ti', 'tera'],
    Gi: ['gibi', 30, 1073741824, 'Gi', 'giga'],
    Mi: ['mebi', 20, 1048576, 'Mi', 'mega'],
    ki: ['kibi', 10, 1024, 'ki', 'kilo']
  };

  // Unit prefixes
  // [Name, Multiplier, Abbreviation]
  const unit_prefixes: Record<string, any[]> = {
    Y: ['yotta', 1e24, 'Y'],
    Z: ['zetta', 1e21, 'Z'],
    E: ['exa', 1e18, 'E'],
    P: ['peta', 1e15, 'P'],
    T: ['tera', 1e12, 'T'],
    G: ['giga', 1e9, 'G'],
    M: ['mega', 1e6, 'M'],
    k: ['kilo', 1e3, 'k'],
    h: ['hecto', 1e2, 'h'],
    e: ['dekao', 1e1, 'e'],
    d: ['deci', 1e-1, 'd'],
    c: ['centi', 1e-2, 'c'],
    m: ['milli', 1e-3, 'm'],
    u: ['micro', 1e-6, 'u'],
    n: ['nano', 1e-9, 'n'],
    p: ['pico', 1e-12, 'p'],
    f: ['femto', 1e-15, 'f'],
    a: ['atto', 1e-18, 'a'],
    z: ['zepto', 1e-21, 'z'],
    y: ['yocto', 1e-24, 'y']
  };

  // Initialize units and multipliers
  let from: any = null;
  let to: any = null;
  let base_from_unit = from_unit;
  let base_to_unit = to_unit;
  let from_multiplier = 1;
  let to_multiplier = 1;
  let alt: any;

  // Lookup from and to units
  for (let i = 0; i < units.length; i++) {
    alt = units[i][2] === null ? [] : units[i][2];

    if (units[i][1] === base_from_unit || alt.indexOf(base_from_unit) >= 0) {
      from = units[i];
    }

    if (units[i][1] === base_to_unit || alt.indexOf(base_to_unit) >= 0) {
      to = units[i];
    }
  }

  // Lookup from prefix
  if (from === null) {
    const from_binary_prefix = binary_prefixes[from_unit.substring(0, 2)];
    let from_unit_prefix = unit_prefixes[from_unit.substring(0, 1)];

    // Handle dekao unit prefix (only unit prefix with two characters)
    if (from_unit.substring(0, 2) === 'da') {
      from_unit_prefix = ['dekao', 1e1, 'da'];
    }

    // Handle binary prefixes first (so that 'Yi' is processed before 'Y')
    if (from_binary_prefix) {
      from_multiplier = from_binary_prefix[2];
      base_from_unit = from_unit.substring(2);
    } else if (from_unit_prefix) {
      from_multiplier = from_unit_prefix[1];
      base_from_unit = from_unit.substring(from_unit_prefix[2].length);
    }

    // Lookup from unit
    for (let j = 0; j < units.length; j++) {
      alt = units[j][2] === null ? [] : units[j][2];

      if (units[j][1] === base_from_unit || alt.indexOf(base_from_unit) >= 0) {
        from = units[j];
      }
    }
  }

  // Lookup to prefix
  if (to === null) {
    const to_binary_prefix = binary_prefixes[to_unit.substring(0, 2)];
    let to_unit_prefix = unit_prefixes[to_unit.substring(0, 1)];

    // Handle dekao unit prefix (only unit prefix with two characters)
    if (to_unit.substring(0, 2) === 'da') {
      to_unit_prefix = ['dekao', 1e1, 'da'];
    }

    // Handle binary prefixes first (so that 'Yi' is processed before 'Y')
    if (to_binary_prefix) {
      to_multiplier = to_binary_prefix[2];
      base_to_unit = to_unit.substring(2);
    } else if (to_unit_prefix) {
      to_multiplier = to_unit_prefix[1];
      base_to_unit = to_unit.substring(to_unit_prefix[2].length);
    }

    // Lookup to unit
    for (let k = 0; k < units.length; k++) {
      alt = units[k][2] === null ? [] : units[k][2];

      if (units[k][1] === base_to_unit || alt.indexOf(base_to_unit) >= 0) {
        to = units[k];
      }
    }
  }

  // Return error if a unit does not exist
  if (from === null || to === null) {
    throw FormulaError.NA;
  }

  // Return error if units represent different quantities
  if (from[3] !== to[3]) {
    throw FormulaError.NA;
  }

  // Return converted number
  return (number * from[6] * from_multiplier) / (to[6] * to_multiplier);
});

regFunc('DEC2BIN', (number: EvalResult, places: EvalResult) => {
  number = getNumberOrThrow(number);
  places = getNumber(places);

  if (number < MIN_BIN || number > MAX_BIN) {
    throw FormulaError.NUM;
  }

  // if the number is negative, valid place values are ignored and it returns a 10-character binary number.
  if (number < 0) {
    return (
      '1' +
      TextFunctions.REPT('0', 9 - (512 + number).toString(2).length) +
      (512 + number).toString(2)
    );
  }

  let result = parseInt(number + '', 10).toString(2);
  if (places === undefined) {
    return result;
  } else {
    // if places is not an integer, it is truncated
    places = Math.trunc(places);
    if (places <= 0) {
      throw FormulaError.NUM;
    }
    if (places < result.length) throw FormulaError.NUM;
    return TextFunctions.REPT('0', places - result.length) + result;
  }
});

function DEC2HEX(number: number, places?: number) {
  if (number < -549755813888 || number > 549755813888) {
    throw FormulaError.NUM;
  }

  // if the number is negative, valid place values are ignored and it returns a 10-character binary number.
  if (number < 0) {
    return (1099511627776 + number).toString(16).toUpperCase();
  }

  let result = parseInt(number + '', 10).toString(16);

  if (places === undefined) {
    return result.toUpperCase();
  } else {
    // if places is not an integer, it is truncated
    places = Math.trunc(places);
    if (places <= 0) {
      throw FormulaError.NUM;
    }
    if (places < result.length) throw FormulaError.NUM;
    return (
      TextFunctions.REPT('0', places - result.length) + result.toUpperCase()
    );
  }
}

regFunc('DEC2HEX', (number: EvalResult, places: EvalResult) => {
  number = getNumberOrThrow(number);
  places = getNumber(places);
  return DEC2HEX(number, places);
});

function DEC2OCT(number: number, places?: number) {
  if (number < -536870912 || number > 536870912) {
    throw FormulaError.NUM;
  }

  // if the number is negative, valid place values are ignored and it returns a 10-character binary number.
  if (number < 0) {
    return (number + 1073741824).toString(8);
  }

  let result = parseInt(number + '', 10).toString(8);

  if (places === undefined) {
    return result.toUpperCase();
  } else {
    // if places is not an integer, it is truncated
    places = Math.trunc(places);
    if (places <= 0) {
      throw FormulaError.NUM;
    }
    if (places < result.length) throw FormulaError.NUM;
    return TextFunctions.REPT('0', places - result.length) + result;
  }
}

regFunc('DEC2OCT', (number: EvalResult, places: EvalResult) => {
  number = getNumberOrThrow(number);
  places = getNumber(places);
  return DEC2OCT(number, places);
});

regFunc('DELTA', (number1: EvalResult, number2: EvalResult) => {
  number1 = getNumberOrThrow(number1);
  number2 = getNumber(number2, 0);
  return number1 === number2 ? 1 : 0;
});

regFunc('ERF', (lowerLimit: EvalResult, upperLimit: EvalResult) => {
  lowerLimit = getNumberOrThrow(lowerLimit);
  upperLimit = getNumber(upperLimit, 0);
  // TODO: 还不支持 upperLimit
  return jStat.erf(lowerLimit);
});

regFunc('ERFC', (number: EvalResult) => {
  number = getNumberOrThrow(number);
  return jStat.erfc(number);
});

regFunc('GESTEP', (number: EvalResult, step: EvalResult) => {
  number = getNumberOrThrow(number);
  step = getNumber(step, 0)!;
  return number >= step ? 1 : 0;
});

regFunc('HEX2BIN', (number: EvalResult, places: EvalResult) => {
  number = getStringOrThrow(number);
  places = getNumber(places);

  if (number.length > 10 || !/^[0-9a-fA-F]*$/.test(number)) {
    throw FormulaError.NUM;
  }
  // to check if the number is negative
  let ifNegative =
    number.length === 10 && number.substr(0, 1).toLowerCase() === 'f';
  // convert HEX to DEC
  let toDecimal = ifNegative
    ? parseInt(number, 16) - 1099511627776
    : parseInt(number, 16);
  // if number is lower than -512 or grater than 511, return error
  if (toDecimal < MIN_BIN || toDecimal > MAX_BIN) {
    throw FormulaError.NUM;
  }
  // if the number is negative, valid place values are ignored and it returns a 10-character binary number.
  if (ifNegative) {
    return (
      '1' +
      TextFunctions.REPT('0', 9 - (toDecimal + 512).toString(2).length) +
      (toDecimal + 512).toString(2)
    );
  }
  // convert decimal to binary
  let toBinary = toDecimal.toString(2);

  if (places == null) {
    return toBinary;
  } else {
    // if places is not an integer, it is truncated
    places = Math.trunc(places);
    if (places <= 0 || places < toBinary.length) {
      throw FormulaError.NUM;
    }
    return TextFunctions.REPT('0', places - toBinary.length) + toBinary;
  }
});

function HEX2DEC(number: string) {
  if (number.length > 10 || !/^[0-9a-fA-F]*$/.test(number)) {
    throw FormulaError.NUM;
  }
  let result = parseInt(number, 16);
  return result >= 549755813888 ? result - 1099511627776 : result;
}

regFunc('HEX2DEC', (number: EvalResult) => {
  number = getStringOrThrow(number);
  return HEX2DEC(number);
});

regFunc('HEX2OCT', (number: EvalResult, places: EvalResult) => {
  number = getStringOrThrow(number);
  places = getNumber(places);
  if (number.length > 10 || !/^[0-9a-fA-F]*$/.test(number)) {
    throw FormulaError.NUM;
  }
  // convert HEX to DEC
  let toDecimal = HEX2DEC(number);
  if (toDecimal > MAX_OCT || toDecimal < MIN_OCT) {
    throw FormulaError.NUM;
  }
  return DEC2OCT(toDecimal, places);
});

function IMABS(iNumber: string | number) {
  const {real, im} = parseIM(iNumber);
  return Math.sqrt(Math.pow(real, 2) + Math.pow(im, 2));
}

regFunc('IMABS', IMABS);

regFunc('IMAGINARY', (iNumber: EvalResult) => {
  return parseIM(iNumber).im;
});

function IMARGUMENT(iNumber: string) {
  const {real, im} = parseIM(iNumber);
  // x + yi => x cannot be 0, since theta = tan-1(y / x)
  if (real === 0 && im === 0) {
    throw FormulaError.DIV0;
  }
  // return PI/2 if x is equal to 0 and y is positive
  if (real === 0 && im > 0) {
    return Math.PI / 2;
  }
  // while return -PI/2 if x is equal to 0 and y is negative
  if (real === 0 && im < 0) {
    return -Math.PI / 2;
  }
  // return -PI if x is negative and y is equal to 0
  if (real < 0 && im === 0) {
    return Math.PI;
  }
  // return 0 if x is positive and y is equal to 0
  if (real > 0 && im === 0) {
    return 0;
  }
  // return argument of iNumber
  if (real > 0) {
    return Math.atan(im / real);
  } else if (real < 0 && im > 0) {
    return Math.atan(im / real) + Math.PI;
  } else {
    return Math.atan(im / real) - Math.PI;
  }
}

regFunc('IMARGUMENT', (iNumber: EvalResult) => {
  return IMARGUMENT(getStringOrThrow(iNumber));
});

regFunc('IMCONJUGATE', (iNumber: EvalResult) => {
  const {real, im, unit} = parseIM(iNumber);
  return COMPLEX(real, -im, unit);
});

function IMCOS(iNumber: string) {
  const {real, im, unit} = parseIM(iNumber);
  let realInput = (Math.cos(real) * (Math.exp(im) + Math.exp(-im))) / 2;
  let imaginaryInput = (-Math.sin(real) * (Math.exp(im) - Math.exp(-im))) / 2;

  return COMPLEX(realInput, imaginaryInput, unit);
}

regFunc('IMCOS', IMCOS);

function IMCOSH(iNumber: string) {
  const {real, im, unit} = parseIM(iNumber);
  let realInput = (Math.cos(im) * (Math.exp(real) + Math.exp(-real))) / 2;
  let imaginaryInput = (-Math.sin(im) * (Math.exp(real) - Math.exp(-real))) / 2;
  return COMPLEX(realInput, -imaginaryInput, unit);
}

regFunc('IMCOSH', IMCOSH);

function IMSIN(iNumber: string) {
  const {real, im, unit} = parseIM(iNumber);
  let realInput = (Math.sin(real) * (Math.exp(im) + Math.exp(-im))) / 2;
  let imaginaryInput = (Math.cos(real) * (Math.exp(im) - Math.exp(-im))) / 2;
  return COMPLEX(realInput, imaginaryInput, unit);
}

regFunc('IMSIN', IMSIN);

regFunc('IMCOT', (iNumber: EvalResult) => {
  iNumber = getStringOrThrow(iNumber);
  let real = IMCOS(iNumber);
  let imaginary = IMSIN(iNumber);
  return IMDIV(real, imaginary);
});

function IMDIV(iNumber1: string | number, iNumber2: string | number) {
  const res1 = parseIM(iNumber1);
  const a = res1.real,
    b = res1.im,
    unit1 = res1.unit;

  const res2 = parseIM(iNumber2);
  const c = res2.real,
    d = res2.im,
    unit2 = res2.unit;

  if ((c === 0 && d === 0) || unit1 !== unit2) {
    throw FormulaError.NUM;
  }
  let unit = unit1;

  let denominator = Math.pow(c, 2) + Math.pow(d, 2);
  return COMPLEX(
    (a * c + b * d) / denominator,
    (b * c - a * d) / denominator,
    unit
  );
}
regFunc('IMDIV', IMDIV);

regFunc('IMCSC', (iNumber: EvalResult) => {
  iNumber = getStringOrThrow(iNumber);
  return IMDIV('1', IMSIN(iNumber));
});

regFunc('IMCSCH', (iNumber: EvalResult) => {
  iNumber = getStringOrThrow(iNumber);
  return IMDIV('1', IMSINH(iNumber));
});

function IMSINH(iNumber: string | number) {
  const {real, im, unit} = parseIM(iNumber);
  let realInput = (Math.cos(im) * (Math.exp(real) - Math.exp(-real))) / 2;
  let imaginaryInput = (Math.sin(im) * (Math.exp(real) + Math.exp(-real))) / 2;
  return COMPLEX(realInput, imaginaryInput, unit);
}

regFunc('IMSINH', IMSINH);

regFunc('IMEXP', (iNumber: EvalResult) => {
  const {real, im, unit} = parseIM(iNumber);
  // return exponential of complex number
  let e = Math.exp(real);
  return COMPLEX(e * Math.cos(im), e * Math.sin(im), unit);
});

regFunc('IMLN', (iNumber: EvalResult) => {
  const {real, im, unit} = parseIM(iNumber);
  return COMPLEX(
    Math.log(Math.sqrt(Math.pow(real, 2) + Math.pow(im, 2))),
    Math.atan(im / real),
    unit
  );
});

regFunc('IMLOG10', (iNumber: EvalResult) => {
  const {real, im, unit} = parseIM(iNumber);
  let realInput =
    Math.log(Math.sqrt(Math.pow(real, 2) + Math.pow(im, 2))) / Math.log(10);
  let imaginaryInput = Math.atan(im / real) / Math.log(10);
  return COMPLEX(realInput, imaginaryInput, unit);
});

regFunc('IMLOG2', (iNumber: EvalResult) => {
  const {real, im, unit} = parseIM(iNumber);
  let realInput =
    Math.log(Math.sqrt(Math.pow(real, 2) + Math.pow(im, 2))) / Math.log(2);
  let imaginaryInput = Math.atan(im / real) / Math.log(2);
  return COMPLEX(realInput, imaginaryInput, unit);
});

regFunc('IMPOWER', (iNumber: EvalResult, number: EvalResult) => {
  let {unit} = parseIM(iNumber);
  number = getNumberOrThrow(number);

  // calculate power of modules
  let p = Math.pow(IMABS(iNumber as string), number);
  // calculate argument
  let t = IMARGUMENT(iNumber as string);

  let real = p * Math.cos(number * t);
  let imaginary = p * Math.sin(number * t);
  return COMPLEX(real, imaginary, unit);
});

regFunc('IMPRODUCT', (...args: EvalResult[]) => {
  let result: string | number = '0';
  let i = 0;
  loopArgs(args, item => {
    if (i === 0) {
      result = item as string;
      parseIM(result);
    } else {
      const res1 = parseIM(result as string);
      const a = res1.real,
        b = res1.im,
        unit1 = res1.unit;
      const res2 = parseIM(item);
      const c = res2.real,
        d = res2.im,
        unit2 = res2.unit;
      if (unit1 !== unit2) {
        throw FormulaError.VALUE;
      }
      result = COMPLEX(a * c - b * d, a * d + b * c);
    }
    i++;
  });
  return result;
});

regFunc('IMREAL', (iNumber: EvalResult) => {
  return parseIM(iNumber).real;
});

regFunc('IMSEC', (iNumber: EvalResult) => {
  iNumber = getStringOrThrow(iNumber);
  return IMDIV('1', IMCOS(iNumber));
});

regFunc('IMSECH', (iNumber: EvalResult) => {
  iNumber = getStringOrThrow(iNumber);
  return IMDIV('1', IMCOSH(iNumber));
});

regFunc('IMSQRT', (iNumber: EvalResult) => {
  const {unit} = parseIM(iNumber);
  // calculate the power of modulus
  let power = Math.sqrt(IMABS(iNumber as string));
  // calculate argument
  let argument = IMARGUMENT(iNumber as string);
  return COMPLEX(
    power * Math.cos(argument / 2),
    power * Math.sin(argument / 2),
    unit
  );
});

regFunc('IMSUB', (iNumber1: EvalResult, iNumber2: EvalResult) => {
  const res1 = parseIM(iNumber1);
  const a = res1.real,
    b = res1.im,
    unit1 = res1.unit;
  const res2 = parseIM(iNumber2);
  const c = res2.real,
    d = res2.im,
    unit2 = res2.unit;
  if (unit1 !== unit2) {
    throw FormulaError.VALUE;
  }
  return COMPLEX(a - c, b - d, unit1);
});

regFunc('IMSUM', (...args: EvalResult[]) => {
  let result: string | number = '0';
  loopArgs(args, item => {
    const res1 = parseIM(result);
    const a = res1.real,
      b = res1.im,
      unit1 = res1.unit;
    const res2 = parseIM(item);
    const c = res2.real,
      d = res2.im,
      unit2 = res2.unit;
    if (unit1 !== unit2) {
      throw FormulaError.VALUE;
    }
    result = COMPLEX(a + c, b + d, unit1);
  });
  return result;
});

regFunc('IMTAN', (iNumber: EvalResult) => {
  iNumber = getStringOrThrow(iNumber);
  return IMDIV(IMSIN(iNumber), IMCOS(iNumber));
});

regFunc('OCT2BIN', (number: EvalResult, places: EvalResult) => {
  number = getStringOrThrow(number);
  places = getNumber(places);
  // 1. If number's length larger than 10, returns #NUM!
  if (number.length > 10) {
    throw FormulaError.NUM;
  }
  // In microsoft Excel, if places is larger than 10, it will return #NUM!
  if (places && places > 10) {
    throw FormulaError.NUM;
  }

  // 2. office: If places is negative, OCT2BIN returns the #NUM! error value.
  if (places !== undefined && places < 0) {
    throw FormulaError.NUM;
  }
  // if places is not an integer, it is truncated
  // office: If places is not an integer, it is truncated.
  if (places !== undefined) {
    places = Math.trunc(places);
  }

  // to check if the Oct number is negative
  let isNegative = number.length === 10 && number.substring(0, 1) === '7';
  // convert OCT to DEC
  let toDecimal = OCT2DEC(number);
  // 2.
  // office: If number is negative, it cannot be less than 7777777000, and if number is positive, it cannot be greater than 777.
  // MiN_BIN = -512, MAX_BIN = 511
  if (toDecimal < MIN_BIN || toDecimal > MAX_BIN) {
    throw FormulaError.NUM;
  }
  // if number is negative, ignores places and return a 10-character binary number
  // office: If number is negative, OCT2BIN ignores places and returns a 10-character binary number.
  if (isNegative) {
    return (
      '1' +
      TextFunctions.REPT('0', 9 - (512 + toDecimal).toString(2).length) +
      (512 + toDecimal).toString(2)
    );
  }

  // convert DEC to BIN
  let result = toDecimal.toString(2);

  //if (places === null) {
  if (places === 0) {
    return result;
  }

  // office: If OCT2BIN requires more than places characters, it returns the #NUM! error value.
  if (places !== undefined && places < result.length) {
    throw FormulaError.NUM;
  }

  if (places === undefined) {
    return result;
  }

  return TextFunctions.REPT('0', places - result.length) + result;
});

function OCT2DEC(number: string) {
  if (number.length > 10) {
    throw FormulaError.NUM;
  }

  // If number is not a valid octal number, OCT2DEC returns the #NUM! error value.
  for (const n of number) {
    if (n < '0' || n > '7') {
      throw FormulaError.NUM;
    }
  }
  // convert to DEC
  let result = parseInt(number, 8);
  return result >= 536870912 ? result - 1073741824 : result;
  //  536870912(4000000000) : -536870912;   1073741823(7777777777) : -1
}

regFunc('OCT2DEC', (number: EvalResult) => {
  number = getStringOrThrow(number);
  return OCT2DEC(number);
});

regFunc('OCT2HEX', (number: EvalResult, places: EvalResult) => {
  number = getStringOrThrow(number);
  places = getNumber(places);
  if (number.length > 10) {
    throw FormulaError.NUM;
  }
  // office: If number is not a valid octal number, OCT2DEC returns the #NUM! error value.
  for (const n of number) {
    if (n < '0' || n > '7') {
      throw FormulaError.NUM;
    }
  }
  // if places is not an integer, it is truncated
  if (places !== undefined) {
    places = Math.trunc(places);
  }

  // office: If places is negative, OCT2HEX returns the #NUM! error value.
  if (places !== undefined && (places < 0 || places > 10)) {
    throw FormulaError.NUM;
  }

  // convert OCT to DEC
  let toDecimal = OCT2DEC(number);

  // convert DEC to HEX
  // let toHex = EngineeringFunctions.DEC2HEX(toDecimal, places);
  let toHex = DEC2HEX(toDecimal);
  //if (places === null) {
  if (places === 0) {
    return toHex;
  }
  if (places !== undefined && places < toHex.length) {
    throw FormulaError.NUM;
  } else {
    if (places === undefined) {
      return toHex;
    }
    return TextFunctions.REPT('0', places - toHex.length) + toHex;
  }
});
