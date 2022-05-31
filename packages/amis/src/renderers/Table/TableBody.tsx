import React from 'react';
import {ClassNamesFn} from 'amis-core';

import {SchemaNode, Action} from 'amis-core';
import {TableRow} from './TableRow';
import {filter} from 'amis-core';
import {observer} from 'mobx-react';
import {trace, reaction} from 'mobx';
import {createObject, flattenTree} from 'amis-core';
import {LocaleProps} from 'amis-core';
import {ActionSchema} from '../Action';
import type {IColumn, IRow} from 'amis-core/lib/store/table';

export interface TableBodyProps extends LocaleProps {
  className?: string;
  rowsProps?: any;
  tableClassName?: string;
  classnames: ClassNamesFn;
  columns: Array<IColumn>;
  rows: Array<IRow>;
  render: (region: string, node: SchemaNode, props?: any) => JSX.Element;
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
  ignoreFootableContent?: boolean;
  footableColumns: Array<IColumn>;
  checkOnItemClick?: boolean;
  buildItemProps?: (item: IRow, index: number) => any;
  onAction?: (e: React.UIEvent<any>, action: Action, ctx: object) => void;
  rowClassNameExpr?: string;
  rowClassName?: string;
  affixRowClassName?: string;
  prefixRowClassName?: string;
  data?: any;
  prefixRow?: Array<any>;
  affixRow?: Array<any>;
  itemAction?: ActionSchema;
}

@observer
export class TableBody extends React.Component<TableBodyProps> {
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
      ignoreFootableContent,
      footableColumns,
      itemAction
    } = this.props;

    return rows.map((item: IRow, rowIndex: number) => {
      const itemProps = buildItemProps ? buildItemProps(item, rowIndex) : null;

      const doms = [
        <TableRow
          {...itemProps}
          itemAction={itemAction}
          classnames={cx}
          checkOnItemClick={checkOnItemClick}
          key={item.id}
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
              itemAction={itemAction}
              classnames={cx}
              checkOnItemClick={checkOnItemClick}
              key={`foot-${item.id}`}
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
              ignoreFootableContent={ignoreFootableContent}
              {...rowProps}
            />
          );
        }
      } else if (item.children.length && item.expanded) {
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

  renderSummaryRow(
    position: 'prefix' | 'affix',
    items?: Array<any>,
    rowIndex?: number
  ) {
    const {
      columns,
      render,
      data,
      classnames: cx,
      rows,
      prefixRowClassName,
      affixRowClassName
    } = this.props;

    if (!(Array.isArray(items) && items.length)) {
      return null;
    }

    const filterColumns = columns.filter(item => item.toggable);
    const result: any[] = [];

    for (let index = 0; index < filterColumns.length; index++) {
      const item = items[filterColumns[index].rawIndex];
      item && result.push({...item});
    }

    //  如果是勾选栏，让它和下一列合并。
    if (columns[0].type === '__checkme' && result[0]) {
      result[0].colSpan = (result[0].colSpan || 1) + 1;
    }

    //  如果是展开栏，让它和下一列合并。
    if (columns[0].type === '__expandme' && result[0]) {
      result[0].colSpan = (result[0].colSpan || 1) + 1;
    }

    // 缺少的单元格补齐
    const appendLen =
      columns.length - result.reduce((p, c) => p + (c.colSpan || 1), 0);

    if (appendLen) {
      const item = result.pop();
      result.push({
        ...item,
        colSpan: (item.colSpan || 1) + appendLen
      });
    }
    const ctx = createObject(data, {
      items: rows.map(row => row.locals)
    });

    return (
      <tr
        className={cx(
          'Table-tr',
          'is-summary',
          position === 'prefix' ? prefixRowClassName : '',
          position === 'affix' ? affixRowClassName : ''
        )}
        key={`summary-${position}-${rowIndex || 0}`}
      >
        {result.map((item, index) => {
          const Com = item.isHead ? 'th' : 'td';
          return (
            <Com
              key={index}
              colSpan={item.colSpan}
              className={item.cellClassName}
            >
              {render(`summary-row/${index}`, item, {
                data: ctx
              })}
            </Com>
          );
        })}
      </tr>
    );
  }

  renderSummary(position: 'prefix' | 'affix', items?: Array<any>) {
    return Array.isArray(items)
      ? items.some(i => Array.isArray(i))
        ? items.map((i, rowIndex) =>
            this.renderSummaryRow(
              position,
              Array.isArray(i) ? i : [i],
              rowIndex
            )
          )
        : this.renderSummaryRow(position, items)
      : null;
  }

  render() {
    const {
      classnames: cx,
      className,
      render,
      rows,
      columns,
      rowsProps,
      prefixRow,
      affixRow,
      translate: __
    } = this.props;

    return (
      <tbody className={className}>
        {rows.length ? (
          <>
            {this.renderSummary('prefix', prefixRow)}
            {this.renderRows(rows, columns, rowsProps)}
            {this.renderSummary('affix', affixRow)}
          </>
        ) : null}
      </tbody>
    );
  }
}
