/**
 * 用例来自 fast-formula-parser
 */

import FormulaError from '../../FormulaError';
import {TestCase, buildEnv, testEvalCases} from './buildEnv';

const data = [
  [1, 2, 3, 4, 5],
  [100000, 7000, 250000, 5, 6],
  [200000, 14000, 4, 5, 6],
  [300000, 21000, 4, 5, 6],
  [400000, 28000, 4, 5, 6],
  ['string', 3, 4, 5, 6],
  // for SUMIF ex2
  ['Vegetables', 'Tomatoes', 2300, 5, 6], // row 7
  ['Vegetables', 'Celery', 5500, 5, 6], // row 8
  ['Fruits', 'Oranges', 800, 5, 6], // row 9
  ['', 'Butter', 400, 5, 6], // row 10
  ['Vegetables', 'Carrots', 4200, 5, 6], // row 11
  ['Fruits', 'Apples', 1200, 5, 6], // row 12
  ['1'],
  [2, 3, 9, 1, 8, 7, 5],
  [6, 5, 11, 7, 5, 4, 4]
];

const env = buildEnv(data);

function runTest(testCase: TestCase) {
  testEvalCases(testCase, env);
}

test('ABS', () => {
  runTest({
    'ABS(-1)': 1,
    'ABS(1)': 1,
    'ABS(0)': 0,
    'ABS("a")': FormulaError.VALUE
  });
});

test('ARABIC', () => {
  runTest({
    'ARABIC("XIV")': 14,
    'ARABIC("LVII")': 57,
    'ARABIC("")': 0,
    'ARABIC("LVIIA")': FormulaError.VALUE
  });
});

test('BASE', () => {
  runTest({
    'BASE(7,2)': '111',
    'BASE(100,16)': '64',
    'BASE(15,2,10)': '0000001111',
    'BASE(2^53-1,36)': '2GOSA7PA2GV',

    'BASE(-1,2)': FormulaError.NUM,
    'BASE(2^53-1,2)': '11111111111111111111111111111111111111111111111111111',
    'BASE(2^53,2)': FormulaError.NUM,

    'BASE(7,1)': FormulaError.NUM,
    'BASE(7,37)': FormulaError.NUM,

    'BASE(7,2,-1)': FormulaError.NUM,
    'BASE(7,2,0)': '111',
    'BASE(7,2,2)': '111',
    'BASE(7,2,5)': '00111'
  });
});

test('CEILING', () => {
  runTest({
    'CEILING(2.5, 1)': 3,
    'CEILING(-2.5, -2)': -4,
    'CEILING(-2.5, 2)': -2,
    'CEILING(1.5, 0.1)': 1.5,
    'CEILING(0.234, 0.01)': 0.24,
    'CEILING(1.5, 0)': 0,
    'CEILING(2^1024, 1)': FormulaError.NUM
  });
});

test('CEILING.MATH', () => {
  runTest({
    'CEILING.MATH(24.3,5)': 25,
    'CEILING.MATH(6.7)': 7,
    'CEILING.MATH(-6.7)': -7,
    'CEILING.MATH(-8.1,2)': -8,
    'CEILING.MATH(-5.5,2,-1)': -6
  });
});

test('CEILING.PRECISE', () => {
  runTest({
    'CEILING.PRECISE(4.3)': 5,
    'CEILING.PRECISE(-4.3)': -4,
    'CEILING.PRECISE(4.3, 2)': 6,
    'CEILING.PRECISE(4.3,-2)': 6,
    'CEILING.PRECISE(-4.3,2)': -4,
    'CEILING.PRECISE(-4.3,-2)': -4
  });
});

test('COMBIN', () => {
  runTest({
    'COMBIN(8,2)': 28,
    'COMBIN(-1,2)': FormulaError.NUM,
    'COMBIN(1,2)': FormulaError.NUM,
    'COMBIN(1,-2)': FormulaError.NUM
  });
});

test('COMBINA', () => {
  runTest({
    'COMBINA(4,3)': 20,
    'COMBINA(0,0)': 1,
    'COMBINA(1,0)': 1,
    'COMBINA(-1,2)': FormulaError.NUM,
    'COMBINA(1,2)': 1,
    'COMBINA(1,-2)': FormulaError.NUM
  });
});

