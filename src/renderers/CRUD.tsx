import React from 'react';
import {saveAs} from 'file-saver';
import PropTypes from 'prop-types';
import {Renderer, RendererProps} from '../factory';
import {
  SchemaNode,
  Schema,
  Action,
  Api,
  ApiObject,
  PlainObject
} from '../types';
import {CRUDStore, ICRUDStore} from '../store/crud';
import {
  createObject,
  extendObject,
  anyChanged,
  isObjectShallowModified,
  noop,
  isVisible,
  getVariable,
  qsstringify
} from '../utils/helper';
import {observer} from 'mobx-react';
import partition from 'lodash/partition';
import Scoped, {ScopedContext, IScopedContext} from '../Scoped';
import Button from '../components/Button';
import Select from '../components/Select';
import getExprProperties from '../utils/filter-schema';
import pick from 'lodash/pick';
import qs from 'qs';
import {findDOMNode} from 'react-dom';
import {evalExpression, filter} from '../utils/tpl';
import {isValidApi, buildApi, isEffectiveApi} from '../utils/api';
import omit from 'lodash/omit';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import Html from '../components/Html';
import {Spinner} from '../components';
import {Icon} from '../components/icons';
import {
  BaseSchema,
  SchemaApi,
  SchemaClassName,
  SchemaCollection,
  SchemaExpression,
  SchemaMessage,
  SchemaName,
  SchemaObject,
  SchemaTokenizeableString,
  SchemaTpl
} from '../Schema';
import {ActionSchema} from './Action';
import {CardsSchema} from './Cards';
import {ListSchema} from './List';
import {TableSchema} from './Table';

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

export interface CRUDCommonSchema extends BaseSchema {
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
   * 批量操作
   */
  bulkActions?: Array<ActionSchema>;

  /**
   * 单条操作
   */
  itemActions?: Array<ActionSchema>;

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
  filterTogglable?: boolean;
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
   * 在开启loadDataOnce时，filter时是否去重新请求api
   */
  loadDataOnceFetchOnFilter?: boolean;

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
}

export type CRUDCardsSchema = CRUDCommonSchema & {
  mode: 'cards';
} & Omit<CardsSchema, 'type'>;

export type CRUDListSchema = CRUDCommonSchema & {
  mode: 'list';
} & Omit<ListSchema, 'type'>;

export type CRUDTableSchem = CRUDCommonSchema & {
  mode?: 'table';
} & Omit<TableSchema, 'type'>;

/**
 * CRUD 增删改查渲染器。
 * 文档：https://baidu.gitee.io/amis/docs/components/crud
 */
export type CRUDSchema = CRUDCardsSchema | CRUDListSchema | CRUDTableSchem;

export interface CRUDProps extends RendererProps, CRUDCommonSchema {
  store: ICRUDStore;
  pickerMode?: boolean; // 选择模式，用做表单中的选择操作
}

