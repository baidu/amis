import React from 'react';
import {findDOMNode} from 'react-dom';
import isEqual from 'lodash/isEqual';
import {
  ScopedContext,
  IScopedContext,
  SchemaExpression,
  position,
  animation,
  evalExpressionWithConditionBuilder,
  isEffectiveApi
} from 'amis-core';
import {Renderer, RendererProps} from 'amis-core';
import {SchemaNode, ActionObject, Schema} from 'amis-core';
import forEach from 'lodash/forEach';
import {evalExpression, filter} from 'amis-core';
import {BadgeObject, Checkbox, Spinner, SpinnerExtraProps} from 'amis-ui';
import {Button} from 'amis-ui';
import {TableStore, ITableStore, padArr} from 'amis-core';
import {
  anyChanged,
  changedEffect,
  getScrollParent,
  difference,
  autobind,
  isArrayChildrenModified,
  eachTree,
  isObject,
  createObject
} from 'amis-core';
import {
  isPureVariable,
  resolveVariable,
  resolveVariableAndFilter
} from 'amis-core';
import Sortable from 'sortablejs';
import {resizeSensor} from 'amis-core';
import find from 'lodash/find';
import {Icon} from 'amis-ui';
import {TableCell} from './TableCell';
import type {AutoGenerateFilterObject} from '../CRUD';
import {HeadCellFilterDropDown} from './HeadCellFilterDropdown';
import {HeadCellSearchDropDown} from './HeadCellSearchDropdown';
import TableContent, {renderItemActions} from './TableContent';
import {
  BaseSchema,
  SchemaApi,
  SchemaClassName,
  SchemaObject,
  SchemaTokenizeableString,
  SchemaType,
  SchemaTpl,
  SchemaIcon
} from '../../Schema';
import {SchemaPopOver} from '../PopOver';
import {SchemaQuickEdit} from '../QuickEdit';
import {SchemaCopyable} from '../Copyable';
import {SchemaRemark} from '../Remark';
import {TableBody} from './TableBody';
import {isAlive} from 'mobx-state-tree';
import ColumnToggler from './ColumnToggler';

import {offset} from 'amis-core';
import {getStyleNumber} from 'amis-core';
import {exportExcel} from './exportExcel';
import type {IColumn, IRow} from 'amis-core';
import intersection from 'lodash/intersection';
import {isMobile} from 'amis-core';
import isPlainObject from 'lodash/isPlainObject';
import omit from 'lodash/omit';
import ColGroup from './ColGroup';
import debounce from 'lodash/debounce';
import AutoFilterForm from './AutoFilterForm';
import Cell from './Cell';
import {reaction} from 'mobx';

/**
 * 表格列，不指定类型时默认为文本类型。
 */
export type TableColumnObject = {
  /**
   * 列标题
   */
  label: string;

  /**
   * 配置是否固定当前列
   */
  fixed?: 'left' | 'right' | 'none';

  /**
   * 绑定字段名
   */
  name?: string;

  /**
   * 配置查看详情功能
   */
  popOver?: SchemaPopOver;

  /**
   * 配置快速编辑功能
   */
  quickEdit?: SchemaQuickEdit;

  /**
   * 作为表单项时，可以单独配置编辑时的快速编辑面板。
   */
  quickEditOnUpdate?: SchemaQuickEdit;

  /**
   * 配置点击复制功能
   */
  copyable?: SchemaCopyable;

  /**
   * 配置是否可以排序
   */
  sortable?: boolean;

  /**
   * 是否可快速搜索
   */
  searchable?: boolean | SchemaObject;

  /**
   * 配置是否默认展示
   */
  toggled?: boolean;

  /**
   * 列宽度
   */
  width?: number | string;

  /**
   * 列对齐方式
   */
  align?: 'left' | 'right' | 'center' | 'justify';

  /**
   * 列样式表
   */
  className?: string;

  /**
   * 单元格样式表达式
   */
  classNameExpr?: string;

  /**
   * 列头样式表
   */
  labelClassName?: string;

  /**
   * todo
   */
  filterable?:
    | boolean
    | {
        source?: string;
        options?: Array<any>;
      };

  /**
   * 结合表格的 footable 一起使用。
   * 填写 *、xs、sm、md、lg指定 footable 的触发条件，可以填写多个用空格隔开
   */
  breakpoint?: '*' | 'xs' | 'sm' | 'md' | 'lg';

  /**
   * 提示信息
   */
  remark?: SchemaRemark;

  /**
   * 默认值, 只有在 inputTable 里面才有用
   */
  value?: any;

  /**
   * 是否唯一, 只有在 inputTable 里面才有用
   */
  unique?: boolean;

  /**
   * 表格列单元格是否可以获取父级数据域值，默认为true，该配置对当前列内单元格生效
   */
  canAccessSuperData?: boolean;

  /**
   * 当一次性渲染太多列上有用，默认为 100，可以用来提升表格渲染性能
   * @default 100
   */
  lazyRenderAfter?: number;

  /**
   * 单元格内部组件自定义样式 style作为单元格自定义样式的配置
   */
  innerStyle?: {
    [propName: string]: any;
  };
};

export type TableColumnWithType = SchemaObject & TableColumnObject;
export type TableColumn = TableColumnWithType | TableColumnObject;

type AutoFillHeightObject = Record<'height' | 'maxHeight', number>;
/**
 * Table 表格渲染器。
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/table
 */
export interface TableSchema extends BaseSchema {
  /**
   * 指定为表格渲染器。
   */
  type: 'table' | 'static-table';

  /**
   * 是否固定表头
   */
  affixHeader?: boolean;

  /**
   * 表格的列信息
   */
  columns?: Array<TableColumn>;

  /**
   * 展示列显示开关，自动即：列数量大于或等于5个时自动开启
   */
  columnsTogglable?: boolean | 'auto';

  /**
   * 是否开启底部展示功能，适合移动端展示
   */
  footable?:
    | boolean
    | {
        expand?: 'first' | 'all' | 'none';

        /**
         * 是否为手风琴模式
         */
        accordion?: boolean;
      };

  /**
   * 底部外层 CSS 类名
   */
  footerClassName?: SchemaClassName;

  /**
   * 顶部外层 CSS 类名
   */
  headerClassName?: SchemaClassName;

  /**
   * 占位符
   */
  placeholder?: string | SchemaTpl;

  /**
   * 是否显示底部
   */
  showFooter?: boolean;

  /**
   * 是否显示头部
   */
  showHeader?: boolean;

  /**
   * 数据源：绑定当前环境变量
   */
  source?: SchemaTokenizeableString;

  /**
   * 表格 CSS 类名
   */
  tableClassName?: SchemaClassName;

  /**
   * 标题
   */
  title?: string;

  /**
   * 工具栏 CSS 类名
   */
  toolbarClassName?: SchemaClassName;

  /**
   * 合并单元格配置，配置数字表示从左到右的多少列自动合并单元格。
   */
  combineNum?: number | SchemaExpression;

  /**
   * 合并单元格配置，配置从第几列开始合并。
   */
  combineFromIndex?: number;

  /**
   * 顶部总结行
   */
  prefixRow?: Array<SchemaObject>;

  /**
   * 底部总结行
   */
  affixRow?: Array<SchemaObject>;

  /**
   * 是否可调整列宽
   */
  resizable?: boolean;

  /**
   * 行样式表表达式
   */
  rowClassNameExpr?: string;

  /**
   * 行角标
   */
  itemBadge?: BadgeObject;

  /**
   * 开启查询区域，会根据列元素的searchable属性值，自动生成查询条件表单
   */
  autoGenerateFilter?: AutoGenerateFilterObject | boolean;

  /**
   * 表格是否可以获取父级数据域值，默认为false
   */
  canAccessSuperData?: boolean;

  /**
   * 表格自动计算高度
   */
  autoFillHeight?: boolean | AutoFillHeightObject;

  /**
   * table layout
   */
  tableLayout?: 'fixed' | 'auto';

  /**
   * 懒加载 API，当行数据中用 defer: true 标记了，则其孩子节点将会用这个 API 来拉取数据。
   */
  deferApi?: SchemaApi;
}

