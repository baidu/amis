import {FieldTypes, OperatorType, Funcs} from './types';

export interface BaseFieldConfig {
  operations: Array<OperatorType>;
}

export interface Config {
  funcs?: Funcs;
  maxLevel?: number;
}

const defaultConfig: Config = {
  // fields: [],

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
