/**
 * @file Table
 * @author fex
 */

import React from 'react';
import {findDOMNode} from 'react-dom';
import find from 'lodash/find';
import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';
import intersection from 'lodash/intersection';
import Sortable from 'sortablejs';

import {
  themeable,
  ClassNamesFn,
  ThemeProps,
  localeable,
  LocaleProps,
  autobind,
  isObject,
  offset,
  getScrollParent,
  position
} from 'amis-core';
import {resizeSensor} from 'amis-core';
import {getStyleNumber} from 'amis-core';
import {filterTree} from 'amis-core';

import Spinner, {SpinnerExtraProps} from '../Spinner';
import ItemActionsWrapper from './ItemActionsWrapper';
import Cell from './Cell';
import ColGroup from './ColGroup';
import Row from './Row';
import Head from './Head';
import SummaryRows from './SummaryRow';
import {
  checkChildrenRow,
  getDataChildrenKeys,
  getBuildColumns,
  getRowsByKeys,
  levelsSplit,
  getSortData
} from './util';

import type {TestIdBuilder} from 'amis-core';

export interface ColumnProps {
  title: string | React.ReactNode | Function;
  name: string;
  className?: Function;
  children?: Array<ColumnProps>;
  render?: Function;
  fixed?: boolean | string;
  width?: number | string;
  sorter?: ((a: any, b: any, order: string) => number) | boolean; // 设置为true时，执行onSort，否则执行前端排序
  sortOrder?: string; // 升序asc、降序desc
  filters?: Array<any>; // 筛选数据源，配置了数据源才展示
  filterMode?: string; // menu/tree 默认menu 先只支持menu
  filterMultiple?: boolean; // 是否支持多选
  filteredValue?: Array<string>;
  filtered?: boolean;
  filterDropdown?: Function | React.ReactNode; // 列筛选 filterDropdown的优先级更高 和filters两者不能并存
  align?: string; // left/right/center
  breakpoint?: '*' | 'xs' | 'sm' | 'md' | 'lg';
  [propName: string]: any;
}

export interface ThProps extends ColumnProps {
  rowSpan: number;
  colSpan: number;
  depth: number; // 表头分组层级
}

export interface TdProps extends ColumnProps {
  rowSpan: number;
  colSpan: number;
}

export interface RowSelectionOptionProps {
  key: string;
  text: string;
  onSelect: Function;
}

export interface RowSelectionProps {
  type: string;
  rowClick?: boolean; // 点击复选框选中还是点击整行选中
  rowClickIgControl?: boolean; // 点击行或控件，均触发Row的onClick事件
  fixed: boolean; // 只能固定在左边
  selectedRowKeys: Array<string | number>;
  keyField?: string; // 默认是key，可自定义
  columnWidth?: number;
  selections?: Array<RowSelectionOptionProps>;
  onChange?: Function;
  getCheckboxProps: Function;
  maxSelectedLength?: number;
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
  position?: string; // 控制展开按钮的位置 不设置默认是在左侧 设置支持left、right、none
}

export interface SummaryProps {
  colSpan: number; // 手动控制列合并 先不支持列合并
  fixed: string | boolean; // 手动设置左固定还是右固定
  render: Function | React.ReactNode;
  /** 单元格样式，会应用于组件外层的td */
  cellClassName?: string;
}

export interface OnRowProps {
  onRowMouseEnter?: Function;
  onRowMouseLeave?: Function;
  onRowClick?: Function;
  onRowDbClick?: Function;
}

export interface SortProps {
  orderBy: string;
  orderDir: string;
}

export type AutoFillHeightObject = Record<'height' | 'maxHeight', number>;

export interface TableProps extends ThemeProps, LocaleProps, SpinnerExtraProps {
  title: string | React.ReactNode | Function;
  footer?: string | React.ReactNode | Function;
  className?: string;
  dataSource: Array<any>;
  classnames: ClassNamesFn;
  headerClassName?: string;
  bodyClassname?: string;
  rowClassname?: string;
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
  tableLayout?: string; // auto fixed
  onSelect?: Function;
  onSelectAll?: Function;
  itemActions?: Function;
  onRef?: (ref: any) => void;
  /**
   * 表格自动计算高度
   */
  autoFillHeight?: boolean | AutoFillHeightObject;
  lazyRenderAfter?: boolean;
  testIdBuilder?: TestIdBuilder;
}

export interface ScrollProps {
  x: number | string | true;
  y: number | string;
}

export interface TableState {
  selectedRowKeys: Array<string | number>;
  expandedRowKeys: Array<string | number>;
  colWidths: {
    [name: string]: {
      width: number;
      realWidth: number;
      minWidth: number;
      originWidth: number;
    };
  };
  hoverRow: {
    rowIndex?: number;
    record: any;
    target: HTMLTableRowElement;
  } | null;
  sort?: SortProps;
}

export const DefaultCellWidth = 40;

export class Table extends React.PureComponent<TableProps, TableState> {
  static defaultProps = {
    title: '',
    className: '',
    dataSource: [],
    columns: [],
    indentSize: 15,
    placeholder: '暂无数据',
    showHeader: true,
    tableLayout: 'auto'
  };

