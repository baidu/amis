import {resolveVariableAndFilterForAsync} from '../src/utils/tpl-builtin';
import {evaluateForAsync} from 'amis-formula';

test(`filter:map`, async () => {
  expect(
    await resolveVariableAndFilterForAsync('${a | map: toInt}', {
      a: ['123', '3434']
    })
  ).toMatchObject([123, 3434]);
});
test(`filter:html`, async () => {
  expect(
    await resolveVariableAndFilterForAsync('${a}', {
      a: '<html>'
    })
  ).toEqual('&lt;html&gt;');
});

test(`filter:complex`, async () => {
  expect(
    await resolveVariableAndFilterForAsync('${`${a}`}', {
      a: '<html>'
    })
  ).toEqual('<html>');

  expect(
    await resolveVariableAndFilterForAsync('${a ? a : a}', {
      a: '<html>'
    })
  ).toEqual('<html>');

  expect(
    await resolveVariableAndFilterForAsync('${b.a}', {
      a: '<html>',
      b: {
        a: '<br />'
      }
    })
  ).toEqual('&lt;br &#x2F;&gt;');
});

test(`filter:json`, async () => {
  expect(
    await resolveVariableAndFilterForAsync('${a | json : 0}', {
      a: {a: 1}
    })
  ).toEqual('{"a":1}');

  expect(
    await resolveVariableAndFilterForAsync('${a | json : 2}', {
      a: {a: 1}
    })
  ).toEqual('{\n  "a": 1\n}');
});

test(`filter:toJson`, async () => {
  expect(
    await resolveVariableAndFilterForAsync('${a|toJson}', {
      a: '{"a":1}'
    })
  ).toMatchObject({a: 1});
});

test(`filter:toInt`, async () => {
  expect(
    await resolveVariableAndFilterForAsync('${a|toInt}', {
      a: '233'
    })
  ).toBe(233);
});

test(`filter:toFloat`, async () => {
  expect(
    await resolveVariableAndFilterForAsync('${a|toFloat}', {
      a: '233.233'
    })
  ).toBe(233.233);
});

test(`filter:toDate`, async () => {
  expect(
    await resolveVariableAndFilterForAsync('${a|toDate:x|date: YYYY-MM-DD}', {
      a: 1638028267226
    })
  ).toBe('2021-11-27');
});

test(`filter:fromNow`, async () => {
  expect(
    await resolveVariableAndFilterForAsync('${a|toDate:x|fromNow}', {
      a: Date.now() - 2 * 60 * 1000
    })
  ).toBe('2 minutes ago');
});

test(`filter:dateModify`, async () => {
  expect(
    await resolveVariableAndFilterForAsync(
      '${a|toDate:x|dateModify:subtract:2:m|fromNow}',
      {
        a: Date.now()
      }
    )
  ).toBe('2 minutes ago');
});

test(`filter:number`, async () => {
  expect(
    await resolveVariableAndFilterForAsync('${a|number}', {
      a: 1234
    })
  ).toBe('1,234');
});

test(`filter:trim`, async () => {
  expect(
    await resolveVariableAndFilterForAsync('${a|trim}', {
      a: ' ab '
    })
  ).toBe('ab');
});

test(`filter:duration`, async () => {
  expect(
    await resolveVariableAndFilterForAsync('${a|duration}', {
      a: 234343
    })
  ).toBe('2天17时5分43秒');
});

test(`filter:bytes`, async () => {
  expect(
    await resolveVariableAndFilterForAsync('${a|bytes}', {
      a: 234343
    })
  ).toBe('234 KB');
});

test(`filter:bytes:step`, async () => {
  expect(
    await resolveVariableAndFilterForAsync('${a|bytes:1024}', {
      a: 234343
    })
  ).toBe('229 KB');
});

test(`filter:round`, async () => {
  expect(
    await resolveVariableAndFilterForAsync('${a|round}', {
      a: 23.234
    })
  ).toBe('23.23');
});

test(`filter:truncate`, async () => {
  expect(
    await resolveVariableAndFilterForAsync('${a|truncate:5}', {
      a: 'abcdefghijklmnopqrst'
    })
  ).toBe('abcde...');
});

test(`filter:url_encode`, async () => {
  expect(
    await resolveVariableAndFilterForAsync('${a|url_encode}', {
      a: '='
    })
  ).toBe('%3D');
});

describe('filter:url_decode', () => {
  test(`filter:url_decode:normal`, async () => {
    expect(
      await resolveVariableAndFilterForAsync('${a|url_decode}', {
        a: '%3D'
      })
    ).toBe('=');
  });

  test(`filter:url_decode:error`, async () => {
    expect(
      await resolveVariableAndFilterForAsync('${a|url_decode}', {
        a: '%'
      })
    ).toBe(undefined);
  });
});