export interface TableProps extends RendererProps, SpinnerExtraProps {
  title?: string; // 标题
  header?: SchemaNode;
  footer?: SchemaNode;
  actions?: ActionObject[];
  className?: string;
  headerClassName?: string;
  footerClassName?: string;
  store: ITableStore;
  columns?: Array<any>;
  headingClassName?: string;
  toolbarClassName?: string;
  headerToolbarClassName?: string;
  footerToolbarClassName?: string;
  tableClassName?: string;
  source?: string;
  selectable?: boolean;
  selected?: Array<any>;
  maxKeepItemSelectionLength?: number;
  valueField?: string;
  draggable?: boolean;
  columnsTogglable?: boolean | 'auto';
  affixHeader?: boolean;
  affixColumns?: boolean;
  combineNum?: number | SchemaExpression;
  combineFromIndex?: number;
  footable?:
    | boolean
    | {
        expand?: 'first' | 'all' | 'none';
        expandAll?: boolean;
        accordion?: boolean;
      };
  expandConfig?: {
    expand?: 'first' | 'all' | 'none';
    expandAll?: boolean;
    accordion?: boolean;
  };
  itemCheckableOn?: string;
  itemDraggableOn?: string;
  itemActions?: Array<ActionObject>;
  onSelect: (
    selectedItems: Array<object>,
    unSelectedItems: Array<object>
  ) => void;
  onPristineChange?: (data: object, rowIndexe: string) => void;
  onSave?: (
    items: Array<object> | object,
    diff: Array<object> | object,
    rowIndexes: Array<string> | string,
    unModifiedItems?: Array<object>,
    rowOrigins?: Array<object> | object,
    options?: {
      resetOnFailed?: boolean;
      reload?: string;
    }
  ) => void;
  onSaveOrder?: (moved: Array<object>, items: Array<object>) => void;
  onQuery?: (values: object) => any;
  onImageEnlarge?: (data: any, target: any) => void;
  buildItemProps?: (item: any, index: number) => any;
  checkOnItemClick?: boolean;
  hideCheckToggler?: boolean;
  rowClassName?: string;
  rowClassNameExpr?: string;
  popOverContainer?: any;
  canAccessSuperData?: boolean;
  reUseRow?: boolean;
  itemBadge?: BadgeObject;
  loading?: boolean;
  autoFillHeight?: boolean | AutoFillHeightObject;
}

export type ExportExcelToolbar = SchemaNode & {
  api?: SchemaApi;
  columns?: string[];
  exportColumns?: any[];
  rowSlice?: string;
  filename?: string;
};

// 如果这里的事件调整，对应CRUD里的事件配置也需要同步修改
export type TableRendererEvent =
  | 'selectedChange'
  | 'columnSort'
  | 'columnFilter'
  | 'columnSearch'
  | 'columnToggled'
  | 'orderChange'
  | 'rowClick'
  | 'rowDbClick'
  | 'rowMouseEnter'
  | 'rowMouseLeave';

export type TableRendererAction =
  | 'selectAll'
  | 'clearAll'
  | 'select'
  | 'initDrag';

export default class Table extends React.Component<TableProps, object> {
  static contextType = ScopedContext;

  static propsList: Array<string> = [
    'header',
    'headerToolbarRender',
    'footer',
    'footerToolbarRender',
    'footable',
    'expandConfig',
    'placeholder',
    'tableClassName',
    'headingClassName',
    'source',
    'selectable',
    'columnsTogglable',
    'affixHeader',
    'affixColumns',
    'headerClassName',
    'footerClassName',
    'selected',
    'multiple',
    'primaryField',
    'hideQuickSaveBtn',
    'itemCheckableOn',
    'itemDraggableOn',
    'checkOnItemClick',
    'hideCheckToggler',
    'itemAction',
    'itemActions',
    'combineNum',
    'combineFromIndex',
    'items',
    'columns',
    'valueField',
    'saveImmediately',
    'rowClassName',
    'rowClassNameExpr',
    'affixRowClassNameExpr',
    'prefixRowClassNameExpr',
    'popOverContainer',
    'headerToolbarClassName',
    'toolbarClassName',
    'footerToolbarClassName',
    'itemBadge',
    'autoFillHeight',
    'onSelect',
    'keepItemSelectionOnPageChange',
    'maxKeepItemSelectionLength',
    'autoGenerateFilter'
  ];
  static defaultProps: Partial<TableProps> = {
    className: '',
    placeholder: 'placeholder.noData',
    tableClassName: '',
    source: '$items',
    selectable: false,
    columnsTogglable: 'auto',
    affixHeader: true,
    headerClassName: '',
    footerClassName: '',
    toolbarClassName: '',
    headerToolbarClassName: '',
    footerToolbarClassName: '',
    primaryField: 'id',
    itemCheckableOn: '',
    itemDraggableOn: '',
    hideCheckToggler: false,
    canAccessSuperData: false,
    resizable: true
  };

  table?: HTMLTableElement;
  sortable?: Sortable;
  dragTip?: HTMLElement;
  affixedTable?: HTMLTableElement;
  renderedToolbars: Array<string> = [];
  subForms: any = {};
  timer: ReturnType<typeof setTimeout>;
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

  constructor(props: TableProps, context: IScopedContext) {
    super(props);

    const scoped = context;
    scoped.registerComponent(this);

    this.handleOutterScroll = this.handleOutterScroll.bind(this);
    this.tableRef = this.tableRef.bind(this);
    this.affixedTableRef = this.affixedTableRef.bind(this);
    this.updateTableInfo = this.updateTableInfo.bind(this);
    this.handleAction = this.handleAction.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleCheckAll = this.handleCheckAll.bind(this);
    this.handleQuickChange = this.handleQuickChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleSaveOrder = this.handleSaveOrder.bind(this);
    this.reset = this.reset.bind(this);
    this.dragTipRef = this.dragTipRef.bind(this);
    this.getPopOverContainer = this.getPopOverContainer.bind(this);
    this.renderCell = this.renderCell.bind(this);
    this.renderHeadCell = this.renderHeadCell.bind(this);
    this.renderToolbar = this.renderToolbar.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.subFormRef = this.subFormRef.bind(this);
    this.handleColumnToggle = this.handleColumnToggle.bind(this);
    this.handleRowClick = this.handleRowClick.bind(this);
    this.handleRowDbClick = this.handleRowDbClick.bind(this);
    this.handleRowMouseEnter = this.handleRowMouseEnter.bind(this);
    this.handleRowMouseLeave = this.handleRowMouseLeave.bind(this);

    this.updateAutoFillHeight = this.updateAutoFillHeight.bind(this);

    const {
      store,
      columns,
      selectable,
      columnsTogglable,
      draggable,
      orderBy,
      orderDir,
      multiple,
      footable,
      primaryField,
      itemCheckableOn,
      itemDraggableOn,
      hideCheckToggler,
      combineFromIndex,
      expandConfig,
      formItem,
      keepItemSelectionOnPageChange,
      maxKeepItemSelectionLength,
      onQuery,
      autoGenerateFilter,
      loading,
      canAccessSuperData,
      lazyRenderAfter,
      tableLayout,
      resolveDefinitions
    } = props;

    let combineNum = props.combineNum;
    if (typeof combineNum === 'string') {
      combineNum = parseInt(
        resolveVariableAndFilter(combineNum, props.data, '| raw'),
        10
      );
    }

    store.update(
      {
        selectable,
        draggable,
        columns,
        columnsTogglable,
        orderBy: onQuery ? orderBy : undefined,
        orderDir,
        multiple,
        footable,
        expandConfig,
        primaryField,
        itemCheckableOn,
        itemDraggableOn,
        hideCheckToggler,
        combineNum,
        combineFromIndex,
        keepItemSelectionOnPageChange,
        maxKeepItemSelectionLength,
        loading,
        canAccessSuperData,
        lazyRenderAfter,
        tableLayout
      },
      {
        resolveDefinitions
      }
    );

    if (
      isPlainObject(autoGenerateFilter) &&
      autoGenerateFilter.defaultCollapsed === false
    ) {
      store.setSearchFormExpanded(true);
    }

    formItem && isAlive(formItem) && formItem.setSubStore(store);
    Table.syncRows(store, this.props, undefined) && this.syncSelected();

    this.toDispose.push(
      reaction(
        () =>
          store
            .getExpandedRows()
            .filter(
              row => row.defer && !row.loaded && !row.loading && !row.error
            ),
        (rows: Array<IRow>) => rows.forEach(this.loadDeferredRow)
      )
    );
  }

  static syncRows(
    store: ITableStore,
    props: TableProps,
    prevProps?: TableProps
  ) {
    const source = props.source;
    const value = props.value || props.items;
    let rows: Array<object> = [];
    let updateRows = false;

    // 要严格比较前后的value值，否则某些情况下会导致循环update无限渲染
    if (
      Array.isArray(value) &&
      (!prevProps || !isEqual(prevProps.value || prevProps.items, value))
    ) {
      updateRows = true;
      rows = value;
    } else if (typeof source === 'string') {
      const resolved = resolveVariableAndFilter(source, props.data, '| raw');
      const prev = prevProps
        ? resolveVariableAndFilter(source, prevProps.data, '| raw')
        : null;

      if (prev && prev === resolved) {
        updateRows = false;
      } else if (Array.isArray(resolved)) {
        updateRows = true;
        rows = resolved;
      }
    }

    updateRows && store.initRows(rows, props.getEntryId, props.reUseRow);
    Array.isArray(props.selected) &&
      store.updateSelected(props.selected, props.valueField);
    return updateRows;
  }

