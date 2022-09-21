import moment from 'moment';
import {evaluate, parse} from '../src';

const defaultContext = {
  a: 1,
  b: 2,
  c: 3,
  d: 4,
  e: 5
};

function evalFormual(expression: string, data: any = defaultContext) {
  return evaluate(expression, data, {
    evalMode: true
  });
}

test('formula:expression', () => {
  expect(evalFormual('a + 3')).toBe(4);
  expect(evalFormual('b * 3')).toBe(6);
  expect(evalFormual('b * 3 + 4')).toBe(10);
  expect(evalFormual('c * (3 + 4)')).toBe(21);
  expect(evalFormual('d / (a + 1)')).toBe(2);
  expect(evalFormual('5 % 3')).toBe(2);
  expect(evalFormual('3 | 4')).toBe(7);
  expect(evalFormual('4 ^ 4')).toBe(0);
  expect(evalFormual('4 ^ 4')).toBe(0);
  expect(evalFormual('4 & 4')).toBe(4);
  expect(evalFormual('4 & 3')).toBe(0);
  expect(evalFormual('~-1')).toBe(0);
  expect(evalFormual('!!1')).toBe(true);
  expect(evalFormual('!!""')).toBe(false);
  expect(evalFormual('1 || 2')).toBe(1);
  expect(evalFormual('1 && 2')).toBe(2);
  expect(evalFormual('1 && 2 || 3')).toBe(2);
  expect(evalFormual('1 || 2 || 3')).toBe(1);
  expect(evalFormual('1 || 2 && 3')).toBe(1);
  expect(evalFormual('(1 || 2) && 3')).toBe(3);
  expect(evalFormual('1 == "1"')).toBe(true);
  expect(evalFormual('1 === "1"')).toBe(false);
  expect(evalFormual('1 < 1')).toBe(false);
  expect(evalFormual('1 <= 1')).toBe(true);
  expect(evalFormual('1 > 1')).toBe(false);
  expect(evalFormual('1 >= 1')).toBe(true);
  expect(evalFormual('3 >> 1')).toBe(1);
  expect(evalFormual('3 << 1')).toBe(6);
  expect(evalFormual('10 ** 3')).toBe(1000);

  expect(evalFormual('10 ? 3 : 2')).toBe(3);
  expect(evalFormual('0 ? 3 : 2')).toBe(2);
});

test('formula:expression2', () => {
  expect(evalFormual('a[0]', {a: [1, 2, 3]})).toBe(1);
  expect(evalFormual('a[b]', {a: [1, 2, 3], b: 1})).toBe(2);
  expect(evalFormual('a[b - 1]', {a: [1, 2, 3], b: 1})).toBe(1);
  expect(evalFormual('a[b ? 1 : 2]', {a: [1, 2, 3], b: 1})).toBe(2);
  expect(evalFormual('a[c ? 1 : 2]', {a: [1, 2, 3], b: 1})).toBe(3);
});

test('formula:expression3', () => {
  expect(evalFormual('${a} === "b"', {a: 'b'})).toBe(true);
  expect(evalFormual('b === "b"')).toBe(false);
  // expect(evalFormual('${a}', {a: 'b'})).toBe('b');

  expect(evalFormual('obj.x.a', {obj: {x: {a: 1}}})).toBe(1);
  expect(evalFormual('obj.y.a', {obj: {x: {a: 1}}})).toBe(undefined);
});

test('formula:if', () => {
  expect(evalFormual('IF(true, 2, 3)')).toBe(2);
  expect(evalFormual('IF(false, 2, 3)')).toBe(3);
  expect(evalFormual('IF(false, 2, IF(true, 3, 4))')).toBe(3);
});

test('formula:and', () => {
  expect(!!evalFormual('AND(0, 1)')).toBe(false);
  expect(!!evalFormual('AND(1, 1)')).toBe(true);
  expect(!!evalFormual('AND(1, 1, 1, 0)')).toBe(false);
});

