import React from 'react';
import {ClassNamesFn} from '../../theme';
import {IColumn, IRow} from '../../store/table';
import {SchemaNode, Action} from '../../types';
import {TableRow} from './TableRow';
import {filter} from '../../utils/tpl';
import {observer} from 'mobx-react';
import {trace, reaction} from 'mobx';
import {flattenTree} from '../../utils/helper';

export interface TableBodyProps {
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
  footableColumns: Array<IColumn>;
  checkOnItemClick?: boolean;
  buildItemProps?: (item: IRow, index: number) => any;
  onAction?: (e: React.UIEvent<any>, action: Action, ctx: object) => void;
  rowClassNameExpr?: string;
  rowClassName?: string;
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
      props.buildItemProps !== nextProps.buildItemProps
    ) {
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

  render() {
    const {
      placeholder,
      classnames: cx,
      className,
      render,
      rows,
      columns,
      rowsProps
    } = this.props;

    return (
      <tbody className={className}>
        {rows.length ? (
          this.renderRows(rows, columns, rowsProps)
        ) : (
          <tr className={cx('Table-placeholder')}>
            <td colSpan={columns.length}>
              {render('placeholder', placeholder || '暂无数据')}
            </td>
          </tr>
        )}
      </tbody>
    );
  }
}
