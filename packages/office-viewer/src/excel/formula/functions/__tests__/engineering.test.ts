import FormulaError from '../../FormulaError';
import {TestCase, buildEnv, testEvalCases} from './buildEnv';

const data = [
  ['fruit', 'price', 'count', 4, 5],
  ['Apples', 0.69, 40, 5, 6],
  ['Bananas', 0.34, 38, 5, 6],
  [41235, 0.55, 15, 5, 6],
  [41247, 0.25, 25, 5, 6],
  [41295, 0.59, 40, 5, 6],
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

test('BESSELI', () => {
  runTest({
    'BESSELI("1.5", 1)': 0.981666428,
    'BESSELI(1.5, 1)': 0.981666428,
    'BESSELI(1.5, 1.9)': 0.981666428,
    'BESSELI(1.5, -1)': FormulaError.NUM,
    'BESSELI(TRUE, 1)': FormulaError.VALUE,
    'BESSELI("a", 1)': FormulaError.VALUE,
    'BESSELI(1.5, {1,2})': 0.981666428
  });
});

test('BESSELJ', () => {
  runTest({
    'BESSELJ(1.9, 2)': 0.329925829,
    'BESSELJ(1.9, 2.9)': 0.329925829,
    'BESSELJ(1.9, -2.9)': FormulaError.NUM,
    'BESSELJ(TRUE, 2)': FormulaError.VALUE,
    'BESSELJ("a", 2)': FormulaError.VALUE,
    'BESSELJ(1.9, {2,3})': 0.329925829
  });
});

test('BESSELK', () => {
  runTest({
    'BESSELK(1.5, 1)': 0.277387804,
    'BESSELK(1.5, 1.9)': 0.277387804,
    'BESSELK(1.5, -1)': FormulaError.NUM,
    'BESSELK(TRUE, 1)': FormulaError.VALUE,
    'BESSELK("a", 1)': FormulaError.VALUE,
    'BESSELK(1.5, {1,2})': 0.277387804
  });
});

test('BESSELY', () => {
  runTest({
    'BESSELY("2.5", 1)': 0.145918138,
    'BESSELY(2.5, 1)': 0.145918138,
    'BESSELY(2.5, 1.9)': 0.145918138,
    'BESSELY(2.5, -1)': FormulaError.NUM,
    'BESSELY(TRUE, 1)': FormulaError.VALUE,
    'BESSELY("a", 1)': FormulaError.VALUE,
    'BESSELY(2.5, {1,2})': 0.145918138
  });
});

test('BIN2DEC', () => {
  runTest({
    'BIN2DEC(1100100)': 100,
    'BIN2DEC(1111111111)': -1,
    'BIN2DEC(11001001001101)': FormulaError.NUM, // contain more than 10 characters
    'BIN2DEC(110010023145)': FormulaError.NUM, // not a valid binary number
    'BIN2DEC(TRUE)': FormulaError.VALUE,
    'BIN2DEC(FALSE)': FormulaError.VALUE,
    'BIN2DEC({1100100})': 100,
    'BIN2DEC(1010101010)': -342
  });
});

test('BIN2HEX', () => {
  runTest({
    'BIN2HEX(11111011)': 'FB',
    'BIN2HEX(11111011,4)': '00FB',
    'BIN2HEX("11111011",4)': '00FB',
    'BIN2HEX("11111011",-4)': FormulaError.NUM,
    'BIN2HEX(11111011,"4")': '00FB',
    'BIN2HEX(11111011,1)': FormulaError.NUM,
    'BIN2HEX(11111011,10)': '00000000FB',
    'BIN2HEX(11111011,3)': '0FB',
    'BIN2HEX(11111011,2)': 'FB',
    'BIN2HEX(11111011011,2)': FormulaError.NUM,
    'BIN2HEX(1110)': 'E',
    'BIN2HEX(1111111111)': 'FFFFFFFFFF',
    'BIN2HEX(1111111111,7)': 'FFFFFFFFFF',
    'BIN2HEX(1111111111,{1})': 'FFFFFFFFFF',
    'BIN2HEX(TRUE,2)': FormulaError.VALUE,
    'BIN2HEX(TRUE,3)': FormulaError.VALUE
  });
});

test('BIN2OCT', () => {
  runTest({
    'BIN2OCT(1001,3)': '011',
    'BIN2OCT("1001",3)': '011',
    'BIN2OCT(1001,"3")': '011',
    'BIN2OCT(10010101011,"3")': FormulaError.NUM,
    'BIN2OCT(1001,"-7")': FormulaError.NUM,
    'BIN2OCT(1001,"1")': FormulaError.NUM,
    'BIN2OCT(1100100)': '144',
    'BIN2OCT({1100100})': '144',
    'BIN2OCT(TRUE)': FormulaError.VALUE,
    'BIN2OCT(FALSE)': FormulaError.VALUE,
    'BIN2OCT(1111111111)': '7777777777'
  });
});

test('BITAND', () => {
  runTest({
    'BITAND(1,5)': 1,
    'BITAND(13,25)': 9,
    'BITAND({13},25)': 9,
    'BITAND(13,{25})': 9,
    'BITAND("13","25")': 9,
    'BITAND(-11,5)': FormulaError.NUM,
    'BITAND(1,-5)': FormulaError.NUM,
    'BITAND(-1,-5)': FormulaError.NUM,
    'BITAND(19,281474976710659)': FormulaError.NUM,
    'BITAND(281484976720655,5)': FormulaError.NUM,
    'BITAND(TRUE,5)': 1,
    'BITAND(1,FALSE)': 0,
    'BITAND(1.7,FALSE)': FormulaError.NUM,
    'BITAND(1, 5.2)': FormulaError.NUM,
    'BITAND(TRUE,FALSE)': 0,
    'BITAND("TRUE",7)': FormulaError.VALUE
  });
});

test('BITLSHIFT', () => {
  runTest({
    'BITLSHIFT(4,2)': 16,
    'BITLSHIFT(13,-2)': 3,
    'BITLSHIFT(-4,2)': FormulaError.NUM,
    'BITLSHIFT(4,-2)': 1,
    'BITLSHIFT(9,-3)': 1,
    'BITLSHIFT(4.1,2)': FormulaError.NUM,
    'BITLSHIFT(4,2.4)': 16,
    'BITLSHIFT(281494976710655,2)': FormulaError.NUM,
    'BITLSHIFT(7,-54)': FormulaError.NUM,
    'BITLSHIFT(3,58)': FormulaError.NUM
  });
});

test('BITOR', () => {
  runTest({
    'BITOR(23,10)': 31,
    'BITOR(5,3)': 7,
    'BITOR(-5,10)': FormulaError.NUM,
    'BITOR(3,-1)': FormulaError.NUM,
    'BITOR(2.2,3)': FormulaError.NUM,
    'BITOR(3, 5.1)': FormulaError.NUM,
    'BITOR(281674976710655,10)': FormulaError.NUM,
    'BITOR(17,281474976710656)': FormulaError.NUM,
    'BITOR(TRUE,4)': 5,
    'BITOR(60,FALSE)': 60
  });
});

test('BITRSHIFT', () => {
  runTest({
    'BITRSHIFT(13,2)': 3,
    'BITRSHIFT(13.9,2)': FormulaError.NUM,
    'BITRSHIFT(13,2.7)': 3,
    'BITRSHIFT(281474976720655,2)': FormulaError.NUM,
    'BITRSHIFT(13,-42)': 57174604644352,
    'BITRSHIFT(13,-62)': FormulaError.NUM,
    'BITRSHIFT(24,3)': 3,
    'BITRSHIFT(9999999999,31)': 4,
    'BITRSHIFT(9999999999,22.5)': 2384,
    'BITRSHIFT(999999999,31)': 0,
    'BITRSHIFT(9999999999,-50)': FormulaError.NUM,
    'BITRSHIFT(13,-44)': 228698418577408
  });
});

test('BITXOR', () => {
  runTest({
    'BITXOR(5,3)': 6,
    'BITXOR(24,3)': 27,
    'BITXOR(5.5,3)': FormulaError.NUM,
    'BITXOR(5,3.2)': FormulaError.NUM,
    'BITXOR(-5,3)': FormulaError.NUM,
    'BITXOR(5,-3)': FormulaError.NUM,
    'BITXOR(281474976710658,3)': FormulaError.NUM,
    'BITXOR(5,281474976710656)': FormulaError.NUM
  });
});

test('COMPLEX', () => {
  runTest({
    'COMPLEX(0,0)': 0,
    'COMPLEX(3,4)': '3+4i',
    'COMPLEX(52,1)': '52+i',
    'COMPLEX(3,-4)': '3-4i',
    'COMPLEX(3,4,"j")': '3+4j',
    'COMPLEX(0,1)': 'i',
    'COMPLEX(0,-1)': '-i',
    'COMPLEX(52,-1)': '52-i',
    'COMPLEX(1,0)': '1',
    'COMPLEX(3,4,"z")': FormulaError.VALUE,
    'COMPLEX(0,4,"i")': '4i',
    'COMPLEX(70,0,"j")': '70',
    'COMPLEX(TRUE,4,"j")': FormulaError.VALUE,
    'COMPLEX(3,FALSE,"j")': FormulaError.VALUE
  });
});

test('CONVERT', () => {
  runTest({
    'CONVERT(1, "lbm", "kg")': 0.45359237
  });
});

test('DEC2BIN', () => {
  runTest({
    'DEC2BIN(9,4)': '1001',
    'DEC2BIN(512,4)': FormulaError.NUM,
    'DEC2BIN(-523,4)': FormulaError.NUM,
    'DEC2BIN(9)': '1001',
    'DEC2BIN(19,-1)': FormulaError.NUM,
    'DEC2BIN(9,3)': FormulaError.NUM,
    'DEC2BIN(-100)': '1110011100'
  });
});

test('DEC2HEX', () => {
  runTest({
    'DEC2HEX(100,4)': '0064',
    'DEC2HEX(100000000000,5)': FormulaError.NUM,
    'DEC2HEX(-549755813988 ,7)': FormulaError.NUM,
    'DEC2HEX(100,-2)': FormulaError.NUM,
    'DEC2HEX(-54)': 'FFFFFFFFCA',
    'DEC2HEX(28)': '1C',
    'DEC2HEX(64,1)': FormulaError.NUM
  });
});

test('DEC2OCT', () => {
  runTest({
    'DEC2OCT(58,3)': '072',
    'DEC2OCT(58,-3)': FormulaError.NUM,
    'DEC2OCT(72,1)': FormulaError.NUM,
    'DEC2OCT(-536874912,3)': FormulaError.NUM,
    'DEC2OCT(536870932,3)': FormulaError.NUM,
    'DEC2OCT(-100)': '7777777634',
    'DEC2OCT(-256)': '7777777400'
  });
});

test('DELTA', () => {
  runTest({
    'DELTA(5,4)': 0,
    'DELTA(5,5)': 1,
    'DELTA(0.5,0)': 0,
    'DELTA(5)': 0,
    'DELTA(0)': 1,
    'DELTA(TRUE,5)': FormulaError.VALUE,
    'DELTA(TRUE,)': FormulaError.VALUE,
    // 'DELTA(5,FALSE)': FormulaError.VALUE,
    'DELTA(5,"5")': 1,
    'DELTA("1",1)': 1
  });
});

test('ERF', () => {
  runTest({
    'ERF(0.745)': 0.70792892,
    'ERF(1)': 0.84270079,
    'ERF(TRUE)': FormulaError.VALUE
  });
});

test('ERFC', () => {
  runTest({'ERFC(1)': 0.15729921, 'ERFC(FALSE)': FormulaError.VALUE});
});

test('GESTEP', () => {
  runTest({
    'GESTEP(5,4)': 1,
    'GESTEP(5,5)': 1,
    'GESTEP(-4,-5)': 1,
    'GESTEP(-1)': 0,
    'GESTEP(0)': 1,
    // 'GESTEP(1,TRUE)': FormulaError.VALUE,
    'GESTEP(5,"3")': 1
  });
});

test('HEX2BIN', () => {
  runTest({
    'HEX2BIN("F",8)': '00001111',
    'HEX2BIN("F",3)': FormulaError.NUM,
    'HEX2BIN("F",-8)': FormulaError.NUM,
    'HEX2BIN("B7")': '10110111',
    'HEX2BIN("FFFFFFFFFF")': '1111111111',
    'HEX2BIN("F0FFFFFFFF")': FormulaError.NUM
  });
});

test('HEX2DEC', () => {
  runTest({
    'HEX2DEC("A5")': 165,
    'HEX2DEC("FFFFFFFF5B")': -165,
    'HEX2DEC("FFDFFFFFFF")': -536870913,
    'HEX2DEC("8FFFFFFF")': 2415919103,
    'HEX2DEC("FFFFFFFF00")': -256,
    'HEX2DEC("F000000000")': -68719476736,
    'HEX2DEC("A000000000")': -412316860416,
    'HEX2DEC("7fffffffff")': 549755813887, // max positive number
    'HEX2DEC("3DA408B9")': 1034160313,
    'HEX2DEC("G")': FormulaError.NUM
  });
});

test('IMABS', () => {
  runTest({
    'IMABS("5+12i")': 13,
    'IMABS("52+60i")': 79.397732965,
    'IMABS("-24-72i")': 75.89466384,
    'IMABS("3+4z")': FormulaError.NUM,
    'IMABS("3+4j")': 5
  });
});

test('IMAGINARY', () => {
  runTest({
    'IMAGINARY("")': FormulaError.NUM,
    'IMAGINARY("3+4i")': 4,
    'IMAGINARY("+4i")': 4,
    'IMAGINARY("0")': 0,
    'IMAGINARY(0)': 0,
    'IMAGINARY("3+4z")': FormulaError.NUM,
    'IMAGINARY("0-j")': -1,
    'IMAGINARY("4")': 0,
    'IMAGINARY("3+i")': 1,
    'IMAGINARY("j")': 1,
    'IMAGINARY("-i")': -1
  });
});

test('IMARGUMENT', () => {
  runTest({
    'IMARGUMENT("3+4i")': 0.92729522,
    'IMARGUMENT("-3-4i")': -2.2142974355882,
    'IMARGUMENT("-15+5i")': 2.819842099,
    'IMARGUMENT("0")': FormulaError.DIV0,
    'IMARGUMENT("-14i")': -1.570796327,
    'IMARGUMENT(TRUE)': FormulaError.VALUE,
    'IMARGUMENT("-52")': 3.141592654,
    'IMARGUMENT("24i")': 1.570796327,
    'IMARGUMENT("5i")': 1.570796327,
    'IMARGUMENT("52")': 0,
    'IMARGUMENT("13+14z")': FormulaError.NUM
  });
});

test('IMCONJUGATE', () => {
  runTest({
    'IMCONJUGATE("3+4i")': '3-4i',
    'IMCONJUGATE("3-4i")': '3+4i',
    'IMCONJUGATE("3+4z")': FormulaError.NUM,
    'IMCONJUGATE("i")': '-i',
    'IMCONJUGATE("-j")': 'j',
    'IMCONJUGATE("3")': '3'
  });
});

test('IMCOS', () => {
  runTest({
    'IMCOS(1)': '0.5403023058681398',
    'IMCOS("1+i")': '0.8337300251311491-0.9888977057628651i',
    'IMCOS("4+3i")': '-6.580663040551157+7.581552742746545i',
    'IMCOS(TRUE)': FormulaError.VALUE,
    'IMCOS("TRUE")': FormulaError.NUM
  });
});

test('IMCOSH', () => {
  runTest({
    'IMCOSH(5)': '74.20994852478785',
    'IMCOSH("4+3i")': '-27.034945603074224+3.851153334811777i',
    'IMCOSH(FALSE)': FormulaError.VALUE,
    'IMCOSH("4+3j")': '-27.034945603074224+3.851153334811777j',
    'IMCOSH("4+3J")': FormulaError.NUM
  });
});

test('IMCOT', () => {
  runTest({
    'IMCOT("4+3i")': '0.0049011823943044056-0.9992669278059017i',
    'IMCOT(TRUE)': FormulaError.VALUE,
    'IMCOT(FALSE)': FormulaError.VALUE
  });
});

test('IMCSC', () => {
  runTest({
    'IMCSC("4+3i")': '-0.0754898329158637+0.0648774713706355i',
    'IMCSC(TRUE)': FormulaError.VALUE,
    'IMCSC(FALSE)': FormulaError.VALUE
  });
});

test('IMCSCH', () => {
  runTest({
    'IMCSCH("4+3i")': '-0.03627588962862602-0.005174473184019398i',
    'IMCSCH(TRUE)': FormulaError.VALUE,
    'IMCSCH(FALSE)': FormulaError.VALUE
  });
});

test('IMDIV', () => {
  runTest({
    'IMDIV("-238+240i","10+24i")': '5+12i',
    'IMDIV(0,0)': FormulaError.NUM,
    'IMDIV(TRUE,"52")': FormulaError.VALUE,
    'IMDIV("100+3j",FALSE)': FormulaError.VALUE,
    'IMDIV("52i+10",0)': FormulaError.NUM,
    'IMDIV("-238+240i","10+24j")': FormulaError.NUM,
    'IMDIV("52i+10",1)': FormulaError.NUM,
    'IMDIV(10,10)': '1'
  });
});

test('IMEXP', () => {
  runTest({
    'IMEXP("1+i")': '1.4686939399158851+2.2873552871788423i',
    'IMEXP("1+j")': '1.4686939399158851+2.2873552871788423j',
    'IMEXP(FALSE)': FormulaError.VALUE
  });
});

test('IMLN', () => {
  runTest({
    'IMLN("3+4i")': '1.6094379124341003+0.9272952180016122i',
    'IMLN("3+4j")': '1.6094379124341003+0.9272952180016122j',
    'IMLN(TRUE)': FormulaError.VALUE
  });
});

test('IMLOG10', () => {
  runTest({
    'IMLOG10("3+4i")': '0.6989700043360187+0.4027191962733731i',
    'IMLOG10("3+4j")': '0.6989700043360187+0.4027191962733731j',
    'IMLOG10(TRUE)': FormulaError.VALUE
  });
});

test('IMLOG2', () => {
  runTest({
    'IMLOG2("3+4i")': '2.321928094887362+1.3378042124509761i',
    'IMLOG2(TRUE)': FormulaError.VALUE,
    'IMLOG2("3+4j")': '2.321928094887362+1.3378042124509761j'
  });
});

test('IMPOWER', () => {
  runTest({
    'IMPOWER("2+3i", 3)': '-45.99999999999999+9.000000000000007i',
    'IMPOWER(TRUE, 3)': FormulaError.VALUE,
    'IMPOWER("2+3j", TRUE)': FormulaError.VALUE
  });
});

test('IMPRODUCT', () => {
  runTest({
    'IMPRODUCT("3+4i","5-3i")': '27+11i',
    'IMPRODUCT("3+4i","5-3j", "5-3j")': FormulaError.VALUE,
    'IMPRODUCT("1+2i",30)': '30+60i',
    'IMPRODUCT(" ")': FormulaError.NUM,
    'IMPRODUCT("52+7i",12,"2+i")': '1164+792i',
    'IMPRODUCT(TRUE,12)': FormulaError.VALUE,
    'IMPRODUCT("2+3i",TRUE)': FormulaError.VALUE
  });
});

test('IMREAL', () => {
  runTest({
    'IMREAL("")': FormulaError.NUM,
    'IMREAL(0)': 0,
    'IMREAL("0")': 0,
    'IMREAL("6-9i")': 6,
    'IMREAL("+1i")': 0,
    'IMREAL("+52i")': 0,
    'IMREAL("+10+2y")': FormulaError.NUM,
    'IMREAL("+10+i")': 10,
    'IMREAL("-j")': 0,
    'IMREAL("+i")': 0,
    'IMREAL("6+9k")': FormulaError.NUM,
    'IMREAL("52")': 52,
    'IMREAL("j")': 0,
    'IMREAL("J")': FormulaError.NUM,
    'IMREAL("5.2-9i")': 5.2,
    'IMREAL("5.222-10i")': 5.222,
    'IMREAL("{5-9j}")': FormulaError.NUM
  });
});

test('IMSEC', () => {
  runTest({
    'IMSEC("4+3i")': '-0.06529402785794704-0.07522496030277322i',
    'IMSEC(TRUE)': FormulaError.VALUE
  });
});

test('IMSECH', () => {
  runTest({
    'IMSECH("4+3i")': '-0.03625349691586887-0.005164344607753179i',
    'IMSECH(TRUE)': FormulaError.VALUE
  });
});

test('IMSIN', () => {
  runTest({
    'IMSIN("4+3i")': '-7.61923172032141-6.5481200409110025i',
    'IMSIN(TRUE)': FormulaError.VALUE,
    'IMSIN("4+3j")': '-7.61923172032141-6.5481200409110025j'
  });
});

test('IMSINH', () => {
  runTest({
    'IMSINH("4+3i")': '-27.016813258003932+3.853738037919377i',
    'IMSINH(TRUE)': FormulaError.VALUE,
    'IMSINH("4+3j")': '-27.016813258003932+3.853738037919377j'
  });
});

test('IMSQRT', () => {
  runTest({
    'IMSQRT("1+i")': '1.0986841134678098+0.45508986056222733i',
    'IMSQRT(FALSE)': FormulaError.VALUE,
    'IMSQRT("1+j")': '1.0986841134678098+0.45508986056222733j'
  });
});

test('IMSUB', () => {
  runTest({
    'IMSUB("13+4i","5+3i")': '8+i',
    'IMSUB("13+4j","5+3j")': '8+j',
    'IMSUB("13+4j","5+3i")': FormulaError.VALUE,
    'IMSUB(TRUE,"5+3i")': FormulaError.VALUE,
    'IMSUB("13+4i",FALSE)': FormulaError.VALUE
  });
});

test('IMSUM', () => {
  runTest({
    'IMSUM("3+4i","5-3i")': '8+i',
    'IMSUM("13+4j","5+3i")': FormulaError.VALUE,
    'IMSUM("")': FormulaError.NUM
  });
});

test('IMTAN', () => {
  runTest({
    'IMTAN("4+3i")': '0.004908258067495992+1.000709536067233i',
    'IMTAN(TRUE)': FormulaError.VALUE,
    'IMTAN(FALSE)': FormulaError.VALUE,
    'IMTAN("24+72y")': FormulaError.NUM
  });
});

test('OCT2BIN', () => {
  runTest({
    'OCT2BIN(7777777000)': '1000000000',
    'OCT2BIN(3)': '11',
    'OCT2BIN(34565423412, 3)': FormulaError.NUM,

    // David
    'OCT2BIN("string", 11)': FormulaError.NUM,
    // 目前的实现不会报错
    // 'OCT2BIN(3, "string")': FormulaError.VALUE,
    // 1. If number's length larger than 10, returns #NUM!
    'OCT2BIN(123456789012, 11)': FormulaError.NUM,
    // 2. office: If places is negative, OCT2BIN returns the #NUM! error value.
    'OCT2BIN(3, -3)': FormulaError.NUM,
    'OCT2BIN(3, 3.1)': '011',
    'OCT2BIN(3, 3.9)': '011',
    // In microsoft Excel, if places is larger than 10, it will return #NUM!
    'OCT2BIN(3, 11)': FormulaError.NUM,
    'OCT2BIN(376, 10)': '0011111110',
    'OCT2BIN(377, 10)': '0011111111',
    'OCT2BIN(400, 10)': '0100000000',
    'OCT2BIN(401, 10)': '0100000001',
    'OCT2BIN(776, 10)': '0111111110',
    'OCT2BIN(777, 10)': '0111111111',
    'OCT2BIN(777, 8)': FormulaError.NUM,
    'OCT2BIN(7771)': FormulaError.NUM
  });
});

test('OCT2DEC', () => {
  runTest({
    'OCT2DEC(54)': 44,
    'OCT2DEC(51)': 41,
    'OCT2DEC(10)': 8,
    'OCT2DEC(7777777533)': -165,
    'OCT2DEC(3777777777)': 536870911,
    'OCT2DEC(4000000000)': -536870912,
    'OCT2DEC(4000000001)': -536870911,
    'OCT2DEC(7777777777)': -1,
    'OCT2DEC(12345671234)': FormulaError.NUM,
    // If number is not a valid octal number, OCT2DEC returns the #NUM! error value.
    // 'OCT2DEC(TRUE)': FormulaError.VALUE,
    'OCT2DEC(TRUE)': FormulaError.NUM,
    'OCT2DEC(8)': FormulaError.NUM,
    'OCT2DEC("AAA")': FormulaError.NUM,
    'OCT2DEC("//")': FormulaError.NUM
  });
});

test('OCT2HEX', () => {
  runTest({
    'OCT2HEX(100, -4)': FormulaError.NUM,
    'OCT2HEX(100)': '40',
    'OCT2HEX(100, 4)': '0040',
    'OCT2HEX(100, 1)': FormulaError.NUM,
    'OCT2HEX(10077777775, 4)': FormulaError.NUM,
    'OCT2HEX(520, 3)': '150',
    'OCT2HEX(520, -3)': FormulaError.NUM,
    'OCT2HEX(520, 2)': FormulaError.NUM,
    'OCT2HEX(100, -1)': FormulaError.NUM,
    'OCT2HEX(7777777533)': 'FFFFFFFF5B',
    'OCT2HEX(7777777772,10)': 'FFFFFFFFFA',
    'OCT2HEX(4000000001,10)': 'FFE0000001',
    // david
    'OCT2HEX("string", 10)': FormulaError.NUM,
    // 'OCT2HEX(777, "aaa")': FormulaError.VALUE,
    'OCT2HEX(12345671231, 10)': FormulaError.NUM,
    'OCT2HEX(1234567123, 10)': '000A72EE53',
    'OCT2HEX(888, 10)': FormulaError.NUM,
    'OCT2HEX("//", 10)': FormulaError.NUM,
    'OCT2HEX(100, 4.9)': '0040',
    'OCT2HEX(100, 4.1)': '0040',
    'OCT2HEX(100, 0)': '40',
    'OCT2HEX(7777777777, 10)': 'FFFFFFFFFF',
    'OCT2HEX(3777777777, 10)': '001FFFFFFF',
    'OCT2HEX(4000000000, 10)': 'FFE0000000',
    'OCT2HEX(4000000001, 10)': 'FFE0000001',
    'OCT2HEX(4000000001, 11)': FormulaError.NUM
  });
});
