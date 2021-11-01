/**
 * @file 表格的方式显示只读信息，比如产品详情
 */

import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {BaseSchema, SchemaExpression, SchemaObject, SchemaTpl} from '../Schema';
import PopOver from './PopOver';
import {resolveVariable} from '../utils/tpl-builtin';
import {visibilityFilter} from '../utils/helper';

export type PropertyItemProps = {
  /**
   * 属性名
   */
  label?: SchemaTpl;

  /**
   * 属性值
   */
  content?: SchemaTpl;

  /**
   * 配置是否显示，如果不显示，后续的节点会补上来
   */
  visibleOn?: SchemaExpression;

  /**
   * 配置是否显示，如果不显示，后续的节点会补上来
   */
  hiddenOn?: SchemaExpression;

  /**
   * 跨几列
   */
  span?: number;
};

export type PropertyItem = PropertyItemProps & SchemaObject;

/**
 * Property 属性列表
 * 文档：https://baidu.gitee.io/amis/docs/components/property
 */
export interface PropertySchema extends BaseSchema {
  /**
   * 指定为 property 展示类型
   */
  type: 'property';

  /**
   * 标题
   */
  title?: string;

  /**
   * 一共几列
   */
  column?: number;

  /**
   * 显示模式
   */
  mode?: 'table' | 'simple';

  /**
   * 每个 property 的设置
   */
  items: Array<PropertyItem>;

  /**
   * 自定义样式
   */
  style?: {
    [propName: string]: any;
  };

  /**
   * 标题样式
   */
  titleStyle?: {
    [propName: string]: any;
  };

  /**
   * 自定义样式
   */
  labelStyle?: {
    [propName: string]: any;
  };

  separator?: string;

  /**
   * 自定义样式
   */
  contentStyle?: {
    [propName: string]: any;
  };
}

export interface PropertyProps
  extends RendererProps,
    Omit<PropertySchema, 'type' | 'className'> {}

interface PropertyContent {
  label: any;
  content: any;
  span: number;
}

export default class Property extends React.Component<PropertyProps, object> {
  constructor(props: PropertyProps) {
    super(props);
  }

  /**
   * 算好每行的分布情况，方便后续渲染
   */
  prepareRows() {
    const {column = 3, items, source, data} = this.props;

    const propertyItems =
      (items
        ? items
        : (resolveVariable(source, data) as Array<PropertyItem>)) || [];

    const rows: PropertyContent[][] = [];

    let row: PropertyContent[] = [];
    let columnLeft = column;
    let index = 0;
    const filteredItems = visibilityFilter(propertyItems, data);

    for (const item of filteredItems) {
      index = index + 1;
      const span = Math.min(item.span || 1, column);
      columnLeft = columnLeft - span;
      const rowItem = {
        label: item.label,
        content: item.content,
        span: span
      };
      // 如果还能放得下就放这一行
      if (columnLeft >= 0) {
        row.push(rowItem);
      } else {
        rows.push(row);
        columnLeft = column - span;
        row = [rowItem];
      }

      // 最后一行将最后的数据 push
      if (index === filteredItems.length) {
        rows.push(row);
      }
    }

    return rows;
  }

  renderRow(rows: PropertyContent[][]) {
    const {
      render,
      contentStyle,
      labelStyle,
      separator = ': ',
      mode = 'table'
    } = this.props;
    return rows.map((row, key) => {
      return (
        <tr key={key}>
          {row.map((property, index) => {
            return mode === 'table' ? (
              <React.Fragment key={`item-${index}`}>
                <th style={labelStyle}>{render('label', property.label)}</th>
                <td
                  colSpan={property.span + property.span - 1} // 需要再补上 th 所占的列数
                  style={contentStyle}
                >
                  {render('content', property.content)}
                </td>
              </React.Fragment>
            ) : (
              <td
                colSpan={property.span}
                style={contentStyle}
                key={`item-${index}`}
              >
                <span style={labelStyle}>
                  {render('label', property.label)}
                </span>
                {separator}
                {render('content', property.content)}
              </td>
            );
          })}
        </tr>
      );
    });
  }

  render() {
    const {
      style,
      title,
      column = 3,
      classnames: cx,
      className,
      titleStyle,
      mode = 'table'
    } = this.props;

    const rows = this.prepareRows();

    return (
      <div
        className={cx('Property', `Property--${mode}`, className)}
        style={style}
      >
        <table>
          {title ? (
            <thead>
              <tr>
                <th
                  colSpan={mode === 'table' ? column + column : column}
                  style={titleStyle}
                >
                  {title}
                </th>
              </tr>
            </thead>
          ) : null}
          <tbody>{this.renderRow(rows)}</tbody>
        </table>
      </div>
    );
  }
}

@Renderer({
  type: 'property'
})
export class PropertyRenderer extends Property {}