  componentDidMount() {
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
    const {store, autoGenerateFilter, onSearchableFromInit} = this.props;

    // autoGenerateFilter 开启后
    // 如果没有一个 searchable 的 column crud 就不会初始化加载
    // 所以这里加个判断默认初始加载一次
    if (
      autoGenerateFilter &&
      !store.searchableColumns.length &&
      onSearchableFromInit
    ) {
      onSearchableFromInit({});
    }
  }

  @autobind
  async loadDeferredRow(row: IRow) {
    const {env} = this.props;
    const deferApi = row.data.deferApi || this.props.deferApi;

    if (!isEffectiveApi(deferApi)) {
      throw new Error('deferApi is required');
    }

    try {
      row.markLoading(true);

      const response = await env.fetcher(deferApi, row.locals);
      if (!response.ok) {
        throw new Error(response.msg);
      }

      row.setDeferData(response.data);
      row.markLoaded(true);
      row.setError('');
    } catch (e) {
      row.setError(e.message);
      env.notify('error', e.message);
    } finally {
      row.markLoading(false);
    }
  }

  /**
   * 自动设置表格高度占满界面剩余区域
   * 用 css 实现有点麻烦，要改很多结构，所以先用 dom hack 了，避免对之前的功能有影响
   */
  updateAutoFillHeight() {
    const {autoFillHeight, footerToolbar, classPrefix: ns} = this.props;
    if (!autoFillHeight) {
      return;
    }
    const table = this.table!;
    const tableContent = table.parentElement as HTMLElement;

    if (!tableContent) {
      return;
    }

    // 可能数据还没到，没有渲染 footer
    // 也可能是弹窗中，弹窗还在动画中，等一下再执行
    if (
      !tableContent.offsetHeight ||
      tableContent.getBoundingClientRect().height / tableContent.offsetHeight <
        0.8
    ) {
      this.timer = setTimeout(() => {
        this.updateAutoFillHeight();
      }, 100);
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
      ? `${heightValue}px`
      : `${Math.round(
          viewportHeight - tableContentTop - tableContentBottom
        )}px`;

    tableContent.style[heightField] = tableContentHeight;
  }

  componentDidUpdate(prevProps: TableProps) {
    const props = this.props;
    const store = props.store;

    changedEffect(
      [
        'selectable',
        'columnsTogglable',
        'draggable',
        'orderBy',
        'orderDir',
        'multiple',
        'footable',
        'primaryField',
        'itemCheckableOn',
        'itemDraggableOn',
        'hideCheckToggler',
        'combineNum',
        'combineFromIndex',
        'expandConfig',
        'columns',
        'loading',
        'canAccessSuperData',
        'lazyRenderAfter',
        'tableLayout'
      ],
      prevProps,
      props,
      changes => {
        if (
          changes.hasOwnProperty('combineNum') &&
          typeof changes.combineNum === 'string'
        ) {
          changes.combineNum = parseInt(
            resolveVariableAndFilter(
              changes.combineNum as string,
              props.data,
              '| raw'
            ),
            10
          );
        }
        if (changes.orderBy && !props.onQuery) {
          delete changes.orderBy;
        }
        store.update(changes as any, {
          resolveDefinitions: props.resolveDefinitions
        });
      }
    );

    if (
      anyChanged(['source', 'value', 'items'], prevProps, props) ||
      (!props.value &&
        !props.items &&
        (props.data !== prevProps.data ||
          (typeof props.source === 'string' && isPureVariable(props.source))))
    ) {
      Table.syncRows(store, props, prevProps) && this.syncSelected();
    } else if (isArrayChildrenModified(prevProps.selected!, props.selected!)) {
      const prevSelectedRows = store.selectedRows
        .map(item => item.id)
        .join(',');

      store.updateSelected(props.selected || [], props.valueField);
      const selectedRows = store.selectedRows.map(item => item.id).join(',');
      prevSelectedRows !== selectedRows && this.syncSelected();
    }
  }

  componentWillUnmount() {
    const {formItem} = this.props;

    this.toDispose.forEach(fn => fn());
    this.toDispose = [];

    this.updateTableInfoLazy.cancel();
    this.updateAutoFillHeightLazy.cancel();
    formItem && isAlive(formItem) && formItem.setSubStore(null);
    clearTimeout(this.timer);

    const scoped = this.context as IScopedContext;
    scoped.unRegisterComponent(this);
  }

  subFormRef(form: any, x: number, y: number) {
    const {quickEditFormRef} = this.props;

    quickEditFormRef && quickEditFormRef(form, x, y);
    this.subForms[`${x}-${y}`] = form;
    form && this.props.store.addForm(form.props.store, y);
  }

  handleAction(
    e: React.UIEvent<any> | undefined,
    action: ActionObject,
    ctx: object
  ) {
    const {onAction} = this.props;

    // todo
    onAction(e, action, ctx);
  }

  async handleCheck(item: IRow, value?: boolean, shift?: boolean) {
    const {store, data, dispatchEvent, selectable} = this.props;

    if (!selectable) {
      return;
    }

    value = value !== undefined ? value : !item.checked;

    if (shift) {
      store.toggleShift(item, value);
    } else {
      // 如果picker的value是绑定的上层数量变量
      // 那么用户只能通过事件动作来更新上层变量来实现选中
      item.toggle(value);
    }

    const rendererEvent = await dispatchEvent(
      'selectedChange',
      createObject(data, {
        selectedItems: store.selectedRows.map(row => row.data),
        unSelectedItems: store.unSelectedRows.map(row => row.data),
        item: item.data
      })
    );

    if (rendererEvent?.prevented) {
      return;
    }

    this.syncSelected();
  }

  handleRowClick(item: IRow, index: number) {
    const {dispatchEvent, store, data} = this.props;
    return dispatchEvent(
      'rowClick',
      createObject(data, {
        rowItem: item, // 保留rowItem 可能有用户已经在用 兼容之前的版本
        item,
        index
      })
    );
  }

  handleRowDbClick(item: IRow, index: number) {
    const {dispatchEvent, store, data} = this.props;
    return dispatchEvent(
      'rowDbClick',
      createObject(data, {
        item,
        index
      })
    );
  }

  handleRowMouseEnter(item: IRow, index: number) {
    const {dispatchEvent, store, data} = this.props;
    return dispatchEvent(
      'rowMouseEnter',
      createObject(data, {
        item,
        index
      })
    );
  }

  handleRowMouseLeave(item: IRow, index: number) {
    const {dispatchEvent, store, data} = this.props;
    return dispatchEvent(
      'rowMouseLeave',
      createObject(data, {
        item,
        index
      })
    );
  }

  async handleCheckAll() {
    const {store, data, dispatchEvent} = this.props;
    const items = store.rows.map((row: any) => row.data);

    store.toggleAll();

    const rendererEvent = await dispatchEvent(
      'selectedChange',
      createObject(data, {
        selectedItems: store.selectedRows.map(row => row.data),
        unSelectedItems: store.unSelectedRows.map(row => row.data),
        items
      })
    );

    if (rendererEvent?.prevented) {
      return;
    }

    this.syncSelected();
  }

  handleQuickChange(
    item: IRow,
    values: object,
    saveImmediately?: boolean | any,
    savePristine?: boolean,
    options?: {
      resetOnFailed?: boolean;
      reload?: string;
    }
  ) {
    if (!isAlive(item)) {
      return;
    }

    const {
      onSave,
      onPristineChange,
      saveImmediately: propsSaveImmediately,
      primaryField
    } = this.props;

    item.change(values, savePristine);

    // 依然解决不了问题，所以先注释掉
    // 预期是，这个表党项修改的时候，把其他还没运算公式的表单更新最新值
    // 好让公式计算触发的值是最新的
    // 但是事与愿违，应该是修改了 store.data 但是 props.data 还没变过来
    // 即便如此，但是最终还是会算正确，只是会多触发几次 onChange :(
    // const y = item.index;
    // const str = `-${y}`;
    // Object.keys(this.subForms).forEach(key => {
    //   if (key.endsWith(str)) {
    //     this.subForms[key].props.store.updateData(values);
    //   }
    // });

    // 值发生变化了，需要通过 onSelect 通知到外面，否则会出现数据不同步的问题
    item.modified && this.syncSelected();

    if (savePristine) {
      onPristineChange?.(item.data, item.path);
      return;
    } else if (!saveImmediately && !propsSaveImmediately) {
      return;
    }

    if (saveImmediately && saveImmediately.api) {
      this.props.onAction(
        null,
        {
          actionType: 'ajax',
          api: saveImmediately.api,
          reload: options?.reload
        },
        item.locals
      );
      return;
    }

    if (!onSave) {
      return;
    }

    onSave(
      item.data,
      difference(item.data, item.pristine, ['id', primaryField]),
      item.path,
      undefined,
      item.pristine,
      options
    );
  }

  async handleSave() {
    const {store, onSave, primaryField} = this.props;

    if (!onSave || !store.modifiedRows.length) {
      return;
    }

    // 验证所有表单项，没有错误才继续
    const subForms: Array<any> = [];
    Object.keys(this.subForms).forEach(
      key => this.subForms[key] && subForms.push(this.subForms[key])
    );
    if (subForms.length) {
      const result = await Promise.all(subForms.map(item => item.validate()));
      if (~result.indexOf(false)) {
        return;
      }
    }

    // 校验直接放在单元格里面的表单项
    const subFormItems = store.children.filter(
      item => item?.storeType === 'FormItemStore'
    );
    if (subFormItems.length) {
      const result = await Promise.all(
        subFormItems.map(item => {
          let ctx = {};

          if (item.rowIndex && store.rows[item.rowIndex]) {
            ctx = store.rows[item.rowIndex].data;
          }

          return item.validate(ctx);
        })
      );
      if (~result.indexOf(false)) {
        return;
      }
    }

    const rows = store.modifiedRows.map(item => item.data);
    const rowIndexes = store.modifiedRows.map(item => item.path);
    const diff = store.modifiedRows.map(item =>
      difference(item.data, item.pristine, ['id', primaryField])
    );
    const unModifiedRows = store.rows
      .filter(item => !item.modified)
      .map(item => item.data);
    onSave(
      rows,
      diff,
      rowIndexes,
      unModifiedRows,
      store.modifiedRows.map(item => item.pristine)
    );
  }

  async handleSaveOrder() {
    const {store, onSaveOrder, data, dispatchEvent} = this.props;

    const movedItems = store.movedRows.map(item => item.data);
    const items = store.rows.map(item => item.getDataWithModifiedChilden());

    const rendererEvent = await dispatchEvent(
      'orderChange',
      createObject(data, {movedItems})
    );

    if (rendererEvent?.prevented) {
      return;
    }

    if (!onSaveOrder || !store.movedRows.length) {
      return;
    }

    onSaveOrder(movedItems, items);
  }

  syncSelected() {
    const {store, onSelect} = this.props;
    onSelect &&
      onSelect(
        store.selectedRows.map(item => item.data),
        store.unSelectedRows.map(item => item.data)
      );
  }

  reset() {
    const {store} = this.props;

    store.reset();

    const subForms: Array<any> = [];
    Object.keys(this.subForms).forEach(
      key => this.subForms[key] && subForms.push(this.subForms[key])
    );
    subForms.forEach(item => item.clearErrors());

    // 去掉错误提示
    const subFormItems = store.children.filter(
      item => item?.storeType === 'FormItemStore'
    );
    if (subFormItems.length) {
      subFormItems.map(item => item.reset());
    }
  }

  bulkUpdate(value: any, items: Array<object>) {
    const {store, primaryField} = this.props;

    if (primaryField && value.ids) {
      const ids = value.ids.split(',');
      const rows = store.rows.filter(item =>
        find(ids, (id: any) => id && id == item.data[primaryField])
      );
      const newValue = {...value, ids: undefined};
      rows.forEach(row => row.change(newValue));
    } else {
      const rows = store.rows.filter(item => ~items.indexOf(item.pristine));
      rows.forEach(row => row.change(value));
    }
  }

  getSelected() {
    const {store} = this.props;

    return store.selectedRows.map(item => item.data);
  }

  updateTableInfo(callback?: () => void) {
    if (this.resizeLine) {
      return;
    }
    this.props.store.syncTableWidth();
    this.props.store.initTableWidth();
    this.handleOutterScroll();
    callback && setTimeout(callback, 20);
  }

  // 当表格滚动是，需要让 affixHeader 部分的表格也滚动
  handleOutterScroll() {
    const table = this.table as HTMLElement;
    if (!table) {
      return;
    }

    const outter = table?.parentNode as HTMLElement;
    const scrollLeft = outter.scrollLeft;
    if (this.affixedTable) {
      this.affixedTable.parentElement!.scrollLeft = scrollLeft;
    }

    if (this.props.store.filteredColumns.some(column => column.fixed)) {
      let leading = scrollLeft === 0;
      let trailing =
        Math.ceil(scrollLeft) + outter.offsetWidth >= table.scrollWidth;

      [table, this.affixedTable]
        .filter(item => item)
        .forEach((table: HTMLElement) => {
          table.classList.remove('table-fixed-left', 'table-fixed-right');
          leading || table.classList.add('table-fixed-left');
          trailing || table.classList.add('table-fixed-right');
        });
    }
  }

  tableRef(ref: HTMLTableElement) {
    this.table = ref;
    isAlive(this.props.store) && this.props.store.setTable(ref);
    ref && this.handleOutterScroll();
  }

  dragTipRef(ref: any) {
    if (!this.dragTip && ref) {
      this.initDragging();
    } else if (this.dragTip && !ref) {
      this.destroyDragging();
    }

    this.dragTip = ref;
  }

  affixedTableRef(ref: HTMLTableElement) {
    this.affixedTable = ref;
    ref && this.handleOutterScroll();
  }

  initDragging() {
    const {store, classPrefix: ns} = this.props;
    this.sortable = new Sortable(
      (this.table as HTMLElement).querySelector(':scope>tbody') as HTMLElement,
      {
        group: 'table',
        animation: 150,
        handle: `.${ns}Table-dragCell`,
        filter: `.${ns}Table-dragCell.is-dragDisabled`,
        ghostClass: 'is-dragging',
        onEnd: async (e: any) => {
          // 没有移动
          if (e.newIndex === e.oldIndex) {
            return;
          }

          const parent = e.to as HTMLElement;
          if (e.oldIndex < parent.childNodes.length - 1) {
            parent.insertBefore(e.item, parent.childNodes[e.oldIndex]);
          } else {
            parent.appendChild(e.item);
          }

          store.exchange(e.oldIndex, e.newIndex);
        }
      }
    );
  }

  destroyDragging() {
    this.sortable && this.sortable.destroy();
  }

  getPopOverContainer() {
    return findDOMNode(this);
  }

  handleMouseMove(e: React.MouseEvent<any>) {
    const tr: HTMLElement = (e.target as HTMLElement).closest(
      'tr[data-id]'
    ) as HTMLElement;

    if (!tr) {
      return;
    }

    const {store, affixColumns, itemActions} = this.props;

    // if (
    //   (affixColumns === false ||
    //     (store.leftFixedColumns.length === 0 &&
    //       store.rightFixedColumns.length === 0)) &&
    //   (!itemActions || !itemActions.filter(item => !item.hiddenOnHover).length)
    // ) {
    //   return;
    // }

    const id = tr.getAttribute('data-id') as string;
    const row = store.hoverRow;

    if (row?.id === id) {
      return;
    }
    eachTree<IRow>(store.rows, (item: IRow) => item.setIsHover(item.id === id));
  }

  handleMouseLeave() {
    const store = this.props.store;
    const row = store.hoverRow;

    row?.setIsHover(false);
  }

  draggingTr: HTMLTableRowElement;
  originIndex: number;
  draggingSibling: Array<HTMLTableRowElement>;

  @autobind
  handleDragStart(e: React.DragEvent) {
    const store = this.props.store;
    const target = e.currentTarget;
    const tr = (this.draggingTr = target.closest('tr')!);
    const id = tr.getAttribute('data-id')!;
    const tbody = tr.parentNode as HTMLTableElement;
    this.originIndex = Array.prototype.indexOf.call(tbody.childNodes, tr);

    tbody.classList.add('is-dragging');
    tr.classList.add('is-dragging');

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);

    e.dataTransfer.setDragImage(tr, 0, 0);
    const item = store.getRowById(id)!;
    store.collapseAllAtDepth(item.depth);

    let siblings: Array<IRow> = store.rows;
    if (item.parentId) {
      const parent = store.getRowById(item.parentId)!;
      siblings = parent.children as any;
    }
    siblings = siblings.filter(sibling => sibling !== item);

    tbody.addEventListener('dragover', this.handleDragOver);
    tbody.addEventListener('drop', this.handleDrop);

    this.draggingSibling = siblings.map(item => {
      let tr: HTMLTableRowElement = tbody.querySelector(
        `:scope>tr[data-id="${item.id}"]`
      ) as HTMLTableRowElement;

      tr.classList.add('is-drop-allowed');

      return tr;
    });
    tr.addEventListener('dragend', this.handleDragEnd);
  }