  constructor(props: TableProps) {
    super(props);

    this.state = {
      selectedRowKeys: props.rowSelection
        ? props.rowSelection.selectedRowKeys.map(key => key) || []
        : [],
      expandedRowKeys: [
        ...(props.expandable ? props.expandable.expandedRowKeys || [] : []),
        ...(props.expandable
          ? props.expandable.defaultExpandedRowKeys || []
          : [])
      ],
      colWidths: {},
      hoverRow: null
    };
  }

  @autobind
  getPopOverContainer() {
    return findDOMNode(this) as HTMLElement;
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
  resizeTarget?: HTMLElement;
  resizeWidth: number;
  resizeIndex: number;

  tableDom: React.RefObject<HTMLDivElement> = React.createRef();
  tbodyDom: React.RefObject<HTMLTableSectionElement> = React.createRef();
  contentDom: React.RefObject<HTMLDivElement> = React.createRef();
  headerDom: React.RefObject<HTMLDivElement> = React.createRef();
  footDom: React.RefObject<HTMLDivElement> = React.createRef();
  containerDom: React.RefObject<HTMLDivElement> = React.createRef();

  toDispose: Array<() => void> = [];
  updateTableInfoLazy = debounce(this.updateTableInfo.bind(this), 250, {
    trailing: true,
    leading: false
  });
  updateAutoFillHeightLazy = debounce(
    this.updateAutoFillHeight.bind(this),
    250,
    {
      trailing: true,
      leading: false
    }
  );

  componentDidMount() {
    this.props?.onRef?.(this);

    if (this.props.loading) {
      return;
    }

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

    const current = this.contentDom?.current;
    current && this.updateTableDom(current);

    if (this.props.draggable && this.tbodyDom?.current) {
      this.initDragging();
    }

    this.updateStickyHeader();

    const currentNode = findDOMNode(this) as HTMLElement;
    if (this.props.autoFillHeight) {
      this.toDispose.push(
        resizeSensor(
          currentNode.parentElement!,
          this.updateAutoFillHeightLazy,
          false,
          'height'
        )
      );
      this.updateAutoFillHeight();
    }

    this.toDispose.push(
      resizeSensor(currentNode, this.updateTableInfoLazy, false, 'width')
    );
  }

  componentDidUpdate(prevProps: TableProps, prevState: TableState) {
    if (
      prevProps.autoFillHeight !== this.props.autoFillHeight ||
      (prevProps.loading !== this.props.loading && this.props.autoFillHeight)
    ) {
      this.updateAutoFillHeight();
    }

    // 选择项发生了变化触发
    if (!isEqual(prevState.selectedRowKeys, this.state.selectedRowKeys)) {
      const rowSelectionKeyField = this.getRowSelectionKeyField();
      const childrenColumnName = this.getChildrenColumnName();
      // 更新保存的已选择行数据
      const selectedResult = getRowsByKeys(
        this.props.dataSource,
        this.state.selectedRowKeys,
        rowSelectionKeyField,
        childrenColumnName
      );
      const {rowSelection} = this.props;
      rowSelection &&
        rowSelection.onChange &&
        rowSelection.onChange(
          this.state.selectedRowKeys,
          selectedResult.selectedRows
        );
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
        const childrenColumnName = this.getChildrenColumnName();
        const expandableKeyField = this.getExpandableKeyField();
        const {onExpandedRowsChange} = this.props.expandable;

        const expandedResult = getRowsByKeys(
          this.props.dataSource,
          this.state.selectedRowKeys,
          expandableKeyField,
          childrenColumnName
        );

        onExpandedRowsChange &&
          onExpandedRowsChange(expandedResult.selectedRows);
      }
    }

    // sticky属性发生了变化
    if (prevProps.sticky !== this.props.sticky) {
      this.updateStickyHeader();
    }

    if (prevProps.columns !== this.props.columns) {
      this.syncTableWidth();
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

    this.toDispose.forEach(fn => fn());
    this.toDispose = [];

    this.updateTableInfoLazy.cancel();
    this.updateAutoFillHeightLazy.cancel();
  }

  /**
   * 自动设置表格高度占满界面剩余区域
   * 用 css 实现有点麻烦，要改很多结构，所以先用 dom hack 了，避免对之前的功能有影响
   */
  @autobind
  updateAutoFillHeight() {
    const tableContent = this.containerDom.current as HTMLElement;

    if (!tableContent) {
      return;
    }

    tableContent.removeAttribute('style');

    const {autoFillHeight} = this.props;
    if (!autoFillHeight) {
      return;
    }

    // 计算 table-content 在 dom 中的位置
    let viewportHeight = window.innerHeight;
    let tableContentTop = offset(tableContent).top;

    const parent = getScrollParent(tableContent.parentElement as HTMLElement);
    if (parent && parent !== document.body) {
      viewportHeight = parent.clientHeight - 1;
      tableContentTop = position(tableContent, parent).top;
    }

    let tableContentBottom = 0;
    let selfNode = tableContent;
    let parentNode = selfNode.parentElement;
    while (parentNode) {
      const paddingBottom = getStyleNumber(parentNode, 'padding-bottom');
      const borderBottom = getStyleNumber(parentNode, 'border-bottom-width');

      let nextSiblingHeight = 0;
      let nextSibling = selfNode.nextElementSibling as HTMLElement;
      while (nextSibling) {
        const positon = getComputedStyle(nextSibling).position;
        if (positon !== 'absolute' && positon !== 'fixed') {
          nextSiblingHeight +=
            nextSibling.offsetHeight +
            getStyleNumber(nextSibling, 'margin-bottom');
        }

        nextSibling = nextSibling.nextElementSibling as HTMLElement;
      }

      const marginBottom = getStyleNumber(selfNode, 'margin-bottom');
      tableContentBottom +=
        paddingBottom + borderBottom + marginBottom + nextSiblingHeight;

      selfNode = parentNode;
      parentNode = selfNode.parentElement;
      if (parent && parent !== document.body && parent === selfNode) {
        break;
      }
    }

    const heightField =
      autoFillHeight && (autoFillHeight as AutoFillHeightObject).maxHeight
        ? 'maxHeight'
        : 'height';

    const heightValue = isObject(autoFillHeight)
      ? (autoFillHeight as AutoFillHeightObject)[heightField]
      : 0;

    const tableContentHeight = heightValue
      ? heightValue
      : Math.round(viewportHeight - tableContentTop - tableContentBottom);

    if (tableContentHeight > 0) {
      tableContent.style[heightField] = `${tableContentHeight}px`;
      tableContent.style['overflow'] = 'auto';
    }
  }

  initDragging() {
    const {classnames: cx, onDrag} = this.props;

    this.sortable = new Sortable(this.tbodyDom?.current as HTMLElement, {
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

        let oldIndex = e.oldIndex;
        let newIndex = e.newIndex;
        const rowLevels = levelsSplit(e.item.getAttribute('row-levels'));
        if (rowLevels.length) {
          let i = 0;
          while (i < rowLevels.length) {
            oldIndex = oldIndex - rowLevels[i] - 1;
            newIndex = newIndex - rowLevels[i] - 1;
            i++;
          }
        }

        onDrag && onDrag(oldIndex, newIndex, rowLevels);
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

  renderColGroup(showReal?: boolean) {
    const {scroll, tableLayout, columns, rowSelection, expandable, draggable} =
      this.props;

    const isFixed = !!((scroll && scroll.x) || tableLayout === 'fixed');
    return (
      <ColGroup
        columns={columns}
        colWidths={this.state.colWidths}
        isFixed={isFixed}
        syncTableWidth={this.syncTableWidth}
        initTableWidth={this.initTableWidth}
        selectable={!!rowSelection}
        expandable={!!expandable}
        draggable={!!draggable}
        rowSelectionColumnWidth={rowSelection?.columnWidth || DefaultCellWidth}
        expandableColumnWidth={expandable?.columnWidth || DefaultCellWidth}
        isRightExpandable={this.isRightExpandable()}
        isLeftExpandable={this.isLeftExpandable()}
        showReal={showReal}
      ></ColGroup>
    );
  }

  onResizeMouseDown(event: any, index: number) {
    // 点击记录起始坐标
    this.resizeStart = event.clientX;
    this.resizeTarget = event.currentTarget;

    const column = this.tdColumns[index];
    this.resizeIndex = index;

    const colWidth = this.state.colWidths[column.name];
    this.resizeWidth = colWidth.width || colWidth.realWidth;

    this.resizeTarget!.classList.add('is-resizing');

    document.addEventListener('mousemove', this.onResizeMouseMove);
    document.addEventListener('mouseup', this.onResizeMouseUp);

    event && event.stopPropagation();
  }

  @autobind
  onResizeMouseMove(event: any) {
    // 点击了调整列宽
    if (this.resizeTarget) {
      // 计算横向移动距离
      const distance = event.clientX - this.resizeStart;
      const column = this.tdColumns[this.resizeIndex];
      let newWidth = 0;
      if (distance > 0) {
        newWidth = this.resizeWidth + distance;
      } else {
        // 缩短列
        newWidth = Math.max(
          this.resizeWidth + distance,
          DefaultCellWidth,
          column.minWidth || 0
        );
      }

      const colWidths = this.state.colWidths;
      colWidths[column.name].width = newWidth;
      this.setState({colWidths: {...colWidths}});
    }
    event && event.stopPropagation();
  }

  @autobind
  onResizeMouseUp(event: MouseEvent) {
    this.resizeTarget!.classList.remove('is-resizing');

    document.removeEventListener('mousemove', this.onResizeMouseMove);
    document.removeEventListener('mouseup', this.onResizeMouseUp);

    this.resizeStart = -1;
    this.resizeWidth = 0;
    delete this.resizeTarget;
  }

  renderHead() {
    const {
      columns,
      classnames: cx,
      classPrefix,
      expandable,
      rowSelection,
      draggable,
      resizable,
      dataSource,
      onSort,
      onSelectAll,
      onFilter,
      testIdBuilder,
      headerClassName,
      sticky,
      autoFillHeight,
      scroll
    } = this.props;

    const rowSelectionKeyField = this.getRowSelectionKeyField();
    const dataList =
      rowSelection && rowSelection.getCheckboxProps
        ? filterTree(dataSource, (data: any, index: number, level: number) => {
            const props = rowSelection.getCheckboxProps(data, index);
            return !props.disabled;
          })
        : dataSource;

    const hasScrollY = scroll && scroll.y;
    const selfSticky = !!(hasScrollY || (sticky && autoFillHeight));

    return (
      <Head
        key="thead"
        selfSticky={selfSticky}
        columns={columns}
        draggable={!!draggable}
        selectable={!!rowSelection}
        rowSelectionFixed={!!rowSelection?.fixed}
        rowSelectionType={rowSelection?.type}
        selections={rowSelection?.selections}
        rowSelectionKeyField={rowSelectionKeyField}
        maxSelectedLength={rowSelection?.maxSelectedLength}
        isExpandable={this.isExpandableTable()}
        isRightExpandable={this.isRightExpandable()}
        isLeftExpandable={this.isLeftExpandable()}
        selectedRowKeys={this.state.selectedRowKeys}
        dataSource={dataList}
        resizable={resizable}
        expandable={!!expandable}
        expandableFixed={expandable?.fixed}
        childrenColumnName={this.getChildrenColumnName()}
        orderBy={this.state.sort?.orderBy}
        popOverContainer={this.getPopOverContainer}
        classnames={cx}
        className={headerClassName}
        classPrefix={classPrefix}
        onSort={(payload: SortProps, column: ColumnProps) => {
          this.setState({
            sort: payload
          });

          onSort && onSort(payload);
        }}
        onSelectAll={async (
          value: boolean,
          selectedRowKeys: Array<string | number>,
          selectedRows: Array<any>,
          restSelectedKeys: Array<string | number>
        ) => {
          if (onSelectAll) {
            const prevented = await onSelectAll(
              selectedRows,
              value ? selectedRowKeys : [],
              value ? [] : selectedRows
            );
            if (prevented) {
              return;
            }
          }
          const keys = [
            ...selectedRowKeys,
            ...restSelectedKeys // 更新数据要把非当前页的数据也加上
          ];
          if (!isEqual(keys, this.state.selectedRowKeys)) {
            this.setState({selectedRowKeys: keys});
          }
        }}
        onFilter={onFilter}
        onResizeMouseDown={this.onResizeMouseDown.bind(this)}
        testIdBuilder={testIdBuilder?.getChild('head')}
      ></Head>
    );
  }

  @autobind
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

  @autobind
  async onRowDbClick(
    event: React.ChangeEvent<any>,
    record?: any,
    rowIndex?: number
  ) {
    const {onRow} = this.props;

    if (onRow && onRow.onRowDbClick) {
      const prevented = await onRow.onRowDbClick(event, record, rowIndex);
      if (prevented === false) {
        return;
      }
    }
  }

  @autobind
  async onRowMouseEnter(
    event: React.ChangeEvent<any>,
    record?: any,
    rowIndex?: number
  ) {
    const {onRow, itemActions} = this.props;

    if (onRow && onRow.onRowMouseEnter) {
      const prevented = await onRow.onRowMouseEnter(event, record, rowIndex);
      if (prevented) {
        return;
      }
    }

    if (record && itemActions) {
      let target = event.target;
      if (target?.tagName !== 'TR') {
        target = target?.closest('tr');
      }

      this.setState({hoverRow: {target, rowIndex, record}});
    }
  }

  @autobind
  async onRowMouseLeave(
    event: React.ChangeEvent<any>,
    record?: any,
    rowIndex?: number
  ) {
    const {onRow} = this.props;

    onRow &&
      onRow.onRowMouseLeave &&
      onRow.onRowMouseLeave(event, record, rowIndex);
  }

  @autobind
  onMouseLeave() {
    const {itemActions} = this.props;
    itemActions && this.setState({hoverRow: null});
  }

  @autobind
  onExpandRows(data: Array<any>) {
    const {expandedRowKeys} = this.state;
    const {expandable} = this.props;
    const keys = data.map((d: any) => d[this.getExpandableKeyField()]);
    this.setState({expandedRowKeys: [...expandedRowKeys, ...keys]});
    expandable?.onExpand && expandable?.onExpand(true, data);
  }

  @autobind
  onCollapseRows(data: Array<any>) {
    const {expandedRowKeys} = this.state;
    const {expandable} = this.props;
    const keys = data.map((d: any) => d[this.getExpandableKeyField()]);
    this.setState({
      expandedRowKeys: expandedRowKeys.filter(
        (k: string | number) => !keys.find(v => v == k) // 模糊匹配 否则'3'、3匹配不上
      )
    });
    expandable?.onExpand && expandable?.onExpand(true, data);
  }

  getChildrenColumnName() {
    const {childrenColumnName} = this.props;

    return childrenColumnName || 'children';
  }

  getRowSelectionKeyField() {
    const {rowSelection, keyField} = this.props;

    return rowSelection?.keyField || keyField || 'key';
  }

  getExpandableKeyField() {
    const {expandable, keyField} = this.props;

    return expandable?.keyField || keyField || 'key';
  }

  hasCheckedChildrenRows(data: any) {
    const selectedRowKeys = this.state.selectedRowKeys;
    const childrenColumnName = this.getChildrenColumnName();
    const rowSelectionKeyField = this.getRowSelectionKeyField();
    const childrenKeys = getDataChildrenKeys(
      data,
      childrenColumnName,
      rowSelectionKeyField
    );
    const length = intersection(selectedRowKeys, childrenKeys).length;

    return length > 0;
  }

  getSelectedRowKeys(isSelected: boolean, data: any) {
    const {rowSelection} = this.props;

    const rowSelectionKeyField = this.getRowSelectionKeyField();
    const childrenColumnName = this.getChildrenColumnName();

    const isRadio = rowSelection && rowSelection.type === 'radio';

    let selected: any[] = [];
    if (isSelected) {
      if (isRadio) {
        selected = [data[rowSelectionKeyField]];
      } else {
        selected = [
          ...this.state.selectedRowKeys,
          data[rowSelectionKeyField],
          ...getDataChildrenKeys(data, childrenColumnName, rowSelectionKeyField)
        ].filter((key, i, a) => a.indexOf(key) === i);
      }
    } else {
      if (!isRadio) {
        selected = this.state.selectedRowKeys.filter(
          key =>
            ![
              data[rowSelectionKeyField],
              ...getDataChildrenKeys(
                data,
                childrenColumnName,
                rowSelectionKeyField
              )
            ].includes(key)
        );
      }
    }

    return selected;
  }

  async selectedSingleRow(value: boolean, data: any) {
    const {onSelect, dataSource} = this.props;

    const selectedRowKeys = this.getSelectedRowKeys(value, data);

    if (onSelect) {
      const rowSelectionKeyField = this.getRowSelectionKeyField();
      const childrenColumnName = this.getChildrenColumnName();

      const selectedResult = getRowsByKeys(
        dataSource,
        selectedRowKeys,
        rowSelectionKeyField,
        childrenColumnName
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

    if (!isEqual(this.state.selectedRowKeys, selectedRowKeys)) {
      this.setState({selectedRowKeys});
    }
  }

  // 展开和嵌套不能共存
  isExpandableRow(data: any, rowIndex: number) {
    const {expandable} = this.props;

    return (
      expandable &&
      (!expandable.rowExpandable ||
        (expandable.rowExpandable && expandable.rowExpandable(data, rowIndex)))
    );
  }

  isExpanded(record: any) {
    const expandableKeyField = this.getExpandableKeyField();
    return !!find(
      this.state.expandedRowKeys,
      key => key == record[expandableKeyField]
    ); // == 匹配 否则'3'、3匹配不上
  }

  renderRow(data: any, rowIndex: number, levels: Array<number>) {
    const {
      rowSelection,
      expandable,
      indentSize,
      lineHeight,
      draggable,
      rowClassName,
      keyField,
      columns,
      lazyRenderAfter,
      classPrefix,
      classnames: cx,
      testIdBuilder
    } = this.props;

    const rowSelectionKeyField = this.getRowSelectionKeyField();
    const isChecked = !!find(
      this.state.selectedRowKeys,
      key => key === data[rowSelectionKeyField]
    );
    const rowTIDBuilder = testIdBuilder?.getChild(`row-${rowIndex}`);

    const childrenColumnName = this.getChildrenColumnName();
    // 当前行是否可展开
    const isExpandableRow = this.isExpandableRow(data, rowIndex);
    const hasChildrenRow = checkChildrenRow(data, childrenColumnName);
    const hasChildrenChecked =
      !!rowSelection && hasChildrenRow && this.hasCheckedChildrenRows(data);

    const expandedRowClassName =
      expandable &&
      expandable.expandedRowClassName &&
      typeof expandable.expandedRowClassName === 'function'
        ? expandable.expandedRowClassName(data, rowIndex)
        : '';
    const isExpanded = this.isExpanded(data);

    const checkboxProps =
      rowSelection && rowSelection.getCheckboxProps
        ? rowSelection.getCheckboxProps(data, rowIndex)
        : {};

    const children =
      !expandable && childrenColumnName && hasChildrenRow && isExpanded
        ? data[childrenColumnName].map((item: any, index: number) =>
            this.renderRow(item, index, [...levels, rowIndex])
          )
        : null;

    return [
      <Row
        key={`row-${rowIndex}`}
        data={data}
        rowIndex={rowIndex}
        levels={levels.join(',')}
        columns={columns}
        selectable={!!rowSelection}
        rowSelectionFixed={!!rowSelection?.fixed}
        rowSelectionType={rowSelection?.type || 'checkbox'}
        rowClickIgControl={!!rowSelection?.rowClickIgControl}
        expandable={!!expandable}
        expandableFixed={expandable?.fixed}
        expandedRowClassName={expandedRowClassName}
        expandedRowRender={expandable?.expandedRowRender}
        isExpanded={isExpanded}
        hasChildrenRow={hasChildrenRow}
        hasChildrenChecked={hasChildrenChecked}
        indentSize={indentSize}
        lineHeight={lineHeight}
        draggable={!!draggable}
        isExpandable={this.isExpandableTable()}
        isExpandableRow={isExpandableRow}
        colCount={this.getExtraColumnCount()}
        isRightExpandable={this.isRightExpandable()}
        isLeftExpandable={this.isLeftExpandable()}
        isChecked={isChecked}
        rowClassName={rowClassName}
        onExpand={this.onExpandRows}
        onCollapse={this.onCollapseRows}
        onMouseEnter={this.onRowMouseEnter}
        onMouseLeave={this.onRowMouseLeave}
        onClick={this.onRowClick}
        onDoubleClick={this.onRowDbClick}
        onChange={this.onRowChange}
        childrenColumnName={this.getChildrenColumnName()}
        keyField={keyField}
        lazyRenderAfter={lazyRenderAfter}
        classnames={cx}
        classPrefix={classPrefix}
        testIdBuilder={rowTIDBuilder}
        {...checkboxProps}
      />,
      children
    ];
  }

  @autobind
  onRowChange(value: boolean, record: any) {
    const {rowSelection} = this.props;
    if (!(rowSelection && rowSelection.rowClick)) {
      this.selectedSingleRow(value, record);
    }
  }

  renderBody() {
    const {
      classnames: cx,
      headSummary,
      scroll,
      placeholder,
      sticky,
      loading,
      loadingConfig,
      classPrefix
    } = this.props;

    const tdColumns = this.tdColumns;
    const hasScrollY = scroll && scroll.y;
    const colCount = this.getExtraColumnCount();

    const childrenColumnName = this.getChildrenColumnName();
    const dataSource = getSortData(
      this.props.dataSource,
      tdColumns,
      childrenColumnName,
      this.state.sort
    );
    return (
      <tbody ref={this.tbodyDom} className={cx('Table-tbody')}>
        {dataSource.map((data, index) => this.renderRow(data, index, []))}
        {!hasScrollY && !sticky && headSummary
          ? this.renderSummaryRow(headSummary)
          : null}
        {!!loading ? (
          <tr className={cx('Table-row', 'Table-loading-row')}>
            <Cell
              classnames={cx}
              classPrefix={classPrefix}
              colSpan={tdColumns.length + colCount}
            >
              <div className={cx('Table-loading')}>
                {typeof loading === 'boolean' ? (
                  <Spinner
                    overlay
                    show={loading}
                    loadingConfig={loadingConfig}
                  />
                ) : React.isValidElement(loading) ? (
                  loading
                ) : null}
              </div>
            </Cell>
          </tr>
        ) : !dataSource.length ? (
          <tr className={cx('Table-row', 'Table-empty-row')}>
            <Cell
              classnames={cx}
              classPrefix={classPrefix}
              colSpan={tdColumns.length + colCount}
            >
              <div className={cx('Table-empty')}>
                {typeof placeholder === 'function'
                  ? placeholder()
                  : placeholder}
              </div>
            </Cell>
          </tr>
        ) : null}
      </tbody>
    );
  }

  isExpandableTable() {
    const {expandable} = this.props;

    // 设置了expandable 优先级更高
    // 就不支持默认嵌套了
    return !!expandable;
  }

  // 展开列放到右侧 会影响之前的一些合并的规则
  isRightExpandable() {
    const {expandable} = this.props;
    return expandable && expandable.position === 'right';
  }

  // 展开列放到左侧 还有一种情况是position为none 无展开按钮
  isLeftExpandable() {
    const {expandable} = this.props;
    return (
      expandable && (!expandable.position || expandable.position === 'left')
    );
  }

  // 计算自动增加的列数
  // 选择、拖拽、展开
  getExtraColumnCount() {
    const {draggable, rowSelection, expandable} = this.props;

    let count = 0;
    if (draggable) {
      count++;
    } else {
      if (this.isExpandableTable() && expandable?.position !== 'none') {
        count++;
      }
      if (rowSelection) {
        count++;
      }
    }

    return count;
  }

  renderSummaryRow(summary: any) {
    const {classnames: cx, classPrefix, dataSource} = this.props;
    if (typeof summary === 'function') {
      return summary(dataSource);
    }
    if (React.isValidElement(summary)) {
      return summary;
    }

    return (
      <SummaryRows
        summary={summary}
        colCount={this.getExtraColumnCount()}
        isRightExpandable={this.isRightExpandable()}
        classnames={cx}
        classPrefix={classPrefix}
        dataSource={dataSource}
        onMouseEnter={this.onRowMouseEnter}
        onMouseLeave={this.onRowMouseLeave}
      />
    );
  }

  renderFoot() {
    const {classnames: cx, footSummary} = this.props;
    return (
      <tfoot className={cx('Table-summary')}>
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

  @autobind
  onTableScroll(event: any) {
    const scrollDomRefs = [this.headerDom, this.contentDom, this.footDom];

    const {target, scrollLeft} = event;

    scrollDomRefs.forEach(ref => {
      const current = ref && ref.current;
      if (current && current !== target) {
        current.scrollLeft = scrollLeft || target.scrollLeft;
      }
    });

    this.updateTableDom(target);
  }

  renderTable() {
    const {
      scroll,
      footSummary,
      showHeader,
      itemActions,
      tableLayout,
      classnames: cx,
      bodyClassname
    } = this.props;

    const hasScrollX = scroll && scroll.x;
    const hoverRow = this.state.hoverRow;

    const tableStyle = hasScrollX
      ? {width: scroll.x + 'px', tableLayout: 'fixed'}
      : {};

    return (
      <div
        ref={this.contentDom}
        className={cx('Table-content')}
        style={hasScrollX ? {overflow: 'auto hidden'} : {}}
        onMouseLeave={this.onMouseLeave}
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
          style={{
            ...tableStyle,
            tableLayout: tableLayout === 'fixed' ? 'fixed' : 'auto'
          }}
          className={cx('Table-table', bodyClassname)}
        >
          {this.renderColGroup()}
          {showHeader ? this.renderHead() : null}
          {this.renderBody()}
          {footSummary ? this.renderFoot() : null}
        </table>
      </div>
    );
  }

  renderScrollTableHeader() {
    const {
      scroll,
      headSummary,
      sticky,
      showHeader,
      classnames: cx,
      headerClassName
    } = this.props;

    const style = {overflow: 'hidden'};
    if (!!sticky) {
      Object.assign(style, {top: 0});
    }

    const tableStyle = {};
    if (scroll && (scroll.y || scroll.x)) {
      Object.assign(tableStyle, {
        width:
          scroll && scroll.x
            ? typeof scroll.x === 'number'
              ? scroll.x + 'px'
              : scroll.x
            : '100%'
      });
    }

    return (
      <div
        ref={this.headerDom}
        className={cx(
          'Table-header',
          {
            [cx('Table-sticky-holder')]: !!sticky
          },
          headerClassName
        )}
        style={style}
      >
        <table
          className={cx('Table-table')}
          style={{...tableStyle, tableLayout: 'fixed'}}
        >
          {this.renderColGroup(true)}
          {showHeader ? this.renderHead() : null}
          {headSummary ? (
            <tbody>{this.renderSummaryRow(headSummary)}</tbody>
          ) : null}
        </table>
      </div>
    );
  }

  renderScrollTableBody() {
    const {scroll, itemActions, classnames: cx, bodyClassname} = this.props;

    const style = {};
    const tableStyle = {};
    if (scroll && (scroll.y || scroll.x)) {
      Object.assign(style, {
        overflow: 'auto scroll',
        maxHeight: scroll.y
      });

      Object.assign(tableStyle, {
        width:
          scroll && scroll.x
            ? typeof scroll.x === 'number'
              ? scroll.x + 'px'
              : scroll.x
            : '100%'
      });
    }

    const hoverRow = this.state.hoverRow;

    return (
      <div
        ref={this.contentDom}
        className={cx('Table-body')}
        style={style}
        onMouseLeave={this.onMouseLeave}
        onScroll={this.onTableScroll}
      >
        {itemActions && hoverRow ? (
          <ItemActionsWrapper dom={hoverRow.target} classnames={cx}>
            {typeof itemActions === 'function'
              ? itemActions(hoverRow.record, hoverRow.rowIndex)
              : null}
          </ItemActionsWrapper>
        ) : null}
        <table
          className={cx('Table-table', bodyClassname)}
          style={{...tableStyle, tableLayout: 'fixed'}}
        >
          {this.renderColGroup()}
          {this.renderBody()}
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
          {this.renderFoot()}
        </table>
      </div>
    );
  }

  renderScrollTable() {
    // todo 这个模式有个很大的问题就是依赖 tablelayout 的 fixed 模式，这就意味这列的宽度都得配置
    const {footSummary, classnames: cx} = this.props;

    return (
      <div className={cx('Table-container')} ref={this.containerDom}>
        {this.renderScrollTableHeader()}
        {this.renderScrollTableBody()}
        {footSummary ? this.renderScrollTableFoot() : null}
      </div>
    );
  }

  @autobind
  syncTableWidth() {
    const tbodyDom = this.tbodyDom.current;
    if (!tbodyDom) {
      return;
    }
    const cols = [].slice.call(
      tbodyDom?.querySelectorAll(':scope>tr:last-child>td[data-col]')
    );
    const colWidths: any = {};
    cols.forEach((col: HTMLElement) => {
      const index = parseInt(col.getAttribute('data-col')!, 10);
      const column = this.tdColumns[index];
      const item = this.state.colWidths[column.name];
      if (column) {
        colWidths[column.name] = {
          width:
            item?.originWidth !== column?.width ? column?.width : item?.width,
          minWidth: column?.minWidth,
          realWidth: col.offsetWidth,
          originWidth: column?.width
        };
      }
    });

    if (!isEqual(colWidths, this.state.colWidths)) {
      this.setState({colWidths});
    }
  }

  @autobind
  initTableWidth() {
    const tableWrapperDom = this.contentDom.current;
    if (!tableWrapperDom) {
      return;
    }
    const {scroll, tableLayout} = this.props;

    const table = tableWrapperDom.querySelector('table');
    let thead = tableWrapperDom.querySelector('thead');
    if (!thead) {
      if (this.headerDom.current) {
        thead = this.headerDom.current.querySelector('thead');
      }
    }
    const tableWidth =
      scroll && scroll.x ? scroll.x : tableWrapperDom!.offsetWidth;
    let tbody: HTMLElement | null = null;
    const htmls: Array<string> = [];
    const isFixed = tableLayout === 'fixed' || (scroll && scroll.x);
    const someSettedWidth = this.tdColumns.some(column => column.width);

    const minWidths: {
      [propName: string]: number;
    } = {};

    // fixed 模式需要参考 auto 获得列最小宽度
    if (isFixed) {
      tbody = table?.querySelector(':scope>tbody') || null;
      htmls.push(
        `<table style="table-layout:auto!important;width:0!important;min-width:0!important;" class="${table?.className}">${thead?.outerHTML}</table>`
      );
    }

    if (someSettedWidth || isFixed) {
      htmls.push(
        `<table style="table-layout:auto!important;min-width:${tableWidth}px!important;width:${tableWidth}px!important;" class="${
          table?.className
        }">${thead ? thead.outerHTML : ''}${
          tbody ? `<tbody>${tbody.innerHTML}</tbody>` : ''
        }</table>`
      );
    }

    if (!htmls.length) {
      return;
    }

    const div = document.createElement('div');
    div.className = 'amis-scope'; // jssdk 里面 css 会在这一层
    div.style.cssText += `visibility: hidden!important;`;
    div.innerHTML = htmls.join('');
    let ths1: Array<HTMLTableCellElement> = [];
    let ths2: Array<HTMLTableCellElement> = [];

    if (isFixed) {
      ths1 = [].slice.call(
        div.querySelectorAll(':scope>table:first-child>thead>tr>th[data-col]')
      );
    }

    if (someSettedWidth || isFixed) {
      ths2 = [].slice.call(
        div.querySelectorAll(':scope>table:last-child>thead>tr>th[data-col]')
      );
    }

    ths1.forEach(th => {
      th.style.cssText += 'width: 0';
    });
    ths2.forEach((th, index) => {
      const column = this.tdColumns[index];

      th.style.cssText += `${
        typeof column?.width === 'number'
          ? `width: ${column?.width}px;`
          : column?.width
          ? `width: ${column?.width};`
          : ''
      }`;
    });

    document.body.appendChild(div);

    const colWidths: any = {};
    ths1.forEach((th: HTMLTableCellElement) => {
      const index = parseInt(th.getAttribute('data-col')!, 10);
      const column = this.tdColumns[index];
      minWidths[index] = th.clientWidth;
      if (colWidths[index]) {
        colWidths[column?.name].minWidth = th.clientWidth;
      } else {
        colWidths[column?.name] = {minWidth: th.clientWidth};
      }
    });

    ths2.forEach((col: HTMLElement) => {
      const index = parseInt(col.getAttribute('data-col')!, 10);
      const column = this.tdColumns[index];
      if (column && (column.width || isFixed)) {
        const width = Math.max(
          typeof column.width === 'number' ? column.width : col.clientWidth,
          minWidths[index] || 0
        );
        if (colWidths[column?.name]) {
          colWidths[column?.name].width = width;
        } else {
          colWidths[column?.name] = {width};
        }
        if (column.width) {
          colWidths[column?.name].originWidth = column.width;
        }
      }
    });

    if (!isEqual(colWidths, this.state.colWidths)) {
      this.setState({colWidths});
    }

    document.body.removeChild(div);
  }

  @autobind
  updateTableInfo() {
    if (this.resizeTarget) {
      return;
    }

    this.syncTableWidth();
    this.initTableWidth();
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
      autoFillHeight,
      classnames: cx
    } = this.props;

    const {thColumns, tdColumns} = getBuildColumns(columns);
    this.thColumns = thColumns;
    this.tdColumns = tdColumns;

    // 是否设置了纵向滚动
    const hasScrollY = scroll && scroll.y;
    // 是否设置了横向滚动
    const hasScrollX = scroll && scroll.x;

    const style = {};
    if (hasScrollY) {
      Object.assign(style, {
        overflow: 'auto scroll',
        maxHeight: scroll.y
      });
    }

    return (
      <div
        ref={this.tableDom}
        className={cx('Table2', className, {
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

        {hasScrollY && !autoFillHeight ? (
          this.renderScrollTable()
        ) : (
          <div
            className={cx('Table-container', {
              [cx('Table-container-self-sticky')]:
                hasScrollY || (sticky && autoFillHeight)
            })}
            style={style}
            ref={this.containerDom}
          >
            {this.renderTable()}
          </div>
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
