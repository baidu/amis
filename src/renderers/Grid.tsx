import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {Schema} from '../types';
import cx from 'classnames';
import pick = require('lodash/pick');

export const ColProps = ['lg', 'md', 'sm', 'xs'];

export type Column = Schema & {
  xs?: number;
  xsHidden?: boolean;
  xsOffset?: number;
  xsPull?: number;
  xsPush?: number;

  sm?: number;
  smHidden?: boolean;
  smOffset?: number;
  smPull?: number;
  smPush?: number;

  md?: number;
  mdHidden?: boolean;
  mdOffset?: number;
  mdPull?: number;
  mdPush?: number;

  lg?: number;
  lgHidden?: boolean;
  lgOffset?: number;
  lgPull?: number;
  lgPush?: number;

  mode?: string;
  horizontal?: any;
};
export type ColumnNode = Column | ColumnArray;
export interface ColumnArray extends Array<ColumnNode> {}

export interface GridProps extends RendererProps {
  columns: Array<Column>;
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

  renderChild(region: string, node: Schema, key: number, length: number) {
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
          fromBsClass((column as Column).columnClassName)
        )}
      >
        {Array.isArray(column)
          ? this.renderColumns(column)
          : this.renderChild(`column/${key}`, column, key, length)}
      </div>
    );
  }

  renderColumns(columns: ColumnArray): React.ReactElement<any> | null {
    const {className, classnames: cx} = this.props;

    return (
      <div className={cx('Grid', className)}>
        {columns.map((column, key) =>
          this.renderColumn(column, key, columns.length)
        )}
      </div>
    );
  }

  render() {
    return this.renderColumns(this.props.columns);
  }
}

@Renderer({
  test: /(^|\/)grid$/,
  name: 'grid'
})
export class GridRenderer extends Grid<{}> {}
