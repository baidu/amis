/**
 * @file Table
 * @author fex
 */

import React from 'react';
import {findDOMNode} from 'react-dom';
import findLastIndex from 'lodash/findLastIndex';
import find from 'lodash/find';
import isEqual from 'lodash/isEqual';
import filter from 'lodash/filter';
import intersection from 'lodash/intersection';
import Sortable from 'sortablejs';

import {themeable, ClassNamesFn, ThemeProps} from 'amis-core';
import {localeable, LocaleProps} from 'amis-core';
import {isObject, isBreakpoint, guid, autobind} from 'amis-core';
import {Icon} from '../icons';
import CheckBox from '../Checkbox';
import Spinner from '../Spinner';

import HeadCellSort from './HeadCellSort';
import HeadCellFilter from './HeadCellFilter';
import HeadCellSelect from './HeadCellSelect';
import ItemActionsWrapper from './ItemActionsWrapper';
import Cell from './Cell';

export interface ColumnProps {
  title: string | React.ReactNode | Function;
  key: string;
  className?: Function;
  children?: Array<ColumnProps>;
  render: Function;
  fixed?: boolean | string;
  width?: number | string;
  sorter?: (a: any, b: any) => number | boolean; // 设置为true时，执行onSort，否则执行前端排序
  sortOrder?: string; // 升序ascend、降序descend
  filters?: Array<any>; // 筛选数据源，配置了数据源才展示
  filterMode?: string; // menu/tree 默认menu 先只支持menu
  filterMultiple?: boolean; // 是否支持多选
  filteredValue?: Array<string>;
  filtered?: boolean;
  filterDropdown?: Function | React.ReactNode; // 列筛选 filterDropdown的优先级更高 和filters两者不能并存
  align?: string; // left/right/center
  breakpoint?: '*' | 'xs' | 'sm' | 'md' | 'lg';
}

export interface ThProps extends ColumnProps {
  rowSpan: number;
  colSpan: number;
  groupId: string; // 随机生成表头分组的id
  depth: number; // 表头分组层级
}

export interface TdProps extends ColumnProps {
  rowSpan: number;
  colSpan: number;
  groupId: string; // 随机生成表头分组的id
}

export interface RowSelectionOptionProps {
  key: string;
  text: string;
  onSelect: Function;
}

export interface RowSelectionProps {
  type: string;
  rowClick: boolean; // 点击复选框选中还是点击整行选中
  fixed: boolean; // 只能固定在左边
  selectedRowKeys: Array<string | number>;
  keyField?: string; // 默认是key，可自定义
  columnWidth?: number;
  selections?: Array<RowSelectionOptionProps>;
  onChange?: Function;
  getCheckboxProps: Function;
}

export interface ExpandableProps {
  expandedRowKeys?: Array<string | number>;
  keyField: string; // 默认是key，可自定义
  columnWidth?: number;
  rowExpandable: Function;
  defaultExpandedRowKeys?: Array<string | number>;
  onExpand?: Function;
  onExpandedRowsChange?: Function;
  expandedRowRender?: Function;
  expandedRowClassName?: Function;
  expandIcon?: Function;
  fixed?: boolean;
}

export interface SummaryProps {
  colSpan: number; // 手动控制列合并 先不支持列合并
  fixed: string | boolean; // 手动设置左固定还是右固定
  render: Function | React.ReactNode;
}

export interface OnRowProps {
  onRowMouseEnter?: Function;
  onRowMouseLeave?: Function;
  onRowClick?: Function;
}

export interface SortProps {
  orderBy: string;
  order: string;
}

export interface TableProps extends ThemeProps, LocaleProps {
  title: string | React.ReactNode | Function;
  footer: string | React.ReactNode | Function;
  className?: string;
  dataSource: Array<any>;
  classnames: ClassNamesFn;
  columns: Array<ColumnProps>;
  scroll?: ScrollProps;
  rowSelection?: RowSelectionProps;
  onSort?: Function;
  expandable?: ExpandableProps;
  bordered?: boolean;
  size?: string; // large | default | small
  headSummary?:
    | Function
    | React.ReactNode
    | Array<SummaryProps | Array<SummaryProps>>;
  footSummary?:
    | Function
    | React.ReactNode
    | Array<SummaryProps | Array<SummaryProps>>;
  draggable?: boolean;
  onDrag?: Function;
  resizable?: boolean; // 列宽调整
  placeholder?: string | React.ReactNode | Function; // 数据为空展示
  loading?: boolean | string | React.ReactNode; // 数据加载中
  sticky?: boolean; // 粘性头部
  onFilter?: Function; // 筛选/过滤函数
  childrenColumnName?: string; // 控制数据源哪一列作为嵌套数据，不想支持，就随便设置一个不存在的值，默认是children
  keyField?: string; // 展开嵌套数据的时候，用哪个字段做唯一标识
  indentSize: number; // 树形展示时 设置缩进值
  onRow?: OnRowProps; // 行操作事件
  rowClassName?: Function;
  lineHeight?: string; // 可设置large、middle固定高度，不设置则跟随内容
  showHeader?: boolean; // 是否展示表头
  onSelect?: Function;
  onSelectAll?: Function;
  itemActions?: Function;
}

export interface ScrollProps {
  x: number | string | true;
  y: number | string;
}

export interface TableState {
  selectedRowKeys: Array<string | number>;
  dataSource: Array<any>;
  expandedRowKeys: Array<string | number>;
  colWidths: Array<number>;
  hoverRow: {
    rowIndex?: number;
    record: any;
    target: HTMLTableRowElement;
  } | null;
}

