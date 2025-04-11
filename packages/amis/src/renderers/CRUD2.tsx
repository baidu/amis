import React from 'react';
import {findDOMNode} from 'react-dom';
import omitBy from 'lodash/omitBy';
import pick from 'lodash/pick';
import findIndex from 'lodash/findIndex';
import upperFirst from 'lodash/upperFirst';
import {
  Renderer,
  RendererProps,
  filterTarget,
  ActionObject,
  ScopedContext,
  IScopedContext,
  CRUDStore,
  ICRUDStore,
  createObject,
  extendObject,
  isObjectShallowModified,
  getPropValue,
  getVariable,
  qsstringify,
  qsparse,
  isArrayChildrenModified,
  autobind,
  parseQuery,
  isObject,
  evalExpression,
  filter,
  isEffectiveApi,
  isApiOutdated,
  isPureVariable,
  resolveVariableAndFilter,
  parsePrimitiveQueryString,
  JSONTraverse
} from 'amis-core';
import pickBy from 'lodash/pickBy';
import {Html, PullRefresh, SpinnerExtraProps} from 'amis-ui';
import {
  BaseSchema,
  SchemaApi,
  SchemaExpression,
  SchemaName,
  SchemaObject,
  SchemaTokenizeableString
} from '../Schema';
import {CardsSchema} from './Cards';
import {ListSchema} from './List';
import {TableSchema2} from './Table2';
import {SchemaCollection} from '../Schema';

import type {Table2RendererEvent} from './Table2';
import type {CardsRendererEvent} from './Cards';
import isPlainObject from 'lodash/isPlainObject';
import isEmpty from 'lodash/isEmpty';

export type CRUDRendererEvent = Table2RendererEvent | CardsRendererEvent;

export interface CRUD2CommonSchema extends BaseSchema, SpinnerExtraProps {
  /**
   *  指定为 CRUD2 渲染器。
   */
  type: 'crud2';

  /**
   * 指定内容区的展示模式。
   */
  mode?: 'table' | 'grid' | 'cards' | /* grid 的别名*/ 'list' | 'table2';

  /**
   * 初始化数据 API
   */
  api?: SchemaApi;

  /**
   * 也可以直接从环境变量中读取，但是不太推荐。
   */
  source?: SchemaTokenizeableString;

  /**
   * 静默拉取
   */
  silentPolling?: boolean;
  /**
   * 设置自动刷新时间
   */
  interval?: number;
  stopAutoRefreshWhen?: SchemaExpression;

  /**
   * 数据展示模式 无限加载 or 分页
   */
  loadType?: 'more' | 'pagination';

  /**
   * 无限加载时，根据此项设置其每页加载数量，可以不限制
   */
  perPage?: number;

  /**
   * 是否为前端单次加载模式，可以用来实现前端分页。
   */
  loadDataOnce?: boolean;

  /**
   * 是否可以选择数据，外部事件动作
   */
  selectable?: boolean;

  /**
   * 是否可以多选数据，仅当selectable为 true 时生效
   */
  multiple?: boolean;

  /**
   * 是否展示已选数据区域，仅当selectable为 true 时生效
   */
  showSelection?: boolean;

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

  name?: SchemaName;

  /**
   * 是否隐藏快速编辑的按钮。
   */
  hideQuickSaveBtn?: boolean;

  /**
   * 是否自动跳顶部，当切分页的时候。
   */
  autoJumpToTopOnPagerChange?: boolean;

  /**
   * 顶部区域
   */
  headerToolbar?: SchemaCollection;

  /**
   * 顶部区域CSS类名
   */
  headerToolbarClassName?: string;

  /**
   * 底部区域
   */
  footerToolbar?: SchemaCollection;

  /**
   * 底部区域CSS类名
   */
  footerToolbarClassName?: string;

  /**
   * 是否将接口返回的内容自动同步到地址栏，前提是开启了同步地址栏。
   */
  syncResponse2Query?: boolean;

  /**
   * 翻页时是否保留用户已选的数据
   */
  keepItemSelectionOnPageChange?: boolean;

  /**
   * 内容区域占满屏幕剩余空间
   */
  autoFillHeight?: boolean;

  /** 行标识符，默认为id */
  primaryField?: string;

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
   * 下拉刷新配置
   */
  pullRefresh?: {
    /**
     * 是否禁用下拉刷新
     */
    disabled?: boolean;

    /**
     * 是否显示loading图标
     * @default true
     */
    showIcon?: boolean;

    /**
     * 是否显示文本
     * @default true
     */
    showText?: boolean;

    /**
     * 指定图标样式
     * @default 'loading-outline'
     */
    iconType?: string;

    /**
     * 图标和文字颜色
     * @default '#777777'
     */
    color?: string;

    /**
     * 各状态文字说明
     */
    contentText?: {
      /** 下拉刷新的默认文字 */
      normalText?: string;
      /** 下拉过程中的文字 */
      pullingText?: string;
      /** 释放立即刷新的文字 */
      loosingText?: string;
      /** 加载中的文字 */
      loadingText?: string;
      /** 加载成功的文字 */
      successText?: string;
      /** 全部加载完成的文字 */
      completedText?: string;
    };

    /**
     * 新数据追加的位置
     * @default 'bottom'
     */
    dataAppendTo?: 'top' | 'bottom';

    /**
     * 加载状态的最短显示时间(毫秒)
     * @default 0
     */
    minLoadingTime?: number;
    /**
     * 手势方向
     * @default 'up'
     */
    gestureDirection?: 'up' | 'down';
  };
}

