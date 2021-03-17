import '../../src/utils/tpl.ts';
import {
  resolveVariableAndFilter,
  dataMapping
} from '../../src/utils/tpl-builtin';
import moment from 'moment';

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
    filter: '| raw',
    expectValue: undefined
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
    path: '${value}',
    filter: '| json:0',
    expectValue: '{"a":"a","b":"b"}'
  },
  {
    type: 'toJson',
    data: {
      value: '{"a":"a","b":"b"}'
    },
    path: '${value}',
    filter: '| toJson',
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
    path: '${value}',
    filter: '| date',
    expectValue: moment(1559649981, 'X').format('LLL')
  },
  {
    type: 'number',
    data: {
      value: 9999
    },
    path: '${value}',
    filter: '| number',
    expectValue: '9,999'
  },
  {
    type: 'trim',
    data: {
      value: '  abc '
    },
    path: '${value}',
    filter: '| trim',
    expectValue: 'abc'
  },
  {
    type: 'percent',
    data: {
      value: 0.8232343
    },
    path: '${value}',
    filter: '| percent',
    expectValue: '82%'
  },
  // duration
  {
    type: 'duration1',
    data: {
      value: 1
    },
    path: '${value}',
    filter: '| duration',
    expectValue: '1秒'
  },
  {
    type: 'duration2',
    data: {
      value: 61
    },
    path: '${value}',
    filter: '| duration',
    expectValue: '1分1秒'
  },
  {
    type: 'duration3',
    data: {
      value: 233233
    },
    path: '${value}',
    filter: '| duration',
    expectValue: '2天16时47分13秒'
  },
  // bytes
  {
    type: 'bytes1',
    data: {
      value: 1024
    },
    path: '${value}',
    filter: '| bytes',
    expectValue: '1.02 KB'
  },
  {
    type: 'bytes2',
    data: {
      value: 1024000
    },
    path: '${value}',
    filter: '| bytes',
    expectValue: '1.02 MB'
  },
  {
    type: 'bytes3',
    data: {
      value: -1024
    },
    path: '${value}',
    filter: '| bytes',
    expectValue: '-1.02 KB'
  },
  {
    type: 'bytes4',
    data: {
      value: 0.5
    },
    path: '${value}',
    filter: '| bytes',
    expectValue: '0.5 B'
  },
  // round
  {
    type: 'round1',
    data: {
      value: '啥啊'
    },
    path: '${value}',
    filter: '| round',
    expectValue: 0
  },
  {
    type: 'round2',
    data: {
      value: 1.22
    },
    path: '${value}',
    filter: '| round:1',
    expectValue: '1.2'
  },
  {
    type: 'round3',
    data: {
      value: 1.26
    },
    path: '${value}',
    filter: '| round:1',
    expectValue: '1.3'
  },
  {
    type: 'truncate1',
    data: {
      value: 'this is a very loooooong sentence.'
    },
    path: '${value}',
    filter: '| truncate:10',
    expectValue: 'this is a ...'
  },
  {
    type: 'truncate2',
    data: {
      value: 'this is a very loooooong sentence.'
    },
    path: '${value}',
    filter: '| truncate:null',
    expectValue: 'this is a very loooooong sentence.'
  },
  {
    type: 'url_encode',
    data: {
      value: 'http://www.baidu.com?query=123'
    },
    path: '${value}',
    filter: '| url_encode',
    expectValue: 'http%3A%2F%2Fwww.baidu.com%3Fquery%3D123'
  },
  {
    type: 'url_decode',
    data: {
      value: 'http%3A%2F%2Fwww.baidu.com%3Fquery%3D123'
    },
    path: '${value}',
    filter: '| url_decode:10',
    expectValue: 'http://www.baidu.com?query=123'
  },
  {
    type: 'default1',
    data: {
      value: ''
    },
    path: '${value}',
    filter: '| default',
    expectValue: undefined
  },
  {
    type: 'default2',
    data: {
      value: ''
    },
    path: '${value}',
    filter: '| default:-',
    expectValue: '-'
  },
  {
    type: 'join',
    data: {
      value: ['a', 'b', 'c']
    },
    path: '${value}',
    filter: '| join:,',
    expectValue: 'a,b,c'
  },
  {
    type: 'split',
    data: {
      value: 'a,b,c'
    },
    path: '${value}',
    filter: '| split',
    expectValue: ['a', 'b', 'c']
  },
  {
    type: 'first',
    data: {
      value: ['a', 'b', 'c']
    },
    path: '${value}',
    filter: '| first',
    expectValue: 'a'
  },
  {
    type: 'nth',
    data: {
      value: ['a', 'b', 'c']
    },
    path: '${value}',
    filter: '| nth:1',
    expectValue: 'b'
  },
  {
    type: 'last',
    data: {
      value: ['a', 'b', 'c']
    },
    path: '${value}',
    filter: '| last',
    expectValue: 'c'
  },
  {
    type: 'minus',
    data: {
      value: 5
    },
    path: '${value}',
    filter: '| minus:1',
    expectValue: 4
  },
  {
    type: 'plus',
    data: {
      value: 5
    },
    path: '${value}',
    filter: '| plus:1',
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
    path: '${value}',
    filter: '| pick:a',
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
    path: '${value}',
    filter: '| pick:value',
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
    path: '${value}',
    filter: '| pick_if_exist:$value',
    expectValue: ['a', 'b', 'c']
  },
  {
    type: 'str2date',
    data: {
      value: '1559649981'
    },
    path: '${value}',
    filter: '| str2date:X:YYYY-MM-DD HH-mm-ss',
    expectValue: moment('1559649981', 'X').format('YYYY-MM-DD HH-mm-ss')
  },
  {
    type: 'asArray',
    data: {
      value: 'a'
    },
    path: '${value}',
    filter: '| asArray',
    expectValue: ['a']
  },
  {
    type: 'base64Encode',
    data: {
      value: 'I love amis'
    },
    path: '${value}',
    filter: '| base64Encode',
    expectValue: 'SSBsb3ZlIGFtaXM='
  },
  {
    type: 'base64Decode',
    data: {
      value: 'SSBsb3ZlIGFtaXM='
    },
    path: '${value}',
    filter: '| base64Decode',
    expectValue: 'I love amis'
  },
  {
    type: 'lowerCase',
    data: {
      value: 'AbC'
    },
    path: '${value}',
    filter: '| lowerCase',
    expectValue: 'abc'
  },
  {
    type: 'upperCase',
    data: {
      value: 'aBc'
    },
    path: '${value}',
    filter: '| upperCase',
    expectValue: 'ABC'
  }
];

