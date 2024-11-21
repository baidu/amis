import moment from 'moment';
import {evaluateForAsync, registerFunction} from '../src';

const defaultContext = {
  a: 1,
  b: 2,
  c: 3,
  d: 4,
  e: 5
};

async function evalFormual(expression: string, data: any = defaultContext) {
  return evaluateForAsync(expression, data, {
    evalMode: true
  });
}

test('formula:expression', async () => {
  expect(await evalFormual('a + 3')).toBe(4);
  expect(await evalFormual('b * 3')).toBe(6);
  expect(await evalFormual('b * 3 + 4')).toBe(10);
  expect(await evalFormual('c * (3 + 4)')).toBe(21);
  expect(await evalFormual('d / (a + 1)')).toBe(2);
  expect(await evalFormual('5 % 3')).toBe(2);
  expect(await evalFormual('3 | 4')).toBe(7);
  expect(await evalFormual('4 ^ 4')).toBe(0);
  expect(await evalFormual('4 ^ 4')).toBe(0);
  expect(await evalFormual('4 & 4')).toBe(4);
  expect(await evalFormual('4 & 3')).toBe(0);
  expect(await evalFormual('~-1')).toBe(0);
  expect(await evalFormual('!!1')).toBe(true);
  expect(await evalFormual('!!""')).toBe(false);
  expect(await evalFormual('1 || 2')).toBe(1);
  expect(await evalFormual('1 && 2')).toBe(2);
  expect(await evalFormual('1 && 2 || 3')).toBe(2);
  expect(await evalFormual('1 || 2 || 3')).toBe(1);
  expect(await evalFormual('1 || 2 && 3')).toBe(1);
  expect(await evalFormual('(1 || 2) && 3')).toBe(3);
  expect(await evalFormual('1 == "1"')).toBe(true);
  expect(await evalFormual('1 === "1"')).toBe(false);
  expect(await evalFormual('1 < 1')).toBe(false);
  expect(await evalFormual('1 <= 1')).toBe(true);
  expect(await evalFormual('1 > 1')).toBe(false);
  expect(await evalFormual('1 >= 1')).toBe(true);
  expect(await evalFormual('3 >> 1')).toBe(1);
  expect(await evalFormual('3 << 1')).toBe(6);
  expect(await evalFormual('10 ** 3')).toBe(1000);

  expect(await evalFormual('10 ? 3 : 2')).toBe(3);
  expect(await evalFormual('0 ? 3 : 2')).toBe(2);
});

test('formula:expression2', async () => {
  expect(await evalFormual('a[0]', {a: [1, 2, 3]})).toBe(1);
  expect(await evalFormual('a[b]', {a: [1, 2, 3], b: 1})).toBe(2);
  expect(await evalFormual('a[b - 1]', {a: [1, 2, 3], b: 1})).toBe(1);
  expect(await evalFormual('a[b ? 1 : 2]', {a: [1, 2, 3], b: 1})).toBe(2);
  expect(await evalFormual('a[c ? 1 : 2]', {a: [1, 2, 3], b: 1})).toBe(3);
});

test('formula:expression3', async () => {
  // expect(await evalFormual('${a} === "b"', {a: 'b'})).toBe(true);
  expect(await evalFormual('b === "b"')).toBe(false);
  // expect(await evalFormual('${a}', {a: 'b'})).toBe('b');

  expect(await evalFormual('obj.x.a', {obj: {x: {a: 1}}})).toBe(1);
  expect(await evalFormual('obj.y.a', {obj: {x: {a: 1}}})).toBe(undefined);
});

test('formula:if', async () => {
  expect(await evalFormual('IF(true, 2, 3)')).toBe(2);
  expect(await evalFormual('IF(false, 2, 3)')).toBe(3);
  expect(await evalFormual('IF(false, 2, IF(true, 3, 4))')).toBe(3);
});

test('formula:and', async () => {
  expect(!!(await evalFormual('AND(0, 1)'))).toBe(false);
  expect(!!(await evalFormual('AND(1, 1)'))).toBe(true);
  expect(!!(await evalFormual('AND(1, 1, 1, 0)'))).toBe(false);
});

