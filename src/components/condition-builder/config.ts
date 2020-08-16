import {FieldTypes, OperatorType, Funcs, Fields, Type} from './types';

export interface BaseFieldConfig {
  operations: Array<OperatorType>;
}

export interface Config {
  fields: Fields;
  funcs?: Funcs;
  maxLevel?: number;
  types: {
    [propName: string]: Type;
  };
}

export const OperationMap = {
  equal: '等于',
  not_equal: '不等于',
  is_empty: '为空',
  is_not_empty: '不为空',
  like: 'LIKE',
  not_like: 'NOT LIKE',
  starts_with: 'Start With',
  ends_with: 'Ends With'
};

const defaultConfig: Config = {
  types: {
    text: {
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
    }
  },

  fields: [
    // {
    //   type: 'text',
    //   name: 'test',
    //   label: 'Text'
    // },
    // {
    //   label: 'Group',
    //   children: [
    //   ]
    // }
  ],

  // 函数配置示例
  funcs: [
    // {
    //   label: '文本',
    //   children: [
    //     {
    //       type: 'LOWERCASE',
    //       label: '转小写',
    //       returnType: 'text',
    //       args: [
    //         {
    //           type: 'text',
    //           label: '文本',
    //           valueTypes: ['raw', 'field']
    //         }
    //       ]
    //     }
    //   ]
    // }
  ]
};
export default defaultConfig;
