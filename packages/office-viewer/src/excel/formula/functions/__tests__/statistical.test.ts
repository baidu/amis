import FormulaError from '../../FormulaError';
import {TestCase, buildEnv, testEvalCases} from './buildEnv';

const data = [
  ['', true, 1, 'TRUE1', true],
  ['apples', 32, '{1,2}', 5, 6],
  ['oranges', 54, 4, 5, 6],
  ['peaches', 75, 4, 5, 6],
  ['apples', 86, 4, 5, 6],
  ['string', 3, 4, 5, 6],
  [1, 2, 3, 4, 5, 6, 7], // row 7
  [100000, 7000], //row 8
  [200000, 14000], //row 9
  [300000, 21000], //row 10
  [400000, 28000], //row 11

  ['East', 45678], //row 12
  ['West', 23789], //row 13
  ['North', -4789], //row 14
  ['South (New Office)', 0], //row 15
  ['MidWest', 9678], //row 16
  [undefined, true, 1, 2]
];

const env = buildEnv(data);

function runTest(testCase: TestCase) {
  testEvalCases(testCase, env);
}

test('AVEDEV', () => {
  runTest({
    'AVEDEV({4,1,6,7,5,4,3})': 1.469387755,
    'AVEDEV({4,1,6,7,5,4,3},(A7,B7),"1")': 1.8,
    'AVEDEV({4,1,6,7,5,4,3,TRUE},(A7,B7),"1")': 1.8,
    'AVEDEV({4,1,6,7,5,4,3,TRUE},(A7,B7),"1",1)': 1.83471074380165
  });
});

test('AVERAGE', () => {
  runTest({
    'AVERAGE({TRUE,1,2,"12"}, 3)': 2,
    // 'AVERAGE((A7, B7), 3)': 2,
    'AVERAGE(TRUE, "3")': 2
    // 'AVERAGE(TRUE, "a")': FormulaError.VALUE
  });
});

test('AVERAGEIF', () => {
  runTest({
    'AVERAGEIF({2, 4, 8, 16}, ">5")': 12
  });
});

test('AVERAGEIFS', () => {
  runTest({
    'AVERAGEIFS({2, 4, 8, 16}, {1, 2, 3, 4}, ">2")': 12
  });
});

test('AVERAGEA', () => {
  runTest({
    // 'AVERAGEA((A7, B7), 3)': 2,
    'AVERAGEA(TRUE, "3")': 2,
    'AVERAGEA({1,2,"12"}, 3)': 1.5,
    'AVERAGEA({TRUE,1,2,"3",""}, 3, TRUE, "1", 0)': 1
  });
});

test('COUNT', () => {
  runTest({
    'COUNT(A2:A5, 123)': 1,
    'COUNT(A2:A5)': 0,
    'COUNT(A1:E1)': 1,
    'COUNT(A2:E2)': 3,
    'COUNT(A2:E2, A1:E1)': 4,
    'COUNT((A2:E2, A1:E1))': 4
  });
});

test('COUNTA', () => {
  runTest({
    'COUNTA({39790,19,22.24,TRUE,#DIV/0!})': 5
  });
});

test('COUNTIF', () => {
  runTest({
    'COUNTIF(B1:E1, {1,3,4})': 1,
    'COUNTIF(C2:E2, "{1,2}")': 1,
    'COUNTIF(C2:E2, "={1,2}")': 1,
    'COUNTIF(C2:E2, {1,2})': 0,
    'COUNTIF(B1:E1,TRUE)': 2,
    'COUNTIF(A2:A5, "apples")': 2,
    'COUNTIF(A2:A5,A4)': 1,
    'COUNTIF(A2:A5,A2)+COUNTIF(A2:A5,A3)': 3,
    'COUNTIF(B2:B5,">55")': 2,
    'COUNTIF(B2:B5,"<>"&B4)': 3,
    'COUNTIF(B2:B5,">=32")-COUNTIF(B2:B5,">85")': 3,
    'COUNTIF(A2:A5,"*")': 4,
    'COUNTIF(A2:A5,"?????es")': 2,
    'COUNTIF(B1:E1,"=TRUE")': 2,
    'COUNTIF(B1:E1,"TRUE")': 2,
    'COUNTIF(B1:E1,"TRUE1")': 1,
    'COUNTIF(B1:E1,"=TRUE1")': 1
  });
});

