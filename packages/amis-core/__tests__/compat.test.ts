import moment from 'moment';
import {
  resolveVariable,
  resolveVariableAndFilter
} from '../src/utils/tpl-builtin';

const filters = [
  {
    type: 'raw1',
    data: {
      value: 1
    },
    path: '${value}',
    filter: '| raw',
    expectValue: 1
  },
  {
    type: 'raw2',
    data: {
      value: '2'
    },
    path: '${value}',
    filter: '| raw',
    expectValue: '2'
  },
  {
    type: 'raw3',
    data: {
      a: 1,
      b: '2',
      c: {
        '1': 'first',
        '2': 'second'
      }
    },
    path: '${c.${a}}',
    filter: '| raw',
    expectValue: 'first'
  },
  {
    type: 'raw4',
    data: {
      a: 1,
      b: '2',
      c: {
        '1': 'first',
        '2': 'second'
      }
    },
    path: '${c.${b}}',
    filter: '| raw',
    expectValue: 'second'
  },
  {
    type: 'raw5',
    data: {
      a: 1
    },
    path: '',
    filter: '| raw',
    expectValue: undefined
  },
  {
    type: 'raw6',
    data: {
      a: 1
    },
    path: '$$',
    filter: 'raw',
    expectValue: {a: 1}
  },
  {
    type: 'raw7',
    data: {
      a: 1
    },
    path: '$a',
    filter: '| raw',
    expectValue: 1
  },
  {
    type: 'json',
    data: {
      value: {
        a: 'a',
        b: 'b'
      }
    },
    path: '${value | json:0}',
    filter: '',
    expectValue: '{"a":"a","b":"b"}'
  },
  {
    type: 'toJson',
    data: {
      value: '{"a":"a","b":"b"}'
    },
    path: '${value | toJson}',
    filter: '',
    expectValue: {
      a: 'a',
      b: 'b'
    }
  },
  {
    type: 'date',
    data: {
      value: 1559649981
    },
    path: '${value | date}',
    filter: '',
    expectValue: moment(1559649981, 'X').format('LLL')
  },
  {
    type: 'number',
    data: {
      value: 9999
    },
    path: '${value| number}',
    filter: '',
    expectValue: '9,999'
  },
  {
    type: 'trim',
    data: {
      value: '  abc '
    },
    path: '${value| trim}',
    filter: '',
    expectValue: 'abc'
  },
  {
    type: 'percent',
    data: {
      value: 0.8232343
    },
    path: '${value| percent}',
    filter: '',
    expectValue: '82%'
  },
  // duration
  {
    type: 'duration1',
    data: {
      value: 1
    },
    path: '${value| duration}',
    filter: '',
    expectValue: '1秒'
  },
  {
    type: 'duration2',
    data: {
      value: 61
    },
    path: '${value| duration}',
    filter: '',
    expectValue: '1分1秒'
  },
  {
    type: 'duration3',
    data: {
      value: 233233
    },
    path: '${value| duration}',
    filter: '',
    expectValue: '2天16时47分13秒'
  },
  // bytes
  {
    type: 'bytes1',
    data: {
      value: 1024
    },
    path: '${value| bytes}',
    filter: '',
    expectValue: '1.02 KB'
  },
  {
    type: 'bytes2',
    data: {
      value: 1024000
    },
    path: '${value| bytes}',
    filter: '',
    expectValue: '1.02 MB'
  },
  {
    type: 'bytes3',
    data: {
      value: -1024
    },
    path: '${value| bytes}',
    filter: '',
    expectValue: '-1.02 KB'
  },
  {
    type: 'bytes4',
    data: {
      value: 0.5
    },
    path: '${value| bytes}',
    filter: '',
    expectValue: '0.5 B'
  },
  // round
  {
    type: 'round1',
    data: {
      value: '啥啊'
    },
    path: '${value| round}',
    filter: '',
    expectValue: 0
  },
  {
    type: 'round2',
    data: {
      value: 1.22
    },
    path: '${value| round:1}',
    filter: '',
    expectValue: '1.2'
  },
  {
    type: 'round3',
    data: {
      value: 1.26
    },
    path: '${value| round:1}',
    filter: '',
    expectValue: '1.3'
  },
  {
    type: 'truncate1',
    data: {
      value: 'this is a very loooooong sentence.'
    },
    path: '${value| truncate:10}',
    filter: '',
    expectValue: 'this is a ...'
  },
  {
    type: 'truncate2',
    data: {
      value: 'this is a very loooooong sentence.'
    },
    path: '${value| truncate:null}',
    filter: '',
    expectValue: 'this is a very loooooong sentence.'
  },
  {
    type: 'url_encode',
    data: {
      value: 'http://www.baidu.com?query=123'
    },
    path: '${value| url_encode}',
    filter: '',
    expectValue: 'http%3A%2F%2Fwww.baidu.com%3Fquery%3D123'
  },
  {
    type: 'url_decode',
    data: {
      value: 'http%3A%2F%2Fwww.baidu.com%3Fquery%3D123'
    },
    path: '${value| url_decode:10}',
    filter: '',
    expectValue: 'http://www.baidu.com?query=123'
  },
  {
    type: 'default1',
    data: {
      value: ''
    },
    path: '${value| default}',
    filter: '',
    expectValue: undefined
  },
  {
    type: 'default2',
    data: {
      value: ''
    },
    path: '${value| default:-}',
    filter: '',
    expectValue: '-'
  },
  {
    type: 'join',
    data: {
      value: ['a', 'b', 'c']
    },
    path: '${value| join:,}',
    filter: '',
    expectValue: 'a,b,c'
  },
  {
    type: 'split',
    data: {
      value: 'a,b,c'
    },
    path: '${value| split}',
    filter: '',
    expectValue: ['a', 'b', 'c']
  },
  {
    type: 'first',
    data: {
      value: ['a', 'b', 'c']
    },
    path: '${value| first}',
    filter: '',
    expectValue: 'a'
  },
  {
    type: 'nth',
    data: {
      value: ['a', 'b', 'c']
    },
    path: '${value| nth:1}',
    filter: '',
    expectValue: 'b'
  },
  {
    type: 'last',
    data: {
      value: ['a', 'b', 'c']
    },
    path: '${value| last}',
    filter: '',
    expectValue: 'c'
  },
  {
    type: 'minus',
    data: {
      value: 5
    },
    path: '${value| minus:1}',
    filter: '',
    expectValue: 4
  },
  {
    type: 'plus',
    data: {
      value: 5
    },
    path: '${value| plus:1}',
    filter: '',
    expectValue: 6
  },
  {
    type: 'pick1',
    data: {
      value: {
        a: '1',
        b: '2'
      }
    },
    path: '${value| pick:a}',
    filter: '',
    expectValue: '1'
  },
  {
    type: 'pick2',
    data: {
      value: [
        {
          label: 'A',
          value: 'a'
        },
        {
          label: 'B',
          value: 'b'
        },
        {
          label: 'C',
          value: 'c'
        }
      ]
    },
    path: '${value| pick:value}',
    filter: '',
    expectValue: ['a', 'b', 'c']
  },
  {
    type: 'pick_if_exist',
    data: {
      value: [
        {
          label: 'A',
          value: 'a'
        },
        {
          label: 'B',
          value: 'b'
        },
        {
          label: 'C',
          value: 'c'
        }
      ]
    },
    path: '${value| pick_if_exist:value}',
    filter: '',
    expectValue: ['a', 'b', 'c']
  },
  {
    type: 'str2date',
    data: {
      value: '1559649981'
    },
    path: '${value| str2date:X:YYYY-MM-DD HH-mm-ss}',
    filter: '',
    expectValue: moment('1559649981', 'X').format('YYYY-MM-DD HH-mm-ss')
  },
  {
    type: 'asArray',
    data: {
      value: 'a'
    },
    path: '${value| asArray}',
    filter: '',
    expectValue: ['a']
  },
  {
    type: 'base64Encode',
    data: {
      value: 'I love amis'
    },
    path: '${value| base64Encode}',
    filter: '',
    expectValue: 'SSBsb3ZlIGFtaXM='
  },
  {
    type: 'base64Decode',
    data: {
      value: 'SSBsb3ZlIGFtaXM='
    },
    path: '${value| base64Decode}',
    filter: '',
    expectValue: 'I love amis'
  },
  {
    type: 'lowerCase',
    data: {
      value: 'AbC'
    },
    path: '${value| lowerCase}',
    filter: '',
    expectValue: 'abc'
  },
  {
    type: 'upperCase',
    data: {
      value: 'aBc'
    },
    path: '${value| upperCase}',
    filter: '',
    expectValue: 'ABC'
  }
];

