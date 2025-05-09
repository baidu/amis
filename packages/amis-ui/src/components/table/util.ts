import findLastIndex from 'lodash/findLastIndex';
import find from 'lodash/find';
import {isBreakpoint} from 'amis-core';

import {ColumnProps, SummaryProps, ThProps, TdProps, SortProps} from './index';

// 当前行包含子数据
export function checkChildrenRow(data: any, childrenColumnName: string) {
  return (
    data[childrenColumnName] &&
    Array.isArray(data[childrenColumnName]) &&
    data[childrenColumnName].length > 0
  );
}

// 获取当前行数据所有子行的key值
export function getDataChildrenKeys(
  data: any,
  childrenColumnName: string,
  rowSelectionKeyField: string
) {
  let keys: Array<string> = [];

  if (checkChildrenRow(data, childrenColumnName)) {
    data[childrenColumnName].forEach(
      (item: any) =>
        (keys = [
          ...keys,
          ...getDataChildrenKeys(
            item,
            childrenColumnName,
            rowSelectionKeyField
          ),
          item[rowSelectionKeyField]
        ])
    );
  }

  return keys;
}

// 获取当前表格所有可以选中的行
export function getAllSelectableRows(
  dataSource: Array<any>,
  rowSelectionKeyField: string,
  childrenColumnName: string,
  expandable: boolean,
  selectedRowKeys: Array<string | number>,
  maxSelectedLength: number | undefined
) {
  let allRowKeys: Array<string | number> = [];
  let allRows: Array<any> = [];
  dataSource.forEach(data => {
    allRowKeys.push(data[rowSelectionKeyField]);
    allRows.push(data);
    if (!expandable && checkChildrenRow(data, childrenColumnName)) {
      allRowKeys = [
        ...allRowKeys,
        ...getDataChildrenKeys(data, childrenColumnName, rowSelectionKeyField)
      ];
      data[childrenColumnName].forEach((item: any) => allRows.push(item));
    }
  });
  const restSelectedKeys = selectedRowKeys?.filter(
    key => !allRowKeys.includes(key)
  );
  if (maxSelectedLength && Number.isInteger(maxSelectedLength)) {
    if (restSelectedKeys.length + allRowKeys.length > maxSelectedLength) {
      const count = maxSelectedLength - restSelectedKeys.length;
      allRowKeys = allRowKeys.slice(0, count);
      allRows = allRows.slice(0, count);
    }
  }
  return {rows: allRows, rowKeys: allRowKeys, restSelectedKeys};
}

export function getRowsByKeys(
  dataSource: Array<any>,
  keys: Array<string | number>,
  keyField: string,
  childrenColumnName: string
) {
  let selectedRows: Array<any> = [];
  let unSelectedRows: Array<any> = [];
  dataSource.forEach(data => {
    if (keys.find(key => key === data[keyField])) {
      selectedRows.push(data);
    } else {
      unSelectedRows.push(data);
    }
    if (checkChildrenRow(data, childrenColumnName)) {
      const childrenResult = getRowsByKeys(
        data[childrenColumnName],
        keys,
        keyField,
        childrenColumnName
      );
      selectedRows = [...selectedRows, ...childrenResult.selectedRows];
      unSelectedRows = [...unSelectedRows, ...childrenResult.unSelectedRows];
    }
  });

  return {selectedRows, unSelectedRows};
}

export function getMaxLevelThRowSpan(columns: Array<ColumnProps>) {
  let maxLevel = 0;

  Array.isArray(columns) &&
    columns.forEach(c => {
      const level = getThRowSpan(c);
      if (maxLevel < level) {
        maxLevel = level;
      }
    });

  return maxLevel;
}

export function getThRowSpan(column: ColumnProps) {
  if (!column.children || (column.children && !column.children.length)) {
    return 1;
  }

  return 1 + getMaxLevelThRowSpan(column.children);
}

export function getThColSpan(column: ColumnProps) {
  if (!column.children || (column.children && !column.children.length)) {
    return 1;
  }

  let childrenLength = 0;
  column.children.forEach(item => (childrenLength += getThColSpan(item)));

  return childrenLength;
}

export function buildColumns(
  columns: Array<ColumnProps> = [],
  thColumns: Array<Array<any>>,
  tdColumns: Array<ColumnProps> = [],
  maxLevel: number,
  depth: number = 0,
  fixed?: boolean | string
) {
  // 在处理表头时，如果父级column设置了fixed属性，那么所有children保持一致
  Array.isArray(columns) &&
    columns.forEach(column => {
      let childMaxLevel = 0;
      if (column.children) {
        childMaxLevel = getMaxLevelThRowSpan(column.children);
      }
      const newColumn = {
        ...column,
        rowSpan: childMaxLevel ? 1 : maxLevel - depth,
        colSpan: getThColSpan(column),
        depth
      };
      const tdColumn = {
        ...column
      };
      if (fixed) {
        newColumn.fixed = fixed;
        tdColumn.fixed = fixed;
      }

      if (!thColumns[depth]) {
        thColumns[depth] = [];
      }
      thColumns[depth].push(newColumn);
      if (column.children && column.children.length > 0) {
        buildColumns(
          column.children,
          thColumns,
          tdColumns,
          maxLevel,
          depth + 1,
          column.fixed
        );
      } else {
        const {children, ...rest} = tdColumn;
        tdColumns.push(rest);
      }
    });
}

export function getBuildColumns(columns: Array<any>) {
  const filterColumns = columns.filter(
    item => !item.breakpoint || !isBreakpoint(item.breakpoint)
  );

  const thColumns: Array<Array<ThProps>> = [];
  const tdColumns: Array<TdProps> = [];
  buildColumns(
    filterColumns,
    thColumns,
    tdColumns,
    getMaxLevelThRowSpan(filterColumns)
  );

  return {thColumns, tdColumns};
}

