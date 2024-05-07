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

test('DATE', () => {
  runTest({
    'DATE(108,1,2)': 39449,
    'DATE(1,1,2)': 368,
    'DATE(2008,1,2)': 39449,
    'DATE(2008,14,2)': 39846,
    'DATE(2008,-3,2)': 39327,
    'DATE(2008,1,35)': 39482,
    'DATE(2008,1,-15)': 39432,
    'DATE(-1,1,2)': FormulaError.NUM,
    'DATE(10000,1,2)': FormulaError.NUM
  });
});

test('DATEDIF', () => {
  runTest({
    'DATEDIF("1/1/2001","1/1/2003","Y")': 2,
    'DATEDIF("1/2/2001","1/1/2003","Y")': 1,

    'DATEDIF("6/1/2001","8/15/2002","M")': 14,
    'DATEDIF("6/16/2001","8/15/2002","M")': 13,
    'DATEDIF("9/15/2001","8/15/2003","M")': 23,

    'DATEDIF("6/1/2001","8/15/2002","D")': 440,
    'DATEDIF("6/1/2001","6/1/2002","D")': 365,

    'DATEDIF("6/1/2001","8/15/2002","MD")': 14,
    'DATEDIF("8/16/2001","8/15/2002","MD")': 30,
    'DATEDIF("5/16/2001","7/15/2002","MD")': 29,
    'DATEDIF("5/15/2001","7/15/2002","MD")': 0,

    'DATEDIF("6/1/2001","8/15/2003","YM")': 2,
    'DATEDIF("6/16/2001","8/15/2003","YM")': 1,
    'DATEDIF("9/15/2001","8/15/2003","YM")': 11,
    'DATEDIF("9/15/2001","9/15/2003","YM")': 0,

    'DATEDIF("6/1/2001","8/15/2002","YD")': 75,
    'DATEDIF("9/15/2001","8/15/2003","YD")': 334,
    'DATEDIF("8/15/2001","8/15/2003","YD")': 0,
    'DATEDIF("8/14/2001","8/15/2003","YD")': 1,

    'DATEDIF("8/14/2005","8/15/2003","YD")': FormulaError.NUM
  });
});

test('DATEVALUE', () => {
  runTest({
    // 目前这个用例是可以正常解析的
    // 'DATEVALUE("4:48:18 PM")': 0,

    'DATEVALUE("January 1, 2008")': 39448,
    'DATEVALUE("1/1/2008")': 39448,
    'DATEVALUE("1-Jan-2008")': 39448,

    'DATEVALUE("8/22/2011")': 40777,
    'DATEVALUE("22-MAY-2011")': 40685,
    'DATEVALUE("2011/02/23")': 40597,
    'DATEVALUE("December 31, 9999")': 2958465,
    'DATEVALUE("11" & "/" & "3" & "/" & "2011")': 40850,

    // all formats
    'DATEVALUE("12/3/2014")': 41976,
    'DATEVALUE("Wednesday, December 3, 2014")': 41976,
    'DATEVALUE("2014-12-3")': 41976,
    'DATEVALUE("12/3/14")': 41976,
    'DATEVALUE("12/03/14")': 41976,
    'DATEVALUE("3-Dec-14")': 41976,
    'DATEVALUE("03-Dec-14")': 41976,
    'DATEVALUE("December 3, 2014")': 41976,
    'DATEVALUE("12/3/14 12:00 AM")': 41976,
    'DATEVALUE("12/3/14 0:00")': 41976,
    'DATEVALUE("12/03/2014")': 41976,
    'DATEVALUE("3-Dec-2014")': 41976,

    // 这些例子每年都会变，所以不测试
    // 'DATEVALUE("Dec-3")': 44533, // *special
    // 'DATEVALUE("December-3")': 44533, // *special
    // 'DATEVALUE("3-Dec")': 44533, // *special
    // 'DATEVALUE("12/3")': 44533, // *special
    // 'DATEVALUE("Dec-3 11:11")': 44533, // *special

    'DATEVALUE("1900/1/1")': 1,

    'DATEVALUE("10000/12/1")': FormulaError.VALUE
  });
});

test('DAY', () => {
  runTest({
    'DAY(DATEVALUE("15-Apr-11"))': 15,
    'DAY("15-Apr-11")': 15,
    'DAY(-12)': FormulaError.VALUE
  });
});