test('COUNTIFS', () => {
  runTest({
    'COUNTIFS({1, 3, ""}, ">1")': 1
  });
});

test('LARGE', () => {
  const testData = '{3,5,3,5,4,4,2,4,6,7}';
  runTest({
    [`LARGE(${testData}, 3)`]: 5,
    [`LARGE(${testData}, 7)`]: 4
  });
});

test('SMALL', () => {
  // 来自官方的例子
  runTest({
    'SMALL({3,4,5,2,3,4,6,4,7}, 4)': 4,
    'SMALL({1,4,8,3,7,12,54,8,23}, 2)': 3
  });
});

test('MAX', () => {
  runTest({
    'MAX({1,2,3})': 3
  });
});

test('MAXA', () => {
  runTest({
    'MAXA({0.2, TRUE})': 1
  });
});

test('MAXIFS', () => {
  runTest({
    'MAXIFS({2, 4, 8, 16}, {1, 4, 4, 1}, ">2")': 8,
    'MAXIFS({2, 4, 8, 16}, {1, 4, 4, 1}, "*")': 16,
    'MAXIFS({2, 4, 8, 16}, {1, 4, 4, 1}, ">2", {1, 4, 4, 4}, ">2")': 8
  });
});

test('MEDIAN', () => {
  runTest({
    'MEDIAN({1,2,3,4,5})': 3,
    'MEDIAN({1,2,3,4,5,6})': 3.5
  });
});

test('MIN', () => {
  runTest({
    'MIN({1,2,3})': 1
  });
});

test('MINIFS', () => {
  runTest({
    'MINIFS({2, 4, 8, 16}, {1, 4, 4, 1}, ">2")': 4
  });
});

test('MINA', () => {
  runTest({
    'MINA({2, TRUE})': 1
  });
});

test('MODE.MULT', () => {
  runTest({
    'MODE.MULT({1, 2, 3, 4, 3, 2, 1, 2, 3, 5, 6, 1})': [2, 3, 1]
  });
});

test('MODE.SNGL', () => {
  runTest({
    'MODE.SNGL({5.6, 4, 4, 3, 2, 4})': 4
  });
});

test('BETA.DIST', () => {
  runTest({
    'BETA.DIST(2,8,10,TRUE,1,3)': 0.6854705810547,
    'BETA.DIST(2,8,10,FALSE,1,3)': 1.4837646484375,
    'BETA.DIST(6,8,10,FALSE,1,7)': 0.0008976224783
  });
});

test('BETA.INV', () => {
  runTest({'BETA.INV(0.6854705810547,8,10,1,3)': 2});
});

test('BINOM.DIST', () => {
  runTest({
    'BINOM.DIST(6,10,0.5,FALSE)': 0.205078125,
    'BINOM.DIST(6,10,0.5,TRUE)': 0.828125
  });
});

test('BINOM.DIST.RANGE', () => {
  runTest({
    'BINOM.DIST.RANGE(60,0.75,48)': 0.083974967429,
    'BINOM.DIST.RANGE(60,0.75,45,50)': 0.5236297934719
  });
});

test('BINOM.INV', () => {
  runTest({'BINOM.INV(6, 0.6, 0.75)': 4});
});

test('CHISQ.DIST', () => {
  runTest({
    'CHISQ.DIST(0.5,1,TRUE)': 0.520499877813,
    'CHISQ.DIST(2,3,FALSE)': 0.2075537487103
  });
});

test('CHISQ.DIST.RT', () => {
  runTest({
    'CHISQ.DIST.RT(18.307,10)': 0.0500005890914
  });
});

test('CHISQ.INV', () => {
  runTest({
    'CHISQ.INV(0.93,1)': 3.2830202867595,
    'CHISQ.INV(0.6,2)': 1.8325814637483
  });
});

test('CHISQ.INV.RT', () => {
  runTest({
    'CHISQ.INV.RT(0.050001,10)': 18.3069734569611,
    'CHISQ.INV.RT(0.6,2)': 1.021651247532
  });
});