test('formula:or', () => {
  expect(!!evalFormual('OR(0, 1)')).toBe(true);
  expect(!!evalFormual('OR(1, 1)')).toBe(true);
  expect(!!evalFormual('OR(1, 1, 1, 0)')).toBe(true);
  expect(!!evalFormual('OR(0, 0, 0, 0)')).toBe(false);
});

test('formula:xor', () => {
  expect(evalFormual('XOR(0, 1)')).toBe(false);
  expect(evalFormual('XOR(1, 0)')).toBe(false);
  expect(evalFormual('XOR(1, 1)')).toBe(true);
  expect(evalFormual('XOR(0, 0)')).toBe(true);
});

test('formula:ifs', () => {
  expect(!!evalFormual('IFS(0, 1, 2)')).toBe(true);
  expect(!!evalFormual('IFS(0, 1, 2, 2, 3)')).toBe(true);
  expect(!!evalFormual('IFS(0, 1, 0, 2, 0)')).toBe(false);
  expect(evalFormual('IFS(0, 1, 2, 2)')).toBe(2);
  expect(evalFormual('IFS(0, 1, 0, 2)')).toBe(undefined);
});

test('formula:math', () => {
  expect(evalFormual('ABS(1)')).toBe(1);
  expect(evalFormual('ABS(-1)')).toBe(1);
  expect(evalFormual('ABS(0)')).toBe(0);

  expect(evalFormual('MAX(1, -1, 2, 3, 5, -9)')).toBe(5);
  expect(evalFormual('MIN(1, -1, 2, 3, 5, -9)')).toBe(-9);

  expect(evalFormual('MOD(3, 2)')).toBe(1);

  expect(evalFormual('PI()')).toBe(Math.PI);

  expect(evalFormual('ROUND(3.55)')).toBe(3.55);
  expect(evalFormual('ROUND(3.45)')).toBe(3.45);

  expect(evalFormual('ROUND(3.456789, 2)')).toBe(3.46);
  expect(evalFormual('CEIL(3.456789)')).toBe(3.46);
  expect(evalFormual('FLOOR(3.456789)')).toBe(3.45);

  expect(evalFormual('SQRT(4)')).toBe(2);
  expect(evalFormual('AVG(4, 6, 10, 10, 10)')).toBe(8);

  // 示例来自 https://support.microsoft.com/zh-cn/office/devsq-%E5%87%BD%E6%95%B0-8b739616-8376-4df5-8bd0-cfe0a6caf444
  expect(evalFormual('DEVSQ(4,5,8,7,11,4,3)')).toBe(48);
  // 示例来自 https://support.microsoft.com/zh-cn/office/avedev-%E5%87%BD%E6%95%B0-58fe8d65-2a84-4dc7-8052-f3f87b5c6639
  expect(evalFormual('ROUND(AVEDEV(4,5,6,7,5,4,3), 2)')).toBe(1.02);
  // 示例来自 https://support.microsoft.com/zh-cn/office/harmean-%E5%87%BD%E6%95%B0-5efd9184-fab5-42f9-b1d3-57883a1d3bc6
  expect(evalFormual('ROUND(HARMEAN(4,5,8,7,11,4,3), 3)')).toBe(5.028);

  expect(evalFormual('LARGE([1,3,5,4,7,6], 3)')).toBe(5);
  expect(evalFormual('LARGE([1,3,5,4,7,6], 1)')).toBe(7);

  expect(evalFormual('UPPERMONEY(7682.01)')).toBe('柒仟陆佰捌拾贰元壹分');
  expect(evalFormual('UPPERMONEY(7682)')).toBe('柒仟陆佰捌拾贰元整');

  // 非数字类型转换是否正常？
  expect(evalFormual('"3" + "3"')).toBe(6);
  expect(evalFormual('"3" - "3"')).toBe(0);
  expect(evalFormual('AVG(4, "6", "10", 10, 10)')).toBe(8);
  expect(evalFormual('MAX(4, "6", "10", 2, 3)')).toBe(10);

  expect(evalFormual('"a" + "b"')).toBe('ab');
});