test('DAYS', () => {
  runTest({
    'DAYS("2020/3/1", "2020/2/1")': 29,
    'DAYS("3/15/11","2/1/11")': 42,
    'DAYS(DATEVALUE("3/15/11"),DATEVALUE("2/1/11"))': 42,
    'DAYS("12/31/2011","1/1/2011")': 364,
    'DAYS(DATEVALUE("12/31/2011"),DATEVALUE("1/1/2011"))': 364
  });
});

test('DAYS360', () => {
  runTest({
    'DAYS360("2/1/2019", "3/1/2019")': 30,
    'DAYS360("2/1/2019", "2/28/2019")': 30,
    'DAYS360("1/31/2019", "3/31/2019")': 60,
    'DAYS360("2/1/2019", "3/31/2019")': 60,
    'DAYS360("2/1/2019", "3/31/2019", TRUE)': 59,
    'DAYS360("3/31/2019", "3/31/2019")': 0,
    'DAYS360("3/31/2019", "3/31/2019", TRUE)': 0,
    'DAYS360("1/31/2019", 3/31/2019)': -42870,
    'DAYS360("3/15/2019", "3/31/2019")': 16,
    'DAYS360("3/15/2019", "3/31/2020")': 376,
    'DAYS360("12/31/2019", "1/9/2020")': 9
  });
});

test('EDATE', () => {
  runTest({'EDATE("15-Jan-11",1)': 40589});
});

test('EOMONTH', () => {
  runTest({'EOMONTH("1-Jan-11",1)': 40602, 'EOMONTH("1-Jan-11",-3)': 40482});
});

test('HOUR', () => {
  runTest({
    'HOUR(0.75)': 18,
    'HOUR("7/18/2011 7:45")': 7,
    'HOUR("4/21/2012")': 0,
    'HOUR("4 PM")': 16,
    'HOUR("4")': 0,
    'HOUR("16:00")': 16
  });
});

test('ISOWEEKNUM', () => {
  runTest({'ISOWEEKNUM("3/9/2012")': 10});
});

test('MINUTE', () => {
  runTest({'MINUTE("12:45:00 PM")': 45});
});

test('MONTH', () => {
  runTest({'MONTH("15-Apr-11")': 4});
});

test('NETWORKDAYS', () => {
  runTest({
    'NETWORKDAYS("10/1/2012","3/1/2013")': 110,
    'NETWORKDAYS("10/1/2012","3/1/2013", 41235)': 109,
    'NETWORKDAYS("10/1/2012","3/1/2013", {41235})': 109,
    'NETWORKDAYS("10/1/2012","3/1/2013", A4)': 109,
    'NETWORKDAYS("10/1/2012","3/1/2013", A4:A6)': 107,
    'NETWORKDAYS(DATE(2006,1,1),DATE(2006,1,31))': 22,
    'NETWORKDAYS(DATE(2006,2,28),DATE(2006,1,31))': -21
  });
});

test('NETWORKDAYS.INTL', () => {
  runTest({
    'NETWORKDAYS.INTL(DATE(2006,1,1),DATE(2006,1,31))': 22,
    'NETWORKDAYS.INTL(DATE(2006,2,28),DATE(2006,1,31))': -21,
    'NETWORKDAYS.INTL(DATE(2006,2,28),DATE(2006,1,31), "1111111")': 0,
    'NETWORKDAYS.INTL(DATE(2006,1,1),DATE(2006,2,1),7,{"2006/1/2","2006/1/16"})': 22,
    'NETWORKDAYS.INTL(DATE(2006,1,1),DATE(2006,2,1),"0010001",{"2006/1/2","2006/1/16"})': 20,
    'NETWORKDAYS.INTL(DATE(2006,1,1),DATE(2006,1,31), "1")': FormulaError.VALUE,
    'NETWORKDAYS.INTL(DATE(2006,2,28),DATE(2006,1,31), "01111111")':
      FormulaError.VALUE
  });
});

test('NOW', () => {
  runTest({'YEAR(NOW())': new Date().getFullYear()});
});

test('SECOND', () => {
  runTest({
    'SECOND("4:48:18 PM")': 18,
    'SECOND("4:48 PM")': 0
  });
});

test('TIME', () => {
  runTest({
    'TIME(12,0,0)': 0.5,
    'TIME(16,48,10)': 0.7001157407407408,
    'TIME(-12,0,0)': FormulaError.NUM
  });
});