filters.forEach(f => {
  test(`compat:${f.type}`, () => {
    const result = resolveVariableAndFilter(f.path, f.data, f.filter);
    expect(result).toEqual(f.expectValue);
  });
});

test(`compat:filter`, () => {
  expect(
    resolveVariableAndFilter(
      '${rows | filter:engine:match:keywords}',
      {
        rows: [
          {
            engine: 'a'
          },
          {
            engine: 'b'
          },
          {
            engine: 'c'
          }
        ]
      },
      '| raw'
    )
  ).toMatchObject([
    {
      engine: 'a'
    },
    {
      engine: 'b'
    },
    {
      engine: 'c'
    }
  ]);

  expect(
    resolveVariableAndFilter(
      '${rows | filter:engine:match:keywords}',
      {
        keywords: 'a',
        rows: [
          {
            engine: 'a'
          },
          {
            engine: 'b'
          },
          {
            engine: 'c'
          }
        ]
      },
      '| raw'
    )
  ).toMatchObject([
    {
      engine: 'a'
    }
  ]);
});

test(`compat:&`, () => {
  expect(
    resolveVariableAndFilter(
      '${& | json:0}',
      {
        a: 1,
        b: 2
      },
      '| raw'
    )
  ).toBe('{"a":1,"b":2}');
});

