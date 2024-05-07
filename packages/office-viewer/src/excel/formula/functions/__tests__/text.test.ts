/**
 * 用例来自 fast-formula-parser
 */

import FormulaError from '../../FormulaError';
import {EvalResult} from '../../eval/EvalResult';
import {TestCase, buildEnv, testEvalCases} from './buildEnv';

const data: [] = [];

const env = buildEnv(data);

function runTest(testCase: TestCase) {
  testEvalCases(testCase, env);
}

test('ASC', () => {
  runTest({
    'ASC("ＡＢＣ")': 'ABC'
    // 'ASC("ヲァィゥ")': 'ｦｧｨｩ',
    // 'ASC("，。")': ',｡'
  });
});

test('BAHTTEXT', () => {
  runTest({
    'BAHTTEXT(1234)': 'หนึ่งพันสองร้อยสามสิบสี่บาทถ้วน'
  });
});

test('CHAR', () => {
  runTest({
    'CHAR(65)': 'A',
    'CHAR(33)': '!'
  });
});

test('CLEAN', () => {
  runTest({
    'CLEAN("äÄçÇéÉêPHP-MySQLöÖÐþúÚ")': 'äÄçÇéÉêPHP-MySQLöÖÐþúÚ',
    'CLEAN(CHAR(9)&"Monthly report"&CHAR(10))': 'Monthly report'
  });
});

test('CODE', () => {
  runTest({
    'CODE("C")': 67,
    'CODE("")': FormulaError.VALUE
  });
});

test('CONCAT', () => {
  runTest({
    'CONCAT(0, {1,2,3;5,6,7})': '0123567',
    'CONCAT(TRUE, 0, {1,2,3;5,6,7})': 'TRUE0123567',
    'CONCAT(0, {1,2,3;5,6,7},)': '0123567',
    'CONCAT("The"," ","sun"," ","will"," ","come"," ","up"," ","tomorrow.")':
      'The sun will come up tomorrow.',
    'CONCAT({1,2,3}, "aaa", TRUE, 0, FALSE)': '123aaaTRUE0FALSE'
  });
});

test('CONCATENATE', () => {
  runTest({
    'CONCATENATE({9,8,7})': '9',
    'CONCATENATE({9,8,7},{8,7,6})': '98',
    'CONCATENATE({9,8,7},"hello")': '9hello',
    'CONCATENATE({0,2,3}, 1, "A", TRUE, -12)': '01ATRUE-12'
  });
});

test('DBCS', () => {
  runTest({
    'DBCS("ABC")': 'ＡＢＣ'
    // 'DBCS("ｦｧｨｩ")': 'ヲァィゥ',
    // 'DBCS(",｡")': '，。',
  });
});

test('DOLLAR', () => {
  runTest({
    'DOLLAR(1234567)': '$1,234,567.00',
    'DOLLAR(12345.67)': '$12,345.67'
  });
});

test('EXACT', () => {
  runTest({
    'EXACT("hello", "hElLo")': false,
    'EXACT("HELLO","HELLO")': true
  });
});

test('FIND', () => {
  runTest({'FIND("h","Hello")': FormulaError.VALUE, 'FIND("o", "hello")': 5});
});

test('FIXED', () => {
  runTest({
    'FIXED(1234.567, 1)': '1,234.6',
    'FIXED(12345.64123213)': '12,345.64',
    'FIXED(12345.64123213, 5)': '12,345.64123',
    'FIXED(12345.64123213, 5, TRUE)': '12345.64123',
    'FIXED(123456789.64, 5, FALSE)': '123,456,789.64000'
  });
});

test('LEFT', () => {
  runTest({
    'LEFT("Salesman")': 'S',
    'LEFT("Salesman",4)': 'Sale'
  });
});

test('LEN', () => {
  runTest({'LEN("Phoenix, AZ")': 11});
});

test('LOWER', () => {
  runTest({'LOWER("E. E. Cummings")': 'e. e. cummings'});
});