  @autobind
  handleDragOver(e: any) {
    if (!e.target) {
      return;
    }
    e.preventDefault();
    e.dataTransfer!.dropEffect = 'move';

    const overTr: HTMLElement = (e.target as HTMLElement).closest('tr')!;
    if (
      !overTr ||
      !~overTr.className.indexOf('is-drop-allowed') ||
      overTr === this.draggingTr ||
      animation.animating
    ) {
      return;
    }

    const tbody = overTr.parentElement!;
    const tRect = overTr.getBoundingClientRect();

    const next = (e.clientY - tRect.top) / (tRect.bottom - tRect.top) > 0.5;
    animation.capture(tbody);
    const before = next ? overTr.nextSibling : overTr;
    before
      ? tbody.insertBefore(this.draggingTr, before)
      : tbody.appendChild(this.draggingTr);
    animation.animateAll();
  }

  @autobind
  async handleDrop() {
    const {store} = this.props;
    const tr = this.draggingTr;
    const tbody = tr.parentElement!;
    const index = Array.prototype.indexOf.call(tbody.childNodes, tr);
    const item: IRow = store.getRowById(tr.getAttribute('data-id')!) as any;

    // destroy
    this.handleDragEnd();

    store.exchange(this.originIndex, index, item);
  }

  @autobind
  handleDragEnd() {
    const tr = this.draggingTr;
    const tbody = tr.parentElement!;
    const index = Array.prototype.indexOf.call(tbody.childNodes, tr);
    tbody.insertBefore(
      tr,
      tbody.childNodes[
        index < this.originIndex ? this.originIndex + 1 : this.originIndex
      ]
    );

    tr.classList.remove('is-dragging');
    tbody.classList.remove('is-dragging');
    tr.removeEventListener('dragend', this.handleDragEnd);
    tbody.removeEventListener('dragover', this.handleDragOver);
    tbody.removeEventListener('drop', this.handleDrop);
    this.draggingSibling.forEach(item =>
      item.classList.remove('is-drop-allowed')
    );
  }

