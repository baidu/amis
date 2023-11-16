/**
 * @file table/SummaryRow
 * @author fex
 */

import React from 'react';
import {ThemeProps} from 'amis-core';

import {SummaryProps} from './index';
import {updateFixedRow, hasFixedColumn} from './util';
import Cell from './Cell';

export interface RowProps extends ThemeProps {
  dataSource: Array<any>;
  colCount: number;
  isRightExpandable?: boolean;
  row?: Array<SummaryProps>;
  onMouseEnter: Function;
  onMouseLeave: Function;
}

export interface Props extends RowProps {
  summary: Array<SummaryProps | Array<SummaryProps>>;
}

export class SummaryRow extends React.PureComponent<RowProps> {
  domRef: React.RefObject<HTMLTableRowElement> = React.createRef();

  updateFixedRow() {
    const {classnames: cx, row} = this.props;
    if (row && hasFixedColumn(row)) {
      const tr = this.domRef.current;
      updateFixedRow(tr as HTMLTableRowElement, row || [], cx);
    }
  }

  componentDidMount() {
    this.updateFixedRow();
  }

  componentDidUpdate() {
    this.updateFixedRow();
  }

  render() {
    const {
      classnames: cx,
      dataSource,
      classPrefix,
      row,
      colCount,
      isRightExpandable,
      onMouseEnter,
      onMouseLeave
    } = this.props;

    const cells: Array<React.ReactNode> = [];
    const extraCount = isRightExpandable ? 1 : 0;

    row?.forEach((s, index) => {
      cells.push(
        <Cell
          classnames={cx}
          classPrefix={classPrefix}
          key={'summary-cell-' + index}
          fixed={s.fixed}
          colSpan={
            cells.length === 0
              ? (s.colSpan || 1) + colCount - extraCount
              : index === row.length - 1
              ? (s.colSpan || 1) + extraCount
              : s.colSpan
          }
        >
          {typeof s.render === 'function' ? s.render(dataSource) : s.render}
        </Cell>
      );
    });

    return (
      <tr
        ref={this.domRef}
        onMouseEnter={e => onMouseEnter && onMouseEnter(e)}
        onMouseLeave={e => onMouseLeave && onMouseLeave(e)}
        className={cx('Table-summary-row')}
      >
        {cells}
      </tr>
    );
  }
}

export default class SummaryRows extends React.PureComponent<Props> {
  render() {
    const {summary, ...rest} = this.props;

    const rows: Array<Array<SummaryProps>> = [[]];
    if (Array.isArray(summary)) {
      summary.forEach((s: SummaryProps) => {
        if (Array.isArray(s)) {
          rows.push(s);
        } else {
          rows[0].push(s);
        }
      });
    }

    return rows.map((row: Array<SummaryProps>, index: number) => (
      <SummaryRow key={`summary-${index}`} {...rest} row={row} />
    ));
  }
}
