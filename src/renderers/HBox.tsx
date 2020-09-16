import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {Api, SchemaNode, Schema, Action} from '../types';
import cx from 'classnames';
import {isVisible} from '../utils/helper';
import {BaseSchema, SchemaObject} from '../Schema';

export type HBoxColumnObject = {
  columnClassName?: string;

  width?: number | string;
  height?: number | string;

  style?: {
    [propName: string]: any;
  };
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

  static defaultProps: Partial<HBoxProps> = {};

  renderChild(region: string, node: Schema) {
    const {render} = this.props;

    return render(region, node);
  }

  renderColumn(column: HBoxColumn, key: number, length: number) {
    const {itemRender, data, classPrefix: ns} = this.props;

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
          : this.renderChild(`column/${key}`, column)}
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
    const {className, classnames: cx} = this.props;
    return <div className={cx(`Hbox`, className)}>{this.renderColumns()}</div>;
  }
}

@Renderer({
  test: /(^|\/)hbox$/,
  name: 'hbox'
})
export class HBoxRenderer extends HBox {}
