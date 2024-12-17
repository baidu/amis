import React from 'react';
import isEqual from 'lodash/isEqual';
import pickBy from 'lodash/pickBy';
import omitBy from 'lodash/omitBy';
import partition from 'lodash/partition';
import {
  Renderer,
  RendererProps,
  createObjectFromChain,
  filterTarget,
  mapTree
} from 'amis-core';
import {SchemaNode, Schema, ActionObject, PlainObject} from 'amis-core';
import {CRUDStore, ICRUDStore, getMatchedEventTargets} from 'amis-core';
import {
  createObject,
  extendObject,
  anyChanged,
  isObjectShallowModified,
  isVisible,
  getPropValue,
  getVariable,
  qsstringify,
  qsparse,
  isIntegerInRange
} from 'amis-core';
import {ScopedContext, IScopedContext} from 'amis-core';
import {Button, SpinnerExtraProps, TooltipWrapper} from 'amis-ui';
import {Select} from 'amis-ui';
import {getExprProperties, isObject} from 'amis-core';
import pick from 'lodash/pick';
import {findDOMNode} from 'react-dom';
import {evalExpression, filter} from 'amis-core';
import {isEffectiveApi, isApiOutdated, str2function} from 'amis-core';
import omit from 'lodash/omit';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import {Html} from 'amis-ui';
import {Icon} from 'amis-ui';
import {
  BaseSchema,
  SchemaApi,
  SchemaClassName,
  SchemaExpression,
  SchemaMessage,
  SchemaName,
  SchemaObject,
  SchemaTokenizeableString,
  SchemaTpl,
  SchemaCollection
} from '../Schema';
import {ActionSchema} from './Action';
import {CardsSchema} from './Cards';
import {ListSchema} from './List';
import {TableSchema} from './Table';
import type {TableRendererEvent} from './Table';
import type {CardsRendererEvent} from './Cards';
import {
  isPureVariable,
  resolveVariableAndFilter,
  parseQuery,
  parsePrimitiveQueryString,
  isMobile
} from 'amis-core';

import type {PaginationProps} from './Pagination';
import {isAlive} from 'mobx-state-tree';
import isPlainObject from 'lodash/isPlainObject';
import memoize from 'lodash/memoize';

export type CRUDBultinToolbarType =
  | 'columns-toggler'
  | 'drag-toggler'
  | 'pagination'
  | 'bulkActions'
  | 'bulk-actions'
  | 'statistics'
  | 'switch-per-page'
  | 'load-more'
  | 'filter-toggler'
  | 'export-csv'
  | 'export-excel';

export interface CRUDBultinToolbar extends Omit<BaseSchema, 'type'> {
  type: CRUDBultinToolbarType;
}

export type CRUDToolbarChild = SchemaObject | CRUDBultinToolbar;

export type CRUDToolbarObject = {
  /**
   * 对齐方式
   */
  align?: 'left' | 'right';
};

export type AutoGenerateFilterObject = {
  /**
   * 过滤条件单行列数
   */
  columnsNum?: number;
  /**
   * 是否显示设置查询字段
   */
  showBtnToolbar?: boolean;
  /**
   * 是否显示展开/收起
   */
  // showExpand?: boolean;

  /**
   * 是否默认收起
   *
   * @default true
   */
  defaultCollapsed?: boolean;
};

export type CRUDRendererEvent = TableRendererEvent | CardsRendererEvent;

export interface CRUDCommonSchema extends BaseSchema, SpinnerExtraProps {
  /**
   *  指定为 CRUD 渲染器。
   */
  type: 'crud';

  /**
   * 指定内容区的展示模式。
   */
  mode?: 'table' | 'grid' | 'cards' | /* grid 的别名*/ 'list';

  /**
   * 初始化数据 API
   */
  api?: SchemaApi;

  /**
   * 懒加载 API，当行数据中用 defer: true 标记了，则其孩子节点将会用这个 API 来拉取数据。
   */
  deferApi?: SchemaApi;

  /**
   * 批量操作
   */
  bulkActions?: Array<ActionSchema>;

  /**
   * 单条操作
   */
  itemActions?: Array<ActionSchema>;

  /**
   * 每页个数，默认为 10，如果不是请设置。
   *
   * @default 10
   */
  perPage?: number;

  /**
   * 默认排序字段
   */
  orderBy?: string;

  /**
   * 默认排序方向
   */
  orderDir?: 'asc' | 'desc';

  /**
   * 可以默认给定初始参数如： {\"perPage\": 24}
   */
  defaultParams?: PlainObject;

  /**
   * 是否可通过拖拽排序
   */
  draggable?: boolean;

  /**
   * 是否可通过拖拽排序，通过表达式来配置
   */
  draggableOn?: SchemaExpression;

  name?: SchemaName;

  /**
   * 过滤器表单
   */
  filter?: any; // todo

  /**
   * 初始是否拉取
   * @deprecated 建议用 api 的 sendOn 代替。
   */
  initFetch?: boolean;

  /**
   * 初始是否拉取，用表达式来配置。
   * @deprecated 建议用 api 的 sendOn 代替。
   */
  initFetchOn?: SchemaExpression;

  /**
   * 配置内部 DOM 的 className
   */
  innerClassName?: SchemaClassName;

  /**
   * 设置自动刷新时间
   */
  interval?: number;

  /**
   * 设置用来确定位置的字段名，设置后新的顺序将被赋值到该字段中。
   */
  orderField?: string;

  /**
   * 设置分页页码字段名。
   * @default page
   */
  pageField?: string;

  /**
   * 设置分页一页显示的多少条数据的字段名。
   * @default perPage
   */
  perPageField?: string;

  /**
   * 设置分页方向的字段名。单位简单分页时清楚时向前还是向后翻页。
   * @default pageDir
   */
  pageDirectionField?: string;

  /**
   * 快速编辑后用来批量保存的 API
   */
  quickSaveApi?: SchemaApi;

  /**
   * 快速编辑配置成及时保存时使用的 API
   */
  quickSaveItemApi?: SchemaApi;

  /**
   * 保存排序的 api
   */
  saveOrderApi?: SchemaApi;

  /**
   * 是否将过滤条件的参数同步到地址栏,默认为true
   * @default true
   */
  syncLocation?: boolean;

  toolbar?: SchemaCollection;

  /**
   * 工具栏是否为 inline 模式
   */
  toolbarInline?: boolean;

  /**
   * 顶部工具栏
   */
  headerToolbar?: Array<
    (CRUDToolbarChild & CRUDToolbarObject) | CRUDBultinToolbarType
  >;

  /**
   * 底部工具栏
   */
  footerToolbar?: Array<
    (CRUDToolbarChild & CRUDToolbarObject) | CRUDBultinToolbarType
  >;

  /**
   * 每页显示多少个空间成员的配置如： [10, 20, 50, 100]。
   */
  perPageAvailable?: Array<number>;

  messages?: SchemaMessage;

  /**
   * 是否隐藏快速编辑的按钮。
   */
  hideQuickSaveBtn?: boolean;

  /**
   * 是否自动跳顶部，当切分页的时候。
   */
  autoJumpToTopOnPagerChange?: boolean;

  /**
   * 静默拉取
   */
  silentPolling?: boolean;
  stopAutoRefreshWhen?: SchemaExpression;

  stopAutoRefreshWhenModalIsOpen?: boolean;
  filterTogglable?:
    | boolean
    | {
        label?: string; // 按钮文字
        activeLabel?: string;
        icon?: string; // 按钮图标
        activeIcon?: string;
      };
  filterDefaultVisible?: boolean;

  /**
   * 是否将接口返回的内容自动同步到地址栏，前提是开启了同步地址栏。
   */
  syncResponse2Query?: boolean;

  /**
   * 分页的时候是否保留用户选择。
   */
  keepItemSelectionOnPageChange?: boolean;

  /**
   * 当配置 keepItemSelectionOnPageChange 时有用，用来配置已勾选项的文案。
   */
  labelTpl?: SchemaTpl;

  /**
   * 是否为前端单次加载模式，可以用来实现前端分页。
   */
  loadDataOnce?: boolean;

  /**
   * 在开启loadDataOnce时，当修改过滤条件时是否重新请求api
   *
   * 如果没有配置，当查询条件表单触发的会重新请求 api，当是列过滤或者是 search-box 触发的则不重新请求 api
   * 如果配置为 true，则不管是什么触发都会重新请求 api
   * 如果配置为 false 则不管是什么触发都不会重新请求 api
   */
  loadDataOnceFetchOnFilter?: boolean;

  /**
   * 自定义搜索匹配函数，当开启loadDataOnce时，会基于该函数计算的匹配结果进行过滤，主要用于处理列字段类型较为复杂或者字段值格式和后端返回不一致的场景
   *
   * 参数说明
   *
   *  * `items` 当前表格数据
   *  * `itemsRaw` 当前表格数据（未处理）
   *  * `options` 配置
   *  * `options.query` 查询条件
   *  * `options.columns` 列配置
   *  * `options.matchSorter` 系统默认的排序方法
   * @since 3.5.0
   */
  matchFunc?: string | any;

  /**
   * 也可以直接从环境变量中读取，但是不太推荐。
   */
  source?: SchemaTokenizeableString;

  /**
   * 如果时内嵌模式，可以通过这个来配置默认的展开选项。
   */
  expandConfig?: {
    /**
     * 默认是展开第一个、所有、还是都不展开。
     */
    expand?: 'first' | 'all' | 'none';

    /**
     * 是否显示全部切换按钮
     */
    expandAll?: boolean;

    /**
     * 是否为手风琴模式
     */
    accordion?: boolean;
  };

