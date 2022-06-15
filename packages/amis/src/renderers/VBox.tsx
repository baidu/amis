import React from 'react';
import {Renderer, RendererProps} from 'amis-core';
import {Api, SchemaNode, Schema, ActionObject} from 'amis-core';
import cx from 'classnames';
import {BaseSchema, SchemaObject} from '../Schema';

export type HboxRow = SchemaObject & {
  rowClassName?: string;
  cellClassName?: string;
};

/**
 * 垂直布局控件
 * 文档：https://baidu.gitee.io/amis/docs/components/vbox
 */
export interface VBoxSchema extends BaseSchema {
  type: 'vbox';

  /**
   * 行集合
   */
  rows?: Array<HboxRow>;
}

export interface HBoxProps
  extends RendererProps,
    Omit<VBoxSchema, 'className'> {}

export default class VBox extends React.Component<HBoxProps, object> {
  static propsList: Array<string> = ['rows'];

  static defaultProps: Partial<HBoxProps> = {};

  renderChild(region: string, node: Schema) {
    const {render} = this.props;

    return render(region, node);
  }

  renderCell(row: HboxRow, key: any) {
    const {classPrefix: ns} = this.props;
    return (
      <div className={cx(`${ns}Vbox-cell`, (row as HboxRow).cellClassName)}>
        {this.renderChild(`row/${key}`, row)}
      </div>
    );
  }

  render() {
    const {className, rows, classPrefix: ns} = this.props;

    return (
      <div className={cx(`${ns}Vbox`, className)}>
        {Array.isArray(rows)
          ? rows.map((row, key) => (
              <div
                className={cx('row-row', (row as HboxRow).rowClassName)}
                key={key}
              >
                {this.renderCell(row, key)}
              </div>
            ))
          : null}
      </div>
    );
  }
}

@Renderer({
  type: 'vbox'
})
export class VBoxRenderer extends VBox {}
