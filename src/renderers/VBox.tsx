import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {Api, SchemaNode, Schema, Action} from '../types';
import cx from 'classnames';
import {BaseSchema} from '../Schema';

/**
 * 垂直布局控件
 * 文档：https://baidu.gitee.io/amis/docs/components/vbox
 */
export interface VBoxSchema extends BaseSchema {
  type: 'vbox';
}

export type Row = Schema & {
  rowClassName?: string;
  cellClassName?: string;
};

export interface HBoxProps extends RendererProps {
  rows?: Array<Row>;
  className?: string;
}

export default class VBox extends React.Component<HBoxProps, object> {
  static propsList: Array<string> = ['rows'];

  static defaultProps: Partial<HBoxProps> = {};

  renderChild(region: string, node: Schema) {
    const {render} = this.props;

    return render(region, node);
  }

  renderCell(row: Row, key: any) {
    const {classPrefix: ns} = this.props;
    return (
      <div className={cx(`${ns}Vbox-cell`, (row as Row).cellClassName)}>
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
                className={cx('row-row', (row as Row).rowClassName)}
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
  test: /(^|\/)vbox$/,
  name: 'vbox'
})
export class VBoxRenderer extends VBox {}
