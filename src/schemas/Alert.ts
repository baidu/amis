import {BaseSchema, SchemaCollection} from './Schema';

/**
 * Alert 提示渲染器，文档：https://baidu.gitee.io/amis/docs/components/alert
 */
export interface AlertSchema extends BaseSchema {
  /**
   * 指定为提示框类型
   */
  type: 'alert';

  /**
   * 内容区域
   */
  body: SchemaCollection;

  /**
   * 提示类型
   */
  level?: 'info' | 'warning' | 'error' | 'danger';

  /**
   * 是否显示关闭按钮
   */
  showCloseButton?: boolean;
}
