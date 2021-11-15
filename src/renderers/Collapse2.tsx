import {Renderer} from '../factory';
import {BaseSchema, SchemaCollection} from '../Schema';
import {SchemaNode} from '../types';
import Collapse2 from '../components/collapse2';

/**
 * Collapse2 折叠渲染器，格式说明。
 * 文档：https://baidu.gitee.io/amis/docs/components/collapse
 */
export interface Collapse2Schema extends BaseSchema {
  /**
   * 指定为折叠器类型
   */
  type: 'collapse2';

  /**
   * 激活面板
   */
  activeKey?: Array<string | number | never> | string | number;

  /**
   * 初始化展开
   */
  defaultActiveKey?: Array<string | number | never> | string | number;

  /**
   * 手风琴模式
   */
  accordion?: boolean;

  /**
   * 自定义切换图标
   */
  expandIcon?: SchemaNode;

  /**
   * 设置图标位置
   */
  expandIconPosition?: 'left' | 'right';

  /**
   * 内容区域
   */
  body?: SchemaCollection;
}


@Renderer({
  type: 'collapse2'
})
export class Collapse2Renderer extends Collapse2 {}
