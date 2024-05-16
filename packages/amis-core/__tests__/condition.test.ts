import moment from 'moment';
import {
  resolveConditionAsync,
  guid,
  registerConditionComputer,
  setConditionComputeErrorHandler
} from '../src/utils/';

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
  range: 1678723200,
  date: '2023-03-19',
  datetime: '2023-03-20T04:55:00+08:00',
  time: '00:05'
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

test(`condition`, async () => {
  expect(await resolveConditionAsync(conditions1, data)).toBe(false);
  expect(await resolveConditionAsync(conditions2, data)).toBe(true);
  expect(await resolveConditionAsync(conditions3, data)).toBe(false);
  expect(await resolveConditionAsync(conditions4, data)).toBe(false);
  expect(await resolveConditionAsync(conditions5, data)).toBe(false);
  expect(await resolveConditionAsync(conditions6, data)).toBe(false);
  expect(await resolveConditionAsync(conditions7, data)).toBe(false);
});

test(`condition date`, async () => {
  const conditions = {
    id: guid(),
    conjunction: 'and',
    children: [
      {
        id: guid(),
        left: {
          type: 'date',
          field: 'date'
        },
        op: 'less',
        right: '2023-03-20'
      },
      {
        id: guid(),
        left: {
          type: 'date',
          field: 'datetime'
        },
        op: 'less',
        right: '2023-03-21T04:55:00+08:00'
      },
      {
        id: guid(),
        left: {
          type: 'date',
          field: 'time'
        },
        op: 'less',
        right: '00:08'
      },
      {
        id: guid(),
        left: {
          type: 'date',
          field: 'date'
        },
        op: 'less_or_equal',
        right: '2023-03-19'
      },
      {
        id: guid(),
        left: {
          type: 'date',
          field: 'datetime'
        },
        op: 'less_or_equal',
        right: '2023-03-20T04:55:00+08:00'
      },
      {
        id: guid(),
        left: {
          type: 'date',
          field: 'time'
        },
        op: 'less_or_equal',
        right: '00:05'
      },
      {
        id: guid(),
        left: {
          type: 'date',
          field: 'date'
        },
        op: 'between',
        right: '${["2023-03-19","2023-03-20"]}'
      },
      {
        id: guid(),
        left: {
          type: 'date',
          field: 'datetime'
        },
        op: 'between',
        right: '${["2023-03-20T04:55:00+08:00","2023-03-21T04:55:00+08:00"]}'
      },
      {
        id: guid(),
        left: {
          type: 'date',
          field: 'time'
        },
        op: 'between',
        right: '${["00:05","00:06"]}'
      }
    ]
  };

  expect(await resolveConditionAsync(conditions, data)).toBe(true);
});

test(`condition tree`, async () => {
  const conditions8 = {
    id: guid(),
    conjunction: 'and',
    children: [
      select_any_in1,
      {
        id: guid(),
        conjunction: 'and',
        children: [
          equal1,
          {
            id: guid(),
            conjunction: 'or',
            children: [between, not_between]
          },
          between,
          {
            id: guid(),
            conjunction: 'and',
            children: [between, select_any_in2, conditions5]
          }
        ]
      }
    ]
  };

  const conditions9 = {
    id: guid(),
    conjunction: 'or',
    children: [
      is_empty1,
      {
        id: guid(),
        conjunction: 'or',
        children: [
          is_empty1,
          conditions6,
          between,
          {
            id: guid(),
            conjunction: 'or',
            children: [is_empty1, select_any_in2, conditions5]
          }
        ]
      }
    ]
  };

  const conditions10 = {
    id: guid(),
    conjunction: 'or',
    children: [
      {
        id: guid(),
        conjunction: 'or',
        children: [
          conditions6,
          is_empty1,
          {
            id: guid(),
            conjunction: 'or',
            children: [
              is_empty1,
              {
                id: guid(),
                conjunction: 'or',
                children: [
                  is_not_empty1,
                  is_not_empty2,
                  is_not_empty3,
                  is_not_empty4
                ]
              }
            ]
          }
        ]
      },
      is_empty1
    ]
  };

  expect(await resolveConditionAsync(conditions8, data)).toBe(false);
  expect(await resolveConditionAsync(conditions9, data)).toBe(true);
  expect(await resolveConditionAsync(conditions10, data)).toBe(true);
});

test(`condition register`, async () => {
  registerConditionComputer(
    'customless',
    (left: any, right?: any, fieldType?: string) => {
      if (fieldType === 'date') {
        return moment(left).isBefore(moment(right), 'day');
      }
      return left < right;
    }
  );

  const conditions = {
    id: guid(),
    conjunction: 'and',
    children: [
      {
        id: guid(),
        left: {
          type: 'date',
          field: 'date'
        },
        op: 'customless',
        right: '2023-03-20'
      },
      {
        id: guid(),
        left: {
          type: 'field',
          field: 'num'
        },
        op: 'customless',
        right: '5'
      }
    ]
  };

  expect(await resolveConditionAsync(conditions, data)).toBe(true);
});

test(`condition conditionComputeHander`, async () => {
  // 无法解析时，自定义解析逻辑
  setConditionComputeErrorHandler(
    (conditions: any, data: any, defaultResult: boolean) => {
      return Promise.resolve(true);
    }
  );

  const conditions = {
    id: guid(),
    conjunction: 'and',
    children: [
      {
        id: guid(),
        left: {
          type: 'date',
          field: 'date'
        },
        op: 'equal',
        right: '2023-03-19'
      },
      {
        id: guid(),
        left: {
          type: 'field',
          field: 'num'
        },
        op: 'equal',
        right: '${AAA(5)}'
      }
    ]
  };

  expect(await resolveConditionAsync(conditions, data)).toBe(true);
});