test('DECIMAL', () => {
  runTest({
    'DECIMAL("FF",16)': 255,
    'DECIMAL("8000000000",16)': 549755813888,
    'DECIMAL(111,2)': 7,
    'DECIMAL("zap",36)': 45745,
    'DECIMAL("zap",2)': FormulaError.NUM,
    'DECIMAL("zap",37)': FormulaError.NUM,
    'DECIMAL("zap",1)': FormulaError.NUM
  });
});

test('DEGREES', () => {
  runTest({
    'DEGREES(PI())': 180,
    'DEGREES(PI()/2)': 90,
    'DEGREES(PI()/4)': 45
  });
});

test('EVEN', () => {
  runTest({
    'EVEN(1.5)': 2,
    'EVEN(3)': 4,
    'EVEN(2)': 2,
    'EVEN(-1)': -2
  });
});

test('EXP', () => {
  runTest({
    'EXP(1)': 2.71828183
  });
});

test('FACT', () => {
  runTest({
    'FACT(5)': 120,
    'FACT(150)': 5.7133839564458575e262, // more accurate than excel...
    'FACT(150) + 1': 5.7133839564458575e262 + 1, // memorization
    'FACT(1.9)': 1,
    'FACT(0)': 1,
    'FACT(-1)': FormulaError.NUM,
    'FACT(1)': 1
  });
});

test('FACTDOUBLE', () => {
  runTest({
    'FACTDOUBLE(6)': 48,
    'FACTDOUBLE(6) + 1': 49, // memorization
    'FACTDOUBLE(7)': 105,
    'FACTDOUBLE(0)': 1,
    'FACTDOUBLE(-1)': 1,
    'FACTDOUBLE(-2)': FormulaError.NUM,
    'FACTDOUBLE(1)': 1
  });
});

test('FLOOR', () => {
  runTest({
    'FLOOR(0,)': 0,
    'FLOOR(12,0)': 0,
    'FLOOR(3.7,2)': 2,
    'FLOOR(-2.5,-2)': -2,
    'FLOOR(-2.5,2)': -4,
    'FLOOR(2.5,-2)': FormulaError.NUM,
    'FLOOR(1.58,0.1)': 1.5,
    'FLOOR(0.234,0.01)': 0.23,
    'FLOOR(-8.1,2)': -10
  });
});

test('FLOOR.MATH', () => {
  runTest({
    'FLOOR.MATH(0)': 0,
    'FLOOR.MATH(12, 0)': 0,
    'FLOOR.MATH(24.3,5)': 20,
    'FLOOR.MATH(6.7)': 6,
    'FLOOR.MATH(-8.1,2)': -10,
    'FLOOR.MATH(-5.5,2,-1)': -4,
    'FLOOR.MATH(-5.5,2,1)': -4,
    'FLOOR.MATH(-5.5,2,)': -6,
    'FLOOR.MATH(-5.5,2)': -6,
    'FLOOR.MATH(-5.5,-2)': -6,
    'FLOOR.MATH(5.5,2)': 4,
    'FLOOR.MATH(5.5,-2)': 4,
    'FLOOR.MATH(24.3,-5)': 20,
    'FLOOR.MATH(-8.1,-2)': -10
  });
});

test('FLOOR.PRECISE', () => {
  runTest({
    'FLOOR.PRECISE(-3.2,-1)': -4,
    'FLOOR.PRECISE(3.2, 1)': 3,
    'FLOOR.PRECISE(-3.2, 1)': -4,
    'FLOOR.PRECISE(3.2,-1)': 3,
    'FLOOR.PRECISE(3.2)': 3,
    'FLOOR.PRECISE(0)': 0,
    'FLOOR.PRECISE(3.2, 0)': 0
  });
});