test('CHISQ.TEST', () => {
  runTest({
    'CHISQ.TEST({58,35;11,25;10,23},{43.35,47.65;17.56,18.44;16.09,0})':
      FormulaError.DIV0,
    'CHISQ.TEST({58,35;11,25;10,23},{43.35,47.65;17.56,18.44;16.09,16.91})': 0.0001513457663,
    'CHISQ.TEST({58,35;11,25;10,23},{43.35,47.65;17.56,18.44;16.09,"16.91"})': 0.000453139
  });
});

test('CONFIDENCE.NORM', () => {
  runTest({
    'CONFIDENCE.NORM(0.05,2.5,50)': 0.6929519121748
  });
});

test('CONFIDENCE.T', () => {
  runTest({
    'CONFIDENCE.T(0.05,1,50)': 0.2841968554957
  });
});

test('CORREL', () => {
  runTest({
    'CORREL({3,2,4,5,6},{9,7,12,15,17})': 0.99705448550158
  });
});

test('COVARIANCE.P', () => {
  runTest({
    'COVARIANCE.P({3,2,4,5,6},{9,7,12,15,17})': 5.2
  });
});

test('COVARIANCE.S', () => {
  runTest({
    'COVARIANCE.S(3,9)': FormulaError.DIV0,
    'COVARIANCE.S({2,4,8},{5,11,12})': 9.666666666667,
    'COVARIANCE.S({3,2,4,5,6},{9,7,12,15,17})': 6.5
  });
});

test('DEVSQ', () => {
  runTest({
    'DEVSQ(1,2,3)': 2,
    'DEVSQ(1,"2",{1,2},1)': 1.2
    // 不知道啥情况
    // 'DEVSQ(1,"2",{1,2,"2"},1,TRUE)': 1.3333333333
  });
});

test('EXPON.DIST', () => {
  runTest({
    'EXPON.DIST(0.2,10,TRUE)': 0.864664716763387,
    'EXPON.DIST(0.2,10,FALSE)': 1.35335283236613,
    'EXPON.DIST(0.-2,10,FALSE)': FormulaError.NUM,
    'EXPON.DIST(0.2,-10,FALSE)': FormulaError.NUM,
    'EXPON.DIST(0.2,0.0,FALSE)': FormulaError.NUM
  });
});

test('F.DIST', () => {
  runTest({
    'F.DIST(15,6,4,TRUE)': 0.989741952394019,
    'F.DIST(15,6.1,4,TRUE)': 0.989741952394019,
    'F.DIST(15,6.9,4.8,TRUE)': 0.989741952394019,
    'F.DIST(15,6,4,FALSE)': 0.001271447,
    'F.DIST(-0.5,6,4,TRUE)': FormulaError.NUM,
    'F.DIST(15.6,0.9,4,TRUE)': FormulaError.NUM,
    'F.DIST(15.6,6,0.4,TRUE)': FormulaError.NUM
  });
});

test('F.DIST.RT', () => {
  runTest({
    'F.DIST.RT(15.2068649, 6, 4)': 0.01,
    'F.DIST.RT(15.2068649, 6.5, 4)': 0.01,
    'F.DIST.RT(15.2068649, 6, 4.4)': 0.01,
    'F.DIST.RT(-0.5, 6, 4)': FormulaError.NUM,
    'F.DIST.RT(15.6, 0.9, 4)': FormulaError.NUM,
    'F.DIST.RT(15.6, 6, 0.4)': FormulaError.NUM
  });
});

test('F.INV', () => {
  runTest({
    'F.INV(0.01,  6,  4)': 0.109309914,
    'F.INV(0.01,  6.9,  4.9)': 0.109309914,
    'F.INV(-0.01,  6,  4)': FormulaError.NUM,
    'F.INV(1.01,  6,  4)': FormulaError.NUM,
    'F.INV(1.01,  0.6,  4)': FormulaError.NUM,
    'F.INV(0.01,  6,  0.4)': FormulaError.NUM,
    'F.INV(1.01,  -6,  -4)': FormulaError.NUM
  });
});

