import React from 'react';

import {Renderer, RendererProps} from 'amis-core';
import {Action} from '../types';
import {CRUDStore, ICRUDStore} from 'amis-core';
import {
  createObject,
  extendObject,
  isObjectShallowModified,
  getPropValue,
  getVariable,
  qsstringify,
  qsparse,
  isArrayChildrenModified,
  autobind
} from 'amis-core';
import {ScopedContext, IScopedContext} from 'amis-core';
import Button from 'amis-ui';
import Select from 'amis-ui';
import {getExprProperties} from 'amis-core';
import pick from 'lodash/pick';
import {findDOMNode} from 'react-dom';
import {evalExpression, filter} from 'amis-core';
import {isEffectiveApi, isApiOutdated} from 'amis-core';
import findIndex from 'lodash/findIndex';
import {Html} from 'amis-ui';
import {Spinner} from 'amis-ui';
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
import {TableSchema} from './Table';
import {isPureVariable, resolveVariableAndFilter} from 'amis-core';
import {SchemaCollection} from '../Schema';
import {upperFirst} from 'lodash';

export type CRUDRendererEvent = 'search';

export interface CRUD2CommonSchema extends BaseSchema {
  /**
   *  指定为 CRUD2 渲染器。
   */
  type: 'crud2';

  /**
   * 指定内容区的展示模式。
   */
  mode?: 'table' | 'grid' | 'cards' | /* grid 的别名*/ 'list' | 'table-v2';

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
   * 底部区域
   */
  footerToolbar?: SchemaCollection;

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
}

export type CRUD2CardsSchema = CRUD2CommonSchema & {
  mode: 'cards';
} & Omit<CardsSchema, 'type'>;

export type CRUD2ListSchema = CRUD2CommonSchema & {
  mode: 'list';
} & Omit<ListSchema, 'type'>;

export type CRUD2TableSchema = CRUD2CommonSchema & {
  mode?: 'table-v2';
} & Omit<TableSchema, 'type'>;

export type CRUD2Schema = CRUD2CardsSchema | CRUD2ListSchema | CRUD2TableSchema;

export interface CRUD2Props
  extends RendererProps,
    Omit<CRUD2CommonSchema, 'type' | 'className'> {
  store: ICRUDStore;
  pickerMode?: boolean; // 选择模式，用做表单中的选择操作
}