export type CRUD2CardsSchema = CRUD2CommonSchema & {
  mode: 'cards';
} & Omit<CardsSchema, 'type'>;

export type CRUD2ListSchema = CRUD2CommonSchema & {
  mode: 'list';
} & Omit<ListSchema, 'type'>;

export type CRUD2TableSchema = CRUD2CommonSchema & {
  mode?: 'table2';
} & Omit<TableSchema2, 'type'>;

export type CRUD2Schema = CRUD2CardsSchema | CRUD2ListSchema | CRUD2TableSchema;

export interface CRUD2Props
  extends RendererProps,
    Omit<CRUD2CommonSchema, 'type' | 'className'>,
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

export default class CRUD2<T extends CRUD2Props> extends React.Component<
  T,
  any
> {
  static propsList: Array<keyof CRUD2Props> = [
    'mode',
    'syncLocation',
    'value',
    'multiple',
    'valueField',
    'pageField',
    'perPageField',
    'hideQuickSaveBtn',
    'autoJumpToTopOnPagerChange',
    'interval',
    'silentPolling',
    'stopAutoRefreshWhen',
    'stopAutoRefreshWhenModalIsOpen',
    'api',
    'headerToolbar',
    'footerToolbar',
    'autoGenerateFilter',
    'syncResponse2Query',
    'keepItemSelectionOnPageChange',
    'source',
    'onChange',
    'onInit',
    'onSaved',
    'onQuery',
    'autoFillHeight',
    'showSelection',
    'headerToolbarClassName',
    'footerToolbarClassName',
    'primaryField',
    'parsePrimitiveQuery',
    'pullRefresh'
  ];

  static defaultProps = {
    toolbarInline: true,
    syncLocation: true,
    hideQuickSaveBtn: false,
    autoJumpToTopOnPagerChange: true,
    silentPolling: false,
    autoFillHeight: false,
    showSelection: true,
    primaryField: 'id',
    parsePrimitiveQuery: true,
    pullRefresh: {
      disabled: false,
      showIcon: true,
      showText: true,
      iconType: 'auto',
      color: '#777777',
      dataAppendTo: 'bottom',
      gestureDirection: 'up',
      minLoadingTime: 0,
      contentText: {
        normalText: '点击加载更多',
        pullingText: '加载中...',
        loosingText: '释放立即刷新',
        loadingText: '加载中...',
        successText: '加载成功',
        completedText: '没有更多数据了'
      }
    }
  };

  control: any;

  lastQuery: any;
  lastData: any;

  timer: ReturnType<typeof setTimeout>;
  mounted: boolean;

  stopingAutoRefresh: boolean = false;

  constructor(props: T) {
    super(props);

    const {
      location,
      store,
      syncLocation,
      pageField,
      perPageField,
      parsePrimitiveQuery
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

    // 如果有 api，data 里面先写个 空数组，面得继承外层的 items
    // 比如 crud 打开一个弹框，里面也是个 crud，默认一开始其实显示
    // 的是外层 crud 的数据，等接口回来后就会变成新的。
    // 加上这个就是为了解决这种情况
    if (this.props.api) {
      this.props.store.updateData({
        items: []
      });
    }

    // 自定义列需要用store里的数据同步显示列
    // 所以需要先初始化一下
    const {mode, columns} = props;
    if (mode === 'table2' && columns) {
      store.updateColumns(columns);
    }
  }

  componentDidMount() {
    const {store, pickerMode, loadType, loadDataOnce, maxLoadNum} = this.props;

    // 初始化分页
    let pagination = loadType && !loadDataOnce;
    if (pagination) {
      // crud2的翻页每页条数是翻页组件里单独配置的
      let perPage =
        loadType === 'more'
          ? this.props.perPage || 10
          : this.getPaginationPerPage();
      store.changePage(store.page, perPage);
    } else if (!loadType) {
      store.changePage(1, maxLoadNum || 500); // 不分页时默认一次最多查询500条(jsonql)
    }

    // 初始化筛选条件
    this.initQuery({});

    if (pickerMode) {
      // 解析picker组件默认值
      const val = getPropValue(this.props);
      val && store.setSelectedItems(val);
    }
  }

  componentDidUpdate(prevProps: CRUD2Props) {
    const props = this.props;
    const store = prevProps.store;
    const {parsePrimitiveQuery} = props;

    if (prevProps.columns !== props.columns) {
      store.updateColumns(props.columns);
    }
    // picker外部引起的值变化处理
    let val: any;
    if (
      this.props.pickerMode &&
      isArrayChildrenModified(
        (val = getPropValue(this.props)),
        getPropValue(prevProps)
      )
    ) {
      store.setSelectedItems(val);
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
    } else if (!props.api && isPureVariable(props.source)) {
      const next = resolveVariableAndFilter(props.source, props.data, '| raw');

      if (!this.lastData || this.lastData !== next) {
        store.initFromScope(props.data, props.source, {
          columns: store.columns ?? props.columns
        });
        this.lastData = next;
      }
    }

    if (dataInvalid) {
      this.getData();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    clearTimeout(this.timer);
  }

  @autobind
  getPaginationPerPage() {
    let perPage = 10;
    let {headerToolbar, footerToolbar} = this.props;
    JSONTraverse(
      {
        headerToolbar,
        footerToolbar
      },
      (value: any, key: string, host: any) => {
        if (key === 'type' && value === 'pagination' && !isNaN(host?.perPage)) {
          perPage = +host.perPage;
        }
      }
    );
    return perPage;
  }

  getParseQueryOptions(props: CRUD2Props) {
    const {parsePrimitiveQuery} = props;
    type PrimitiveQueryObj = Exclude<
      CRUD2Props['parsePrimitiveQuery'],
      boolean
    >;

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

  @autobind
  controlRef(control: any) {
    // 因为 control 有可能被 n 层 hoc 包裹。
    while (control && control.getWrappedInstance) {
      control = control.getWrappedInstance();
    }

    this.control = control;
  }

  initQuery(values: object) {
    const {store, orderBy, orderDir, loadType} = this.props;
    const params: any = {};

    if (orderBy) {
      params['orderBy'] = orderBy;
      params['orderDir'] = orderDir || 'asc';
    }

    this.handleSearch({
      query: {
        ...params,
        ...values,
        ...store.query
      },
      replaceQuery: this.props.initFetch !== false,
      loadMore: loadType === 'more',
      resetPage: false
    });

    // 保留一次用于重置查询条件
    store.setPristineQuery();
  }

  /**
   * 加载更多动作处理器
   */
  handleLoadMore() {
    const {store, perPage = 10} = this.props;

    store.changePage(store.page + 1, perPage);
    this.getData(undefined, undefined, undefined, true);
  }

  /**
   * 发起一次新的查询，查询条件不同，需要从第一页数据加载
   */
  handleSearch(data: {
    query?: Record<string, any>; // 查询条件，没有将使用当前的
    resetQuery?: boolean;
    replaceQuery?: boolean;
    loadMore?: boolean;
    /** 是否重置当页码到首页 */
    resetPage?: boolean;
  }) {
    const {
      store,
      syncLocation,
      env,
      pageField,
      perPageField,
      parsePrimitiveQuery
    } = this.props;
    const parseQueryOptions = this.getParseQueryOptions(this.props);
    let {query, resetQuery, replaceQuery, loadMore, resetPage} = data || {};

    /** 找出clearValueOnHidden的字段, 保证updateQuery时不会使用上次的保留值 */
    query = {
      ...query,
      ...pickBy(query?.__super?.diff ?? {}, value => value === undefined)
    };
    query = syncLocation ? qsparse(qsstringify(query, undefined, true)) : query;

    /** 把布尔值反解出来 */
    if (parsePrimitiveQuery) {
      query = parsePrimitiveQueryString(query, parseQueryOptions);
    }

    store.updateQuery(
      resetQuery ? {...query, ...this.props.store.pristineQuery} : query,
      syncLocation && env && env.updateLocation
        ? (location: any) => env.updateLocation(location, true)
        : undefined,
      pageField,
      perPageField,
      replaceQuery
    );

    if (resetPage) {
      store.changePage(1);
    }

    this.lastQuery = store.query;
    this.getData(undefined, undefined, undefined, loadMore ?? false);
  }

  handleStopAutoRefresh() {
    this.timer && clearTimeout(this.timer);
    this.stopingAutoRefresh = true;
  }

  handleStartAutoRefresh() {
    this.stopingAutoRefresh = false;
    this.reload();
  }

  reloadTarget(target: string, data: any) {
    // implement this.
  }

  closeTarget(target: string) {
    // implement this.
  }

  updateQuery(newQuery: any = {}) {
    this.props.store;
  }

  /**
   * 更新列表数据
   */
  async getData(
    /** 静默更新，不显示加载状态 */
    silent?: boolean,
    /** 清空已选择数据 */
    clearSelection?: boolean,
    /** 强制重新加载 */
    forceReload = false,
    /** 加载更多数据，默认模式取props中的配置，只有事件动作需要直接触发 */
    loadMore?: boolean
  ) {
    const {
      store,
      api,
      messages,
      pageField,
      perPageField,
      interval,
      stopAutoRefreshWhen,
      silentPolling,
      syncLocation,
      syncResponse2Query,
      keepItemSelectionOnPageChange,
      stopAutoRefreshWhenModalIsOpen,
      pickerMode,
      env,
      loadType,
      loadDataOnce,
      source,
      columns,
      perPage,
      pullRefresh
    } = this.props;

    // reload 需要清空用户选择
    if (
      !loadMore &&
      keepItemSelectionOnPageChange &&
      clearSelection &&
      !pickerMode
    ) {
      store.setSelectedItems([]);
      store.setUnSelectedItems([]);
    }

    clearTimeout(this.timer);
    this.lastQuery = store.query;
    const loadDataMode = loadMore ?? loadType === 'more';

    const data: Record<string, any> = createObject(store.data, store.query);

    // handleLoadMore 是在事件触发后才执行，首次加载并不走到 handleLoadMore
    // 所以加载更多模式下，首次加载也需要使用设置的 perPage，避免前后 perPage 不一致导致的问题
    if (loadDataMode && perPage) {
      store.changePerPage(perPage);
    }

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
        dataAppendTo: pullRefresh?.dataAppendTo || 'bottom',
        syncResponse2Query,
        columns: store.columns ?? columns,
        isTable2: true,
        minLoadingTime: pullRefresh?.minLoadingTime
      });

      value?.ok && // 接口正常返回才继续轮训
        interval &&
        !this.stopingAutoRefresh &&
        this.mounted &&
        (!stopAutoRefreshWhen ||
          !(
            stopAutoRefreshWhen &&
            evalExpression(
              stopAutoRefreshWhen,
              createObject(store.data, store.query)
            )
          )) &&
        // 弹窗期间不进行刷新
        (!stopAutoRefreshWhenModalIsOpen ||
          (!store.dialogOpen && !store?.parentStore?.dialogOpen)) &&
        (this.timer = setTimeout(
          this.getData.bind(this, silentPolling, undefined, true),
          Math.max(interval, 1000)
        ));
    } else if (source) {
      store.initFromScope(data, source, {
        columns: store.columns ?? columns
      });
    }

    return store.data;
  }

  @autobind
  handleChangePage(page: number, perPage?: number) {
    const {
      store,
      syncLocation,
      env,
      pageField,
      perPageField,
      autoJumpToTopOnPagerChange
    } = this.props;

    let query: any = {
      [pageField || 'page']: page
    };

    if (perPage) {
      query[perPageField || 'perPage'] = perPage;
    }

    store.updateQuery(
      query,
      syncLocation && env?.updateLocation ? env.updateLocation : undefined,
      pageField,
      perPageField
    );
    store.changePage(page, perPage);
    this.getData();

    if (autoJumpToTopOnPagerChange && this.control) {
      (findDOMNode(this.control) as HTMLElement).scrollIntoView();
      const scrolledY = window.scrollY;
      scrolledY && window.scroll(0, scrolledY);
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
      reload
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

      store
        .saveRemote(quickSaveApi, data, {
          successMessage: messages && messages.saveFailed,
          errorMessage: messages && messages.saveSuccess
        })
        .then(() => {
          reload && this.reloadTarget(filterTarget(reload, data), data);
          this.getData(undefined, undefined, true);
        })
        .catch(() => {});
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
      store
        .saveRemote(quickSaveItemApi, sendData)
        .then(() => {
          reload && this.reloadTarget(filterTarget(reload, data), data);

          this.getData(undefined, undefined, true);
        })
        .catch(() => {
          options?.resetOnFailed && this.control.reset();
        });
    }
  }

  @autobind
  handleSaveOrder(moved: Array<object>, rows: Array<object>) {
    const {store, saveOrderApi, orderField, primaryField, env, reload} =
      this.props;

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
      rows = rows.map((item, key) =>
        extendObject(item, {
          [orderField]: start + key + 1
        })
      );
    }

    model.rows = rows.concat();
    hasIdField &&
      (model.ids = rows
        .map((item: any) => item[primaryField as string])
        .join(','));
    hasIdField &&
      orderField &&
      (model.order = rows.map(item =>
        pick(item, [primaryField as string, orderField])
      ));

    isEffectiveApi(saveOrderApi, model) &&
      store
        .saveRemote(saveOrderApi, model)
        .then(() => {
          reload && this.reloadTarget(filterTarget(reload, model), model);
          this.getData(undefined, undefined, true);
        })
        .catch(() => {});
  }

  @autobind
  handleSelect(items: Array<any>, unSelectedItems: Array<any>) {
    const {
      store,
      keepItemSelectionOnPageChange,
      primaryField,
      multiple,
      pickerMode,
      onSelect
    } = this.props;

    let newItems = items;
    let newUnSelectedItems = unSelectedItems;

    // cards等组件初始化的时候也会抛出来，感觉不太合理，但是只能用这个先暂时规避一下了
    if (!isArrayChildrenModified(store.selectedItemsAsArray, newItems)) {
      return;
    }

    if (keepItemSelectionOnPageChange && store.selectedItems.length) {
      const oldItems = store.selectedItems.concat();
      const oldUnselectedItems = store.unSelectedItems.concat();

      items.forEach(item => {
        const idx = findIndex(
          oldItems,
          a =>
            a === item ||
            (a[primaryField || 'id'] &&
              a[primaryField || 'id'] == item[primaryField || 'id'])
        );

        if (~idx) {
          oldItems[idx] = item;
        } else {
          oldItems.push(item);
        }

        const idx2 = findIndex(
          oldUnselectedItems,
          a =>
            a === item ||
            (a[primaryField || 'id'] &&
              a[primaryField || 'id'] == item[primaryField || 'id'])
        );

        if (~idx2) {
          oldUnselectedItems.splice(idx2, 1);
        }
      });

      unSelectedItems.forEach(item => {
        const idx = findIndex(
          oldUnselectedItems,
          a =>
            a === item ||
            (a[primaryField || 'id'] &&
              a[primaryField || 'id'] == item[primaryField || 'id'])
        );

        const idx2 = findIndex(
          oldItems,
          a =>
            a === item ||
            (a[primaryField || 'id'] &&
              a[primaryField || 'id'] == item[primaryField || 'id'])
        );

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
    // store.updateSelectData(newItems, newUnSelectedItems);
    store.setSelectedItems(newItems);
    store.setUnSelectedItems(newUnSelectedItems);

    onSelect && onSelect(newItems);
  }

  /**
   * 更新Query筛选触发
   */
  @autobind
  handleQuerySearch(values: object, forceReload: boolean = false) {
    const {store, syncLocation, env, pageField, perPageField} = this.props;

    store.updateQuery(
      {
        ...values,
        [pageField || 'page']: 1
      },
      syncLocation && env && env.updateLocation
        ? env.updateLocation
        : undefined,
      pageField,
      perPageField
    );
    return this.getData(undefined, undefined, forceReload);
  }

  reload(subpath?: string, query?: any) {
    if (query) {
      return this.receive(query);
    } else {
      return this.getData(undefined, undefined, true);
    }
  }

  receive(values: object) {
    return this.handleQuerySearch(values, true);
  }

  @autobind
  doAction(action: ActionObject, data: object, throwErrors: boolean = false) {
    if (
      action.actionType &&
      [
        'stopAutoRefresh',
        'reload',
        'search',
        'startAutoRefresh',
        'loadMore'
      ].includes(action.actionType)
    ) {
      // @ts-ignore
      return this[`handle${upperFirst(action.actionType)}`](data);
    }
  }

  @autobind
  handleAction(
    e: React.UIEvent<any> | undefined,
    action: ActionObject,
    ctx: object,
    throwErrors: boolean = false,
    delegate?: IScopedContext
  ) {
    if (
      [
        'stopAutoRefresh',
        'reload',
        'search',
        'startAutoRefresh',
        'loadMore'
      ].includes(action.actionType as any)
    ) {
      return this.doAction(action, ctx, throwErrors);
    } else {
      return this.props.onAction(
        e,
        action,
        ctx,
        throwErrors,
        delegate || this.context
      );
    }
  }

  @autobind
  dispatchEvent(
    e: React.MouseEvent<any> | string,
    data: any,
    renderer?: React.Component<RendererProps>, // for didmount
    scoped?: IScopedContext
  ) {
    // 如果事件是 selectedChange 并且是当前组件触发的，
    // 则以当前组件的选择信息为准
    if (e === 'selectedChange' && this.control === renderer) {
      const store = this.props.store;
      data.selectedItems = store.selectedItems.concat();
      data.unSelectedItems = store.unSelectedItems.concat();
    }

    return this.props.dispatchEvent(e, data, renderer, scoped);
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
    const {store} = this.props;
    const selected = store.selectedItems.concat();
    const unSelected = store.unSelectedItems.concat();

    store.setSelectedItems([]);
    store.setUnSelectedItems(unSelected.concat(selected));
  }

  @autobind
  toggleAllColumns(value: boolean) {
    const {store} = this.props;

    store.updateColumns(
      store.columns.map((c: any) => ({...c, toggled: value}))
    );
  }

  @autobind
  toggleToggle(index: number) {
    const {store} = this.props;
    const column = store.columns[index];
    const toggled = column.toggled;
    store.updateColumns(
      store.columns.map((c: any, i: number) => ({
        ...c,
        toggled: index === i ? !toggled : c.toggled !== false
      }))
    );
  }

  @autobind
  async handlePullRefresh() {
    const {dispatchEvent, data} = this.props;
    const rendererEvent = await dispatchEvent('pullRefresh', data);
    if (rendererEvent?.prevented) {
      return;
    }
    this.handleLoadMore();
  }

  @autobind
  renderChild(region: string, schema: any, props: object = {}) {
    const {render, store, primaryField = 'id'} = this.props;
    let data;

    const selectedItems = store.selectedItems;
    const unSelectedItems = store.unSelectedItems;
    const items = store.items;

    if (/^filter/.test(region)) {
      // 包两层，主要是为了处理以下 case
      // 里面放了个 form，form 提交过来的时候不希望把 items 这些发送过来。
      // 因为会把数据呈现在地址栏上。
      /** data 可以被覆盖，因为 filter 中不需要额外的 data */
      data = createObject(
        createObject(store.filterData, store.getData(this.props.data)),
        {}
      );
    } else {
      data = createObject(store.mergedData, {
        items: items.concat(),
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
    }

    // 覆盖所有分页组件
    const childProps = {
      activePage: store.page,
      lastPage: store.lastPage,
      perPage: store.perPage,
      total: store.total,
      onPageChange: this.handleChangePage,
      cols: store.columns, // 和grid的columns属性重复，ColumnsToggler的columns改一下名字 只有用store里的columns
      toggleAllColumns: this.toggleAllColumns,
      toggleToggle: this.toggleToggle,
      // 支持 onQuery，主要是给 searchBox 组件使用
      onQuery: this.handleQuerySearch
      // onAction: onAction
    };

    if (schema.type === 'pagination') {
    }

    return render(region, schema, {
      data,
      ...props,
      ...childProps
    });
  }

  renderToolbar(region: string, toolbar?: SchemaCollection) {
    if (!toolbar) {
      return null;
    }

    toolbar = ([] as any).concat(toolbar) as any[];

    return toolbar.map((item, index) =>
      this.renderChild(`${region}/${index}`, item, {
        key: index + ''
      })
    );
  }

  renderFilter(filterSchema: SchemaObject[] | SchemaObject) {
    if (
      !filterSchema ||
      (Array.isArray(filterSchema) && filterSchema.length === 0)
    ) {
      return null;
    }

    const filterSchemas = Array.isArray(filterSchema)
      ? filterSchema
      : isObject(filterSchema) && filterSchema.type != null
      ? [filterSchema]
      : [];

    if (filterSchemas.length < 1) {
      return null;
    }

    return filterSchemas.map((item, index) =>
      this.renderChild(`filter/${index}`, item, {
        key: index + 'filter',
        data: this.props.store.filterData,
        onSubmit: (data: any) =>
          this.handleSearch({query: data, resetPage: true}),
        onReset: (data: any) => {
          const resetQueries: any = {};
          Object.keys(data!).forEach(key => (resetQueries[key] = ''));

          this.handleSearch({
            query: resetQueries,
            resetQuery: true,
            replaceQuery: true,
            resetPage: true
          });
        },
        // 移动端的查询表单支持折叠
        ...(this.props.mobileUI
          ? {
              columnCount: 1,
              mode: 'normal',
              collapsible: true,
              title: {
                type: 'container',
                body: [
                  {
                    type: 'icon',
                    icon: 'column-filter',
                    className: 'icon mr-2'
                  },
                  (item as any).title || ''
                ]
              }
            }
          : {})
      })
    );
  }

  renderSelection(): React.ReactNode {
    const {
      store,
      classnames: cx,
      labelField,
      labelTpl,
      primaryField,
      translate: __,
      env
    } = this.props;

    if (!store.selectedItems.length) {
      return null;
    }

    return (
      <div className={cx('Crud-selection')}>
        <div className={cx('Crud-selectionLabel')}>
          {__('CRUD.selected', {total: store.selectedItems.length})}
        </div>
        {store.selectedItems.map((item, index) => (
          <div key={index} className={cx(`Crud-value`)}>
            <span
              data-tooltip={__('delete')}
              data-position="bottom"
              className={cx('Crud-valueIcon')}
              onClick={this.unSelectItem.bind(this, item, index)}
            >
              ×
            </span>
            <span className={cx('Crud-valueLabel')}>
              {labelTpl ? (
                <Html
                  html={filter(labelTpl, item)}
                  filterHtml={env.filterHtml}
                />
              ) : (
                getVariable(item, labelField || 'label') ||
                getVariable(item, primaryField || 'id')
              )}
            </span>
          </div>
        ))}
        <a
          onClick={this.clearSelection.bind(this)}
          className={cx('Crud-selectionClear')}
        >
          {__('clear')}
        </a>
      </div>
    );
  }

  transformTable2cards() {
    const {store, columns: propsColumns, card, mobileMode} = this.props;
    const body: any[] = [];
    const fieldCount = mobileMode.fieldCount || 4;
    const actions: any[] = [];
    let cover: string = '';

    const columns = (store.columns ?? propsColumns) || [];
    for (let index = 0; index < columns.length; index++) {
      const item = columns[index];
      if (!isPlainObject(item)) {
        continue;
      }

      if (item.type === 'operation') {
        actions.push(...(item?.buttons || []));
      } else if (item.type === 'button' && item.name === 'operation') {
        actions.push(item);
      } else {
        if (!item.label && item.title) {
          item.label = item.title;
        }

        if (item.type === 'static-image' && !cover) {
          cover = `\${${item.name}}`;
          continue;
        }

        if (body.length < fieldCount) {
          if (item.type === 'static-image' && item.title) {
            delete item.title;
          }
          body.push(item);
        }
      }
    }

    if (!body.length) {
      return null;
    }

    return {
      columnsCount: 1,
      type: 'cards',
      card: {
        ...card,
        body,
        actions,
        ...(cover
          ? {
              media: {
                type: 'image',
                url: cover,
                position: 'right',
                className: ''
              },
              mediaActionPosition: 'outside'
            }
          : {})
      }
    };
  }

  // headerToolbar 移动端适配，如果只有新增按钮，则将新增按钮固定到屏幕右下
  transMobileHeaderToolbar(toolbar: any, fixedHeader: () => void) {
    let buttonCount = 0;
    let addButton: any = {};
    let addButtonParent: any = {};
    let searchBox: any = null;
    function traverse(node: any, parentObj?: any) {
      if (Array.isArray(node)) {
        node.forEach((item: any) => traverse(item, parentObj));
      } else if (node && typeof node === 'object') {
        if (node.type === 'button') {
          buttonCount++;
          if (node.label === '新增') {
            addButton = node;
            addButtonParent = parentObj;
          }
        } else if (node.type === 'search-box') {
          searchBox = node;
        }

        if (node.items || node.body) {
          traverse(node.items || node.body, node);
        }
      }
    }
    toolbar.forEach((item: any) => {
      traverse(item);
    });
    if (buttonCount === 1 && addButton) {
      addButton.label = '';
      addButton.icon = 'plus';
      if (!addButton.className) {
        addButton.className = '';
      }
      addButton.className += ' is-fixed-right-bottom';

      if (addButtonParent) {
        if (!addButtonParent.className) {
          addButtonParent.className = '';
        }
        addButtonParent.className += ' is-fixed-right-bottom-wrapper';
      }
    }

    if (
      searchBox &&
      (buttonCount === 0 || (buttonCount === 1 && addButton)) &&
      isEmpty(this.props.filterSchema)
    ) {
      fixedHeader();
    }
  }

  render() {
    const {
      columns,
      className,
      style,
      bodyClassName,
      filter: filterSchema,
      render,
      store,
      mode = 'table2',
      syncLocation,
      children,
      bulkActions,
      pickerMode,
      selectable,
      multiple,
      valueField,
      primaryField,
      value,
      hideQuickSaveBtn,
      itemActions,
      classnames: cx,
      keepItemSelectionOnPageChange,
      maxKeepItemSelectionLength,
      onEvent,
      onAction,
      popOverContainer,
      translate: __,
      onQuery,
      autoGenerateFilter,
      onSelect,
      autoFillHeight,
      showSelection,
      headerToolbar,
      footerToolbar,
      // columnsTogglable 在本渲染器中渲染，不需要 table 渲染，避免重复
      columnsTogglable,
      headerToolbarClassName,
      footerToolbarClassName,
      id,
      testIdBuilder,
      mobileMode,
      mobileUI,
      pullRefresh: _pullRefresh,
      ...rest
    } = this.props;

    let pullRefresh: any;
    let stickyHeader = false;
    let mobileModeProps: any = null;
    if (mobileMode && mobileUI && mode.includes('table')) {
      const cardsSchema = this.transformTable2cards();
      if (typeof mobileMode === 'string' && mobileMode === 'cards') {
        if (cardsSchema) {
          mobileModeProps = cardsSchema;
        }
      } else if (typeof mobileMode === 'object') {
        mobileModeProps = {
          ...cardsSchema,
          ...mobileMode,
          card: {
            ...cardsSchema?.card,
            ...mobileMode.card
          }
        };
      }
      if (mobileModeProps) {
        this.transMobileHeaderToolbar(headerToolbar, () => {
          stickyHeader = true;
        });
      }
      // 移动端模式，默认开启上拉刷新
      if (mobileModeProps && !_pullRefresh?.disabled) {
        pullRefresh = {
          normalText: __('pullRefresh.crud2NormalText'),
          pullingText: __('pullRefresh.crud2PullingText'),
          loosingText: __('pullRefresh.crud2LoosingText'),
          ..._pullRefresh,
          disabled: false
        };
      }
    } else {
      pullRefresh = _pullRefresh;
    }

    const body = render(
      'body',
      {
        ...rest,
        // 通用事件 例如cus-event 如果直接透传给table 则会被触发2次
        // 因此只将下层组件table、cards中自定义事件透传下去 否则通过crud配置了也不会执行
        onEvent: omitBy(
          onEvent,
          (event, key: any) => !INNER_EVENTS.includes(key)
        ),
        type: mode,
        columns: mode.startsWith('table')
          ? store.columns || columns
          : undefined,
        id,
        ...mobileModeProps
      },
      {
        key: 'body',
        className: cx('Crud2-body', bodyClassName),
        ref: this.controlRef,
        autoGenerateFilter: !filterSchema && autoGenerateFilter,
        autoFillHeight: autoFillHeight,
        checkAll: false, // 不使用组件的全选，因为不在工具栏里
        selectable: !!(selectable ?? pickerMode),
        itemActions,
        multiple: multiple,
        // columnsTogglable在CRUD2中渲染 但需要给table2传columnsTogglable为false 否则列数超过5 table2会自动渲染
        columnsTogglable: false,
        selected:
          pickerMode || keepItemSelectionOnPageChange
            ? store.selectedItemsAsArray
            : undefined,
        keepItemSelectionOnPageChange,
        maxKeepItemSelectionLength,
        // valueField: valueField || primaryField,
        primaryField: primaryField,
        testIdBuilder,
        items: store.data.items,
        query: store.query,
        orderBy: store.query.orderBy,
        orderDir: store.query.orderDir,
        popOverContainer,
        onSave: this.handleSave.bind(this),
        onSaveOrder: this.handleSaveOrder,
        onSearch: this.handleQuerySearch,
        onSort: this.handleQuerySearch,
        onSelect: this.handleSelect,
        onAction: this.handleAction,
        dispatchEvent: this.dispatchEvent,
        data: store.mergedData,
        loading: store.loading,
        host: this
      }
    );

    return (
      <div
        className={cx('Crud2', className, {
          'is-loading': store.loading,
          'is-mobile': mobileUI,
          'is-mobile-cards':
            mobileMode === 'cards' || mobileModeProps?.type === 'cards'
        })}
        style={style}
        data-id={id}
        data-role="container"
        {...testIdBuilder?.getTestId()}
      >
        <div
          className={cx('Crud2-filter')}
          {...testIdBuilder?.getChild('filter').getTestId()}
        >
          {this.renderFilter(filterSchema)}
        </div>

        <div
          className={cx(
            'Crud2-toolbar',
            'Crud2-header-toolbar',
            headerToolbarClassName,
            {
              'is-sticky': stickyHeader
            }
          )}
        >
          {this.renderToolbar('headerToolbar', headerToolbar)}
        </div>

        {showSelection && keepItemSelectionOnPageChange && multiple !== false
          ? this.renderSelection()
          : null}

        {mobileUI && pullRefresh && !pullRefresh.disabled ? (
          <PullRefresh
            {...pullRefresh}
            translate={__}
            onRefresh={this.handlePullRefresh}
            direction={pullRefresh.gestureDirection ?? 'up'}
            loading={store.loading}
            completed={
              !store.loading &&
              store.lastPage > 0 &&
              store.page >= store.lastPage
            }
            completedText={store.total > 0 ? undefined : ''}
          >
            {body}
          </PullRefresh>
        ) : (
          <>
            {body}
            <div
              className={cx(
                'Crud2-toolbar',
                'Crud2-footer-toolbar',
                footerToolbarClassName
              )}
            >
              {this.renderToolbar('footerToolbar', footerToolbar)}
            </div>
          </>
        )}
        {/* spinner可以交给孩子处理 */}
        {/* <Spinner overlay size="lg" key="info" show={store.loading} /> */}
      </div>
    );
  }
}

export class CRUD2RendererBase<T extends CRUD2Props> extends CRUD2<T> {
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

  async reload(subpath?: string, query?: any, ctx?: any) {
    const scoped = this.context as IScopedContext;
    if (subpath) {
      return scoped.reload(
        query ? `${subpath}?${qsstringify(query)}` : subpath,
        ctx
      );
    }

    return super.reload(subpath, query);
  }

  async receive(values: any, subPath?: string) {
    const scoped = this.context as IScopedContext;
    if (subPath) {
      return scoped.send(subPath, values);
    }

    return super.receive(values);
  }

  reloadTarget(target: string, data: any) {
    const scoped = this.context as IScopedContext;
    scoped.reload(target, data);
  }

  closeTarget(target: string) {
    const scoped = this.context as IScopedContext;
    scoped.close(target);
  }
}

@Renderer({
  type: 'crud2',
  storeType: CRUDStore.name,
  isolateScope: true
})
export class CRUD2Renderer extends CRUD2RendererBase<CRUD2Props> {}