test('F.INV.RT', () => {
  runTest({
    'F.INV.RT(0.01, 6, 4)': 15.20686486,
    'F.INV.RT(0.01, 6.9, 4.8)': 15.20686486,
    'F.INV.RT(-0.01, 6.9, 4.8)': FormulaError.NUM,
    'F.INV.RT(1.01, 6.9, 4.8)': FormulaError.NUM,
    'F.INV.RT(0.01, 0.9, 4)': FormulaError.NUM,
    'F.INV.RT(0.01, 6.9, 0.4)': FormulaError.NUM,
    'F.INV.RT(0.01, 1000000000000, 4)': FormulaError.NUM,
    'F.INV.RT(0.01, 6.9, 1000000000000)': FormulaError.NUM
  });
});

test('F.TEST', () => {
  runTest({
    'F.TEST({6,7,9,15,21}, {20,1})': 0.200507085811744,
    'F.TEST({6,7,9,15,21}, {20,28,31,38,40})': 0.648317846786174,
    'F.TEST({6}, {20})': FormulaError.DIV0
  });
});

test('FISHER', () => {
  runTest({
    'FISHER(0.75)': 0.972955074527657,
    'FISHER(0.5)': 0.549306144334055,
    'FISHER(-1.1)': FormulaError.NUM,
    'FISHER(1.1)': FormulaError.NUM
  });
});

test('FISHERINV', () => {
  runTest({
    'FISHERINV(0.972955)': 0.749999967,
    'FISHERINV("string")': FormulaError.VALUE
  });
});

test('FORECAST', () => {
  runTest({
    'FORECAST(30,{6,7,9,15,21},{20,28,31,38,40})': 10.60725308642,
    // 'FORECAST(30,{6,6},{2,"1"})': FormulaError.DIV0,
    'FORECAST(30,{6,6,4},{2,1,3})': -22.66666666667,
    'FORECAST(30,{6,6,4},{2,1})': FormulaError.NA
  });
});

test('FREQUENCY', () => {
  runTest({
    'FREQUENCY({1,2,3,4,5},{1,5,11})': [[1], [5], [5], [5]],
    'FREQUENCY({1,2,3,4,5},{5,1,11})': [[1], [5], [5], [5]],
    'FREQUENCY({1,2,3,4,5},{2,3})': [[2], [3], [5]],
    'FREQUENCY({1,2,3,4,5},A1)': [[0], [5]]
  });
});

test('GAMMA', () => {
  runTest({
    'GAMMA(2.5)': 1.329340388,
    // 'GAMMA(-3.75)': 0.267866128861417,  // Error: precise problem
    'GAMMA(-2.5)': -0.94530872048,
    'GAMMA(0)': FormulaError.NUM,
    'GAMMA(-2)': FormulaError.NUM
  });
});

test('GAMMA.DIST', () => {
  runTest({
    'GAMMA.DIST(-10.00001131, 9, 2, FALSE)': FormulaError.NUM,
    'GAMMA.DIST(10.00001131, -9, 2, TRUE)': FormulaError.NUM,
    'GAMMA.DIST(10.00001131, 9, -2, FALSE)': FormulaError.NUM,
    'GAMMA.DIST(10.00001131, 9, 2, TRUE)': 0.068094004,
    'GAMMA.DIST(10.00001131, 9, 2, FALSE)': 0.03263913
  });
});

test('GAMMA.INV', () => {
  runTest({
    'GAMMA.INV(0.068094,9,2)': 10.00001119,
    'GAMMA.INV(-0.1,9,2)': FormulaError.NUM,
    'GAMMA.INV(11.1,9,2)': FormulaError.NUM,
    'GAMMA.INV(0.5,-0.9,2)': FormulaError.NUM,
    'GAMMA.INV(0.5,9,-0.2)': FormulaError.NUM
  });
});

test('GAMMALN', () => {
  runTest({
    'GAMMALN(4)': 1.791759469,
    'GAMMALN("string")': FormulaError.VALUE,
    'GAMMALN(-4)': FormulaError.NUM
  });
});

test('GAMMALN.PRECISE', () => {
  runTest({
    'GAMMALN.PRECISE(4)': 1.791759469,
    'GAMMALN.PRECISE("string")': FormulaError.VALUE,
    'GAMMALN.PRECISE(-4)': FormulaError.NUM
  });
});

test('GAUSS', () => {
  runTest({'GAUSS(2)': 0.477249868, 'GAUSS("string")': FormulaError.VALUE});
});