test(`compat:filter-default`, () => {
  expect(
    resolveVariableAndFilter(
      '${a | default:undefined}',
      {
        a: 1
      },
      '| raw'
    )
  ).toBe(1);

  expect(
    resolveVariableAndFilter(
      '${a | default:undefined}',
      {
        a: [1, 2, 3]
      },
      '| raw'
    )
  ).toMatchObject([1, 2, 3]);

  expect(
    resolveVariableAndFilter(
      '${b | default:undefined}',
      {
        a: 1
      },
      '| raw'
    )
  ).toBe(undefined);
  expect(
    resolveVariableAndFilter(
      '${b | default:-}',
      {
        a: 1
      },
      '| raw'
    )
  ).toBe('-');

  expect(
    resolveVariableAndFilter(
      '${b | default:undefined}',
      {
        a: 1
      },
      '| raw',
      () => ''
    )
  ).toBe(undefined);
  expect(
    resolveVariableAndFilter(
      '${b}',
      {
        a: 1
      },
      '| raw',
      () => ''
    )
  ).toBe('');
});

test(`compat:numberVariable`, () => {
  expect(
    resolveVariableAndFilter(
      'a $1 ',
      {
        '1': 233
      },
      '| raw'
    )
  ).toEqual('a 233 ');

  expect(
    resolveVariableAndFilter(
      'a $1',
      {
        '1': 233
      },
      '| raw'
    )
  ).toEqual('a 233');
});

test(`compat:test`, () => {
  const result = resolveVariableAndFilter('', {}, '| raw');
  expect(result).toEqual(undefined);
});

test(`compat:test2`, () => {
  const data = {
    '123': 123,
    '123.123': 123,
    '中文': 123,
    'obj': {
      x: 123
    }
  };
  expect(resolveVariable('123', data)).toEqual(123);
  expect(resolveVariable('123.123', data)).toEqual(123);
  expect(resolveVariable('中文', data)).toEqual(123);
  expect(resolveVariable('obj.x', data)).toEqual(123);
});
