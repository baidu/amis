import {Renderer} from '../factory';
import {
  BaseSchema,
  SchemaClassName,
  SchemaCollection
} from '../Schema';
import {SchemaNode} from '../types';
import CollapsePanel from '../components/CollapsePanel';

/**
 * CollapsePanel 折叠渲染器，格式说明。
 * 文档：https://baidu.gitee.io/amis/docs/components/collapse
 */
export interface CollapsePanelSchema extends BaseSchema {
  /**
   * 指定为折叠器类型
   */
  type: 'collapse-panel';

  /**
   * 是否禁用
   */
  disabled?: boolean;

  /**
   * 默认是否折叠
   */
  collapsed?: boolean;

  /**
   * 标识
   */
  key?: string;

  /**
   * 标题
   */
  header?: string | SchemaNode;

  /**
   * 内容区域
   */
  body?: SchemaCollection;

  /**
   * 图标是否展示
   */
  showArrow?: boolean;

  /**
   * 自定义切换图标
   */
  expandIcon?: SchemaNode;

  /**
   * 配置 Body 容器 className
   */
  bodyClassName?: SchemaClassName;

  /**
   * 标题 CSS 类名
   */
  headingClassName?: SchemaClassName;

  /**
   * 点开时才加载内容
   */
  mountOnEnter?: boolean;

  /**
   * 卡片隐藏就销毁内容。
   */
  unmountOnExit?: boolean;

  /**
   * 变更事件
   */
  onChange: (item: CollapsePanelSchema, collapsed: boolean) => void;
}

@Renderer({
  type: 'collapse-panel'
})
export class CollapsePanelRenderer extends CollapsePanel {}