test('TIMEVALUE', () => {
  runTest({
    'TIMEVALUE("2:24 AM")': 0.1,
    'TIMEVALUE("22-Aug-2011 6:35 AM")': 0.2743055555555556
  });
});

test('TODAY', () => {
  runTest({'YEAR(TODAY())': new Date().getFullYear()});
});

test('WEEKDAY', () => {
  runTest({
    'WEEKDAY("2/14/2008")': 5,
    'WEEKDAY("2/14/2008", 2)': 4,
    'WEEKDAY("2/14/2008", "2")': 4,
    'WEEKDAY("2/14/2008", 3)': 3,
    'WEEKDAY("2/14/2008", 5)': FormulaError.NUM
  });
});

test('WEEKNUM', () => {
  runTest({
    'WEEKNUM("3/9/2012")': 10,
    'WEEKNUM("3/9/2012",2)': 11,
    'WEEKNUM("3/9/2012",21)': 10,
    'ISOWEEKNUM("3/9/2012")': 10
  });
});

test('WORKDAY', () => {
  runTest({
    'WORKDAY(DATE(2008,10,1),1)': 39723,
    'WORKDAY(DATE(2008,10,1),5)': 39729,
    'WORKDAY(DATE(2008,10,9),1)': 39731,
    'WORKDAY(DATE(2008,10,9),2)': 39734,
    'WORKDAY(DATE(2008,10,1),151)': 39933,
    'WORKDAY(DATE(2008,10,1),399)': 40281,
    'WORKDAY(DATE(2008,10,1),151, {"2008/11/26","2008/12/4","2008/1/21"})': 39937
  });
});

test('WORKDAY.INTL', () => {
  runTest({
    // 目前没报错
    // 'WORKDAY.INTL(DATE(2012,1,1),30,0)': FormulaError.NUM,
    'WORKDAY.INTL(DATE(2012,1,1),30,"1")': FormulaError.VALUE,
    'WORKDAY.INTL(DATE(2012,1,1),1,11)': 40910,
    'WORKDAY.INTL(DATE(2012,1,1),1,"0000011")': 40910,
    'WORKDAY.INTL(DATE(2012,1,1),1,"1111111")': FormulaError.VALUE,
    'WORKDAY.INTL(DATE(2012,1,1),1,"011111")': FormulaError.VALUE,
    'WORKDAY.INTL(DATE(2012,1,1),90,11)': 41013,
    'WORKDAY.INTL(DATE(2012,1,1),30,17)': 40944,
    'TEXT(WORKDAY.INTL(DATE(2012,1,1),30,17),"m/dd/yyyy")': '2/05/2012'
  });
});

test('YEAR', () => {
  runTest({
    'YEAR("7/5/2008")': 2008,
    'YEAR("7/5/2010")': 2010
  });
});

test('YEARFRAC', () => {
  runTest({
    'YEARFRAC("2012/1/1","2012/7/30")': 0.58055556,
    'YEARFRAC("1/1/2012","7/30/2012")': 0.58055556,
    'YEARFRAC("2006/1/31","2006/3/31")': 0.1666666667,
    'YEARFRAC("2006/1/31","2006/3/29")': 0.163888889,
    'YEARFRAC("2006/1/30","2006/3/31")': 0.1666666667,
    'YEARFRAC("1900/1/30","1900/3/31", 1)': 0.167123288,
    'YEARFRAC("1900/3/31","1900/1/30", 1)': 0.167123288,

    'YEARFRAC("2020/2/5","2021/2/1", 1)': 0.989071038,
    'YEARFRAC("2020/2/1","2021/1/1", 1)': 0.915300546,
    'YEARFRAC("2020/2/1","2022/1/1", 1)': 1.916058394,
    'YEARFRAC("1/1/2006","3/1/2006", 1)': 0.161643836,
    'YEARFRAC("1/1/2012","7/30/2012", 1)': 0.57650273,
    'YEARFRAC("1/1/2012","7/30/2019", 1)': 7.575633128,
    'YEARFRAC("1/1/2012","7/30/2012", 2)': 0.58611111,
    'YEARFRAC("2012/1/1","2014/7/30", 2)': 2.613888889,
    'YEARFRAC("1/1/2012","7/30/2012", 3)': 0.57808219,
    'YEARFRAC("1/1/2012","7/30/2012", 4)': 0.58055556,
    'YEARFRAC("2012/1/1","2013/7/30",4)': 1.580555556,

    'YEARFRAC("2012/1/1","2012/7/30", 5)': FormulaError.VALUE
  });
});
