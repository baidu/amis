import {
  FieldTypes,
  OperatorType,
  ConditionBuilderFuncs,
  ConditionBuilderFields,
  ConditionBuilderType
} from './types';

export interface BaseFieldConfig {
  operations: Array<OperatorType>;
}

export interface ConditionBuilderConfig {
  valueTypes?: Array<'value' | 'field' | 'func' | 'formula'>;
  fields?: ConditionBuilderFields;
  funcs?: ConditionBuilderFuncs;
  maxLevel?: number; // 还没实现

  // todo 起码需要支持 formula 组件可以自定义。

  // todo 很多还不能配置。
  types: {
    [propName: string]: ConditionBuilderType;
  };
}

export const OperationMap = {
  equal: 'Condition.equal',
  not_equal: 'Condition.not_equal',
  less: 'Condition.less',
  less_or_equal: 'Condition.less_or_equal',
  greater: 'Condition.greater',
  greater_or_equal: 'Condition.greater_or_equal',
  between: 'Condition.between',
  not_between: 'Condition.not_between',
  is_empty: 'Condition.is_empty',
  is_not_empty: 'Condition.is_not_empty',
  like: 'Condition.like',
  not_like: 'Condition.not_like',
  starts_with: 'Condition.starts_with',
  ends_with: 'Condition.ends_with',
  select_equals: 'Condition.select_equals',
  select_not_equals: 'Condition.select_not_equals',
  select_any_in: 'Condition.select_any_in',
  select_not_any_in: 'Condition.select_not_any_in'
};

const defaultConfig: ConditionBuilderConfig = {
  valueTypes: ['value'],
  types: {
    text: {
      placeholder: 'Condition.placeholder',
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
