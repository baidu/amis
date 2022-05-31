import {resolveVariableAndFilter} from '../src/utils/tpl-builtin';
import {evaluate} from 'amis-formula';

test(`filter:map`, () => {
  expect(
    resolveVariableAndFilter('${a | map: toInt}', {
      a: ['123', '3434']
    })
  ).toMatchObject([123, 3434]);
});
test(`filter:html`, () => {
  expect(
    resolveVariableAndFilter('${a}', {
      a: '<html>'
    })
  ).toEqual('&lt;html&gt;');
});

test(`filter:complex`, () => {
  expect(
    resolveVariableAndFilter('${`${a}`}', {
      a: '<html>'
    })
  ).toEqual('<html>');

  expect(
    resolveVariableAndFilter('${a ? a : a}', {
      a: '<html>'
    })
  ).toEqual('<html>');

  expect(
    resolveVariableAndFilter('${b.a}', {
      a: '<html>',
      b: {
        a: '<br />'
      }
    })
  ).toEqual('&lt;br &#x2F;&gt;');
});

test(`filter:json`, () => {
  expect(
    resolveVariableAndFilter('${a | json : 0}', {
      a: {a: 1}
    })
  ).toEqual('{"a":1}');

  expect(
    resolveVariableAndFilter('${a | json : 2}', {
      a: {a: 1}
    })
  ).toEqual('{\n  "a": 1\n}');
});

test(`filter:toJson`, () => {
  expect(
    resolveVariableAndFilter('${a|toJson}', {
      a: '{"a":1}'
    })
  ).toMatchObject({a: 1});
});

test(`filter:toInt`, () => {
  expect(
    resolveVariableAndFilter('${a|toInt}', {
      a: '233'
    })
  ).toBe(233);
});

test(`filter:toFloat`, () => {
  expect(
    resolveVariableAndFilter('${a|toFloat}', {
      a: '233.233'
    })
  ).toBe(233.233);
});

test(`filter:toDate`, () => {
  expect(
    resolveVariableAndFilter('${a|toDate:x|date: YYYY-MM-DD}', {
      a: 1638028267226
    })
  ).toBe('2021-11-27');
});

test(`filter:fromNow`, () => {
  expect(
    resolveVariableAndFilter('${a|toDate:x|fromNow}', {
      a: Date.now() - 2 * 60 * 1000
    })
  ).toBe('2 minutes ago');
});

test(`filter:dateModify`, () => {
  expect(
    resolveVariableAndFilter('${a|toDate:x|dateModify:subtract:2:m|fromNow}', {
      a: Date.now()
    })
  ).toBe('2 minutes ago');
});

test(`filter:number`, () => {
  expect(
    resolveVariableAndFilter('${a|number}', {
      a: 1234
    })
  ).toBe('1,234');
});

test(`filter:trim`, () => {
  expect(
    resolveVariableAndFilter('${a|trim}', {
      a: ' ab '
    })
  ).toBe('ab');
});

test(`filter:duration`, () => {
  expect(
    resolveVariableAndFilter('${a|duration}', {
      a: 234343
    })
  ).toBe('2天17时5分43秒');
});

test(`filter:bytes`, () => {
  expect(
    resolveVariableAndFilter('${a|bytes}', {
      a: 234343
    })
  ).toBe('234 KB');
});
test(`filter:round`, () => {
  expect(
    resolveVariableAndFilter('${a|round}', {
      a: 23.234
    })
  ).toBe('23.23');
});

test(`filter:truncate`, () => {
  expect(
    resolveVariableAndFilter('${a|truncate:5}', {
      a: 'abcdefghijklmnopqrst'
    })
  ).toBe('abcde...');
});

test(`filter:url_encode`, () => {
  expect(
    resolveVariableAndFilter('${a|url_encode}', {
      a: '='
    })
  ).toBe('%3D');
});

test(`filter:url_encode`, () => {
  expect(
    resolveVariableAndFilter('${a|url_decode}', {
      a: '%3D'
    })
  ).toBe('=');
});

test(`filter:url_encode`, () => {
  expect(
    resolveVariableAndFilter('${a|default:-}', {
      a: ''
    })
  ).toBe('-');
});

test(`filter:join`, () => {
  expect(
    resolveVariableAndFilter('${a|join:-}', {
      a: [1, 2, 3]
    })
  ).toBe('1-2-3');
});

test(`filter:split`, () => {
  expect(
    resolveVariableAndFilter('${a|split:-}', {
      a: '1-2-3'
    })
  ).toMatchObject(['1', '2', '3']);
});

test(`filter:sortBy`, () => {
  expect(
    resolveVariableAndFilter('${a|sortBy:&|join}', {
      a: ['b', 'c', 'a']
    })
  ).toBe('a,b,c');

  expect(
    resolveVariableAndFilter('${a|sortBy:&:numerical|join}', {
      a: ['023', '20', '44']
    })
  ).toBe('20,023,44');
});

test(`filter:objectToArray`, () => {
  expect(
    resolveVariableAndFilter('${a|objectToArray}', {
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

test(`filter:substring`, () => {
  expect(
    resolveVariableAndFilter('${a|substring:0:2}', {
      a: 'abcdefg'
    })
  ).toBe('ab');
  expect(
    resolveVariableAndFilter('${a|substring:1:3}', {
      a: 'abcdefg'
    })
  ).toBe('bc');
});

test(`filter:variableInVariable`, () => {
  expect(
    resolveVariableAndFilter('${a}', {
      a: 'abc$0defg'
    })
  ).toBe('abc$0defg');
});

test('filter:isMatch', () => {
  expect(
    resolveVariableAndFilter('${status | isMatch:2:1|isMatch:5:1:4}', {
      status: 2
    })
  ).toBe(1);
});

test('filter:filter:isMatch', () => {
  expect(
    resolveVariableAndFilter('${items|filter:text:match:"ab"}', {
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

test('evalute:conditional', () => {
  expect(
    evaluate(
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
    evaluate(
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
    evaluate(
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
    evaluate(
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
    evaluate(
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
    evaluate(
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
