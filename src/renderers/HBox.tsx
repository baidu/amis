import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {Api, SchemaNode, Schema, Action} from '../types';
import cx from 'classnames';
import {isVisible} from '../utils/helper';

export type Column = Schema & {
  columnClassName?: string;
};

export interface HBoxProps extends RendererProps {
  columns: Array<Column>;
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

  renderColumn(column: Column, key: number, length: number) {
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
        className={cx(`${ns}Hbox-col`, (column as Column).columnClassName)}
        style={style}
      >
        {itemRender
          ? itemRender(column, key, length, this.props)
          : this.renderChild(`column/${key}`, column)}
      </div>
    );
  }

  render() {
    const {className, columns, classPrefix: ns} = this.props;

    return (
      <div className={cx(`${ns}Hbox`, className)}>
        {columns.map((column, key) =>
          this.renderColumn(column, key, columns.length)
        )}
      </div>
    );
  }
}

@Renderer({
  test: /(^|\/)hbox$/,
  name: 'hbox'
})
export class HBoxRenderer extends HBox {}
