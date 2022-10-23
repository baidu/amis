import {BaseSelection, BaseSelectionProps} from './Selection';
import {noop, offset, themeable} from 'amis-core';
import React from 'react';
import {uncontrollable} from 'amis-core';
import Checkbox from './Checkbox';
import {Option} from './Select';
import {resolveVariable} from 'amis-core';
import {localeable} from 'amis-core';
import VirtualList, {AutoSizer, RenderedRows} from './virtual-list';
import {isEqual, forEach} from 'lodash';

export interface TableSelectionProps extends BaseSelectionProps {
  /** 是否为结果渲染列表 */
  resultMode?: boolean;
  columns: Array<{
    name: string;
    label: string;
    [propName: string]: any;
  }>;
  cellRender: (
    column: {
      name: string;
      label: string;
      [propName: string]: any;
    },
    option: Option,
    colIndex: number,
    rowIndex: number
  ) => JSX.Element;
}

export interface TableSelectionState {
  colsWidth: number[];
  tableWidth: number;
  rowRenderScope: null | RenderedRows;
}

export class TableSelection extends BaseSelection<TableSelectionProps, any> {
  static defaultProps = {
    ...BaseSelection.defaultProps,
    cellRender: (
      column: {
        name: string;
        label: string;
        [propName: string]: any;
      },
      option: Option,
      colIndex: number,
      rowIndex: number
    ) => <span>{resolveVariable(column.name, option)}</span>
  };

  constructor(props: TableSelectionProps) {
    super(props);

    this.state = {
      rowRenderScope: null,
      colsWidth: [],
      tableWidth: 0
    };
  }

  getColumns() {
    let columns = this.props.columns;

    if (!Array.isArray(columns) || !columns.length) {
      columns = [{label: 'Label', name: 'label'}];
    }
    return columns;
  }

