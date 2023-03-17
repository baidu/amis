import {parse} from '../src/index';

test('parser:simple', () => {
  expect(
    parse('expression result is ${a + b}', {
      evalMode: false
    })
  ).toMatchSnapshot();
});

test('parser:complex', () => {
  expect(
    parse('raw content ${`es tempalte ${`deeper${a + 3}`}`}', {
      evalMode: false
    })
  ).toMatchSnapshot();
});

test('parser:evalMode', () => {
  expect(
    parse('a + b', {
      evalMode: true
    })
  ).toMatchSnapshot();
});

test('parser:template', () => {
  expect(
    parse('`abc${a + b}`', {
      evalMode: true
    })
  ).toMatchSnapshot();
});

test('parser:string', () => {
  expect(
    parse('"string literall, escape \\""', {
      evalMode: true
    })
  ).toMatchSnapshot();
});

test('parser:number', () => {
  expect(
    parse('-1 + 2.5 + 3', {
      evalMode: true
    })
  ).toMatchSnapshot();
});

test('parser:single-string', () => {
  expect(
    parse("'string'", {
      evalMode: true
    })
  ).toMatchSnapshot();
});

test('parser:object-literall', () => {
  expect(
    parse("{a: 1, 'b': 2, [`c`]: 3, d: {}}", {
      evalMode: true
    })
  ).toMatchSnapshot();
});

test('parser:array-literall', () => {
  expect(
    parse('[a, b, 1, 2, {a: 1}]', {
      evalMode: true
    })
  ).toMatchSnapshot();
});

test('parser:variable-geter', () => {
  expect(
    parse('doAction(a.b, a[b], a["c"], a[`d`])', {
      evalMode: true
    })
  ).toMatchSnapshot();
});

test('parser:variable-geter2', () => {
  expect(
    parse('a[b]["c"][d][`x`]', {
      evalMode: true
    })
  ).toMatchSnapshot();

  expect(
    parse('a[b]["c"].d[`x`]', {
      evalMode: true
    })
  ).toMatchSnapshot();
});
test('parser:multi-expression', () => {
  expect(
    parse('(a.b, a[b], a["c"], a[`d`])', {
      evalMode: true
    })
  ).toMatchSnapshot();
});

test('parser:functionCall', () => {
  expect(
    parse('doAction(a, doAction(b))', {
      evalMode: true
    })
  ).toMatchSnapshot();
});

test('parser:filter', () => {
  expect(
    parse('\\$abc is ${abc | html}', {
      evalMode: false
    })
  ).toMatchSnapshot();
});

test('parser:filter-escape', () => {
  expect(
    parse('\\$abc is ${abc | date: YYYY-MM-DD HH\\:mm\\:ss}', {
      evalMode: false
    })
  ).toMatchSnapshot();
});

test('parser:conditional', () => {
  expect(
    parse('a ? b : c', {
      evalMode: true
    })
  ).toMatchSnapshot();
});

test('parser:binary-expression', () => {
  expect(
    parse('a && b && c', {
      evalMode: true
    })
  ).toMatchSnapshot();

  expect(
    parse('a && b || c', {
      evalMode: true
    })
  ).toMatchSnapshot();

  expect(
    parse('a || b && c', {
      evalMode: true
    })
  ).toMatchSnapshot();

  expect(
    parse('a !== b === c', {
      evalMode: true
    })
  ).toMatchSnapshot();
});

test('parser:group-expression', () => {
  expect(
    parse('a && (b && c)', {
      evalMode: true
    })
  ).toMatchSnapshot();
});

test('parser:unary-expression', () => {
  expect(
    parse('!!a', {
      evalMode: true
    })
  ).toMatchSnapshot();
});

test('parser:anonymous-function', () => {
  expect(
    parse('() => 1', {
      evalMode: true
    })
  ).toMatchSnapshot();

  expect(
    parse('() => "string"', {
      evalMode: true
    })
  ).toMatchSnapshot();

  expect(
    parse('(a) => `${a.a}---${a.b}`', {
      evalMode: true
    })
  ).toMatchSnapshot();
});

// test('parser:test', () => {
//   console.log(JSON.stringify(parse('ARRAYMAP(arr, (item) => item.abc)', {
//     evalMode: true
//   }), null, 2));
// });
