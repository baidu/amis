import {Parser, infixParserMap, prefixParserMap} from '../Parser';
import {Reference} from '../ast/Reference';
import {tokenDefines, tokenize} from '../tokenizer';
import {printAST} from '../ast/ASTNode';

function testPrintMatch(input: string, output: string) {
  const parser = new Parser(tokenize(input));
  const ast = parser.parse();
  expect(printAST(ast)).toBe(output);
}

test('not in parserMap', () => {
  const keys = new Set();
  for (const [key] of prefixParserMap.entries()) {
    keys.add(key);
  }
  for (const [key] of infixParserMap.entries()) {
    keys.add(key);
  }
  const whiteList = new Set(['SPACE', 'COMMA', 'COLON', 'SEMICOLON']);

  for (const key in tokenDefines) {
    if (!keys.has(key) && !key.startsWith('CLOSE_') && !whiteList.has(key)) {
      // TODO，目前这些解析有问题
      // console.log(key);
    }
  }
});

test('col', () => {
  testPrintMatch('SUM(C:C)', 'SUM(C:C)');
});

test('COUNTIF($A:$A,$B17)', () => {
  testPrintMatch('COUNTIF($A:$A,$B17)', 'COUNTIF($A:$A,$B17)');
});

test('[2]Section3A', () => {
  // TODO: 目前不支持 name 和 cell 混合的情况
  // testPrintMatch('[2]Section3A:A3', 'Section3A:A3');
});

test('SUM(A1:INDEX(A2))', () => {
  // 目前不支持这种混合情况
});

test('half', () => {
  testPrintMatch('SUM(2,)', 'SUM(2)');
});

test('funcArg', () => {
  testPrintMatch('SUM(2,,)', 'SUM(2)');
});

test('union', () => {
  testPrintMatch('SUM((A1,A2))', 'SUM((A1,A2))');
});

test('range', () => {
  testPrintMatch('SUM(A1:A2)', 'SUM(A1:A2)');
});

test('Intersection', () => {
  testPrintMatch('SUM(B7:D7 C6:C8)', 'SUM(B7:D7 C6:C8)');
});

test('2dArr', () => {
  testPrintMatch('SUM({1,2;3,4})', 'SUM({1,2;3,4})');
});

test('fourOp', () => {
  testPrintMatch('a ^ b', '(a^b)');
  testPrintMatch('-a * b', '((-a)*b)');
  testPrintMatch('a ^ (b + c)', '(a^(b+c))');
  testPrintMatch('1 + 2 * 3', '(1+(2*3))');
  testPrintMatch('(1 + 2) * 3', '((1+2)*3)');
  testPrintMatch('a * b / c', '((a*b)/c)');
});

test('function', () => {
  testPrintMatch('SUM()', 'SUM()');
  testPrintMatch('SUM(1, 2, 3)', 'SUM(1,2,3)');
});

test('mix', () => {
  testPrintMatch('A1 + SUM(A2)', '(A1+SUM(A2))');
});

function testRef(input: string, result: Reference) {
  const parser = new Parser(tokenize(input));
  const ast = parser.parse();
  expect(ast.ref).toEqual(result);
}

test('refParse', () => {
  testRef('A1', {
    start: 'A1',
    end: 'A1',
    range: {
      startCol: 0,
      startRow: 0,
      endCol: 0,
      endRow: 0
    }
  });

  testRef('A1:B$3', {
    start: 'A1',
    end: 'B$3',
    range: {
      startCol: 0,
      startRow: 0,
      endCol: 1,
      endRow: 2
    }
  });

  testRef('sheet1!A1:B$3', {
    sheetName: 'sheet1',
    start: 'A1',
    end: 'B$3',
    range: {
      startCol: 0,
      startRow: 0,
      endCol: 1,
      endRow: 2
    }
  });
});
