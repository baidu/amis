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

test('RANGE', () => {
  runTest({
    'A1': 'fruit',
    'A1:B1': [['fruit', 'price']],
    'A1:A2': [['fruit'], ['Apples']],
    'A1:B2': [
      ['fruit', 'price'],
      ['Apples', 0.69]
    ]
  });
});

test('ADDRESS', () => {
  runTest({
    'ADDRESS(2,3,4, 2, "abc")': 'abc!C2',
    'ADDRESS(2,3)': '$C$2',
    'ADDRESS(2,3, 1)': '$C$2',
    'ADDRESS(2,3,2)': 'C$2',
    'ADDRESS(2,3,3)': '$C2',
    'ADDRESS(2,3,4, TRUE)': 'C2',
    'ADDRESS(2,3,2,FALSE)': 'R2C[3]',
    'ADDRESS(2,3,1,FALSE,"[Book1]Sheet1")': "'[Book1]Sheet1'!R2C3",
    'ADDRESS(2,3,1,FALSE,"EXCEL SHEET")': "'EXCEL SHEET'!R2C3"
  });
});

test('AREAS', () => {
  runTest({
    'AREAS((B2:D4,E5,F6:I9))': 3,
    'AREAS(B2:D4)': 1,
    'AREAS(B2:D4 B2)': 1
  });
});

test('COLUMN', () => {
  runTest({
    'COLUMN()': 2,
    'COLUMN(C3)': 3,
    'COLUMN(C3:V6)': 3,
    'COLUMN(123)': FormulaError.VALUE,
    'COLUMN({1,2,3})': FormulaError.VALUE,
    'COLUMN("A1")': FormulaError.VALUE
  });
});

test('COLUMNS', () => {
  runTest({
    'COLUMNS(A1)': 1,
    'COLUMNS(A1:C5)': 3,
    'COLUMNS(123)': FormulaError.VALUE,
    'COLUMNS({1,2,3})': FormulaError.VALUE,
    'COLUMNS("A1")': FormulaError.VALUE
  });
});

test('HLOOKUP', () => {
  runTest({
    'HLOOKUP(3, {1,2,3,4,5}, 1)': 3,
    'HLOOKUP(3, {3,2,1}, 1)': 1,
    'HLOOKUP(3, {1,2,3,4,5}, 2)': FormulaError.REF,
    'HLOOKUP("a", {1,2,3,4,5}, 1)': FormulaError.NA,
    'HLOOKUP(3, {1.1,2.2,3.3,4.4,5.5}, 1)': 2.2,
    // should handle like Excel.
    'HLOOKUP(63, {"c",FALSE,"abc",65,63,61,"b","a",FALSE,TRUE}, 1)': 63,
    'HLOOKUP(TRUE, {"c",FALSE,"abc",65,63,61,"b","a",FALSE,TRUE}, 1)': true,
    'HLOOKUP(FALSE, {"c",FALSE,"abc",65,63,61,"b","a",FALSE,TRUE}, 1)': false,
    'HLOOKUP(FALSE, {"c",TRUE,"abc",65,63,61,"b","a",TRUE,FALSE}, 1)':
      FormulaError.NA,
    'HLOOKUP("c", {"c",TRUE,"abc",65,63,61,"b","a",TRUE,FALSE}, 1)': 'a',
    'HLOOKUP("b", {"c",TRUE,"abc",65,63,61,"b","a",TRUE,FALSE}, 1)': 'b',
    'HLOOKUP("abc", {"c",TRUE,"abc",65,63,61,"b","a",TRUE,FALSE}, 1)': 'abc',
    'HLOOKUP("a", {"c",TRUE,"abc",65,63,61,"b","a",TRUE,FALSE}, 1)':
      FormulaError.NA,
    'HLOOKUP("a*", {"c",TRUE,"abc",65,63,61,"b","a",TRUE,FALSE}, 1)':
      FormulaError.NA,
    // with rangeLookup = FALSE
    'HLOOKUP(3, 3, 1,FALSE)': FormulaError.NA,
    'HLOOKUP(3, {1,2,3}, 1,FALSE)': 3,
    'HLOOKUP("a", {1,2,3,"a","b"}, 1,FALSE)': 'a',
    'HLOOKUP(3, {1,2,3;"a","b","c"}, 2,FALSE)': 'c',
    'HLOOKUP(6, {1,2,3;"a","b","c"}, 2,FALSE)': FormulaError.NA,
    // wildcard support
    'HLOOKUP("s?", {"abc", "sd", "qwe"}, 1,FALSE)': 'sd',
    'HLOOKUP("*e", {"abc", "sd", "qwe"}, 1,FALSE)': 'qwe',
    'HLOOKUP("*e?2?", {"abc", "sd", "qwe123"}, 1,FALSE)': 'qwe123',
    // case insensitive
    'HLOOKUP("a*", {"c",TRUE,"AbC",65,63,61,"b","a",TRUE,FALSE}, 1, FALSE)':
      'AbC',
    // single row table
    'HLOOKUP(614, { 614;"Foobar"}, 2)': 'Foobar'
  });
});