  /**
   * 默认只有当分页数大于 1 是才显示，如果总是想显示请配置。
   */
  alwaysShowPagination?: boolean;

  /**
   * 开启查询区域，会根据列元素的searchable属性值，自动生成查询条件表单
   */
  autoGenerateFilter?: AutoGenerateFilterObject | boolean;

  /**
   * 内容区域占满屏幕剩余空间
   */
  autoFillHeight?: TableSchema['autoFillHeight'];

  /**
   * 是否开启Query信息转换，开启后将会对url中的Query进行转换，默认开启，默认仅转化布尔值
   */
  parsePrimitiveQuery?:
    | {
        enable: boolean;
        types?: ('boolean' | 'number')[];
      }
    | boolean;

  /**
   * 是否开启行选择功能, 默认为 false
   * 开启后将支持行选择功能,需要结合事件动作使用
   */
  selectable?: boolean;

  /**
   * 控制是否多选，默认为 false
   */
  multiple?: boolean;
}

export type CRUDCardsSchema = CRUDCommonSchema & {
  mode: 'cards';
} & Omit<CardsSchema, 'type'>;

export type CRUDListSchema = CRUDCommonSchema & {
  mode: 'list';
} & Omit<ListSchema, 'type'>;

export type CRUDTableSchema = CRUDCommonSchema & {
  mode?: 'table';
} & Omit<TableSchema, 'type'>;

/**
 * CRUD 增删改查渲染器。
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/crud
 */
export type CRUDSchema = CRUDCardsSchema | CRUDListSchema | CRUDTableSchema;

export interface CRUDProps
  extends RendererProps,
    Omit<CRUDCommonSchema, 'type' | 'className'>,
    SpinnerExtraProps {
  store: ICRUDStore;
  pickerMode?: boolean; // 选择模式，用做表单中的选择操作
}

const INNER_EVENTS: Array<CRUDRendererEvent> = [
  'selectedChange',
  'columnSort',
  'columnFilter',
  'columnSearch',
  'columnToggled',
  'orderChange',
  'rowClick',
  'rowDbClick',
  'rowMouseEnter',
  'rowMouseLeave',
  'selected'
];

export default class CRUD<T extends CRUDProps> extends React.Component<T, any> {
  static propsList: Array<keyof CRUDProps> = [
    'bulkActions',
    'itemActions',
    'mode',
    'orderField',
    'syncLocation',
    'toolbar',
    'toolbarInline',
    'messages',
    'value',
    'options',
    'multiple',
    'valueField',
    'defaultParams',
    'bodyClassName',
    'perPageAvailable',
    'pageField',
    'perPageField',
    'pageDirectionField',
    'hideQuickSaveBtn',
    'autoJumpToTopOnPagerChange',
    'interval',
    'silentPolling',
    'stopAutoRefreshWhen',
    'stopAutoRefreshWhenModalIsOpen',
    'api',
    'affixHeader',
    'columnsTogglable',
    'placeholder',
    'tableClassName',
    'headerClassName',
    'footerClassName',
    // 'toolbarClassName',
    'headerToolbar',
    'footerToolbar',
    'filterTogglable',
    'filterDefaultVisible',
    'autoGenerateFilter',
    'syncResponse2Query',
    'keepItemSelectionOnPageChange',
    'labelTpl',
    'labelField',
    'loadDataOnce',
    'loadDataOnceFetchOnFilter',
    'source',
    'header',
    'columns',
    'size',
    'onChange',
    'onInit',
    'onSaved',
    'onSave',
    'onQuery',
    'formStore',
    'autoFillHeight',
    'maxTagCount',
    'overflowTagPopover',
    'parsePrimitiveQuery',
    'matchFunc'
  ];
  static defaultProps = {
    toolbarInline: true,
    headerToolbar: ['bulkActions'],
    footerToolbar: ['statistics', 'pagination'],
    primaryField: 'id',
    syncLocation: true,
    pageField: 'page',
    perPageField: 'perPage',
    pageDirectionField: 'pageDir',
    hideQuickSaveBtn: false,
    autoJumpToTopOnPagerChange: true,
    silentPolling: false,
    filterTogglable: false,
    filterDefaultVisible: true,
    loadDataOnce: false,
    autoFillHeight: false,
    parsePrimitiveQuery: true
  };

  control: any;
  lastQuery: any;
  lastData: any;

  timer: ReturnType<typeof setTimeout>;
  mounted: boolean;
  /** 父容器, 主要用于定位CRUD内部popover的挂载点 */
  parentContainer: Element | null;

  filterOnEvent = memoize(onEvent =>
    omitBy(onEvent, (event, key: any) => !INNER_EVENTS.includes(key))
  );

  constructor(props: T) {
    super(props);

    this.controlRef = this.controlRef.bind(this);
    this.handleFilterReset = this.handleFilterReset.bind(this);
    this.handleFilterSubmit = this.handleFilterSubmit.bind(this);
    this.handleFilterInit = this.handleFilterInit.bind(this);
    this.handleAction = this.handleAction.bind(this);
    this.handleBulkAction = this.handleBulkAction.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleBulkGo = this.handleBulkGo.bind(this);
    this.handleDialogConfirm = this.handleDialogConfirm.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleSaveOrder = this.handleSaveOrder.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleChildPopOverOpen = this.handleChildPopOverOpen.bind(this);
    this.handleChildPopOverClose = this.handleChildPopOverClose.bind(this);
    this.search = this.search.bind(this);
    this.silentSearch = this.silentSearch.bind(this);
    this.handleQuery = this.handleQuery.bind(this);
    this.renderHeaderToolbar = this.renderHeaderToolbar.bind(this);
    this.renderFooterToolbar = this.renderFooterToolbar.bind(this);
    this.clearSelection = this.clearSelection.bind(this);

    const {
      location,
      store,
      pageField,
      perPageField,
      syncLocation,
      loadDataOnce
    } = props;
    const parseQueryOptions = this.getParseQueryOptions(props);

    this.mounted = true;

    if (syncLocation && location && (location.query || location.search)) {
      store.updateQuery(
        parseQuery(location, parseQueryOptions),
        undefined,
        pageField,
        perPageField
      );
    } else if (syncLocation && !location && window.location.search) {
      store.updateQuery(
        parseQuery(window.location, parseQueryOptions),
        undefined,
        pageField,
        perPageField
      );
    }

    this.props.store.setFilterTogglable(
      !!this.props.filterTogglable,
      this.props.filterDefaultVisible
    );

    // 如果有 api，data 里面先写个 空数组，面得继承外层的 items
    // 比如 crud 打开一个弹框，里面也是个 crud，默认一开始其实显示
    // 的是外层 crud 的数据，等接口回来后就会变成新的。
    // 加上这个就是为了解决这种情况
    if (this.props.api) {
      this.props.store.updateData({
        items: []
      });
    }
    // 如果picker用visibleOn来控制显隐，显隐切换时，constructor => handleSelect => componentDidMount的执行顺序
    // 因此需要将componentDidMount中的设置选中项提前到constructor，否则handleSelect里拿不到的选中项
    let val: any;
    if (this.props.pickerMode && (val = getPropValue(this.props))) {
      store.setSelectedItems(val);
    }
  }

  componentDidMount() {
    const {store, autoGenerateFilter, perPageField, columns} = this.props;
    if (this.props.perPage && !store.query[perPageField || 'perPage']) {
      store.changePage(store.page, this.props.perPage);
    }

    // 没有 filter 或者 没有展示 filter 时应该默认初始化一次，
    // 否则就应该等待 filter 里面的表单初始化的时候才初始化
    // 另外autoGenerateFilter时，table 里面会单独处理这块逻辑
    // 所以这里应该忽略 autoGenerateFilter 情况
    if (
      (!this.props.filter && !autoGenerateFilter) ||
      (store.filterTogggable && !store.filterVisible)
    ) {
      this.handleFilterInit({});
    }

    this.parentContainer = this.getClosestParentContainer();
  }