test('GCD', () => {
  runTest({
    'GCD(5, 2)': 1,
    'GCD(24, 36)': 12,
    'GCD(7, 1)': 1,
    'GCD(5, 0)': 5,
    'GCD(123, 0)': 123,
    'GCD(128, 80, 44)': 4,
    'GCD(128, 80, 44,)': 4,
    'GCD(128, 80, 44, 2 ^ 53)': FormulaError.NUM, // excel parse this as #NUM!
    'GCD("a")': FormulaError.VALUE,
    'GCD(5, 2, (A1))': 1,
    'GCD(5, 2, A1:E1)': 1,
    'GCD(5, 2, (A1:E1))': 1,
    // TODO: 目前实现上当成数组所以其实是支持的
    // 'GCD(5, 2, (A1, A2))': FormulaError.VALUE, // does not support union
    'GCD(5, 2, {3, 7})': 1,
    'GCD(5, 2, {3, "7"})': 1,
    'GCD(5, 2, {3, "a"})': FormulaError.VALUE,
    'GCD(5, 2, {3, "7"}, TRUE)': FormulaError.VALUE
  });
});

test('INT', () => {
  runTest({'INT(0)': 0, 'INT(8.9)': 8, 'INT(-8.9)': -9});
});

test('ISO.CEILING', () => {
  runTest({
    'ISO.CEILING(4.3)': 5,
    'ISO.CEILING(-4.3)': -4,
    'ISO.CEILING(4.3, 2)': 6,
    'ISO.CEILING(4.3,-2)': 6,
    'ISO.CEILING(-4.3,2)': -4,
    'ISO.CEILING(-4.3,-2)': -4
  });
});

test('LCM', () => {
  runTest({
    'LCM("a")': FormulaError.VALUE,
    'LCM(5, 2)': 10,
    'LCM(24, 36)': 72,
    'LCM(50,56,100)': 1400,
    'LCM(50,56,100,)': 1400,
    'LCM(128, 80, 44, 2 ^ 53)': FormulaError.NUM, // excel parse this as #NUM!
    'LCM(5, 2, (A1))': 10,
    'LCM(5, 2, A1:E1)': 60,
    'LCM(5, 2, (A1:E1))': 60,
    // 'LCM(5, 2, (A1, A2))': FormulaError.VALUE, // does not support union
    'LCM(5, 2, {3, 7})': 210,
    'LCM(5, 2, {3, "7"})': 210,
    'LCM(5, 2, {3, "a"})': FormulaError.VALUE,
    'LCM(5, 2, {3, "7"}, TRUE)': FormulaError.VALUE
  });
});

test('LN', () => {
  runTest({'LN(86)': 4.454347296253507, 'LN(EXP(1))': 1, 'LN(EXP(3))': 3});
});

test('LOG', () => {
  runTest({'LOG(10)': 1, 'LOG(8, 2)': 3, 'LOG(86, EXP(1))': 4.454347296253507});
});

test('LOG10', () => {
  runTest({
    'LOG10(86)': 1.9344984512435677,
    'LOG10(10)': 1,
    'LOG10(100000)': 5,
    'LOG10(10^5)': 5
  });
});

test('MDETERM', () => {
  runTest({
    'MDETERM({3,6,1;1,1,0;3,10,2})': 1,
    'MDETERM({3,6;1,1})': -3,
    'MDETERM({6})': 6,
    'MDETERM({1,3,8,5;1,3,6,1})': FormulaError.VALUE
  });
});

test('MMULT', () => {
  runTest({
    'MMULT({1,3;7,2}, {2,0;0,2})': [
      [2, 6],
      [14, 4]
    ],
    'MMULT({1,3;7,2;1,1}, {2,0;0,2})': [
      [2, 6],
      [14, 4],
      [2, 2]
    ],
    'MMULT({1,3;"r",2}, {2,0;0,2})': FormulaError.VALUE,
    'MMULT({1,3;7,2}, {2,0;"b",2})': FormulaError.VALUE
  });
});

test('MOD', () => {
  runTest({
    'MOD(3, 2)': 1,
    'MOD(-3, 2)': 1,
    'MOD(3, -2)': -1,
    'MOD(-3, -2)': -1,
    'MOD(-3, 0)': FormulaError.DIV0
  });
});

test('MROUND', () => {
  runTest({
    'MROUND(10, 1)': 10,
    'MROUND(10, 3)': 9,
    'MROUND(10, 0)': 0,
    'MROUND(-10, -3)': -9,
    'MROUND(1.3, 0.2)': 1.4,
    'MROUND(5, -2)': FormulaError.NUM,
    'MROUND(6.05,0.1)': 6.0, // same as excel, differ from google sheets
    'MROUND(7.05,0.1)': 7.1
  });
});