  @autobind
  handleImageEnlarge(
    info: any,
    target: {rowIndex: number; colIndex: number; type: string}
  ) {
    const onImageEnlarge = this.props.onImageEnlarge;

    // 如果已经是多张了，直接跳过
    if (
      (Array.isArray(info.list) && info.enlargeWithGallary !== true) ||
      info.enlargeWithGallary === false
    ) {
      return onImageEnlarge && onImageEnlarge(info, target);
    }

    // 从列表中收集所有图片，然后作为一个图片集合派送出去。
    const store = this.props.store;
    const column = store.columns[target.colIndex].pristine;

    let index = target.rowIndex;
    let list: Array<any> = [];

    store.rows.forEach((row, i) => {
      const src = resolveVariable(column.name, row.data);

      if (!src) {
        if (i < target.rowIndex) {
          index--;
        }
        return;
      }

      const images = Array.isArray(src) ? src : [src];
      list = list.concat(
        images.map(item => ({
          src: item,
          originalSrc: column.originalSrc
            ? filter(column.originalSrc, row.data)
            : item,
          title: column.enlargeTitle
            ? filter(column.enlargeTitle, row.data)
            : column.title
            ? filter(column.title, row.data)
            : undefined,
          caption: column.enlargeCaption
            ? filter(column.enlargeCaption, row.data)
            : column.caption
            ? filter(column.caption, row.data)
            : undefined
        }))
      );
    });

    if (list.length > 1) {
      onImageEnlarge &&
        onImageEnlarge(
          {
            ...info,
            list,
            index
          },
          target
        );
    } else {
      onImageEnlarge && onImageEnlarge(info, target);
    }
  }

  // 以下变量都是用于列宽度调整拖拽
  resizeLine?: HTMLElement;
  lineStartX: number;
  lineStartWidth: number;

  // 开始列宽度调整
  @autobind
  handleColResizeMouseDown(e: React.MouseEvent<HTMLElement>) {
    this.lineStartX = e.clientX;
    const currentTarget = e.currentTarget;
    this.resizeLine = currentTarget;
    const store = this.props.store;
    const index = parseInt(this.resizeLine!.getAttribute('data-index')!, 10);
    const column = store.columns[index];
    this.lineStartWidth = column.realWidth || column.width;
    this.resizeLine!.classList.add('is-resizing');

    document.addEventListener('mousemove', this.handleColResizeMouseMove);
    document.addEventListener('mouseup', this.handleColResizeMouseUp);

    // 防止选中文本
    e.preventDefault();
    e.stopPropagation();
  }

  // 垂直线拖拽移动
  @autobind
  handleColResizeMouseMove(e: MouseEvent) {
    const moveX = e.clientX - this.lineStartX;
    const store = this.props.store;
    const index = parseInt(this.resizeLine!.getAttribute('data-index')!, 10);
    const column = store.columns[index];

    column.setWidth(Math.max(this.lineStartWidth + moveX, 30, column.minWidth));
  }

  // 垂直线拖拽结束
  @autobind
  handleColResizeMouseUp(e: MouseEvent) {
    this.resizeLine!.classList.remove('is-resizing');
    delete this.resizeLine;
    document.removeEventListener('mousemove', this.handleColResizeMouseMove);
    document.removeEventListener('mouseup', this.handleColResizeMouseUp);
  }

  handleColumnToggle(columns: Array<IColumn>) {
    const {store} = this.props;

    store.updateColumns(columns);
  }

  renderAutoFilterForm(): React.ReactNode {
    const {
      render,
      store,
      onSearchableFromReset,
      onSearchableFromSubmit,
      onSearchableFromInit,
      classnames: cx,
      translate: __,
      query,
      data,
      autoGenerateFilter
    } = this.props;

    const searchableColumns = store.searchableColumns;
    if (!searchableColumns.length) {
      return null;
    }
    return (
      <AutoFilterForm
        store={store}
        query={query}
        data={data}
        translate={__}
        classnames={cx}
        render={render}
        autoGenerateFilter={autoGenerateFilter}
        onSearchableFromReset={onSearchableFromReset}
        onSearchableFromSubmit={onSearchableFromSubmit}
        onSearchableFromInit={onSearchableFromInit}
        popOverContainer={this.getPopOverContainer}
      />
    );
  }

  renderHeading() {
    let {
      title,
      store,
      hideQuickSaveBtn,
      data,
      classnames: cx,
      saveImmediately,
      headingClassName,
      quickSaveApi,
      translate: __,
      columns
    } = this.props;

    // 当被修改列的 column 开启 quickEdit.saveImmediately 时，不展示提交、放弃按钮
    let isModifiedColumnSaveImmediately = false;
    if (store.modifiedRows.length === 1) {
      const saveImmediatelyColumnNames: string[] =
        columns
          ?.map(column =>
            column?.quickEdit?.saveImmediately ? column?.name : ''
          )
          .filter(a => a) || [];

      const item = store.modifiedRows[0];
      const diff = difference(item.data, item.pristine);
      if (intersection(saveImmediatelyColumnNames, Object.keys(diff)).length) {
        isModifiedColumnSaveImmediately = true;
      }
    }

    if (
      title ||
      (quickSaveApi &&
        !saveImmediately &&
        !isModifiedColumnSaveImmediately &&
        store.modified &&
        !hideQuickSaveBtn) ||
      store.moved
    ) {
      return (
        <div className={cx('Table-heading', headingClassName)} key="heading">
          {!saveImmediately &&
          store.modified &&
          !hideQuickSaveBtn &&
          !isModifiedColumnSaveImmediately ? (
            <span>
              {__('Table.modified', {
                modified: store.modified
              })}
              <button
                type="button"
                className={cx('Button Button--size-xs Button--success m-l-sm')}
                onClick={this.handleSave}
              >
                <Icon icon="check" className="icon m-r-xs" />
                {__('Form.submit')}
              </button>
              <button
                type="button"
                className={cx('Button Button--size-xs Button--danger m-l-sm')}
                onClick={this.reset}
              >
                <Icon icon="close" className="icon m-r-xs" />
                {__('Table.discard')}
              </button>
            </span>
          ) : store.moved ? (
            <span>
              {__('Table.moved', {
                moved: store.moved
              })}
              <button
                type="button"
                className={cx('Button Button--xs Button--success m-l-sm')}
                onClick={this.handleSaveOrder}
              >
                <Icon icon="check" className="icon m-r-xs" />
                {__('Form.submit')}
              </button>
              <button
                type="button"
                className={cx('Button Button--xs Button--danger m-l-sm')}
                onClick={this.reset}
              >
                <Icon icon="close" className="icon m-r-xs" />
                {__('Table.discard')}
              </button>
            </span>
          ) : title ? (
            filter(title, data)
          ) : (
            ''
          )}
        </div>
      );
    }

    return null;
  }

