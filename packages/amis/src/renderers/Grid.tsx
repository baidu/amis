import React from 'react';
import {FormHorizontal, Renderer, RendererProps} from 'amis-core';
import {Schema} from 'amis-core';
import pick from 'lodash/pick';
import {
  BaseSchema,
  SchemaClassName,
  SchemaCollection,
  SchemaObject
} from '../Schema';

import {ucFirst} from 'amis-core';

export const ColProps = ['lg', 'md', 'sm', 'xs'];

export type GridColumnObject = {
  /**
   * 极小屏（<768px）时宽度占比
   */
  xs?: number | 'auto';

  /**
   * 小屏时（>=768px）宽度占比
   */
  sm?: number | 'auto';

  /**
   * 中屏时(>=992px)宽度占比
   */
  md?: number | 'auto';

  /**
   * 大屏时(>=1200px)宽度占比
   */
  lg?: number | 'auto';

  /**
   * 垂直对齐方式
   */
  valign?: 'top' | 'middle' | 'bottom' | 'between';

  /**
   * 配置子表单项默认的展示方式。
   */
  mode?: 'normal' | 'inline' | 'horizontal';

  /**
   * 如果是水平排版，这个属性可以细化水平排版的左右宽度占比。
   */
  horizontal?: FormHorizontal;

  body?: SchemaCollection;

  /**
   * 列类名
   */
  columnClassName?: SchemaClassName;
};

export type GridColumn = GridColumnObject;
export type ColumnNode = GridColumn;
export interface ColumnArray extends Array<ColumnNode> {}

/**
 * Grid 格子布局渲染器。
 * 文档：https://baidu.gitee.io/amis/docs/components/grid
 */
export interface GridSchema extends BaseSchema {
  /**
   * 指定为 Grid 格子布局渲染器。
   */
  type: 'grid';

  /**
   * 列集合
   */
  columns: Array<GridColumn>;

  /**
   * 水平间距
   */
  gap?: 'xs' | 'sm' | 'base' | 'none' | 'md' | 'lg';

  /**
   * 垂直对齐方式
   */
  valign?: 'top' | 'middle' | 'bottom' | 'between';

  /**
   * 水平对齐方式
   */
  align?: 'left' | 'right' | 'between' | 'center';
}

export interface GridProps
  extends RendererProps,
    Omit<GridSchema, 'type' | 'className' | 'columnClassName'> {
  itemRender?: (item: any, length: number, props: any) => JSX.Element;
}

function fromBsClass(cn: string) {
  if (typeof cn === 'string' && cn) {
    return cn.replace(
      /\bcol-(xs|sm|md|lg)-(\d+)\b/g,
      (_, bp, size) => `Grid-col--${bp}${size}`
    );
  }

  return cn;
}

function copProps2Class(props: any): string {
  const cns: Array<string> = [];
  const modifiers = ColProps;

  modifiers.forEach(
    modifier =>
      props &&
      props[modifier] &&
      cns.push(`Grid-col--${modifier}${ucFirst(props[modifier])}`)
  );
  cns.length || cns.push('Grid-col--md');
  return cns.join(' ');
}

export default class Grid<T> extends React.Component<GridProps & T, object> {
  static propsList: Array<string> = ['columns'];
  static defaultProps = {};

  renderChild(
    region: string,
    node: SchemaCollection,
    length: number,
    props: any = {}
  ) {
    const {render, itemRender} = this.props;

    return itemRender
      ? itemRender(node, length, this.props)
      : render(region, node, props);
  }

  renderColumn(column: ColumnNode, key: number, length: number) {
    let colProps: {
      [propName: string]: any;
    } = pick(column, ColProps);

    colProps = {
      ...colProps
    };

    const {
      classnames: cx,
      formMode,
      subFormMode,
      subFormHorizontal,
      formHorizontal,
      translate: __,
      disabled
    } = this.props;

    return (
      <div
        key={key}
        className={cx(
          copProps2Class(colProps),
          fromBsClass((column as any).columnClassName!),
          {
            [`Grid-col--v${ucFirst(column.valign)}`]: column.valign
          }
        )}
      >
        {this.renderChild(`column/${key}`, (column as any).body || '', length, {
          disabled,
          formMode: column.mode || subFormMode || formMode,
          formHorizontal:
            column.horizontal || subFormHorizontal || formHorizontal
        })}
      </div>
    );
  }

  renderColumns(columns: ColumnArray) {
    return Array.isArray(columns)
      ? columns.map((column, key) =>
          this.renderColumn(column, key, columns.length)
        )
      : null;
  }

  render() {
    const {
      className,
      classnames: cx,
      gap,
      valign: vAlign,
      align: hAlign
    } = this.props;
    return (
      <div
        className={cx(
          'Grid',
          {
            [`Grid--${gap}`]: gap,
            [`Grid--v${ucFirst(vAlign)}`]: vAlign,
            [`Grid--h${ucFirst(hAlign)}`]: hAlign
          },
          className
        )}
      >
        {this.renderColumns(this.props.columns)}
      </div>
    );
  }
}

@Renderer({
  type: 'grid'
})
export class GridRenderer extends Grid<{}> {}