test('MATCH', () => {
  runTest({'MATCH(41,{25,38,40,41}, 0)': 4, 'MATCH(39,{25,38,40,41}, 1)': 2});

  // runTest({'MATCH(40,{25,38,40,41}, -1)': 2});
});

test('ROW', () => {
  runTest({
    'ROW()': 2,
    'ROW(C4)': 4,
    'ROW(C4:V6)': 4,
    'ROW(123)': FormulaError.VALUE,
    'ROW({1,2,3})': FormulaError.VALUE,
    'ROW("A1")': FormulaError.VALUE
  });
});

test('ROWS', () => {
  runTest({
    'ROWS(A1)': 1,
    'ROWS(A1:C5)': 5,
    'ROWS(123)': FormulaError.VALUE,
    'ROWS({1,2,3})': FormulaError.VALUE,
    'ROWS("A1")': FormulaError.VALUE
  });
});

test('TRANSPOSE', () => {
  runTest({'SUM(TRANSPOSE({1,2,3;4,5,6}))': 21});
});

test('SORT', () => {
  runTest({
    'SORT({1,2,3; 4,5,6; 7,8,9}, 1, 1, TRUE)': [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ],
    'SORT({3,2,1; 6,5,4; 9,8,7}, 1, 1, TRUE)': [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ],
    'SORT({2,3,1; 5,6,4; 8,9,7}, 1, 1, TRUE)': [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ],
    'SORT({1,2,3}, 1, 1, FALSE)': [[1, 2, 3]]
  });
});

test('LOOKUP', () => {
  runTest({
    'LOOKUP("Jack", {"Jim", "Jack", "Franck"}, {"blue", "yellow", "red"})':
      'yellow',
    'LOOKUP("Jack", {"Jim"; "Jack"; "Franck"}, {"blue"; "yellow"})': 'yellow',
    'LOOKUP(0.23, {0.1, 0.2, 0.3, 0.4}, {"A", "B", "C", "D"})': 'B'
  });
});

test('UNIQUE', () => {
  runTest({
    'UNIQUE({1, 2, 3, 4, 5, 6, 6, 3})': [1, 2, 3, 4, 5, 6]
  });
});

test('VLOOKUP', () => {
  runTest({
    'VLOOKUP(3, {1;2;3;4;5}, 1)': 3,
    'VLOOKUP(3, {3;2;1}, 1)': 1,
    'VLOOKUP(3, {1;2;3;4;5}, 2)': FormulaError.REF,
    'VLOOKUP("a", {1;2;3;4;5}, 1)': FormulaError.NA,
    'VLOOKUP(3, {1.1;2.2;3.3;4.4;5.5}, 1)': 2.2,
    // should handle like Excel.
    'VLOOKUP(63, {"c";FALSE;"abc";65;63;61;"b";"a";FALSE;TRUE}, 1)': 63,
    'VLOOKUP(TRUE, {"c";FALSE;"abc";65;63;61;"b";"a";FALSE;TRUE}, 1)': true,
    'VLOOKUP(FALSE, {"c";FALSE;"abc";65;63;61;"b";"a";FALSE;TRUE}, 1)': false,
    'VLOOKUP(FALSE, {"c";TRUE;"abc";65;63;61;"b";"a";TRUE;FALSE}, 1)':
      FormulaError.NA,
    'VLOOKUP("c", {"c";TRUE;"abc";65;63;61;"b";"a";TRUE;FALSE}, 1)': 'a',
    'VLOOKUP("b", {"c";TRUE;"abc";65;63;61;"b";"a";TRUE;FALSE}, 1)': 'b',
    'VLOOKUP("abc", {"c";TRUE;"abc";65;63;61;"b";"a";TRUE;FALSE}, 1)': 'abc',
    'VLOOKUP("a", {"c";TRUE;"abc";65;63;61;"b";"a";TRUE;FALSE}, 1)':
      FormulaError.NA,
    'VLOOKUP("a*", {"c";TRUE;"abc";65;63;61;"b";"a";TRUE;FALSE}, 1)':
      FormulaError.NA,
    // with rangeLookup = FALSE
    'VLOOKUP(3, 3, 1,FALSE)': FormulaError.NA,
    'VLOOKUP(3, {1;2;3}, 1,FALSE)': 3,
    'VLOOKUP("a", {1;2;3;"a";"b"}, 1,FALSE)': 'a',
    'VLOOKUP(3, {1,"a";2, "b";3, "c"}, 2,FALSE)': 'c',
    'VLOOKUP(6, {1,"a";2, "b";3, "c"}, 2,FALSE)': FormulaError.NA,
    // wildcard support
    'VLOOKUP("s?", {"abc"; "sd"; "qwe"}, 1,FALSE)': 'sd',
    'VLOOKUP("*e", {"abc"; "sd"; "qwe"}, 1,FALSE)': 'qwe',
    'VLOOKUP("*e?2?", {"abc"; "sd"; "qwe123"}, 1,FALSE)': 'qwe123',
    // case insensitive
    'VLOOKUP("a*", {"c";TRUE;"AbC";65;63;61;"b";"a";TRUE;FALSE}, 1, FALSE)':
      'AbC',
    // single row table
    'VLOOKUP(614, { 614,"Foobar"}, 2)': 'Foobar'
  });
});
