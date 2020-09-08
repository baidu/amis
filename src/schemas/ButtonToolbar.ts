import {BaseSchema} from './Schema';
import {ActionSchema} from './Action';

/**
 * Button Toolar 渲染器，文档：https://baidu.gitee.io/amis/docs/components/button-toolbar
 */
export interface ButtonToolbarSchema extends BaseSchema {
  /**
   * 指定为按钮工具集合类型
   */
  type: 'button-toolbar';

  buttons: Array<ActionSchema>;
}
