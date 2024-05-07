/**
 * 文本相关的函数，主要参考 fast-formula-parser 里的实现
 * https://github.com/LesterLyu/fast-formula-parser
 */
// @ts-ignore 这个没类型定义
import numfmt from 'numfmt';

import FormulaError from '../FormulaError';
import {EvalResult} from '../eval/EvalResult';
import {regFunc} from './functions';
import {bahttext} from './util/bahttext';
import {full2half, half2full} from './util/convertWidth';
import {getFirstStrings} from './util/getFirstStrings';
import {getNumber, getNumberOrThrow} from './util/getNumber';
import {getString, getStringOrThrow} from './util/getString';
import {getStrings} from './util/getStrings';
import {getBoolean, getBooleanOrThrow} from './util/getBoolean';
import {WildCard} from './util/wildCard';
import {flattenArgs} from './util/flattenArgs';

regFunc('ASC', (arg: EvalResult) => {
  const text = getStringOrThrow(arg);
  return full2half(text);
});

regFunc('BAHTTEXT', (arg: EvalResult) => {
  const number = getNumberOrThrow(arg);
  if (number < 0 || number > 999999999.99) {
    throw FormulaError.VALUE;
  }
  return bahttext(number);
});

regFunc('CHAR', (arg: EvalResult) => {
  const number = getNumberOrThrow(arg);
  if (number < 1 || number > 255) {
    throw FormulaError.VALUE;
  }
  return String.fromCharCode(number);
});

regFunc('CLEAN', (arg: EvalResult) => {
  const text = getStringOrThrow(arg);
  return text.replace(/[\x00-\x1F]/g, '');
});

regFunc('CODE', (arg: EvalResult) => {
  const text = getStringOrThrow(arg);
  if (text.length === 0) {
    throw FormulaError.VALUE;
  }
  return text.charCodeAt(0);
});

regFunc('CONCAT', (...args: EvalResult[]) => {
  const strings = getStrings(args);
  return strings.join('');
});

regFunc('CONCATENATE', (...args: EvalResult[]) => {
  const strings = getFirstStrings(args);
  return strings.join('');
});

regFunc('DBCS', (arg: EvalResult) => {
  const text = getStringOrThrow(arg);
  return half2full(text);
});

regFunc('DOLLAR', (...arg: EvalResult[]) => {
  const number = getNumberOrThrow(arg[0]);
  const decimals = getNumber(arg[1], 2);
  const decimalString = Array(decimals).fill('0').join('');
  // 还需要支持 locale
  const formatter = numfmt(
    `$#,##0.${decimalString}_);($#,##0.${decimalString})`
  );
  return formatter(number).trim();
});

regFunc('EXACT', (arg1: EvalResult, arg2: EvalResult) => {
  const text1 = getStringOrThrow(arg1);
  const text2 = getStringOrThrow(arg2);
  return text1 === text2;
});

regFunc('ENCODEURL', (arg: EvalResult) => {
  const text = getStringOrThrow(arg);
  return encodeURIComponent(text);
});

function find(...arg: EvalResult[]) {
  const findText = getStringOrThrow(arg[0]);
  const withinText = getStringOrThrow(arg[1]);
  const startNum = getNumber(arg[2], 1)!;
  if (startNum < 1 || startNum > withinText.length) {
    throw FormulaError.VALUE;
  }
  const index = withinText.indexOf(findText, startNum - 1);
  if (index === -1) {
    throw FormulaError.VALUE;
  }
  return index + 1;
}

regFunc('FIND', find);

regFunc('FINDB', find);

regFunc('FIXED', (...arg: EvalResult[]) => {
  const number = getNumberOrThrow(arg[0]);
  const decimals = getNumber(arg[1], 2);
  const noCommas = getBoolean(arg[2], false);
  const decimalString = Array(decimals).fill('0').join('');
  const comma = noCommas ? '' : '#,';
  const formatter = numfmt(
    `${comma}##0.${decimalString}_);(${comma}##0.${decimalString})`
  );
  return formatter(number).trim();
});

function left(...arg: EvalResult[]) {
  const text = getStringOrThrow(arg[0]);
  const numChars = getNumber(arg[1], 1)!;
  if (numChars < 0) {
    throw FormulaError.VALUE;
  }
  if (numChars > text.length) {
    return text;
  }
  return text.slice(0, numChars);
}

regFunc('LEFT', left);
regFunc('LEFTB', left);