test('formula:or', async () => {
  expect(!!(await evalFormual('OR(0, 1)'))).toBe(true);
  expect(!!(await evalFormual('OR(1, 1)'))).toBe(true);
  expect(!!(await evalFormual('OR(1, 1, 1, 0)'))).toBe(true);
  expect(!!(await evalFormual('OR(0, 0, 0, 0)'))).toBe(false);
});

test('formula:xor', async () => {
  expect(await evalFormual('XOR(0, 1)')).toBe(true);
  expect(await evalFormual('XOR(1, 0)')).toBe(true);
  expect(await evalFormual('XOR(1, 1)')).toBe(false);
  expect(await evalFormual('XOR(0, 0)')).toBe(false);

  expect(await evalFormual('XOR(0, 0, 1)')).toBe(true);
  expect(await evalFormual('XOR(0, 1, 1)')).toBe(false);
});

test('formula:ifs', async () => {
  expect(!!(await evalFormual('IFS(0, 1, 2)'))).toBe(true);
  expect(!!(await evalFormual('IFS(0, 1, 2, 2, 3)'))).toBe(true);
  expect(!!(await evalFormual('IFS(0, 1, 0, 2, 0)'))).toBe(false);
  expect(await evalFormual('IFS(0, 1, 2, 2)')).toBe(2);
  expect(await evalFormual('IFS(0, 1, 0, 2)')).toBe(undefined);
});

test('formula:math', async () => {
  expect(await evalFormual('ABS(1)')).toBe(1);
  expect(await evalFormual('ABS(-1)')).toBe(1);
  expect(await evalFormual('ABS(0)')).toBe(0);

  expect(await evalFormual('MAX(1, -1, 2, 3, 5, -9)')).toBe(5);
  expect(await evalFormual('MIN(1, -1, 2, 3, 5, -9)')).toBe(-9);

  expect(await evalFormual('MOD(3, 2)')).toBe(1);

  expect(await evalFormual('PI()')).toBe(Math.PI);

  expect(await evalFormual('ROUND(3.55)')).toBe(3.55);
  expect(await evalFormual('ROUND(3.45)')).toBe(3.45);

  expect(await evalFormual('ROUND(3.456789, 2)')).toBe(3.46);
  expect(await evalFormual('CEIL(3.456789)')).toBe(3.46);
  expect(await evalFormual('FLOOR(3.456789)')).toBe(3.45);

  expect(await evalFormual('SQRT(4)')).toBe(2);
  expect(await evalFormual('AVG(4, 6, 10, 10, 10)')).toBe(8);

  // 示例来自 https://support.microsoft.com/zh-cn/office/devsq-%E5%87%BD%E6%95%B0-8b739616-8376-4df5-8bd0-cfe0a6caf444
  expect(await evalFormual('DEVSQ(4,5,8,7,11,4,3)')).toBe(48);
  // 示例来自 https://support.microsoft.com/zh-cn/office/avedev-%E5%87%BD%E6%95%B0-58fe8d65-2a84-4dc7-8052-f3f87b5c6639
  expect(await evalFormual('ROUND(AVEDEV(4,5,6,7,5,4,3), 2)')).toBe(1.02);
  // 示例来自 https://support.microsoft.com/zh-cn/office/harmean-%E5%87%BD%E6%95%B0-5efd9184-fab5-42f9-b1d3-57883a1d3bc6
  expect(await evalFormual('ROUND(HARMEAN(4,5,8,7,11,4,3), 3)')).toBe(5.028);

  expect(await evalFormual('LARGE([1,3,5,4,7,6], 3)')).toBe(5);
  expect(await evalFormual('LARGE([1,3,5,4,7,6], 1)')).toBe(7);

  expect(await evalFormual('UPPERMONEY(7682.01)')).toBe('柒仟陆佰捌拾贰元壹分');
  expect(await evalFormual('UPPERMONEY(7682)')).toBe('柒仟陆佰捌拾贰元整');

  expect(await evalFormual('POW(2,3)')).toBe(8);
  expect(await evalFormual('POW(4,2)')).toBe(16);

  // 非数字类型转换是否正常？
  expect(await evalFormual('"3" + "3"')).toBe(6);
  expect(await evalFormual('"3" - "3"')).toBe(0);
  expect(await evalFormual('AVG(4, "6", "10", 10, 10)')).toBe(8);
  expect(await evalFormual('MAX(4, "6", "10", 2, 3)')).toBe(10);
  expect(await evalFormual('POW("2","3")')).toBe(8);
  expect(await evalFormual('POW("22.3",2)')).toBe(497.29);
  expect(await evalFormual('POW("word2",2)')).toBe('word2');

  expect(await evalFormual('"a" + "b"')).toBe('ab');
});

