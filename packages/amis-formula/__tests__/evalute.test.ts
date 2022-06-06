import {evaluate, parse} from '../src';

test('evalute:simple', () => {
  expect(
    evaluate('a is ${a}', {
      a: 123
    })
  ).toBe('a is 123');
});

test('evalute:filter', () => {
  expect(
    evaluate(
      'a is ${a | abc}',
      {
        a: 123
      },
      {
        filters: {
          abc(input: any) {
            return `${input}456`;
          }
        }
      }
    )
  ).toBe('a is 123456');

  expect(
    evaluate(
      'a is ${a | concat:233}',
      {
        a: 123
      },
      {
        filters: {
          concat(input: any, arg: string) {
            return `${input}${arg}`;
          }
        }
      }
    )
  ).toBe('a is 123233');

  expect(
    evaluate(
      'a is ${concat(a, a)}',
      {
        a: 123
      },
      {
        filters: {
          concat(input: any, arg: string) {
            return `${input}${arg}`;
          }
        }
      }
    )
  ).toBe('a is 123123');
});

test('evalute:filter2', () => {
  expect(
    evaluate(
      'a is ${[1, 2, 3] | concat:4 | join}',
      {},
      {
        filters: {
          concat(input: any, ...args: Array<any>) {
            return input.concat.apply(input, args);
          },
          join(input: any) {
            return input.join(',');
          }
        }
      }
    )
  ).toBe('a is 1,2,3,4');
});

test('evalute:filter3', () => {
  expect(
    evaluate(
      'a is ${[1, 2, 3] | concat:"4" | join}',
      {},
      {
        filters: {
          concat(input: any, ...args: Array<any>) {
            return input.concat.apply(input, args);
          },
          join(input: any) {
            return input.join(',');
          }
        }
      }
    )
  ).toBe('a is 1,2,3,4');
});

test('evalute:filter4', () => {
  expect(
    evaluate(
      'a is ${[1, 2, 3] | concat:${a + 3} | join}',
      {
        a: 4
      },
      {
        filters: {
          concat(input: any, ...args: Array<any>) {
            return input.concat.apply(input, args);
          },
          join(input: any) {
            return input.join(',');
          }
        }
      }
    )
  ).toBe('a is 1,2,3,7');
});

test('evalute:oldVariable', () => {
  expect(
    evaluate('a is $a', {
      a: 4
    })
  ).toBe('a is 4');

  expect(
    evaluate('b is $b', {
      a: 4
    })
  ).toBe('b is ');

  expect(
    evaluate('a.b is $a.b', {
      a: {
        b: 233
      }
    })
  ).toBe('a.b is 233');
});

test('evalute:ariable2', () => {
  expect(
    evaluate('a is $$', {
      a: 4
    })
  ).toBe('a is [object Object]');
});

test('evalute:ariable3', () => {
  expect(
    evaluate(
      '$$',
      {
        a: 4
      },
      {
        defaultFilter: 'raw'
      }
    )
  ).toMatchObject({
    a: 4
  });
});

test('evalute:object-variable', () => {
  const data = {
    key: 'x',
    obj: {
      x: 1,
      y: 2
    }
  };

  expect(evaluate('a is ${obj.x}', data)).toBe('a is 1');
  expect(evaluate('a is ${obj[x]}', data)).toBe('a is 1');
  expect(evaluate('a is ${obj[`x`]}', data)).toBe('a is 1');
  expect(evaluate('a is ${obj["x"]}', data)).toBe('a is 1');
  expect(evaluate('a is ${obj[key]}', data)).toBe('a is 1');
  expect(evaluate('a is ${obj[`${key}`]}', data)).toBe('a is 1');
  expect(evaluate('a is ${obj[${key}]}', data)).toBe('a is 1');
});

test('evalute:literal-variable', () => {
  const data = {
    key: 'x',
    index: 0,
    obj: {
      x: 1,
      y: 2
    }
  };

  expect(evaluate('a is ${({x: 1})["x"]}', data)).toBe('a is 1');
  expect(evaluate('a is ${({x: 1}).x}', data)).toBe('a is 1');
  expect(evaluate('a is ${(["a", "b"])[index]}', data)).toBe('a is a');
  expect(evaluate('a is ${(["a", "b"])[1]}', data)).toBe('a is b');
  expect(evaluate('a is ${(["a", "b"]).0}', data)).toBe('a is a');
});

test('evalute:tempalte', () => {
  const data = {
    key: 'x'
  };

  expect(evaluate('abc${`11${3}22`}xyz', data)).toBe('abc11322xyz');
  expect(evaluate('abc${`${3}22`}xyz', data)).toBe('abc322xyz');
  expect(evaluate('abc${`11${3}`}xyz', data)).toBe('abc113xyz');
  expect(evaluate('abc${`${3}`}xyz', data)).toBe('abc3xyz');
  expect(evaluate('abc${`${key}`}xyz', data)).toBe('abcxxyz');
});

test('evalute:literal', () => {
  const data = {
    dynamicKey: 'alpha'
  };

  expect(
    evaluate('${{a: 1, 0: 2, "3": 3}}', data, {
      defaultFilter: 'raw'
    })
  ).toMatchObject({
    a: 1,
    0: 2,
    3: 3
  });

  expect(
    evaluate('${{a: 1, 0: 2, "3": 3, [`4`]: 4}}', data, {
      defaultFilter: 'raw'
    })
  ).toMatchObject({
    a: 1,
    0: 2,
    3: 3,
    4: 4
  });

  expect(
    evaluate('${{a: 1, 0: 2, "3": 3, [`${dynamicKey}233`]: 4}}', data, {
      defaultFilter: 'raw'
    })
  ).toMatchObject({
    a: 1,
    0: 2,
    3: 3,
    alpha233: 4
  });

  expect(
    evaluate('${[1, 2, `2${dynamicKey}2`, {a: 1, 0: 2, [`2`]: "3"}]}', data, {
      defaultFilter: 'raw'
    })
  ).toMatchObject([1, 2, `2alpha2`, {a: 1, 0: 2, [`2`]: '3'}]);
});