test('GEOMEAN', () => {
  runTest({
    'GEOMEAN({2, 2, "string"})': 2.0,
    'GEOMEAN({2, 2})': 2.0,
    'GEOMEAN({4,5,8,7,11,4,3})': 5.47698696965696
  });
});

test('GROWTH', () => {
  runTest({
    'GROWTH({33100,47300,69000,102000,150000,220000})': [
      [
        32618.203773539713, 47729.42261474775, 69841.30085621744,
        102197.07337883241, 149542.4867400457, 218821.87621459528
      ]
    ],
    'GROWTH({33100,47300,69000,102000,150000,220000}, {11,12,13,14,15})':
      FormulaError.REF,
    'GROWTH({33100,47300,69000,102000,150000,220000}, {11,12,13,14,15,16})': [
      [
        32618.203773538437, 47729.422614746654, 69841.30085621694,
        102197.07337883314, 149542.4867400494, 218821.87621460424
      ]
    ],
    'SUM(GROWTH({33100,47300,69000,102000,150000,220000}, {11,12,13,14,15,16}))': 620750.363577979,
    'GROWTH({33100,47300,69000,102000,150000,220000}, {11,12,13,14,15,16},{1;2})':
      [[724.7673986628065, 1060.5344705164614]],
    'SUM(GROWTH({33100,47300,69000,102000,150000,220000}, {11,12,13,14,15,16},{1;2}))': 1785.3018691796,
    'SUM(GROWTH({1,2,3,4},{4,6,8,11},{8,9,10,11}))': 13.9796233554563
  });
});

test('HARMEAN', () => {
  runTest({
    'HARMEAN(4,5,8,7,11,4,3)': 5.02837596206,
    'HARMEAN(4,"5",{8,7,11,4,3})': 5.02837596206
  });
});

test('HYPGEOM.DIST', () => {
  runTest({
    // 'HYPGEOM.DIST': (sample_s, number_sample, population_s, number_pop, cumulative)
    'HYPGEOM.DIST(1,4,8,20,TRUE)': 0.465428276574,
    'HYPGEOM.DIST(1,4,8,20,FALSE)': 0.363261093911,
    // if ( sample_s < 0  || number_sample <= 0 || population_s <= 0 || number_pop <= 0 )
    'HYPGEOM.DIST(0,4,8,20,TRUE)': 0.102167183,
    'HYPGEOM.DIST(-1,4,8,20,TRUE)': FormulaError.NUM,
    'HYPGEOM.DIST(1,0.0,8,20,TRUE)': FormulaError.NUM,
    'HYPGEOM.DIST(1,-4,8,20,TRUE)': FormulaError.NUM,
    'HYPGEOM.DIST(1,4,0,20,TRUE)': FormulaError.NUM,
    'HYPGEOM.DIST(1,4,-8,20,TRUE)': FormulaError.NUM,
    'HYPGEOM.DIST(1,4,8,0.0,TRUE)': FormulaError.NUM,
    'HYPGEOM.DIST(1,4,8,-20,TRUE)': FormulaError.NUM,

    // if (number_sample > number_pop)
    'HYPGEOM.DIST(1,21,8,20,TRUE)': FormulaError.NUM,

    // if (population_s > number_pop)
    'HYPGEOM.DIST(1,4,8,7,TRUE)': FormulaError.NUM,

    // If sample_s is less than the larger of 0 or (number_sample - number_population + population_s), HYPGEOM.DIST returns the #NUM! error value.
    'HYPGEOM.DIST(1,4,8,10,FALSE)': FormulaError.NUM,

    // if (number_sample < sample_s || population_s < sample_s)
    'HYPGEOM.DIST(5,4,8,20,TRUE)': FormulaError.NUM,
    'HYPGEOM.DIST(9,15,8,20,TRUE)': FormulaError.NUM,
    'HYPGEOM.DIST(8,15,8,14,TRUE)': FormulaError.NUM,
    'HYPGEOM.DIST(1,8,8,7,FALSE)': FormulaError.NUM,
    'HYPGEOM.DIST(1,4,21,20,FALSE)': FormulaError.NUM
  });
});

test('INTERCEPT', () => {
  runTest({'INTERCEPT({2,3,9,1,8},{6,5,11,7,5})': 0.04838709677});
});