  renderHeadCell(column: IColumn, props?: any) {
    const {
      store,
      query,
      onQuery,
      render,
      classPrefix: ns,
      resizable,
      classnames: cx,
      autoGenerateFilter,
      dispatchEvent,
      data
    } = this.props;

    // 注意，这里用关了哪些 store 里面的东西，TableContent 里面得也用一下
    // 因为 renderHeadCell 是 TableContent 回调的，tableContent 不重新渲染，这里面也不会重新渲染

    const style = {...props.style};
    const [stickyStyle, stickyClassName] = store.getStickyStyles(
      column,
      store.filteredColumns
    );
    Object.assign(style, stickyStyle);

    const resizeLine = (
      <div
        className={cx('Table-content-colDragLine')}
        key={`resize-${column.id}`}
        data-index={column.index}
        onMouseDown={this.handleColResizeMouseDown}
      ></div>
    );

    // th 里面不应该设置
    if (style?.width) {
      delete style.width;
    }
    if (column.pristine.align) {
      style.textAlign = column.pristine.align;
    }

    if (column.type === '__checkme') {
      return (
        <th
          {...props}
          style={style}
          className={cx(column.pristine.className, stickyClassName)}
        >
          {store.rows.length && store.multiple ? (
            <Checkbox
              classPrefix={ns}
              partial={store.someChecked && !store.allChecked}
              checked={store.someChecked}
              disabled={store.isSelectionThresholdReached}
              onChange={this.handleCheckAll}
            />
          ) : (
            '\u00A0'
          )}

          {resizable === false ? null : resizeLine}
        </th>
      );
    } else if (column.type === '__dragme') {
      return (
        <th
          {...props}
          style={style}
          className={cx(column.pristine.className, stickyClassName)}
        />
      );
    } else if (column.type === '__expandme') {
      return (
        <th
          {...props}
          style={style}
          className={cx(column.pristine.className, stickyClassName)}
        >
          {(store.footable &&
            (store.footable.expandAll === false || store.footable.accordion)) ||
          (store.expandConfig &&
            (store.expandConfig.expandAll === false ||
              store.expandConfig.accordion)) ? null : (
            <a
              className={cx(
                'Table-expandBtn',
                store.allExpanded ? 'is-active' : ''
              )}
              // data-tooltip="展开/收起全部"
              // data-position="top"
              onClick={store.toggleExpandAll}
            >
              <Icon icon="right-arrow-bold" className="icon" />
            </a>
          )}

          {resizable === false ? null : resizeLine}
        </th>
      );
    }

    const prefix: Array<JSX.Element> = [];
    const affix: Array<JSX.Element> = [];

    if (column.isPrimary && store.isNested) {
      (store.footable &&
        (store.footable.expandAll === false || store.footable.accordion)) ||
        (store.expandConfig &&
          (store.expandConfig.expandAll === false ||
            store.expandConfig.accordion)) ||
        prefix.push(
          <a
            key="expandBtn"
            className={cx(
              'Table-expandBtn2',
              store.allExpanded ? 'is-active' : ''
            )}
            // data-tooltip="展开/收起全部"
            // data-position="top"
            onClick={store.toggleExpandAll}
          >
            <Icon icon="right-arrow-bold" className="icon" />
          </a>
        );
    }

    if (column.searchable && column.name && !autoGenerateFilter) {
      affix.push(
        <HeadCellSearchDropDown
          {...props}
          key="table-head-search"
          {...this.props}
          onQuery={onQuery}
          name={column.name}
          searchable={column.searchable}
          type={column.type}
          data={query}
          popOverContainer={this.getPopOverContainer}
        />
      );
    }
    if (column.sortable && column.name) {
      affix.push(
        <span
          {...props}
          key="table-head-sort"
          className={cx('TableCell-sortBtn')}
          onClick={async () => {
            let orderBy = '';
            let orderDir = '';
            if (column.name === store.orderBy) {
              if (store.orderDir !== 'desc') {
                // 升序之后降序
                orderBy = column.name;
                orderDir = 'desc';
              }
            } else {
              orderBy = column.name as string;
            }

            const order = orderBy ? (orderDir ? 'desc' : 'asc') : '';
            const rendererEvent = await dispatchEvent(
              'columnSort',
              createObject(data, {
                orderBy,
                orderDir: order
              })
            );

            if (rendererEvent?.prevented) {
              return;
            }

            if (
              !onQuery ||
              onQuery({
                orderBy,
                orderDir: order
              }) === false
            ) {
              store.changeOrder(orderBy, order);
            }
          }}
        >
          <i
            className={cx(
              'TableCell-sortBtn--down',
              store.orderBy === column.name && store.orderDir === 'desc'
                ? 'is-active'
                : ''
            )}
          >
            <Icon icon="sort-desc" className="icon" />
          </i>
          <i
            className={cx(
              'TableCell-sortBtn--up',
              store.orderBy === column.name && store.orderDir === 'asc'
                ? 'is-active'
                : ''
            )}
          >
            <Icon icon="sort-asc" className="icon" />
          </i>
          <i
            className={cx(
              'TableCell-sortBtn--default',
              store.orderBy === column.name ? '' : 'is-active'
            )}
          >
            <Icon icon="sort-default" className="icon" />
          </i>
        </span>
      );
    }
    if (!column.searchable && column.filterable && column.name && onQuery) {
      affix.push(
        <HeadCellFilterDropDown
          key="table-head-filter"
          {...this.props}
          onQuery={onQuery}
          name={column.name}
          type={column.type}
          data={query}
          superData={createObject(data, query)}
          filterable={column.filterable}
          popOverContainer={this.getPopOverContainer}
        />
      );
    }

    return (
      <th
        {...props}
        style={style}
        className={cx(props ? (props as any).className : '', stickyClassName, {
          'TableCell--sortable': column.sortable,
          'TableCell--searchable': column.searchable,
          'TableCell--filterable': column.filterable,
          'Table-operationCell': column.type === 'operation'
        })}
      >
        {prefix}
        <div
          key="content"
          className={cx(
            `TableCell--title`,
            column.pristine.className,
            column.pristine.labelClassName
          )}
          style={props.style}
        >
          {props.label ?? column.label
            ? render('tpl', props.label ?? column.label)
            : null}

          {column.remark
            ? render('remark', {
                type: 'remark',
                tooltip: column.remark,
                container: this.getPopOverContainer
              })
            : null}
        </div>

        {affix}
        {resizable === false ? null : resizeLine}
      </th>
    );
  }

  renderCell(
    region: string,
    column: IColumn,
    item: IRow,
    props: any,
    ignoreDrag = false
  ) {
    const {
      render,
      store,
      classPrefix: ns,
      classnames: cx,
      canAccessSuperData,
      itemBadge,
      translate
    } = this.props;

    return (
      <Cell
        key={props.key}
        region={region}
        column={column}
        item={item}
        props={props}
        ignoreDrag={ignoreDrag}
        render={render}
        store={store}
        multiple={store.multiple}
        canAccessSuperData={canAccessSuperData}
        classnames={cx}
        classPrefix={ns}
        itemBadge={itemBadge}
        onCheck={this.handleCheck}
        onDragStart={this.handleDragStart}
        popOverContainer={this.getPopOverContainer}
        quickEditFormRef={this.subFormRef}
        onImageEnlarge={this.handleImageEnlarge}
        translate={translate}
      />
    );
  }

  renderAffixHeader(tableClassName: string) {
    const {
      store,
      affixHeader,
      render,
      classnames: cx,
      autoFillHeight,
      env
    } = this.props;
    const hideHeader = store.filteredColumns.every(column => !column.label);
    const columnsGroup = store.columnGroup;

    return affixHeader && !autoFillHeight ? (
      <>
        <div
          className={cx('Table-fixedTop', {
            'is-fakeHide': hideHeader
          })}
        >
          {this.renderHeader(false)}
          {this.renderHeading()}
          {store.columnWidthReady ? (
            <div className={cx('Table-wrapper')}>
              <table
                ref={this.affixedTableRef}
                className={cx(
                  tableClassName,
                  store.tableLayout === 'fixed' ? 'is-layout-fixed' : ''
                )}
              >
                <colgroup>
                  {store.filteredColumns.map(column => {
                    const style: any = {
                      width: `var(--Table-column-${column.index}-width)`
                    };

                    if (store.tableLayout === 'auto') {
                      style.minWidth = style.width;
                    }

                    return (
                      <col
                        data-index={column.index}
                        style={style}
                        key={column.id}
                      />
                    );
                  })}
                </colgroup>
                <thead>
                  {columnsGroup.length ? (
                    <tr>
                      {columnsGroup.map((item, index) => {
                        const [stickyStyle, stickyClassName] =
                          store.getStickyStyles(
                            item as any,
                            columnsGroup as any
                          );

                        return item.rowSpan === 1 ? ( // 如果是分组自己，则用 th 渲染
                          <th
                            key={index}
                            data-index={item.index}
                            colSpan={item.colSpan}
                            rowSpan={item.rowSpan}
                            style={stickyStyle}
                            className={stickyClassName}
                          >
                            {item.label ? render('tpl', item.label) : null}
                          </th>
                        ) : (
                          // 否则走 renderCell 因为不走的话，排序按钮不会渲染
                          this.renderHeadCell(item.has[0], {
                            'label': item.label,
                            'key': index,
                            'data-index': item.index,
                            'colSpan': item.colSpan,
                            'rowSpan': item.rowSpan,
                            'style': stickyStyle,
                            'className': stickyClassName
                          })
                        );
                      })}
                    </tr>
                  ) : null}
                  <tr>
                    {store.filteredColumns.map(column =>
                      columnsGroup.find(group => ~group.has.indexOf(column))
                        ?.rowSpan === 2
                        ? null
                        : this.renderHeadCell(column, {
                            'key': column.index,
                            'data-index': column.index
                          })
                    )}
                  </tr>
                </thead>
              </table>
            </div>
          ) : null}
        </div>
      </>
    ) : null;
  }

