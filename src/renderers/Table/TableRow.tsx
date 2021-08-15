import {observer} from 'mobx-react';
import React from 'react';
import {IRow, IColumn} from '../../store/table';
import {RendererProps} from '../../factory';
import {Action} from '../Action';
import {reaction} from 'mobx';

interface TableRowProps extends Pick<RendererProps, 'render'> {
  onCheck: (item: IRow) => void;
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
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e: React.MouseEvent<HTMLTableRowElement>) {
    const target: HTMLElement = e.target as HTMLElement;
    const ns = this.props.classPrefix;
    let formItem;

    if (
      !e.currentTarget.contains(target) ||
      ~['INPUT', 'TEXTAREA'].indexOf(target.tagName) ||
      ((formItem = target.closest(`button, a, [data-role="form-item"]`)) &&
        e.currentTarget.contains(formItem))
    ) {
      return;
    }

    this.props.onCheck(this.props.item);
  }

  handleAction(e: React.UIEvent<any>, action: Action, ctx: any) {
    const {onAction, item} = this.props;
    onAction && onAction(e, action, ctx || item.data);
  }

  handleQuickChange(
    values: object,
    saveImmediately?: boolean,
    savePristine?: boolean,
    resetOnFailed?: boolean
  ) {
    const {onQuickChange, item} = this.props;
    onQuickChange &&
      onQuickChange(item, values, saveImmediately, savePristine, resetOnFailed);
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
      ...rest
    } = this.props;

    // console.log('TableRow');

    if (footableMode) {
      if (!item.expanded) {
        return null;
      }

      return (
        <tr
          data-id={item.id}
          data-index={item.newIndex}
          onClick={checkOnItemClick ? this.handleClick : undefined}
          className={cx(itemClassName, {
            'is-hovered': item.isHover,
            'is-checked': item.checked,
            'is-modified': item.modified,
            'is-moved': item.moved,
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
        onClick={checkOnItemClick ? this.handleClick : undefined}
        data-index={item.depth === 1 ? item.newIndex : undefined}
        data-id={item.id}
        className={cx(
          itemClassName,
          {
            'is-hovered': item.isHover,
            'is-checked': item.checked,
            'is-modified': item.modified,
            'is-moved': item.moved,
            'is-expanded': item.expanded,
            'is-expandable': item.expandable,
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