function getMaxLevelThRowSpan(columns: Array<ColumnProps>) {
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

function getThRowSpan(column: ColumnProps) {
  if (!column.children || (column.children && !column.children.length)) {
    return 1;
  }

  return 1 + getMaxLevelThRowSpan(column.children);
}

function getThColSpan(column: ColumnProps) {
  if (!column.children || (column.children && !column.children.length)) {
    return 1;
  }

  let childrenLength = 0;
  column.children.forEach(item => (childrenLength += getThColSpan(item)));

  return childrenLength;
}

function buildColumns(
  columns: Array<ColumnProps> = [],
  thColumns: Array<Array<any>>,
  tdColumns: Array<ColumnProps> = [],
  depth: number = 0,
  id?: string,
  fixed?: boolean | string
) {
  const maxLevel = getMaxLevelThRowSpan(columns);
  // 在处理表头时，如果父级column设置了fixed属性，那么所有children保持一致
  Array.isArray(columns) &&
    columns.forEach(column => {
      const groupId = id || guid();
      let childMaxLevel = 0;
      if (column.children) {
        childMaxLevel = getMaxLevelThRowSpan(column.children);
      }
      const newColumn = {
        ...column,
        rowSpan: childMaxLevel ? 1 : maxLevel - childMaxLevel + depth,
        colSpan: getThColSpan(column),
        groupId,
        depth
      };
      const tdColumn = {
        ...column,
        groupId
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
          depth + 1,
          groupId,
          column.fixed
        );
      } else {
        const {children, ...rest} = tdColumn;
        tdColumns.push(rest);
      }
    });
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
  columns: Array<ColumnProps>
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

function getAfterRightWidth(
  doms: HTMLCollection,
  index: number,
  columns: Array<ColumnProps>
) {
  let width = 0;
  for (let i = doms.length - 0; i > index; i--) {
    if (columns && columns[i] && isFixedRightColumn(columns[i].fixed)) {
      const dom = doms[i] as HTMLElement;
      width += dom.offsetWidth;
    }
  }
  return width;
}

function hasFixedColumn(columns: Array<ColumnProps>) {
  return find(columns, column => column.fixed);
}

function getSummaryColumns(summary: Array<SummaryProps>) {
  if (!summary) {
    return [];
  }
  const last: Array<SummaryProps> = [];
  const first: Array<SummaryProps> = [];
  summary.forEach(item => {
    if (isObject(item)) {
      first.push(item);
    } else if (Array.isArray(item)) {
      last.push(item);
    }
  });
  return [first, ...last];
}

const DefaultCellWidth = 40;

export class Table extends React.PureComponent<TableProps, TableState> {
  static defaultProps = {
    title: '',
    className: '',
    dataSource: [],
    columns: [],
    indentSize: 15,
    placeholder: '暂无数据',
    showHeader: true
  };

  constructor(props: TableProps) {
    super(props);

    if (props.rowSelection) {
      const selectedResult = this.getSelectedRows(
        props.dataSource,
        props.rowSelection?.selectedRowKeys
      );

      this.selectedRows = selectedResult.selectedRows;
      this.unSelectedRows = selectedResult.unSelectedRows;
    }

    this.state = {
      selectedRowKeys: props.rowSelection
        ? props.rowSelection.selectedRowKeys.map(key => key) || []
        : [],
      dataSource: props.dataSource || [], // 为了支持前端搜索
      expandedRowKeys: [
        ...(props.expandable ? props.expandable.expandedRowKeys || [] : []),
        ...(props.expandable
          ? props.expandable.defaultExpandedRowKeys || []
          : [])
      ],
      colWidths: [],
      hoverRow: null
    };
  }

  @autobind
  getPopOverContainer() {
    return findDOMNode(this);
  }

  // 表头配置
  thColumns: Array<Array<ThProps>>;
  // 表格配置
  tdColumns: Array<TdProps>;
  // 表格当前选中行
  selectedRows: Array<any>;
  // 表格当前未选中行
  unSelectedRows: Array<any>;
  // 拖拽排序
  sortable: Sortable | null;
  // 记录点击起始横坐标
  resizeStart: number;
  // 记录点击对应col
  resizeTarget: Array<HTMLElement | null>;
  resizeWidth: number;

  tableDom: React.RefObject<HTMLDivElement> = React.createRef();
  theadDom: React.RefObject<HTMLTableSectionElement> = React.createRef();
  tbodyDom: React.RefObject<HTMLTableSectionElement> = React.createRef();
  contentDom: React.RefObject<HTMLDivElement> = React.createRef();
  headerDom: React.RefObject<HTMLDivElement> = React.createRef();
  bodyDom: React.RefObject<HTMLDivElement> = React.createRef();
  tfootDom: React.RefObject<HTMLTableSectionElement> = React.createRef();
  footDom: React.RefObject<HTMLDivElement> = React.createRef();

  getColWidths() {
    const childrens = this.tbodyDom.current?.children[0]?.children || [];
    const colWidths: Array<any> = new Array(childrens ? childrens.length : 0);

    // 分2个table实现表格 为了实现上下table的宽度统一
    for (let i = 0; i < childrens.length; i++) {
      const child: any = childrens[i];
      colWidths[i] = child ? child.offsetWidth : null;
    }

    return colWidths;
  }

  getSelectedRows(
    dataSource: Array<any>,
    selectedRowKeys: Array<string | number>
  ) {
    const selectedRows: Array<any> = [];
    const unSelectedRows: Array<any> = [];
    dataSource.forEach(data => {
      if (
        find(
          selectedRowKeys,
          key => key === data[this.getRowSelectionKeyField()]
        )
      ) {
        selectedRows.push(data);
      } else {
        unSelectedRows.push(data);
      }
    });

    return {selectedRows, unSelectedRows};
  }

  updateTableBodyFixed() {
    const tbodyDom = this.tbodyDom && (this.tbodyDom.current as HTMLElement);
    const tdColumns = [...this.tdColumns];
    if (!tbodyDom) {
      return;
    }
    this.updateTbodyFixedRow(tbodyDom, tdColumns);
    this.updateHeadSummaryFixedRow(tbodyDom);
  }

  updateColWidths() {
    this.setState({colWidths: this.getColWidths()}, () => {
      if (hasFixedColumn(this.props.columns)) {
        const theadDom =
          this.theadDom && (this.theadDom.current as HTMLElement);
        const thColumns = this.thColumns;
        this.updateTheadFixedRow(theadDom, thColumns);
        this.updateTableBodyFixed();
      }
    });
  }

  updateTableFixedRows() {
    if (hasFixedColumn(this.props.columns)) {
      const headerDom =
        this.headerDom && (this.headerDom.current as HTMLElement);
      if (headerDom) {
        const headerBody = headerDom.getElementsByTagName('tbody');
        headerBody &&
          headerBody[0] &&
          this.updateHeadSummaryFixedRow(headerBody[0]);
      }

      const tfootDom = this.tfootDom && (this.tfootDom.current as HTMLElement);
      tfootDom && this.updateFootSummaryFixedRow(tfootDom);
    }
  }

  componentDidMount() {
    if (this.props.loading) {
      return;
    }

    this.updateTableFixedRows();

    let current = this.contentDom?.current;
    if (this.headerDom?.current) {
      // overflow设置为hidden的情况
      const hiddenDomRefs = [this.headerDom, this.footDom];
      hiddenDomRefs.forEach(
        ref =>
          ref &&
          ref.current &&
          ref.current.addEventListener('wheel', this.onWheel.bind(this))
      );
    }
    current && this.updateTableDom(current);

    if (this.props.draggable) {
      this.initDragging();
    }

    this.updateStickyHeader();

    this.updateColWidths();
  }

  componentDidUpdate(prevProps: TableProps, prevState: TableState) {
    // 数据源发生了变化
    if (!isEqual(prevProps.dataSource, this.props.dataSource)) {
      this.setState({dataSource: [...this.props.dataSource]}, () => {
        if (this.props.draggable) {
          if (this.sortable) {
            this.destroyDragging();
          }

          this.initDragging();
        }

        this.updateTableFixedRows();

        this.updateColWidths();
      }); // 异步加载数据需求再更新一次
    }

    // 选择项发生了变化触发
    if (!isEqual(prevState.selectedRowKeys, this.state.selectedRowKeys)) {
      // 更新保存的已选择行数据
      const selectedResult = this.getSelectedRows(
        this.state.dataSource,
        this.state.selectedRowKeys
      );
      this.selectedRows = selectedResult.selectedRows;
      this.unSelectedRows = selectedResult.unSelectedRows;

      const {rowSelection} = this.props;
      rowSelection &&
        rowSelection.onChange &&
        rowSelection.onChange(this.state.selectedRowKeys, this.selectedRows);

      this.setState({
        selectedRowKeys: this.state.selectedRowKeys.filter(
          (key, i, a) => a.indexOf(key) === i
        )
      });
    }

    // 外部传入的选择项发生了变化
    if (
      !isEqual(
        prevProps.rowSelection?.selectedRowKeys,
        this.props.rowSelection?.selectedRowKeys
      )
    ) {
      if (this.props.rowSelection) {
        this.setState({
          selectedRowKeys: this.props.rowSelection.selectedRowKeys
        });
        const selectedResult = this.getSelectedRows(
          this.state.dataSource,
          this.state.selectedRowKeys
        );
        this.selectedRows = selectedResult.selectedRows;
        this.unSelectedRows = selectedResult.unSelectedRows;
      }
    }

    // 外部传入的展开项发生了变化
    if (
      !isEqual(
        prevProps?.expandable?.expandedRowKeys,
        this.props.expandable?.expandedRowKeys
      )
    ) {
      if (this.props.expandable) {
        this.setState({
          expandedRowKeys: this.props.expandable.expandedRowKeys || []
        });
      }
    }

    // 展开行变化时触发
    if (!isEqual(prevState.expandedRowKeys, this.state.expandedRowKeys)) {
      if (this.props.expandable) {
        const {onExpandedRowsChange, keyField} = this.props.expandable;
        const expandedRows: Array<any> = [];
        this.state.dataSource.forEach(item => {
          if (
            find(
              this.state.expandedRowKeys,
              key => key == item[keyField || 'key']
            )
          ) {
            expandedRows.push(item);
          }
        });
        onExpandedRowsChange && onExpandedRowsChange(expandedRows);
      }
    }

    // sticky属性发生了变化
    if (prevProps.sticky !== this.props.sticky) {
      this.updateStickyHeader();
    }
  }

  componentWillUnmount() {
    const hiddenDomRefs = [this.headerDom, this.footDom];
    hiddenDomRefs.forEach(
      ref =>
        ref &&
        ref.current &&
        ref.current.removeEventListener('wheel', this.onWheel.bind(this))
    );

    this.destroyDragging();
  }

  initDragging() {
    const {classnames: cx, onDrag} = this.props;

    this.sortable = new Sortable(this.tbodyDom.current as HTMLElement, {
      group: 'table',
      animation: 150,
      handle: `.${cx('Table-dragCell')}`,
      ghostClass: 'is-dragging',
      onMove: (e: any) => {
        const dragged = e.dragged;
        const related = e.related;

        if (
          related &&
          related.classList.contains(`${cx('Table-summary-row')}`)
        ) {
          return false;
        }

        const draggedLevels = dragged.getAttribute('row-levels');
        const relatedLevels = related.getAttribute('row-levels');

        // 嵌套展示 不属于同一层的 不允许拖动
        // 否则涉及到试图的更新，比如子元素都被拖完了
        if (draggedLevels !== relatedLevels) {
          return false;
        }

        return true;
      },
      onEnd: async (e: any) => {
        // 没有移动
        if (e.newIndex === e.oldIndex) {
          return;
        }

        const rowLevels = e.item.getAttribute('row-levels');

        onDrag &&
          onDrag(e.oldIndex, e.newIndex, rowLevels ? rowLevels.split(',') : []);
      }
    });
  }

  destroyDragging() {
    this.sortable && this.sortable.destroy();
    this.sortable = null;
  }

  updateStickyHeader() {
    if (this.props.sticky) {
      // 如果设置了sticky 如果父元素设置了overflow: auto top值还需要考虑padding值
      let parent = this.headerDom?.current?.parentElement;
      setTimeout(() => {
        while (
          parent &&
          window.getComputedStyle(parent, null).getPropertyValue('overflow') !==
            'auto'
        ) {
          parent = parent.parentElement;
        }
        if (
          parent &&
          window.getComputedStyle(parent, null).getPropertyValue('overflow') ===
            'auto'
        ) {
          const paddingTop = window
            .getComputedStyle(parent, null)
            .getPropertyValue('padding-top');
          if (paddingTop && this.headerDom && this.headerDom.current) {
            this.headerDom.current.style.top = '-' + paddingTop;
          }
        }
      });
    }
  }

  // 更新一个tr下的td的left和class
  updateFixedRow(row: HTMLElement, columns: Array<ColumnProps>) {
    const {classnames: cx} = this.props;

    const children = row.children;
    for (let i = 0; i < children.length; i++) {
      const dom = children[i] as HTMLElement;
      const fixed = columns[i] ? columns[i].fixed || '' : '';
      if (isFixedLeftColumn(fixed)) {
        dom.style.left =
          i > 0 ? getPreviousLeftWidth(children, i, columns) + 'px' : '0';
      } else if (isFixedRightColumn(fixed)) {
        dom.style.right =
          i < children.length - 1
            ? getAfterRightWidth(children, i, columns) + 'px'
            : '0';
      }
    }
    // 最后一个左fixed的添加样式
    let leftIndex = findLastIndex(columns, column =>
      isFixedLeftColumn(column.fixed)
    );
    if (leftIndex > -1) {
      children[leftIndex]?.classList.add(cx('Table-cell-fix-left-last'));
    }
    // 第一个右fixed的添加样式
    let rightIndex = columns.findIndex(column =>
      isFixedRightColumn(column.fixed)
    );
    if (rightIndex > -1) {
      children[rightIndex]?.classList.add(cx('Table-cell-fix-right-first'));
      if (rightIndex > 0) {
        children[rightIndex - 1]?.classList.add(
          cx('Table-cell-fix-right-first-prev')
        );
      }
    }
  }

  // 在可选、可展开、可拖拽的情况下，补充column，方便fix处理
  prependColumns(columns: Array<any>) {
    const {rowSelection, expandable, draggable} = this.props;
    if (draggable) {
      columns.unshift({});
    } else {
      if (expandable) {
        columns.unshift(expandable);
      }
      if (rowSelection) {
        columns.unshift(rowSelection);
      }
    }
  }

  updateTheadFixedRow(thead: HTMLElement, columns: Array<any>) {
    const children = thead.children;
    for (let i = 0; i < children.length; i++) {
      const cols = [...columns[i]];
      if (i === 0) {
        this.prependColumns(cols);
      }

      this.updateFixedRow(children[i] as HTMLElement, cols);
    }
  }

  updateTbodyFixedRow(tbody: HTMLElement, columns: Array<any>) {
    const {classnames: cx} = this.props;
    const children = filter(
      tbody.children,
      child =>
        !child.classList.contains(cx('Table-summary-row')) &&
        !child.classList.contains(cx('Table-empty-row'))
    );
    this.prependColumns(columns);
    for (let i = 0; i < children.length; i++) {
      this.updateFixedRow(children[i] as HTMLElement, columns);
    }
  }

  updateSummaryFixedRow(
    children: HTMLCollection | Array<Element>,
    columns: Array<any>
  ) {
    for (let i = 0; i < children.length; i++) {
      this.updateFixedRow(children[i] as HTMLElement, columns[i]);
    }
  }

  updateFootSummaryFixedRow(tfoot: HTMLElement) {
    const {footSummary} = this.props;
    if (Array.isArray(footSummary)) {
      const columns = getSummaryColumns(footSummary as Array<SummaryProps>);
      this.updateSummaryFixedRow(tfoot.children, columns);
    }
  }

  updateHeadSummaryFixedRow(tbody: HTMLElement) {
    const {headSummary, classnames: cx} = this.props;
    if (Array.isArray(headSummary)) {
      const columns = getSummaryColumns(headSummary as Array<SummaryProps>);
      const children = filter(tbody.children, child =>
        child.classList.contains(cx('Table-summary-row'))
      );
      this.updateSummaryFixedRow(children, columns);
    }
  }

  renderColGroup(colWidths?: Array<number>) {
    const {rowSelection, classnames: cx, expandable, draggable} = this.props;

    const tdColumns = this.tdColumns;
    const isExpandable = this.isExpandableTable();
    const extraCount = this.getExtraColumnCount();

    return (
      <colgroup>
        {draggable ? (
          <col
            className={cx('Table-drag-col')}
            style={{width: DefaultCellWidth + 'px'}}
          ></col>
        ) : null}
        {!draggable && rowSelection ? (
          <col
            className={cx('Table-selection-col')}
            style={{
              width: (rowSelection.columnWidth || DefaultCellWidth) + 'px'
            }}
          ></col>
        ) : null}
        {!draggable && isExpandable ? (
          <col
            className={cx('Table-expand-col')}
            style={{
              width: (expandable?.columnWidth || DefaultCellWidth) + 'px'
            }}
          ></col>
        ) : null}
        {tdColumns.map((data, index) => {
          const width = colWidths ? colWidths[index + extraCount] : data.width;

          return (
            <col
              key={index}
              style={{width: typeof width === 'number' ? width + 'px' : width}}
              className={
                data.className ? cx(`Table-colgroup-${data.className}`) : ''
              }
            ></col>
          );
        })}
      </colgroup>
    );
  }

  onResizeMouseDown(event: any, index: number) {
    // 点击记录起始坐标
    this.resizeStart = event.clientX;

    // 用2个table实现的时候 会出现2个colgroup
    // 理论上 宽度要始终保持一致
    const colGroup = this.tableDom.current?.getElementsByTagName('colgroup');
    let currentWidth = 0;
    const children = [];
    if (colGroup) {
      for (let i = 0; i < colGroup.length; i++) {
        const child = colGroup[i].children[index] as HTMLElement;
        if (child) {
          currentWidth = child.offsetWidth
          children.push(child);
        }
      }
    }

    this.resizeWidth = currentWidth;
    this.resizeTarget = children;

    document.addEventListener('mousemove', this.onResizeMouseMove);
    document.addEventListener('mouseup', this.onResizeMouseUp);

    event && event.stopPropagation();
  }

  @autobind
  onResizeMouseMove(event: any) {
    // 点击了调整列宽
    if (this.resizeStart) {
      // 计算横向移动距离
      const distance = event.clientX - this.resizeStart;

      let newWidth = 0;
      // 调宽列
      // tableLayout为auto情况下 实际宽度并不受width实际控制 表格会根据列内容自动调整
      // 设置scroll.x或者column设置了width 都会将tableLayout设置为fixed
      if (distance > 0) {
        newWidth = this.resizeWidth + distance;
      } else {
        // 缩短列
        newWidth = Math.max(this.resizeWidth + distance, DefaultCellWidth);
      }
      this.resizeTarget.forEach(target => {
        if (target) {
          target.style.width = newWidth + 'px';
        }
      });
    }
    event && event.stopPropagation();
  }

  @autobind
  onResizeMouseUp(event: MouseEvent) {
    document.removeEventListener('mousemove', this.onResizeMouseMove);
    document.removeEventListener('mouseup', this.onResizeMouseUp);

    this.resizeStart = 0;
    this.resizeWidth = 0;
    this.resizeTarget = [];
  }

  renderTHead() {
    const {
      rowSelection,
      dataSource,
      classnames: cx,
      onSort,
      expandable,
      draggable,
      resizable,
      onSelectAll,
      onFilter
    } = this.props;

    const thColumns = this.thColumns;
    const tdColumns = this.tdColumns;

    // 获取一行最多th个数
    let maxCount = 0;
    thColumns.forEach(columns => {
      if (columns.length > maxCount) {
        maxCount = columns.length;
      }
    });
    const keyField = this.getRowSelectionKeyField();
    const dataList =
      rowSelection && rowSelection.getCheckboxProps
        ? this.state.dataSource.filter((data, index) => {
            const props = rowSelection.getCheckboxProps(data, index);
            return !props.disabled;
          })
        : this.state.dataSource;

    const isExpandable = this.isExpandableTable();

    let allRowKeys: Array<string> = [];
    let allRows: Array<any> = [];
    dataList.forEach(data => {
      allRowKeys.push(data[keyField]);
      allRows.push(data);
      if (!expandable && this.hasChildrenRow(data)) {
        allRowKeys = [...allRowKeys, ...this.getDataChildrenKeys(data)];
        data[this.getChildrenColumnName()].forEach((item: any) =>
          allRows.push(item)
        );
      }
    });

    return (
      <thead ref={this.theadDom} className={cx('Table-thead')}>
        {thColumns.map((data, index) => {
          return (
            <tr key={'th-cell-' + index}>
              {draggable && index === 0 ? (
                <Cell
                  wrapperComponent="th"
                  rowSpan={thColumns.length}
                  className={cx('Table-dragCell')}
                ></Cell>
              ) : null}
              {!draggable && rowSelection && index === 0 ? (
                <Cell
                  wrapperComponent="th"
                  rowSpan={thColumns.length}
                  fixed={rowSelection.fixed ? 'left' : ''}
                  className={cx('Table-checkCell')}
                >
                  {rowSelection.type !== 'radio'
                    ? [
                        <CheckBox
                          key="checkAll"
                          partial={
                            this.state.selectedRowKeys.length > 0 &&
                            this.state.selectedRowKeys.length <
                              allRowKeys.length
                          }
                          checked={this.state.selectedRowKeys.length > 0}
                          onChange={async value => {
                            let changeRows;
                            if (value) {
                              changeRows = dataList.filter(
                                data => !this.hasCheckedRows(data)
                              );
                            } else {
                              changeRows = this.selectedRows;
                            }
                            const selectedRows = value ? allRows : [];
                            const selectedRowKeys = value ? allRowKeys : [];
                            if (onSelectAll) {
                              const prevented = await onSelectAll(
                                selectedRows,
                                value ? [] : selectedRows,
                                changeRows
                              );
                              if (prevented) {
                                return;
                              }
                            }

                            this.setState({selectedRowKeys});
                          }}
                        ></CheckBox>,
                        rowSelection.selections &&
                        rowSelection.selections.length > 0 ? (
                          <HeadCellSelect
                            key="checkSelection"
                            keys={allRowKeys}
                            selections={rowSelection.selections}
                            popOverContainer={this.getPopOverContainer}
                          ></HeadCellSelect>
                        ) : null
                      ]
                    : null}
                </Cell>
              ) : null}
              {!draggable && isExpandable && index === 0 ? (
                <Cell
                  wrapperComponent="th"
                  rowSpan={thColumns.length}
                  fixed={expandable && expandable.fixed ? 'left' : ''}
                  className={cx('Table-row-expand-icon-cell')}
                ></Cell>
              ) : null}
              {data.map((item, i) => {
                let sort = null;
                if (item.sorter) {
                  sort = (
                    <HeadCellSort
                      column={item}
                      onSort={
                        onSort
                          ? onSort
                          : (payload: SortProps) => {
                              if (typeof item.sorter === 'function') {
                                if (payload.orderBy) {
                                  const sortList = [...this.state.dataSource];
                                  this.setState({
                                    dataSource: sortList.sort(
                                      item.sorter as (a: any, b: any) => number
                                    )
                                  });
                                } else {
                                  this.setState({dataSource: [...dataSource]});
                                }
                              }
                            }
                      }
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
                      popOverContainer={this.getPopOverContainer}
                      onFilter={onFilter}
                    ></HeadCellFilter>
                  );
                }

                // th的最后一行才可调整列宽
                // 分组情况下 最后一行才和列配置个数对应
                // 就可以根据index找到col 不依赖key
                const noChildren = !item.children?.length;
                let cIndex = -1;
                if (noChildren) {
                  // 根据key去tdColumns匹配出index
                  // 没设置key的 那一定不是要绑定数据的列 一般都是分组的上层 也不会出现调整列宽
                  cIndex = tdColumns.findIndex(c => c.key === item.key);
                }
                const children = !item.children?.length ? (
                  <span>
                    {sort}
                    {filter}
                    {resizable ? (
                      <i
                        className={cx('Table-thead-resizable')}
                        onMouseDown={e => this.onResizeMouseDown(e, cIndex)}
                      ></i>
                    ) : null}
                  </span>
                ) : null;

                return (
                  <Cell
                    wrapperComponent="th"
                    rowSpan={item.rowSpan}
                    colSpan={item.colSpan}
                    key={`cell-${i}`}
                    fixed={item.fixed === true ? 'left' : item.fixed}
                    className={cx({
                      'Table-cell-last':
                        i === maxCount - 1 && i === data.length - 1
                    })}
                    groupId={item.groupId}
                    depth={item.depth}
                  >
                    {typeof item.title === 'function'
                      ? item.title(children)
                      : item.title}
                  </Cell>
                );
              })}
            </tr>
          );
        })}
      </thead>
    );
  }

  async onRowClick(
    event: React.ChangeEvent<any>,
    record?: any,
    rowIndex?: number
  ) {
    const {rowSelection, onRow} = this.props;

    if (onRow && onRow.onRowClick) {
      const prevented = await onRow.onRowClick(event, record, rowIndex);
      if (prevented) {
        return;
      }
    }

    if (rowSelection && rowSelection.type && rowSelection.rowClick) {
      const defaultKey = this.getRowSelectionKeyField();

      const isSelected = !!find(
        this.state.selectedRowKeys,
        key => key === record[defaultKey]
      );

      this.selectedSingleRow(!isSelected, record);
    }
  }

  onRowMouseEnter(
    event: React.ChangeEvent<any>,
    record?: any,
    rowIndex?: number
  ) {
    const {classnames: cx, onRow} = this.props;

    let parent = event.target;
    while (parent && parent.tagName !== 'TR') {
      parent = parent.parentElement;
    }

    if (parent && !parent.classList.contains(cx('Table-row-disabled'))) {
      for (let i = 0; i < parent.children.length; i++) {
        const td = parent.children[i];
        td.classList.add(cx('Table-cell-row-hover')); // 保证有列fixed的时候样式一致
      }
    }

    if (record) {
      let target = event.target;
      if (target.tagName !== 'TR') {
        target = target.closest('tr');
      }

      this.setState({hoverRow: {target, rowIndex, record}}, () => {
        if (onRow) {
          onRow.onRowMouseEnter &&
            onRow.onRowMouseEnter(event, record, rowIndex);
        }
      });
    }
  }

  onRowMouseLeave(
    event: React.ChangeEvent<any>,
    record?: any,
    rowIndex?: number
  ) {
    const {classnames: cx, onRow} = this.props;

    let parent = event.target;
    while (parent && parent.tagName !== 'TR') {
      parent = parent.parentElement;
    }

    if (parent) {
      for (let i = 0; i < parent.children.length; i++) {
        const td = parent.children[i];
        td.classList.remove(cx('Table-cell-row-hover'));
      }
    }

    if (record) {
      if (onRow) {
        onRow.onRowMouseLeave && onRow.onRowMouseLeave(event, record, rowIndex);
      }
    }
  }

  onMouseLeave() {
    this.setState({hoverRow: null});
  }

  onExpandRow(data: any) {
    const {expandedRowKeys} = this.state;
    const {expandable} = this.props;
    const key = data[this.getExpandableKeyField()];
    this.setState({expandedRowKeys: [...expandedRowKeys, key]});
    expandable?.onExpand && expandable?.onExpand(true, data);
  }

  onCollapseRow(data: any) {
    const {expandedRowKeys} = this.state;
    const {expandable} = this.props;
    const key = data[this.getExpandableKeyField()];
    // 还是得模糊匹配 否则'3'、3匹配不上
    this.setState({expandedRowKeys: expandedRowKeys.filter(k => k != key)});
    expandable?.onExpand && expandable?.onExpand(false, data);
  }

  getChildrenColumnName() {
    const {childrenColumnName} = this.props;

    return childrenColumnName || 'children';
  }

  getRowSelectionKeyField() {
    const {rowSelection} = this.props;

    return rowSelection ? rowSelection.keyField || 'key' : '';
  }

  getExpandableKeyField() {
    const {expandable, keyField} = this.props;

    return expandable?.keyField || keyField || 'key';
  }

  hasChildrenRow(data: any) {
    const key = this.getChildrenColumnName();
    return data[key] && Array.isArray(data[key]) && data[key].length > 0;
  }

  // 展开和嵌套不能共存
  isExpandableRow(data: any, rowIndex: number) {
    const {expandable} = this.props;

    return (
      expandable &&
      expandable.rowExpandable &&
      expandable.rowExpandable(data, rowIndex)
    );
  }

  // 获取当前行数据所有子行的key值
  getDataChildrenKeys(data: any) {
    let keys: Array<string> = [];

    if (this.hasChildrenRow(data)) {
      const key = this.getChildrenColumnName();
      data[key].forEach(
        (item: any) =>
          (keys = [
            ...keys,
            ...this.getDataChildrenKeys(item),
            item[this.getRowSelectionKeyField()]
          ])
      );
    }

    return keys;
  }

  hasCheckedRows(data: any) {
    const selectedRowKeys = this.state.selectedRowKeys;
    const childrenKeys = this.getDataChildrenKeys(data);

    return (
      intersection(selectedRowKeys, [
        ...childrenKeys,
        data[this.getRowSelectionKeyField()]
      ]).length > 0
    );
  }

  hasCheckedChildrenRows(data: any) {
    const selectedRowKeys = this.state.selectedRowKeys;
    const childrenKeys = this.getDataChildrenKeys(data);
    const length = intersection(selectedRowKeys, childrenKeys).length;

    return length > 0;
  }

  getExpandedIcons(isExpanded: boolean, record: any) {
    const {classnames: cx} = this.props;

    return isExpanded ? (
      <i
        className={cx('Table-expandBtn', 'is-active')}
        onClick={this.onCollapseRow.bind(this, record)}
      >
        <Icon icon="right-arrow-bold" className="icon" />
      </i>
    ) : (
      <i
        className={cx('Table-expandBtn')}
        onClick={this.onExpandRow.bind(this, record)}
      >
        <Icon icon="right-arrow-bold" className="icon" />
      </i>
    );
  }

  async selectedSingleRow(value: boolean, data: any) {
    const {rowSelection, onSelect} = this.props;

    const defaultKey = this.getRowSelectionKeyField();
    const isRadio = rowSelection && rowSelection.type === 'radio';

    let selectedRowKeys = [];
    if (value) {
      if (isRadio) {
        selectedRowKeys = [data[defaultKey]];
      } else {
        selectedRowKeys = [
          ...this.state.selectedRowKeys,
          data[defaultKey],
          ...this.getDataChildrenKeys(data)
        ].filter((key, i, a) => a.indexOf(key) === i);
      }
    } else {
      if (!isRadio) {
        selectedRowKeys = this.state.selectedRowKeys.filter(
          key =>
            ![data[defaultKey], ...this.getDataChildrenKeys(data)].includes(key)
        );
      }
    }

    if (onSelect) {
      const selectedResult = this.getSelectedRows(
        this.state.dataSource,
        selectedRowKeys
      );
      const prevented = await onSelect(
        selectedResult.selectedRows,
        selectedRowKeys,
        selectedResult.unSelectedRows
      );
      if (prevented) {
        return;
      }
    }

    this.setState({selectedRowKeys});
  }

  renderRow(data: any, rowIndex: number, levels: Array<number>) {
    const {
      classnames: cx,
      rowSelection,
      expandable,
      draggable,
      indentSize,
      rowClassName,
      keyField,
      lineHeight // 是否设置了固定行高
    } = this.props;

    const tdColumns = this.tdColumns;
    const isExpandable = this.isExpandableTable();
    const defaultKey = this.getRowSelectionKeyField();
    const colCount = this.getExtraColumnCount();

    // 当前行是否可展开
    const isExpandableRow = this.isExpandableRow(data, rowIndex);
    // 当前行是否有children
    const hasChildrenRow = this.hasChildrenRow(data);

    const isExpanded = !!find(
      this.state.expandedRowKeys,
      key => key == data[this.getExpandableKeyField()]
    ); // == 匹配 否则'3'、3匹配不上

    // 设置缩进效果
    const indentDom =
      levels.length > 0 ? (
        <span
          className={cx('Table-row-indent', `indent-level-${levels.length}`)}
          style={
            levels.length > 0
              ? {paddingLeft: indentSize * levels.length + 'px'}
              : {}
          }
        ></span>
      ) : null;

    const cells = tdColumns.map((item, i) => {
      const render =
        item.render && typeof item.render === 'function'
          ? item.render(data[item.key], data, rowIndex, i)
          : null;
      let props = {rowSpan: 1, colSpan: 1};
      let children = render;
      if (render && isObject(render)) {
        props = render.props;
        children = render.children;
        // 如果合并行 且有展开行，那么合并行不生效
        if (props.rowSpan > 1 && isExpandableRow && hasChildrenRow) {
          props.rowSpan === 1;
        }
      }

      const className =
        typeof item.className === 'function'
          ? item.className(data, rowIndex)
          : '';
      return props.rowSpan === 0 || props.colSpan === 0 ? null : (
        <Cell
          key={i}
          {...props}
          fixed={item.fixed === true ? 'left' : item.fixed}
          column={item}
          groupId={item.groupId}
          className={cx({
            [`${className}`]: !!className
          })}
        >
          <div
            className={cx('Table-cell-wrapper', {
              [cx('Table-cell-wrapper-prefix')]:
                i === 0 &&
                (!!indentDom || (levels.length === 0 && hasChildrenRow)),
              [cx(`Table-cell-height-${lineHeight}`)]: !!lineHeight
            })}
          >
            {i === 0 && levels.length > 0 ? indentDom : null}
            {i === 0 && hasChildrenRow
              ? this.getExpandedIcons(isExpanded, data)
              : null}
            {render ? children : data[item.key]}
          </div>
        </Cell>
      );
    });

    const rowClassNameClass =
      rowClassName && typeof rowClassName === 'function'
        ? rowClassName(data, rowIndex)
        : '';

    // 可展开和嵌套不能同时支持
    // 设置了expandable 数据源里有children也就不生效了
    // 拖拽排序 可选、可展开都先不支持了，可以支持嵌套展示
    const checkboxProps =
      rowSelection && rowSelection.getCheckboxProps
        ? rowSelection.getCheckboxProps(data, rowIndex)
        : {};

    const expandedRowClassName =
      expandable &&
      expandable.expandedRowClassName &&
      typeof expandable.expandedRowClassName === 'function'
        ? expandable.expandedRowClassName(data, rowIndex)
        : '';
    const dataKey = this.getChildrenColumnName();

    const children =
      !draggable && isExpandableRow && isExpanded ? (
        <tr
          key="expanded"
          className={cx('Table-expanded-row', expandedRowClassName)}
        >
          <Cell colSpan={tdColumns.length + colCount}>
            {expandable &&
            expandable.expandedRowRender &&
            typeof expandable.expandedRowRender === 'function'
              ? expandable.expandedRowRender(data, rowIndex)
              : null}
          </Cell>
        </tr>
      ) : this.hasChildrenRow(data) && isExpanded ? (
        data[dataKey].map((item: any, index: number) => {
          return this.renderRow(item, index, [...levels, rowIndex]);
        })
      ) : null;

    const isChecked = !!find(
      this.state.selectedRowKeys,
      key => key === data[defaultKey]
    );
    const hasChildrenChecked = this.hasCheckedChildrenRows(data);
    const isRadio = rowSelection && rowSelection.type === 'radio';

    return [
      <tr
        key={`${data[keyField || 'key'] || rowIndex}`} // 可能会拖拽排序，就不能用rowIndex作为key了，否则显示会有问题
        row-index={rowIndex}
        row-levels={levels.join(',')}
        className={cx(
          'Table-row',
          `Table-row-level-${levels.length}`,
          rowClassNameClass,
          {
            'Table-row-disabled': !!checkboxProps.disabled
          }
        )}
        onMouseEnter={e => this.onRowMouseEnter(e, data, rowIndex)}
        onMouseLeave={e => this.onRowMouseLeave(e, data, rowIndex)}
        onClick={e => this.onRowClick(e, data, rowIndex)}
      >
        {draggable ? (
          <Cell className={cx('Table-dragCell')}>
            <Icon icon="drag-bar" className="icon"></Icon>
          </Cell>
        ) : null}
        {!draggable && rowSelection ? (
          <Cell
            fixed={rowSelection.fixed ? 'left' : ''}
            className={cx('Table-checkCell')}
          >
            <CheckBox
              name={'Table-checkbox'}
              type={rowSelection.type || 'checkbox'}
              partial={!isRadio && hasChildrenChecked && !isChecked}
              checked={isRadio ? isChecked : hasChildrenChecked || isChecked}
              onChange={(value, shift) => {
                if (!(rowSelection && rowSelection.rowClick)) {
                  this.selectedSingleRow(value, data);
                }

                event && event.stopPropagation();
              }}
              {...checkboxProps}
            ></CheckBox>
          </Cell>
        ) : null}
        {!draggable && isExpandable ? (
          <Cell
            fixed={expandable && expandable.fixed ? 'left' : ''}
            className={cx('Table-cell-expand-icon-cell')}
          >
            {isExpandableRow || hasChildrenRow
              ? this.getExpandedIcons(isExpanded, data)
              : null}
          </Cell>
        ) : null}
        {cells}
      </tr>,
      children
    ];
  }

  renderTBody() {
    const {
      classnames: cx,
      headSummary,
      scroll,
      placeholder,
      sticky
    } = this.props;

    const tdColumns = this.tdColumns;
    const hasScrollY = scroll && scroll.y;
    const colCount = this.getExtraColumnCount();
    return (
      <tbody ref={this.tbodyDom} className={cx('Table-tbody')}>
        {!hasScrollY && !sticky && headSummary
          ? this.renderSummaryRow(headSummary)
          : null}
        {!this.state.dataSource.length ? (
          <tr className={cx('Table-row', 'Table-empty-row')}>
            <Cell colSpan={tdColumns.length + colCount}>
              <div className={cx('Table-empty')}>
                {typeof placeholder === 'function'
                  ? placeholder()
                  : placeholder}
              </div>
            </Cell>
          </tr>
        ) : (
          this.state.dataSource.map((data, index) =>
            this.renderRow(data, index, [])
          )
        )}
      </tbody>
    );
  }

  isExpandableTable() {
    const {expandable} = this.props;

    // 设置了expandable 优先级更高
    // 就不支持默认嵌套了
    return !!expandable;
  }

  isNestedTable() {
    const {dataSource} = this.props;
    return !!find(dataSource, item => this.hasChildrenRow(item));
  }

  getExtraColumnCount() {
    const {draggable, rowSelection} = this.props;

    let count = 0;
    if (draggable) {
      count++;
    } else {
      if (this.isExpandableTable()) {
        count++;
      }
      if (rowSelection) {
        count++;
      }
    }

    return count;
  }

  renderSummaryRow(summary: any) {
    const {classnames: cx, dataSource} = this.props;
    const cells: Array<React.ReactNode> = [];
    const trs: Array<React.ReactNode> = [];
    let colCount = this.getExtraColumnCount();

    Array.isArray(summary)
      ? summary.forEach((s, index) => {
          Array.isArray(s)
            ? trs.push(
                <tr
                  onMouseEnter={e => this.onRowMouseEnter(e)}
                  onMouseLeave={e => this.onRowMouseLeave(e)}
                  key={'summary-tr-' + index}
                  className={cx('Table-summary-row')}
                >
                  {s.map((d, i) => {
                    // 将操作列自动添加到第一列，用户的colSpan只需要关心实际的列数
                    const colSpan =
                      i === 0 ? (d.colSpan || 1) + colCount : d.colSpan;
                    return (
                      <Cell
                        key={'summary-tr-cell-' + i}
                        fixed={d.fixed}
                        colSpan={colSpan}
                      >
                        {typeof d.render === 'function'
                          ? d.render(dataSource)
                          : d.render}
                      </Cell>
                    );
                  })}
                </tr>
              )
            : cells.push(
                <Cell
                  key={'summary-cell-' + index}
                  fixed={s.fixed}
                  colSpan={
                    cells.length === 0 ? (s.colSpan || 1) + colCount : s.colSpan
                  }
                >
                  {typeof s.render === 'function'
                    ? s.render(dataSource)
                    : s.render}
                </Cell>
              );
        })
      : null;

    return summary
      ? typeof summary === 'function'
        ? summary(dataSource)
        : [
            cells.length > 0 ? (
              <tr
                onMouseEnter={e => this.onRowMouseEnter(e)}
                onMouseLeave={e => this.onRowMouseLeave(e)}
                key="summary-row"
                className={cx('Table-summary-row')}
              >
                {cells}
              </tr>
            ) : null,
            ...trs
          ]
      : null;
  }

  renderTFoot() {
    const {classnames: cx, footSummary} = this.props;
    return (
      <tfoot ref={this.tfootDom} className={cx('Table-summary')}>
        {this.renderSummaryRow(footSummary)}
      </tfoot>
    );
  }

  updateTableDom(dom: HTMLElement) {
    const {classnames: cx} = this.props;
    const {scrollLeft, scrollWidth, offsetWidth} = dom;
    const table = this.tableDom.current;

    const leftCalss = cx('Table-ping-left');
    if (scrollLeft > 0) {
      table?.classList.add(leftCalss);
    } else {
      table?.classList.remove(leftCalss);
    }

    const rightClass = cx('Table-ping-right');
    if (scrollLeft + offsetWidth < scrollWidth) {
      table?.classList.add(rightClass);
    } else {
      table?.classList.remove(rightClass);
    }
  }

  onTableContentScroll(event: React.ChangeEvent<any>) {
    this.updateTableDom(event.target);
  }

  onWheel(event: WheelEvent) {
    const {currentTarget, deltaX} =
      event as unknown as React.WheelEvent<HTMLDivElement>;

    if (deltaX) {
      this.onTableScroll({
        target: currentTarget,
        scrollLeft: currentTarget.scrollLeft + deltaX
      });

      event.preventDefault();
    }
  }

  onTableScroll(event: any) {
    const scrollDomRefs = [this.headerDom, this.bodyDom, this.footDom];

    const {target, scrollLeft} = event;

    scrollDomRefs.forEach(ref => {
      const current = ref && ref.current;
      if (current && current !== target) {
        current.scrollLeft = scrollLeft || target.scrollLeft;
      }
    });

    this.updateTableDom(target);
  }

  renderLoading() {
    const {classnames: cx, loading} = this.props;
    return (
      <div className={cx('Table-loading')}>
        {typeof loading === 'boolean' ? <Spinner></Spinner> : loading}
      </div>
    );
  }

  renderTable() {
    const {
      scroll,
      footSummary,
      loading,
      showHeader,
      itemActions,
      classnames: cx
    } = this.props;

    // 设置了横向滚动轴 则table的table-layout为fixed
    const hasScrollX = scroll && scroll.x;
    const hoverRow = this.state.hoverRow;
    // 如果设置了列宽 那么table-layout为fixed才能生效
    const columnWidth = this.tdColumns.some(item => item.width);

    const tableLayout = hasScrollX || columnWidth ? 'fixed' : 'auto';
    const tableStyle = hasScrollX ? {width: scroll.x + 'px'} : {};

    return (
      <div
        ref={this.contentDom}
        className={cx('Table-content')}
        style={hasScrollX ? {overflow: 'auto hidden'} : {}}
        onMouseLeave={this.onMouseLeave.bind(this)}
        onScroll={this.onTableContentScroll.bind(this)}
      >
        {itemActions && hoverRow ? (
          <ItemActionsWrapper dom={hoverRow.target} classnames={cx}>
            {typeof itemActions === 'function'
              ? itemActions(hoverRow.record, hoverRow.rowIndex)
              : null}
          </ItemActionsWrapper>
        ) : null}
        <table
          style={{...tableStyle, tableLayout}}
          className={cx('Table-table')}
        >
          {this.renderColGroup()}
          {showHeader ? this.renderTHead() : null}
          {!loading ? this.renderTBody() : null}
          {!loading && footSummary ? this.renderTFoot() : null}
        </table>
        {loading ? this.renderLoading() : null}
      </div>
    );
  }

  renderScrollTableHeader() {
    const {
      scroll,
      headSummary,
      sticky,
      showHeader,
      classnames: cx
    } = this.props;

    const style = {overflow: 'hidden'};
    if (!!sticky) {
      Object.assign(style, {top: 0});
    }

    const tableStyle = {};
    if (scroll && (scroll.y || scroll.x)) {
      Object.assign(tableStyle, {
        width: scroll && scroll.x ? scroll.x + 'px' : '100%',
        tableLayout: 'fixed'
      });
    }

    return (
      <div
        ref={this.headerDom}
        className={cx('Table-header', {
          [cx('Table-sticky-holder')]: !!sticky
        })}
        style={style}
      >
        <table className={cx('Table-table')} style={tableStyle}>
          {this.renderColGroup(this.state.colWidths)}
          {showHeader ? this.renderTHead() : null}
          {headSummary ? (
            <tbody>{this.renderSummaryRow(headSummary)}</tbody>
          ) : null}
        </table>
      </div>
    );
  }

  renderScrollTableBody() {
    const {scroll, itemActions, classnames: cx} = this.props;

    const style = {};
    const tableStyle = {};
    if (scroll && (scroll.y || scroll.x)) {
      Object.assign(style, {
        overflow: 'auto scroll',
        maxHeight: scroll.y
      });

      Object.assign(tableStyle, {
        width: scroll && scroll.x ? scroll.x + 'px' : '100%',
        tableLayout: 'fixed'
      });
    }

    const hoverRow = this.state.hoverRow;

    return (
      <div
        ref={this.bodyDom}
        className={cx('Table-body')}
        style={style}
        onMouseLeave={this.onMouseLeave.bind(this)}
        onScroll={this.onTableScroll.bind(this)}
      >
        {itemActions && hoverRow ? (
          <ItemActionsWrapper dom={hoverRow.target} classnames={cx}>
            {typeof itemActions === 'function'
              ? itemActions(hoverRow.record, hoverRow.rowIndex)
              : null}
          </ItemActionsWrapper>
        ) : null}
        <table className={cx('Table-table')} style={tableStyle}>
          {this.renderColGroup()}
          {this.renderTBody()}
        </table>
      </div>
    );
  }

  renderScrollTableFoot() {
    const {scroll, classnames: cx} = this.props;

    return (
      <div
        ref={this.footDom}
        className={cx('Table-summary')}
        style={{overflow: 'hidden'}}
      >
        <table
          className={cx('Table-table')}
          style={{width: scroll?.x + 'px' || '100%', tableLayout: 'fixed'}}
        >
          {this.renderTFoot()}
        </table>
      </div>
    );
  }

  renderScrollTable() {
    const {footSummary, loading, classnames: cx} = this.props;

    return (
      <div className={cx('Table-container')}>
        {this.renderScrollTableHeader()}
        {!loading ? this.renderScrollTableBody() : null}
        {!loading && footSummary ? this.renderScrollTableFoot() : null}
        {loading ? this.renderLoading() : null}
      </div>
    );
  }

  render() {
    const {
      title,
      footer,
      className,
      scroll,
      size,
      bordered,
      resizable,
      columns,
      sticky,
      classnames: cx
    } = this.props;

    // 过滤掉设置了breakpoint属性的列
    const filterColumns = columns.filter(
      item => !item.breakpoint || !isBreakpoint(item.breakpoint)
    );

    this.thColumns = [];
    this.tdColumns = [];
    buildColumns(filterColumns, this.thColumns, this.tdColumns);

    // 是否设置了纵向滚动
    const hasScrollY = scroll && scroll.y;
    // 是否设置了横向滚动
    const hasScrollX = scroll && scroll.x;

    return (
      <div
        ref={this.tableDom}
        className={cx('Table-v2', className, {
          [cx('Table-scroll-horizontal')]: hasScrollX,
          [cx(`Table-${size}`)]: size,
          [cx('Table-bordered')]: bordered,
          [cx('Table-resizable')]: resizable
        })}
      >
        {title ? (
          <div className={cx('Table-title')}>
            {typeof title === 'function' ? title() : title}
          </div>
        ) : null}

        {hasScrollY || sticky ? (
          this.renderScrollTable()
        ) : (
          <div className={cx('Table-container')}>{this.renderTable()}</div>
        )}

        {footer ? (
          <div className={cx('Table-footer')}>
            {typeof footer === 'function' ? footer() : footer}
          </div>
        ) : null}
      </div>
    );
  }
}

export default themeable(localeable(Table));
