import {CellValue} from '../../types/CellValue';
import {RangeRef} from '../../types/RangeRef';
import {FormulaEnv} from '../FormulaEnv';
import {evalFormula} from '../eval/evalFormula';

const vars: Map<string, string> = new Map([
  ['aaaa', 'A1:A1'],
  ['bbbb', 'B1:B1']
]);

const env = {
  getDefinedName: (name: string, sheetName?: string) => {
    return vars.get(name)!;
  },
  getByRange: (range: RangeRef, sheetName?: string) => {
    if (range.startCol === 0) {
      return [{row: 1, col: 0, text: '1', value: 1}];
    }
    if (range.startCol === 1) {
      return [{row: 1, col: 1, text: '2', value: 2}];
    }
    return [];
  },
  getByRangeIgnoreHidden: (range: RangeRef, sheetName?: string) => {
    return env.getByRange(range, sheetName);
  },
  formulaCell: () => {
    return {startRow: 1, startCol: 1, endRow: 1, endCol: 1};
  }
} as FormulaEnv;

test('fourOp', () => {
  expect(evalFormula('1 + 2', env)).toEqual(3);
  expect(evalFormula('1 - 2', env)).toEqual(-1);
  expect(evalFormula('1 * 2', env)).toEqual(2);
  expect(evalFormula('1 / 2', env)).toEqual(0.5);
  expect(evalFormula('2 ^ 2', env)).toEqual(4);
  expect(evalFormula('1 + 2 * 2', env)).toEqual(5);
  expect(evalFormula('(1 + 2) * 2', env)).toEqual(6);
});

test('evalRef', () => {
  expect(evalFormula('aaaa + bbbb', env)).toEqual(3);
});

test('evalFunction', () => {
  expect(evalFormula('SUM(1, 2)', env)).toEqual(3);
  expect(evalFormula('SUM(aaaa, bbbb)', env)).toEqual(3);
});

test('string', () => {
  expect(evalFormula('"a"', env)).toEqual('a');
  expect(evalFormula('"a" & "b"', env)).toEqual('ab');
  expect(evalFormula('"A"&TRUE', env)).toEqual('ATRUE');
});

test('num add string', () => {
  expect(evalFormula('"1" + "2"', env)).toEqual(3);
  expect(evalFormula('1+"$4.00"', env)).toEqual(5);
});

test('date', () => {
  expect(evalFormula(' "6/1/2001"-"5/1/2001"', env)).toEqual(31);
});

test('implicit convert', () => {
  expect(evalFormula('1+"2"', env)).toEqual(3);
  expect(evalFormula('"1"+2', env)).toEqual(3);
  expect(evalFormula('1+TRUE', env)).toEqual(2);
});

test('array op', () => {
  expect(evalFormula('{1,2}+{3,4}', env)).toEqual([4, 6]);
  expect(evalFormula('{1,2}+3', env)).toEqual([4, 5]);
  expect(evalFormula('1+{3;4}', env)).toEqual([[4], [5]]);
  expect(evalFormula('{1;2}+{3;4}', env)).toEqual([[4], [6]]);
  expect(evalFormula('{1,2;3,4}+{1,2;3,4}', env)).toEqual([
    [2, 4],
    [6, 8]
  ]);
  expect(evalFormula('2*{1,2}', env)).toEqual([2, 4]);
});
