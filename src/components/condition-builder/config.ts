import {FieldTypes, OperatorType, Funcs, Fields, Type} from './types';

export interface BaseFieldConfig {
  operations: Array<OperatorType>;
}

export interface Config {
  valueTypes?: Array<'value' | 'field' | 'func' | 'raw'>;
  fields?: Fields;
  funcs?: Funcs;
  maxLevel?: number; // 还没实现
  types: {
    [propName: string]: Type;
  };
}

export const OperationMap = {
  equal: '等于',
  not_equal: '不等于',
  less: '小于',
  less_or_equal: '小于或等于',
  greater: '大于',
  greater_or_equal: '大于或等于',
  between: '属于范围',
  not_between: '不属于范围',
  is_empty: '为空',
  is_not_empty: '不为空',
  like: '模糊匹配',
  not_like: '不匹配',
  starts_with: '匹配开头',
  ends_with: '匹配结尾',
  select_equals: '等于',
  select_not_equals: '不等于',
  select_any_in: '包含',
  select_not_any_in: '不包含'
};

const defaultConfig: Config = {
  valueTypes: ['value'],
  types: {
    text: {
      placeholder: '请输入文本',
      defaultOp: 'equal',
      operators: [
        'equal',
        'not_equal',
        'is_empty',
        'is_not_empty',
        'like',
        'not_like',
        'starts_with',
        'ends_with'
      ]
    },
    number: {
      operators: [
        'equal',
        'not_equal',
        'less',
        'less_or_equal',
        'greater',
        'greater_or_equal',
        'between',
        'not_between',
        'is_empty',
        'is_not_empty'
      ]
    },
    date: {
      operators: [
        'equal',
        'not_equal',
        'less',
        'less_or_equal',
        'greater',
        'greater_or_equal',
        'between',
        'not_between',
        'is_empty',
        'is_not_empty'
      ]
    },

    time: {
      operators: [
        'equal',
        'not_equal',
        'less',
        'less_or_equal',
        'greater',
        'greater_or_equal',
        'between',
        'not_between',
        'is_empty',
        'is_not_empty'
      ]
    },

    datetime: {
      operators: [
        'equal',
        'not_equal',
        'less',
        'less_or_equal',
        'greater',
        'greater_or_equal',
        'between',
        'not_between',
        'is_empty',
        'is_not_empty'
      ]
    },

    select: {
      operators: [
        'select_equals',
        'select_not_equals',
        'select_any_in',
        'select_not_any_in'
      ],
      valueTypes: ['value']
    },

    boolean: {
      operators: ['equal', 'not_equal']
    }
  }
};
export default defaultConfig;