test('KURT', () => {
  runTest({
    'KURT(3,4,5,2,3,4,5,6,4,7)': -0.151799637208,
    'KURT(3,{4,5},"2",3,4,5,6,4,7)': -0.151799637208
  });
});

test('LOGNORM.DIST', () => {
  runTest({
    'LOGNORM.DIST(4,3.5,1.2,TRUE)': 0.0390835557068,
    'LOGNORM.DIST(4,3.5,1.2,FALSE)': 0.0176175966818,
    'LOGNORM.DIST(-4,3.5,1.2,TRUE)': FormulaError.NUM,
    'LOGNORM.DIST(4,3.5,-1.2,TRUE)': FormulaError.NUM
  });
});

test('LOGNORM.INV', () => {
  runTest({
    'LOGNORM.INV(0.039084, 3.5, 1.2)': 4.0000252186806,
    'LOGNORM.INV(-0.039084, 3.5, 1.2)': FormulaError.NUM,
    'LOGNORM.INV( 1.039084, 3.5, 1.2)': FormulaError.NUM,
    'LOGNORM.INV(0.039084, 3.5, -1.2)': FormulaError.NUM
  });
});

test('NEGBINOM.DIST', () => {
  runTest({
    'NEGBINOM.DIST(10, 5, 0.25,TRUE)': 0.3135140584782,
    'NEGBINOM.DIST(10, 5, 0.25,FALSE)': 0.0550486603752,
    'NEGBINOM.DIST(10, 5, -0.25,FALSE)': FormulaError.NUM,
    'NEGBINOM.DIST(10, 5, 1.25,FALSE)': FormulaError.NUM,
    'NEGBINOM.DIST(-10, 5, 0.25,FALSE)': FormulaError.NUM,
    'NEGBINOM.DIST(10, 0.5, 0.25,FALSE)': FormulaError.NUM
  });
});

test('NORM.DIST', () => {
  runTest({
    'NORM.DIST(42, 40, 1.5, TRUE)': 0.90878878,
    'NORM.DIST(42, 40, 1.5, FALSE)': 0.10934005,
    'NORM.DIST(1.333333, 0, 1, TRUE)': 0.908788726, // the same to NORM.S.DIST
    'NORM.DIST(42, 40, 0, TRUE)': FormulaError.NUM,
    'NORM.DIST(42, 40, -1.1, TRUE)': FormulaError.NUM
  });
});

test('NORM.INV', () => {
  runTest({
    'NORM.INV(0.908789, 40, 1.5)': 42.00000201,
    'NORM.INV(0.908789, 0, 1)': 1.333334673, // the same to NORM.S.INV
    'NORM.INV(-1.0, 40, 1.5)': FormulaError.NUM,
    'NORM.INV(0.0, 40, 1.5)': FormulaError.NUM,
    'NORM.INV(1.1, 40, 1.5)': FormulaError.NUM,
    'NORM.INV(1.0, 40, 1.5)': FormulaError.NUM,
    'NORM.INV(0.9, 40, -1.5)': FormulaError.NUM,
    'NORM.INV(0.9, 40, 0.0)': FormulaError.NUM
  });
});

test('NORM.S.DIST', () => {
  runTest({
    'NORM.S.DIST(1.333333,TRUE)': 0.908788726,
    'NORM.S.DIST(1.333333,FALSE)': 0.164010148
  });
});

test('NORM.S.INV', () => {
  runTest({
    'NORM.S.INV(0.908789)': 1.333334673,
    'NORM.S.INV(-1)': FormulaError.NUM,
    'NORM.S.INV(0)': FormulaError.NUM,
    'NORM.S.INV(1)': FormulaError.NUM,
    'NORM.S.INV(1.1)': FormulaError.NUM
  });
});

test('PHI', () => {
  runTest({
    'PHI(0.5)': 0.3520653268,
    'PHI(0.75)': 0.301137432,
    'PHI(1.00)': 0.2419707245
  });
});

test('POISSON.DIST', () => {
  runTest({
    'POISSON.DIST(-0.5,5,FALSE)': FormulaError.NUM,
    'POISSON.DIST(2,-0.5,FALSE)': FormulaError.NUM,
    'POISSON.DIST(2,5,TRUE)': 0.124652019,
    'POISSON.DIST(2,5,FALSE)': 0.084224337
  });
});

