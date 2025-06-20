import React from 'react';
import {ClassNamesFn, RendererEvent, autobind} from 'amis-core';

import {SchemaNode, ActionObject} from 'amis-core';
import TableRow from './TableRow';
import {filter} from 'amis-core';
import {observer} from 'mobx-react';
import {createObject} from 'amis-core';
import {LocaleProps} from 'amis-core';
import {ActionSchema} from '../Action';
import type {IColumn, IRow, ITableStore, TestIdBuilder} from 'amis-core';
import flatten from 'lodash/flatten';
import VirtualTableBody from './VirtualTableBody';

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
  testIdBuilder?: TestIdBuilder;
}

@observer
export class TableBody<
  T extends TableBodyProps = TableBodyProps
> extends React.Component<T> {
  componentDidMount(): void {
    this.props.store.initTableWidth();
  }

  @autobind
  testIdBuilder(rowPath: string) {
    return this.props.testIdBuilder?.getChild(`row-${rowPath}`);
  }

  renderRows(
    rows: Array<any>,
    columns = this.props.columns,
    rowProps: any = {},
    indexPath?: string
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
      const rowPath = `${indexPath ? indexPath + '/' : ''}${rowIndex}`;

      const doms = [
        <TableRow
          {...itemProps}
          testIdBuilder={this.testIdBuilder}
          store={store}
          itemAction={itemAction}
          classnames={cx}
          checkOnItemClick={checkOnItemClick}
          key={item.id}
          itemIndex={rowIndex}
          rowPath={rowPath}
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
              rowPath={rowPath}
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
              testIdBuilder={this.testIdBuilder}
            />
          );
        }
      } else if (item.children.length && item.expanded) {
        // 嵌套表格
        doms.push(
          ...this.renderRows(
            item.children,
            columns,
            {
              ...rowProps,
              parent: item
            },
            rowPath
          )
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
    const result: Array<{
      colSpan?: number;
      firstColumn: IColumn;
      lastColumn: IColumn;
      [propName: string]: any;
    }> = items
      .map((item, index) => {
        const colIdxs: number[] = [offset + index];
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

    //  如果是勾选栏，或者是展开栏，或者是拖拽栏
    // 临时补一个空格，这样不会跟功能栏冲突
    if (
      result[0] &&
      typeof columns[0]?.type === 'string' &&
      columns[0]?.type.substring(0, 2) === '__'
    ) {
      result.unshift({
        firstColumn: columns[0],
        lastColumn: columns[0],
        colSpan: 1,
        text: ' ',
        type: 'text'
      });
      // result[0].firstColumn = columns[0];
      // result[0].colSpan = (result[0].colSpan || 1) + 1;
    }

    // 缺少的单元格补齐
    const resultLen = result.reduce((p, c) => p + (c.colSpan || 1), 0);
    let appendLen = columns.length - resultLen;

    // 多了则干掉一些
    while (appendLen < 0) {
      const item = result.pop();
      if (!item) {
        break;
      }
      appendLen += item.colSpan || 1;
    }

    // 少了则补个空的
    // 只补空的时，当存在fixed:right时会导致样式有问题 会把其他列的盖住
    if (appendLen) {
      const item = {
        type: 'html',
        html: '&nbsp;'
      };

      for (let i = resultLen; i < store.filteredColumns.length; i++) {
        const column = store.filteredColumns[i];

        result.push({
          ...item,
          colSpan: 1,
          firstColumn: column,
          lastColumn: column
        });
      }
    }

    const ctx = createObject(data, {
      items: rows.map(row => row.locals)
    });

    return (
      <tr
        className={cx(
          'Table-table-tr',
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
          if (item.vAlign) {
            style.verticalAlign = item.vAlign;
          }
          const [stickyStyle, stickyClassName] = store.getStickyStyles(
            lastColumn.fixed === 'right' ? lastColumn : firstColumn,
            store.filteredColumns,
            item.colSpan
          );
          Object.assign(style, stickyStyle);

          return (
            <Com
              key={index}
              colSpan={item.colSpan == 1 ? undefined : item.colSpan}
              style={style}
              className={(item.cellClassName || '') + ' ' + stickyClassName}
            >
              {render(`summary-row/${index}`, item as any, {
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
      store,
      rows,
      columns,
      rowsProps,
      prefixRow,
      affixRow,
      translate: __
    } = this.props;

    const doms: React.ReactNode[] = flatten(
      []
        .concat(this.renderSummary('prefix', prefixRow) as any)
        .concat(this.renderRows(rows, columns, rowsProps) as any)
        .concat(this.renderSummary('affix', affixRow) as any)
    ).filter(Boolean);

    return rows.length > store.lazyRenderAfter ? (
      <VirtualTableBody rows={doms} store={this.props.store} />
    ) : (
      <tbody className={className}>{doms}</tbody>
    );
  }
}
