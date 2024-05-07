/**
 * 来自 fast-formula-parser
 */

import FormulaError from '../FormulaError';
import {EvalResult, isErrorValue} from '../eval/EvalResult';
import {regFunc} from './functions';
import {flattenArgs} from './util/flattenArgs';
import {get2DArray} from './util/get2DArrayOrThrow';
import {getArray} from './util/getArray';
import {getBoolean, getBooleanWithDefault} from './util/getBoolean';
import {getNumberOrThrow, getNumberWithDefault} from './util/getNumber';
import {getNumbers} from './util/getNumbers';
import {
  getNumber2DArray,
  getNumber2DArrayOrThrow
} from './util/getNumbersWithUndefined';
import {getStringOrThrow, getStringWithDefault} from './util/getString';
import {loopArgs} from './util/loopArgs';
import {WildCard} from './util/wildCard';

function columnNumberToName(number: number) {
  let dividend = number;
  let name = '';
  let modulo = 0;

  while (dividend > 0) {
    modulo = (dividend - 1) % 26;
    name = String.fromCharCode('A'.charCodeAt(0) + modulo) + name;
    dividend = Math.floor((dividend - modulo) / 26);
  }

  return name;
}

regFunc(
  'ADDRESS',
  (
    rowNumber: EvalResult,
    columnNumber: EvalResult,
    absNum: EvalResult,
    a1: EvalResult,
    sheetText: EvalResult
  ) => {
    rowNumber = getNumberOrThrow(rowNumber);
    columnNumber = getNumberOrThrow(columnNumber);
    absNum = getNumberWithDefault(absNum, 1);
    a1 = getBooleanWithDefault(a1, true);
    sheetText = getStringWithDefault(sheetText, '');

    if (rowNumber < 1 || columnNumber < 1 || absNum < 1 || absNum > 4)
      throw FormulaError.VALUE;

    let result = '';
    if (sheetText.length > 0) {
      if (/[^A-Za-z_.\d\u007F-\uFFFF]/.test(sheetText)) {
        result += `'${sheetText}'!`;
      } else {
        result += sheetText + '!';
      }
    }
    if (a1) {
      // A1 style
      result += absNum === 1 || absNum === 3 ? '$' : '';
      result += columnNumberToName(columnNumber);
      result += absNum === 1 || absNum === 2 ? '$' : '';
      result += rowNumber;
    } else {
      // R1C1 style
      result += 'R';
      result += absNum === 4 || absNum === 3 ? `[${rowNumber}]` : rowNumber;
      result += 'C';
      result +=
        absNum === 4 || absNum === 2 ? `[${columnNumber}]` : columnNumber;
    }
    return result;
  }
);

regFunc(
  'LOOKUP',
  (lookupValue: EvalResult, lookupArray: any, resultArray: any) => {
    lookupArray = getArray(lookupArray);
    resultArray = resultArray ? getArray(resultArray) : lookupArray;

    const isNumberLookup = typeof lookupValue === 'number';
    let result = 0;

    for (let i = 0; i < lookupArray.length; i++) {
      if (lookupArray[i] === lookupValue) {
        return resultArray[i];
      } else if (
        (isNumberLookup && lookupArray[i] <= lookupValue) ||
        (typeof lookupArray[i] === 'string' &&
          lookupArray[i].localeCompare(lookupValue) < 0)
      ) {
        result = resultArray[i];
      } else if (isNumberLookup && lookupArray[i] > lookupValue) {
        return result;
      }
    }

    return result;
  }
);