  renderToolbar(toolbar: SchemaNode) {
    const type = (toolbar as Schema).type || (toolbar as string);

    if (type === 'columns-toggler') {
      this.renderedToolbars.push(type);
      return this.renderColumnsToggler(toolbar as any);
    } else if (type === 'drag-toggler') {
      this.renderedToolbars.push(type);
      return this.renderDragToggler();
    } else if (type === 'export-excel') {
      this.renderedToolbars.push(type);
      return this.renderExportExcel(toolbar);
    }

    return void 0;
  }

  renderColumnsToggler(config?: any) {
    const {
      className,
      store,
      classPrefix: ns,
      classnames: cx,
      affixRow,
      ...rest
    } = this.props;
    const __ = rest.translate;
    const env = rest.env;
    const render = this.props.render;

    if (!store.columnsTogglable) {
      return null;
    }

    return (
      <ColumnToggler
        {...rest}
        {...(isObject(config) ? config : {})}
        tooltip={{
          content: config?.tooltip || __('Table.columnsVisibility'),
          placement: 'bottom'
        }}
        tooltipContainer={rest.popOverContainer || env.getModalContainer}
        align={config?.align ?? 'left'}
        isActived={store.hasColumnHidden()}
        classnames={cx}
        classPrefix={ns}
        key="columns-toggable"
        size={config?.size || 'sm'}
        icon={config?.icon}
        label={config?.label}
        draggable={config?.draggable}
        columns={store.columnsData}
        activeToggaleColumns={store.activeToggaleColumns}
        onColumnToggle={this.handleColumnToggle}
      >
        {store.toggableColumns.length ? (
          <li
            className={cx('ColumnToggler-menuItem')}
            key={'selectAll'}
            onClick={async () => {
              const {data, dispatchEvent} = this.props;

              const allToggled = !(
                store.activeToggaleColumns.length ===
                store.toggableColumns.length
              );
              const rendererEvent = await dispatchEvent(
                'columnToggled',
                createObject(data, {
                  columns: allToggled
                    ? store.toggableColumns.map(column => column.pristine)
                    : []
                })
              );

              if (rendererEvent?.prevented) {
                return;
              }

              store.toggleAllColumns();
            }}
          >
            <Checkbox
              size="sm"
              classPrefix={ns}
              key="checkall"
              checked={!!store.activeToggaleColumns.length}
              partial={
                !!(
                  store.activeToggaleColumns.length &&
                  store.activeToggaleColumns.length !==
                    store.toggableColumns.length
                )
              }
            >
              {__('Checkboxes.selectAll')}
            </Checkbox>
          </li>
        ) : null}

        {store.toggableColumns.map(column => (
          <li
            className={cx('ColumnToggler-menuItem')}
            key={column.index}
            onClick={async () => {
              const {data, dispatchEvent} = this.props;
              let columns = store.activeToggaleColumns.map(
                item => item.pristine
              );
              if (!column.toggled) {
                columns.push(column.pristine);
              } else {
                columns = columns.filter(c => c.name !== column.pristine.name);
              }
              const rendererEvent = await dispatchEvent(
                'columnToggled',
                createObject(data, {
                  columns
                })
              );

              if (rendererEvent?.prevented) {
                return;
              }

              column.toggleToggle();
            }}
          >
            <Checkbox size="sm" classPrefix={ns} checked={column.toggled}>
              {column.label ? render('tpl', column.label) : null}
            </Checkbox>
          </li>
        ))}
      </ColumnToggler>
    );
  }

  renderDragToggler() {
    const {
      store,
      env,
      draggable,
      classPrefix: ns,
      translate: __,
      popOverContainer
    } = this.props;

    if (!draggable || store.isNested) {
      return null;
    }

    return (
      <Button
        disabled={!!store.modified}
        classPrefix={ns}
        key="dragging-toggle"
        tooltip={{content: __('Table.startSort'), placement: 'bottom'}}
        tooltipContainer={popOverContainer || env.getModalContainer}
        size="sm"
        active={store.dragging}
        onClick={(e: React.MouseEvent<any>) => {
          e.preventDefault();
          store.toggleDragging();
          store.dragging && store.clear();
        }}
        iconOnly
      >
        <Icon icon="exchange" className="icon" />
      </Button>
    );
  }

  renderExportExcel(toolbar: ExportExcelToolbar) {
    const {
      store,
      env,
      classPrefix: ns,
      classnames: cx,
      translate: __,
      data,
      render
    } = this.props;
    let columns = store.filteredColumns || [];

    if (!columns) {
      return null;
    }

    return render(
      'exportExcel',
      {
        label: __('CRUD.exportExcel'),
        ...(toolbar as any),

        type: 'button'
      },
      {
        loading: store.exportExcelLoading,
        onAction: () => {
          store.update({exportExcelLoading: true});
          import('exceljs').then(async (ExcelJS: any) => {
            try {
              await exportExcel(ExcelJS, this.props, toolbar);
            } catch (error) {
              console.error(error);
            } finally {
              store.update({exportExcelLoading: false});
            }
          });
        }
      }
    );
  }

  renderActions(region: string) {
    let {actions, render, store, classnames: cx, data} = this.props;

    actions = Array.isArray(actions) ? actions.concat() : [];

    if (
      store.toggable &&
      region === 'header' &&
      !~this.renderedToolbars.indexOf('columns-toggler')
    ) {
      actions.push({
        type: 'button',
        children: this.renderColumnsToggler()
      });
    }

    if (
      store.draggable &&
      !store.isNested &&
      region === 'header' &&
      store.rows.length > 1 &&
      !~this.renderedToolbars.indexOf('drag-toggler')
    ) {
      actions.push({
        type: 'button',
        children: this.renderDragToggler()
      });
    }

    return Array.isArray(actions) && actions.length ? (
      <div className={cx('Table-actions')}>
        {actions.map((action, key) =>
          render(
            `action/${key}`,
            {
              type: 'button',
              ...(action as any)
            },
            {
              onAction: this.handleAction,
              key,
              btnDisabled: store.dragging,
              data: store.getData(data)
            }
          )
        )}
      </div>
    ) : null;
  }

  renderHeader(editable?: boolean) {
    const {
      header,
      headerClassName,
      toolbarClassName,
      headerToolbarClassName,
      headerToolbarRender,
      render,
      showHeader,
      store,
      classnames: cx,
      data,
      translate: __
    } = this.props;

    if (showHeader === false) {
      return null;
    }

    const otherProps: any = {};
    // editable === false && (otherProps.$$editable = false);

    const child = headerToolbarRender
      ? headerToolbarRender(
          {
            ...this.props,
            selectedItems: store.selectedRows.map(item => item.data),
            items: store.rows.map(item => item.data),
            unSelectedItems: store.unSelectedRows.map(item => item.data),
            ...otherProps
          },
          this.renderToolbar
        )
      : null;
    const actions = this.renderActions('header');

    const toolbarNode =
      actions || child || store.dragging ? (
        <div
          className={cx(
            'Table-toolbar Table-headToolbar',
            toolbarClassName,
            headerToolbarClassName
          )}
          key="header-toolbar"
        >
          {actions}
          {child}
          {store.dragging ? (
            <div className={cx('Table-dragTip')} ref={this.dragTipRef}>
              {__('Table.dragTip')}
            </div>
          ) : null}
        </div>
      ) : null;
    const headerNode =
      header && (!Array.isArray(header) || header.length) ? (
        <div className={cx('Table-header', headerClassName)} key="header">
          {render('header', header, {
            ...(editable === false ? otherProps : null),
            data: store.getData(data)
          })}
        </div>
      ) : null;

    return headerNode && toolbarNode
      ? [headerNode, toolbarNode]
      : headerNode || toolbarNode || null;
  }

