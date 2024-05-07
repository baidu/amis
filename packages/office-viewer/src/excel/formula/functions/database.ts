/**
 * 数据库相关的函数
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
import {Criteria, parseCriteria} from '../parser/parseCriteria';
import {evalCriterial} from '../eval/evalCriterial';
import {getArray} from './util/getArray';
import {evalIFS} from './util/evalIFS';
import {flattenArgs} from './util/flattenArgs';
import {VAR, VARP, standardDeviation} from './distribution';

/**
 * 判断是否相同
 * @param arr1
 * @param arr2
 */
function arrayIsEqual(arr1: EvalResult[][], arr2: EvalResult[][]) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i].length !== arr2[i].length) {
      return false;
    }
    for (let j = 0; j < arr1[i].length; j++) {
      if (arr1[i][j] !== arr2[i][j]) {
        return false;
      }
    }
  }
  return true;
}

function getFilteredData(
  fieldNameIndex: Map<string, number>,
  db: EvalResult[][],
  criteria: EvalResult[][]
) {
  // 数据库过滤后的内容
  const filtered: EvalResult[][] = [];

  // 构建解析后的条件，其中的 number 是字段索引，Criteria[] 是条件
  const parsedCriteria: Array<Map<number, Criteria[]>> = [];

  const firstCriteriaRow = criteria[0];
  for (let rowIndex = 1; rowIndex < criteria.length; rowIndex++) {
    for (let colIndex = 0; colIndex < criteria[rowIndex].length; colIndex++) {
      const criteriaStr = criteria[rowIndex][colIndex];
      if (typeof criteriaStr === 'string') {
        const fileName = firstCriteriaRow[colIndex] as string;
        const fieldIndex = fieldNameIndex.get(fileName);
        if (fieldIndex === undefined) {
          throw FormulaError.VALUE;
        }
        if (!parsedCriteria[rowIndex]) {
          parsedCriteria[rowIndex] = new Map();
          parsedCriteria[rowIndex].set(fieldIndex, [
            parseCriteria(criteriaStr)
          ]);
        } else {
          if (!parsedCriteria[rowIndex].has(fieldIndex)) {
            parsedCriteria[rowIndex].set(fieldIndex, [
              parseCriteria(criteriaStr)
            ]);
          } else {
            parsedCriteria[rowIndex]
              .get(fieldIndex)!
              .push(parseCriteria(criteriaStr));
          }
        }
      }
    }
  }

  for (let rowIndex = 1; rowIndex < db.length; rowIndex++) {
    const row = db[rowIndex];

    // 一行内是且关系，多行是或关系
    let match = false;
    for (const criteriaRow of parsedCriteria) {
      if (!criteriaRow) {
        continue;
      }
      let rowMatch = true;

      for (const fieldIndex of criteriaRow.keys()) {
        const criteriaParsed = criteriaRow.get(fieldIndex);
        if (criteriaParsed) {
          for (const criteria of criteriaParsed) {
            if (!evalCriterial(criteria, row[fieldIndex] as string)) {
              rowMatch = false;
              break;
            }
          }
        }
      }
      if (rowMatch) {
        match = true;
      }
    }
    if (match) {
      filtered.push(row);
    }
  }
  return filtered;
}

/**
 * 从数据库里获取值并过滤
 * @param db 二维数据结构
 * @param criteria
 * @param field
 */
export function getDatabaseResult(
  db: EvalResult[][],
  criteria: EvalResult[][],
  field?: number | string
) {
  // 数据库过滤后的内容

  const firstRow = db[0];

  // 字段名对应的索引
  const fieldNameIndex: Map<string, number> = new Map();

  for (let i = 0; i < firstRow.length; i++) {
    fieldNameIndex.set(firstRow[i] as string, i);
  }

  let filtered: EvalResult[][] = [];
  if (arrayIsEqual(db, criteria)) {
    db.shift();
    filtered = db;
  } else {
    filtered = getFilteredData(fieldNameIndex, db, criteria);
  }

  let result: EvalResult[] = [];

  if (field) {
    let fieldIndex = 0;
    if (typeof field === 'string') {
      fieldIndex = fieldNameIndex.get(field) || 0;
    } else {
      fieldIndex = field - 1;
    }
    for (const row of filtered) {
      result.push(row[fieldIndex]);
    }
    return result;
  }

  return flattenArgs(filtered);
}