test('MID', () => {
  runTest({
    'MID("Fluid Flow",1,5)': 'Fluid',
    'MID("Foo",5,1)': '',
    'MID("Foo",1,5)': 'Foo',
    'MID("Foo",-1,5)': FormulaError.VALUE,
    'MID("Foo",1,-5)': FormulaError.VALUE
  });
});

test('NUMBERVALUE', () => {
  runTest({
    'NUMBERVALUE("3.5%")': 0.035,
    'NUMBERVALUE("2.500,27",",",".")': 2500.27,
    // group separator occurs before the decimal separator
    'NUMBERVALUE("2500.,27",",",".")': 2500.27,
    'NUMBERVALUE("3 50")': 350,
    'NUMBERVALUE("$3 50")': 350,
    'NUMBERVALUE("($3 50)")': -350,
    'NUMBERVALUE("-($3 50)")': FormulaError.VALUE,
    'NUMBERVALUE("($-3 50)")': FormulaError.VALUE,
    'NUMBERVALUE("2500,.27",",",".")': FormulaError.VALUE,
    // group separator occurs after the decimal separator
    'NUMBERVALUE("3.5%",".",".")': FormulaError.VALUE,
    // 'NUMBERVALUE("3.5%",,)': FormulaError.VALUE,
    // decimal separator is used more than once
    'NUMBERVALUE("3..5")': FormulaError.VALUE
  });
});

test('PROPER', () => {
  runTest({
    'PROPER("this is a tiTle")': 'This Is A Title',
    'PROPER("2-way street")': '2-Way Street',
    'PROPER("76BudGet")': '76Budget'
  });
});

test('REPLACE', () => {
  runTest({
    'REPLACE("abcdefghijk",6,5,"*")': 'abcde*k',
    'REPLACE("abcdefghijk",6,0,"*")': 'abcde*fghijk'
  });
});

test('REPT', () => {
  runTest({'REPT("*_",4)': '*_*_*_*_'});
});

test('RIGHT', () => {
  runTest({
    'RIGHT("Salesman")': 'n',
    'RIGHT("Salesman",4)': 'sman'
  });
});

test('SEARCH', () => {
  runTest({
    'SEARCH(",", "abcdef")': FormulaError.VALUE,
    'SEARCH("b", "abcdef")': 2,
    'SEARCH("c*f", "abcdef")': 3,
    'SEARCH("c?f", "abcdef")': FormulaError.VALUE,
    'SEARCH("c?e", "abcdef")': 3,
    'SEARCH("c\\b", "abcabcac\\bacb", 6)': 8
  });
});

test('SUBSTITUTE', () => {
  runTest({
    'SUBSTITUTE("Jim Alateras", "Jim", "James")': 'James Alateras'
  });
});

test('T', () => {
  runTest({'T("*_")': '*_', 'T(19)': ''});
});

test('TEXT', () => {
  runTest({'TEXT(1234.567,"$#,##0.00")': '$1,234.57'});
});

test('TRIM', () => {
  runTest({
    'TRIM("     First Quarter Earnings    ")': 'First Quarter Earnings'
  });
});

test('UNICHAR', () => {
  runTest({
    'UNICHAR(32)': ' ',
    'UNICHAR(66)': 'B',
    'UNICHAR(0)': FormulaError.VALUE,
    'UNICHAR(3333)': 'അ'
  });
});

test('UNICODE', () => {
  runTest({
    'UNICODE(" ")': 32,
    'UNICODE("B")': 66,
    'UNICODE("")': FormulaError.VALUE
  });
});

test('UPPER', () => {
  runTest({'UPPER("E. E. Cummings")': 'E. E. CUMMINGS'});
});

test('ENCODEURL', () => {
  runTest({
    'ENCODEURL("http://www.google.com")': 'http%3A%2F%2Fwww.google.com',
    'ENCODEURL("http://www.google.com/this is a test")':
      'http%3A%2F%2Fwww.google.com%2Fthis%20is%20a%20test'
  });
});

test('VALUE', () => {
  runTest({
    'VALUE("12%")': 0.12
  });
});
