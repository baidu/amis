import {observer} from 'mobx-react';
import React from 'react';
import type {IColumn, IRow} from 'amis-core/lib/store/table';
import {RendererEvent, RendererProps} from 'amis-core';
import {Action} from '../Action';
import {isClickOnInput, createObject} from 'amis-core';

interface TableRowProps extends Pick<RendererProps, 'render'> {
  onCheck: (item: IRow) => Promise<void>;
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
  classPrefix: string;
  renderCell: (
    region: string,
    column: IColumn,
    item: IRow,
    props: any
  ) => React.ReactNode;
  columns: Array<IColumn>;
  item: IRow;
  parent?: IRow;
  itemClassName?: string;
  itemIndex: number;
  regionPrefix?: string;
  checkOnItemClick?: boolean;
  ignoreFootableContent?: boolean;
  [propName: string]: any;
}

@observer
export class TableRow extends React.Component<TableRowProps> {
  // reaction?: () => void;
  constructor(props: TableRowProps) {
    super(props);
    this.handleAction = this.handleAction.bind(this);
    this.handleQuickChange = this.handleQuickChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleDbClick = this.handleDbClick.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  handleMouseEnter(e: React.MouseEvent<HTMLTableRowElement>) {
    const {item, itemIndex, onRowMouseEnter} = this.props;
    onRowMouseEnter?.(item?.data, itemIndex);
  }

  handleMouseLeave(e: React.MouseEvent<HTMLTableRowElement>) {
    const {item, itemIndex, onRowMouseLeave} = this.props;
    onRowMouseLeave?.(item?.data, itemIndex);
  }

  // 定义点击一行的行为，通过 itemAction配置
  async handleItemClick(e: React.MouseEvent<HTMLTableRowElement>) {
    if (isClickOnInput(e)) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    const {itemAction, onAction, item, itemIndex, onCheck, onRowClick} =
      this.props;

    const rendererEvent = await onRowClick?.(item?.data, itemIndex);

    if (rendererEvent?.prevented) {
      return;
    }

    if (itemAction) {
      onAction && onAction(e, itemAction, item?.locals);
      // item.toggle();
    } else {
      if (item.checkable && item.isCheckAvaiableOnClick) {
        onCheck?.(item);
      }
    }
  }

  handleDbClick(e: React.MouseEvent<HTMLTableRowElement>) {
    const {item, itemIndex, onRowDbClick} = this.props;
    onRowDbClick?.(item?.data, itemIndex);
  }

  handleAction(e: React.UIEvent<any>, action: Action, ctx: any) {
    const {onAction, item} = this.props;
    onAction && onAction(e, action, ctx || item.locals);
  }

  handleQuickChange(
    values: object,
    saveImmediately?: boolean,
    savePristine?: boolean,
    options?: {
      resetOnFailed?: boolean;
      reload?: string;
    }
  ) {
    const {onQuickChange, item} = this.props;
    onQuickChange &&
      onQuickChange(item, values, saveImmediately, savePristine, options);
  }

  handleChange(
    value: any,
    name: string,
    submit?: boolean,
    changePristine?: boolean
  ) {
    if (!name || typeof name !== 'string') {
      return;
    }

    const {item, onQuickChange} = this.props;

    onQuickChange?.(
      item,
      {
        [name]: value
      },
      submit,
      changePristine
    );
  }

  render() {
    const {
      itemClassName,
      itemIndex,
      item,
      columns,
      renderCell,
      children,
      footableMode,
      ignoreFootableContent,
      footableColSpan,
      regionPrefix,
      checkOnItemClick,
      classPrefix: ns,
      render,
      classnames: cx,
      parent,
      itemAction,
      onEvent,
      ...rest
    } = this.props;

    if (footableMode) {
      if (!item.expanded) {
        return null;
      }

      return (
        <tr
          data-id={item.id}
          data-index={item.newIndex}
          onClick={
            checkOnItemClick || itemAction || onEvent?.rowClick
              ? this.handleItemClick
              : undefined
          }
          onDoubleClick={this.handleDbClick}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          className={cx(itemClassName, {
            'is-hovered': item.isHover,
            'is-checked': item.checked,
            'is-modified': item.modified,
            'is-moved': item.moved,
            [`Table-tr--hasItemAction`]: itemAction, // 就是为了加鼠标效果
            [`Table-tr--odd`]: itemIndex % 2 === 0,
            [`Table-tr--even`]: itemIndex % 2 === 1
          })}
        >
          <td className={cx(`Table-foot`)} colSpan={footableColSpan}>
            <table className={cx(`Table-footTable`)}>
              <tbody>
                {ignoreFootableContent
                  ? columns.map(column => (
                      <tr key={column.index}>
                        {column.label !== false ? <th></th> : null}
                        <td></td>
                      </tr>
                    ))
                  : columns.map(column => (
                      <tr key={column.index}>
                        {column.label !== false ? (
                          <th>
                            {render(
                              `${regionPrefix}${itemIndex}/${column.index}/tpl`,
                              column.label
                            )}
                          </th>
                        ) : null}

                        {renderCell(
                          `${regionPrefix}${itemIndex}/${column.index}`,
                          column,
                          item,
                          {
                            ...rest,
                            width: null,
                            rowIndex: itemIndex,
                            colIndex: column.index,
                            key: column.index,
                            onAction: this.handleAction,
                            onQuickChange: this.handleQuickChange,
                            onChange: this.handleChange
                          }
                        )}
                      </tr>
                    ))}
              </tbody>
            </table>
          </td>
        </tr>
      );
    }

    if (parent && !parent.expanded) {
      return null;
    }

    return (
      <tr
        onClick={
          checkOnItemClick || itemAction || onEvent?.rowClick
            ? this.handleItemClick
            : undefined
        }
        onDoubleClick={this.handleDbClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        data-index={item.depth === 1 ? item.newIndex : undefined}
        data-id={item.id}
        className={cx(
          itemClassName,
          {
            'is-hovered': item.isHover,
            'is-checked': item.checked,
            'is-modified': item.modified,
            'is-moved': item.moved,
            'is-expanded': item.expanded && item.expandable,
            'is-expandable': item.expandable,
            [`Table-tr--hasItemAction`]: itemAction,
            [`Table-tr--odd`]: itemIndex % 2 === 0,
            [`Table-tr--even`]: itemIndex % 2 === 1
          },
          `Table-tr--${item.depth}th`
        )}
      >
        {columns.map(column =>
          renderCell(`${itemIndex}/${column.index}`, column, item, {
            ...rest,
            rowIndex: itemIndex,
            colIndex: column.index,
            key: column.index,
            onAction: this.handleAction,
            onQuickChange: this.handleQuickChange,
            onChange: this.handleChange
          })
        )}
      </tr>
    );
  }
}