regFunc('LEN', (arg: EvalResult) => {
  const text = getStringOrThrow(arg);
  return text.length;
});

regFunc('LENB', (arg: EvalResult) => {
  const text = getStringOrThrow(arg);
  return text.length;
});

regFunc('LOWER', (arg: EvalResult) => {
  const text = getStringOrThrow(arg);
  return text.toLowerCase();
});

function mid(...arg: EvalResult[]) {
  const text = getStringOrThrow(arg[0]);
  const startNum = getNumberOrThrow(arg[1]);
  const numChars = getNumberOrThrow(arg[2]);
  if (startNum > text.length) {
    return '';
  }
  if (startNum < 1 || numChars < 1) {
    throw FormulaError.VALUE;
  }
  return text.slice(startNum - 1, startNum + numChars - 1);
}

regFunc('MID', mid);

regFunc('MIDB', mid);

regFunc('NUMBERVALUE', (...arg: EvalResult[]) => {
  const text = getStringOrThrow(arg[0]);
  let decimalSeparator = getString(arg[1], '.')!;
  let groupSeparator = getString(arg[2], ',')!;

  if (text.length === 0) return 0;
  if (decimalSeparator.length === 0 || groupSeparator.length === 0)
    throw FormulaError.VALUE;
  decimalSeparator = decimalSeparator[0];
  groupSeparator = groupSeparator[0];
  if (
    decimalSeparator === groupSeparator ||
    text.indexOf(decimalSeparator) < text.lastIndexOf(groupSeparator)
  )
    throw FormulaError.VALUE;

  const res = text
    .replace(groupSeparator, '')
    .replace(decimalSeparator, '.')
    // remove chars that not related to number
    .replace(/[^\-0-9.%()]/g, '')
    .match(/([(-]*)([0-9]*[.]*[0-9]+)([)]?)([%]*)/);
  if (!res) throw FormulaError.VALUE;
  // ["-123456.78%%", "(-", "123456.78", ")", "%%"]
  const leftParenOrMinus = res[1].length,
    rightParen = res[3].length,
    percent = res[4].length;
  let number = Number(res[2]);
  if (
    leftParenOrMinus > 1 ||
    (leftParenOrMinus && !rightParen) ||
    (!leftParenOrMinus && rightParen) ||
    isNaN(number)
  )
    throw FormulaError.VALUE;
  number = number / 100 ** percent;
  return leftParenOrMinus ? -number : number;
});

regFunc('PROPER', (arg: EvalResult) => {
  let text = getString(arg, '')!;
  text = text.toLowerCase();
  text = text.charAt(0).toUpperCase() + text.slice(1);
  return text.replace(/(?:[^a-zA-Z])([a-zA-Z])/g, (letter: string) =>
    letter.toUpperCase()
  );
});

function replace(...arg: EvalResult[]) {
  const oldText = getStringOrThrow(arg[0]);
  const startNum = getNumberOrThrow(arg[1]);
  const numChars = getNumberOrThrow(arg[2]);
  const newText = getStringOrThrow(arg[3]);
  if (startNum < 1 || numChars < 0) {
    throw FormulaError.VALUE;
  }
  let arr = oldText.split('');
  arr.splice(startNum - 1, numChars, newText);

  return arr.join('');
}

regFunc('REPLACE', replace);

regFunc('REPLACEB', replace);

regFunc('REPT', (arg1: EvalResult, arg2: EvalResult) => {
  const text = getStringOrThrow(arg1);
  const number = getNumberOrThrow(arg2);
  if (number < 0) {
    throw FormulaError.VALUE;
  }
  return Array(number).fill(text).join('');
});

function right(...arg: EvalResult[]) {
  const text = getStringOrThrow(arg[0]);
  const numChars = getNumber(arg[1], 1)!;
  if (numChars < 0) {
    throw FormulaError.VALUE;
  }
  if (numChars > text.length) {
    return text;
  }
  return text.slice(-numChars);
}

regFunc('RIGHT', right);
regFunc('RIGHTB', right);

function search(...arg: EvalResult[]) {
  const findText = getStringOrThrow(arg[0]);
  const withinText = getStringOrThrow(arg[1]);
  const startNum = getNumber(arg[2], 1)!;
  if (startNum < 1 || startNum > withinText.length) throw FormulaError.VALUE;

  // transform to js regex expression
  let findTextRegex = WildCard.isWildCard(findText)
    ? WildCard.toRegex(findText, 'i')
    : findText;
  const res = withinText.slice(startNum - 1).search(findTextRegex);
  if (res === -1) throw FormulaError.VALUE;
  return res + startNum;
}