test('MULTINOMIAL', () => {
  runTest({
    'MULTINOMIAL({1,2}, E1, A1:D1)': 92626934400,
    'MULTINOMIAL(2, 3, 4)': 1260,
    'MULTINOMIAL(2, 3, -4)': FormulaError.NUM
  });
});

test('MUNIT', () => {
  runTest({
    'MUNIT(3)': [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ],
    'MUNIT(2)': [
      [1, 0],
      [0, 1]
    ],
    'MUNIT(1)': [[1]]
  });
});

test('ODD', () => {
  runTest({
    'ODD(0)': 1,
    'ODD(1.5)': 3,
    'ODD(3)': 3,
    'ODD(2)': 3,
    'ODD(-1)': -1,
    'ODD(-2)': -3
  });
});

test('PI', () => {
  runTest({'PI()': Math.PI});
});

test('POWER', () => {
  runTest({
    'POWER(5,2)': 25,
    'POWER(98.6,3.2)': 2401077.22206958,
    'POWER(4,5/4)': 5.656854249
  });
});

test('PRODUCT', () => {
  runTest({
    'PRODUCT(1,2,3,4,5)': 120,
    'PRODUCT(1,2,3,4,5, "2")': 240,
    'PRODUCT(A1:E1)': 120,
    'PRODUCT((A1, B1:E1))': 120,
    'PRODUCT(1,2,3,4,5, A1, {1,2})': 240
  });
});

test('QUOTIENT', () => {
  runTest({
    'QUOTIENT(5, 2)': 2,
    'QUOTIENT(4.5, 3.1)': 1,
    'QUOTIENT(-10, 3)': -3,
    'QUOTIENT(-10, -3)': 3
  });
});

test('RADIANS', () => {
  runTest({'RADIANS(270)': 4.71238898, 'RADIANS(0)': 0});
});

test('RAND', () => {
  runTest({'RAND() > 0': true});
});

test('RANK', () => {
  runTest({
    'RANK(7, {7,3.5,3.5,1,2}, 1)': 5,
    'RANK(3.5, {7,3.5,3.5,1,2}, 1)': 3
  });
  runTest({'RANK(3.5, {7,3.5,3.5,1,2}, 1)': 3});
});

test('RANK.EQ', () => {
  runTest({
    'RANK.EQ(7, {7,3.5,3.5,1,2}, 1)': 5,
    'RANK.EQ(3.5, {7,3.5,3.5,1,2}, 1)': 3,
    'RANK.EQ(2, {7,3.5,3.5,1,2})': 4
  });
});

test('RANK.AVG', () => {
  runTest({
    'RANK.AVG(94,{89,88,92,101,94,97,95})': 4
  });
});

test('RANDBETWEEN', () => {
  runTest({'RANDBETWEEN(-1,1) >= -1': true});
});

test('ROMAN', () => {
  runTest({'ROMAN(499,0)': 'CDXCIX'});
});

test('ROUND', () => {
  runTest({
    'ROUND(2.15, 0)': 2,
    'ROUND(2.15, 1)': 2.2,
    'ROUND(2.149, 1)': 2.1,
    'ROUND(-1.475, 2)': -1.48,
    'ROUND(21.5, -1)': 20,
    'ROUND(626.3,-3)': 1000,
    'ROUND(1.98, -1)': 0,
    'ROUND(-50.55,-2)': -100
  });
});

test('ROUNDDOWN', () => {
  runTest({
    'ROUNDDOWN(3.2, 0)': 3,
    'ROUNDDOWN(76.9,0)': 76,
    'ROUNDDOWN(3.14159, 3)': 3.141,
    'ROUNDDOWN(-3.14159, 1)': -3.1,
    'ROUNDDOWN(31415.92654, -2)': 31400
  });
});

test('ROUNDUP', () => {
  runTest({
    'ROUNDUP(3.2,0)': 4,
    'ROUNDUP(76.9,0)': 77,
    'ROUNDUP(3.14159, 3)': 3.142,
    'ROUNDUP(-3.14159, 1)': -3.2,
    'ROUNDUP(31415.92654, -2)': 31500
  });
});

test('SERIESSUM', () => {
  runTest({
    'SERIESSUM(PI()/4,0,2,{1, -0.5, 0.041666667, -0.001388889})': 0.707103215
  });
});