test('formula:text', async () => {
  expect(await evalFormual('LEFT("abcdefg", 2)')).toBe('ab');
  expect(await evalFormual('RIGHT("abcdefg", 2)')).toBe('fg');
  expect(await evalFormual('LENGTH("abcdefg")')).toBe(7);
  expect(await evalFormual('LEN("abcdefg")')).toBe(7);
  expect(await evalFormual('ISEMPTY("abcdefg")')).toBe(false);
  expect(await evalFormual('ISEMPTY("")')).toBe(true);
  expect(await evalFormual('CONCATENATE("a", "b", "c", "d")')).toBe('abcd');
  expect(await evalFormual('CHAR(97)')).toBe('a');
  expect(await evalFormual('LOWER("AB")')).toBe('ab');
  expect(await evalFormual('UPPER("ab")')).toBe('AB');
  expect(await evalFormual('SPLIT("a,b,c")')).toMatchObject(['a', 'b', 'c']);
  expect(await evalFormual('TRIM("  ab ")')).toBe('ab');
  expect(await evalFormual('STARTSWITH("xab", "ab")')).toBe(false);
  expect(await evalFormual('STARTSWITH("xab", "x")')).toBe(true);
  expect(await evalFormual('ENDSWITH("xab", "x")')).toBe(false);
  expect(await evalFormual('ENDSWITH("xab", "b")')).toBe(true);
  expect(await evalFormual('UPPERFIRST("xab")')).toBe('Xab');
  expect(await evalFormual('PADSTART("5", 3, "0")')).toBe('005');
  expect(await evalFormual('PADSTART(5, 3, 0)')).toBe('005');
  expect(await evalFormual('CAPITALIZE("star")')).toBe('Star');
  expect(await evalFormual('ESCAPE("&")')).toBe('&amp;');
  expect(await evalFormual('TRUNCATE("amis.baidu.com", 7)')).toBe('amis...');
  expect(await evalFormual('BEFORELAST("amis.baidu.com", ".")')).toBe(
    'amis.baidu'
  );
  expect(await evalFormual('BEFORELAST("amis", ".")')).toBe('amis');
  expect(await evalFormual('STRIPTAG("<b>amis</b>")')).toBe('amis');
  expect(await evalFormual('LINEBREAK("am\nis")')).toBe('am<br/>is');
  expect(await evalFormual('CONTAINS("xab", "x")')).toBe(true);
  expect(await evalFormual('CONTAINS("xab", "b")')).toBe(true);
  expect(await evalFormual('REPLACE("xabab", "ab", "cd")')).toBe('xcdcd');
  expect(await evalFormual('SEARCH("xabab", "ab")')).toBe(1);
  expect(await evalFormual('SEARCH("xabab", "cd")')).toBe(-1);
  expect(await evalFormual('SEARCH("xabab", "ab", 2)')).toBe(3);
  expect(await evalFormual('MID("xabab", 2, 2)')).toBe('ba');
});

