import {observer} from 'mobx-react';
import React from 'react';
import type {IColumn, IRow} from 'amis-core/lib/store/table';
import {
  ITableStore,
  RendererEvent,
  RendererProps,
  autobind,
  traceProps
} from 'amis-core';
import {Action} from '../Action';
import {isClickOnInput} from 'amis-core';
import {useInView} from 'react-intersection-observer';

interface TableRowProps extends Pick<RendererProps, 'render'> {
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
  [propName: string]: any;
}

export class TableRow extends React.PureComponent<
  TableRowProps & {
    // 这些属性纯粹是为了监控变化，不要在 render 里面使用
    expanded: boolean;
    parentExpanded?: boolean;
    id: string;
    newIndex: number;
    isHover: boolean;
    checked: boolean;
    modified: boolean;
    moved: boolean;
    depth: number;
    expandable: boolean;
    appeard?: boolean;
    loading?: boolean;
    error?: string;
    checkdisable: boolean;
    trRef?: React.Ref<any>;
    isNested?: boolean;
  }
> {
  @autobind
  handleMouseEnter(e: React.MouseEvent<HTMLTableRowElement>) {
    const {item, itemIndex, onRowMouseEnter} = this.props;
    onRowMouseEnter?.(item?.data, itemIndex);
  }

  @autobind
  handleMouseLeave(e: React.MouseEvent<HTMLTableRowElement>) {
    const {item, itemIndex, onRowMouseLeave} = this.props;
    onRowMouseLeave?.(item?.data, itemIndex);
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
        onCheck?.(item, !item.checked, shiftKey);
      }
    }
  }

  @autobind
  handleDbClick(e: React.MouseEvent<HTMLTableRowElement>) {
    const {item, itemIndex, onRowDbClick} = this.props;
    onRowDbClick?.(item?.data, itemIndex);
  }

  @autobind
  handleAction(e: React.UIEvent<any>, action: Action, ctx: any) {
    const {onAction, item} = this.props;
    onAction && onAction(e, action, ctx || item.locals);
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
      appeard,
      checkdisable,
      trRef,
      isNested,

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

                        {appeard ? (
                          renderCell(
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
                          )
                        ) : (
                          <td key={column.index}>
                            <div className={cx('Table-emptyBlock')}>&nbsp;</div>
                          </td>
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
      >
        {columns.map(column =>
          appeard ? (
            renderCell(`${itemIndex}/${column.index}`, column, item, {
              ...rest,
              rowIndex: itemIndex,
              colIndex: column.index,
              key: column.id,
              onAction: this.handleAction,
              onQuickChange: this.handleQuickChange,
              onChange: this.handleChange
            })
          ) : column.name && item.rowSpans[column.name] === 0 ? null : (
            <td key={column.id}>
              <div className={cx('Table-emptyBlock')}>&nbsp;</div>
            </td>
          )
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

  const {ref, inView} = useInView({
    threshold: 0,
    onChange: item.markAppeared,
    skip: !item.lazyRender
  });

  return (
    <TableRow
      {...props}
      trRef={ref}
      expanded={item.expanded}
      parentExpanded={parent?.expanded}
      id={item.id}
      newIndex={item.newIndex}
      isHover={item.isHover}
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
      appeard={item.lazyRender ? item.appeared || inView : true}
      isNested={store.isNested}
    />
  );
});
