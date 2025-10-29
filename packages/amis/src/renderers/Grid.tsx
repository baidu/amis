import React from 'react';
import {
  FormHorizontal,
  Renderer,
  RendererProps,
  buildStyle,
  CustomStyle,
  setThemeClassName,
  AMISSchemaCollection,
  AMISSchema
} from 'amis-core';
import pick from 'lodash/pick';
import {BaseSchema, AMISClassName} from '../Schema';

import {ucFirst} from 'amis-core';
import {Spinner, SpinnerExtraProps} from 'amis-ui';
import {AMISSchemaBase} from 'amis-core';

export const ColProps = ['lg', 'md', 'sm', 'xs'];

export type AMISGridColumn = {
  id?: string;

  /**
   * 极小屏幕宽度占比
   */
  xs?: number | 'auto';

  /**
   * 小屏幕宽度占比
   */
  sm?: number | 'auto';

  /**
   * 中等屏幕宽度占比
   */
  md?: number | 'auto';

  /**
   * 大屏幕宽度占比
   */
  lg?: number | 'auto';

  /**
   * 垂直对齐方式
   */
  valign?: 'top' | 'middle' | 'bottom' | 'between';

  /**
   * 子表单项展示方式
   */
  mode?: 'normal' | 'inline' | 'horizontal';

  /**
   * 水平排版宽度占比配置
   */
  horizontal?: FormHorizontal;

  /**
   * 列内容配置
   */
  body?: AMISSchemaCollection;

  /**
   * 列CSS类名
   */
  columnClassName?: AMISClassName;

  /**
   * 自定义样式
   */
  style?: any;

  /**
   * 包装器自定义样式
   */
  wrapperCustomStyle?: any;

  /**
   * 主题样式配置
   */
  themeCss?: any;
};

export type ColumnNode = AMISGridColumn;
export interface ColumnArray extends Array<ColumnNode> {}

/**
 * Grid 网格布局组件，用于创建响应式网格系统
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/grid
 */
/**
 * 栅格布局组件，用于按列布局子元素。支持响应式断点与列间距配置。
 */
export interface AMISGridSchema extends AMISSchemaBase {
  /**
   * 指定为 grid 组件
   */
  type: 'grid';

  /**
   * 列配置数组，定义每列的布局和内容
   */
  columns: Array<AMISGridColumn>;

  /**
   * 列之间的水平间距
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
    Omit<AMISGridSchema, 'type' | 'className' | 'columnClassName'>,
    SpinnerExtraProps {
  itemRender?: (
    item: any,
    index: number,
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
    key: number,
    column: AMISGridColumn,
    length: number,
    props: any = {}
  ) {
    const {render, itemRender} = this.props;

    return itemRender
      ? itemRender(
          {
            ...column,
            ...(column.body ? {type: 'wrapper', wrap: false} : {})
          },
          key,
          length,
          this.props
        )
      : render(region, (column as any).body, props);
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
      disabled,
      data,
      env
    } = this.props;
    const styleVar = buildStyle(column.style, data);

    const {id, themeCss, wrapperCustomStyle} = column;
    return (
      <div
        key={key}
        className={cx(
          copProps2Class(colProps),
          fromBsClass((column as any).columnClassName!),
          {
            [`Grid-col--v${ucFirst(column.valign)}`]: column.valign
          },
          setThemeClassName({
            ...column,
            name: 'baseControlClassName',
            id,
            themeCss
          }),
          setThemeClassName({
            ...column,
            name: 'wrapperCustomStyle',
            id,
            themeCss
          })
        )}
        style={styleVar}
      >
        {this.renderChild(`column/${key}`, key, column, length, {
          disabled,
          formMode: column.mode || subFormMode || formMode,
          formHorizontal:
            column.horizontal || subFormHorizontal || formHorizontal
        })}

        <CustomStyle
          {...column}
          config={{
            wrapperCustomStyle,
            id,
            themeCss,
            classNames: [
              {
                key: 'baseControlClassName'
              }
            ]
          }}
          env={env}
        />
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
      style,
      classnames: cx,
      gap,
      valign: vAlign,
      align: hAlign,
      loading = false,
      loadingConfig,
      data,
      id,
      wrapperCustomStyle,
      env,
      themeCss
    } = this.props;
    const styleVar = buildStyle(style, data);
    return (
      <div
        className={cx(
          'Grid',
          {
            [`Grid--${gap}`]: gap,
            [`Grid--v${ucFirst(vAlign)}`]: vAlign,
            [`Grid--h${ucFirst(hAlign)}`]: hAlign
          },
          className,
          setThemeClassName({
            ...this.props,
            name: 'baseControlClassName',
            id,
            themeCss
          }),
          setThemeClassName({
            ...this.props,
            name: 'wrapperCustomStyle',
            id,
            themeCss: wrapperCustomStyle
          })
        )}
        style={styleVar}
        data-id={id}
        data-role="container"
      >
        {this.renderColumns(this.props.columns)}
        <Spinner loadingConfig={loadingConfig} overlay show={loading} />
        <CustomStyle
          {...this.props}
          config={{
            wrapperCustomStyle,
            id,
            themeCss,
            classNames: [
              {
                key: 'baseControlClassName'
              }
            ]
          }}
          env={env}
        />
      </div>
    );
  }
}

@Renderer({
  type: 'grid'
})
export class GridRenderer extends Grid<{}> {}
