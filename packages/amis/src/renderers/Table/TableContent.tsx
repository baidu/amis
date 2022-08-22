import React from 'react';
import {
  ClassNamesFn,
  ITableStore,
  SchemaNode,
  ActionObject,
  LocaleProps,
  OnEventProps
} from 'amis-core';
import {TableBody} from './TableBody';
import {observer} from 'mobx-react';
import {ActionSchema} from '../Action';
import ItemActionsWrapper from './ItemActionsWrapper';
import {SchemaTpl} from '../../Schema';
import {Icon} from 'amis-ui';

import type {IColumn, IRow} from 'amis-core/lib/store/table';

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
  placeholder?: string | SchemaTpl;
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
}

@observer
export class TableContent extends React.Component<TableContentProps> {
  renderItemActions() {
    const {itemActions, render, store, classnames: cx} = this.props;
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
      loading
    } = this.props;

    const tableClassName = cx('Table-table', this.props.tableClassName);
    const hideHeader = columns.every(column => !column.label);

    return (
      <div
        onMouseMove={onMouseMove}
        className={cx('Table-content', className)}
        onScroll={onScroll}
      >
        {store.hoverRow ? this.renderItemActions() : null}
        <table ref={tableRef} className={tableClassName}>
          <thead>
            {columnsGroup.length ? (
              <tr>
                {columnsGroup.map((item, index) =>
                  /**
                   * 勾选列和展开列的表头单独成列
                   * 如果分组列只有一个元素且未分组时，也要执行表头合并
                   */
                  !!~['__checkme', '__expandme'].indexOf(item.has[0].type) ||
                  (item.has.length === 1 &&
                    !/^__/.test(item.has[0].type) &&
                    !item.has[0].groupName) ? (
                    renderHeadCell(item.has[0], {
                      'data-index': item.has[0].index,
                      'key': index,
                      'colSpan': item.colSpan,
                      'rowSpan': item.rowSpan
                    })
                  ) : (
                    <th
                      key={index}
                      data-index={item.index}
                      colSpan={item.colSpan}
                      rowSpan={item.rowSpan}
                    >
                      {item.label ? render('tpl', item.label) : null}
                    </th>
                  )
                )}
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
              prefixRowClassName={prefixRowClassName}
              affixRowClassName={affixRowClassName}
              rows={rows}
              columns={columns}
              locale={locale}
              translate={translate}
              prefixRow={prefixRow}
              affixRow={affixRow}
              data={data}
              rowsProps={{
                data,
                dispatchEvent,
                onEvent
              }}
            />
          )}
        </table>
      </div>
    );
  }
}
