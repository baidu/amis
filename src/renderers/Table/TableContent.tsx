import React from 'react';
import {ClassNamesFn} from '../../theme';
import {IColumn, IRow} from '../../store/table';
import {SchemaNode, Action} from '../../types';
import {TableRow} from './TableRow';
import {filter} from '../../utils/tpl';
import {observer} from 'mobx-react';
import {trace, reaction} from 'mobx';

export interface TableContentProps {
  className?: string;
  tableClassName?: string;
  classnames: ClassNamesFn;
  columns: Array<IColumn>;
  columnsGroup: Array<{
    label: string;
    index: number;
    colSpan: number;
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
  onCheck: (item: IRow) => void;
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
}

export class TableContent extends React.Component<TableContentProps> {
  reaction?: () => void;
  constructor(props: TableContentProps) {
    super(props);

    const rows = props.rows;

    this.reaction = reaction(
      () =>
        `${rows.map(item => item.id).join(',')}${rows
          .filter(item => item.checked)
          .map(item => item.id)
          .join(',')}`,
      () => this.forceUpdate(),
      {
        onError: () => this.reaction!()
      }
    );
  }

  shouldComponentUpdate(nextProps: TableContentProps) {
    const props = this.props;

    if (props.columns !== nextProps.columns) {
      return true;
    }

    return false;
  }

  componentwillUnmount() {
    this.reaction?.();
  }

  renderRows(
    rows: Array<any>,
    columns = this.props.columns,
    rowProps: any = {}
  ): any {
    const {
      rowClassName,
      rowClassNameExpr,
      onAction,
      buildItemProps,
      checkOnItemClick,
      classnames: cx,
      render,
      renderCell,
      onCheck,
      onQuickChange,
      footable,
      footableColumns
    } = this.props;

    return rows.map((item: IRow, rowIndex: number) => {
      const itemProps = buildItemProps ? buildItemProps(item, rowIndex) : null;

      const doms = [
        <TableRow
          {...itemProps}
          classnames={cx}
          checkOnItemClick={checkOnItemClick}
          key={item.index}
          itemIndex={rowIndex}
          item={item}
          itemClassName={cx(
            rowClassNameExpr
              ? filter(rowClassNameExpr, item.data)
              : rowClassName,
            {
              'is-last': item.depth > 1 && rowIndex === rows.length - 1
            }
          )}
          columns={columns}
          renderCell={renderCell}
          render={render}
          onAction={onAction}
          onCheck={onCheck}
          // todo 先注释 quickEditEnabled={item.depth === 1}
          onQuickChange={onQuickChange}
          {...rowProps}
        />
      ];

      if (footable && footableColumns.length) {
        if (item.depth === 1) {
          doms.push(
            <TableRow
              {...itemProps}
              classnames={cx}
              checkOnItemClick={checkOnItemClick}
              key={`foot-${item.index}`}
              itemIndex={rowIndex}
              item={item}
              itemClassName={cx(
                rowClassNameExpr
                  ? filter(rowClassNameExpr, item.data)
                  : rowClassName
              )}
              columns={footableColumns}
              renderCell={renderCell}
              render={render}
              onAction={onAction}
              onCheck={onCheck}
              footableMode
              footableColSpan={columns.length}
              onQuickChange={onQuickChange}
              {...rowProps}
            />
          );
        }
      } else if (Array.isArray(item.data.children)) {
        // 嵌套表格
        doms.push(
          ...this.renderRows(item.children, columns, {
            ...rowProps,
            parent: item
          })
        );
      }
      return doms;
    });
  }

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
      renderHeadCell
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
                  >
                    {item.label ? render('tpl', item.label) : null}
                  </th>
                ))}
              </tr>
            ) : null}
            <tr className={hideHeader ? 'fake-hide' : ''}>
              {columns.map(column =>
                renderHeadCell(column, {
                  'data-index': column.index,
                  'key': column.index
                })
              )}
            </tr>
          </thead>
          <tbody>
            {rows.length ? (
              this.renderRows(rows, columns)
            ) : (
              <tr className={cx('Table-placeholder')}>
                <td colSpan={columns.length}>
                  {render('placeholder', placeholder || '暂无数据')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
}
