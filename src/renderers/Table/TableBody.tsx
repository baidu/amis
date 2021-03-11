import React from 'react';
import {ClassNamesFn} from '../../theme';
import {IColumn, IRow} from '../../store/table';
import {SchemaNode, Action} from '../../types';
import {TableRow} from './TableRow';
import {filter} from '../../utils/tpl';
import {observer} from 'mobx-react';
import {trace, reaction} from 'mobx';
import {createObject, flattenTree} from '../../utils/helper';
import {LocaleProps} from '../../locale';

export interface TableBodyProps extends LocaleProps {
  className?: string;
  rowsProps?: any;
  tableClassName?: string;
  classnames: ClassNamesFn;
  columns: Array<IColumn>;
  rows: Array<IRow>;
  placeholder?: string;
  render: (region: string, node: SchemaNode, props?: any) => JSX.Element;
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
  ignoreFootableContent?: boolean;
  footableColumns: Array<IColumn>;
  checkOnItemClick?: boolean;
  buildItemProps?: (item: IRow, index: number) => any;
  onAction?: (e: React.UIEvent<any>, action: Action, ctx: object) => void;
  rowClassNameExpr?: string;
  rowClassName?: string;
  data?: any;
  prefixRow?: Array<any>;
  affixRow?: Array<any>;
}

export class TableBody extends React.Component<TableBodyProps> {
  reaction?: () => void;
  constructor(props: TableBodyProps) {
    super(props);

    const rows = props.rows;

    this.reaction = reaction(
      () =>
        `${flattenTree(rows)
          .map(item => `${item.id}`)
          .join(',')}${rows
          .filter(item => item.checked)
          .map(item => item.id)
          .join(',')}`,
      () => this.forceUpdate(),
      {
        onError: () => this.reaction!()
      }
    );
  }

  shouldComponentUpdate(nextProps: TableBodyProps) {
    const props = this.props;

    if (
      props.columns !== nextProps.columns ||
      props.buildItemProps !== nextProps.buildItemProps ||
      props.prefixRow ||
      props.affixRow
    ) {
      return true;
    }

    return false;
  }

  componentWillUnmount() {
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
      ignoreFootableContent,
      footableColumns
    } = this.props;

    return rows.map((item: IRow, rowIndex: number) => {
      const itemProps = buildItemProps ? buildItemProps(item, rowIndex) : null;

      const doms = [
        <TableRow
          {...itemProps}
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
      } else if (item.children.length) {
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

  renderSummaryRow(items?: Array<any>) {
    const {columns, render, data, classnames: cx, rows} = this.props;

    if (!(Array.isArray(items) && items.length)) {
      return null;
    }

    const filterColumns = columns.filter(item => item.toggable);
    const result: any[] = [];

    for (let index = 0; index < filterColumns.length; index++) {
      const item = items[filterColumns[index].rawIndex];
      item && result.push(item);
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
      <tr className={cx('Table-tr', 'is-summary')}>
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

  renderSummary(items?: Array<any>) {
    return Array.isArray(items)
      ? items.some(i => Array.isArray(i))
        ? items.map(i => this.renderSummaryRow(Array.isArray(i) ? i : [i]))
        : this.renderSummaryRow(items)
      : null;
  }

  render() {
    const {
      placeholder,
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
            {this.renderSummary(prefixRow)}
            {this.renderRows(rows, columns, rowsProps)}
            {this.renderSummary(affixRow)}
          </>
        ) : (
          <tr className={cx('Table-placeholder')}>
            <td colSpan={columns.length}>
              {render('placeholder', __(placeholder || 'placeholder.noData'))}
            </td>
          </tr>
        )}
      </tbody>
    );
  }
}
