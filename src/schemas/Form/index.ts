import {ActionSchema} from '../Action';
import {SchemaDefaultData, SchemaApi} from '../Schema';

// todo
export type FormControlSchema = any;

/**
 * amis Form 渲染器，格式说明。https://baidu.gitee.io/amis/docs/components/form/index
 */
export interface FormSchema {
  type: 'form';
  title?: string;

  actions?: Array<ActionSchema>;
  controls?: Array<FormControlSchema>;

  data?: SchemaDefaultData;

  debug?: boolean;

  /**
   * Form 用来保存数据的 api。
   */
  api?: SchemaApi;

  /**
   * 用来初始化表单数据
   */
  initApi?: SchemaApi;
}
