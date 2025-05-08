import React from 'react';
import {
  ClassNamesFn,
  ITableStore,
  SchemaNode,
  ActionObject,
  LocaleProps,
  OnEventProps,
  RendererEvent
} from 'amis-core';
import {TableBody} from './TableBody';
import {observer} from 'mobx-react';
import {ActionSchema} from '../Action';
import ItemActionsWrapper from './ItemActionsWrapper';
import {SchemaTpl} from '../../Schema';
import {Icon} from 'amis-ui';

import type {IColumn, IRow, TestIdBuilder} from 'amis-core';
import ColGroup from './ColGroup';

export interface TableContentProps extends LocaleProps {
  className?: string;
  tableClassName?: string;
  classnames: ClassNamesFn;
  testIdBuilder?: TestIdBuilder;
  columns: Array<IColumn>;
  columnsGroup: Array<{
    label: string;
    index: number;
    colSpan: number;
    rowSpan: number;
    has: Array<any>;
  }>;
  rows: Array<IRow>;
  placeholder?: string | SchemaTpl;
  render: (region: string, node: SchemaNode, props?: any) => JSX.Element;
  onMouseMove?: (event: React.MouseEvent) => void;
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
  footableColumns: Array<IColumn>;
  checkOnItemClick?: boolean;
  buildItemProps?: (item: IRow, index: number) => any;
  onAction?: (e: React.UIEvent<any>, action: ActionObject, ctx: object) => void;
  rowClassNameExpr?: string;
  affixRowClassName?: string;
  prefixRowClassName?: string;
  rowClassName?: string;
  data?: any;
  prefixRow?: Array<any>;
  affixRow?: Array<any>;
  itemAction?: ActionSchema;
  itemActions?: Array<ActionObject>;
  store: ITableStore;
  dispatchEvent?: Function;
  onEvent?: OnEventProps;
  loading?: boolean;
  columnWidthReady?: boolean;

  // 以下纯粹是为了监控
  someChecked?: boolean;
  allChecked?: boolean;
  isSelectionThresholdReached?: boolean;
  orderBy?: string;
  orderDir?: string;
  children?: React.ReactNode;
}

export function renderItemActions(
  props: Pick<
    TableContentProps,
    'itemActions' | 'render' | 'store' | 'classnames'
  >
) {
  const {itemActions, render, store, classnames: cx} = props;

  if (!store.hoverRow) {
    return null;
  }

  const finalActions = Array.isArray(itemActions)
    ? itemActions.filter(action => !action.hiddenOnHover)
    : [];

  if (!finalActions.length) {
    return null;
  }

  return (
    <ItemActionsWrapper store={store} classnames={cx}>
      <div className={cx('Table-itemActions')}>
        {finalActions.map((action, index) =>
          render(
            `itemAction/${index}`,
            {
              ...(action as any),
              isMenuItem: true
            },
            {
              key: index,
              item: store.hoverRow,
              data: store.hoverRow!.locals,
              rowIndex: store.hoverRow!.index
            }
          )
        )}
      </div>
    </ItemActionsWrapper>
  );
}

export class TableContent<
  T extends TableContentProps = TableContentProps
