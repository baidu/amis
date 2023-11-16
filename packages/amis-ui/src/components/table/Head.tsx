/**
 * @file table/Head
 * @author fex
 */

import React from 'react';
import {ThemeProps} from 'amis-core';

import {
  getBuildColumns,
  getAllSelectableRows,
  updateFixedRow,
  hasFixedColumn
} from './util';
import {
  ColumnProps,
  ThProps,
  TdProps,
  SortProps,
  RowSelectionOptionProps
} from './index';
import CheckBox from '../Checkbox';
import Cell from './Cell';
import HeadCellSort from './HeadCellSort';
import HeadCellFilter from './HeadCellFilter';
import HeadCellSelect from './HeadCellSelect';

export interface Props extends ThemeProps {
  draggable: boolean;
  selectable: boolean;
  rowSelectionFixed: boolean;
  rowSelectionType?: string;
  selections?: Array<RowSelectionOptionProps>;
  columns: Array<ColumnProps>;
  rowSelectionKeyField: string;
  maxSelectedLength?: number;
  isRightExpandable?: boolean;
  isLeftExpandable?: boolean;
  selectedRowKeys: Array<string | number>;
  dataSource: Array<any>;
  resizable?: boolean;
  expandable: boolean;
  expandableFixed?: string | boolean;
  childrenColumnName: string;
  orderBy?: string;
  popOverContainer?: () => HTMLElement;
  isExpandable: boolean;
  onSort: Function;
  onSelectAll: Function;
  onFilter?: Function;
  onResizeMouseDown: Function;
}

export default class Head extends React.PureComponent<Props> {
  domRef: React.RefObject<HTMLTableSectionElement> = React.createRef();
  // 表头配置
  thColumns: Array<Array<ThProps>>;
  // 表格配置
  tdColumns: Array<TdProps>;

  prependColumns(columns: Array<any>) {
    const {rowSelectionFixed, expandableFixed, draggable} = this.props;
    if (draggable) {
      columns.unshift({});
    } else {
      if (expandableFixed) {
        columns.unshift({fixed: expandableFixed});
      }
      if (rowSelectionFixed) {
        columns.unshift({fixed: true});
      }
    }
  }

  updateFixedRow() {
    const {classnames: cx} = this.props;
    const thead = this.domRef.current;
    const children = thead?.children;
    for (let i = 0; i < (children?.length || 0); i++) {
      const cols = [...this.thColumns[i]];
      if (i === 0) {
        this.prependColumns(cols);
      }

      if (hasFixedColumn(cols)) {
        updateFixedRow(children?.[i] as HTMLTableRowElement, cols, cx);
      }
    }
  }

  componentDidMount() {
    this.updateFixedRow();
  }

  componentDidUpdate() {
    this.updateFixedRow();
  }

