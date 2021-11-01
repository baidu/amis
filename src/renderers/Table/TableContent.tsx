import React from 'react';
import {ClassNamesFn} from '../../theme';
import {IColumn, IRow} from '../../store/table';
import {SchemaNode, Action} from '../../types';
import {TableBody} from './TableBody';
import {LocaleProps} from '../../locale';
import {observer} from 'mobx-react';
import {ActionSchema} from '../Action';

export interface TableContentProps extends LocaleProps {
  className?: string;
  tableClassName?: string;
  classnames: ClassNamesFn;
  columns: Array<IColumn>;
  columnsGroup: Array<{
    label: string;
    index: number;
    colSpan: number;
    rowSpan: number;
    has: Array<any>;
  }>;
  rows: Array<IRow>;
  placeholder?: string;
  render: (region: string, node: SchemaNode, props?: any) => JSX.Element;
  onMouseMove: (event: React.MouseEvent) => void;
  onScroll: (event: React.UIEvent) => void;
  tableRef: (table?: HTMLTableElement | null) => void;
  renderHeadCell: (column: IColumn, props?: any) => JSX.Element;
  renderCell: (
    region: string,
    column: IColumn,
    item: IRow,
    props: any
  ) => React.ReactNode;
  onCheck: (item: IRow, value: boolean, shift?: boolean) => void;
  onQuickChange?: (
    item: IRow,
    values: object,
    saveImmediately?: boolean | any,
    savePristine?: boolean
  ) => void;
  footable?: boolean;
  footableColumns: Array<IColumn>;
  checkOnItemClick?: boolean;
  buildItemProps?: (item: IRow, index: number) => any;
  onAction?: (e: React.UIEvent<any>, action: Action, ctx: object) => void;
  rowClassNameExpr?: string;
  rowClassName?: string;
  data?: any;
  prefixRow?: Array<any>;
  affixRow?: Array<any>;
  itemAction?: ActionSchema;
}

@observer
export class TableContent extends React.Component<TableContentProps> {
  render() {
    const {
      placeholder,
      classnames: cx,
      render,
      className,
      columns,
      columnsGroup,
      onMouseMove,
      onScroll,
      tableRef,
      rows,
      renderHeadCell,
      renderCell,
      onCheck,
      rowClassName,
      onQuickChange,
      footable,
      footableColumns,
      checkOnItemClick,
      buildItemProps,
      onAction,
      rowClassNameExpr,
      data,
      prefixRow,
      locale,
      translate,
      itemAction,
      affixRow
    } = this.props;

    const tableClassName = cx('Table-table', this.props.tableClassName);
    const hideHeader = columns.every(column => !column.label);

    return (
      <div
        onMouseMove={onMouseMove}
        className={cx('Table-content', className)}
        onScroll={onScroll}
      >
        <table ref={tableRef} className={tableClassName}>
          <thead>
            {columnsGroup.length ? (
              <tr>
                {columnsGroup.map((item, index) => (
                  <th
                    key={index}
                    data-index={item.index}
                    colSpan={item.colSpan}
                    rowSpan={item.rowSpan}
                  >
                    {item.label ? render('tpl', item.label) : null}
                  </th>
                ))}
              </tr>
            ) : null}
            <tr className={hideHeader ? 'fake-hide' : ''}>
              {columns.map(column =>
                columnsGroup.find(group => ~group.has.indexOf(column))
                  ?.rowSpan === 2
                  ? null
                  : renderHeadCell(column, {
                      'data-index': column.index,
                      'key': column.index
                    })
              )}
            </tr>
          </thead>
          {!rows.length ? (
            <tbody>
              <tr className={cx('Table-placeholder')}>
                <td colSpan={columns.length}>
                  {render(
                    'placeholder',
                    translate(placeholder || 'placeholder.noData')
                  )}
                </td>
              </tr>
            </tbody>
          ) : (
            <TableBody
              itemAction={itemAction}
              classnames={cx}
              render={render}
              renderCell={renderCell}
              onCheck={onCheck}
              onQuickChange={onQuickChange}
              footable={footable}
              footableColumns={footableColumns}
              checkOnItemClick={checkOnItemClick}
              buildItemProps={buildItemProps}
              onAction={onAction}
              rowClassNameExpr={rowClassNameExpr}
              rowClassName={rowClassName}
              rows={rows}
              columns={columns}
              locale={locale}
              translate={translate}
              prefixRow={prefixRow}
              affixRow={affixRow}
              data={data}
            ></TableBody>
          )}
        </table>
      </div>
    );
  }
}