export default class CRUD extends React.Component<CRUDProps, any> {
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
    'onSaved'
  ];
  static defaultProps = {
    toolbarInline: true,
    headerToolbar: ['bulkActions', 'pagination'],
    footerToolbar: ['statistics', 'pagination'],
    primaryField: 'id',
    syncLocation: true,
    pageField: 'page',
    perPageField: 'perPage',
    hideQuickSaveBtn: false,
    autoJumpToTopOnPagerChange: true,
    silentPolling: false,
    filterTogglable: false,
    filterDefaultVisible: true,
    loadDataOnce: false,
    loadDataOnceFetchOnFilter: true
  };

  control: any;
  lastQuery: any;
  dataInvalid: boolean = false;
  timer: NodeJS.Timeout;
  mounted: boolean;
  constructor(props: CRUDProps) {
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
  }

  componentWillMount() {
    const {
      location,
      store,
      pageField,
      perPageField,
      syncLocation,
      loadDataOnce
    } = this.props;

    this.mounted = true;

    if (syncLocation && location && (location.query || location.search)) {
      store.updateQuery(
        qs.parse(location.search.substring(1)),
        undefined,
        pageField,
        perPageField
      );
    } else if (syncLocation && !location && window.location.search) {
      store.updateQuery(
        qs.parse(window.location.search.substring(1)) as object,
        undefined,
        pageField,
        perPageField
      );
    }

    this.props.store.setFilterTogglable(
      !!this.props.filterTogglable,
      this.props.filterDefaultVisible
    );
  }

  componentDidMount() {
    const store = this.props.store;

    if (!this.props.filter || (store.filterTogggable && !store.filterVisible)) {
      this.handleFilterInit({});
    }

    if (this.props.pickerMode && this.props.value) {
      store.setSelectedItems(this.props.value);
    }
  }

  componentWillReceiveProps(nextProps: CRUDProps) {
    const props = this.props;
    const store = props.store;

    if (
      anyChanged(
        ['toolbar', 'headerToolbar', 'footerToolbar', 'bulkActions'],
        props,
        nextProps
      )
    ) {
      // 来点参数变化。
      this.renderHeaderToolbar = this.renderHeaderToolbar.bind(this);
      this.renderFooterToolbar = this.renderFooterToolbar.bind(this);
    }

    if (this.props.pickerMode && this.props.value !== nextProps.value) {
      store.setSelectedItems(nextProps.value);
    }

    if (this.props.filterTogglable !== nextProps.filterTogglable) {
      store.setFilterTogglable(
        !!nextProps.filterTogglable,
        nextProps.filterDefaultVisible
      );
    }

    if (
      props.syncLocation &&
      props.location &&
      props.location.search !== nextProps.location.search
    ) {
      // 同步地址栏，那么直接检测 query 是否变了，变了就重新拉数据
      store.updateQuery(
        qs.parse(nextProps.location.search.substring(1)),
        undefined,
        nextProps.pageField,
        nextProps.perPageField
      );
      this.dataInvalid = isObjectShallowModified(
        store.query,
        this.lastQuery,
        false
      );
    } else if (!props.syncLocation && props.api && nextProps.api) {
      // 如果不同步地址栏，则直接看api上是否绑定参数，结果变了就重新刷新。
      let prevApi = buildApi(props.api, props.data as object, {
        ignoreData: true
      });
      let nextApi = buildApi(nextProps.api, nextProps.data as object, {
        ignoreData: true
      });

      if (
        prevApi.url !== nextApi.url &&
        isValidApi(nextApi.url) &&
        (!nextApi.sendOn || evalExpression(nextApi.sendOn, nextProps.data))
      ) {
        this.dataInvalid = true;
      }
    }
  }

  componentDidUpdate() {
    if (this.dataInvalid) {
      this.dataInvalid = false;
      this.search();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    clearTimeout(this.timer);
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
    action: Action,
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

    if (action.actionType === 'dialog') {
      store.setCurrentAction(action);
      const idx: number = (ctx as any).index;
      const length = store.items.length;
      stopAutoRefreshWhenModalIsOpen && clearTimeout(this.timer);
      store.openDialog(ctx, {
        hasNext: idx < length - 1,
        nextIndex: idx + 1,
        hasPrev: idx > 0,
        prevIndex: idx - 1,
        index: idx
      });
    } else if (action.actionType === 'ajax') {
      store.setCurrentAction(action);
      const data = ctx;

      // 由于 ajax 一段时间后再弹出，肯定被浏览器给阻止掉的，所以提前弹。
      const redirect = action.redirect && filter(action.redirect, data);
      redirect && action.blank && env.jumpTo(redirect, action);

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
          redirect && !action.blank && env.jumpTo(redirect, action);
          action.reload
            ? this.reloadTarget(action.reload, data)
            : redirect
            ? null
            : this.search(undefined, undefined, true, true);
          action.close && this.closeTarget(action.close);
        })
        .catch(() => {});
    } else if (
      pickerMode &&
      (action.actionType === 'confirm' || action.actionType === 'submit')
    ) {
      store.setCurrentAction(action);
      return Promise.resolve({
        items: store.selectedItems.concat()
      });
    } else {
      onAction(e, action, ctx, throwErrors, delegate || this.context);
    }
  }

  handleBulkAction(
    selectedItems: Array<any>,
    unSelectedItems: Array<any>,
    e: React.UIEvent<any>,
    action: Action
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

    const ctx = createObject(store.mergedData, {
      ...selectedItems[0],
      rows: selectedItems,
      items: selectedItems,
      unSelectedItems: unSelectedItems,
      ids
    });

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
              ? this.reloadTarget(action.reload, data)
              : this.search({[pageField || 'page']: 1}, undefined, true, true);
            action.close && this.closeTarget(action.close);

            const redirect = action.redirect && filter(action.redirect, data);
            redirect && env.jumpTo(redirect, action);
          })
          .catch(() => null);
    } else if (onAction) {
      onAction(e, action, ctx, false, this.context);
    }
  }

  handleItemAction(action: Action, ctx: any) {
    this.doAction(action, ctx);
  }

  handleFilterInit(values: object) {
    const {defaultParams, data, store} = this.props;

    this.handleFilterSubmit(
      {
        ...defaultParams,
        ...values,
        ...store.query
      },
      false,
      true,
      this.props.initFetch !== false
    );

    store.setPristineQuery();

    const {pickerMode, options} = this.props;

    pickerMode &&
      store.updateData({
        items: options || []
      });
  }

  handleFilterReset(values: object) {
    const {store, syncLocation, env, pageField, perPageField} = this.props;

    store.updateQuery(
      store.pristineQuery,
      syncLocation && env && env.updateLocation
        ? (location: any) => env.updateLocation(location)
        : undefined,
      pageField,
      perPageField,
      true
    );
    this.lastQuery = store.query;
    this.search();
  }

  handleFilterSubmit(
    values: object,
    jumpToFirstPage: boolean = true,
    replaceLocation: boolean = false,
    search: boolean = true
  ) {
    const {
      store,
      syncLocation,
      env,
      pageField,
      perPageField,
      loadDataOnceFetchOnFilter
    } = this.props;
    values = syncLocation ? qs.parse(qsstringify(values)) : values;

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
      this.search(undefined, undefined, undefined, loadDataOnceFetchOnFilter);
  }

  handleBulkGo(
    selectedItems: Array<any>,
    unSelectedItems: Array<any>,
    e: React.MouseEvent<any>
  ) {
    const action = this.props.store.selectedAction;
    const env = this.props.env;

    if (action.confirmText) {
      return env
        .confirm(action.confirmText)
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
    action: Action,
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

    store.closeDialog();
    const dialogAction = store.action as Action;

    if (stopAutoRefreshWhenModalIsOpen && interval) {
      this.timer = setTimeout(
        silentPolling ? this.silentSearch : this.search,
        Math.max(interval, 3000)
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
          // 配置了 reload 则跳过自动更新。
          dialogAction.reload ||
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

    if (dialogAction.reload) {
      this.reloadTarget(dialogAction.reload, ctx);
    }

    const redirect = dialogAction.redirect && filter(action.redirect, ctx);
    redirect && env.jumpTo(redirect, dialogAction);
  }

  handleDialogClose() {
    const {
      store,
      stopAutoRefreshWhenModalIsOpen,
      silentPolling,
      interval
    } = this.props;
    store.closeDialog();

    if (stopAutoRefreshWhenModalIsOpen && interval) {
      this.timer = setTimeout(
        silentPolling ? this.silentSearch : this.search,
        Math.max(interval, 3000)
      );
    }
  }

  openFeedback(dialog: any, ctx: any) {
    return new Promise(resolve => {
      const {store} = this.props;
      store.setCurrentAction({
        type: 'button',
        actionType: 'dialog',
        dialog: dialog
      });
      store.openDialog(ctx, undefined, confirmed => {
        resolve(confirmed);
      });
    });
  }

  search(
    values?: any,
    silent?: boolean,
    clearSelection?: boolean,
    forceReload = false
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
      keepItemSelectionOnPageChange,
      pickerMode,
      env,
      loadDataOnce,
      loadDataOnceFetchOnFilter,
      source
    } = this.props;

    // reload 需要清空用户选择。
    if (keepItemSelectionOnPageChange && clearSelection && !pickerMode) {
      store.setSelectedItems([]);
      store.setUnSelectedItems([]);
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
            syncResponse2Query
          })
          .then(value => {
            interval &&
              this.mounted &&
              (!stopAutoRefreshWhen ||
                !(
                  (stopAutoRefreshWhenModalIsOpen && store.hasModalOpened) ||
                  evalExpression(stopAutoRefreshWhen, data)
                )) &&
              (this.timer = setTimeout(
                silentPolling
                  ? this.silentSearch.bind(this, undefined, undefined, true)
                  : this.search.bind(
                      this,
                      undefined,
                      undefined,
                      undefined,
                      true
                    ),
                Math.max(interval, 3000)
              ));
            return value;
          })
      : source && store.initFromScope(data, source);
  }

  silentSearch(values?: object, clearSelection?: boolean, forceReload = false) {
    return this.search(values, true, clearSelection, forceReload);
  }

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

    this.search(undefined, undefined, undefined);

    if (autoJumpToTopOnPagerChange && this.control) {
      (findDOMNode(this.control) as HTMLElement).scrollIntoView();
      const scrolledY = window.scrollY;
      const offsetTop = affixOffsetTop ?? env?.affixOffsetTop ?? 50;
      scrolledY && window.scroll(0, scrolledY - offsetTop);
    }
  }

  handleSave(
    rows: Array<object> | object,
    diff: Array<object> | object,
    indexes: Array<number>,
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
        env && env.alert('CRUD quickSaveApi is required!');
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
          this.search(undefined, undefined, true, true);
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
          this.search(undefined, undefined, true, true);
        })
        .catch(() => {
          resetOnFailed && this.control.reset();
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
      reload
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
          this.search(undefined, undefined, true, true);
        })
        .catch(() => {});
  }

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
      newUnSelectedItems.push(...newItems.splice(0, newItems.length - 1));
    }

    store.setSelectedItems(newItems);
    store.setUnSelectedItems(newUnSelectedItems);
    onSelect && onSelect(newItems);
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
    const {
      stopAutoRefreshWhenModalIsOpen,
      silentPolling,
      interval
    } = this.props;

    if (popOver && ~['dialog', 'drawer'].indexOf(popOver.mode)) {
      this.props.store.setInnerModalOpened(false);

      if (stopAutoRefreshWhenModalIsOpen && interval) {
        this.timer = setTimeout(
          silentPolling ? this.silentSearch : this.search,
          Math.max(interval, 3000)
        );
      }
    }
  }

  handleQuery(values: object, forceReload: boolean = false) {
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
    this.search(undefined, undefined, undefined, forceReload);
  }

  reload(subpath?: string, query?: any) {
    if (query) {
      return this.receive(query);
    } else {
      this.search(undefined, undefined, true, true);
    }
  }

  receive(values: object) {
    this.handleQuery(values, true);
  }

  reloadTarget(target: string, data: any) {
    // implement this.
  }

  closeTarget(target: string) {
    // implement this.
  }

  doAction(action: Action, data: object, throwErrors: boolean = false) {
    return this.handleAction(undefined, action, data, throwErrors);
  }

  unSelectItem(item: any, index: number) {
    const {store} = this.props;
    const selected = store.selectedItems.concat();
    const unSelected = store.unSelectedItems.concat();

    const idx = selected.indexOf(item);
    ~idx && unSelected.push(...selected.splice(idx, 1));

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

    if (
      (!bulkActions || !bulkActions.length) &&
      (!itemActions || !itemActions.length)
    ) {
      return false;
    }

    let bulkBtns: Array<ActionSchema> = [];
    let itemBtns: Array<ActionSchema> = [];
    const ctx = store.mergedData;

    if (bulkActions && bulkActions.length) {
      bulkBtns = bulkActions
        .map(item => ({
          ...item,
          ...getExprProperties(item as Schema, ctx)
        }))
        .filter(item => !item.hidden && item.visible !== false);
    }

    const itemData = createObject(
      store.data,
      store.selectedItems.length ? store.selectedItems[0] : {}
    );

    if (itemActions && itemActions.length) {
      itemBtns = itemActions
        .map(item => ({
          ...item,
          ...getExprProperties(item as Schema, itemData)
        }))
        .filter(item => !item.hidden && item.visible !== false);
    }

    return bulkBtns.length || itemBtns.length;
  }

  renderBulkActions(childProps: any) {
    let {bulkActions, itemActions, store, render, classnames: cx} = this.props;

    const items = childProps.items;

    if (
      !items.length ||
      ((!bulkActions || !bulkActions.length) &&
        (!itemActions || !itemActions.length))
    ) {
      return null;
    }

    const selectedItems = store.selectedItems;
    const unSelectedItems = store.unSelectedItems;

    let bulkBtns: Array<ActionSchema> = [];
    let itemBtns: Array<ActionSchema> = [];

    const ctx = store.mergedData;

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

    if (itemActions && selectedItems.length === 1) {
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
              size: 'sm',
              ...omit(btn, ['visibleOn', 'hiddenOn', 'disabledOn']),
              type: 'button'
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
              size: 'sm',
              ...omit(btn, ['visibleOn', 'hiddenOn', 'disabledOn']),
              type: 'button'
            },
            {
              key: `item-${index}`,
              data: itemData,
              disabled: btn.disabled,
              onAction: this.handleItemAction.bind(this, btn, itemData)
            }
          )
        )}
      </div>
    ) : null;
  }

  renderPagination() {
    const {store, render, classnames: cx} = this.props;

    const {page, lastPage} = store;

    if (store.mode !== 'simple' && store.lastPage < 2) {
      return null;
    }

    return (
      <div className={cx('Crud-pager')}>
        {render(
          'pagination',
          {
            type: 'pagination'
          },
          {
            activePage: page,
            items: lastPage,
            hasNext: store.hasNext,
            mode: store.mode,
            onPageChange: this.handleChangePage
          }
        )}
      </div>
    );
  }

  renderStatistics() {
    const {store, classnames: cx, translate: __} = this.props;

    if (store.lastPage <= 1) {
      return null;
    }

    return (
      <div className={cx('Crud-statistics')}>
        {__('{{page}}/{{lastPage}} 总共：{{total}} 项。', {
          page: store.page,
          lastPage: store.lastPage,
          total: store.total
        })}
      </div>
    );
  }

  renderSwitchPerPage(childProps: any) {
    const {
      store,
      perPageAvailable,
      classnames: cx,
      classPrefix: ns,
      translate: __
    } = this.props;

    const items = childProps.items;

    if (!items.length) {
      return null;
    }

    const perPages = (perPageAvailable || [5, 10, 20, 50, 100]).map(
      (item: any) => ({
        label: item,
        value: item + ''
      })
    );

    return (
      <div className={cx('Crud-pageSwitch')}>
        {__('每页显示')}
        <Select
          classPrefix={ns}
          searchable={false}
          placeholder={__('请选择')}
          options={perPages}
          value={store.perPage + ''}
          onChange={(value: any) => this.handleChangePage(1, value.value)}
          clearable={false}
        />
      </div>
    );
  }

  renderLoadMore() {
    const {store, classPrefix: ns, classnames: cx, translate: __} = this.props;
    const {page, lastPage} = store;

    return page < lastPage ? (
      <div className={cx('Crud-loadMore')}>
        <Button
          classPrefix={ns}
          onClick={() =>
            this.search({page: page + 1, loadDataMode: 'load-more'})
          }
          size="sm"
        >
          {__('加载更多')}
        </Button>
      </div>
    ) : (
      ''
    );
  }

  renderFilterToggler() {
    const {store, classnames: cx, translate: __} = this.props;

    if (!store.filterTogggable) {
      return null;
    }

    return (
      <button
        onClick={() => store.setFilterVisible(!store.filterVisible)}
        className={cx('Button Button--sm Button--default', {
          'is-active': store.filterVisible
        })}
      >
        <Icon icon="filter" className="icon m-r-xs" />
        {__('筛选')}
      </button>
    );
  }

  renderExportCSV() {
    const {store, classPrefix: ns, classnames: cx, translate: __} = this.props;

    return (
      <Button
        classPrefix={ns}
        onClick={() => {
          import('papaparse').then((papaparse: any) => {
            const csvText = papaparse.unparse(store.data.items);
            if (csvText) {
              const blob = new Blob([csvText], {
                type: 'text/plain;charset=utf-8'
              });
              saveAs(blob, 'data.csv');
            }
          });
        }}
        size="sm"
      >
        {__('导出 CSV')}
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

    const type = (toolbar as Schema).type || toolbar;

    if (type === 'bulkActions' || type === 'bulk-actions') {
      return this.renderBulkActions(childProps);
    } else if (type === 'pagination') {
      return this.renderPagination();
    } else if (type === 'statistics') {
      return this.renderStatistics();
    } else if (type === 'switch-per-page') {
      return this.renderSwitchPerPage(childProps);
    } else if (type === 'load-more') {
      return this.renderLoadMore();
    } else if (type === 'filter-toggler') {
      return this.renderFilterToggler();
    } else if (type === 'export-csv') {
      return this.renderExportCSV();
    } else if (Array.isArray(toolbar)) {
      const children: Array<any> = toolbar
        .map((toolbar, index) => ({
          dom: this.renderToolbar(toolbar, index, childProps, toolbarRenderer),
          toolbar
        }))
        .filter(item => item.dom);
      const len = children.length;
      const cx = this.props.classnames;
      if (len) {
        return (
          <div className={cx('Crud-toolbar')} key={index}>
            {children.map(({toolbar, dom: child}, index) => {
              const type = (toolbar as Schema).type || toolbar;
              let align =
                toolbar.align ||
                (type === 'pagination' || (index === len - 1 && index > 0)
                  ? 'right'
                  : index < len - 1
                  ? 'left'
                  : '');

              return (
                <div
                  key={index}
                  className={cx(
                    'Crud-toolbar-item',
                    align ? `Crud-toolbar-item--${align}` : '',
                    toolbar.className
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

    const {render, store} = this.props;
    const $$editable = childProps.$$editable;

    return render(`toolbar/${index}`, toolbar, {
      // 包两层，主要是为了处理以下 case
      // 里面放了个 form，form 提交过来的时候不希望把 items 这些发送过来。
      // 因为会把数据呈现在地址栏上。
      data: createObject(
        createObject(store.filterData, {
          items: childProps.items,
          selectedItems: childProps.selectedItems,
          unSelectedItems: childProps.unSelectedItems
        }),
        {}
      ),
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
          ? headerToolbar.concat(toolbar)
          : [headerToolbar, toolbar];
      } else if (headerToolbar) {
        headerToolbar = [headerToolbar, toolbar];
      } else {
        headerToolbar = toolbar;
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
        footerToolbar = toolbarInline
          ? footerToolbar.concat(toolbar)
          : [footerToolbar, toolbar];
      } else if (footerToolbar) {
        footerToolbar = [footerToolbar, toolbar];
      } else {
        footerToolbar = toolbar;
      }
    }

    return this.renderToolbar(footerToolbar, 0, childProps, toolbarRenderer);
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
        <div className={cx('Crud-selectionLabel')}>已选条目：</div>
        {store.selectedItems.map((item, index) => (
          <div key={index} className={cx(`Crud-value`)}>
            <span
              data-tooltip={__('删除')}
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
          {__('清空')}
        </a>
      </div>
    );
  }

  render() {
    const {
      className,
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
      valueField,
      primaryField,
      value,
      hideQuickSaveBtn,
      itemActions,
      classnames: cx,
      keepItemSelectionOnPageChange,
      onAction,
      popOverContainer,
      translate: __,
      ...rest
    } = this.props;

    return (
      <div
        className={cx('Crud', className, {
          'is-loading': store.loading
        })}
      >
        {filter && (!store.filterTogggable || store.filterVisible)
          ? render(
              'filter',
              {
                title: __('条件过滤'),
                mode: 'inline',
                submitText: __('搜索'),
                ...filter,
                type: 'form',
                api: null
              },
              {
                key: 'filter',
                data: store.filterData,
                onReset: this.handleFilterReset,
                onSubmit: this.handleFilterSubmit,
                onInit: this.handleFilterInit
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
            type: mode || 'table'
          },
          {
            key: 'body',
            className: cx('Crud-body', bodyClassName),
            ref: this.controlRef,
            selectable: !!(
              (this.hasBulkActionsToolbar() && this.hasBulkActions()) ||
              pickerMode
            ),
            itemActions,
            multiple:
              multiple === void 0
                ? bulkActions && bulkActions.length > 0
                  ? true
                  : false
                : multiple,
            selected:
              pickerMode || keepItemSelectionOnPageChange
                ? store.selectedItemsAsArray
                : undefined,
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
            headerToolbarRender: this.renderHeaderToolbar,
            footerToolbarRender: this.renderFooterToolbar,
            data: store.mergedData
          }
        )}

        <Spinner overlay size="lg" key="info" show={store.loading} />

        {render(
          'dialog',
          {
            ...((store.action as Action) &&
              ((store.action as Action).dialog as object)),
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

@Renderer({
  test: /(^|\/)crud$/,
  storeType: CRUDStore.name,
  name: 'crud'
})
export class CRUDRenderer extends CRUD {
  static contextType = ScopedContext;

  componentWillMount() {
    super.componentWillMount();

    const scoped = this.context as IScopedContext;
    scoped.registerComponent(this);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    const scoped = this.context as IScopedContext;
    scoped.unRegisterComponent(this);
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