filters.forEach(f => {
  test(`tpl-builtin:resolveVariableAndFilter:${f.type}`, () => {
    expect(resolveVariableAndFilter(f.path, f.data, f.filter)).toEqual(
      f.expectValue
    );
  });
});

test('tpl-builtin:dataMapping', () => {
  const data = {
    a: 1,
    b: '2',
    c: {
      '1': 'first',
      '2': 'second'
    }
  };

  expect(
    dataMapping(
      {
        '&': '$$'
      },
      data
    )
  ).toEqual({
    a: 1,
    b: '2',
    c: {
      '1': 'first',
      '2': 'second'
    }
  });

  expect(
    dataMapping(
      {
        '&': '${b}'
      },
      data
    )
  ).toEqual('2');

  expect(
    dataMapping(
      {
        '&': (data: any) => ({b: data.b})
      },
      data
    )
  ).toEqual({
    b: '2'
  });

  expect(
    dataMapping(
      {
        all: '$$'
      },
      data
    )
  ).toEqual({
    all: {
      a: 1,
      b: '2',
      c: {
        '1': 'first',
        '2': 'second'
      }
    }
  });

  expect(
    dataMapping(
      {
        a: '${a}',
        b: '__undefined'
      },
      data
    )
  ).toEqual({
    a: 1
  });

  expect(
    dataMapping(
      {
        value: {
          a: '${a}',
          d: 'd'
        }
      },
      data
    )
  ).toEqual({
    value: {
      a: 1,
      d: 'd'
    }
  });

  expect(
    dataMapping(
      {
        value: [
          {
            a: '${a}',
            d: 'd'
          },
          {
            b: '${b}',
            d: 'd'
          }
        ]
      },
      data
    )
  ).toEqual({
    value: [
      {
        a: 1,
        d: 'd'
      },
      {
        b: '2',
        d: 'd'
      }
    ]
  });

  expect(
    dataMapping(
      {
        value: '${a}'
      },
      data
    )
  ).toEqual({
    value: 1
  });

  expect(
    dataMapping(
      {
        value: (data: any) => data.a
      },
      data
    )
  ).toEqual({
    value: 1
  });

  const data2 = {
    rows: [
      {
        label: 'A',
        value: 'a',
        size: 'sm'
      },
      {
        label: 'B',
        value: 'b',
        size: 'md'
      },
      {
        label: 'C',
        value: 'c',
        size: 'sm'
      }
    ]
  };

  expect(
    dataMapping(
      {
        items: {
          $rows: {
            label: '$label',
            value: '$value'
          }
        }
      },
      data2
    )
  ).toEqual({
    items: [
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
  });
});
