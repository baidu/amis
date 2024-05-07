import {tokenize} from '../tokenizer';

test('SUM(A1:A2)', () => {
  expect(tokenize('SUM(A1:A2)')).toEqual([
    {name: 'FUNCTION', value: 'SUM(', start: 0, end: 4},
    {name: 'CELL', value: 'A1', start: 4, end: 6},
    {name: 'COLON', value: ':', start: 6, end: 7},
    {name: 'CELL', value: 'A2', start: 7, end: 9},
    {name: 'CLOSE_PAREN', value: ')', start: 9, end: 10}
  ]);
});

test('SUM(Economics!D28:D45)', () => {
  expect(tokenize('SUM(Economics!D28:D45)')).toEqual([
    {
      end: 4,
      name: 'FUNCTION',
      start: 0,
      value: 'SUM('
    },
    {
      end: 14,
      name: 'SHEET',
      start: 4,
      value: 'Economics!'
    },
    {
      end: 17,
      name: 'CELL',
      start: 14,
      value: 'D28'
    },
    {
      end: 18,
      name: 'COLON',
      start: 17,
      value: ':'
    },
    {
      end: 21,
      name: 'CELL',
      start: 18,
      value: 'D45'
    },
    {
      end: 22,
      name: 'CLOSE_PAREN',
      start: 21,
      value: ')'
    }
  ]);
});

test('G3*G4', () => {
  expect(tokenize('G3*G4')).toEqual([
    {name: 'CELL', value: 'G3', start: 0, end: 2},
    {name: 'MUL', value: '*', start: 2, end: 3},
    {name: 'CELL', value: 'G4', start: 3, end: 5}
  ]);
});

test('COUNTIF(J10:J65536,"MWhs")', () => {
  expect(tokenize('COUNTIF(J10:J65536,"MWhs")')).toEqual([
    {name: 'FUNCTION', value: 'COUNTIF(', start: 0, end: 8},
    {name: 'CELL', value: 'J10', start: 8, end: 11},
    {name: 'COLON', value: ':', start: 11, end: 12},
    {name: 'CELL', value: 'J65536', start: 12, end: 18},
    {name: 'COMMA', value: ',', start: 18, end: 19},
    {name: 'STRING', value: '"MWhs"', start: 19, end: 25},
    {name: 'CLOSE_PAREN', value: ')', start: 25, end: 26}
  ]);
});

test('VLOOKUP(G10,USERS,2,FALSE)', () => {
  expect(tokenize('VLOOKUP(G10,USERS,2,FALSE)')).toEqual([
    {name: 'FUNCTION', value: 'VLOOKUP(', start: 0, end: 8},
    {name: 'CELL', value: 'G10', start: 8, end: 11},
    {name: 'COMMA', value: ',', start: 11, end: 12},
    {name: 'NAME', value: 'USERS', start: 12, end: 17},
    {name: 'COMMA', value: ',', start: 17, end: 18},
    {name: 'NUMBER', value: '2', start: 18, end: 19},
    {name: 'COMMA', value: ',', start: 19, end: 20},
    {name: 'BOOLEAN', value: 'FALSE', start: 20, end: 25},
    {name: 'CLOSE_PAREN', value: ')', start: 25, end: 26}
  ]);
});

test('1>=2', () => {
  expect(tokenize('1>=2')).toEqual([
    {name: 'NUMBER', value: '1', start: 0, end: 1},
    {name: 'GE', value: '>=', start: 1, end: 3},
    {name: 'NUMBER', value: '2', start: 3, end: 4}
  ]);
});

test("'[2]Exhibit Data'!B50/1000", () => {
  tokenize("'[2]Exhibit Data'!B50/1000");
});

test('COUNTIF($A:$A,$B17)', () => {
  tokenize('COUNTIF($A)');
});

test('[1]!Hub_Consolidation', () => {
  tokenize('[1]!Hub_Consolidation');
});