regFunc('SEARCH', search);

regFunc('SEARCHB', search);

regFunc(
  'SUBSTITUTE',
  function SUBSTITUTE(
    text: string,
    old_text: string,
    new_text: string,
    instance_num: number
  ) {
    if (arguments.length < 3) {
      throw FormulaError.NA;
    }

    if (!text || !old_text) {
      return text;
    } else if (instance_num === undefined) {
      return getString(text)!.split(old_text).join(new_text);
    } else {
      text = getStringOrThrow(text);
      old_text = getStringOrThrow(old_text);
      new_text = getStringOrThrow(new_text);
      instance_num = Math.floor(Number(instance_num));

      if (Number.isNaN(instance_num) || instance_num <= 0) {
        throw FormulaError.VALUE;
      }

      let index = 0;
      let i = 0;

      while (index > -1 && text.indexOf(old_text, index) > -1) {
        index = text.indexOf(old_text, index + 1);
        i++;

        if (index > -1 && i === instance_num) {
          return (
            text.substring(0, index) +
            new_text +
            text.substring(index + old_text.length)
          );
        }
      }

      return text;
    }
  }
);

// TODO: 目前从 cell 里拿到的肯定都是字符串，后续需要区分一下
regFunc('T', (arg: EvalResult) => {
  if (typeof arg === 'string') {
    return arg;
  }
  return '';
});

regFunc('TEXT', (arg1: EvalResult, arg2: EvalResult) => {
  const value = getNumberOrThrow(arg1);
  const formatText = getStringOrThrow(arg2);
  try {
    return numfmt(formatText)(value);
  } catch (e) {
    throw FormulaError.VALUE;
  }
});

regFunc('TRIM', (arg: EvalResult) => {
  const text = getStringOrThrow(arg);
  return text.trim();
});

regFunc(
  'TEXTJOIN',
  function JOIN(
    delimiter: EvalResult,
    ignore_empty: boolean,
    ...args: EvalResult[]
  ) {
    let delimiterStr = getString(delimiter);
    ignore_empty = getBooleanOrThrow(ignore_empty);

    if (arguments.length < 3) {
      throw FormulaError.NA;
    }

    delimiterStr =
      delimiterStr !== null && delimiterStr !== undefined ? delimiterStr : '';

    let flatArgs = getStrings(args);
    let textToJoin = ignore_empty ? flatArgs.filter(text => text) : flatArgs;

    if (Array.isArray(delimiter)) {
      const delimiterArray = getStrings(delimiter);

      let chunks = textToJoin.map(item => [item]);
      let index = 0;

      for (let i = 0; i < chunks.length - 1; i++) {
        chunks[i].push(delimiterArray[index]);
        index++;

        if (index === delimiterArray.length) {
          index = 0;
        }
      }

      const textToJoinResult = flattenArgs(chunks);

      return textToJoinResult.join('');
    }

    return textToJoin.join(delimiterStr);
  }
);

regFunc('UNICHAR', (arg: EvalResult) => {
  const number = getNumberOrThrow(arg);
  if (number < 1 || number > 1114111) {
    throw FormulaError.VALUE;
  }
  return String.fromCodePoint(number);
});

regFunc('UNICODE', (arg: EvalResult) => {
  const text = getStringOrThrow(arg);
  if (text.length === 0) {
    throw FormulaError.VALUE;
  }
  return text.charCodeAt(0);
});

regFunc('UPPER', (arg: EvalResult) => {
  const text = getStringOrThrow(arg);
  return text.toUpperCase();
});

regFunc('HYPERLINK', (arg1: EvalResult, arg2: EvalResult) => {
  const text = getStringOrThrow(arg1);
  const link = getStringOrThrow(arg2);
  return {
    type: 'Hyperlink',
    text,
    link
  };
});

regFunc('VALUE', (arg: EvalResult) => {
  let text = getStringOrThrow(arg);

  const isPercent = /(%)$/.test(text) || /^(%)/.test(text);
  text = text.replace(/^[^0-9-]{0,3}/, '');
  text = text.replace(/[^0-9]{0,3}$/, '');
  text = text.replace(/[ ,]/g, '');

  if (text === '') {
    return 0;
  }

  let output = Number(text);

  if (isNaN(output)) {
    throw FormulaError.VALUE;
  }

  output = output || 0;

  if (isPercent) {
    output = output * 0.01;
  }

  return output;
});
