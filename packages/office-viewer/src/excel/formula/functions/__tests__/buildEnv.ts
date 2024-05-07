import {parseRange} from '../../../io/excel/util/Range';
import {CellValue} from '../../../types/CellValue';
import {RangeRef} from '../../../types/RangeRef';
import {FormulaEnv} from '../../FormulaEnv';
import FormulaError from '../../FormulaError';
import {EvalResult} from '../../eval/EvalResult';
import {evalFormula} from '../../eval/evalFormula';

export type CellData =
  | string
  | boolean
  | undefined
  | number
  | {
      date: number;
    };

export type Data = CellData[][];

export type TestCase = Record<
  string,
  EvalResult | FormulaError | string | number
>;

export function testEvalCases(testCase: TestCase, env: FormulaEnv) {
  for (const [formula, expected] of Object.entries(testCase)) {
    console.log(formula, expected);
    if (expected instanceof FormulaError) {
      expect(() => evalFormula(formula, env)).toThrowError(expected);
    } else {
      if (typeof expected === 'number') {
        expect(evalFormula(formula, env)).toBeCloseTo(expected);
      } else {
        expect(evalFormula(formula, env)).toEqual(expected);
      }
    }
  }
}

/**
 * 构建环境的辅助工具
 * @param data
 * @param vars
 * @returns
 */
export function buildEnv(data: Data, vars: Map<string, string> = new Map()) {
  function getDefinedName(name: string, sheetName?: string) {
    if (vars.has(name)) {
      const value = vars.get(name)!;
      return value;
    }
    throw new Error('未找到变量');
  }
  function getByRange(range: RangeRef, sheetName?: string) {
    const result: CellValue[] = [];
    for (let i = range.startRow; i <= range.endRow; i++) {
      for (let j = range.startCol; j <= range.endCol; j++) {
        let isDate = false;
        let value = data[i][j];
        if (value !== null && typeof value === 'object' && 'date' in value) {
          isDate = true;
          value = value.date;
        }
        result.push({
          row: i,
          col: j,
          text: data[i][j] + '',
          value: value,
          isDate
        });
      }
    }
    return result;
  }

  return {
    getDefinedName,
    getByRange,
    getByRangeIgnoreHidden: getByRange,
    formulaCell: () => {
      return {startRow: 1, startCol: 1, endRow: 1, endCol: 1};
    }
  } as FormulaEnv;
}