test('PROB', () => {
  runTest({
    'PROB({0, 1, 2, 3},{0.2, 0.3, 0.1, 0.4}, 2)': 0.1,
    'PROB({0, 1, 2, 3},{0.2, 0.3, 0.1, 0.4}, 1, 3)': 0.8
  });
});

test('QUARTILE', () => {
  runTest({
    'QUARTILE({1,2,4,7,8,9,10,12},1)': 3.5
  });
});

test('QUARTILE.INC', () => {
  runTest({
    'QUARTILE.INC({1,2,4,7,8,9,10,12},1)': 3.5
  });
});

test('QUARTILE.EXC', () => {
  runTest({
    'QUARTILE.EXC({6,7,15,36,49,40,41,42,43,47,49},1)': 15,
    'QUARTILE.EXC({6,7,15,36,49,40,41,42,43,47,49},3)': 47
  });
});

test('STANDARDIZE', () => {
  runTest({
    'STANDARDIZE(42, 40,1.5)': 1.333333333333,
    'STANDARDIZE(42, 40, 0.0)': FormulaError.NUM,
    'STANDARDIZE(42, 40, -0.5)': FormulaError.NUM
  });
});

test('STDEV', () => {
  runTest({
    'STDEV({1345,1301,1368,1322,1310,1370,1318,1350,1303,1299})': 27.46392,
    'STDEV.S({1345,1301,1368,1322,1310,1370,1318,1350,1303,1299})': 27.46392
  });
});

test('STDEV.P', () => {
  runTest({
    'STDEV.P({1345,1301,1368,1322,1310,1370,1318,1350,1303,1299})': 26.05455814
  });
});

test('STDEVA', () => {
  runTest({
    'STDEVA({1345, 1301, 1368, 1322, 1310, 1370, 1318, 1350, 1303, 1299})': 27.46391571984349
  });
});

test('STDEVPA', () => {
  runTest({
    'STDEVPA({1345, 1301, 1368, 1322, 1310, 1370, 1318, 1350, 1303, 1299})': 26.054558142482477
  });
});

test('STEYX', () => {
  runTest({
    'STEYX({2, 3, 9, 1, 8, 7, 5}, {6, 5, 11, 7, 5, 4, 4})': 3.305718950210041
  });
});

test('T.DIST', () => {
  runTest({
    'T.DIST(60,1,TRUE)': 0.994695326367,
    'T.DIST(8,3,TRUE)': 0.9979617112,
    'T.DIST(8,3,FALSE)': 0.000736906521,
    'T.DIST(60,0.9,TRUE)': FormulaError.NUM,
    'T.DIST(60,0,TRUE)': FormulaError.NUM
  });
});

test('T.DIST.2T', () => {
  runTest({
    'T.DIST.2T(1.959999998,60)': 0.0546449299759,
    'T.DIST.2T(-0.959999998,60)': FormulaError.NUM,
    'T.DIST.2T(1.959999998,0.6)': FormulaError.NUM
  });
});

test('T.DIST.RT', () => {
  runTest({
    'T.DIST.RT(1.959999998, 60)': 0.027322464988,
    'T.DIST.RT(1.959999998, 0.6)': FormulaError.NUM
  });
});

test('T.INV', () => {
  runTest({
    'T.INV(0.75, 2)': 0.816496581,
    'T.INV(0.75, 2.1)': 0.816496581,
    'T.INV(0.75, 2.9)': 0.816496581,
    'T.INV(0.0, 2)': FormulaError.NUM,
    'T.INV(-0.75, 2)': FormulaError.NUM,
    'T.INV(1.75, 2)': FormulaError.NUM,
    'T.INV(0.75, 0.92)': FormulaError.NUM
  });
});

test('T.INV.2T', () => {
  runTest({
    'T.INV.2T(0.546449, 60)': 0.606533076,
    'T.INV.2T(0.546449, 60.1)': 0.606533076,
    'T.INV.2T(0.546449, 60.9)': 0.606533076,
    'T.INV.2T(0.0, 60)': FormulaError.NUM,
    'T.INV.2T(-0.546449, 60)': FormulaError.NUM,
    'T.INV.2T(1.546449, 60)': FormulaError.NUM,
    'T.INV.2T(0.546449, 0.6)': FormulaError.NUM
  });
});

