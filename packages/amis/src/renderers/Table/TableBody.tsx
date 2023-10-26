import React from 'react';
import {ClassNamesFn, RendererEvent} from 'amis-core';

import {SchemaNode, ActionObject} from 'amis-core';
import TableRow from './TableRow';
import {filter} from 'amis-core';
import {observer} from 'mobx-react';
import {trace, reaction} from 'mobx';
import {createObject, flattenTree} from 'amis-core';
import {LocaleProps} from 'amis-core';
import {ActionSchema} from '../Action';
import type {IColumn, IRow, ITableStore} from 'amis-core';

export interface TableBodyProps extends LocaleProps {
  store: ITableStore;
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
  onRowClick: (item: IRow, index: number) => Promise<RendererEvent<any> | void>;
  onRowDbClick: (
    item: IRow,
    index: number
  ) => Promise<RendererEvent<any> | void>;
  onRowMouseEnter: (
    item: IRow,
    index: number
  ) => Promise<RendererEvent<any> | void>;
  onRowMouseLeave: (
    item: IRow,
    index: number
  ) => Promise<RendererEvent<any> | void>;
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
  onAction?: (e: React.UIEvent<any>, action: ActionObject, ctx: object) => void;
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
  componentDidMount(): void {
    this.props.store.initTableWidth();
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
      ignoreFootableContent,
      footableColumns,
      itemAction,
      onRowClick,
      onRowDbClick,
      onRowMouseEnter,
      onRowMouseLeave,
      store
    } = this.props;

    return rows.map((item: IRow, rowIndex: number) => {
      const itemProps = buildItemProps ? buildItemProps(item, rowIndex) : null;
      const doms = [
        <TableRow
          {...itemProps}
          store={store}
          itemAction={itemAction}
          classnames={cx}
          checkOnItemClick={checkOnItemClick}
          key={item.id}
          itemIndex={rowIndex}
          item={item}
          itemClassName={cx(
            rowClassNameExpr
              ? filter(rowClassNameExpr, item.locals)
              : rowClassName,
            {
              'is-last':
                item.depth > 1 &&
                rowIndex === rows.length - 1 &&
                !item.children.length
            }
          )}
          columns={columns}
          renderCell={renderCell}
          render={render}
          onAction={onAction}
          onCheck={onCheck}
          // todo 先注释 quickEditEnabled={item.depth === 1}
          onQuickChange={onQuickChange}
          onRowClick={onRowClick}
          onRowDbClick={onRowDbClick}
          onRowMouseEnter={onRowMouseEnter}
          onRowMouseLeave={onRowMouseLeave}
          {...rowProps}
        />
      ];

      if (footable && footableColumns.length) {
        if (item.depth === 1) {
          doms.push(
            <TableRow
              {...itemProps}
              store={store}
              itemAction={itemAction}
              classnames={cx}
              checkOnItemClick={checkOnItemClick}
              key={`foot-${item.id}`}
              itemIndex={rowIndex}
              item={item}
              itemClassName={cx(
                rowClassNameExpr
                  ? filter(rowClassNameExpr, item.locals)
                  : rowClassName
              )}
              columns={footableColumns}
              renderCell={renderCell}
              render={render}
              onAction={onAction}
              onCheck={onCheck}
              onRowClick={onRowClick}
              onRowDbClick={onRowDbClick}
              onRowMouseEnter={onRowMouseEnter}
              onRowMouseLeave={onRowMouseLeave}
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
    items: Array<any>,
    rowIndex?: number
  ) {
    const {
      columns,
      render,
      data,
      classnames: cx,
      rows,
      prefixRowClassName,
      affixRowClassName,
      store
    } = this.props;

    if (!(Array.isArray(items) && items.length)) {
      return null;
    }

    let offset = 0;

    // 将列的隐藏对应的把总结行也隐藏起来
    const result: any[] = items
      .map((item, index) => {
        let colIdxs: number[] = [offset + index];
        if (item.colSpan > 1) {
          for (let i = 1; i < item.colSpan; i++) {
            colIdxs.push(offset + index + i);
          }
          offset += item.colSpan - 1;
        }

        const matchedColumns = colIdxs
          .map(idx => columns.find(col => col.rawIndex === idx))
          .filter(item => item);

        return {
          ...item,
          colSpan: matchedColumns.length,
          firstColumn: matchedColumns[0],
          lastColumn: matchedColumns[matchedColumns.length - 1]
        };
      })
      .filter(item => item.colSpan);

    //  如果是勾选栏，或者是展开栏，或者是拖拽栏，让它和下一列合并。
    if (
      result[0] &&
      typeof columns[0]?.type === 'string' &&
      columns[0]?.type.substring(0, 2) === '__'
    ) {
      result[0].colSpan = (result[0].colSpan || 1) + 1;
    }

    // 缺少的单元格补齐
    let appendLen =
      columns.length - result.reduce((p, c) => p + (c.colSpan || 1), 0);

    // 多了则干掉一些
    while (appendLen < 0) {
      const item = result.pop();
      if (!item) {
        break;
      }
      appendLen += item.colSpan || 1;
    }

    // 少了则补个空的
    if (appendLen) {
      const item = /*result.length
        ? result.pop()
        : */ {
        type: 'html',
        html: '&nbsp;'
      };
      const column = store.filteredColumns[store.filteredColumns.length - 1];
      result.push({
        ...item,
        colSpan: /*(item.colSpan || 1)*/ 1 + appendLen,
        firstColumn: column,
        lastColumn: column
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
          const firstColumn = item.firstColumn;
          const lastColumn = item.lastColumn;

          const style = {...item.style};
          if (item.align) {
            style.textAlign = item.align;
          }
          const [stickyStyle, stickyClassName] = store.getStickyStyles(
            lastColumn.fixed === 'right' ? lastColumn : firstColumn,
            store.filteredColumns
          );
          Object.assign(style, stickyStyle);

          return (
            <Com
              key={index}
              colSpan={item.colSpan == 1 ? undefined : item.colSpan}
              style={style}
              className={(item.cellClassName || '') + ' ' + stickyClassName}
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