  render() {
    const {
      dataSource,
      classnames: cx,
      classPrefix,
      expandable,
      draggable,
      resizable,
      selectable,
      rowSelectionKeyField,
      isExpandable,
      childrenColumnName,
      selectedRowKeys,
      maxSelectedLength,
      rowSelectionFixed,
      rowSelectionType,
      popOverContainer,
      isRightExpandable,
      isLeftExpandable,
      orderBy,
      columns,
      selections,
      expandableFixed,
      onSort,
      onSelectAll,
      onFilter,
      onResizeMouseDown
    } = this.props;

    const {thColumns, tdColumns} = getBuildColumns(columns);
    this.thColumns = thColumns;
    this.tdColumns = tdColumns;

    // 获取一行最多th个数
    let maxCount = 0;
    columns.forEach(cols => {
      if (cols.length > maxCount) {
        maxCount = cols.length;
      }
    });

    const expandableCell =
      !draggable && isExpandable ? (
        <Cell
          key="expandable"
          wrapperComponent="th"
          rowSpan={columns.length}
          fixed={expandableFixed ? 'left' : ''}
          className={cx('Table-row-expand-icon-cell')}
          classnames={cx}
          classPrefix={classPrefix}
        ></Cell>
      ) : null;

    const {rows, rowKeys, restSelectedKeys} = getAllSelectableRows(
      dataSource,
      rowSelectionKeyField,
      childrenColumnName,
      expandable,
      selectedRowKeys,
      maxSelectedLength
    );

    // 从renderers的table传来的数据 可能不在当前页 因此需要过滤一下
    const selectedKeys = selectedRowKeys.filter((key: number | string) =>
      rowKeys.includes(key)
    );

    return (
      <thead ref={this.domRef} className={cx('Table-thead')}>
        {this.thColumns.map((data, index) => {
          return (
            <tr key={'th-cell-' + index}>
              {draggable && index === 0 ? (
                <Cell
                  key={`drag-${index}`}
                  wrapperComponent="th"
                  rowSpan={this.thColumns.length}
                  className={cx('Table-dragCell')}
                  col="drag"
                  classnames={cx}
                  classPrefix={classPrefix}
                ></Cell>
              ) : null}
              {!draggable && selectable && index === 0 ? (
                <Cell
                  key={`select-${index}`}
                  wrapperComponent="th"
                  rowSpan={this.thColumns.length}
                  fixed={rowSelectionFixed ? 'left' : ''}
                  className={cx('Table-checkCell')}
                  col="select"
                  classnames={cx}
                  classPrefix={classPrefix}
                >
                  {rowSelectionType !== 'radio'
                    ? [
                        <CheckBox
                          key="checkAll"
                          partial={
                            selectedKeys.length > 0 &&
                            selectedKeys.length < rowKeys.length
                          }
                          checked={selectedKeys.length > 0}
                          onChange={async value => {
                            const selectedRows = value ? rows : [];
                            const selectedRowKeys = value ? rowKeys : [];
                            onSelectAll &&
                              onSelectAll(
                                value,
                                selectedRowKeys,
                                selectedRows,
                                restSelectedKeys
                              );
                          }}
                        ></CheckBox>,
                        selections && selections.length > 0 ? (
                          <HeadCellSelect
                            key="checkSelection"
                            keys={rowKeys}
                            selections={selections}
                            popOverContainer={popOverContainer}
                          ></HeadCellSelect>
                        ) : null
                      ]
                    : null}
                </Cell>
              ) : null}
              {isLeftExpandable && index === 0 ? expandableCell : null}
              {data.map((item: any, i: number) => {
                let sort = null;
                if (item.sorter) {
                  sort = (
                    <HeadCellSort
                      column={item}
                      active={!!orderBy && orderBy === item?.name}
                      onSort={(payload: SortProps) => {
                        onSort && onSort(payload, item);
                      }}
                    ></HeadCellSort>
                  );
                }

                let filter = null;
                if (item.filterDropdown) {
                  filter = item.filterDropdown;
                } else if (item.filters && item.filters.length > 0) {
                  filter = (
                    <HeadCellFilter
                      column={item}
                      popOverContainer={popOverContainer}
                      onFilter={onFilter}
                    ></HeadCellFilter>
                  );
                }

                // th的最后一行才可调整列宽
                // 分组情况下 最后一行才和列配置个数对应
                // 就可以根据index找到col 不依赖name
                const noChildren = !item.children?.length;
                let cIndex = -1;
                if (noChildren) {
                  // 根据name去tdColumns匹配出index
                  // 没设置name的 那一定不是要绑定数据的列 一般都是分组的上层 也不会出现调整列宽
                  cIndex = this.tdColumns.findIndex(c => c.name === item.name);
                }
                const children = !item.children?.length ? (
                  <>
                    {sort}
                    {filter}
                    {resizable ? (
                      <i
                        className={cx('Table-thead-resizable')}
                        onMouseDown={e => {
                          onResizeMouseDown && onResizeMouseDown(e, cIndex);
                        }}
                      ></i>
                    ) : null}
                  </>
                ) : null;

                return (
                  <Cell
                    key={`cell-${i}`}
                    wrapperComponent="th"
                    rowSpan={item.rowSpan}
                    colSpan={item.colSpan}
                    classnames={cx}
                    classPrefix={classPrefix}
                    fixed={item.fixed === true ? 'left' : item.fixed}
                    className={cx({
                      'Table-cell-last':
                        i === maxCount - 1 && i === data.length - 1
                    })}
                    depth={item.depth}
                    col={cIndex > -1 ? cIndex.toString() : undefined}
                  >
                    {typeof item.title === 'function'
                      ? item.title(children)
                      : item.title}
                  </Cell>
                );
              })}
              {isRightExpandable && index === 0 ? expandableCell : null}
            </tr>
          );
        })}
      </thead>
    );
  }
}
