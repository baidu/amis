import {observer} from 'mobx-react';
import React from 'react';
import type {IColumn, IRow} from 'amis-core/lib/store/table';
import {
  ITableStore,
  RendererEvent,
  RendererProps,
  TestIdBuilder,
  autobind,
  keyToPath,
  setVariable,
  traceProps
} from 'amis-core';
import {Action} from '../Action';
import {isClickOnInput} from 'amis-core';
import {useInView} from 'react-intersection-observer';

export interface TableRowProps extends Pick<RendererProps, 'render'> {
  store: ITableStore;
  onCheck: (item: IRow, value: boolean, shift?: boolean) => Promise<void>;
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
  testIdBuilder?: (key: string) => TestIdBuilder;
  rowPath: string; // 整体行的路径，树形时需要父行序号/当前展开层级下的行序号
  [propName: string]: any;
}

export class TableRow<
  T extends TableRowProps = TableRowProps
> extends React.PureComponent<
  T & {
    // 这些属性纯粹是为了监控变化，不要在 render 里面使用
    expanded: boolean;
    parentExpanded?: boolean;
    id: string;
    newIndex: number;
    isHover: boolean;
    checked: boolean;
    partial?: boolean;
    modified: boolean;
    moved: boolean;
    depth: number;
    expandable: boolean;
    loading?: boolean;
    error?: string;
    checkdisable: boolean;
    trRef?: React.Ref<any>;
    isNested?: boolean;
    checkable?: boolean;
  }
> {
  @autobind
  handleMouseEnter(e: React.MouseEvent<HTMLTableRowElement>) {
    const {item, itemIndex, onRowMouseEnter} = this.props;
    onRowMouseEnter?.(item, itemIndex);
  }

  @autobind
  handleMouseLeave(e: React.MouseEvent<HTMLTableRowElement>) {
    const {item, itemIndex, onRowMouseLeave} = this.props;
    onRowMouseLeave?.(item, itemIndex);
  }

  // 定义点击一行的行为，通过 itemAction配置
  @autobind
  async handleItemClick(e: React.MouseEvent<HTMLTableRowElement>) {
    if (isClickOnInput(e)) {
      return;
    }

    const shiftKey = (e.nativeEvent as MouseEvent)?.shiftKey;

    e.preventDefault();
    e.stopPropagation();

    const {
      itemAction,
      onAction,
      item,
      itemIndex,
      onCheck,
      onRowClick,
      checkOnItemClick
    } = this.props;

    const rendererEvent = await onRowClick?.(item, itemIndex);

    if (rendererEvent?.prevented) {
      return;
    }

    if (itemAction) {
      onAction && onAction(e, itemAction, item?.locals);
      // item.toggle();
    } else {
      if (item.checkable && item.isCheckAvaiableOnClick && checkOnItemClick) {
        onCheck?.(item, !item.checked, shiftKey);
      }
    }
  }

  @autobind
  handleDbClick(e: React.MouseEvent<HTMLTableRowElement>) {
    const {item, itemIndex, onRowDbClick} = this.props;
    onRowDbClick?.(item, itemIndex);
  }

  @autobind
  handleAction(e: React.UIEvent<any>, action: Action, ctx: any) {
    const {onAction, item} = this.props;
    return onAction && onAction(e, action, ctx || item.locals);
  }

  @autobind
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

  @autobind
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
    const data: any = {};
    const keyPath = keyToPath(name);
    // 如果是带路径的值变化，最好是能保留原来的对象的其他属性
    if (keyPath.length > 1) {
      data[keyPath[0]] = {...item.data[keyPath[0]]};
    }
    setVariable(data, name, value);

    onQuickChange?.(item, data, submit, changePristine);
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

      expanded,
      parentExpanded,
      id,
      newIndex,
      isHover,
      checked,
      modified,
      moved,
      depth,
      expandable,
      checkdisable,
      trRef,
      isNested,
      checkable,
      testIdBuilder,
      rowPath,
      ...rest
    } = this.props;

    if (footableMode) {
      if (!expanded) {
        return null;
      }

      return (
        <tr
          ref={trRef}
          data-id={id}
          data-index={newIndex}
          onClick={
            checkOnItemClick || itemAction || onEvent?.rowClick
              ? this.handleItemClick
              : undefined
          }
          onDoubleClick={this.handleDbClick}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          className={cx('Table-table-tr', itemClassName, {
            'is-hovered': isHover,
            'is-checked': checked,
            'is-modified': modified,
            'is-moved': moved,
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
                      <tr key={column.id}>
                        {column.label !== false ? <th></th> : null}
                        <td></td>
                      </tr>
                    ))
                  : columns.map(column => (
                      <tr key={column.id}>
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
                            rowIndexPath: item.path,
                            colIndex: column.index,
                            rowPath,
                            key: column.id,
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
        ref={trRef}
        onClick={
          checkOnItemClick || itemAction || onEvent?.rowClick
            ? this.handleItemClick
            : undefined
        }
        onDoubleClick={this.handleDbClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        data-index={depth === 1 ? newIndex : undefined}
        data-id={id}
        className={cx(
          'Table-table-tr',
          itemClassName,
          {
            'is-hovered': isHover,
            'is-checked': checked,
            'is-modified': modified,
            'is-moved': moved,
            'is-expanded': expanded && expandable,
            'is-expandable': expandable,
            [`Table-tr--hasItemAction`]: itemAction,
            [`Table-tr--odd`]: itemIndex % 2 === 0,
            [`Table-tr--even`]: itemIndex % 2 === 1
          },
          `Table-tr--${depth}th`
        )}
        {...testIdBuilder?.(rowPath)?.getTestId()}
      >
        {columns.map(column =>
          renderCell(`${itemIndex}/${column.index}`, column, item, {
            ...rest,
            rowIndex: itemIndex,
            colIndex: column.index,
            rowIndexPath: item.path,
            rowPath,
            key: column.id,
            onAction: this.handleAction,
            onQuickChange: this.handleQuickChange,
            onChange: this.handleChange
          })
        )}
      </tr>
    );
  }
}

// 换成 mobx-react-lite 模式
export default observer((props: TableRowProps) => {
  const item = props.item;
  const parent = props.parent;
  const store = props.store;
  const columns = props.columns;
  const canAccessSuperData =
    store.canAccessSuperData ||
    columns.some(item => item.pristine.canAccessSuperData);

  return (
    <TableRow
      {...props}
      expanded={item.expanded}
      parentExpanded={parent?.expanded}
      id={item.id}
      newIndex={item.newIndex}
      isHover={item.isHover}
      partial={item.partial}
      checked={item.checked}
      modified={item.modified}
      moved={item.moved}
      depth={item.depth}
      expandable={item.expandable}
      checkdisable={item.checkdisable}
      loading={item.loading}
      error={item.error}
      // data 在 TableRow 里面没有使用，这里写上是为了当列数据变化的时候 TableRow 重新渲染，
      // 不是 item.locals 的原因是 item.locals 会变化多次，比如父级上下文变化也会进来，但是 item.data 只会变化一次。
      data={canAccessSuperData ? item.locals : item.data}
      isNested={store.isNested}
      checkable={item.checkable}
    />
  );
});
