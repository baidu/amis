import FormulaError from '../../FormulaError';
import {TestCase, buildEnv, testEvalCases} from './buildEnv';

const data = [
  ['fruit', 'price', 'count', 4, 5],
  ['Apples', 0.69, 40, 5, 6],
  ['Bananas', 0.34, 38, 5, 6],
  ['Lemons', 0.55, 15, 5, 6],
  ['Oranges', 0.25, 25, 5, 6],
  ['Pears', 0.59, 40, 5, 6],
  ['Almonds', 2.8, 10, 5, 6], // row 7
  ['Cashews', 3.55, 16, 5, 6], // row 8
  ['Peanuts', 1.25, 20, 5, 6], // row 9
  ['Walnuts', 1.75, 12, 5, 6], // row 10

  ['Apples', 'Lemons', 0, 0, 0], // row 11
  ['Bananas', 'Pears', 0, 0, 0] // row 12
];

const env = buildEnv(data);

function runTest(testCase: TestCase) {
  testEvalCases(testCase, env);
}

test('AND', () => {
  runTest({
    'AND(A1)': FormulaError.VALUE,
    'AND(1,1,1)': true,
    'AND(1,0,0)': false,
    'AND(A2:C2)': true,
    'AND("Test", "TRUE")': true,
    'AND("Test", "FALSE")': false,
    'AND({0,1,0}, FALSE)': false,
    'AND((A2:C2, A3))': true,
    'AND((A2:C2 C2))': true
  });
});

test('IF', () => {
  runTest({
    'IF(TRUE, A1, A2)': 'fruit',
    'IF(TRUE, A1&1, A2)': 'fruit1',
    'IF(A1 = "fruit", A1, A2)': 'fruit',
    'IF(IF(D1 < D5, A2) = "count", A1, A2)': 'Apples'
  });
});

test('IFS', () => {
  runTest({
    'IFS(1=3,"Not me", 1=2, "Me neither", 1=1, "Yes me")': 'Yes me',
    'IFS(D5<60,"F",D5<70,"D",D5<80,"C",D5<90,"B",D5>=90,"A")': 'F',
    'IFS(1=3,"Not me", 1=2, "Me neither", 1=4, "Not me")': FormulaError.NA,
    'IFS("HELLO","Not me", 1=2, "Me neither", 1=4, "Not me")':
      FormulaError.VALUE,
    'IFS("HELLO")': FormulaError.NA
  });
});

test('IFNA', () => {
  runTest({
    'IFNA(#N/A, 1, 2)': FormulaError.TOO_MANY_ARGS('IFNA'),
    'IFNA(#N/A, 1)': 1,
    'IFNA("Good", 1)': 'Good'
  });
});

test('OR', () => {
  runTest({
    'OR(A1)': FormulaError.VALUE,
    'OR(1,1,0)': true,
    'OR(0,0,0)': false,
    'OR(A2:C2)': true,
    'OR("Test", "TRUE")': true,
    'OR("Test", "FALSE")': false,
    'OR({0,1,0}, FALSE)': true,
    'OR((A2:C2, A3))': true,
    'OR((A2:C2 C2))': true
  });
});

test('TRUE', () => {
  runTest({
    TRUE: true
  });
});

test('TEXTJOIN', () => {
  runTest({
    'TEXTJOIN(" ", TRUE, "The", "", "sun", "will", "come", "up", "tomorrow.")':
      'The sun will come up tomorrow.',
    'TEXTJOIN({"_", ">"}, TRUE, "The", "sun", "will", "come", "up", "tomorrow.")':
      'The_sun>will_come>up_tomorrow.'
  });
});

test('FALSE', () => {
  runTest({
    FALSE: false
  });
});

test('SWITCH', () => {
  runTest({
    'SWITCH(7, 9, "a", 7, "b")': 'b'
  });
});

test('XOR', () => {
  runTest({
    'XOR(A1)': FormulaError.VALUE,
    'XOR(1,1,0)': false,
    'XOR(1,1,1)': true,
    'XOR(A2:C2)': false,
    'XOR(A2:C2, "TRUE")': true,
    'XOR("Test", "TRUE")': true,
    'XOR({1,1,1}, FALSE)': true,
    'XOR((A2:C2, A3))': false,
    'XOR((A2:C2 C2))': true
  });
});
