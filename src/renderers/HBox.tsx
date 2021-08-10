import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {Api, SchemaNode, Schema, Action} from '../types';
import cx from 'classnames';
import {isVisible, ucFirst} from '../utils/helper';
import {
  BaseSchema,
  SchemaCollection,
  SchemaExpression,
  SchemaObject
} from '../Schema';
import {FormSchemaHorizontal} from './Form/index';

export type HBoxColumnObject = {
  /**
   * 列上 CSS 类名
   */
  columnClassName?: string;

  /**
   * 垂直对齐方式
   */
  valign?: 'top' | 'middle' | 'bottom' | 'between';

  /**
   * 宽度
   */
  width?: number | string;

  /**
   * 高度
   */
  height?: number | string;

  /**
   * 其他样式
   */
  style?: {
    [propName: string]: any;
  };

  /**
   * 配置子表单项默认的展示方式。
   */
  mode?: 'normal' | 'inline' | 'horizontal';
  /**
   * 如果是水平排版，这个属性可以细化水平排版的左右宽度占比。
   */
  horizontal?: FormSchemaHorizontal;

  /**
   * 内容区
   */
  body?: SchemaCollection;

  /**
   * 是否显示
   */

  visible?: boolean;

  /**
   * 是否显示表达式
   */
  visibleOn?: SchemaExpression;
};

export type HBoxColumn = HBoxColumnObject;

/**
 * Hbox 水平布局渲染器。
 * 文档：https://baidu.gitee.io/amis/docs/components/hbox
 */
export interface HBoxSchema extends BaseSchema {
  /**
   * 指定为each展示类型
   */
  type: 'hbox';
  columns: Array<HBoxColumn>;

  /**
   * 配置子表单项默认的展示方式。
   */
  subFormMode?: 'normal' | 'inline' | 'horizontal';
  /**
   * 如果是水平排版，这个属性可以细化水平排版的左右宽度占比。
   */
  subFormHorizontal?: FormSchemaHorizontal;

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

export interface HBoxProps extends RendererProps, HBoxSchema {
  className: string;
  itemRender?: (
    item: any,
    key: number,
    length: number,
    props: any
  ) => JSX.Element;
}

export default class HBox extends React.Component<HBoxProps, object> {
  static propsList: Array<string> = ['columns'];

  static defaultProps: Partial<HBoxProps> = {
    gap: 'xs'
  };

  renderChild(region: string, node: Schema, props: any = {}) {
    const {render} = this.props;

    return render(region, node, props);
  }

  renderColumn(column: HBoxColumn, key: number, length: number) {
    const {
      itemRender,
      data,
      classnames: cx,
      subFormMode,
      subFormHorizontal,
      formMode,
      formHorizontal
    } = this.props;

    if (!isVisible(column, data) || !column) {
      return null;
    }

    let style = {
      width: column.width,
      height: column.height,
      ...column.style
    };

    return (
      <div
        key={key}
        className={cx(
          `Hbox-col`,
          style.width === 'auto'
            ? 'Hbox-col--auto'
            : style.width
            ? 'Hbox-col--customWidth'
            : '',
          {
            [`Hbox-col--v${ucFirst(column.valign)}`]: column.valign
          },
          (column as HBoxColumn).columnClassName
        )}
        style={style}
      >
        {itemRender
          ? itemRender(column, key, length, this.props)
          : this.renderChild(`column/${key}`, (column as any).body, {
              formMode: column.mode || subFormMode || formMode,
              formHorizontal:
                column.horizontal || subFormHorizontal || formHorizontal
            })}
      </div>
    );
  }

  renderColumns() {
    const {columns} = this.props;

    return columns.map((column, key) =>
      this.renderColumn(column, key, columns.length)
    );
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
        className={cx(`Hbox`, className, {
          [`Hbox--${gap}`]: gap,
          [`Hbox--v${ucFirst(vAlign)}`]: vAlign,
          [`Hbox--h${ucFirst(hAlign)}`]: hAlign
        })}
      >
        {this.renderColumns()}
      </div>
    );
  }
}

@Renderer({
  type: 'hbox'
})
export class HBoxRenderer extends HBox {}