regFunc(
  'DAVERAGE',
  (database: EvalResult, field: EvalResult, criteria: EvalResult) => {
    const filtered = getDatabaseResult(
      database as EvalResult[][],
      criteria as EvalResult[][],
      field as number | string
    );

    const numbers = getNumbers(filtered);
    if (numbers.length === 0) {
      throw FormulaError.DIV0;
    }
    return numbers.reduce((prev, cur) => prev + cur, 0) / numbers.length;
  }
);

regFunc(
  'DCOUNT',
  (database: EvalResult, field: EvalResult, criteria: EvalResult) => {
    const filtered = getDatabaseResult(
      database as EvalResult[][],
      criteria as EvalResult[][],
      field as number | string
    );

    return getNumbers(filtered).length;
  }
);

regFunc(
  'DCOUNTA',
  (database: EvalResult, field: EvalResult, criteria: EvalResult) => {
    const filtered = getDatabaseResult(
      database as EvalResult[][],
      criteria as EvalResult[][],
      field as number | string
    );

    return filtered.length;
  }
);

regFunc(
  'DGET',
  (database: EvalResult, field: EvalResult, criteria: EvalResult) => {
    const filtered = getDatabaseResult(
      database as EvalResult[][],
      criteria as EvalResult[][],
      field as number | string
    );

    if (filtered.length === 0) {
      throw FormulaError.VALUE;
    }
    return filtered[0];
  }
);

regFunc(
  'DMAX',
  (database: EvalResult, field: EvalResult, criteria: EvalResult) => {
    const filtered = getDatabaseResult(
      database as EvalResult[][],
      criteria as EvalResult[][],
      field as number | string
    );

    const numbers = getNumbers(filtered);
    if (numbers.length === 0) {
      throw FormulaError.DIV0;
    }
    return Math.max(...numbers);
  }
);

regFunc(
  'DMIN',
  (database: EvalResult, field: EvalResult, criteria: EvalResult) => {
    const filtered = getDatabaseResult(
      database as EvalResult[][],
      criteria as EvalResult[][],
      field as number | string
    );

    const numbers = getNumbers(filtered);
    if (numbers.length === 0) {
      throw FormulaError.DIV0;
    }
    return Math.min(...numbers);
  }
);

regFunc(
  'DPRODUCT',
  (database: EvalResult, field: EvalResult, criteria: EvalResult) => {
    const filtered = getDatabaseResult(
      database as EvalResult[][],
      criteria as EvalResult[][],
      field as number | string
    );

    const numbers = getNumbers(filtered);
    if (numbers.length === 0) {
      return 0;
    }
    return numbers.reduce((prev, cur) => prev * cur, 1);
  }
);

regFunc(
  'DSTDEV',
  (database: EvalResult, field: EvalResult, criteria: EvalResult) => {
    const filtered = getDatabaseResult(
      database as EvalResult[][],
      criteria as EvalResult[][],
      field as number | string
    );

    const numbers = getNumbers(filtered);
    if (numbers.length === 0) {
      throw FormulaError.DIV0;
    }
    return standardDeviation(numbers);
  }
);

regFunc(
  'DSTDEVP',
  (database: EvalResult, field: EvalResult, criteria: EvalResult) => {
    const filtered = getDatabaseResult(
      database as EvalResult[][],
      criteria as EvalResult[][],
      field as number | string
    );

    const numbers = getNumbers(filtered);
    if (numbers.length === 0) {
      throw FormulaError.DIV0;
    }
    return standardDeviation(numbers, true);
  }
);

regFunc(
  'DSUM',
  (database: EvalResult, field: EvalResult, criteria: EvalResult) => {
    const filtered = getDatabaseResult(
      database as EvalResult[][],
      criteria as EvalResult[][],
      field as number | string
    );

    return getNumbers(filtered).reduce((prev, cur) => prev + cur, 0);
  }
);

regFunc(
  'DVAR',
  (database: EvalResult, field: EvalResult, criteria: EvalResult) => {
    const filtered = getDatabaseResult(
      database as EvalResult[][],
      criteria as EvalResult[][],
      field as number | string
    );

    const numbers = getNumbers(filtered);
    if (numbers.length === 0) {
      throw FormulaError.DIV0;
    }
    return VAR(...numbers);
  }
);

regFunc(
  'DVARP',
  (database: EvalResult, field: EvalResult, criteria: EvalResult) => {
    const filtered = getDatabaseResult(
      database as EvalResult[][],
      criteria as EvalResult[][],
      field as number | string
    );

    const numbers = getNumbers(filtered);
    if (numbers.length === 0) {
      throw FormulaError.DIV0;
    }
    return VARP(numbers);
  }
);