  componentDidUpdate(prevProps: CRUDProps) {
    const props = this.props;
    const store = prevProps.store;

    if (
      anyChanged(
        ['toolbar', 'headerToolbar', 'footerToolbar', 'bulkActions'],
        prevProps,
        props
      )
    ) {
      // 来点参数变化。
      this.renderHeaderToolbar = this.renderHeaderToolbar.bind(this);
      this.renderFooterToolbar = this.renderFooterToolbar.bind(this);
    }

    let val: any;
    if (
      this.props.pickerMode &&
      !isEqual((val = getPropValue(this.props)), getPropValue(prevProps)) &&
      !isEqual(val, store.selectedItems.concat())
    ) {
      /**
       * 更新链：Table -> CRUD -> Picker -> Form
       * 对于Picker模式来说，执行到这里的时候store.selectedItems已经更新过了，所以需要额外判断一下
       */
      store.setSelectedItems(val);
    }

    if (!!this.props.filterTogglable !== !!prevProps.filterTogglable) {
      store.setFilterTogglable(
        !!props.filterTogglable,
        props.filterDefaultVisible
      );
    }

    let dataInvalid = false;

    if (
      prevProps.syncLocation &&
      prevProps.location &&
      prevProps.location.search !== props.location.search
    ) {
      // 同步地址栏，那么直接检测 query 是否变了，变了就重新拉数据
      store.updateQuery(
        parseQuery(props.location, this.getParseQueryOptions(props)),
        undefined,
        props.pageField,
        props.perPageField
      );
      dataInvalid = !!(
        props.api && isObjectShallowModified(store.query, this.lastQuery, false)
      );
    }

    if (dataInvalid) {
      // 要同步数据
    } else if (
      prevProps.api &&
      props.api &&
      isApiOutdated(
        prevProps.api,
        props.api,
        store.fetchCtxOf(prevProps.data, {
          pageField: prevProps.pageField,
          perPageField: prevProps.perPageField
        }),
        store.fetchCtxOf(props.data, {
          pageField: props.pageField,
          perPageField: props.perPageField
        })
      )
    ) {
      dataInvalid = true;
    } else if (
      !props.api &&
      isPureVariable(props.source) &&
      props.data !== prevProps.data
    ) {
      const next = resolveVariableAndFilter(props.source, props.data, '| raw');

      if (!this.lastData || this.lastData !== next) {
        store.initFromScope(props.data, props.source, {
          columns: store.columns ?? props.columns
        });
        this.lastData = next;
      }
    }

    if (dataInvalid) {
      this.search();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    clearTimeout(this.timer);
    this.filterOnEvent.cache.clear?.();
  }

  getParseQueryOptions(props: CRUDProps) {
    const {parsePrimitiveQuery} = props;
    type PrimitiveQueryObj = Exclude<CRUDProps['parsePrimitiveQuery'], boolean>;

    const normalizedOptions = {
      parsePrimitive: !!(isObject(parsePrimitiveQuery)
        ? (parsePrimitiveQuery as PrimitiveQueryObj)?.enable
        : parsePrimitiveQuery),
      primitiveTypes: (parsePrimitiveQuery as PrimitiveQueryObj)?.types ?? [
        'boolean'
      ]
    };

    return normalizedOptions;
  }

  /** 查找CRUD最近层级的父窗口 */
  getClosestParentContainer() {
    const dom = findDOMNode(this) as HTMLElement;
    const overlay = dom?.closest('[role=dialog]');

    return overlay;
  }

  controlRef(control: any) {
    // 因为 control 有可能被 n 层 hoc 包裹。
    while (control && control.getWrappedInstance) {
      control = control.getWrappedInstance();
    }

    this.control = control;
  }

  handleAction(
    e: React.UIEvent<any> | undefined,
    action: ActionObject,
    ctx: object,
    throwErrors: boolean = false,
    delegate?: IScopedContext
  ): any {
    const {
      onAction,
      store,
      messages,
      pickerMode,
      env,
      pageField,
      stopAutoRefreshWhenModalIsOpen
    } = this.props;

    if (store.loading) {
      //由于curd的loading样式未遮罩按钮部分，如果处于加载中时不处理操作
      return;
    }

    if (action.actionType === 'dialog') {
      store.setCurrentAction(action, this.props.resolveDefinitions);
      const idx: number = (ctx as any).index;
      const length = store.items.length;
      stopAutoRefreshWhenModalIsOpen && clearTimeout(this.timer);
      return new Promise<any>(resolve => {
        store.openDialog(
          ctx,
          {
            hasNext: idx < length - 1,
            nextIndex: idx + 1,
            hasPrev: idx > 0,
            prevIndex: idx - 1,
            index: idx
          },
          (confirmed: any, value: any) => {
            action.callback?.(confirmed, value);
            resolve({
              confirmed,
              value
            });
          },
          delegate || (this.context as any)
        );
      });
    } else if (action.actionType === 'ajax') {
      store.setCurrentAction(action, this.props.resolveDefinitions);
      const data = ctx;

      // 由于 ajax 一段时间后再弹出，肯定被浏览器给阻止掉的，所以提前弹。
      const redirect = action.redirect && filter(action.redirect, data);
      redirect && action.blank && env.jumpTo(redirect, action, data);

      // 如果 api 无效，或者不满足发送条件，则直接返回
      if (!isEffectiveApi(action.api, data)) {
        return;
      }

      return store
        .saveRemote(action.api!, data, {
          successMessage:
            (action.messages && action.messages.success) ||
            (messages && messages.saveSuccess),
          errorMessage:
            (action.messages && action.messages.failed) ||
            (messages && messages.saveFailed)
        })
        .then(async (payload: object) => {
          const data = createObject(ctx, payload);

          if (action.feedback && isVisible(action.feedback, data)) {
            await this.openFeedback(action.feedback, data);
            stopAutoRefreshWhenModalIsOpen && clearTimeout(this.timer);
          }

          const redirect = action.redirect && filter(action.redirect, data);
          redirect && !action.blank && env.jumpTo(redirect, action, data);
          action.reload
            ? this.reloadTarget(filterTarget(action.reload, data), data)
            : redirect
            ? null
            : this.search(undefined, undefined, true, true);
          action.close && this.closeTarget(action.close);
        })
        .catch(e => {
          if (throwErrors || action.countDown) {
            throw e;
          }
        });
    } else if (action.actionType === 'reload' && !action.target) {
      this.reload();
    } else if (
      pickerMode &&
      (action.actionType === 'confirm' || action.actionType === 'submit')
    ) {
      store.setCurrentAction(action, this.props.resolveDefinitions);
      return Promise.resolve({
        items: store.selectedItems.concat()
      });
    } else if (action.onClick) {
      store.setCurrentAction(action, this.props.resolveDefinitions);
      let onClick = action.onClick;
      if (typeof onClick === 'string') {
        onClick = str2function(onClick, 'event', 'props', 'data');
      }
      onClick && onClick(e, this.props, ctx);
    } else {
      onAction(e, action, ctx, throwErrors, delegate || this.context);
    }
  }

  handleBulkAction(
    selectedItems: Array<any>,
    unSelectedItems: Array<any>,
    e: React.UIEvent<any>,
    action: ActionObject
  ) {
    const {
      store,
      primaryField,
      onAction,
      messages,
      pageField,
      stopAutoRefreshWhenModalIsOpen,
      env
    } = this.props;

    if (!selectedItems.length && action.requireSelected !== false) {
      return;
    }

    let ids = selectedItems
      .map(item =>
        item.hasOwnProperty(primaryField) ? item[primaryField as string] : null
      )
      .filter(item => item)
      .join(',');

    const ctx = createObjectFromChain([
      store.mergedData,
      {
        event: e // 固定事件数据从event.data中获取，方便批量操作按钮绑定动作时获取动作产生的数据
      },
      {
        ...selectedItems[0],
        currentPageData: (store.mergedData?.items || []).concat(),
        rows: selectedItems,
        items: selectedItems,
        selectedItems,
        unSelectedItems: unSelectedItems,
        ids
      }
    ]);

    let fn = () => {
      if (action.actionType === 'dialog') {
        return this.handleAction(
          e,
          {
            ...action,
            __from: 'bulkAction'
          },
          ctx
        );
      } else if (action.actionType === 'ajax') {
        isEffectiveApi(action.api, ctx) &&
          store
            .saveRemote(action.api as string, ctx, {
              successMessage:
                (action.messages && action.messages.success) ||
                (messages && messages.saveSuccess),
              errorMessage:
                (action.messages && action.messages.failed) ||
                (messages && messages.saveFailed)
            })
            .then(async (payload: object) => {
              const data = createObject(ctx, payload);
              if (action.feedback && isVisible(action.feedback, data)) {
                await this.openFeedback(action.feedback, data);
                stopAutoRefreshWhenModalIsOpen && clearTimeout(this.timer);
              }

              action.reload
                ? this.reloadTarget(filterTarget(action.reload, data), data)
                : this.search(
                    {[pageField || 'page']: 1},
                    undefined,
                    true,
                    true
                  );
              action.close && this.closeTarget(action.close);

              const redirect = action.redirect && filter(action.redirect, data);
              redirect && env.jumpTo(redirect, action, data);
            })
            .catch(() => null);
      } else if (onAction) {
        onAction(e, action, ctx, false, this.context);
      }
    };

    // Action如果配了事件动作也会处理二次确认，这里需要处理一下忽略
    let confirmText: string = '';
    if (
      !action.ignoreConfirm &&
      action.confirmText &&
      env.confirm &&
      (confirmText = filter(action.confirmText, ctx))
    ) {
      env
        .confirm(confirmText, filter(action.confirmTitle, ctx) || undefined)
        .then((confirmed: boolean) => confirmed && fn());
    } else {
      fn();
    }
  }

  handleItemAction(action: ActionObject, ctx: any) {
    this.doAction(action, ctx);
  }

  handleFilterInit(values: object) {
    const {defaultParams, data, store, orderBy, orderDir, dispatchEvent} =
      this.props;
    const params: any = {...defaultParams};

    if (orderBy) {
      params['orderBy'] = orderBy;
      params['orderDir'] = orderDir || 'asc';
    }

    this.handleFilterSubmit(
      {
        ...params,
        ...values,
        ...store.query
      },
      false,
      true,
      this.props.initFetch !== false,
      true
    );

    store.setPristineQuery();

    const {pickerMode, options} = this.props;

    pickerMode &&
      store.updateData({
        items: options || []
      });
  }

  handleFilterReset(values: object, action: any) {
    const {store, syncLocation, env, pageField, perPageField} = this.props;

    const resetQuery: any = {};
    Object.keys(values).forEach(key => (resetQuery[key] = ''));
    store.updateQuery(
      {
        ...resetQuery,
        ...store.pristineQuery
      },
      syncLocation && env && env.updateLocation
        ? (location: any) => env.updateLocation(location)
        : undefined,
      pageField,
      perPageField,
      true
    );
    this.lastQuery = store.query;

    // 对于带 submit 的 reset(包括 actionType 为 reset-and-submit clear-and-submit 和 form 的 resetAfterSubmit 属性)
    // 不执行 search，否则会多次触发接口请求
    if (
      action?.actionType &&
      ['reset-and-submit', 'clear-and-submit', 'submit'].includes(
        action.actionType
      )
    ) {
      return;
    }

    this.search();
  }

  handleFilterSubmit(
    values: Record<string, any>,
    jumpToFirstPage: boolean = true,
    replaceLocation: boolean = false,
    search: boolean = true,
    isInit: boolean = false
  ) {
    const {
      store,
      syncLocation,
      env,
      pageField,
      perPageField,
      loadDataOnceFetchOnFilter,
      parsePrimitiveQuery
    } = this.props;
    const parseQueryOptions = this.getParseQueryOptions(this.props);

    /** 找出clearValueOnHidden的字段, 保证updateQuery时不会使用上次的保留值 */
    values = {
      ...values,
      ...pickBy(values?.__super?.diff ?? {}, value => value === undefined)
    };
    values = syncLocation
      ? qsparse(qsstringify(values, undefined, true))
      : values;

    /** 把布尔值反解出来 */
    if (parsePrimitiveQuery) {
      values = parsePrimitiveQueryString(values, parseQueryOptions);
    }

    store.updateQuery(
      {
        ...values,
        [pageField || 'page']: jumpToFirstPage ? 1 : store.page
      },
      syncLocation && env && env.updateLocation
        ? (location: any) => env.updateLocation(location, replaceLocation)
        : undefined,
      pageField,
      perPageField
    );
    this.lastQuery = store.query;

    search &&
      this.search(
        undefined,
        undefined,
        undefined,
        loadDataOnceFetchOnFilter !== false,
        isInit
      );
  }

  handleBulkGo(
    selectedItems: Array<any>,
    unSelectedItems: Array<any>,
    e: React.MouseEvent<any>
  ) {
    const action = this.props.store.selectedAction;
    const env = this.props.env;
    let confirmText: string = '';

    if (
      action.confirmText &&
      (confirmText = filter(action.confirmText, this.props.store.mergedData))
    ) {
      return env
        .confirm(confirmText)
        .then(
          (confirmed: boolean) =>
            confirmed &&
            this.handleBulkAction(
              selectedItems,
              unSelectedItems,
              e as any,
              action
            )
        );
    }

    return this.handleBulkAction(
      selectedItems,
      unSelectedItems,
      e as any,
      action
    );
  }

  handleDialogConfirm(
    values: object[],
    action: ActionObject,
    ctx: any,
    components: Array<any>
  ) {
    const {
      store,
      pageField,
      stopAutoRefreshWhenModalIsOpen,
      interval,
      silentPolling,
      env
    } = this.props;

    store.closeDialog(true, values);
    const dialogAction = store.action as ActionObject;

    if (stopAutoRefreshWhenModalIsOpen && interval) {
      this.timer = setTimeout(
        silentPolling ? this.silentSearch : this.search,
        Math.max(interval, 1000)
      );
    }

    if (
      action.actionType === 'next' &&
      typeof ctx.nextIndex === 'number' &&
      store.data.items[ctx.nextIndex]
    ) {
      return this.handleAction(
        undefined,
        {
          ...dialogAction
        },
        createObject(
          createObject(store.data, {
            index: ctx.nextIndex
          }),
          store.data.items[ctx.nextIndex]
        )
      );
    } else if (
      action.actionType === 'prev' &&
      typeof ctx.prevIndex === 'number' &&
      store.data.items[ctx.prevIndex]
    ) {
      return this.handleAction(
        undefined,
        {
          ...dialogAction
        },
        createObject(
          createObject(store.data, {
            index: ctx.prevIndex
          }),
          store.data.items[ctx.prevIndex]
        )
      );
    } else if (values.length) {
      const value = values[0];
      ctx = createObject(ctx, value);
      const component = components[0];

      // 提交来自 form
      if (component && component.props.type === 'form') {
        // 数据保存了，说明列表数据已经无效了，重新刷新。
        if (value && (value as any).__saved) {
          const reload = action.reload ?? dialogAction.reload;
          // 配置了 reload 则跳过自动更新。
          reload ||
            this.search(
              dialogAction.__from ? {[pageField || 'page']: 1} : undefined,
              undefined,
              true,
              true
            );
        } else if (
          value &&
          ((value.hasOwnProperty('items') && (value as any).items) ||
            value.hasOwnProperty('ids')) &&
          this.control.bulkUpdate
        ) {
          this.control.bulkUpdate(value, (value as any).items);
        }
      }
    }

    const reload = action.reload ?? dialogAction.reload;
    if (reload) {
      this.reloadTarget(filterTarget(reload, ctx), ctx);
    }

    let redirect = action.redirect ?? dialogAction.redirect;
    redirect = redirect && filter(redirect, ctx);
    redirect && env.jumpTo(redirect, dialogAction, ctx);
  }

  handleDialogClose(confirmed = false) {
    const {store, stopAutoRefreshWhenModalIsOpen, silentPolling, interval} =
      this.props;
    store.closeDialog(confirmed);

    if (stopAutoRefreshWhenModalIsOpen && interval) {
      this.timer = setTimeout(
        silentPolling ? this.silentSearch : this.search,
        Math.max(interval, 1000)
      );
    }
  }

  openFeedback(dialog: any, ctx: any) {
    return new Promise(resolve => {
      const {store} = this.props;
      store.setCurrentAction(
        {
          type: 'button',
          actionType: 'dialog',
          dialog: dialog
        },
        this.props.resolveDefinitions
      );
      store.openDialog(
        ctx,
        undefined,
        confirmed => {
          resolve(confirmed);
        },
        this.context as any
      );
    });
  }

  async search(
    values?: any,
    silent?: boolean,
    clearSelection?: boolean,
    forceReload = false,
    isInit: boolean = false
  ) {
    const {
      store,
      api,
      messages,
      pageField,
      perPageField,
      interval,
      stopAutoRefreshWhen,
      stopAutoRefreshWhenModalIsOpen,
      silentPolling,
      syncLocation,
      syncResponse2Query,
      pickerMode,
      env,
      loadDataOnce,
      loadDataOnceFetchOnFilter,
      source,
      columns,
      dispatchEvent
    } = this.props;

    // reload 需要清空用户选择，无论是否开启keepItemSelectionOnPageChange
    if (clearSelection && !pickerMode) {
      store.resetSelection();
    }

    let loadDataMode = '';
    if (values && typeof values.loadDataMode === 'string') {
      loadDataMode = 'load-more';
      delete values.loadDataMode;
    }

    clearTimeout(this.timer);
    values &&
      store.updateQuery(
        values,
        !loadDataMode && syncLocation && env && env.updateLocation
          ? env.updateLocation
          : undefined,
        pageField,
        perPageField
      );
    this.lastQuery = store.query;
    const data = createObject(store.data, store.query);
    const matchFunc =
      this.props?.matchFunc && typeof this.props.matchFunc === 'string'
        ? (str2function(
            this.props.matchFunc,
            'items',
            'itemsRaw',
            'options'
          ) as any)
        : undefined;
    if (isEffectiveApi(api, data)) {
      const value = await store.fetchInitData(api, data, {
        successMessage: messages && messages.fetchSuccess,
        errorMessage: messages && messages.fetchFailed,
        autoAppend: true,
        forceReload,
        loadDataOnce,
        source,
        silent,
        pageField,
        perPageField,
        loadDataMode,
        syncResponse2Query,
        columns: store.columns ?? columns,
        matchFunc,
        filterOnAllColumns: loadDataOnceFetchOnFilter === false
      });
      if (!isAlive(store)) {
        return value;
      }

      const {page, lastPage, msg, error} = store;

      if (isInit) {
        // 初始化请求完成
        const rendererEvent = await dispatchEvent?.(
          'fetchInited',
          createObject(this.props.data, {
            responseData: value?.ok ? store.data ?? {} : value,
            responseStatus:
              value?.status === undefined ? (error ? 1 : 0) : value?.status,
            responseMsg: msg
          })
        );

        if (rendererEvent?.prevented) {
          return store.data;
        }
      }

      // 空列表 且 页数已经非法超出，则跳转到最后的合法页数
      if (
        !loadDataOnce &&
        !store.data.items.length &&
        !interval &&
        page > 1 &&
        lastPage < page
      ) {
        this.search(
          {
            ...store.query,
            [pageField || 'page']: lastPage
          },
          false,
          undefined
        );
      }

      value?.ok && // 接口正常返回才继续轮训
        interval &&
        this.mounted &&
        (!stopAutoRefreshWhen ||
          !(
            (stopAutoRefreshWhenModalIsOpen && store.hasModalOpened) ||
            evalExpression(
              stopAutoRefreshWhen,
              createObject(store.data, store.query)
            )
          )) &&
        (this.timer = setTimeout(
          silentPolling
            ? this.silentSearch.bind(this, undefined, undefined, true)
            : this.search.bind(this, undefined, undefined, undefined, true),
          Math.max(interval, 1000)
        ));
    } else if (source) {
      store.initFromScope(data, source, {
        columns: store.columns ?? columns,
        matchFunc
      });
    }

    return store.data;
  }

  silentSearch(values?: object, clearSelection?: boolean, forceReload = false) {
    return this.search(values, true, clearSelection, forceReload);
  }

  handleChangePage(
    page: number,
    perPage?: number,
    dir?: 'forward' | 'backward'
  ) {
    const {
      store,
      syncLocation,
      env,
      pageField,
      perPageField,
      pageDirectionField,
      autoJumpToTopOnPagerChange
    } = this.props;

    let query: any = {
      [pageField || 'page']: page
    };

    if (dir) {
      query[pageDirectionField || 'pageDir'] = dir;
    }

    if (perPage) {
      query[perPageField || 'perPage'] = perPage;
    }

    store.updateQuery(
      query,
      syncLocation && env?.updateLocation ? env.updateLocation : undefined,
      pageField,
      perPageField
    );

    this.search(undefined, undefined, undefined);

    if (autoJumpToTopOnPagerChange && this.control) {
      if (this.control.scrollToTop) {
        this.control.scrollToTop();
      } else {
        (findDOMNode(this.control) as HTMLElement).scrollIntoView();
        const scrolledY = window.scrollY;
        scrolledY && window.scroll(0, scrolledY);
      }
    }
  }

  handleSave(
    rows: Array<object> | object,
    diff: Array<object> | object,
    indexes: Array<string>,
    unModifiedItems?: Array<any>,
    rowsOrigin?: Array<object> | object,
    options?: {
      resetOnFailed?: boolean;
      reload?: string;
    }
  ) {
    const {
      store,
      quickSaveApi,
      quickSaveItemApi,
      primaryField,
      env,
      messages,
      reload,
      dispatchEvent
    } = this.props;

    if (Array.isArray(rows)) {
      if (!isEffectiveApi(quickSaveApi)) {
        env && env.alert('CRUD quickSaveApi is required');
        return;
      }

      const data: any = createObject(store.data, {
        rows,
        rowsDiff: diff,
        indexes: indexes,
        rowsOrigin
      });

      if (rows.length && rows[0].hasOwnProperty(primaryField || 'id')) {
        data.ids = rows
          .map(item => (item as any)[primaryField || 'id'])
          .join(',');
      }

      if (unModifiedItems) {
        data.unModifiedItems = unModifiedItems;
      }

      return store
        .saveRemote(quickSaveApi, data, {
          successMessage: messages && messages.saveFailed,
          errorMessage: messages && messages.saveSuccess
        })
        .then(async result => {
          // 如果请求 cancel 了，会来到这里
          if (!result) {
            return;
          }

          const event = await dispatchEvent?.(
            'quickSaveSucc',
            extendObject(data, {
              result: result
            })
          );

          if (event?.prevented) {
            return;
          }

          const finalReload = options?.reload ?? reload;
          return finalReload
            ? this.reloadTarget(filterTarget(finalReload, data), data)
            : this.search(undefined, undefined, true, true);
        })
        .catch(async err => {
          await dispatchEvent?.(
            'quickSaveFail',
            createObject(this.props.data, {
              error: err
            })
          );
        });
    } else {
      if (!isEffectiveApi(quickSaveItemApi)) {
        env && env.alert('CRUD quickSaveItemApi is required!');
        return;
      }

      const data = createObject(store.data, {
        item: rows,
        modified: diff,
        origin: rowsOrigin
      });

      const sendData = createObject(data, rows);
      return store
        .saveRemote(quickSaveItemApi, sendData)
        .then(async (result: any) => {
          // 如果请求 cancel 了，会来到这里
          if (!result) {
            return;
          }
          const event = await dispatchEvent?.(
            'quickSaveItemSucc',
            extendObject(data, {
              result: result
            })
          );

          if (event?.prevented) {
            return;
          }

          const finalReload = options?.reload ?? reload;
          return finalReload
            ? this.reloadTarget(filterTarget(finalReload, data), data)
            : this.search(undefined, undefined, true, true);
        })
        .catch(async err => {
          options?.resetOnFailed && this.control.reset();

          await dispatchEvent?.(
            'quickSaveItemFail',
            createObject(this.props.data, {
              error: err
            })
          );
        });
    }
  }

  handleSaveOrder(moved: Array<object>, rows: Array<object>) {
    const {
      store,
      saveOrderApi,
      orderField,
      primaryField,
      env,
      reload,
      dispatchEvent
    } = this.props;

    if (!saveOrderApi) {
      env && env.alert('CRUD saveOrderApi is required!');
      return;
    }

    const model: {
      insertAfter?: any;
      insertBefore?: any;
      idMap?: any;
      rows?: any;
      ids?: any;
      order?: any;
    } = createObject(store.data);

    let insertAfter: any;
    let insertBefore: any;
    const holding: Array<object> = [];
    const hasIdField =
      primaryField &&
      rows[0] &&
      (rows[0] as object).hasOwnProperty(primaryField);

    hasIdField || (model.idMap = {});

    model.insertAfter = {};
    rows.forEach((item: any) => {
      if (~moved.indexOf(item)) {
        if (insertAfter) {
          let insertAfterId = hasIdField
            ? (insertAfter as any)[primaryField as string]
            : rows.indexOf(insertAfter);
          model.insertAfter[insertAfterId] =
            (model as any).insertAfter[insertAfterId] || [];

          hasIdField || (model.idMap[insertAfterId] = insertAfter);
          model.insertAfter[insertAfterId].push(
            hasIdField ? item[primaryField as string] : item
          );
        } else {
          holding.push(item);
        }
      } else {
        insertAfter = item;
        insertBefore = insertBefore || item;
      }
    });

    if (insertBefore && holding.length) {
      let insertBeforeId = hasIdField
        ? insertBefore[primaryField as string]
        : rows.indexOf(insertBefore);
      hasIdField || (model.idMap[insertBeforeId] = insertBefore);
      model.insertBefore = {};
      model.insertBefore[insertBeforeId] = holding.map((item: any) =>
        hasIdField ? item[primaryField as string] : item
      );
    } else if (holding.length) {
      const first: any = holding[0];
      const firstId = hasIdField
        ? first[primaryField as string]
        : rows.indexOf(first);

      hasIdField || (model.idMap[firstId] = first);
      model.insertAfter[firstId] = holding
        .slice(1)
        .map((item: any) => (hasIdField ? item[primaryField as string] : item));
    }

    if (orderField) {
      const start = (store.page - 1) * store.perPage || 0;
      rows = mapTree(rows as any, (item, key, level) =>
        extendObject(item, {
          [orderField]: (level === 1 ? start : 0) + key + 1
        })
      );
    }

    model.rows = rows.concat();
    if (hasIdField) {
      let joinIdFields: (items: Array<any>) => string = items =>
        items
          .map(
            (item: any) =>
              `${item[primaryField as string]}${
                Array.isArray(item.children) && item.children.length
                  ? `[${joinIdFields(item.children)}]`
                  : ''
              }`
          )
          .join(',');
      model.ids = joinIdFields(rows);

      orderField &&
        (model.order = mapTree(rows, item =>
          pick(item, [primaryField as string, orderField, 'children'])
        ));
    }

    return (
      isEffectiveApi(saveOrderApi, model) &&
      store
        .saveRemote(saveOrderApi, model)
        .then(async result => {
          // 如果请求 cancel 了，会来到这里
          if (!result) {
            return;
          }
          const event = await dispatchEvent?.(
            'saveOrderSucc',
            extendObject(model, {
              result: result
            })
          );

          if (event?.prevented) {
            return;
          }

          reload && this.reloadTarget(filterTarget(reload, model), model);
          this.search(undefined, undefined, true, true);
        })
        .catch(async err => {
          await dispatchEvent?.(
            'saveOrderFail',
            createObject(this.props.data, {
              error: err
            })
          );
        })
    );
  }

  handleSelect(items: Array<any>, unSelectedItems: Array<any>) {
    const {
      store,
      keepItemSelectionOnPageChange,
      primaryField,
      multiple,
      pickerMode,
      strictMode,
      onSelect
    } = this.props;
    let newItems = items;
    let newUnSelectedItems = unSelectedItems;
    if (keepItemSelectionOnPageChange && store.selectedItems.length) {
      const oldItems = store.selectedItems.concat();
      const oldUnselectedItems = store.unSelectedItems.concat();

      const isSameValue = (
        a: Record<string, unknown>,
        item: Record<string, unknown>
      ) => {
        const oldValue = a[primaryField || 'id'];
        const itemValue = item[primaryField || 'id'];
        const isSame = strictMode
          ? oldValue === itemValue
          : oldValue == itemValue;
        return a === item || (oldValue && isSame);
      };

      items.forEach(item => {
        const idx = findIndex(oldItems, a => isSameValue(a, item));

        if (~idx) {
          oldItems[idx] = item;
        } else {
          oldItems.push(item);
        }

        const idx2 = findIndex(oldUnselectedItems, a => isSameValue(a, item));

        if (~idx2) {
          oldUnselectedItems.splice(idx2, 1);
        }
      });

      unSelectedItems.forEach(item => {
        const idx = findIndex(oldUnselectedItems, a => isSameValue(a, item));

        const idx2 = findIndex(oldItems, a => isSameValue(a, item));

        if (~idx) {
          oldUnselectedItems[idx] = item;
        } else {
          oldUnselectedItems.push(item);
        }
        !~idx && ~idx2 && oldItems.splice(idx2, 1);
      });

      newItems = oldItems;
      newUnSelectedItems = oldUnselectedItems;

      // const thisBatch = items.concat(unSelectedItems);
      // let notInThisBatch = (item: any) =>
      //   !find(
      //     thisBatch,
      //     a => a[primaryField || 'id'] == item[primaryField || 'id']
      //   );

      // newItems = store.selectedItems.filter(notInThisBatch);
      // newUnSelectedItems = store.unSelectedItems.filter(notInThisBatch);

      // newItems.push(...items);
      // newUnSelectedItems.push(...unSelectedItems);
    }

    if (pickerMode && multiple === false && newItems.length > 1) {
      newUnSelectedItems.push.apply(
        newUnSelectedItems,
        newItems.splice(0, newItems.length - 1)
      );
    }
    // 用 updateSelectData 导致 CRUD 无限刷新
    // store.updateSelectData(newItems, newUnSelectedItems);
    store.setSelectedItems(newItems);
    store.setUnSelectedItems(newUnSelectedItems);
    onSelect && onSelect(newItems, newUnSelectedItems);
  }

  handleChildPopOverOpen(popOver: any) {
    if (
      this.props.interval &&
      popOver &&
      ~['dialog', 'drawer'].indexOf(popOver.mode)
    ) {
      this.props.stopAutoRefreshWhenModalIsOpen && clearTimeout(this.timer);
      this.props.store.setInnerModalOpened(true);
    }
  }

  handleChildPopOverClose(popOver: any) {
    const {stopAutoRefreshWhenModalIsOpen, silentPolling, interval} =
      this.props;

    if (popOver && ~['dialog', 'drawer'].indexOf(popOver.mode)) {
      this.props.store.setInnerModalOpened(false);

      if (stopAutoRefreshWhenModalIsOpen && interval) {
        this.timer = setTimeout(
          silentPolling ? this.silentSearch : this.search,
          Math.max(interval, 1000)
        );
      }
    }
  }

  handleQuery(
    values: object,
    forceReload?: boolean,
    replace?: boolean,
    resetPage?: boolean,
    clearSelection?: boolean
  ) {
    const {
      store,
      syncLocation,
      env,
      pageField,
      perPageField,
      loadDataOnceFetchOnFilter
    } = this.props;

    store.updateQuery(
      resetPage
        ? {
            // 有些交互场景完全不想重置
            [pageField || 'page']: 1,
            ...values
          }
        : values,
      syncLocation && env && env.updateLocation
        ? env.updateLocation
        : undefined,
      pageField,
      perPageField,
      replace
    );
    return this.search(
      undefined,
      undefined,
      clearSelection ?? replace,
      forceReload ?? loadDataOnceFetchOnFilter === true
    );
  }

  reload(
    subpath?: string,
    query?: any,
    ctx?: any,
    silent?: boolean,
    replace?: boolean,
    args?: any
  ) {
    if (query) {
      return this.receive(query, undefined, replace, args?.resetPage, true);
    } else {
      return this.search(undefined, undefined, true, true);
    }
  }

  receive(
    values: object,
    subPath?: string,
    replace?: boolean,
    resetPage?: boolean,
    clearSelection?: boolean
  ) {
    return this.handleQuery(values, true, replace, resetPage, clearSelection);
  }

  reloadTarget(target: string, data: any) {
    // implement this.
  }

  closeTarget(target: string) {
    // implement this.
  }

  async doAction(
    action: ActionObject,
    data: object,
    throwErrors: boolean = false,
    args?: any
  ) {
    const {store} = this.props;
    if (
      action.actionType &&
      [
        'submitQuickEdit',
        'toggleExpanded',
        'setExpanded',
        'initDrag',
        'cancelDrag'
      ].includes(action.actionType)
    ) {
      return this.control?.doAction(action, data, throwErrors, args);
    } else if (action.actionType === 'selectAll') {
      return this.handleSelect(store.items.concat(), []);
    } else if (action.actionType === 'clearAll') {
      return this.handleSelect([], store.items.concat());
    } else if (action.actionType === 'select') {
      const selectedItems = await getMatchedEventTargets(
        store.items,
        data,
        args?.index,
        args?.condition
      );
      const unSelectedItems = store.items.filter(
        item => !selectedItems.includes(item)
      );
      return this.handleSelect(selectedItems, unSelectedItems);
    }

    return this.handleAction(undefined, action, data, throwErrors);
  }

  unSelectItem(item: any, index: number) {
    const {store} = this.props;
    const selected = store.selectedItems.concat();
    const unSelected = store.unSelectedItems.concat();

    const idx = selected.indexOf(item);
    ~idx && unSelected.push.apply(unSelected, selected.splice(idx, 1));

    store.setSelectedItems(selected);
    store.setUnSelectedItems(unSelected);
  }

  clearSelection() {
    const {store, itemCheckableOn} = this.props;
    const [unchecked, checked] = partition(
      store.selectedItems,
      item => !itemCheckableOn || evalExpression(itemCheckableOn, item)
    );
    const unSelected = store.unSelectedItems.concat(unchecked);

    store.setSelectedItems(checked);
    store.setUnSelectedItems(unSelected);
  }

  hasBulkActionsToolbar() {
    const {headerToolbar, footerToolbar} = this.props;

    const isBulkActions = (item: any) =>
      ~['bulkActions', 'bulk-actions'].indexOf(item.type || item);
    return (
      (Array.isArray(headerToolbar) && find(headerToolbar, isBulkActions)) ||
      (Array.isArray(footerToolbar) && find(footerToolbar, isBulkActions))
    );
  }

  hasBulkActions() {
    const {bulkActions, itemActions, store} = this.props;

    if (!bulkActions || !bulkActions.length) {
      return false;
    }

    let bulkBtns: Array<ActionSchema> = [];
    const ctx = store.mergedData;

    if (bulkActions && bulkActions.length) {
      bulkBtns = bulkActions
        .map(item => ({
          ...item,
          ...getExprProperties(item as Schema, ctx)
        }))
        .filter(item => !item.hidden && item.visible !== false);
    }

    return bulkBtns.length;
  }

  renderBulkActions(childProps: any) {
    let {
      bulkActions,
      itemActions,
      store,
      render,
      classnames: cx,
      primaryField
    } = this.props;

    if (!bulkActions || !bulkActions.length) {
      return null;
    }

    const selectedItems = store.selectedItems;
    const unSelectedItems = store.unSelectedItems;

    let bulkBtns: Array<ActionSchema> = [];
    let itemBtns: Array<ActionSchema> = [];
    const ctx = createObject(store.mergedData, {
      currentPageData: (store.mergedData?.items || []).concat(),
      rows: selectedItems.concat(),
      items: selectedItems.concat(),
      selectedItems: selectedItems.concat(),
      unSelectedItems: unSelectedItems.concat(),
      ids: selectedItems
        .map(item =>
          item.hasOwnProperty(primaryField)
            ? item[primaryField as string]
            : null
        )
        .filter(item => item)
        .join(',')
    });

    // const ctx = createObject(store.data, {
    //     ...store.query,
    //     items: childProps.items,
    //     selectedItems: childProps.selectedItems,
    //     unSelectedItems: childProps.unSelectedItems
    // });

    if (
      bulkActions &&
      bulkActions.length &&
      (!itemActions || !itemActions.length || selectedItems.length > 1)
    ) {
      bulkBtns = bulkActions
        .map(item => ({
          ...item,
          ...getExprProperties(item as Schema, ctx)
        }))
        .filter(item => !item.hidden && item.visible !== false);
    }

    const itemData = createObject(
      store.data,
      selectedItems.length ? selectedItems[0] : {}
    );

    if (itemActions && selectedItems.length <= 1) {
      itemBtns = itemActions
        .map(item => ({
          ...item,
          ...getExprProperties(item as Schema, itemData)
        }))
        .filter(item => !item.hidden && item.visible !== false);
    }

    return bulkBtns.length || itemBtns.length ? (
      <div className={cx('Crud-actions')}>
        {bulkBtns.map((btn, index) =>
          render(
            `bulk-action/${index}`,
            {
              ...omit(btn, ['visibleOn', 'hiddenOn', 'disabledOn']),
              type: btn.type || 'button',
              ignoreConfirm: true
            },
            {
              key: `bulk-${index}`,
              data: ctx,
              disabled:
                btn.disabled ||
                (btn.requireSelected !== false ? !selectedItems.length : false),
              onAction: this.handleBulkAction.bind(
                this,
                selectedItems.concat(),
                unSelectedItems.concat()
              )
            }
          )
        )}
        {itemBtns.map((btn, index) =>
          render(
            `bulk-action/${index}`,
            {
              ...omit(btn, ['visibleOn', 'hiddenOn', 'disabledOn']),
              type: 'button'
            },
            {
              key: `item-${index}`,
              data: itemData,
              disabled: btn.disabled || selectedItems.length !== 1,
              onAction: this.handleItemAction.bind(this, btn, itemData)
            }
          )
        )}
      </div>
    ) : null;
  }

  renderPagination(toolbar: SchemaNode) {
    const {
      store,
      render,
      classnames: cx,
      alwaysShowPagination,
      perPageAvailable,
      testIdBuilder
    } = this.props;
    const {page, lastPage} = store;

    if (
      store.mode !== 'simple' &&
      store.lastPage < 2 &&
      !alwaysShowPagination
    ) {
      return null;
    }

    const extraProps: Pick<
      PaginationProps,
      | 'showPageInput'
      | 'maxButtons'
      | 'layout'
      | 'popOverContainerSelector'
      | 'total'
      | 'perPageAvailable'
      | 'showPerPage'
    > = {};

    // 下发 perPageAvailable
    if (Array.isArray(perPageAvailable)) {
      extraProps.perPageAvailable = perPageAvailable;
    }

    /** 优先级：showPageInput显性配置 > (lastPage > 9) */
    if (typeof toolbar !== 'string') {
      Object.assign(extraProps, toolbar);
      const showPageInput = (toolbar as Schema).showPageInput;

      extraProps.showPageInput =
        showPageInput === true || (lastPage > 9 && showPageInput == null);
      extraProps.total = resolveVariableAndFilter(
        (toolbar as Schema).total,
        store.data
      );
    } else {
      extraProps.showPageInput = lastPage > 9;
    }

    return (
      <div className={cx('Crud-pager')}>
        {render(
          'pagination',
          {
            type: 'pagination',
            testIdBuilder: testIdBuilder?.getChild('pagination')
          },
          {
            ...extraProps,
            activePage: page,
            lastPage: lastPage,
            hasNext: store.hasNext,
            mode: store.mode,
            perPage: store.perPage,
            popOverContainer: this.parentContainer,
            onPageChange: this.handleChangePage
          }
        )}
      </div>
    );
  }

  renderStatistics() {
    const {
      store,
      classnames: cx,
      translate: __,
      alwaysShowPagination
    } = this.props;

    if (store.lastPage <= 1 && !alwaysShowPagination) {
      return null;
    }

    return (
      <div className={cx('Crud-statistics')}>
        {__('CRUD.stat', {
          page: store.page,
          lastPage: store.lastPage,
          total: store.total
        })}
      </div>
    );
  }

  renderSwitchPerPage(childProps: any) {
    const {
      mobileUI,
      store,
      perPageAvailable,
      classnames: cx,
      classPrefix: ns,
      translate: __,
      testIdBuilder
    } = this.props;

    const items = childProps.items;

    if (!items.length) {
      return null;
    }

    const perPages = mobileUI
      ? (perPageAvailable || [5, 10, 20, 50, 100]).map((item: any) => ({
          label: item + ' 条/页',
          value: item + ''
        }))
      : (perPageAvailable || [5, 10, 20, 50, 100]).map((item: any) => ({
          label: item,
          value: item + ''
        }));

    return (
      <div className={cx('Crud-pageSwitch')}>
        {!mobileUI ? <span>{__('CRUD.perPage')}</span> : null}
        <Select
          classPrefix={ns}
          searchable={false}
          placeholder={__('Select.placeholder')}
          options={perPages}
          value={store.perPage + ''}
          onChange={(value: any) => this.handleChangePage(1, value.value)}
          clearable={false}
          popOverContainer={this.parentContainer}
          testIdBuilder={testIdBuilder?.getChild('perPage')}
        />
      </div>
    );
  }

  renderLoadMore() {
    const {
      store,
      classPrefix: ns,
      classnames: cx,
      translate: __,
      testIdBuilder
    } = this.props;
    const {page, lastPage} = store;

    return (
      <div className={cx('Crud-loadMore')}>
        <Button
          disabled={page >= lastPage}
          disabledTip={__('CRUD.loadMoreDisableTip')}
          classPrefix={ns}
          onClick={() =>
            this.search({page: page + 1, loadDataMode: 'load-more'})
          }
          size="sm"
          {...testIdBuilder?.getChild('loadMore').getTestId()}
        >
          {__('CRUD.loadMore')}
        </Button>
      </div>
    );
  }

  renderFilterToggler() {
    const {store, classnames: cx, translate: __, filterTogglable} = this.props;

    if (!store.filterTogggable) {
      return null;
    }

    let custom: {
      icon?: string | boolean;
      label?: string | boolean;
      activeIcon?: string | boolean;
      activeLabel?: string | boolean;
    } = isPlainObject(filterTogglable)
      ? {
          ...(filterTogglable as any)
        }
      : {};
    if (store.filterVisible) {
      custom.icon = custom.activeIcon ?? custom.icon;
      custom.label = custom.activeLabel ?? custom.label;
    }

    return (
      <button
        onClick={() => store.setFilterVisible(!store.filterVisible)}
        className={cx('Button Button--size-default Button--default', {
          'is-active': store.filterVisible
        })}
      >
        {custom.icon ? (
          <Icon icon={custom.icon} className="icon m-r-xs" />
        ) : custom?.icon !== false ? (
          <Icon icon="filter" className="icon m-r-xs" />
        ) : null}
        {custom?.label ?? __('CRUD.filter')}
      </button>
    );
  }

  renderExportCSV(toolbar: Schema) {
    const {store, classPrefix: ns, translate: __, loadDataOnce} = this.props;
    const api = (toolbar as Schema).api;
    const filename = toolbar.filename;

    return (
      <Button
        classPrefix={ns}
        onClick={() =>
          store.exportAsCSV({
            loadDataOnce,
            api,
            filename,
            data: store.filterData /* 因为filter区域可能设置了过滤字段值，所以query信息也要写入数据域 */
          })
        }
      >
        {toolbar.label || __('CRUD.exportCSV')}
      </Button>
    );
  }

  renderToolbar(
    toolbar?: SchemaNode,
    index: number = 0,
    childProps: any = {},
    toolbarRenderer?: (toolbar: SchemaNode, index: number) => React.ReactNode
  ) {
    if (!toolbar) {
      return null;
    }

    const {render, store, mobileUI, translate: __, testIdBuilder} = this.props;
    const type = (toolbar as Schema).type || toolbar;

    if (type === 'bulkActions' || type === 'bulk-actions') {
      return this.renderBulkActions(childProps);
    } else if (type === 'pagination') {
      return this.renderPagination(toolbar);
    } else if (type === 'statistics') {
      return this.renderStatistics();
    } else if (type === 'switch-per-page') {
      return this.renderSwitchPerPage(childProps);
    } else if (type === 'load-more') {
      return this.renderLoadMore();
    } else if (type === 'filter-toggler') {
      return this.renderFilterToggler();
    } else if (type === 'export-csv') {
      return this.renderExportCSV(toolbar as Schema);
    } else if (type === 'reload') {
      let reloadButton = {
        label: '',
        icon: 'fa fa-sync',
        tooltip: __('reload'),
        tooltipPlacement: 'top',
        type: 'button'
      };
      if (typeof toolbar === 'object') {
        reloadButton = {...reloadButton, ...omit(toolbar, ['type', 'align'])};
      }
      return render(`toolbar/${index}`, reloadButton, {
        onAction: () => {
          this.reload();
        }
      });
    } else if (Array.isArray(toolbar)) {
      const children: Array<any> = toolbar
        .filter((toolbar: any) => isVisible(toolbar, store.toolbarData))
        .map((toolbar, index) => ({
          dom: this.renderToolbar(toolbar, index, childProps, toolbarRenderer),
          toolbar
        }))
        .filter(item => item.dom);
      const len = children.length;
      const cx = this.props.classnames;
      if (len) {
        return (
          <div
            className={cx('Crud-toolbar')}
            key={index}
            {...testIdBuilder?.getChild('toolbar').getTestId()}
          >
            {children.map(({toolbar, dom: child}, index) => {
              const type = (toolbar as Schema).type || toolbar;
              let align =
                toolbar.align || (type === 'pagination' ? 'right' : 'left');
              return (
                <div
                  key={toolbar.id || index}
                  className={cx(
                    'Crud-toolbar-item',
                    align ? `Crud-toolbar-item--${align}` : '',
                    {
                      'is-mobile': mobileUI
                    }
                    // toolbar.className
                  )}
                >
                  {child}
                </div>
              );
            })}
          </div>
        );
      }
      return null;
    }

    const result = toolbarRenderer
      ? toolbarRenderer(toolbar, index)
      : undefined;

    if (result !== void 0) {
      return result;
    }

    const $$editable = childProps.$$editable;
    return render(`toolbar/${index}`, toolbar, {
      data: store.toolbarData,
      page: store.page,
      lastPage: store.lastPage,
      perPage: store.perPage,
      total: store.total,
      onQuery: this.handleQuery,
      onAction: this.handleAction,
      onChangePage: this.handleChangePage,
      onBulkAction: this.handleBulkAction,
      $$editable
    });
  }

  renderHeaderToolbar(
    childProps: any,
    toolbarRenderer?: (toolbar: SchemaNode, index: number) => React.ReactNode
  ) {
    let {toolbar, toolbarInline, headerToolbar} = this.props;

    if (toolbar) {
      if (Array.isArray(headerToolbar)) {
        headerToolbar = toolbarInline
          ? headerToolbar.concat(toolbar as any)
          : ([headerToolbar, toolbar] as any);
      } else if (headerToolbar) {
        headerToolbar = [headerToolbar, toolbar] as any;
      } else {
        headerToolbar = toolbar as any;
      }
    }

    return this.renderToolbar(
      headerToolbar || [],
      0,
      childProps,
      toolbarRenderer
    );
  }

  renderFooterToolbar(
    childProps: any,
    toolbarRenderer?: (toolbar: SchemaNode, index: number) => React.ReactNode
  ) {
    let {toolbar, toolbarInline, footerToolbar} = this.props;

    if (toolbar) {
      if (Array.isArray(footerToolbar)) {
        footerToolbar = (
          toolbarInline
            ? footerToolbar.concat(toolbar as any)
            : [footerToolbar, toolbar]
        ) as any;
      } else if (footerToolbar) {
        footerToolbar = [footerToolbar, toolbar] as any;
      } else {
        footerToolbar = toolbar as any;
      }
    }

    return this.renderToolbar(footerToolbar, 0, childProps, toolbarRenderer);
  }

  renderTag(item: any, index: number) {
    const {
      classnames: cx,
      labelField,
      labelTpl,
      primaryField,
      valueField,
      translate: __,
      env,
      itemCheckableOn
    } = this.props;

    const checkable = itemCheckableOn
      ? evalExpression(itemCheckableOn, item)
      : true;

    return (
      <div
        key={index}
        className={cx(`Crud-value`, checkable ? '' : 'is-disabled')}
      >
        <span
          className={cx('Crud-valueIcon')}
          onClick={this.unSelectItem.bind(this, item, index)}
        >
          ×
        </span>
        <span className={cx('Crud-valueLabel')}>
          {labelTpl ? (
            <Html html={filter(labelTpl, item)} filterHtml={env.filterHtml} />
          ) : (
            getVariable(item, labelField || 'label') ||
            getVariable(item, valueField || primaryField || 'id')
          )}
        </span>
      </div>
    );
  }

  renderSelection(): React.ReactNode {
    const {
      store,
      classPrefix: ns,
      classnames: cx,
      labelField,
      labelTpl,
      primaryField,
      valueField,
      translate: __,
      env,
      popOverContainer,
      multiple,
      maxTagCount,
      overflowTagPopover
    } = this.props;

    if (!store.selectedItems.length) {
      return null;
    }

    const totalCount = store.selectedItems.length;
    let tags: any[] = store.selectedItems;
    const enableOverflow =
      multiple !== false &&
      isIntegerInRange(maxTagCount, {
        start: 0,
        end: totalCount,
        left: 'inclusive',
        right: 'exclusive'
      });

    if (enableOverflow) {
      tags = [
        ...store.selectedItems.slice(0, maxTagCount),
        {label: `+ ${totalCount - maxTagCount} ...`, value: '__overflow_tag__'}
      ];
    }

    return (
      <div className={cx('Crud-selection')}>
        <div className={cx('Crud-selectionLabel')}>
          {__('CRUD.selected', {total: store.selectedItems.length})}
        </div>
        {tags.map((item, index) => {
          if (enableOverflow && index === maxTagCount) {
            return (
              <TooltipWrapper
                key={index}
                container={popOverContainer}
                tooltip={{
                  placement: 'top',
                  trigger: 'hover',
                  showArrow: false,
                  offset: [0, -10],
                  tooltipClassName: cx(
                    'Crud-selection-overflow',
                    overflowTagPopover?.tooltipClassName
                  ),
                  title: __('已选项'),
                  ...omit(overflowTagPopover, [
                    'children',
                    'content',
                    'tooltipClassName'
                  ]),
                  children: () => {
                    return (
                      <div
                        className={cx(`${ns}Crud-selection-overflow-wrapper`)}
                      >
                        {store.selectedItems
                          .slice(maxTagCount, totalCount)
                          .map((overflowItem, rawIndex) => {
                            const key = rawIndex + maxTagCount;

                            return this.renderTag(overflowItem, key);
                          })}
                      </div>
                    );
                  }
                }}
              >
                <div key={index} className={cx(`Crud-value`)}>
                  <span className={cx('Crud-valueLabel')}>{item.label}</span>
                </div>
              </TooltipWrapper>
            );
          }

          return this.renderTag(item, index);
        })}
        <a onClick={this.clearSelection} className={cx('Crud-selectionClear')}>
          {__('clear')}
        </a>
      </div>
    );
  }

  render() {
    const {
      className,
      style,
      bodyClassName,
      filter,
      render,
      store,
      mode,
      syncLocation,
      children,
      bulkActions,
      pickerMode,
      multiple,
      strictMode,
      valueField,
      primaryField,
      value,
      hideQuickSaveBtn,
      itemActions,
      classnames: cx,
      keepItemSelectionOnPageChange,
      maxKeepItemSelectionLength,
      maxItemSelectionLength,
      onAction,
      popOverContainer,
      translate: __,
      onQuery,
      autoGenerateFilter,
      onSelect,
      autoFillHeight,
      onEvent,
      onSave,
      onSaveOrder,
      onPopOverOpened,
      onPopOverClosed,
      onSearchableFromReset,
      onSearchableFromSubmit,
      onSearchableFromInit,
      headerToolbarRender,
      footerToolbarRender,
      testIdBuilder,
      id,
      filterCanAccessSuperData = true,
      selectable = false,
      ...rest
    } = this.props;

    return (
      <div
        className={cx('Crud', className, {
          'is-loading': store.loading,
          'is-mobile': isMobile()
        })}
        style={style}
        data-id={id}
        {...testIdBuilder?.getChild('wrapper').getTestId()}
      >
        {filter && (!store.filterTogggable || store.filterVisible)
          ? render(
              'filter',
              {
                title: __('CRUD.filter'),
                mode: 'inline',
                submitText: __('search'),
                ...filter,
                type: 'form',
                api: null,
                testIdBuilder: testIdBuilder?.getChild('filter')
              },
              {
                key: 'filter',
                panelClassName: cx(
                  'Crud-filter',
                  filter.panelClassName || 'Panel--default'
                ),
                data: store.filterData,
                onReset: this.handleFilterReset,
                onSubmit: this.handleFilterSubmit,
                onInit: this.handleFilterInit,
                formStore: undefined,
                canAccessSuperData: filterCanAccessSuperData
              }
            )
          : null}

        {keepItemSelectionOnPageChange && multiple !== false
          ? this.renderSelection()
          : null}

        {render(
          'body',
          {
            ...rest,
            id,
            // 通用事件 例如cus-event 如果直接透传给table 则会被触发2次
            // 因此只将下层组件table、cards中自定义事件透传下去 否则通过crud配置了也不会执行
            onEvent: this.filterOnEvent(onEvent),
            columns: store.columns ?? rest.columns,
            type: mode || 'table'
          },
          {
            key: 'body',
            className: cx('Crud-body', bodyClassName),
            ref: this.controlRef,
            autoGenerateFilter: !filter && autoGenerateFilter,
            filterCanAccessSuperData,
            autoFillHeight: autoFillHeight,
            selectable: !!(
              (this.hasBulkActionsToolbar() && this.hasBulkActions()) ||
              pickerMode ||
              selectable
            ),
            itemActions,
            multiple:
              multiple === void 0
                ? bulkActions && bulkActions.length > 0
                  ? true
                  : false
                : multiple,
            selected: store.selectedItemsAsArray,
            strictMode,
            keepItemSelectionOnPageChange,
            maxKeepItemSelectionLength,
            maxItemSelectionLength,
            valueField: valueField || primaryField,
            primaryField: primaryField,
            hideQuickSaveBtn,
            items: store.data.items,
            query: store.query,
            orderBy: store.query.orderBy,
            orderDir: store.query.orderDir,
            popOverContainer,
            onAction: this.handleAction,
            onSave: this.handleSave,
            onSaveOrder: this.handleSaveOrder,
            onQuery: this.handleQuery,
            onSelect: this.handleSelect,
            onPopOverOpened: this.handleChildPopOverOpen,
            onPopOverClosed: this.handleChildPopOverClose,
            onSearchableFromReset: this.handleFilterReset,
            onSearchableFromSubmit: this.handleFilterSubmit,
            onSearchableFromInit: this.handleFilterInit,
            headerToolbarRender: this.renderHeaderToolbar,
            footerToolbarRender: this.renderFooterToolbar,
            data: store.mergedData,
            loading: store.loading,
            host: this,
            testIdBuilder: testIdBuilder?.getChild('body')
          }
        )}
        {render(
          'dialog',
          {
            ...((store.action as ActionObject) &&
              ((store.action as ActionObject).dialog as object)),
            type: 'dialog'
          },
          {
            key: 'dialog',
            data: store.dialogData,
            onConfirm: this.handleDialogConfirm,
            onClose: this.handleDialogClose,
            show: store.dialogOpen
          }
        )}
      </div>
    );
  }
}

export class CRUDRendererBase<T extends CRUDProps> extends CRUD<T> {
  static contextType = ScopedContext;

