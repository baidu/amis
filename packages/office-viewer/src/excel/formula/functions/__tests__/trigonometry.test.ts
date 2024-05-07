import FormulaError from '../../FormulaError';
import {TestCase, buildEnv, testEvalCases} from './buildEnv';

const data = [
  ['', 1, 2, 3, 4],
  ['string', 3, 4, 5, 6]
];

const env = buildEnv(data);

function runTest(testCase: TestCase) {
  testEvalCases(testCase, env);
}

test('AGGREGATE', () => {
  runTest({
    'AGGREGATE(1, 4, {1, 2, 3})': 2,
    'AGGREGATE(2, 4, {1, 2, 3, "does not count"})': 3,
    'AGGREGATE(3, 4, {1, 2, 3, "counts"})': 4,
    'AGGREGATE(4, 4, {1, 2, 3})': 3,
    'AGGREGATE(5, 4, {1, 2, 3})': 1,
    'AGGREGATE(6, 4, {1, 2, 3})': 6,
    'AGGREGATE(7, 4, {1, 2, 3})': 1,
    'AGGREGATE(8, 4, {1, 2, 3})': 0.816496580927726,
    'AGGREGATE(9, 4, {1, 2, 3})': 6,
    'AGGREGATE(10, 4, {1, 2, 3})': 1,
    'AGGREGATE(11, 4, {1, 2, 3})': 0.6666666666666666,
    'AGGREGATE(12, 4, {1, 2, 3})': 2,
    'AGGREGATE(13, 4, {1, 2, 3})': 1,
    'AGGREGATE(14, 4, {1, 2, 3}, 2)': 2,
    'AGGREGATE(15, 4, {1, 2, 3}, 2)': 2,
    'AGGREGATE(16, 4, {1, 2, 3}, 0.4)': 1.8,
    'AGGREGATE(17, 4, {1, 2, 3}, 2)': 2,
    'AGGREGATE(18, 4, {1, 2, 3}, 0.4)': 1.6,
    'AGGREGATE(19, 4, {1, 2, 3}, 2)': 2,
    'AGGREGATE("invalid", 4, {1, 2, 3}, 2)': FormulaError.VALUE
  });
});

test('ACOS', () => {
  runTest({
    'ACOS(-0.5)': 2.094395102,
    'ACOS(-0.5)*180/PI()': 120,
    'DEGREES(ACOS(-0.5))': 120,
    'ACOS(-1.5)': FormulaError.NUM
  });
});

test('ACOSH', () => {
  runTest({
    'ACOSH(1)': 0,
    'ACOSH(10)': 2.993222846,
    'ACOSH(0.99)': FormulaError.NUM
  });
});

test('ACOT', () => {
  runTest({'ACOT(2)': 0.463647609, 'ACOT(-2)': 2.677945045});
});

test('ACOTH', () => {
  runTest({
    'ACOTH(-5)': -0.202732554,
    'ACOTH(6)': 0.168236118,
    'ACOTH(0.99)': FormulaError.NUM
  });
});

test('ASIN', () => {
  runTest({
    'ASIN(-0.5)': -0.523598776,
    'ASIN(-0.5)*180/PI()': -30,
    'DEGREES(ASIN(-0.5))': -30,
    'ASIN(-1.5)': FormulaError.NUM
  });
});

test('ASINH', () => {
  runTest({
    'ASINH(-2.5)': -1.647231146,
    'ASINH(10)': 2.99822295
  });
});

test('ATAN', () => {
  runTest({
    'ATAN(0)': 0,
    'ATAN(1)': 0.785398163,
    'ATAN(1)*180/PI()': 45,
    'DEGREES(ATAN(1))': 45
  });
});

test('ATAN2', () => {
  runTest({
    'ATAN2(1, 1)': 0.785398163,
    'ATAN2(-1, -1)': -2.35619449,
    'ATAN2(-1, -1)*180/PI()': -135,
    'DEGREES(ATAN2(-1, -1))': -135,
    'ATAN2(0,0)': FormulaError.DIV0
  });
});

test('ATANH', () => {
  runTest({
    'ATANH(0.76159416)': 1.00000001,
    'ATANH(-0.1)': -0.100335348,
    'ATANH(-1.1)': FormulaError.NUM
  });
});

test('COS', () => {
  runTest({
    'COS(1.047)': 0.500171075,
    'COS(60*PI()/180)': 0.5,
    'COS(RADIANS(60))': 0.5,
    'COS(2^27-1)': -0.293388404,
    'COS(2^27)': FormulaError.NUM
  });
});

test('COSH', () => {
  runTest({
    'COSH(4)': 27.30823284,
    'COSH(EXP(1))': 7.610125139,
    'COSH(0)': 1,
    'COSH(800)': FormulaError.NUM
  });
});

test('COT', () => {
  runTest({
    'COT(30)': -0.156119952,
    'COT(45)': 0.617369624,
    'COT(2^27-1)': 0.306893777,
    'COT(2^27)': FormulaError.NUM,
    'COT(0)': FormulaError.DIV0
  });
});

test('COTH', () => {
  runTest({
    'COTH(2)': 1.037314721,
    'COTH(0)': FormulaError.DIV0,
    'COTH(2^100)': 1, // no value error here
    'COTH(-2^100)': 1
  });
});

test('CSC', () => {
  runTest({
    'CSC(15)': 1.537780562,
    'CSC(2^27-1)': -1.046032404,
    'CSC(2^27)': FormulaError.NUM
  });
});

test('CSCH', () => {
  runTest({
    'CSCH(1.5)': 0.469642441,
    'CSCH(2^100)': 0,
    'CSCH(-2^100)': 0,
    'CSCH(0)': FormulaError.DIV0
  });
});

test('SEC', () => {
  runTest({
    'SEC(45)': 1.903594407,
    'SEC(2^27-1)': -3.408451009,
    'SEC(2^27)': FormulaError.NUM
  });
});

test('SECH', () => {
  runTest({
    'SECH(45)': 5.7250371611e-20,
    'SECH(2^100)': 0,
    'SECH(-2^100)': 0,
    'SECH(0)': 1
  });
});

test('SIN', () => {
  runTest({
    'SIN(PI())': 0,
    'SIN(PI()/2)': 1,
    'SIN(30*PI()/180)': 0.5,
    'SIN(RADIANS(30))': 0.5,
    'SIN(2^27-1)': -0.955993329,
    'SIN(2^27)': FormulaError.NUM
  });
});

test('SINH', () => {
  runTest({
    '2.868*SINH(0.0342*1.03)': 0.101049063,
    'SINH(800)': FormulaError.NUM
  });
});

test('TAN', () => {
  runTest({
    'TAN(0.785)': 0.99920399,
    'TAN(45*PI()/180)': 1,
    'TAN(RADIANS(45))': 1,
    'TAN(0)': 0,
    'TAN(PI())': -1.22515e-16,
    'TAN(2^27-1)': 3.258456426,
    'TAN(2^27)': FormulaError.NUM
  });
});

test('TANH', () => {
  runTest({
    'TANH(-2)': -0.96402758,
    'TANH(0)': 0,
    'TANH(0.5)': 0.462117157,
    'TANH(2^100)': 1,
    'TANH(-2^100)': 1
  });
});
