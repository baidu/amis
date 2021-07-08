import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {Schema} from '../types';
import pick from 'lodash/pick';
import {
  BaseSchema,
  SchemaClassName,
  SchemaCollection,
  SchemaObject
} from '../Schema';
import {FormSchemaHorizontal} from './Form';

export const ColProps = ['lg', 'md', 'sm', 'xs'];

export type GridColumnObject = {
  /**
   * 极小屏（<768px）时宽度占比
   */
  xs?: number;

  /**
   * 极小屏（<768px）时是否隐藏该列
   */
  xsHidden?: boolean;

  /**
   * 极小屏（<768px）时宽度偏移量
   */
  xsOffset?: number;

  /**
   * 极小屏（<768px）时宽度右偏移量
   */
  xsPull?: number;

  /**
   * 极小屏（<768px）时宽度左偏移量
   */
  xsPush?: number;

  /**
   * 小屏时（>=768px）宽度占比
   */
  sm?: number;

  /**
   * 小屏时（>=768px）是否隐藏该列
   */
  smHidden?: boolean;

  /**
   * 小屏时（>=768px）宽度偏移量
   */
  smOffset?: number;

  /**
   * 小屏时（>=768px）宽度右偏移量
   */
  smPull?: number;

  /**
   * 小屏时（>=768px）宽度左偏移量
   */
  smPush?: number;

  /**
   * 中屏时(>=992px)宽度占比
   */
  md?: number;

  /**
   * 中屏时(>=992px)是否隐藏该列
   */
  mdHidden?: boolean;

  /**
   * 中屏时(>=992px)宽度偏移量
   */
  mdOffset?: number;

  /**
   * 中屏时(>=992px)宽度右偏移量
   */
  mdPull?: number;

  /**
   * 中屏时(>=992px)宽度左偏移量
   */
  mdPush?: number;

  /**
   * 大屏时(>=1200px)宽度占比
   */
  lg?: number;
  /**
   * 大屏时(>=1200px)是否隐藏该列
   */
  lgHidden?: boolean;
  /**
   * 大屏时(>=1200px)宽度偏移量
   */
  lgOffset?: number;
  /**
   * 大屏时(>=1200px)宽度右偏移量
   */
  lgPull?: number;
  /**
   * 大屏时(>=1200px)宽度左偏移量
   */
  lgPush?: number;

  /**
   * 配置子表单项默认的展示方式。
   */
  subFormMode?: 'normal' | 'inline' | 'horizontal';
  /**
   * 如果是水平排版，这个属性可以细化水平排版的左右宽度占比。
   */
  subFormHorizontal?: FormSchemaHorizontal;

  body?: SchemaCollection;

  /**
   * 列类名
   */
  columnClassName?: SchemaClassName;
};

export type GridColumn = GridColumnObject & SchemaObject;
export type ColumnNode = GridColumn | ColumnArray;
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
  columns: Array<GridColumn>;
}

export interface GridProps
  extends RendererProps,
    Omit<GridSchema, 'type' | 'className' | 'columnClassName'> {
  itemRender?: (
    item: any,
    key: number,
    length: number,
    props: any
  ) => JSX.Element;
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
      cns.push(`Grid-col--${modifier}${props[modifier]}`)
  );
  cns.length || cns.push('Grid-col--sm');
  return cns.join(' ');
}

export default class Grid<T> extends React.Component<GridProps & T, object> {
  static propsList: Array<string> = ['columns'];
  static defaultProps = {};

  renderChild(
    region: string,
    node: SchemaCollection,
    key: number,
    length: number
  ) {
    const {render, itemRender} = this.props;

    return itemRender
      ? itemRender(node, key, length, this.props)
      : render(region, node);
  }

  renderColumn(column: ColumnNode, key: number, length: number) {
    let colProps: {
      [propName: string]: any;
    } = pick(column, ColProps);

    colProps = {
      ...colProps
    };

    const cx = this.props.classnames;

    return (
      <div
        key={key}
        className={cx(
          copProps2Class(colProps),
          fromBsClass((column as any).columnClassName!)
        )}
      >
        {Array.isArray(column) ? (
          <div className={cx('Grid')}>
            {column.map((column, key) =>
              this.renderColumn(
                column,
                key,
                (column as Array<GridColumn>).length
              )
            )}
          </div>
        ) : (
          this.renderChild(
            `column/${key}`,
            column.type ? column : (column as any).body!,
            key,
            length
          )
        )}
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
    const {className, classnames: cx} = this.props;
    return (
      <div className={cx('Grid', className)}>
        {this.renderColumns(this.props.columns)}
      </div>
    );
  }
}

@Renderer({
  type: 'grid'
})
export class GridRenderer extends Grid<{}> {}