  constructor(props: T, context: IScopedContext) {
    super(props);

    const scoped = context;
    scoped.registerComponent(this);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    const scoped = this.context as IScopedContext;
    scoped.unRegisterComponent(this);
  }

  reload(
    subpath?: string,
    query?: any,
    ctx?: any,
    silent?: boolean,
    replace?: boolean,
    args?: any
  ) {
    const scoped = this.context as IScopedContext;
    if (args?.index || args?.condition) {
      // 局部刷新
      // 由内容组件去实现
      return this.control?.reload('', query, ctx, undefined, undefined, args);
    } else if (subpath) {
      return scoped.reload(
        query ? `${subpath}?${qsstringify(query)}` : subpath,
        ctx
      );
    }

    return super.reload(subpath, query, ctx, silent, replace, args);
  }

  async receive(
    values: any,
    subPath?: string,
    replace?: boolean,
    resetPage?: boolean,
    clearSelection?: boolean
  ) {
    const scoped = this.context as IScopedContext;
    if (subPath) {
      return scoped.send(subPath, values);
    }

    return super.receive(values, undefined, replace, resetPage, clearSelection);
  }

  reloadTarget(target: string, data: any) {
    const scoped = this.context as IScopedContext;
    scoped.reload(target, data);
  }

  closeTarget(target: string) {
    const scoped = this.context as IScopedContext;
    scoped.close(target);
  }

  async setData(
    values: {
      items?: any[];
      rows?: any[];
      total?: number;
      count?: number;
    },
    replace?: boolean,
    index?: number | string,
    condition?: any
  ) {
    const {store} = this.props;

    if (index !== undefined || condition !== undefined) {
      return this.control?.setData?.(values, replace, index, condition);
    } else {
      const total = values?.total || values?.count;
      const items = values.rows ?? values.items; // 兼容没传items的情况
      if (total !== undefined) {
        store.updateTotal(parseInt(total as any, 10));
      }

      return store.updateData(
        {...values, ...(items ? {items} : {})}, // 做个兼容
        undefined,
        replace
      );
    }
  }

  getData() {
    const {store, data} = this.props;
    return store.getData(data);
  }
}

@Renderer({
  type: 'crud',
  storeType: CRUDStore.name,
  isolateScope: true
})
export class CRUDRenderer extends CRUDRendererBase<CRUDProps> {}