function isFixedLeftColumn(fixed: boolean | string | undefined) {
  return fixed === true || fixed === 'left';
}

function isFixedRightColumn(fixed: boolean | string | undefined) {
  return fixed === 'right';
}

function getPreviousLeftWidth(
  doms: HTMLCollection,
  index: number,
  columns: Array<ColumnProps | SummaryProps>
) {
  let width = 0;
  for (let i = 0; i < index; i++) {
    if (columns && columns[i] && isFixedLeftColumn(columns[i].fixed)) {
      const dom = doms[i] as HTMLElement;
      width += dom.offsetWidth;
    }
  }
  return width;
}

function getPreviousTopHeight(thead: HTMLCollection, rowIndex: number) {
  let height = 0;

  for (let i = 0; i < rowIndex; i++) {
    if (thead && thead[i]) {
      const dom = thead[i] as HTMLElement;
      height += dom.offsetHeight;
    }
  }
  return height;
}

function getAfterRightWidth(
  doms: HTMLCollection,
  index: number,
  columns: Array<ColumnProps | SummaryProps>
) {
  let width = 0;
  for (let i = doms.length - 0; i > index; i--) {
    if (columns && columns[i] && isFixedRightColumn(columns[i].fixed)) {
      const dom = doms[i] as HTMLElement;
      if (dom) {
        width += dom.offsetWidth;
      }
    }
  }
  return width;
}

// 更新一个tr下的td的left和class
export function updateFixedRow(
  row: HTMLTableRowElement,
  columns: Array<ColumnProps | SummaryProps>,
  cx: Function
) {
  const children = row?.children || [];
  const length = children.length;

  const CLASS_FIX_LEFT_LAST = cx('Table-cell-fix-left-last');
  const CLASS_FIX_RIGHT_FIRST = cx('Table-cell-fix-right-first');
  const CLASS_FIX_RIGHT_FIRST_PREV = cx('Table-cell-fix-right-first-prev');

  const styleUpdates: {dom: HTMLElement; left?: string; right?: string}[] = [];
  const classRemovals: HTMLElement[] = [];

  for (let i = 0; i < length; i++) {
    const dom = children[i] as HTMLElement;

    classRemovals.push(dom);

    const fixed = columns[i] ? columns[i].fixed || '' : '';

    let left, right;
    if (isFixedLeftColumn(fixed)) {
      left = i > 0 ? getPreviousLeftWidth(children, i, columns) + 'px' : '0';
    } else if (isFixedRightColumn(fixed)) {
      right =
        i < length - 1 ? getAfterRightWidth(children, i, columns) + 'px' : '0';
    }

    styleUpdates.push({dom, left, right});
  }

  // 批量修改样式
  styleUpdates.forEach(({dom, left, right}) => {
    dom.style.removeProperty('left');
    dom.style.removeProperty('right');

    left && (dom.style.left = left);
    right && (dom.style.right = right);
  });

  // 批量移除类名
  classRemovals.forEach(dom => {
    dom.classList.remove(
      CLASS_FIX_LEFT_LAST,
      CLASS_FIX_RIGHT_FIRST,
      CLASS_FIX_RIGHT_FIRST_PREV
    );
  });

  // 最后一个左fixed的添加样式
  let leftIndex = findLastIndex(columns, column =>
    isFixedLeftColumn(column.fixed)
  );

  if (leftIndex > -1) {
    children[leftIndex]?.classList.add(CLASS_FIX_LEFT_LAST);
  }
  // 第一个右fixed的添加样式
  let rightIndex = columns.findIndex(column =>
    isFixedRightColumn(column.fixed)
  );
  if (rightIndex > -1) {
    children[rightIndex]?.classList.add(CLASS_FIX_RIGHT_FIRST);
    if (rightIndex > 0) {
      children[rightIndex - 1]?.classList.add(CLASS_FIX_RIGHT_FIRST_PREV);
    }
  }
}

// 更新一个tr下的th的top
export function updateStickyRow(thead: HTMLCollection, rowIndex: number) {
  const children = thead[rowIndex]?.children || [];

  for (let i = 0; i < children.length; i++) {
    const dom = children[i] as HTMLElement;
    dom.style.removeProperty('top');
    dom.style.top =
      rowIndex > 0 ? getPreviousTopHeight(thead, rowIndex) + 'px' : '0';
  }
}

export function hasFixedColumn(columns: Array<ColumnProps | SummaryProps>) {
  return find(columns, column => column.fixed);
}

export function levelsSplit(level: string) {
  if (!level) {
    return [];
  }
  return level.split(',').map((l: string) => +l);
}

export function getSortData(
  data: Array<any>,
  columns: Array<ColumnProps>,
  childrenColumnName: string,
  sort?: SortProps
): Array<any> {
  const cloneData = data.slice();
  if (!sort?.orderBy) {
    return cloneData;
  }
  const column = columns.find(column => column.name === sort.orderBy);
  if (!column) {
    return cloneData;
  }
  if (typeof column.sorter !== 'function') {
    return cloneData;
  }
  const sortOrder = sort.orderDir;
  return cloneData
    .sort((record1, record2) => {
      const compareResult =
        typeof column.sorter === 'function'
          ? column.sorter(record1, record2, sortOrder)
          : 0;
      if (compareResult !== 0) {
        return sortOrder === 'asc' ? compareResult : -compareResult;
      }
      return 0;
    })
    .map(record => {
      const subRecords = (record as any)[childrenColumnName];
      if (subRecords) {
        return {
          ...record,
          [childrenColumnName]: getSortData(
            data,
            columns,
            childrenColumnName,
            sort
          )
        };
      }
      return record;
    });
}