  renderTHead() {
    const {
      options,
      classnames: cx,
      value,
      disabled,
      option2value,
      multiple
    } = this.props;
    let columns = this.getColumns();
    let valueArray = BaseSelection.value2array(value, options, option2value);
    const availableOptions = options.filter(option => !option.disabled);
    let partialChecked = false;
    let allChecked = !!availableOptions.length;

    availableOptions.forEach(option => {
      const isIn = !!~valueArray.indexOf(option);

      if (isIn && !partialChecked) {
        partialChecked = true;
      } else if (!isIn && allChecked) {
        allChecked = false;
      }
    });

    return (
      <>
        <thead>
          <tr>
            {multiple && Array.isArray(options) && options.length ? (
              <th data-index={0} className={cx('Table-checkCell')}>
                <Checkbox
                  key="checkbox"
                  size="sm"
                  disabled={disabled}
                  onChange={this.toggleAll}
                  checked={partialChecked}
                  partial={partialChecked && !allChecked}
                />
              </th>
            ) : null}
            {columns.map((column, index) => (
              <th data-index={index + 1} key={index}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
      </>
    );
  }

  renderTr({
    option,
    rowIndex,
    valueArray,
    columns,
    styles
  }: {
    option: any;
    rowIndex: number;
    valueArray: any[];
    columns: any[];
    styles?: object;
  }) {
    const {
      classnames: cx,
      cellRender,
      disabled,
      multiple,
      translate: __,
      itemClassName,
      resultMode
    } = this.props;

    const checked = valueArray.indexOf(option) !== -1;

    return (
      <tr
        style={styles ?? {}}
        key={rowIndex}
        /** 被ResultTableList引用，如果设置click事件，会导致错误删除结果列表的内容，先加一个开关判断 */
        onClick={
          resultMode
            ? noop
            : e => e.defaultPrevented || this.toggleOption(option)
        }
        className={cx(
          itemClassName,
          option.className,
          disabled || option.disabled ? 'is-disabled' : '',
          !!~valueArray.indexOf(option) ? 'is-active' : ''
        )}
      >
        {multiple ? (
          <td
            className={cx('Table-checkCell')}
            key="checkbox"
            onClick={e => {
              e.stopPropagation();
              this.toggleOption(option);
            }}
          >
            <Checkbox size="sm" checked={checked} disabled={disabled} />
          </td>
        ) : null}
        {columns.map((column, colIndex) => (
          <td key={colIndex}>
            {cellRender(column, option, colIndex, rowIndex)}
          </td>
        ))}
      </tr>
    );
  }

  renderTBody() {
    const {
      options,
      placeholder,
      value,
      option2value,
      translate: __
    } = this.props;
    const columns = this.getColumns();
    let valueArray = BaseSelection.value2array(value, options, option2value);

    return (
      <tbody>
        {Array.isArray(options) && options.length ? (
          options.map((option, rowIndex) =>
            this.renderTr({option, rowIndex, valueArray, columns})
          )
        ) : (
          <tr>
            <td colSpan={columns.length}>{__(placeholder)}</td>
          </tr>
        )}
      </tbody>
    );
  }

  ref: any;
  tableHeadRef(ref: any) {
    ref && (this.ref = ref);
  }

  handleVirtualTableResize({width}: {width: number}) {
    if (width && width === this.state.width) {
      return;
    }

    const widths: any = {};
    this.ref &&
      forEach(
        this.ref.querySelectorAll('thead>tr:last-child>th'),
        (item: HTMLElement) => {
          widths[item.getAttribute('data-index') as string] =
            item.getBoundingClientRect().width;
        }
      );

    const colsWidth: number[] = [];

    Object.keys(widths)
      .filter(key => !isNaN(Number(key)))
      .sort()
      .forEach(key => {
        colsWidth.push(widths[key]);
      });

    this.setState({colsWidth, tableWidth: width});
  }

  renderVirtualTable() {
    const {
      options,
      value,
      classnames: cx,
      option2value,
      translate: __,
      itemHeight = 30,
      virtualListHeight
    } = this.props;
    const columns = this.getColumns();
    let valueArray = BaseSelection.value2array(value, options, option2value);

    const {startIndex, stopIndex} = this.state.rowRenderScope || {};

    let tableList: React.ReactNode | null = null;

    if (startIndex !== undefined && stopIndex !== undefined) {
      const trs = [];
      for (let index = startIndex; index <= stopIndex; index++) {
        const option = options[index];
        if (!option) {
          return null;
        }

        trs.push(
          this.renderTr({
            option,
            rowIndex: index,
            valueArray,
            columns,
            styles: {
              height: `${itemHeight}px`
            }
          })
        );
      }

      tableList = (
        <table
          className={cx('Table-table')}
          style={{
            marginTop: (startIndex || 0) * itemHeight + 'px'
          }}
        >
          {this.state.colsWidth.length ? (
            <colgroup>
              {this.state.colsWidth.map((colWidth: number, index: number) => (
                <col style={{width: `${colWidth}px`}} key={`col-${index}`} />
              ))}
            </colgroup>
          ) : null}
          <tbody>{trs}</tbody>
        </table>
      );
    }

    return (
      <div className={cx('Table-content', 'is-virtual')}>
        <table className={cx('Table-table')} ref={this.tableHeadRef.bind(this)}>
          {this.renderTHead()}
        </table>
        <div className={cx('Table-content-virtual')}>
          <AutoSizer
            minHeight={virtualListHeight}
            onResize={this.handleVirtualTableResize.bind(this)}
          >
            {({height}: {height: number}) => (
              <VirtualList
                onItemsRendered={res => {
                  if (!isEqual(this.state.rowRenderScope, res)) {
                    // 需要延后执行，否则报 warning
                    Promise.resolve().then(() =>
                      this.setState({
                        rowRenderScope: res
                      })
                    );
                  }
                }}
                className={cx('Table-table', 'is-virtual')}
                height={height}
                itemCount={options.length}
                itemSize={itemHeight}
                WrapperComponent="div"
                InnerComponent="div"
                prefix={tableList}
                innerStyleFilter={(styles: object) => ({
                  ...styles,
                  position: 'absolute',
                  top: 0,
                  minWidth: undefined,
                  width: '1px',
                  visibility: 'hidden'
                })}
                renderItem={() => null}
              />
            )}
          </AutoSizer>
        </div>
      </div>
    );
  }

  render() {
    const {
      className,
      classnames: cx,
      options,
      virtualThreshold = 1000
    } = this.props;

    const table =
      Array.isArray(options) && options.length > virtualThreshold ? (
        this.renderVirtualTable()
      ) : (
        <div className={cx('Table-content')}>
          <table className={cx('Table-table')}>
            {this.renderTHead()}
            {this.renderTBody()}
          </table>
        </div>
      );

    return <div className={cx('TableSelection', className)}>{table}</div>;
  }
}

export default themeable(
  localeable(
    uncontrollable(TableSelection, {
      value: 'onChange'
    })
  )
);