test('formula:text', () => {
  expect(evalFormual('LEFT("abcdefg", 2)')).toBe('ab');
  expect(evalFormual('RIGHT("abcdefg", 2)')).toBe('fg');
  expect(evalFormual('LENGTH("abcdefg")')).toBe(7);
  expect(evalFormual('LEN("abcdefg")')).toBe(7);
  expect(evalFormual('ISEMPTY("abcdefg")')).toBe(false);
  expect(evalFormual('ISEMPTY("")')).toBe(true);
  expect(evalFormual('CONCATENATE("a", "b", "c", "d")')).toBe('abcd');
  expect(evalFormual('CHAR(97)')).toBe('a');
  expect(evalFormual('LOWER("AB")')).toBe('ab');
  expect(evalFormual('UPPER("ab")')).toBe('AB');
  expect(evalFormual('SPLIT("a,b,c")')).toMatchObject(['a', 'b', 'c']);
  expect(evalFormual('TRIM("  ab ")')).toBe('ab');
  expect(evalFormual('STARTSWITH("xab", "ab")')).toBe(false);
  expect(evalFormual('STARTSWITH("xab", "x")')).toBe(true);
  expect(evalFormual('ENDSWITH("xab", "x")')).toBe(false);
  expect(evalFormual('ENDSWITH("xab", "b")')).toBe(true);
  expect(evalFormual('UPPERFIRST("xab")')).toBe('Xab');
  expect(evalFormual('PADSTART("5", 3, "0")')).toBe('005');
  expect(evalFormual('PADSTART(5, 3, 0)')).toBe('005');
  expect(evalFormual('CAPITALIZE("star")')).toBe('Star');
  expect(evalFormual('ESCAPE("&")')).toBe('&amp;');
  expect(evalFormual('TRUNCATE("amis.baidu.com", 7)')).toBe('amis...');
  expect(evalFormual('BEFORELAST("amis.baidu.com", ".")')).toBe('amis.baidu');
  expect(evalFormual('BEFORELAST("amis", ".")')).toBe('amis');
  expect(evalFormual('STRIPTAG("<b>amis</b>")')).toBe('amis');
  expect(evalFormual('LINEBREAK("am\nis")')).toBe('am<br/>is');
  expect(evalFormual('CONTAINS("xab", "x")')).toBe(true);
  expect(evalFormual('CONTAINS("xab", "b")')).toBe(true);
  expect(evalFormual('REPLACE("xabab", "ab", "cd")')).toBe('xcdcd');
  expect(evalFormual('SEARCH("xabab", "ab")')).toBe(1);
  expect(evalFormual('SEARCH("xabab", "cd")')).toBe(-1);
  expect(evalFormual('SEARCH("xabab", "ab", 2)')).toBe(3);
  expect(evalFormual('MID("xabab", 2, 2)')).toBe('ba');
});

test('formula:date', () => {
  expect(evalFormual('TIMESTAMP(DATE(2021, 11, 21, 0, 0, 0), "x")')).toBe(
    new Date(2021, 11, 21, 0, 0, 0).getTime()
  );
  expect(
    evalFormual('DATETOSTR(DATE(2021, 11, 21, 0, 0, 0), "YYYY-MM-DD")')
  ).toBe('2021-12-21');
  expect(evalFormual('DATETOSTR(DATE("2021-12-21"), "YYYY-MM-DD")')).toBe(
    '2021-12-21'
  );
  expect(evalFormual('DATETOSTR(TODAY(), "YYYY-MM-DD")')).toBe(
    moment().format('YYYY-MM-DD')
  );
  expect(evalFormual('DATETOSTR(NOW(), "YYYY-MM-DD")')).toBe(
    moment().format('YYYY-MM-DD')
  );
  expect(evalFormual('YEAR(STRTODATE("2021-10-24 10:10:10"))')).toBe(2021);
});

test('formula:last', () => {
  expect(evalFormual('LAST([1, 2, 3])')).toBe(3);
});

test('formula:basename', () => {
  expect(evalFormual('BASENAME("/home/amis/a.json")')).toBe('a.json');
});