export default class CRUD2 extends React.Component<CRUD2Props, any> {
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
    'showSelection'
  ];
  static defaultProps = {
    toolbarInline: true,
    syncLocation: true,
    hideQuickSaveBtn: false,
    autoJumpToTopOnPagerChange: true,
    silentPolling: false,
    autoFillHeight: false,
    showSelection: true,
    perPage: 10
  };

  control: any;

  lastQuery: any;
  lastData: any;

  timer: ReturnType<typeof setTimeout>;
  mounted: boolean;

  stopingAutoRefresh: boolean = false;

  constructor(props: CRUD2Props) {
    super(props);

    const {location, store, syncLocation, pageField, perPageField} = props;

    this.mounted = true;

    if (syncLocation && location && (location.query || location.search)) {
      store.updateQuery(
        qsparse(location.search.substring(1)),
        undefined,
        pageField,
        perPageField
      );
    } else if (syncLocation && !location && window.location.search) {
      store.updateQuery(
        qsparse(window.location.search.substring(1)) as object,
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
    if (mode === 'table-v2' && columns) {
      store.updateColumns(columns);
    }
  }

  componentDidMount() {
    const {store, pickerMode, loadType, loadDataOnce, perPage} = this.props;

    // 初始化分页
    let pagination = loadType && !!loadDataOnce;
    if (pagination) {
      store.changePage(store.page, perPage);
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
        qsparse(props.location.search.substring(1)),
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
        store.initFromScope(props.data, props.source);
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
  controlRef(control: any) {
    // 因为 control 有可能被 n 层 hoc 包裹。
    while (control && control.getWrappedInstance) {
      control = control.getWrappedInstance();
    }

    this.control = control;
  }

  initQuery(values: object) {
    const {store, orderBy, orderDir} = this.props;
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
      replaceQuery: this.props.initFetch !== false
    });

    // 保留一次用于重置查询条件
    store.setPristineQuery();
  }

  /**
   * 加载更多动作处理器
   */
  handleLoadMore() {
    this.getData(undefined, undefined, undefined, true);
  }

  /**
   * 发起一次新的查询，查询条件不同，需要从第一页数据加载
   */
  handleSearch(data: {
    query?: object; // 查询条件，没有将使用当前的
    resetQuery?: boolean;
    replaceQuery?: boolean;
  }) {
    const {store, syncLocation, env, pageField, perPageField} = this.props;
    let {query, resetQuery, replaceQuery} = data;

    query = syncLocation ? qsparse(qsstringify(query, undefined, true)) : query;

    store.updateQuery(
      resetQuery ? this.props.store.pristineQuery : query,
      syncLocation && env && env.updateLocation
        ? (location: any) => env.updateLocation(location, true)
        : undefined,
      pageField,
      perPageField,
      replaceQuery
    );

    this.lastQuery = store.query;
    this.getData(undefined, undefined, undefined);
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
  getData(
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
      loadDataOnceFetchOnFilter,
      source,
      columns
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

    const data = createObject(store.data, store.query);
    isEffectiveApi(api, data)
      ? store
          .fetchInitData(api, data, {
            successMessage: messages && messages.fetchSuccess,
            errorMessage: messages && messages.fetchFailed,
            autoAppend: true,
            forceReload,
            loadDataOnce,
            loadDataOnceFetchOnFilter,
            source,
            silent,
            pageField,
            perPageField,
            loadDataMode,
            syncResponse2Query,
            columns: store.columns ?? columns,
            isTableV2: true
          })
          .then(value => {
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
              (!stopAutoRefreshWhenModalIsOpen || !store.dialogOpen) &&
              (this.timer = setTimeout(
                this.getData.bind(this, silentPolling, undefined, true),
                Math.max(interval, 1000)
              ));
            return value;
          })
      : source && store.initFromScope(data, source);
  }

  @autobind
  handleChangePage(page: number, perPage?: number) {
    const {
      store,
      syncLocation,
      env,
      pageField,
      perPageField,
      autoJumpToTopOnPagerChange,
      affixOffsetTop
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

    this.getData();

    if (autoJumpToTopOnPagerChange && this.control) {
      (findDOMNode(this.control) as HTMLElement).scrollIntoView();
      const scrolledY = window.scrollY;
      const offsetTop = affixOffsetTop ?? env?.affixOffsetTop ?? 0;
      scrolledY && window.scroll(0, scrolledY - offsetTop);
    }
  }

  handleSave(
    rows: Array<object> | object,
    diff: Array<object> | object,
    indexes: Array<string>,
    unModifiedItems?: Array<any>,
    rowsOrigin?: Array<object> | object,
    resetOnFailed?: boolean
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
          reload && this.reloadTarget(reload, data);
          this.getData(undefined, undefined, true, true);
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
          reload && this.reloadTarget(reload, data);
          this.getData(undefined, undefined, true, true);
        })
        .catch(() => {
          resetOnFailed && this.control.reset();
        });
    }
  }

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
          reload && this.reloadTarget(reload, model);
          this.getData(undefined, undefined, true, true);
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

        ~idx2 && oldItems.splice(idx2, 1);
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

    store.updateSelectData(newItems, newUnSelectedItems);
    onSelect && onSelect(newItems);
  }

  /**
   * 表格列上的筛选触发
   */
  @autobind
  handleTableQuery(values: object, forceReload: boolean = false) {
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
    this.getData(undefined, undefined, undefined, forceReload);
  }

  reload(subpath?: string, query?: any) {
    if (query) {
      return this.receive(query);
    } else {
      this.getData(undefined, undefined, true, true);
    }
  }

  receive(values: object) {
    this.handleTableQuery(values, true);
  }

  @autobind
  doAction(action: Action, data: object, throwErrors: boolean = false) {
    if (
      action.actionType &&
      ~['stopAutoRefresh', 'reload', 'search', 'startAutoRefresh'].includes(
        action.actionType
      )
    ) {
      // @ts-ignore
      return this[`handle${upperFirst(action.actionType)}`](data);
    }
    // const {onAction, data: ctx} = this.props;
    // return this.props.onAction?.(
    //   undefined,
    //   action,
    //   ctx,
    //   throwErrors,
    //   undefined
    // );
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
  toggleToggle(toggled: boolean, index: number) {
    const {store} = this.props;

    store.updateColumns(
      store.columns.map((c: any, i: number) => ({
        ...c,
        toggled: index === i ? toggled : c.toggled !== false
      }))
    );
  }

  @autobind
  renderChild(region: string, schema: any, props: object = {}) {
    const {render, store} = this.props;

    // 覆盖所有分页组件
    const childProps = {
      activePage: store.page,
      lastPage: store.lastPage,
      perPage: store.perPage,
      total: store.total,
      onPageChange: this.handleChangePage,
      cols: store.columns, // 和grid的columns属性重复，ColumnsToggler的columns改一下名字 只有用store里的columns
      toggleAllColumns: this.toggleAllColumns,
      toggleToggle: this.toggleToggle
      // onAction: onAction
    };

    return render(region, schema, {
      ...props,
      // 包两层，主要是为了处理以下 case
      // 里面放了个 form，form 提交过来的时候不希望把 items 这些发送过来。
      // 因为会把数据呈现在地址栏上。
      data: createObject(
        createObject(store.filterData, store.getData(this.props.data)),
        {}
      ),
      render: this.renderChild,
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

  renderFilter(filter: SchemaObject[]) {
    if (!filter || filter.length === 0) {
      return null;
    }

    return filter.map((item, index) =>
      this.renderChild(`filter/${index}`, item, {
        key: index + '',
        onSubmit: (data: any) => this.handleSearch({query: data})
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
      translate: __
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
                <Html html={filter(labelTpl, item)} />
              ) : (
                getVariable(item, labelField || 'label') ||
                getVariable(item, primaryField || 'id')
              )}
            </span>
          </div>
        ))}
        <a onClick={this.clearSelection} className={cx('Crud-selectionClear')}>
          {__('clear')}
        </a>
      </div>
    );
  }

  render() {
    const {
      columns,
      className,
      bodyClassName,
      filter,
      render,
      store,
      mode = 'table-v2',
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
      ...rest
    } = this.props;

    return (
      <div
        className={cx('Crud2', className, {
          'is-loading': store.loading
        })}
      >
        <div className={cx('Crud2-filter')}>{this.renderFilter(filter)}</div>

        <div className={cx('Crud2-toolbar')}>
          {this.renderToolbar('headerToolbar', headerToolbar)}
        </div>

        {showSelection && keepItemSelectionOnPageChange && multiple !== false
          ? this.renderSelection()
          : null}

        {render(
          'body',
          {
            ...rest,
            type: mode,
            columns: mode.startsWith('table')
              ? store.columns || columns
              : undefined
          },
          {
            key: 'body',
            className: cx('Crud2-body', bodyClassName),
            ref: this.controlRef,
            autoGenerateFilter: !filter && autoGenerateFilter,
            autoFillHeight: autoFillHeight,
            checkAll: false, // 不使用组件的全选，因为不在工具栏里
            selectable: !!(selectable ?? pickerMode),
            itemActions,
            multiple: multiple,
            selected:
              pickerMode || keepItemSelectionOnPageChange
                ? store.selectedItemsAsArray
                : undefined,
            keepItemSelectionOnPageChange,
            maxKeepItemSelectionLength,
            valueField: valueField || primaryField,
            primaryField: primaryField,
            items: store.data.items,
            query: store.query,
            orderBy: store.query.orderBy,
            orderDir: store.query.orderDir,
            popOverContainer,
            onSave: this.handleSave,
            onSaveOrder: this.handleSaveOrder,
            onSearch: this.handleTableQuery,
            onSort: this.handleTableQuery,
            onSelect: this.handleSelect,
            data: store.mergedData,
            loading: store.loading
          }
        )}
        {/* spinner可以交给孩子处理 */}
        {/* <Spinner overlay size="lg" key="info" show={store.loading} /> */}

        <div className={cx('Crud2-toolbar')}>
          {this.renderToolbar('footerToolbar', footerToolbar)}
        </div>
      </div>
    );
  }
}

@Renderer({
  type: 'crud2',
  storeType: CRUDStore.name,
  isolateScope: true
})
export class CRUD2Renderer extends CRUD2 {
  static contextType = ScopedContext;

  constructor(props: CRUD2Props, context: IScopedContext) {
    super(props);

    const scoped = context;
    scoped.registerComponent(this);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    const scoped = this.context as IScopedContext;
    scoped.unRegisterComponent(this);
  }

  reload(subpath?: string, query?: any, ctx?: any) {
    const scoped = this.context as IScopedContext;
    if (subpath) {
      return scoped.reload(
        query ? `${subpath}?${qsstringify(query)}` : subpath,
        ctx
      );
    }

    return super.reload(subpath, query);
  }

  receive(values: any, subPath?: string) {
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