test('SIGN', () => {
  runTest({
    'SIGN(10)': 1,
    'SIGN(4-4)': 0,
    'SIGN(-0.00001)': -1
  });
});

test('SQRT', () => {
  runTest({
    'SQRT(16)': 4,
    'SQRT(-16)': FormulaError.NUM,
    'SQRT(ABS(-16))': 4
  });
});

test('SQRTPI', () => {
  runTest({
    'SQRTPI(1)': 1.772453851,
    'SQRTPI(2)': 2.506628275,
    'SQRTPI(-1)': FormulaError.NUM
  });
});

test('SUM', () => {
  runTest({
    'SUM(1,2,3)': 6,
    'SUM(A1:C1, C1:E1)': 18,
    'SUM((A1:C1, C1:E1))': 18,
    'SUM((A1:C1, C1:E1), A1)': 19,
    // TODO: 为什么不一致
    // 'SUM((A1:C1, C1:E1), A13)': 18,
    'SUM("1", {1})': 2,
    'SUM("1", {"1"})': 2,
    'SUM("1", {"1"},)': 2,
    'SUM("1", {"1"},TRUE)': 2
  });
});

// TODO: 补齐其他测试
test('SUBTOTAL', () => {
  runTest({
    'SUBTOTAL(9, A1:C1, C1:E1)': 18
  });
});

test('SUMIF', () => {
  runTest({
    'SUMIF(A1:E1, ">1")': 14,
    'SUMIF(A2:A5,">160000",B2:B5)': 63000,
    'SUMIF(A2:A5,">160000")': 900000,
    'SUMIF(A2:A5,300000,B2:B5)': 21000,
    'SUMIF(A2:A5,">" & C2,B2:B5)': 49000,
    'SUMIF(A7:A12,"Fruits",C7:C12)': 2000,
    'SUMIF(A7:A12,"Vegetables",C7:C12)': 12000,
    'SUMIF(B7:B12,"*es",C7:C12)': 4300,
    'SUMIF(A7:A12,"",C7:C12)': 400
  });
});

test('SUMIFS', () => {
  runTest({
    'SUMIFS({1, 2, 3}, {4, 5, 6}, ">4", {7, 8, 9}, "<9")': 2,
    'SUMIFS({1, 2, 3}, {4, 5, 6}, ">4", {7, 8, 9}, "*")': 5
  });
});

test('SUMPRODUCT', () => {
  runTest({
    'SUMPRODUCT({1,"12";7,2}, {2,1;5,2})': 53,
    'SUMPRODUCT({1,12;7,2}, {2,1;5,2})': 53,
    'SUMPRODUCT({1,12;7,2}, {2,1;5,"2"})': 53,
    'SUMPRODUCT({1,12;7,2}, {2,1;5,2;1,1})': FormulaError.VALUE
  });
});

test('SUMSQ', () => {
  runTest({
    'SUMSQ(3, 4)': 25,
    'SUMSQ(3, 4, A1)': 26
    // 'SUMSQ(3, 4, A1, A13)': 26
  });
});

test('SUMX2MY2', () => {
  runTest({
    'SUMX2MY2(A14:G14,A15:G15)': -55,
    'SUMX2MY2({2, 3, 9, 1, 8, 7, 5}, {6, 5, 11, 7, 5, 4, 4})': -55,
    'SUMX2MY2(A14:G13,A15:G15)': FormulaError.NA
  });
});

test('SUMX2PY2', () => {
  runTest({
    'SUMX2PY2(A14:G14,A15:G15)': 521,
    'SUMX2PY2({2,3,9,1,8,7,5}, {6,5,11,7,5,4,4})': 521,
    'SUMX2PY2(A14:G13,A15:G15)': FormulaError.NA
  });
});

test('SUMXMY2', () => {
  runTest({
    'SUMXMY2(A14:G14,A15:G15)': 79,
    'SUMXMY2({2,3,9,1,8,7,5}, {6,5,11,7,5,4,4})': 79,
    'SUMXMY2(A14:G13,A15:G15)': FormulaError.NA
  });
});

test('TRUNC', () => {
  runTest({
    'TRUNC(8.9)': 8,
    'TRUNC(-8.9)': -8,
    'TRUNC(0.45)': 0
  });
});
