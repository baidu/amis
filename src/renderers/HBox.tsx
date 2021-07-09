import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {Api, SchemaNode, Schema, Action} from '../types';
import cx from 'classnames';
import {isVisible} from '../utils/helper';
import {BaseSchema, SchemaObject} from '../Schema';
import {FormSchemaHorizontal} from './Form/index';

export type HBoxColumnObject = {
  /**
   * 列上 CSS 类名
   */
  columnClassName?: string;

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
};

export type HBoxColumn = HBoxColumnObject & SchemaObject; // 不能用 SchemaObject 呢，会报错

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
      classPrefix: ns,
      subFormMode,
      subFormHorizontal,
      formMode,
      formHorizontal
    } = this.props;

    if (!isVisible(column, data)) {
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
        className={cx(`${ns}Hbox-col`, (column as HBoxColumn).columnClassName)}
        style={style}
      >
        {itemRender
          ? itemRender(column, key, length, this.props)
          : this.renderChild(
              `column/${key}`,
              column.type ? column : (column as any).body,
              {
                formMode: column.mode || subFormMode || formMode,
                formHorizontal:
                  column.horizontal || subFormHorizontal || formHorizontal
              }
            )}
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
    const {className, classnames: cx, gap} = this.props;
    return (
      <div className={cx(`Hbox`, className, gap ? `Hbox--${gap}` : '')}>
        {this.renderColumns()}
      </div>
    );
  }
}

@Renderer({
  type: 'hbox'
})
export class HBoxRenderer extends HBox {}
