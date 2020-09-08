import {
  BaseSchema,
  SchemaClassName,
  SchemaTpl,
  TokenizeableString,
  SchemaCollection,
  SchemaExpression
} from './Schema';
import {CardSchema} from './Card';

/**
 * Card 渲染器，格式说明，文档：https://baidu.gitee.io/amis/docs/components/card
 */
export interface CardsSchema extends BaseSchema {
  /**
   * 指定为 cards 类型
   */
  type: 'cards';

  card: CardSchema;

  /**
   * 头部 CSS 类名
   */
  headerClassName?: SchemaClassName;

  /**
   * 底部 CSS 类名
   */
  footerClassName?: SchemaClassName;

  /**
   * 卡片 CSS 类名
   *
   * @default Grid-col--sm6 Grid-col--md4 Grid-col--lg3
   */
  itemClassName?: SchemaClassName;

  /**
   * 无数据提示
   *
   * @default 暂无数据
   */
  placeholder?: SchemaTpl;

  /**
   * 是否显示底部
   */
  showFooter?: boolean;

  /**
   * 是否显示头部
   */
  showHeader?: boolean;

  /**
   * 数据源: 绑定当前环境变量
   *
   * @default ${items}
   */
  source?: TokenizeableString;

  /**
   * 标题
   */
  title?: SchemaTpl;

  /**
   * 是否隐藏勾选框
   */
  hideCheckToggler?: boolean;

  /**
   * 是否固顶
   */
  affixHeader?: boolean;

  /**
   * 顶部区域
   */
  header?: SchemaCollection;

  /**
   * 底部区域
   */
  footer?: SchemaCollection;

  /**
   * 配置某项是否可以点选
   */
  itemCheckableOn?: SchemaExpression;

  /**
   * 配置某项是否可拖拽排序，前提是要开启拖拽功能
   */
  itemDraggableOn?: SchemaExpression;

  /**
   * 点击卡片的时候是否勾选卡片。
   */
  checkOnItemClick?: boolean;

  /**
   * 是否为瀑布流布局？
   */
  masonryLayout?: boolean;
}