test('VAR.S', () => {
  runTest({
    'VAR.S({1345,1301,1368,1322,1310,1370,1318,1350,1303,1299})': 754.2667
  });
});

test('VAR.P', () => {
  runTest({
    'VAR.P({1345,1301,1368,1322,1310,1370,1318,1350,1303,1299})': 678.84
  });
});

test('WEIBULL.DIST', () => {
  runTest({
    'WEIBULL.DIST(105, 20, 100,TRUE)': 0.92958139,
    'WEIBULL.DIST(105, 20, 100,FALSE)': 0.035588864,
    'WEIBULL.DIST(-105, 20, 100,FALSE)': FormulaError.NUM,
    'WEIBULL.DIST(105, 0.0, 100,FALSE)': FormulaError.NUM,
    'WEIBULL.DIST(105, -20, 100,FALSE)': FormulaError.NUM,
    'WEIBULL.DIST(105, 20, 0.0,FALSE)': FormulaError.NUM,
    'WEIBULL.DIST(105, 20, -100,FALSE)': FormulaError.NUM
  });
});

test('Z.TEST', () => {
  runTest({
    'Z.TEST({3,6,7,8,6,5,4,3,2,1,9}, 4)': 0.118314897
  });
});

test('PEARSON', () => {
  runTest({
    'PEARSON({9, 7, 5, 3, 1},{10, 6, 1, 5, 3})': 0.6993786061802354
  });
});

test('PERMUT', () => {
  runTest({
    'PERMUT(100, 3)': 970200
  });
});

test('PERMUTATIONA', () => {
  runTest({
    'PERMUTATIONA(3,2)': 9
  });
});

test('RSQ', () => {
  runTest({
    'RSQ({2, 3, 9, 1, 8, 7, 5},{6, 5, 11, 7, 5, 4, 4})': 0.05795019157088122
  });
});

test('SLOPE', () => {
  runTest({
    'SLOPE({2, 3, 9, 1, 8, 7, 5},{6, 5, 11, 7, 5, 4, 4})': 0.3055555555555556
  });
});

test('SKEW', () => {
  runTest({
    'SKEW({3, 4, 5, 2, 3, 4, 5, 6, 4, 7})': 0.3595430714067974
  });
});

test('SKEW.P', () => {
  runTest({
    'SKEW.P({3, 4, 5, 2, 3, 4, 5, 6, 4, 7})': 0.303193339354144
  });
});

test('COUNTBLANK', () => {
  runTest({
    'COUNTBLANK({1,2,3,"",5,"",7})': 2
  });
});

test('PERCENTILE.EXC', () => {
  runTest({
    'PERCENTILE.EXC({1, 2, 3, 4},0.2)': 1
  });
});

test('PERCENTILE.INC', () => {
  runTest({
    'PERCENTILE.INC({1, 2, 3, 4},0.2)': 1.6
  });
});

test('PERCENTRANK.EXC', () => {
  runTest({
    'PERCENTRANK.EXC({1, 2, 3, 4},1)': 0.2
  });
});

test('PERCENTRANK.INC', () => {
  runTest({
    'PERCENTRANK.INC({1, 2, 3, 4},1)': 0,
    'PERCENTRANK.INC({1, 2, 3, 4},2)': 0.333
  });
});

test('VARA', () => {
  runTest({
    'VARA({1, 2, 3, 4, 10, 10})': 16
  });
});

test('VARPA', () => {
  runTest({
    'VARPA({1, 2, 3, 4, 10, 10})': 13.333333333333334
  });
});

test('LINEST', () => {
  runTest({
    'LINEST({1,9,5,7},{0,4,2,3})': [2, 1]
  });
});

test('LOGEST', () => {
  runTest({
    'LOGEST({1,9,5,7},{0,4,2,3})': [1.751116, 1.194316]
  });
});

test('TREND', () => {
  runTest({
    'TREND({1,9,5,7},{0,4,2,3},{5,8})': [11, 17]
  });
});

test('TRIMMEAN', () => {
  runTest({
    'TRIMMEAN({4, 5, 6, 7, 2, 3, 4, 5, 1, 2, 3}, 0.2)': 3.7777777777777777
  });
});
