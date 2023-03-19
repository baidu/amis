import {
  ConditionResolver,
  guid,
  IPlugin,
  registerOpPlugin
} from '../src/utils/';

test(`condition`, async () => {
  const data = {
    name: 'amis',
    feature: 'flexible',
    features: ['flexible', 'powerful'],
    tool: 'amis-editor',
    platform: 'aisuda',
    version: '2.9.0',
    num: 1,
    num2: 0,
    num3: undefined,
    str: '',
    obj: {},
    arr: [],
    bool: true,
    detail: {
      version: '2.8.0',
      github: 'https://github.com/baidu/amis'
    },
    range: [1678723200, 1678895999]
  };

  const equal1 = {
    id: guid(),
    left: {
      type: 'field',
      field: 'name'
    },
    op: 'equal',
    right: '${name}'
  };
  const equal2 = {
    id: guid(),
    left: {
      type: 'field',
      field: 'detail'
    },
    op: 'equal',
    right: '${detail}'
  };
  const equal3 = {
    id: guid(),
    left: {
      type: 'field',
      field: 'bool'
    },
    op: 'equal',
    right: '${!num2}'
  };
  const not_equal = {
    id: guid(),
    left: {
      type: 'field',
      field: 'version'
    },
    op: 'not_equal',
    right: '${version}'
  };
  const greater = {
    id: guid(),
    left: {
      type: 'field',
      field: 'num'
    },
    op: 'greater',
    right: '${num + 0.5}'
  };
  const less = {
    id: guid(),
    left: {
      type: 'field',
      field: 'num'
    },
    op: 'less',
    right: '${num - 0.5}'
  };
  const greater_or_equal = {
    id: guid(),
    left: {
      type: 'field',
      field: 'num'
    },
    op: 'greater_or_equal',
    right: '${num}'
  };
  const less_or_equal = {
    id: guid(),
    left: {
      type: 'field',
      field: 'num'
    },
    op: 'less_or_equal',
    right: '${num}'
  };
  const starts_with = {
    id: guid(),
    left: {
      type: 'field',
      field: 'tool'
    },
    op: 'starts_with',
    right: 'amis-'
  };
  const ends_with = {
    id: guid(),
    left: {
      type: 'field',
      field: 'tool'
    },
    op: 'ends_with',
    right: '-editor'
  };
  const like = {
    id: guid(),
    left: {
      type: 'field',
      field: 'tool'
    },
    op: 'like',
    right: '${tool}-core'
  };
  const not_like = {
    id: guid(),
    left: {
      type: 'field',
      field: 'tool'
    },
    op: 'not_like',
    right: '${tool}r'
  };
  const is_empty1 = {
    id: guid(),
    left: {
      type: 'field',
      field: 'num2'
    },
    op: 'is_empty'
  };
  const is_empty2 = {
    id: guid(),
    left: {
      type: 'field',
      field: 'str'
    },
    op: 'is_empty'
  };
  const is_empty3 = {
    id: guid(),
    left: {
      type: 'field',
      field: 'obj'
    },
    op: 'is_empty'
  };
  const is_not_empty1 = {
    id: guid(),
    left: {
      type: 'field',
      field: 'num3'
    },
    op: 'is_not_empty'
  };
  const is_not_empty2 = {
    id: guid(),
    left: {
      type: 'field',
      field: 'name'
    },
    op: 'is_not_empty'
  };
  const is_not_empty3 = {
    id: guid(),
    left: {
      type: 'field',
      field: 'detail'
    },
    op: 'is_not_empty'
  };
  const is_not_empty4 = {
    id: guid(),
    left: {
      type: 'field',
      field: 'arr'
    },
    op: 'is_not_empty'
  };
  const between = {
    id: guid(),
    left: {
      type: 'field',
      field: 'num'
    },
    op: 'between',
    right: '${[0.5,1]}'
  };
  const not_between = {
    id: guid(),
    left: {
      type: 'field',
      field: 'range'
    },
    op: 'not_between',
    right: '${[1678636800,1678895999]}'
  };
  const select_any_in1 = {
    id: guid(),
    left: {
      type: 'field',
      field: 'features'
    },
    op: 'select_any_in',
    right: '${[LAST(features)]}'
  };
  const select_any_in2 = {
    id: guid(),
    left: {
      type: 'field',
      field: 'feature'
    },
    op: 'select_any_in',
    right: '${features}'
  };
  const select_not_any_in = {
    id: guid(),
    left: {
      type: 'field',
      field: 'features'
    },
    op: 'select_not_any_in',
    right: "${['powerful']}"
  };

  const conditions1 = {
    id: guid(),
    conjunction: 'and',
    children: [equal1, equal2, equal3, not_equal]
  };

  const conditions2 = {
    id: guid(),
    conjunction: 'or',
    children: [greater, less, greater_or_equal, less_or_equal]
  };

  const conditions3 = {
    id: guid(),
    conjunction: 'and',
    children: [starts_with, ends_with, like, not_like]
  };

  const conditions4 = {
    id: guid(),
    conjunction: 'and',
    children: [is_empty1, is_empty2, is_empty3]
  };

  const conditions5 = {
    id: guid(),
    conjunction: 'and',
    children: [is_not_empty1, is_not_empty2, is_not_empty3, is_not_empty4]
  };

  const conditions6 = {
    id: guid(),
    conjunction: 'and',
    children: [between, not_between]
  };

  const conditions7 = {
    id: guid(),
    conjunction: 'and',
    children: [select_any_in1, select_any_in2, select_not_any_in]
  };

  const conditions8 = {
    id: guid(),
    conjunction: 'and',
    children: [
      select_any_in1,
      {
        id: guid(),
        conjunction: 'or',
        children: [
          equal1,
          conditions6,
          between,
          {
            id: guid(),
            conjunction: 'and',
            children: [is_empty1, select_any_in2, conditions5]
          }
        ]
      }
    ]
  };

  class TestPlugin implements IPlugin {
    compute(left: any, right?: any) {
      return left * 2 > right;
    }
  }
  registerOpPlugin('abc', new TestPlugin());

  class TestPlugin2 implements IPlugin {
    compute(left: any, right?: any) {
      return left * 4 < right;
    }
  }
  const cr = ConditionResolver.create({
    plugins: [
      {
        op: 'bcd',
        factory: new TestPlugin2()
      }
    ]
  });

  const conditions9 = {
    id: guid(),
    conjunction: 'and',
    children: [
      {
        id: guid(),
        left: {
          type: 'field',
          field: 'num'
        },
        op: 'abc',
        right: '1'
      },
      {
        id: guid(),
        left: {
          type: 'field',
          field: 'num'
        },
        op: 'bcd',
        right: '5'
      }
    ]
  };

  expect(await cr.resolve(conditions1, data)).toBe(false);
  expect(await cr.resolve(conditions2, data)).toBe(true);
  expect(await cr.resolve(conditions3, data)).toBe(false);
  expect(await cr.resolve(conditions4, data)).toBe(false);
  expect(await cr.resolve(conditions5, data)).toBe(false);
  expect(await cr.resolve(conditions6, data)).toBe(false);
  expect(await cr.resolve(conditions7, data)).toBe(false);
  expect(await cr.resolve(conditions8, data)).toBe(true);
  expect(await cr.resolve(conditions9, data)).toBe(true);
});
