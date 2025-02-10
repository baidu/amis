import {evaluateForAsync, parse} from '../src';

test('evalute:simple', async () => {
  expect(
    await evaluateForAsync('a is ${a}', {
      a: 123
    })
  ).toBe('a is 123');
});

test('evalute:filter', async () => {
  expect(
    await evaluateForAsync(
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
    await evaluateForAsync(
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
    await evaluateForAsync(
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

test('evalute:filter2', async () => {
  expect(
    await evaluateForAsync(
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

test('evalute:filter3', async () => {
  expect(
    await evaluateForAsync(
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

test('evalute:filter4', async () => {
  expect(
    await evaluateForAsync(
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

test('evalute:oldVariable', async () => {
  expect(
    await evaluateForAsync('a is $a', {
      a: 4
    })
  ).toBe('a is 4');

  expect(
    await evaluateForAsync('b is $b', {
      a: 4
    })
  ).toBe('b is ');

  expect(
    await evaluateForAsync('a.b is $a.b', {
      a: {
        b: 233
      }
    })
  ).toBe('a.b is 233');
});

test('evalute:ariable2', async () => {
  expect(
    await evaluateForAsync('a is $$', {
      a: 4
    })
  ).toBe('a is [object Object]');
});

test('evalute:ariable3', async () => {
  expect(
    await evaluateForAsync(
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

test('evalute:object-variable', async () => {
  const data = {
    key: 'x',
    obj: {
      x: 1,
      y: 2
    }
  };

  expect(await evaluateForAsync('a is ${obj.x}', data)).toBe('a is 1');
  expect(await evaluateForAsync('a is ${obj[x]}', data)).toBe('a is 1');
  expect(await evaluateForAsync('a is ${obj[`x`]}', data)).toBe('a is 1');
  expect(await evaluateForAsync('a is ${obj["x"]}', data)).toBe('a is 1');
  expect(await evaluateForAsync('a is ${obj[key]}', data)).toBe('a is 1');
  expect(await evaluateForAsync('a is ${obj[`${key}`]}', data)).toBe('a is 1');
  expect(await evaluateForAsync('a is ${obj[${key}]}', data)).toBe('a is 1');
});

test('evalute:literal-variable', async () => {
  const data = {
    key: 'x',
    index: 0,
    obj: {
      x: 1,
      y: 2
    }
  };

  expect(await evaluateForAsync('a is ${({x: 1})["x"]}', data)).toBe('a is 1');
  expect(await evaluateForAsync('a is ${({x: 1}).x}', data)).toBe('a is 1');
  expect(await evaluateForAsync('a is ${(["a", "b"])[index]}', data)).toBe(
    'a is a'
  );
  expect(await evaluateForAsync('a is ${(["a", "b"])[1]}', data)).toBe(
    'a is b'
  );
  expect(await evaluateForAsync('a is ${(["a", "b"]).0}', data)).toBe('a is a');
});

test('evalute:tempalte', async () => {
  const data = {
    key: 'x'
  };

  expect(await evaluateForAsync('abc${`11${3}22`}xyz', data)).toBe(
    'abc11322xyz'
  );
  expect(await evaluateForAsync('abc${`${3}22`}xyz', data)).toBe('abc322xyz');
  expect(await evaluateForAsync('abc${`11${3}`}xyz', data)).toBe('abc113xyz');
  expect(await evaluateForAsync('abc${`${3}`}xyz', data)).toBe('abc3xyz');
  expect(await evaluateForAsync('abc${`${key}`}xyz', data)).toBe('abcxxyz');
});

test('evalute:literal', async () => {
  const data = {
    dynamicKey: 'alpha'
  };

  expect(
    await evaluateForAsync('${{a: 1, 0: 2, "3": 3}}', data, {
      defaultFilter: 'raw'
    })
  ).toMatchObject({
    a: 1,
    0: 2,
    3: 3
  });

  expect(
    await evaluateForAsync('${{a: 1, 0: 2, "3": 3, [`4`]: 4}}', data, {
      defaultFilter: 'raw'
    })
  ).toMatchObject({
    a: 1,
    0: 2,
    3: 3,
    4: 4
  });

  expect(
    await evaluateForAsync(
      '${{a: 1, 0: 2, "3": 3, [`${dynamicKey}233`]: 4}}',
      data,
      {
        defaultFilter: 'raw'
      }
    )
  ).toMatchObject({
    a: 1,
    0: 2,
    3: 3,
    alpha233: 4
  });

  expect(
    await evaluateForAsync(
      '${[1, 2, `2${dynamicKey}2`, {a: 1, 0: 2, [`2`]: "3"}]}',
      data,
      {
        defaultFilter: 'raw'
      }
    )
  ).toMatchObject([1, 2, `2alpha2`, {a: 1, 0: 2, [`2`]: '3'}]);
});

test('evalute:variableName', async () => {
  const data = {
    'a_b': 'c',
    '222': 10222,
    '222_221': 233,
    '222_abcde': 'abcde',
    '222-221': 333
  };

  expect(await evaluateForAsync('${a_b}', data)).toBe('c');
  expect(await evaluateForAsync('${222}', data)).toBe(222);
  expect(await evaluateForAsync('${222_221}', data)).toBe('233');
  expect(await evaluateForAsync('${222-221}', data)).toBe(1);
  expect(await evaluateForAsync('${222_abcde}', data)).toBe('abcde');
  expect(
    await evaluateForAsync('${&["222-221"]}', data, {
      defaultFilter: 'raw'
    })
  ).toBe(333);
  expect(
    await evaluateForAsync('222', data, {
      variableMode: true
    })
  ).toBe(10222);
});

test('evalute:3-1', async () => {
  const data = {};

  expect(await evaluateForAsync('${3-1}', data)).toBe(2);
  expect(await evaluateForAsync('${-1 + 2.5 + 3}', data)).toBe(4.5);
  expect(await evaluateForAsync('${-1 + -1}', data)).toBe(-2);
  expect(await evaluateForAsync('${3 * -1}', data)).toBe(-3);

  expect(await evaluateForAsync('${3 + +1}', data)).toBe(4);
});

test('evalate:0.1+0.2', async () => {
  expect(await evaluateForAsync('${0.1 + 0.2}', {})).toBe(0.3);
});

test('evalute:variable:com.xxx.xx', async () => {
  const data = {
    'com.xxx.xx': 'abc',
    'com xxx%xx': 'cde',
    'com[xxx]': 'eee'
  };

  expect(await evaluateForAsync('${com\\.xxx\\.xx}', data)).toBe('abc');
  expect(await evaluateForAsync('${com\\ xxx\\%xx}', data)).toBe('cde');
  expect(await evaluateForAsync('${com\\[xxx\\]}', data)).toBe('eee');
});

test('evalute:anonymous:function', async () => {
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

  expect(await evaluateForAsync('${() => 233}', data)).toMatchObject({
    args: [],
    return: {type: 'literal', value: 233},
    type: 'anonymous_function'
  });

  expect(
    await evaluateForAsync('${ARRAYMAP(arr, () => 1)}', data)
  ).toMatchObject([1, 1, 1]);
  expect(
    await evaluateForAsync('${ARRAYMAP(arr, item => item)}', data)
  ).toMatchObject([1, 2, 3]);
  expect(
    await evaluateForAsync('${ARRAYMAP(arr, item => item * 2)}', data)
  ).toMatchObject([2, 4, 6]);
  expect(
    await evaluateForAsync(
      '${ARRAYMAP(arr2, (item, index) => `a${item.a}${index}`)}',
      data
    )
  ).toMatchObject(['a10', 'a21', 'a32']);
  expect(
    await evaluateForAsync(
      '${ARRAYMAP(arr2, (item, index) => `a${item.a}${index}${outter}`)}',
      data
    )
  ).toMatchObject(['a104', 'a214', 'a324']);
  expect(
    await evaluateForAsync(
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

test('evalute:anonymous:function2', async () => {
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
    await evaluateForAsync(
      '${ARRAYMAP(ARRAYMAP(arr, item => item * 2), item => item + 2)}',
      data
    )
  ).toMatchObject([4, 6, 8]);

  expect(
    await evaluateForAsync(
      '${ARRAYMAP(arr2, item => ARRAYMAP(item.y, i => i.z))}',
      data
    )
  ).toMatchObject([
    [1, 1],
    [2, 2]
  ]);
});

test('evalute:array:func', async () => {
  const data = {
    arr1: [0, 1, false, 2, '', 3],
    arr2: ['a', 'b', 'c'],
    arr3: [1, 2, 3],
    arr4: [2, 4, 6],
    arr5: [
      {
        id: 1.1
      },
      {
        id: 2.2
      },
      {
        id: 1.1,
        name: 1.3
      }
    ],
    obj1: {
      p1: 'name',
      p2: 'age',
      p3: 'obj',
      p4: [
        {
          p41: 'Tom',
          p42: 'Jerry'
        },
        {
          p41: 'baidu',
          p42: 'amis'
        }
      ]
    }
  };

  expect(await evaluateForAsync('${COMPACT(arr1)}', data)).toMatchObject([
    1, 2, 3
  ]);

  expect(
    await evaluateForAsync("${COMPACT([0, 1, false, 2, '', 3])}", data)
  ).toMatchObject([1, 2, 3]);

  expect(await evaluateForAsync('${JOIN(arr2, "~")}', data)).toMatch('a~b~c');

  expect(await evaluateForAsync('${SUM(arr3)}', data)).toBe(6);

  expect(await evaluateForAsync('${AVG(arr4)}', data)).toBe(4);

  expect(await evaluateForAsync('${MIN(arr4)}', data)).toBe(2);

  expect(await evaluateForAsync('${MAX(arr4)}', data)).toBe(6);

  expect(await evaluateForAsync('${CONCAT(arr3, arr4)}', data)).toMatchObject([
    1, 2, 3, 2, 4, 6
  ]);

  expect(await evaluateForAsync('${CONCAT(arr, arr4)}', data)).toMatchObject([
    2, 4, 6
  ]);

  expect(await evaluateForAsync('${UNIQ(arr5)}', data)).toMatchObject(
    data.arr5
  );

  expect(await evaluateForAsync('${UNIQ(arr5, "id")}', data)).toMatchObject([
    {id: 1.1},
    {id: 2.2}
  ]);

  expect(
    await evaluateForAsync('${ARRAYFILTER(arr1, item => item)}', data)
  ).toMatchObject([1, 2, 3]);
  expect(
    await evaluateForAsync(
      '${ARRAYFILTER(arr1, item => item && item >=2)}',
      data
    )
  ).toMatchObject([2, 3]);

  expect(
    await evaluateForAsync('${ARRAYFINDINDEX(arr3, item => item === 2)}', data)
  ).toBe(1);

  expect(
    await evaluateForAsync('${ARRAYFINDINDEX(arr3, item => item !== 1)}', data)
  ).toBe(1);

  expect(
    await evaluateForAsync(
      '${ARRAYFIND(arr5, item => item.name === 1.3)}',
      data
    )
  ).toMatchObject({
    id: 1.1,
    name: 1.3
  });

  expect(
    await evaluateForAsync('${ARRAYFIND(arr5, item => item.id !== 1.1)}', data)
  ).toMatchObject({
    id: 2.2
  });

  expect(
    await evaluateForAsync(
      '${ARRAYSOME(arr5, item => item.name === 1.3)}',
      data
    )
  ).toBe(true);

  expect(
    await evaluateForAsync(
      '${ARRAYEVERY(arr5, item => item.name === 1.3)}',
      data
    )
  ).toBe(false);

  expect(await evaluateForAsync('${ARRAYINCLUDES(arr1, false)}', data)).toBe(
    true
  );

  expect(await evaluateForAsync('${GET(arr1, 2)}', data)).toBe(false);
  expect(await evaluateForAsync('${GET(arr1, 6, "not-found")}', data)).toBe(
    'not-found'
  );
  expect(await evaluateForAsync('${GET(arr5, "[2].name")}', data)).toBe(1.3);
  expect(await evaluateForAsync('${GET(arr5, "2.name")}', data)).toBe(1.3);
  expect(await evaluateForAsync('${GET(obj1, "p2")}', data)).toBe('age');
  expect(await evaluateForAsync('${GET(obj1, "p4.1.p42")}', data)).toBe('amis');
  expect(await evaluateForAsync('${GET(obj1, "p4[1].p42")}', data)).toBe(
    'amis'
  );

  expect(await evaluateForAsync('${ENCODEJSON(obj1)}', data)).toBe(
    JSON.stringify(data.obj1)
  );
  expect(
    await evaluateForAsync('${DECODEJSON("{\\"name\\":\\"amis\\"}")}', data)
  ).toMatchObject(JSON.parse('{"name":"amis"}'));
});

test('evalute:ISTYPE', async () => {
  const data = {
    a: 1,
    b: 'string',
    c: null,
    d: undefined,
    e: [1, 2],
    f: {a: 1, b: 2},
    g: new Date()
  };
  expect(await evaluateForAsync('${ISTYPE(a, "number")}', data)).toBe(true);
  expect(await evaluateForAsync('${ISTYPE(b, "number")}', data)).toBe(false);
  expect(await evaluateForAsync('${ISTYPE(b, "string")}', data)).toBe(true);
  expect(await evaluateForAsync('${ISTYPE(c, "nil")}', data)).toBe(true);
  expect(await evaluateForAsync('${ISTYPE(d, "nil")}', data)).toBe(true);
  expect(await evaluateForAsync('${ISTYPE(e, "array")}', data)).toBe(true);
  expect(await evaluateForAsync('${ISTYPE(f, "array")}', data)).toBe(false);
  expect(await evaluateForAsync('${ISTYPE(f, "plain-object")}', data)).toBe(
    true
  );
  expect(await evaluateForAsync('${ISTYPE(g, "date")}', data)).toBe(true);
});

test('async-evalute:namespace', async () => {
  localStorage.setItem('a', '1');
  localStorage.setItem('b', '2');
  localStorage.setItem('c', '{"a": 1, "b": 2, "c": {"d": 4}}');
  localStorage.setItem('key', 'c');
  localStorage.setItem('spec-var-name', 'you are right');

  expect(await evaluateForAsync('${ls: a}', {})).toBe(1);
  expect(await evaluateForAsync('${ls: b}', {})).toBe(2);
  expect(await evaluateForAsync('${ls: c}', {})).toMatchObject({
    a: 1,
    b: 2,
    c: {d: 4}
  });
  // 被认为是减操作
  expect(await evaluateForAsync('${ls: spec-var-name}', {})).toBe(0);
  expect(await evaluateForAsync('${ls: spec\\-var\\-name}', {})).toBe(
    'you are right'
  );
  expect(await evaluateForAsync('${ls: &["spec-var-name"]}', {})).toBe(
    'you are right'
  );
  expect(await evaluateForAsync('${ls: &["c"]["c"]}', {})).toMatchObject({
    d: 4
  });
  expect(await evaluateForAsync('${ls: &["c"][key]}', {})).toMatchObject({
    d: 4
  });
});
