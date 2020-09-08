import {
  BaseSchema,
  SchemaClassName,
  SchemaTpl,
  SchemaUrlPath,
  SchemaExpression,
  SchemaCollection
} from './Schema';
import {ActionSchema} from './Action';

/**
 * Card 渲染器，格式说明，文档：https://baidu.gitee.io/amis/docs/components/card
 */
export interface CardSchema extends BaseSchema {
  /**
   * 指定为 card 类型
   */
  type: 'card';

  /**
   * 头部配置
   */
  header?: {
    className?: SchemaClassName;

    /**
     * 标题
     */
    title?: SchemaTpl;
    titleClassName?: string;

    /**
     * 副标题
     */
    subTitle?: SchemaTpl;
    subTitleClassName?: SchemaClassName;
    subTitlePlaceholder?: string;

    /**
     * 描述
     */
    description?: SchemaTpl;

    /**
     * 描述占位内容
     */
    descriptionPlaceholder?: string;

    /**
     * 描述占位类名
     */
    descriptionClassName?: string;

    /**
     * @deprecated 建议用 description
     */
    desc?: SchemaTpl;

    /**
     * @deprecated 建议用 descriptionPlaceholder
     */
    descPlaceholder?: SchemaTpl;

    /**
     * @deprecated 建议用 descriptionClassName
     */
    descClassName?: SchemaClassName;

    /**
     * 图片地址
     */
    avatar?: SchemaUrlPath;

    avatarText?: SchemaTpl;
    avatarTextClassName?: SchemaClassName;

    /**
     * 图片包括层类名
     */
    avatarClassName?: SchemaClassName;

    /**
     * 图片类名。
     */
    imageClassName?: SchemaClassName;

    /**
     * 是否点亮
     */
    highlight?: SchemaExpression;
    highlightClassName?: SchemaClassName;
  };

  /**
   * 内容区域
   */
  body?: SchemaCollection;

  /**
   * 底部按钮集合。
   */
  actions?: Array<ActionSchema>;
}
