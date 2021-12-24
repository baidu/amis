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
import Sortable from 'sortablejs';

import {themeable, ClassNamesFn, ThemeProps} from '../../theme';
import {localeable, LocaleProps} from '../../locale';
import {isObject} from '../../utils/helper';
import {Icon} from '../icons';
import CheckBox from '../Checkbox';
import HeadCellSort from './HeadCellSort';
import HeadCellFilter from './HeadCellFilter';
import Cell from './Cell';

export interface ColumnProps {
  title: string | React.ReactNode | Function;
  key: string;
  className?: string;
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
  align?: string; // left/right/center
}

export interface ThProps extends ColumnProps {
  rowSpan: number;
  colSpan: number;
}

export interface TdProps extends ColumnProps {
  rowSpan: number;
  colSpan: number;
}

export interface RowSelectionProps {
  type: string;
  fixed: boolean; // 只能固定在左边
  selectedRowKeys: Array<string | number>;
  keyField?: string; // 默认是key，可自定义
  columnWidth?: number;
  onChange: Function;
  onSelect: Function;
  onSelectAll: Function;
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

export interface ExchangeRecord {
  [index: number]: number
}

export interface TableProps extends ThemeProps, LocaleProps {
  title: string | React.ReactNode | Function;
  footer: string | React.ReactNode | Function;
  className?: string;
  dataSource: Array<any>;
  classnames: ClassNamesFn
  columns: Array<ColumnProps>;
  scroll?: ScrollProps;
  rowSelection?: RowSelectionProps,
  onSort?: Function;
  expandable?: ExpandableProps;
  bordered?: boolean;
  size?: string; // default | middle | small
  headSummary?: Function | React.ReactNode | Array<SummaryProps | Array<SummaryProps>>;
  footSummary?: Function | React.ReactNode | Array<SummaryProps | Array<SummaryProps>>;
  draggable?: boolean;
  resizable?: boolean; // 列宽调整
  placeholder?: string | React.ReactNode | Function; // 数据为空展示
  loading?: boolean; // 数据加载中
}

export interface ScrollProps {
  x: number | string | true;
  y: number | string;
}

export interface TableState {
  selectedRowKeys: Array<string | number>;
  selectedRows: Array<any>;
  dataSource: Array<any>;
  expandedRowKeys: Array<string | number>;
}

function getMaxLevelThRowSpan(columns: Array<ColumnProps>) {
  let maxLevel = 0;
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

  return column.children.length;
}

function getThColumns(
  columns: Array<ColumnProps> = [],
  thColumns: Array<Array<any>>,
  depth: number = 0,
  fixed?: boolean | string
) {
  const ths: Array<any> = [];
  const maxLevel = getMaxLevelThRowSpan(columns);
  // 在处理表头时，如果父级column设置了fixed属性，那么所有children保持一致
  columns.forEach(column => {
    let childMaxLevel = 0;
    if (column.children) {
      childMaxLevel = getMaxLevelThRowSpan(column.children);
    }
    const newColumn = {...column, rowSpan: maxLevel - childMaxLevel, colSpan: getThColSpan(column)};
    if (fixed) {
      newColumn.fixed = fixed;
    }
    const index = thColumns.length - depth;
    if (thColumns[index]) {
      thColumns[index].push(newColumn);
    }
    else {
      ths.push(newColumn);
    }
    if (column.children) {
      getThColumns(column.children, thColumns, depth + 1, column.fixed);
    }
  });
  if (ths.length > 0) {
    thColumns.unshift(ths);
  }
}

export function getTdColumns(
  columns: Array<ColumnProps> = [],
  tds: Array<ColumnProps> = [],
  fixed?: boolean | string
) {
  columns.forEach(column => {
    if (column.children) {
      getTdColumns(column.children, tds, column.fixed);
    }
    else {
      // 如果父级设置了fixed 子级设置了 也是以父级的为主
      if (fixed) {
        column.fixed = fixed;
      }
      tds.push(column);
    }
  });
}

function isFixedLeftColumn(fixed: boolean | string | undefined) {
  return fixed === true || fixed === 'left';
}

function isFixedRightColumn(fixed: boolean | string | undefined) {
  return fixed === 'right';
}

function getPreviousLeftWidth(doms: HTMLCollection, index: number, columns: Array<ColumnProps>) {
  let width = 0;
  for (let i = 0; i < index; i++) {
    if (columns && columns[i] && isFixedLeftColumn(columns[i].fixed)) {
      const dom = doms[i] as HTMLElement;
      width += dom.offsetWidth;
    }
  }
  return width;
}

function getAfterRightWidth(doms: HTMLCollection, index: number, columns: Array<ColumnProps>) {
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

export class Table extends React.PureComponent<TableProps, TableState> {
  static defaultProps = {
    title: '',
    className: '',
    dataSource: [],
    columns: []
  };

  constructor(props: TableProps) {
    super(props);

    const selectedRows: Array<any> = [];
    if (props.rowSelection) {
      props.dataSource.forEach(data => {
        if (find(props.rowSelection?.selectedRowKeys,
            key => key === data[props.rowSelection?.keyField || 'key'])) {
          selectedRows.push(data);
        }
      });
    }

    this.state = {
      selectedRowKeys: props.rowSelection ? (props.rowSelection.selectedRowKeys || []) : [],
      selectedRows,
      dataSource: props.dataSource || [],
      expandedRowKeys: [
        ...(props.expandable ? (props.expandable.expandedRowKeys || []) : []),
        ...props.expandable ? (props.expandable.defaultExpandedRowKeys || []) : []
      ]
    };

    this.exchangeRecord = {};

    this.onRowMouseEnter = this.onRowMouseEnter.bind(this);
    this.onRowMouseLeave = this.onRowMouseLeave.bind(this);
    this.onTableContentScroll = this.onTableContentScroll.bind(this);
    this.onTableScroll = this.onTableScroll.bind(this);
    this.getPopOverContainer = this.getPopOverContainer.bind(this);
  }

  getPopOverContainer() {
    return findDOMNode(this);
  }

  // 记录顺序调整
  exchangeRecord: ExchangeRecord;
  tdColumns: Array<TdProps>;
  thColumns: Array<Array<ThProps>>;
  sortable: Sortable;
  // 记录点击起始横坐标
  resizeStart: number;
  resizeKey: string;

  tableDom: React.RefObject<HTMLDivElement> = React.createRef();
  theadDom: React.RefObject<HTMLTableSectionElement> = React.createRef();
  tbodyDom: React.RefObject<HTMLTableSectionElement> = React.createRef();
  contentDom: React.RefObject<HTMLDivElement> = React.createRef();
  headerDom: React.RefObject<HTMLDivElement> = React.createRef();
  bodyDom: React.RefObject<HTMLDivElement> = React.createRef();
  footDom: React.RefObject<HTMLTableSectionElement> = React.createRef();

  updateTableBodyFixed() {
    const tbodyDom = this.tbodyDom && (this.tbodyDom.current as HTMLElement);
    const tdColumns = [...this.tdColumns];
    this.updateTbodyFixedRow(tbodyDom, tdColumns);
    this.updateHeadSummaryFixedRow(tbodyDom);
  }

  componentDidMount() {
    if (this.props.loading) {
      return;
    }
    if (hasFixedColumn(this.props.columns)) {
      const theadDom = this.theadDom && (this.theadDom.current as HTMLElement);
      const thColumns = this.thColumns;
      this.updateTheadFixedRow(theadDom, thColumns);
      const headerDom = this.headerDom && (this.headerDom.current as HTMLElement);
      if (headerDom) {
        const headerBody = headerDom.getElementsByTagName('tbody');
        headerBody && headerBody[0] && this.updateHeadSummaryFixedRow(headerBody[0]);
      }

      // 同步数据 dom加载后直接更新
      this.updateTableBodyFixed();

      const footDom = this.footDom && (this.footDom.current as HTMLElement);
      footDom && this.updateFootSummaryFixedRow(footDom);
    }

    let current = null;
    if (this.contentDom && this.contentDom.current) {
      current = this.contentDom.current;
      current.addEventListener('scroll', this.onTableContentScroll.bind(this));
    } else {
      current = this.headerDom?.current;
      this.headerDom && this.headerDom.current
        && this.headerDom.current.addEventListener('scroll', this.onTableScroll.bind(this));
      this.bodyDom && this.bodyDom.current
        && this.bodyDom.current.addEventListener('scroll', this.onTableScroll.bind(this));
    }
    current && this.updateTableDom(current);

    if (this.props.draggable) {
      this.initDragging();
    }

    if (this.props.resizable) {
      this.theadDom.current?.addEventListener('mouseup', this.onResizeMouseUp.bind(this));
    }
  }

  componentDidUpdate(prevProps: TableProps, prevState: TableState) {
    // 数据源发生了变化
    if (!isEqual(prevProps.dataSource, this.props.dataSource)) {
      this.setState({dataSource: [...this.props.dataSource]},
        () => {
          if (hasFixedColumn(this.props.columns)) {
            this.updateTableBodyFixed();
          }
        }); // 异步加载数据需求再更新一次
    }
    // 选择项发生了变化触发
    if (!isEqual(prevState.selectedRowKeys, this.state.selectedRowKeys)) {
      const {rowSelection} = this.props;
      rowSelection && rowSelection.onChange
        && rowSelection.onChange(this.state.selectedRowKeys, this.state.selectedRows);
    }
    // 展开行变化时触发
    if (!isEqual(prevState.expandedRowKeys, this.state.expandedRowKeys)) {
      if (this.props.expandable) {
        const {onExpandedRowsChange, keyField} = this.props.expandable;
        const expandedRows: Array<any> = [];
        this.state.dataSource.forEach(item => {
          if (find(this.state.expandedRowKeys, key => key === item[keyField || 'key'])) {
            expandedRows.push(item);
          }
        });
        onExpandedRowsChange && onExpandedRowsChange(expandedRows);
      }
    }
  }

  componentWillUnmount() {
    this.contentDom && this.contentDom.current
      && this.contentDom.current.removeEventListener('scroll', this.onTableContentScroll.bind(this));
    this.headerDom && this.headerDom.current
      && this.headerDom.current.removeEventListener('scroll', this.onTableScroll.bind(this));
    this.bodyDom && this.bodyDom.current
      && this.bodyDom.current.removeEventListener('scroll', this.onTableScroll.bind(this));

    this.destroyDragging();
  }

  exchange(fromIndex: number, toIndex: number, item?: any) {
    const {scroll, headSummary} = this.props;
    // 如果有头部总结行 fromIndex就会+1
    if ((!scroll || scroll && !scroll.y) && headSummary) {
      fromIndex = fromIndex - 1;
    }

    // 记录下交换顺序 估计会有用
    // 本身sortable就更新视图了 就不要再setState触发试图更新了 会有问题
    this.exchangeRecord[fromIndex] = toIndex;
  }

  initDragging() {
    const {classnames: cx} = this.props;

    this.sortable = new Sortable(
      this.tbodyDom.current as HTMLElement,
      {
        group: 'table',
        animation: 150,
        handle: `.${cx('Table-dragCell')}`,
        ghostClass: 'is-dragging',
        onMove: (e: any) => {
          if (e.related && e.related.classList.contains(`${cx('Table-summary-row')}`)) {
            return false;
          }
          return true;
        },
        onEnd: (e: any) => {
          // 没有移动
          if (e.newIndex === e.oldIndex) {
            return;
          }

          this.exchange(e.oldIndex, e.newIndex);
        }
      }
    );
  }

  destroyDragging() {
    this.sortable && this.sortable.destroy();
  }

  // 更新一个tr下的td的left和class
  updateFixedRow(row: HTMLElement, columns: Array<ColumnProps>) {
    const {classnames: cx} = this.props;

    const children = row.children;
    for (let i = 0; i < children.length; i++) {
      const dom = children[i] as HTMLElement;
      const fixed = columns[i] ? (columns[i].fixed || '') : '';
      if (isFixedLeftColumn(fixed)) {
        dom.style.left = i > 0 ? getPreviousLeftWidth(children, i, columns) + 'px' : '0';
      } else if (isFixedRightColumn(fixed)) {
        dom.style.right = i < children.length - 1 ? getAfterRightWidth(children, i, columns) + 'px' : '0';
      }
    }
    // 最后一个左fixed的添加样式
    let leftIndex = findLastIndex(columns, column => isFixedLeftColumn(column.fixed));
    if (leftIndex > -1) {
      children[leftIndex]?.classList.add(cx('Table-cell-fix-left-last'));
    }
    // 第一个右fixed的添加样式
    let rightIndex = columns.findIndex(column => isFixedRightColumn(column.fixed));
    if (rightIndex > -1) {
      children[rightIndex]?.classList.add(cx('Table-cell-fix-right-first'));
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
    const children = filter(tbody.children,
      child => !child.classList.contains(cx('Table-summary-row'))
        && !child.classList.contains(cx('Table-empty-row')));
    this.prependColumns(columns);
    for (let i = 0; i < children.length; i++) {
      this.updateFixedRow(children[i] as HTMLElement, columns);
    }
  }

  updateSummaryFixedRow(children: HTMLCollection | Array<Element>, columns: Array<any>) {
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
      const children = filter(tbody.children,
        child => child.classList.contains(cx('Table-summary-row')));
      this.updateSummaryFixedRow(children, columns);
    }
  }

  renderColGroup() {
    const {rowSelection, classnames: cx, expandable, draggable} = this.props;

    const tdColumns = this.tdColumns;
    const isExpandable = !!expandable;

    return (
      <colgroup>
        {draggable
          ? <col
              className={cx('Table-drag-col')}
              style={{width: 50 + 'px'}}></col> : null}
        {!draggable && rowSelection && rowSelection.type
          ? <col className={cx('Table-selection-col')}
              style={{width: (rowSelection.columnWidth || 50) + 'px'}}></col> : null}
        {
          !draggable && isExpandable ? <col
            className={cx('Table-expand-col')}
            style={{width: (expandable.columnWidth || 50) + 'px'}}
          ></col> : null
        }
        {tdColumns.map((data, index) => {
          const width = data.width ? +data.width : data.width;
          return <col
            key={index}
            style={{width: typeof width === 'number' ? width + 'px' : width}}
            className={data.className ? cx(`Table-colgroup-${data.className}`) : ''}>
          </col>;
        })}
      </colgroup>
    );
  }

  onResizeMouseDown(event: React.MouseEvent<any>, key: string) {
    // 点击记录起始坐标
    this.resizeStart = event.clientX;
    // 记录点击的列名
    this.resizeKey = key;
    event && event.stopPropagation();
  }

  onResizeMouseUp(event: React.MouseEvent<any>) {
    // 点击了调整列宽
    if (this.resizeStart && this.resizeKey) {
      // 计算横向移动距离
      const distance = event.clientX - this.resizeStart;
      const tdColumns = [...this.tdColumns];
      let index = tdColumns.findIndex(c => c.key === this.resizeKey) + this.getExtraColumnCount();

      const colGroup = this.tableDom.current?.getElementsByTagName('colgroup')[0];
      let currentWidth = 0;
      if (colGroup && colGroup.children[index]) {
        const child = colGroup.children[index] as HTMLElement;
        currentWidth = child.offsetWidth;
      }

      const column = find(tdColumns, c => c.key === this.resizeKey);
      if (column) {
        column.width = currentWidth + distance;
      }

      this.tdColumns = tdColumns;

      this.resizeStart = 0;
      this.resizeKey = '';
    }
    event && event.stopPropagation();
  }

  renderTHead() {
    const {
      rowSelection,
      dataSource,
      classnames: cx,
      onSort,
      expandable,
      draggable,
      resizable
    } = this.props;

    const thColumns = this.thColumns;
    const keyField = rowSelection ? (rowSelection.keyField || 'key') : '';
    const dataList = rowSelection && rowSelection.getCheckboxProps
      ? this.state.dataSource.filter(data => {
        const props = rowSelection.getCheckboxProps(data);
        return !props.disabled;
      }) : this.state.dataSource;

    const isExpandable = !!expandable;

    return (
    <thead ref={this.theadDom} className={cx('Table-thead')}>
      {thColumns.map((data, index) => {
        return <tr key={index}>
          {
            draggable && index === 0 ? <Cell
              tagName="TH"
              rowSpan={thColumns.length}
              className={cx('Table-dragCell')}></Cell> : null
          }
          {!draggable && rowSelection && index === 0
            ? <Cell
              tagName="TH"
              rowSpan={thColumns.length}
              fixed={rowSelection.fixed ? 'left': ''}>
              {rowSelection.type !== 'radio'
                ? <CheckBox
                  partial={this.state.selectedRowKeys.length > 0 && this.state.selectedRowKeys.length < dataList.length}
                  checked={this.state.selectedRowKeys.length > 0}
                  onChange={value => {
                    let changeRows;
                    if (value) {
                      changeRows = dataList.filter(data => !find(this.state.selectedRowKeys,
                        key => key === data[keyField]));
                    } else {
                      changeRows = this.state.selectedRows;
                    }
                    const selectedRows = value ? dataList : [];
                    this.setState({
                      selectedRowKeys: value ? dataList.map(data => data[keyField]) : [],
                      selectedRows
                    });

                    rowSelection.onSelectAll && rowSelection.onSelectAll(value, selectedRows, changeRows);
                  }}></CheckBox> : null
            }</Cell> : null}
          {
            !draggable && isExpandable && index === 0
              ? <Cell
                  tagName="TH"
                  rowSpan={thColumns.length}
                  fixed={expandable.fixed ? 'left': ''}
                  className={cx('Table-row-expand-icon-cell')}></Cell> : null
          }
          {data.map((item, i) => {
            let sort = null;
            if (item.sorter) {
              sort = (
                <HeadCellSort
                  column={item}
                  onSort={onSort ? onSort : (payload: any) => {
                    if (typeof item.sorter === 'function') {
                      if (payload.orderBy) {
                        const sortList = [...this.state.dataSource];
                        this.setState({dataSource: sortList.sort(item.sorter as (a: any, b: any) => number)});
                      } else {
                        this.setState({dataSource: [...dataSource]});
                      }
                    }
                  }}
                  ></HeadCellSort>
              );
            }

            let filter = null;
            if (item.filters && item.filters.length > 0) {
              filter = (
                <HeadCellFilter
                  column={item}
                  popOverContainer={this.getPopOverContainer}>
                </HeadCellFilter>
              );
            }

            return <Cell
              tagName="TH"
              rowSpan={item.rowSpan}
              colSpan={item.colSpan}
              key={'cell' + (item.key || i)}
              style={sort || filter ? {position: 'relative'} : {}}
              fixed={item.fixed === true ? 'left' : item.fixed}>
                {typeof item.title === 'function' ? item.title() : item.title}
                {sort}
                {filter}
                {resizable ? <i
                  className={cx('Table-thead-resizable')}
                  onMouseDown={e => this.onResizeMouseDown(e, item.key)}></i> : null}</Cell>;
          })
        }</tr>;
      })}
    </thead>
    );
  }

  onRowMouseEnter(event: React.ChangeEvent<any>) {
    const {classnames: cx} = this.props;

    let parent = event.target;
    while (parent.tagName !== 'TR') {
      parent = parent.parentNode;
    }
    if (parent) {
      for (let i = 0; i < parent.children.length; i++) {
        const td = parent.children[i];
        td.classList.add(cx(`Table-cell-row-hover`));
      }
    }
  }

  onRowMouseLeave(event: React.ChangeEvent<any>) {
    const {classnames: cx} = this.props;

    let parent = event.target;
    while (parent.tagName !== 'TR') {
      parent = parent.parentNode;
    }
    if (parent) {
      for (let i = 0; i < parent.children.length; i++) {
        const td = parent.children[i];
        td.classList.remove(cx(`Table-cell-row-hover`));
      }
    }
  }

  onExpandRow(data: any) {
    const {expandedRowKeys} = this.state;
    const {expandable} = this.props;
    const key = data[expandable?.keyField || 'key'];
    this.setState({expandedRowKeys: [...expandedRowKeys, key]});
    expandable?.onExpand && expandable?.onExpand(true, data);
  }

  onCollapseRow(data: any) {
    const {expandedRowKeys} = this.state;
    const {expandable} = this.props;
    const key = data[expandable?.keyField || 'key'];
    // 还是得模糊匹配 否则'3'、3匹配不上
    this.setState({expandedRowKeys: expandedRowKeys.filter(k => k != key)});
    expandable?.onExpand && expandable?.onExpand(false, data);
  }

  renderTBody() {
    const {
      classnames: cx,
      rowSelection,
      expandable,
      headSummary,
      scroll,
      draggable,
      placeholder
    } = this.props;

    const tdColumns = this.tdColumns;
    const defaultKey = rowSelection ? (rowSelection.keyField || 'key') : '';
    const isExpandable = !!expandable;
    const hasScrollY = scroll && scroll.y;
    const colCount = this.getExtraColumnCount();
    return (
    <tbody ref={this.tbodyDom} className={cx('Table-tbody')}>
      {!hasScrollY && headSummary ? this.renderSummaryRow(headSummary) : null}
      {
        !this.state.dataSource.length
          ? <tr className={cx('Table-row', 'Table-empty-row')}>
            <Cell colSpan={tdColumns.length + colCount}>
              <div className={cx('Table-empty')}>
                {typeof placeholder === 'function' ? placeholder() : placeholder}
              </div>
            </Cell>
          </tr>
          : this.state.dataSource.map((data, index) => {
          // 当前行是否可展开
          const expandableRow = expandable && expandable.rowExpandable
            && expandable.rowExpandable(data);

          const cells = tdColumns.map((item, i) => {
            const render = item.render && typeof item.render === 'function'
              ? item.render(data[item.key], data, index, i) : null;
            let props = {rowSpan: 1, colSpan: 1};
            let children = render;
            if (render && isObject(render)) {
              props = render.props;
              children = render.children;
              // 如果合并行 且有展开行，那么合并行不生效
              if (props.rowSpan > 1 && expandableRow) {
                props.rowSpan === 1;
              }
            }
            return props.rowSpan === 0 || props.colSpan === 0 ? null : <Cell
              key={i}
              {...props}
              fixed={item.fixed === true ? 'left' : item.fixed}
              column={item}>
              {item.render && typeof item.render === 'function'
                ? children
                : data[item.key]}
            </Cell>;
          });

          // 支持拖拽排序 可选、可展开都先不支持了
          if (draggable) {
            return <tr
              key={'row' + index}
              className={cx('Table-row')}
              onMouseEnter={this.onRowMouseEnter}
              onMouseLeave={this.onRowMouseLeave}>
                <Cell
                  className={cx('Table-dragCell')}>
                  <Icon icon="drag-bar" className="icon"></Icon>
                </Cell>{cells}</tr>;
          }

          const checkboxProps = rowSelection && rowSelection.getCheckboxProps
            ? rowSelection.getCheckboxProps(data) : {};
          const isExpanded = !!find(this.state.expandedRowKeys,
            key => key == data[expandable?.keyField || 'key']); // == 匹配 否则'3'、3匹配不上

          const expandedRowClassName = expandable && expandable.expandedRowClassName
            && typeof expandable.expandedRowClassName === 'function'
              ? expandable.expandedRowClassName(data, index) : ''

          return [<tr
            key={index}
            className={cx('Table-row')}
            onMouseEnter={this.onRowMouseEnter}
            onMouseLeave={this.onRowMouseLeave}>
            {rowSelection
              ? (<Cell
                fixed={rowSelection.fixed ? 'left' : ''}
                className={cx('Table-checkCell')}>
                <CheckBox
                  name={'Table-checkbox'}
                  type={rowSelection.type || 'checkbox'}
                  checked={!!find(this.state.selectedRowKeys, key => key === data[defaultKey])}
                  onChange={
                    (value, shift) => {
                      const isRadio = rowSelection.type === 'radio';

                      const callback = () => {
                        rowSelection.onSelect
                          && rowSelection.onSelect(data, value, this.state.selectedRows);
                      };

                      if (value) {
                        if (isRadio) {
                          this.setState({
                            selectedRowKeys: [data[defaultKey]],
                            selectedRows: [data]
                          }, callback);
                        } else {
                          this.setState(prevState => ({
                            selectedRowKeys: [...prevState.selectedRowKeys, data[defaultKey]],
                            selectedRows: [...prevState.selectedRows, data]
                          }), callback);
                        }
                      } else {
                        if (!isRadio) {
                          this.setState({
                            selectedRowKeys: this.state.selectedRowKeys.filter(key => key !== data[defaultKey]),
                            selectedRows: this.state.selectedRows.filter(item => item[defaultKey] !== data[defaultKey])
                          }, callback);
                        }
                      }

                      event && event.stopPropagation();
                    }
                  }
                  {...checkboxProps}></CheckBox></Cell>) : null}
            {
              isExpandable ? <Cell
                fixed={expandable.fixed ? 'left' : ''}
                className={cx('Table-cell-expand-icon-cell')}>
                {expandableRow ? (isExpanded
                  ? <i
                    className="fa fa-minus-square"
                    onClick={this.onCollapseRow.bind(this, data)}></i>
                  : <i
                    className="fa fa-plus-square"
                    onClick={this.onExpandRow.bind(this, data)}></i>) : null}
              </Cell> : null
            }
            {cells}</tr>, expandableRow
            ? <tr
                key="expanded"
                className={cx('Table-expanded-row', expandedRowClassName)}
                style={isExpanded ? {} : {display: 'none'}}>
                  <Cell colSpan={tdColumns.length + colCount}>
                    {expandable.expandedRowRender
                      && typeof expandable.expandedRowRender === 'function'
                      ? expandable.expandedRowRender(data, index) : null}
                  </Cell>
              </tr> : null];
        })
      }
    </tbody>
    );
  }

  getExtraColumnCount() {
    const {draggable, expandable, rowSelection} = this.props;
    let count = 0;
    if (draggable) {
      count++;
    } else {
      if (expandable) {
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

    (Array.isArray(summary) ? summary.map((s, index) => {
      return (
        Array.isArray(s) ? trs.push(<tr
          onMouseEnter={this.onRowMouseEnter}
          onMouseLeave={this.onRowMouseLeave}
          key={index}
          className={cx('Table-summary-row')}>
          {s.map((d, i) => {
            // 将操作列自动添加到第一列，用户的colSpan只需要关心实际的列数
            const colSpan = i === 0 ? (d.colSpan || 1) + colCount : d.colSpan;
            return <Cell
              key={i}
              fixed={d.fixed}
              colSpan={colSpan}
              >
                {typeof d.render === 'function' ? d.render(dataSource) : d.render}
              </Cell>;
          })}</tr>) : cells.push(
            <Cell
              key={index}
              fixed={s.fixed}
              colSpan={cells.length === 0 ? ((s.colSpan || 1) + colCount) : s.colSpan}>
              {typeof s.render === 'function' ? s.render(dataSource) : s.render}
            </Cell>)
      )
    }) : null)
    return (
      summary ? (typeof summary === 'function'
        ? summary(dataSource) : [
          <tr
            onMouseEnter={this.onRowMouseEnter}
            onMouseLeave={this.onRowMouseLeave}
            key="summary-row"
            className={cx('Table-summary-row')}>{cells}</tr>, trs
          ]) : null
    );
  }

  renderTFoot() {
    const {classnames: cx, footSummary} = this.props;
    return (<tfoot ref={this.footDom} className={cx('Table-summary')}>
      {this.renderSummaryRow(footSummary)}
    </tfoot>);
  }

  updateTableDom(dom: HTMLDivElement) {
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

  onTableScroll(event: React.ChangeEvent<any>) {
    const headerCurrent = this.headerDom.current;
    const bodyCurrent = this.bodyDom.current;
    const target = event.target;
    if (target === bodyCurrent && headerCurrent) {
      headerCurrent.scrollLeft = target.scrollLeft;
    } else if (target === headerCurrent && bodyCurrent) {
      bodyCurrent.scrollLeft = target.scrollLeft;
    }

    this.updateTableDom(target);
  }

  renderLoading() {
    const {classnames: cx} = this.props;
    return <div className={cx('Table-loading')}>加载中</div>;
  }

  renderTable() {
    const {
      scroll,
      footSummary,
      loading,
      classnames: cx
    } = this.props;

    // 设置了横向滚动轴 则table的table-layout为fixed
    const hasScrollX = scroll && scroll.x;

    return (
      <div
        ref={this.contentDom}
        className={cx('Table-content')}
        style={hasScrollX ? {overflow: 'auto hidden'} : {}}>
        <table
            style={hasScrollX
              ? {width: scroll.x + 'px', tableLayout: 'fixed'}
              : {tableLayout: 'auto'}}
            className={cx('Table-table')}>
          {this.renderColGroup()}
          {this.renderTHead()}
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
      classnames: cx
    } = this.props;

    return (
      <div
        ref={this.headerDom}
        className={cx('Table-header')}
        style={{overflow: 'hidden'}}>
        <table
          className={cx('Table-table')}
          style={{width: (scroll?.x + 'px') || '100%', tableLayout: 'fixed'}}>
          {this.renderColGroup()}
          {this.renderTHead()}
          {headSummary ? <tbody>{this.renderSummaryRow(headSummary)}</tbody> : null}
        </table>
      </div>
    );
  }

  renderScrollTableBody() {
    const {
      scroll,
      classnames: cx
    } = this.props;

    return (
      <div
        ref={this.bodyDom}
        className={cx('Table-body')}
        style={{overflow: 'auto scroll', maxHeight: scroll?.y}}>
          <table
            className={cx('Table-table')}
            style={{width: (scroll?.x + 'px') || '100%', tableLayout: 'fixed'}}>
            {this.renderColGroup()}
            {this.renderTBody()}
          </table>
      </div>
    )
  }

  renderScrollTableFoot() {
    const {
      scroll,
      classnames: cx
    } = this.props;

    return (
      <div
        className={cx('Table-summary')}
        style={{overflow: 'hidden'}}>
        <table
          className={cx('Table-table')}
          style={{width: (scroll?.x + 'px') || '100%', tableLayout: 'fixed'}}>
          {this.renderTFoot()}
        </table>
      </div>
    );
  }

  renderScrollTable() {
    const {
      footSummary,
      loading,
      classnames: cx
    } = this.props;

    return (
      <div
        className={cx('Table-container')}>
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
      classnames: cx
    } = this.props;

    this.thColumns = [];
    this.tdColumns = [];
    getThColumns(columns, this.thColumns);
    getTdColumns(columns, this.tdColumns);

    // 是否设置了纵向滚动
    const hasScrollY = scroll && scroll.y;
    // 是否设置了横向滚动
    const hasScrollX = scroll && scroll.x;

    return (
    <div
      ref={this.tableDom}
      className={cx('Table', className, {
        [cx('Table-scroll-horizontal')]: hasScrollX,
        [cx(`Table-${size}`)]: size,
        [cx('Table-bordered')]: bordered,
        [cx('Table-resizable')]: resizable
      })}>
      {title ? <div className={cx('Table-title')}>{
          typeof title === 'function' ? title() : title
      }</div> : ''}

      {hasScrollY ? this.renderScrollTable()
        : <div className={cx('Table-container')}>{this.renderTable()}</div>}

      {footer ? <div className={cx('Table-footer')}>{
        typeof footer === 'function' ? footer() : footer
      }</div> : ''}
    </div>
    );
  }
}

export default themeable(
  localeable(Table)
);