  renderFooter() {
    const {
      footer,
      toolbarClassName,
      footerToolbarClassName,
      footerClassName,
      footerToolbarRender,
      render,
      showFooter,
      store,
      data,
      classnames: cx
    } = this.props;

    if (showFooter === false) {
      return null;
    }

    const child = footerToolbarRender
      ? footerToolbarRender(
          {
            ...this.props,
            selectedItems: store.selectedRows.map(item => item.data),
            unSelectedItems: store.unSelectedRows.map(item => item.data),
            items: store.rows.map(item => item.data)
          },
          this.renderToolbar
        )
      : null;
    const actions = this.renderActions('footer');

    const toolbarNode =
      actions || child ? (
        <div
          className={cx(
            'Table-toolbar Table-footToolbar',
            toolbarClassName,
            footerToolbarClassName
          )}
          key="footer-toolbar"
        >
          {actions}
          {child}
        </div>
      ) : null;
    const footerNode =
      footer && (!Array.isArray(footer) || footer.length) ? (
        <div className={cx('Table-footer', footerClassName)} key="footer">
          {render('footer', footer, {
            data: store.getData(data)
          })}
        </div>
      ) : null;
    return footerNode && toolbarNode
      ? [toolbarNode, footerNode]
      : footerNode || toolbarNode || null;
  }

  renderTableContent() {
    const {
      classnames: cx,
      tableClassName,
      store,
      placeholder,
      render,
      checkOnItemClick,
      buildItemProps,
      rowClassNameExpr,
      rowClassName,
      prefixRow,
      locale,
      affixRow,
      tableContentClassName,
      translate,
      itemAction,
      affixRowClassNameExpr,
      affixRowClassName,
      prefixRowClassNameExpr,
      prefixRowClassName,
      autoFillHeight,
      affixHeader,
      itemActions,
      dispatchEvent,
      onEvent,
      loadingConfig
    } = this.props;

    // 理论上来说 store.rows 应该也行啊
    // 不过目前看来只有这样写它才会重新更新视图
    store.rows.length;

    return (
      <>
        {renderItemActions({
          store,
          classnames: cx,
          render,
          itemActions
        })}
        <TableContent
          tableClassName={cx(
            {
              'Table-table--checkOnItemClick': checkOnItemClick,
              'Table-table--withCombine': store.combineNum > 0,
              'Table-table--affixHeader':
                affixHeader && !autoFillHeight && store.columnWidthReady
            },
            tableClassName
          )}
          className={tableContentClassName}
          itemActions={itemActions}
          itemAction={itemAction}
          store={store}
          classnames={cx}
          columns={store.filteredColumns}
          columnsGroup={store.columnGroup}
          rows={store.items} // store.rows 是没有变更的，所以不会触发更新
          placeholder={placeholder}
          render={render}
          onMouseMove={
            // 如果没有 itemActions, 那么就不需要处理了。
            Array.isArray(itemActions) && itemActions.length
              ? this.handleMouseMove
              : undefined
          }
          onScroll={this.handleOutterScroll}
          tableRef={this.tableRef}
          renderHeadCell={this.renderHeadCell}
          renderCell={this.renderCell}
          onCheck={this.handleCheck}
          onRowClick={this.handleRowClick}
          onRowDbClick={this.handleRowDbClick}
          onRowMouseEnter={this.handleRowMouseEnter}
          onRowMouseLeave={this.handleRowMouseLeave}
          onQuickChange={store.dragging ? undefined : this.handleQuickChange}
          footable={store.footable}
          footableColumns={store.footableColumns}
          checkOnItemClick={checkOnItemClick}
          buildItemProps={buildItemProps}
          onAction={this.handleAction}
          rowClassNameExpr={rowClassNameExpr}
          rowClassName={rowClassName}
          data={store.data}
          prefixRow={prefixRow}
          affixRow={affixRow}
          prefixRowClassName={prefixRowClassName}
          affixRowClassName={affixRowClassName}
          locale={locale}
          translate={translate}
          dispatchEvent={dispatchEvent}
          onEvent={onEvent}
          loading={store.loading} // store 的同步较慢，所以统一用 store 来下发，否则会出现 props 和 store 变化触发子节点两次 re-rerender
        />

        <Spinner loadingConfig={loadingConfig} overlay show={store.loading} />
      </>
    );
  }

  doAction(action: ActionObject, args: any, throwErrors: boolean): any {
    const {store, valueField, data} = this.props;

    const actionType = action?.actionType as string;

    switch (actionType) {
      case 'selectAll':
        store.clear();
        store.toggleAll();
        break;
      case 'clearAll':
        store.clear();
        break;
      case 'select':
        const dataSource = store.getData(data);
        const selected: Array<any> = [];
        dataSource.items.forEach((item: any, rowIndex: number) => {
          const flag = evalExpression(args?.selected, {record: item, rowIndex});
          if (flag) {
            selected.push(item);
          }
        });
        store.updateSelected(selected, valueField);
        break;
      case 'initDrag':
        store.stopDragging();
        store.toggleDragging();
        break;
      default:
        this.handleAction(undefined, action, data);
        break;
    }
  }

  render() {
    const {
      className,
      style,
      store,
      classnames: cx,
      affixColumns,
      affixHeader,
      autoFillHeight,
      autoGenerateFilter,
      mobileUI
    } = this.props;

    this.renderedToolbars = []; // 用来记录哪些 toolbar 已经渲染了，已经渲染了就不重复渲染了。
    const heading =
      affixHeader && !autoFillHeight ? null : this.renderHeading();
    const header = affixHeader && !autoFillHeight ? null : this.renderHeader();
    const footer = this.renderFooter();
    const tableClassName = cx('Table-table', this.props.tableClassName, {
      'Table-table--withCombine': store.combineNum > 0
    });

    return (
      <div
        className={cx('Table', {'is-mobile': mobileUI}, className, {
          'Table--unsaved': !!store.modified || !!store.moved,
          'Table--autoFillHeight': autoFillHeight
        })}
        style={store.buildStyles(style)}
      >
        {autoGenerateFilter ? this.renderAutoFilterForm() : null}
        {this.renderAffixHeader(tableClassName)}
        {header}
        {heading}
        <div
          className={cx('Table-contentWrap')}
          onMouseLeave={this.handleMouseLeave}
        >
          {this.renderTableContent()}
        </div>

        {footer}
      </div>
    );
  }
}

@Renderer({
  type: 'table',
  storeType: TableStore.name,
  name: 'table'
})
export class TableRenderer extends Table {
  receive(values: any, subPath?: string) {
    const scoped = this.context as IScopedContext;
    const parents = scoped?.parent?.getComponents();

    /**
     * 因为Table在scope上注册，导致getComponentByName查询组件时会优先找到Table，和CRUD联动的动作都会失效
     * 这里先做兼容处理，把动作交给上层的CRUD处理
     */
    if (Array.isArray(parents) && parents.length) {
      // CRUD的name会透传给Table，这样可以保证找到CRUD
      const crud = parents.find(cmpt => cmpt?.props?.name === this.props?.name);

      return crud?.receive?.(values, subPath);
    }

    if (subPath) {
      return scoped.send(subPath, values);
    }
  }

  reload(subPath?: string, query?: any, ctx?: any) {
    const scoped = this.context as IScopedContext;
    const parents = scoped?.parent?.getComponents();

    if (Array.isArray(parents) && parents.length) {
      // CRUD的name会透传给Table，这样可以保证找到CRUD
      const crud = parents.find(cmpt => cmpt?.props?.name === this.props?.name);

      return crud?.reload?.(subPath, query, ctx);
    }

    if (subPath) {
      return scoped.reload(subPath, ctx);
    }
  }

  async setData(
    values: any,
    replace?: boolean,
    index?: number | string,
    condition?: any
  ) {
    const {store} = this.props;
    const len = store.data.rows.length;

    if (index !== undefined) {
      let items = [...store.data.rows];
      const indexs = String(index).split(',');
      indexs.forEach(i => {
        const intIndex = Number(i);
        items.splice(intIndex, 1, values);
      });
      // 更新指定行记录，只需要提供行记录即可
      return store.updateData({rows: items}, undefined, replace);
    } else if (condition !== undefined) {
      let items = [...store.data.rows];
      for (let i = 0; i < len; i++) {
        const item = items[i];
        const isUpdate = await evalExpressionWithConditionBuilder(
          condition,
          item
        );

        if (isUpdate) {
          items.splice(i, 1, values);
        }
      }

      // 更新指定行记录，只需要提供行记录即可
      return store.updateData({rows: items}, undefined, replace);
    } else {
      const data = {
        ...values,
        rows: values.rows ?? values.items // 做个兼容
      };
      return store.updateData(data, undefined, replace);
    }
  }

  getData() {
    const {store, data} = this.props;
    return store.getData(data);
  }
}

export {TableCell};