test('evalute:variableName', () => {
  const data = {
    'a-b': 'c',
    '222': 10222,
    '222_221': 233,
    '222_abcde': 'abcde',
    '222-221': 333
  };

  expect(evaluate('${a-b}', data)).toBe('c');
  expect(evaluate('${222}', data)).toBe(222);
  expect(evaluate('${222_221}', data)).toBe('233');
  expect(evaluate('${222-221}', data)).toBe(1);
  expect(evaluate('${222_abcde}', data)).toBe('abcde');
  expect(
    evaluate('${&["222-221"]}', data, {
      defaultFilter: 'raw'
    })
  ).toBe(333);
  expect(
    evaluate('222', data, {
      variableMode: true
    })
  ).toBe(10222);
});

test('evalute:3-1', () => {
  const data = {};

  expect(evaluate('${3-1}', data)).toBe(2);
  expect(evaluate('${-1 + 2.5 + 3}', data)).toBe(4.5);
  expect(evaluate('${-1 + -1}', data)).toBe(-2);
  expect(evaluate('${3 * -1}', data)).toBe(-3);

  expect(evaluate('${3 + +1}', data)).toBe(4);
});

test('evalate:0.1+0.2', () => {
  expect(evaluate('${0.1 + 0.2}', {})).toBe(0.3);
});

test('evalute:variable:com.xxx.xx', () => {
  const data = {
    'com.xxx.xx': 'abc',
    'com xxx%xx': 'cde',
    'com[xxx]': 'eee'
  };

  expect(evaluate('${com\\.xxx\\.xx}', data)).toBe('abc');
  expect(evaluate('${com\\ xxx\\%xx}', data)).toBe('cde');
  expect(evaluate('${com\\[xxx\\]}', data)).toBe('eee');
});

test('evalute:anonymous:function', () => {
  const data = {
    arr: [1, 2, 3],
    arr2: [
      {
        a: 1
      },
      {
        a: 2
      },
      {
        a: 3
      }
    ],
    outter: 4
  };

  expect(evaluate('${() => 233}', data)).toMatchObject({
    args: [],
    return: {type: 'literal', value: 233},
    type: 'anonymous_function'
  });

  expect(evaluate('${ARRAYMAP(arr, () => 1)}', data)).toMatchObject([1, 1, 1]);
  expect(evaluate('${ARRAYMAP(arr, item => item)}', data)).toMatchObject([
    1, 2, 3
  ]);
  expect(evaluate('${ARRAYMAP(arr, item => item * 2)}', data)).toMatchObject([
    2, 4, 6
  ]);
  expect(
    evaluate('${ARRAYMAP(arr2, (item, index) => `a${item.a}${index}`)}', data)
  ).toMatchObject(['a10', 'a21', 'a32']);
  expect(
    evaluate(
      '${ARRAYMAP(arr2, (item, index) => `a${item.a}${index}${outter}`)}',
      data
    )
  ).toMatchObject(['a104', 'a214', 'a324']);
  expect(
    evaluate(
      '${ARRAYMAP(arr2, (item, index) => {x: item.a, index: index})}',
      data
    )
  ).toMatchObject([
    {
      x: 1,
      index: 0
    },
    {
      x: 2,
      index: 1
    },
    {
      x: 3,
      index: 2
    }
  ]);
});

test('evalute:anonymous:function2', () => {
  const data = {
    arr: [1, 2, 3],
    arr2: [
      {
        x: 1,
        y: [
          {
            z: 1
          },
          {
            z: 1
          }
        ]
      },
      {
        x: 2,
        y: [
          {
            z: 2
          },
          {
            z: 2
          }
        ]
      }
    ]
  };

  expect(
    evaluate(
      '${ARRAYMAP(ARRAYMAP(arr, item => item * 2), item => item + 2)}',
      data
    )
  ).toMatchObject([4, 6, 8]);

  expect(
    evaluate('${ARRAYMAP(arr2, item => ARRAYMAP(item.y, i => i.z))}', data)
  ).toMatchObject([
    [1, 1],
    [2, 2]
  ]);
});

test('evalute:array:func', () => {
  const data = {
    arr1: [0, 1, false, 2, '', 3],
    arr2: ['a', 'b', 'c'],
    arr3: [1, 2, 3],
    arr4: [2, 4, 6]
  };

  expect(evaluate('${COMPACT(arr1)}', data)).toMatchObject([1, 2, 3]);

  expect(evaluate("${COMPACT([0, 1, false, 2, '', 3])}", data)).toMatchObject([
    1, 2, 3
  ]);

  expect(evaluate('${JOIN(arr2, "~")}', data)).toMatch('a~b~c');

  expect(evaluate('${SUM(arr3)}', data)).toBe(6);

  expect(evaluate('${AVG(arr4)}', data)).toBe(4);

  expect(evaluate('${MIN(arr4)}', data)).toBe(2);

  expect(evaluate('${MAX(arr4)}', data)).toBe(6);
});
