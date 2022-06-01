import React from 'react';
import {Renderer, RendererProps} from 'amis-core';
import {autobind, getPropValue} from 'amis-core';
import {isPureVariable, resolveVariableAndFilter} from 'amis-core';
import {
  BaseSchema,
  SchemaTokenizeableString,
  SchemaTpl,
  SchemaUrlPath
} from '../Schema';
import {ActionSchema} from './Action';
import {GridNav, GridNavDirection, GridNavItem} from 'amis-ui';
import {BadgeObject} from 'amis-ui';
import {handleAction} from 'amis-core';
import {validations} from 'amis-core';

export interface ListItemSchema extends Omit<BaseSchema, 'type'> {
  /**
   * 单项点击事件
   */
  clickAction?: ActionSchema;

  /**
   * 跳转地址
   */
  link?: string;

  /**
   * 打开方式
   */
  blank?: string;

  /**
   * 图片地址
   */
  icon?: SchemaUrlPath;

  /**
   * 描述
   */
  text?: SchemaTpl;

  /**
   * 图标最大宽度比例 0-100
   */
  iconRatio?: number;

  /**
   * 角标
   */
  badge?: BadgeObject;
}

/**
 * List 列表展示控件。
 * 文档：https://baidu.gitee.io/amis/docs/components/card
 */
export interface ListSchema extends BaseSchema {
  /**
   * 指定为 List 列表展示控件。
   */
  type: 'grid-nav';

  /**
   * 列表项类名
   */
  itemClassName?: string;

  /**
   * 静态图片列表配置
   */
  options?: Array<ListItemSchema>;

  /**
   * 是否将列表项固定为正方形
   */
  square?: boolean;

  /**
   * 是否将列表项内容居中显示
   */
  center?: boolean;

  /**
   * 是否显示列表项边框
   */
  border?: boolean;

  /**
   * 列表项之间的间距，默认单位为px
   */
  gutter?: number;

  /**
   * 图标宽度占比, 1-100
   */
  iconRatio?: number;

  /**
   * 列表项内容排列的方向，可选值为 horizontal 、vertical
   */
  direction?: GridNavDirection;

  /**
   * 列数
   */
  columnNum?: number;

  /**
   * 数据源: 绑定当前环境变量
   *
   * @default ${items}
   */
  source?: SchemaTokenizeableString;
}

export interface Column {
  type: string;
  [propName: string]: any;
}

export interface ListProps
  extends RendererProps,
    Omit<ListSchema, 'type' | 'className'> {
  handleClick: (item?: ListItemSchema) => void;
}

@Renderer({
  type: 'grid-nav'
})
export default class List extends React.Component<ListProps, object> {
  @autobind
  handleClick(item: ListItemSchema) {
    return (e: React.MouseEvent) => {
      let action;
      if (item.link) {
        action = validations.isUrl({}, item.link)
          ? {
              type: 'button',
              actionType: 'url',
              url: item.link,
              blank: item.blank
            }
          : {
              type: 'button',
              actionType: 'link',
              link: item.link
            };
      } else {
        action = item.clickAction!;
      }
      handleAction(e, action as ActionSchema, this.props);
    };
  }

  render() {
    const {itemClassName, source, data, options, classnames} = this.props;

    let value = getPropValue(this.props);
    let list: any = [];

    if (typeof source === 'string' && isPureVariable(source)) {
      list = resolveVariableAndFilter(source, data, '| raw') || undefined;
    } else if (Array.isArray(value)) {
      list = value;
    } else if (Array.isArray(options)) {
      list = options;
    }

    if (list && !Array.isArray(list)) {
      list = [list];
    }

    if (!list?.length) {
      return null;
    }

    return (
      <GridNav {...this.props}>
        {list.map((item: ListItemSchema, index: number) => (
          <GridNavItem
            key={index}
            onClick={
              item.clickAction || item.link ? this.handleClick(item) : undefined
            }
            className={itemClassName}
            text={item.text}
            icon={item.icon}
            classnames={classnames}
            badge={
              item.badge
                ? {
                    badge: item.badge,
                    data: data,
                    classnames
                  }
                : undefined
            }
          />
        ))}
      </GridNav>
    );
  }
}