test('formula:date', async () => {
  expect(await evalFormual('TIMESTAMP(DATE(2021, 11, 21, 0, 0, 0), "x")')).toBe(
    new Date(2021, 11, 21, 0, 0, 0).getTime()
  );
  expect(
    await evalFormual('DATETOSTR(DATE(2021, 11, 21, 0, 0, 0), "YYYY-MM-DD")')
  ).toBe('2021-12-21');
  expect(await evalFormual('DATETOSTR(DATE("2021-12-21"), "YYYY-MM-DD")')).toBe(
    '2021-12-21'
  );
  expect(await evalFormual('DATETOSTR(TODAY(), "YYYY-MM-DD")')).toBe(
    moment().format('YYYY-MM-DD')
  );
  expect(await evalFormual('DATETOSTR(NOW(), "YYYY-MM-DD")')).toBe(
    moment().format('YYYY-MM-DD')
  );
  expect(await evalFormual('DATETOSTR(1676563200, "YYYY-MM-DD")')).toBe(
    moment(1676563200, 'X').format('YYYY-MM-DD')
  );
  expect(await evalFormual('DATETOSTR(1676563200000, "YYYY-MM-DD")')).toBe(
    moment(1676563200000, 'x').format('YYYY-MM-DD')
  );
  expect(await evalFormual('DATETOSTR("12/25/2022", "YYYY-MM-DD")')).toBe(
    moment('12/25/2022').format('YYYY-MM-DD')
  );
  expect(await evalFormual('DATETOSTR("12-25-2022", "YYYY/MM/DD")')).toBe(
    moment('12-25-2022').format('YYYY/MM/DD')
  );
  expect(await evalFormual('DATETOSTR("2022年12月25日", "YYYY/MM/DD")')).toBe(
    moment('2022年12月25日', 'YYYY-MM-DD').format('YYYY/MM/DD')
  );
  expect(
    await evalFormual(
      'DATETOSTR("2022年12月25日 14时23分56秒", "YYYY/MM/DD HH:mm:ss")'
    )
  ).toBe(
    moment('2022年12月25日 14时23分56秒', 'YYYY-MM-DD HH:mm:ss').format(
      'YYYY/MM/DD HH:mm:ss'
    )
  );
  expect(await evalFormual('DATETOSTR("20230105", "YYYY/MM/DD")')).toBe(
    moment('20230105', 'YYYY-MM-DD').format('YYYY/MM/DD')
  );
  expect(await evalFormual('DATETOSTR("2023.01.05", "YYYY/MM/DD")')).toBe(
    moment('2023.01.05', 'YYYY-MM-DD').format('YYYY/MM/DD')
  );
  expect(
    await evalFormual(
      'DATETOSTR("2010-10-20 4:30 +0000", "YYYY-MM-DD HH:mm Z")'
    )
  ).toBe(moment('2010-10-20 4:30 +0000').format('YYYY-MM-DD HH:mm Z'));
  expect(
    await evalFormual(
      'DATETOSTR("2013-02-04T10:35:24-08:00", "YYYY-MM-DD HH:mm:ss")'
    )
  ).toBe(moment('2013-02-04T10:35:24-08:00').format('YYYY-MM-DD HH:mm:ss'));
  expect(await evalFormual('YEAR(STRTODATE("2021-10-24 10:10:10"))')).toBe(
    2021
  );
  expect(
    await evalFormual(
      'DATERANGESPLIT("1676563200,1676735999", undefined, "YYYY.MM.DD hh:mm:ss")'
    )
  ).toEqual(['2023.02.17 12:00:00', '2023.02.18 11:59:59']);
  expect(await evalFormual('DATERANGESPLIT("1676563200,1676735999", 0)')).toBe(
    '1676563200'
  );
  expect(
    await evalFormual(
      'DATERANGESPLIT("1676563200,1676735999", 0 , "YYYY.MM.DD hh:mm:ss")'
    )
  ).toBe('2023.02.17 12:00:00');
  expect(
    await evalFormual(
      'DATERANGESPLIT("1676563200,1676735999", "start" , "YYYY.MM.DD hh:mm:ss")'
    )
  ).toBe('2023.02.17 12:00:00');
  expect(
    await evalFormual(
      'DATERANGESPLIT("1676563200,1676735999", 1 , "YYYY.MM.DD hh:mm:ss")'
    )
  ).toBe('2023.02.18 11:59:59');
  expect(
    await evalFormual(
      'DATERANGESPLIT("1676563200,1676735999", "end" , "YYYY.MM.DD hh:mm:ss")'
    )
  ).toBe('2023.02.18 11:59:59');
  expect(await evalFormual('WEEKDAY("2023-02-27")')).toBe(
    moment('2023-02-27').weekday()
  );
  expect(await evalFormual('WEEKDAY("2023-02-27", 2)')).toBe(
    moment('2023-02-27').isoWeekday()
  );
  expect(await evalFormual('WEEK("2023-03-05")')).toBe(
    moment('2023-03-05').week()
  );
  expect(
    await evalFormual(
      'BETWEENRANGE("2023-03-08", ["2023-03-01", "2024-04-07"], "year")'
    )
  ).toBe(
    moment('2023-03-08').isBetween('2023-03-01', '2024-04-07', 'year', '[]')
  );
  expect(
    await evalFormual(
      'BETWEENRANGE("2022-03-08", ["2023-03-01", "2024-04-07"], "year")'
    )
  ).toBe(
    moment('2022-03-08').isBetween('2023-03-01', '2024-04-07', 'year', '[]')
  );
  expect(
    await evalFormual(
      'BETWEENRANGE("2023-03-08", ["2023-03-01", "2023-04-07"], "month")'
    )
  ).toBe(
    moment('2023-03-08').isBetween('2023-03-01', '2023-04-07', 'month', '[]')
  );
  expect(
    await evalFormual(
      'BETWEENRANGE("2023-05-08", ["2023-03-01", "2023-04-07", "month"])'
    )
  ).toBe(
    moment('2023-05-08').isBetween('2023-03-01', '2023-04-07', 'month', '[]')
  );
  expect(
    await evalFormual(
      'BETWEENRANGE("2023-03-06", ["2023-03-01", "2023-05-07"])'
    )
  ).toBe(
    moment('2023-03-06').isBetween('2023-03-01', '2023-05-07', 'day', '[]')
  );
  expect(
    await evalFormual(
      'BETWEENRANGE("2023-05-08", ["2023-03-01", "2023-05-07"])'
    )
  ).toBe(
    moment('2023-05-08').isBetween('2023-03-01', '2023-05-07', 'day', '[]')
  );
  expect(
    await evalFormual(
      'BETWEENRANGE("2023-05-07", ["2023-03-01", "2023-05-07"], "day", "()")'
    )
  ).toBe(
    moment('2023-05-07').isBetween('2023-03-01', '2023-05-07', 'day', '()')
  );
  expect(
    await evalFormual(
      'CONCATENATE(STARTOF("2023-02-28", "day"), "," ,ENDOF("2023-02-28", "day"))'
    )
  ).toBe(
    `${moment('2023-02-28').startOf('day').format()},${moment('2023-02-28')
      .endOf('day')
      .format()}`
  );
  expect(
    await evalFormual(
      'CONCATENATE(STARTOF("2023-02-28", "day", "YYYY-MM-DD HH:mm:ss"), ",", ENDOF("2023-02-28", "day", "YYYY-MM-DD HH:mm:ss"))'
    )
  ).toBe(
    `${moment('2023-02-28')
      .startOf('day')
      .format('YYYY-MM-DD HH:mm:ss')},${moment('2023-02-28')
      .endOf('day')
      .format('YYYY-MM-DD HH:mm:ss')}`
  );
  expect(
    await evalFormual(
      'CONCATENATE(STARTOF("2023-02-28", "day", "X"), "," ,ENDOF("2023-02-28", "day", "X"))'
    )
  ).toBe(
    `${moment('2023-02-28').startOf('day').format('X')},${moment('2023-02-28')
      .endOf('day')
      .format('X')}`
  );
});

test('formula:last', async () => {
  expect(await evalFormual('LAST([1, 2, 3])')).toBe(3);
});

test('formula:basename', async () => {
  expect(await evalFormual('BASENAME("/home/amis/a.json")')).toBe('a.json');
});

test('formula:customFunction', async () => {
  registerFunction('ASYNCFUNCTION', async input => {
    const response = await Promise.resolve({
      status: 0,
      data: {
        name: 'amis'
      }
    });
    return response;
  });

  expect(await evalFormual('ASYNCFUNCTION()')).toMatchObject({
    status: 0,
    data: {
      name: 'amis'
    }
  });
});