test(`filter:default`, async () => {
  expect(
    await resolveVariableAndFilterForAsync('${a|default:-}', {
      a: ''
    })
  ).toBe('-');
});

test(`filter:join`, async () => {
  expect(
    await resolveVariableAndFilterForAsync('${a|join:-}', {
      a: [1, 2, 3]
    })
  ).toBe('1-2-3');
});

test(`filter:split`, async () => {
  expect(
    await resolveVariableAndFilterForAsync('${a|split:-}', {
      a: '1-2-3'
    })
  ).toMatchObject(['1', '2', '3']);
});

test(`filter:sortBy`, async () => {
  expect(
    await resolveVariableAndFilterForAsync('${a|sortBy:&|join}', {
      a: ['b', 'c', 'a']
    })
  ).toBe('a,b,c');

  expect(
    await resolveVariableAndFilterForAsync('${a|sortBy:&:numerical|join}', {
      a: ['023', '20', '44']
    })
  ).toBe('20,023,44');
});

test(`filter:objectToArray`, async () => {
  expect(
    await resolveVariableAndFilterForAsync('${a|objectToArray}', {
      a: {
        a: 1,
        b: 2,
        done: 'Done'
      }
    })
  ).toMatchObject([
    {
      value: 'a',
      label: 1
    },
    {
      value: 'b',
      label: 2
    },
    {
      value: 'done',
      label: 'Done'
    }
  ]);
});

test(`filter:substring`, async () => {
  expect(
    await resolveVariableAndFilterForAsync('${a|substring:0:2}', {
      a: 'abcdefg'
    })
  ).toBe('ab');
  expect(
    await resolveVariableAndFilterForAsync('${a|substring:1:3}', {
      a: 'abcdefg'
    })
  ).toBe('bc');
});

test(`filter:variableInVariable`, async () => {
  expect(
    await resolveVariableAndFilterForAsync('${a}', {
      a: 'abc$0defg'
    })
  ).toBe('abc$0defg');
});

test('filter:isMatch', async () => {
  expect(
    await resolveVariableAndFilterForAsync(
      '${status | isMatch:2:1|isMatch:5:1:4}',
      {
        status: 2
      }
    )
  ).toBe(1);

  expect(
    await resolveVariableAndFilterForAsync(
      '${status | isMatch:2:1|isMatch:5:1:4}',
      {
        status: 1
      }
    )
  ).toBe(4);
});

test('filter:filter:isMatch', async () => {
  expect(
    await resolveVariableAndFilterForAsync('${items|filter:text:match:"ab"}', {
      items: [
        {
          text: 'abc'
        },
        {
          text: 'bcd'
        },
        {
          text: 'cde'
        }
      ]
    })
  ).toMatchObject([
    {
      text: 'abc'
    }
  ]);
});

test('evalute:conditional', async () => {
  expect(
    await evaluateForAsync(
      '${a | isTrue: true : false}',
      {
        a: 4
      },
      {
        defaultFilter: 'raw'
      }
    )
  ).toBe(true);

  expect(
    await evaluateForAsync(
      '${a | isTrue: b : false}',
      {
        a: 4,
        b: 5
      },
      {
        defaultFilter: 'raw'
      }
    )
  ).toBe(5);

  expect(
    await evaluateForAsync(
      '${a | isTrue: b : false}',
      {
        a: null,
        b: 5
      },
      {
        defaultFilter: 'raw'
      }
    )
  ).toBe(false);

  expect(
    await evaluateForAsync(
      '${a | isTrue : trueValue : falseValue}',
      {
        a: true,
        trueValue: 5,
        falseValue: 10
      },
      {
        defaultFilter: 'raw'
      }
    )
  ).toBe(5);

  expect(
    await evaluateForAsync(
      '${a | isEquals: 1 : "1" |isEquals: 2 : "2" | isEquals: 3 : "3" }',
      {
        a: 3
      },
      {
        defaultFilter: 'raw'
      }
    )
  ).toBe('3');

  expect(
    await evaluateForAsync(
      '${a | isEquals: 1 : "1" |isEquals: 1 : "2" | isEquals: 1 : "3" }',
      {
        a: 1
      },
      {
        defaultFilter: 'raw'
      }
    )
  ).toBe('1');

  expect(
    await evaluateForAsync(
      '${a | isEquals: 1 : "1" : "12" |isEquals: 2 : "2" | isEquals: 3 : "3" }',
      {
        a: 2
      },
      {
        defaultFilter: 'raw'
      }
    )
  ).toBe('12');
});
