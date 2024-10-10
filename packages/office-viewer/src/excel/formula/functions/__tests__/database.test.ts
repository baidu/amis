import FormulaError from '../../FormulaError';
import {getDatabaseResult} from '../database';
import {regFunc} from '../functions';
import {TestCase, buildEnv, testEvalCases} from './buildEnv';

const data = [
  ['Tree', 'Height', 'Age', 'Yield', 'Profit', 'Height'],
  ['=Apple', '>10', , , , '<16'],
  ['=Pear', , , ,],
  ['Tree', 'Height', 'Age', 'Yield', 'Profit'],
  ['Apple', 18, 20, 14, 105],
  ['Pear', 12, 12, 10, 96],
  ['Cherry', 13, 14, 9, 105],
  ['Apple', 14, 15, 10, 75],
  ['Pear', 9, 8, 8, 76.8],
  ['Apple', 8, 9, 6, 45]
];

const env = buildEnv(data);

function runTest(testCase: TestCase) {
  testEvalCases(testCase, env);
}

test('getDataBaseResult', () => {
  const data = [
    ['Tree', 'Height', 'Age', 'Yield', 'Profit'],
    ['Apple', 18, 20, 14, 105],
    ['Pear', 12, 12, 10, 96],
    ['Cherry', 13, 14, 9, 105],
    ['Apple', 14, 15, 10, 75],
    ['Pear', 9, 8, 8, 76.8],
    ['Apple', 8, 9, 6, 45]
  ];

  const filter = [
    ['Tree', 'Height', 'Age', 'Yield', 'Profit', 'Height'],
    ['=Apple', '>10', , , , '<16'],
    ['=Pear', , , ,]
  ];

  const filterApple = [
    ['Tree', 'Height'],
    ['=Apple', '>10']
  ];

  expect(getDatabaseResult(data, filterApple, 'Yield')).toEqual([14, 10]);
});

test('DAVERAGE', () => {
  runTest({'DAVERAGE(A4:E10, "Yield", A1:B2)': 12});
});