regFunc(
  'HLOOKUP',
  (
    lookupValue: any, // 目前这两个参数可能有很多类型，后面再优化
    tableArray: any,
    rowIndexNum: EvalResult,
    rangeLookup: EvalResult
  ) => {
    tableArray = get2DArray(tableArray);
    if (!Array.isArray(tableArray)) {
      throw FormulaError.NA;
    }
    rowIndexNum = getNumberOrThrow(rowIndexNum);
    rangeLookup = getBooleanWithDefault(rangeLookup, true);

    // check if rowIndexNum out of bound
    if (rowIndexNum < 1) throw FormulaError.VALUE;
    if (tableArray[rowIndexNum - 1] === undefined) {
      throw FormulaError.REF;
    }

    const lookupType = typeof lookupValue; // 'number', 'string', 'boolean'

    // approximate lookup (assume the array is sorted)
    if (rangeLookup) {
      let prevValue =
        lookupType === typeof tableArray[0][0] ? tableArray[0][0] : null;
      for (let i = 1; i < tableArray[0].length; i++) {
        const currValue = tableArray[0][i];
        const type = typeof currValue;
        // skip the value if type does not match
        if (type !== lookupType) continue;
        // if the previous two values are greater than lookup value, throw #N/A
        if (prevValue > lookupValue && currValue > lookupValue) {
          throw FormulaError.NA;
        }
        if (currValue === lookupValue) return tableArray[rowIndexNum - 1][i];
        // if previous value <= lookup value and current value > lookup value
        if (
          prevValue != null &&
          currValue > lookupValue &&
          prevValue <= lookupValue
        ) {
          return tableArray[rowIndexNum - 1][i - 1];
        }
        prevValue = currValue;
      }
      if (prevValue == null) {
        throw FormulaError.NA;
      }
      if (tableArray[0].length === 1) {
        return tableArray[rowIndexNum - 1][0];
      }
      return prevValue;
    }
    // exact lookup with wildcard support
    else {
      let index = -1;
      if (WildCard.isWildCard(lookupValue)) {
        index = tableArray[0].findIndex((item: any) => {
          return WildCard.toRegex(lookupValue, 'i').test(item);
        });
      } else {
        index = tableArray[0].findIndex((item: any) => {
          return item === lookupValue;
        });
      }
      // the exact match is not found
      if (index === -1) throw FormulaError.NA;
      return tableArray[rowIndexNum - 1][index];
    }
  }
);

// 这个函数实现主要来自 formulajs
regFunc(
  'MATCH',
  (lookupValue: any, lookupArray: any, matchType: EvalResult) => {
    lookupArray = getArray(lookupArray);
    if (!Array.isArray(lookupArray)) {
      throw FormulaError.NA;
    }
    matchType = getNumberWithDefault(matchType, 1);

    if (matchType !== -1 && matchType !== 0 && matchType !== 1) {
      throw FormulaError.NA;
    }

    let index;
    let indexValue;

    for (let idx = 0; idx < lookupArray.length; idx++) {
      if (matchType === 1) {
        if (lookupArray[idx] === lookupValue) {
          return idx + 1;
        } else if (lookupArray[idx] < lookupValue) {
          if (!indexValue) {
            index = idx + 1;
            indexValue = lookupArray[idx];
          } else if (lookupArray[idx] > indexValue) {
            index = idx + 1;
            indexValue = lookupArray[idx];
          }
        }
      } else if (matchType === 0) {
        if (
          typeof lookupValue === 'string' &&
          typeof lookupArray[idx] === 'string'
        ) {
          const lookupValueStr = lookupValue
            .toLowerCase()
            .replace(/\?/g, '.')
            .replace(/\*/g, '.*')
            .replace(/\\/g, '\\\\')
            .replace(/~/g, '\\')
            .replace(/\+/g, '\\+')
            .replace(/\(/g, '\\(')
            .replace(/\)/g, '\\)')
            .replace(/\[/g, '\\[')
            .replace(/\]/g, '\\]');

          const regex = new RegExp('^' + lookupValueStr + '$');

          if (regex.test(lookupArray[idx].toLowerCase())) {
            return idx + 1;
          }
        } else {
          if (lookupArray[idx] === lookupValue) {
            return idx + 1;
          }
        }
      } else if (matchType === -1) {
        if (lookupArray[idx] === lookupValue) {
          return idx + 1;
        } else if (lookupArray[idx] > lookupValue) {
          if (!indexValue) {
            index = idx + 1;
            indexValue = lookupArray[idx];
          } else if (lookupArray[idx] < indexValue) {
            index = idx + 1;
            indexValue = lookupArray[idx];
          }
        }
      }
    }
    return index;
  }
);

regFunc('TRANSPOSE', (arg: EvalResult) => {
  const array = getNumber2DArrayOrThrow(arg);
  // https://github.com/numbers/numbers.js/blob/master/lib/numbers/matrix.js#L171
  const result: number[][] = [];

  if (!Array.isArray(array)) {
    throw FormulaError.VALUE;
  }

  if (!array.length) {
    return [[]];
  }

  for (let i = 0; i < array[0].length; i++) {
    result[i] = [];
    for (let j = 0; j < array.length; j++) {
      result[i][j] = array[j][i];
    }
  }

  return result;
});