> extends React.PureComponent<T> {
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
      onRowClick,
      onRowDbClick,
      onRowMouseEnter,
      onRowMouseLeave,
      rowClassName,
      onQuickChange,
      footable,
      footableColumns,
      checkOnItemClick,
      buildItemProps,
      onAction,
      rowClassNameExpr,
      affixRowClassName,
      prefixRowClassName,
      data,
      prefixRow,
      locale,
      translate,
      itemAction,
      affixRow,
      store,
      dispatchEvent,
      onEvent,
      loading,
      testIdBuilder,
      children
    } = this.props;

    const tableClassName = cx('Table-table', this.props.tableClassName);
    const hideHeader = columns.every(column => !column.label);

    return (
      <div
        onMouseMove={onMouseMove}
        className={cx('Table-content', className)}
        onScroll={onScroll}
      >
        <table ref={tableRef} className={cx(tableClassName)}>
          <ColGroup columns={columns} store={store} />
          <thead>
            {columnsGroup.length ? (
              <tr>
                {columnsGroup.map((item, index) => {
                  const [stickyStyle, stickyClassName] = store.getStickyStyles(
                    item as any,
                    columnsGroup as any
                  );

                  /**
                   * 勾选列和展开列的表头单独成列
                   * 如果分组列只有一个元素且未分组时，也要执行表头合并
                   */
                  return !!~['__checkme', '__expandme'].indexOf(
                    item.has[0].type
                  ) ||
                    (item.has.length === 1 &&
                      !/^__/.test(item.has[0].type) &&
                      !item.has[0].groupName) ? (
                    renderHeadCell(item.has[0], {
                      'data-index': item.has[0].index,
                      'key': index,
                      'colSpan': item.colSpan,
                      'rowSpan': item.rowSpan,
                      'style': stickyStyle,
                      'className': stickyClassName
                    })
                  ) : (
                    <th
                      key={index}
                      data-index={item.index}
                      colSpan={item.colSpan}
                      rowSpan={item.rowSpan}
                      style={stickyStyle}
                      className={stickyClassName}
                    >
                      {item.label ? render('tpl', item.label) : null}
                    </th>
                  );
                })}
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
                {!loading ? (
                  <td colSpan={columns.length}>
                    {typeof placeholder === 'string' ? (
                      <>
                        <Icon
                          icon="desk-empty"
                          className={cx('Table-placeholder-empty-icon', 'icon')}
                        />
                        {translate(placeholder || 'placeholder.noData')}
                      </>
                    ) : (
                      render(
                        'placeholder',
                        translate(placeholder || 'placeholder.noData')
                      )
                    )}
                  </td>
                ) : null}
              </tr>
            </tbody>
          ) : (
            <TableBody
              store={store}
              itemAction={itemAction}
              classnames={cx}
              render={render}
              renderCell={renderCell}
              onCheck={onCheck}
              onRowClick={onRowClick}
              onRowDbClick={onRowDbClick}
              onRowMouseEnter={onRowMouseEnter}
              onRowMouseLeave={onRowMouseLeave}
              onQuickChange={onQuickChange}
              footable={footable}
              footableColumns={footableColumns}
              checkOnItemClick={checkOnItemClick}
              buildItemProps={buildItemProps}
              onAction={onAction}
              rowClassNameExpr={rowClassNameExpr}
              rowClassName={rowClassName}
              prefixRowClassName={prefixRowClassName}
              affixRowClassName={affixRowClassName}
              rows={rows}
              columns={columns}
              locale={locale}
              translate={translate}
              prefixRow={prefixRow}
              affixRow={affixRow}
              data={data}
              testIdBuilder={testIdBuilder}
              rowsProps={{
                dispatchEvent,
                onEvent
              }}
            />
          )}
        </table>
        {children}
      </div>
    );
  }
}

export default observer((props: TableContentProps) => {
  const store = props.store;

  // 分析 table/index.tsx 中的 renderHeadCell 依赖了以下属性
  // store.someChecked;
  // store.allChecked;
  // store.isSelectionThresholdReached;
  // store.allExpanded;
  // store.orderBy
  // store.orderDir
  let className = props.classnames(
    props.className,
    store.rows.length > store.lazyRenderAfter ? 'use-virtual-list' : ''
  );
  let tableClassName = props.classnames(
    props.tableClassName,
    store.tableLayout === 'fixed' ? 'is-layout-fixed' : undefined
  );

  return (
    <TableContent
      {...props}
      className={className}
      tableClassName={tableClassName}
      columnWidthReady={store.columnWidthReady}
      someChecked={store.someChecked}
      allChecked={store.allChecked}
      isSelectionThresholdReached={store.isSelectionThresholdReached}
      orderBy={store.orderBy}
      orderDir={store.orderDir}
    />
  );
});