regFunc(
  'VLOOKUP',
  (
    lookupValue: any,
    tableArray: any,
    colIndexNum: EvalResult,
    rangeLookup: EvalResult
  ) => {
    tableArray = get2DArray(tableArray);
    if (!Array.isArray(tableArray)) {
      throw FormulaError.NA;
    }
    colIndexNum = getNumberOrThrow(colIndexNum);
    rangeLookup = getBooleanWithDefault(rangeLookup, true);

    // check if colIndexNum out of bound
    if (colIndexNum < 1) throw FormulaError.VALUE;
    if (tableArray[0][colIndexNum - 1] === undefined) throw FormulaError.REF;

    const lookupType = typeof lookupValue; // 'number', 'string', 'boolean'

    // approximate lookup (assume the array is sorted)
    if (rangeLookup) {
      let prevValue =
        lookupType === typeof tableArray[0][0] ? tableArray[0][0] : null;
      for (let i = 1; i < tableArray.length; i++) {
        const currRow = tableArray[i];
        const currValue = tableArray[i][0];
        const type = typeof currValue;
        // skip the value if type does not match
        if (type !== lookupType) continue;
        // if the previous two values are greater than lookup value, throw #N/A
        if (prevValue > lookupValue && currValue > lookupValue) {
          throw FormulaError.NA;
        }
        if (currValue === lookupValue) return currRow[colIndexNum - 1];
        // if previous value <= lookup value and current value > lookup value
        if (
          prevValue != null &&
          currValue > lookupValue &&
          prevValue <= lookupValue
        ) {
          return tableArray[i - 1][colIndexNum - 1];
        }
        prevValue = currValue;
      }
      if (prevValue == null) throw FormulaError.NA;
      if (tableArray.length === 1) {
        return tableArray[0][colIndexNum - 1];
      }
      return prevValue;
    }
    // exact lookup with wildcard support
    else {
      let index = -1;
      if (WildCard.isWildCard(lookupValue)) {
        index = tableArray.findIndex(currRow => {
          return WildCard.toRegex(lookupValue, 'i').test(currRow[0]);
        });
      } else {
        index = tableArray.findIndex(currRow => {
          return currRow[0] === lookupValue;
        });
      }
      // the exact match is not found
      if (index === -1) throw FormulaError.NA;
      return tableArray[index][colIndexNum - 1];
    }
  }
);

function isOneDimensionalArray(array: any[]) {
  return !array.every(el => Array.isArray(el)) || array.length === 0;
}

export function fillMatrix(array: number[][] | number[], fill_value?: number) {
  if (!array) {
    throw FormulaError.VALUE;
  }
  let matrix: number[][];
  // 兼容一维数组的情况
  if (isOneDimensionalArray(array)) {
    matrix = [[...(array as number[])]];
  } else {
    matrix = array as number[][];
  }

  matrix.map((arr, i) => {
    arr.map((a, j) => {
      if (!a) {
        matrix[i][j] = 0;
      }
    });
  });

  const longestArrayIndex = matrix.reduce(
    (acc, arr, i) => (arr.length > matrix[acc].length ? i : acc),
    0
  );
  const longestArrayLength = matrix[longestArrayIndex].length;

  return matrix.map(el => [
    ...el,
    ...Array(longestArrayLength - el.length).fill(fill_value ? fill_value : 0)
  ]);
}

export function transpose(matrix: number[][]) {
  if (!matrix) {
    throw FormulaError.VALUE;
  }

  return matrix[0].map((col, i) => matrix.map(row => row[i]));
}

regFunc('SORT', (...args: EvalResult[]) => {
  const array = get2DArray(args[0]) as number[][];
  let sort_index = getNumberWithDefault(args[1], 1);
  const sort_order = getNumberWithDefault(args[2], 1);
  const by_col = getBooleanWithDefault(args[3], false);
  if (array.length === 0) {
    return 0;
  }

  if (!sort_index || sort_index < 1) {
    throw FormulaError.VALUE;
  }

  if (sort_order !== 1 && sort_order !== -1) {
    throw FormulaError.VALUE;
  }

  const sortArray = (arr: number[][]) =>
    arr.sort((a, b) => {
      const a_v = a[sort_index - 1];
      const b_v = b[sort_index - 1];

      return sort_order === 1
        ? a_v < b_v
          ? sort_order * -1
          : sort_order
        : a_v > b_v
        ? sort_order
        : sort_order * -1;
    });

  const matrix = fillMatrix(array);
  const result = by_col ? transpose(matrix) : matrix;

  return sort_index >= 1 && sort_index <= result[0].length
    ? by_col
      ? transpose(sortArray(result))
      : sortArray(result)
    : 0;
});

export function UNIQUE(...args: any[]) {
  const result = [];
  for (let i = 0; i < args.length; ++i) {
    let hasElement = false;
    const element = args[i];

    // Check if we've already seen this element.

    for (let j = 0; j < result.length; ++j) {
      hasElement = result[j] === element;

      if (hasElement) {
        break;
      }
    }

    // If we did not find it, add it to the result.
    if (!hasElement) {
      result.push(element);
    }
  }

  return result;
}

regFunc('UNIQUE', (...args: EvalResult[]) => {
  return UNIQUE(...flattenArgs(args));
});
