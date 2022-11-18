import React from 'react';
import extend from 'lodash/extend';
import cloneDeep from 'lodash/cloneDeep';
import {Renderer, RendererProps} from 'amis-core';
import {ServiceStore, IServiceStore} from 'amis-core';
import {Api, RendererData, ActionObject} from 'amis-core';
import {filter, evalExpression} from 'amis-core';
import {ScopedContext, IScopedContext} from 'amis-core';
import {
  buildApi,
  isApiOutdated,
  isEffectiveApi,
  str2AsyncFunction
} from 'amis-core';
import {Spinner} from 'amis-ui';
import {
  autobind,
  isObject,
  isEmpty,
  isObjectShallowModified,
  isVisible,
  qsstringify,
  createObject
} from 'amis-core';
import {
  BaseSchema,
  SchemaApi,
  SchemaCollection,
  SchemaExpression,
  SchemaMessage,
  SchemaName
} from '../Schema';
import {IIRendererStore} from 'amis-core';

import type {ListenerAction} from 'amis-core';
import type {ScopedComponentType} from 'amis-core/lib/Scoped';

export const eventTypes = [
  /* 初始化时执行，默认 */
  'inited',
  /* API请求调用成功之后执行 */
  'onApiFetched',
  /* Schema API请求调用成功之后执行 */
  'onSchemaApiFetched',
  /* WebSocket调用成功后执行 */
  'onWsFetched'
] as const;

export type ProviderEventType = typeof eventTypes[number];

export type DataProviderCollection = Partial<
  Record<ProviderEventType, DataProvider>
>;

export type DataProvider = string | Function;

export type ComposedDataProvider = DataProvider | DataProviderCollection;

/**
 * Service 服务类控件。
 * 文档：https://baidu.gitee.io/amis/docs/components/service
 */
export interface ServiceSchema extends BaseSchema {
  /**
   * 指定为 Service 数据拉取控件。
   */
  type: 'service';

  /**
   * 页面初始化的时候，可以设置一个 API 让其取拉取，发送数据会携带当前 data 数据（包含地址栏参数），获取得数据会合并到 data 中，供组件内使用。
   */
  api?: SchemaApi;

  /**
   * WebScocket 地址，用于实时获取数据
   */
  ws?: string;

  /**
   * 通过调用外部函数来获取数据
   */
  dataProvider?: ComposedDataProvider;

  /**
   * 内容区域
   */
  body?: SchemaCollection;

  /**
   * @deprecated 改成 api 的 sendOn。
   */
  fetchOn?: SchemaExpression;

  /**
   * 是否默认就拉取？
   */
  initFetch?: boolean;

  /**
   * 是否默认就拉取？通过表达式来决定.
   *
   * @deprecated 改成 api 的 sendOn。
   */
  initFetchOn?: SchemaExpression;

  /**
   * 用来获取远程 Schema 的 api
   */
  schemaApi?: SchemaApi;

  /**
   * 是否默认加载 schemaApi
   */
  initFetchSchema?: boolean;

  /**
   * 用表达式来配置。
   * @deprecated 改成 api 的 sendOn。
   */
  initFetchSchemaOn?: SchemaExpression;

  /**
   * 是否轮询拉取
   */
  interval?: number;

  /**
   * 是否静默拉取
   */
  silentPolling?: boolean;

  /**
   * 关闭轮询的条件。
   */
  stopAutoRefreshWhen?: SchemaExpression;

  messages?: SchemaMessage;

  name?: SchemaName;
}

export interface ServiceProps
  extends RendererProps,
    Omit<ServiceSchema, 'type' | 'className'> {
  store: IServiceStore;
  messages: SchemaMessage;
}
export default class Service extends React.Component<ServiceProps> {
  timer: ReturnType<typeof setTimeout>;
  mounted: boolean;

  // 主要是用于关闭 socket
  socket: any;

  /* provider函数集 */
  dataProviders: DataProviderCollection;

  /* 待销毁provider函数集 */
  dataProviderUnsubscribe?: Partial<Record<ProviderEventType, Function>>;

  static defaultProps: Partial<ServiceProps> = {
    messages: {
      fetchFailed: 'fetchFailed'
    }
  };

  static propsList: Array<string> = [];

  constructor(props: ServiceProps) {
    super(props);

    this.dataProviders = this.initDataProviders(props.dataProvider);
    this.handleQuery = this.handleQuery.bind(this);
    this.handleAction = this.handleAction.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.reload = this.reload.bind(this);
    this.silentReload = this.silentReload.bind(this);
    this.initInterval = this.initInterval.bind(this);
    this.afterDataFetch = this.afterDataFetch.bind(this);
    this.afterSchemaFetch = this.afterSchemaFetch.bind(this);
    this.runDataProvider = this.runDataProvider.bind(this);
    this.dataProviderSetData = this.dataProviderSetData.bind(this);
  }

  async componentDidMount() {
    const {data, dispatchEvent} = this.props;
    this.mounted = true;
    const rendererEvent = await dispatchEvent('init', data, this);

    if (rendererEvent?.prevented) {
      return;
    }

    this.initFetch();
  }

  componentDidUpdate(prevProps: ServiceProps) {
    const props = this.props;
    const store = props.store;
    const {fetchSuccess, fetchFailed} = props.messages!;

    if (props.dataProvider !== prevProps.dataProvider) {
      /* 重新构建provider函数 */
      this.dataProviders = this.initDataProviders(props.dataProvider);

      if (this.dataProviders && this.dataProviders?.inited) {
        this.runDataProvider('inited');
      }
    }

    isApiOutdated(prevProps.api, props.api, prevProps.data, props.data) &&
      store
        .fetchData(props.api as Api, store.data, {
          successMessage: fetchSuccess,
          errorMessage: fetchFailed
        })
        .then(res => {
          this.runDataProvider('onApiFetched');
          this.afterDataFetch(res);
        });

    isApiOutdated(
      prevProps.schemaApi,
      props.schemaApi,
      prevProps.data,
      props.data
    ) &&
      store
        .fetchSchema(props.schemaApi as Api, store.data, {
          successMessage: fetchSuccess,
          errorMessage: fetchFailed
        })
        .then(res => {
          this.runDataProvider('onSchemaApiFetched');
          this.afterSchemaFetch(res);
        });

    if (props.ws && prevProps.ws !== props.ws) {
      if (this.socket) {
        this.socket.close();
      }
      this.socket = this.fetchWSData(props.ws, store.data);
    }

    if (isObjectShallowModified(prevProps.defaultData, props.defaultData)) {
      store.reInitData(props.defaultData);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    this.runDataProviderUnsubscribe();
    clearTimeout(this.timer);
    if (this.socket && this.socket.close) {
      this.socket.close();
    }
  }

  doAction(action: ListenerAction, args: any) {
    if (action?.actionType === 'rebuild') {
      const {
        schemaApi,
        store,
        dataProvider,
        messages: {fetchSuccess, fetchFailed}
      } = this.props;

      store.updateData(args);
      clearTimeout(this.timer);
      if (isEffectiveApi(schemaApi, store.data)) {
        store
          .fetchSchema(schemaApi, store.data, {
            successMessage: fetchSuccess,
            errorMessage: fetchFailed
          })
          .then(this.afterSchemaFetch);
      }

      if (dataProvider) {
        this.runDataProvider('inited');
      }
    }
  }

  @autobind
  initFetch() {
    const {
      schemaApi,
      initFetchSchema,
      api,
      ws,
      initFetch,
      initFetchOn,
      dataProvider,
      store,
      messages: {fetchSuccess, fetchFailed}
    } = this.props;

    if (isEffectiveApi(schemaApi, store.data, initFetchSchema)) {
      store
        .fetchSchema(schemaApi, store.data, {
          successMessage: fetchSuccess,
          errorMessage: fetchFailed
        })
        .then(res => {
          this.runDataProvider('onSchemaApiFetched');
          this.afterSchemaFetch(res);
        });
    }

    if (isEffectiveApi(api, store.data, initFetch, initFetchOn)) {
      store
        .fetchInitData(api, store.data, {
          successMessage: fetchSuccess,
          errorMessage: fetchFailed
        })
        .then(res => {
          this.runDataProvider('onApiFetched');
          this.afterDataFetch(res);
        });
    }

    if (ws) {
      this.socket = this.fetchWSData(ws, store.data);
    }

    if (dataProvider) {
      this.runDataProvider('inited');
    }
  }

  /**
   * 初始化Provider函数集，将Schema配置统一转化为DataProviderCollection格式
   */
  @autobind
  initDataProviders(provider?: ComposedDataProvider) {
    const dataProvider = cloneDeep(provider);
    let fnCollection: DataProviderCollection = {};

    if (dataProvider) {
      if (typeof dataProvider === 'object' && isObject(dataProvider)) {
        Object.keys(dataProvider).forEach((event: ProviderEventType) => {
          const normalizedProvider = this.normalizeProvider(
            dataProvider[event],
            event
          );

          fnCollection = extend(fnCollection, normalizedProvider || {});
        });
      } else {
        const normalizedProvider = this.normalizeProvider(
          dataProvider,
          'inited'
        );

        fnCollection = extend(fnCollection, normalizedProvider || {});
      }
    }

    return fnCollection;
  }

  /**
   * 标准化处理Provider函数
   */
  @autobind
  normalizeProvider(
    provider: any,
    event: ProviderEventType = 'inited'
  ): DataProviderCollection | null {
    if (!~eventTypes.indexOf(event)) {
      return null;
    }

    if (typeof provider === 'function') {
      return {[event]: provider};
    } else if (typeof provider === 'string') {
      const asyncFn = str2AsyncFunction(provider, 'data', 'setData', 'env');

      return asyncFn
        ? {
            [event]: asyncFn
          }
        : null;
    }

    return null;
  }

  /**
   * 使用外部函数获取数据
   *
   * @param {ProviderEventType} event 触发provider函数执行的事件，默认初始时执行
   */
  async runDataProvider(event: ProviderEventType) {
    this.runDataProviderUnsubscribe(event);
    /** 这里的store应该是更新data后的，不需要再merge api的数据了 */
    const {store} = this.props;
    const dataProviders = this.dataProviders;

    if (dataProviders && ~eventTypes.indexOf(event)) {
      const fn = dataProviders[event];

      if (fn && typeof fn === 'function') {
        const unsubscribe = await fn(
          store.data,
          this.dataProviderSetData,
          this.props.env
        );
        if (typeof unsubscribe === 'function') {
          if (!this.dataProviderUnsubscribe) {
            this.dataProviderUnsubscribe = {};
          }

          this.dataProviderUnsubscribe[event] = unsubscribe;
        }
      }
    }
  }

  /**
   * 运行销毁外部函数的方法
   *
   * @param {ProviderEventType} event 事件名称，不传参数即执行所有销毁函数
   */
  runDataProviderUnsubscribe(event?: ProviderEventType) {
    const dataProviderUnsubscribe = this.dataProviderUnsubscribe;

    if (!dataProviderUnsubscribe) {
      return;
    }

    if (event) {
      const disposedFn = dataProviderUnsubscribe[event];

      try {
        if (disposedFn && typeof disposedFn === 'function') {
          disposedFn();
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      Object.keys(dataProviderUnsubscribe)?.forEach(
        (event: ProviderEventType) => {
          const disposedFn = dataProviderUnsubscribe[event];

          try {
            if (disposedFn && typeof disposedFn === 'function') {
              disposedFn();
            }
          } catch (error) {
            console.error(error);
          }
        }
      );
    }
  }

  // 外部函数回调更新数据
  dataProviderSetData(data: any) {
    if (!this.mounted) {
      return;
    }
    const {store} = this.props;
    store.updateData(data, undefined, false);
    store.setHasRemoteData();
  }

  // 使用 websocket 获取使用，因为有异步所以放这里而不是 store 实现
  fetchWSData(ws: string | Api, data: any) {
    const {env, store} = this.props;
    const wsApi = buildApi(ws, data);

    env.wsFetcher(
      wsApi,
      (data: any) => {
        let returndata = data;
        if ('status' in data && 'data' in data) {
          returndata = data.data;
          if (data.status !== 0) {
            store.updateMessage(wsApi?.messages?.failed ?? data.msg, true);
            env.notify('error', wsApi?.messages?.failed ?? data.msg);
            return;
          }
        }
        store.updateData(returndata, undefined, false);
        store.setHasRemoteData();

        this.runDataProvider('onWsFetched');
        // 因为 WebSocket 只会获取纯数据，所以没有 msg 之类的
        this.afterDataFetch({ok: true, data: returndata});
      },
      (error: any) => {
        store.updateMessage(error, true);
        env.notify('error', error);
      }
    );
  }

  afterDataFetch(result: any) {
    // todo 应该统一这块
    // 初始化接口返回的是整个 response，
    // 保存 ajax 请求的时候返回时数据部分。
    const data = result?.hasOwnProperty('ok') ? result.data : result;
    const {onBulkChange, dispatchEvent} = this.props;

    dispatchEvent?.('fetchInited', data);

    if (!isEmpty(data) && onBulkChange) {
      onBulkChange(data);
    }

    this.initInterval(data);
  }

  afterSchemaFetch(schema: any) {
    const {onBulkChange, formStore, dispatchEvent} = this.props;

    dispatchEvent?.('fetchSchemaInited', schema);

    if (formStore && schema?.data && onBulkChange) {
      onBulkChange && onBulkChange(schema.data);
    }

    this.initInterval(schema);
  }

  initInterval(value: any) {
    const {interval, silentPolling, stopAutoRefreshWhen, data} = this.props;

    clearTimeout(this.timer);
    interval &&
      this.mounted &&
      (!stopAutoRefreshWhen ||
        /** 接口返回值需要同步到数据域中再判断，否则会多请求一轮 */
        !evalExpression(stopAutoRefreshWhen, createObject(data, value))) &&
      (this.timer = setTimeout(
        silentPolling ? this.silentReload : this.reload,
        Math.max(interval, 1000)
      ));
    return value;
  }

  reload(
    subpath?: string,
    query?: any,
    ctx?: RendererData,
    silent?: boolean,
    replace?: boolean
  ) {
    if (query) {
      return this.receive(query, undefined, replace);
    }

    const {
      schemaApi,
      initFetchSchema,
      api,
      initFetch,
      initFetchOn,
      store,
      dataProvider,
      messages: {fetchSuccess, fetchFailed}
    } = this.props;

    clearTimeout(this.timer);

    if (isEffectiveApi(schemaApi, store.data)) {
      store
        .fetchSchema(schemaApi, store.data, {
          successMessage: fetchSuccess,
          errorMessage: fetchFailed
        })
        .then(res => {
          this.runDataProvider('onApiFetched');
          this.afterSchemaFetch(res);
        });
    }

    if (isEffectiveApi(api, store.data)) {
      store
        .fetchData(api, store.data, {
          silent,
          successMessage: fetchSuccess,
          errorMessage: fetchFailed
        })
        .then(res => {
          this.runDataProvider('onSchemaApiFetched');
          this.afterDataFetch(res);
        });
    }

    if (dataProvider) {
      this.runDataProvider('inited');
    }
  }

  silentReload(target?: string, query?: any) {
    this.reload(target, query, undefined, true);
  }

  receive(values: object, subPath?: string, replace?: boolean) {
    const {store} = this.props;

    store.updateData(values, undefined, replace);
    this.reload();
  }

  handleQuery(query: any) {
    if (this.props.api || this.props.schemaApi) {
      this.receive(query);
    } else {
      this.props.onQuery?.(query);
    }
  }

  reloadTarget(target: string, data?: any) {
    // 会被覆写
  }

  @autobind
  handleDialogConfirm(
    values: object[],
    action: ActionObject,
    ctx: any,
    targets: Array<any>
  ) {
    const {store} = this.props;
    store.closeDialog(true);
  }

  @autobind
  handleDialogClose(confirmed = false) {
    const {store} = this.props;
    store.closeDialog(confirmed);
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

  handleAction(
    e: React.UIEvent<any> | void,
    action: ActionObject,
    data: object,
    throwErrors: boolean = false,
    delegate?: IScopedContext
  ) {
    const {onAction, store, env, api, translate: __} = this.props;

    if (api && action.actionType === 'ajax') {
      store.setCurrentAction(action);
      store
        .saveRemote(action.api as string, data, {
          successMessage: __(action.messages && action.messages.success),
          errorMessage: __(action.messages && action.messages.failed)
        })
        .then(async (payload: any) => {
          this.afterDataFetch(payload);

          if (action.feedback && isVisible(action.feedback, store.data)) {
            await this.openFeedback(action.feedback, store.data);
          }

          const redirect =
            action.redirect && filter(action.redirect, store.data);
          redirect && env.jumpTo(redirect, action);
          action.reload && this.reloadTarget(action.reload, store.data);
        })
        .catch(e => {
          if (throwErrors || action.countDown) {
            throw e;
          }
        });
    } else {
      onAction(e, action, data, throwErrors, delegate || this.context);
    }
  }

  handleChange(
    value: any,
    name: string,
    submit?: boolean,
    changePristine?: boolean
  ) {
    const {store, formStore, onChange} = this.props;

    // form 触发的 onChange,直接忽略
    if (typeof name !== 'string') {
      return;
    }

    (store as IIRendererStore).changeValue?.(name, value);

    // 如果在form底下，则继续向上派送。
    formStore && onChange?.(value, name, submit, changePristine);
  }

  renderBody() {
    const {render, store, body: schema, classnames: cx} = this.props;

    return render('body', store.schema || schema, {
      key: store.schemaKey || 'body',
      loading: store.loading,
      onQuery: this.handleQuery,
      onAction: this.handleAction,
      onChange: this.handleChange
    }) as JSX.Element;
  }

  render() {
    const {
      className,
      store,
      render,
      classPrefix: ns,
      classnames: cx
    } = this.props;

    return (
      <div className={cx(`${ns}Service`, className)}>
        {store.error ? (
          <div className={cx(`Alert Alert--danger`)}>
            <button
              className={cx('Alert-close')}
              onClick={() => store.updateMessage('')}
              type="button"
            >
              <span>×</span>
            </button>
            {store.msg}
          </div>
        ) : null}

        {this.renderBody()}

        <Spinner size="lg" overlay key="info" show={store.loading} />

        {render(
          // 单独给 feedback 服务的，handleAction 里面先不要处理弹窗
          'modal',
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

@Renderer({
  type: 'service',
  storeType: ServiceStore.name,
  isolateScope: true,
  storeExtendsData: (props: any) => (props.formStore ? false : true)
})
export class ServiceRenderer extends Service {
  static contextType = ScopedContext;

  constructor(props: ServiceProps, context: IScopedContext) {
    super(props);

    const scoped = context;
    scoped.registerComponent(this as ScopedComponentType);
  }

  reload(
    subpath?: string,
    query?: any,
    ctx?: any,
    silent?: boolean,
    replace?: boolean
  ) {
    const scoped = this.context as IScopedContext;
    if (subpath) {
      return scoped.reload(
        query ? `${subpath}?${qsstringify(query)}` : subpath,
        ctx
      );
    }

    return super.reload(subpath, query, ctx, silent, replace);
  }

  receive(values: any, subPath?: string, replace?: boolean) {
    const scoped = this.context as IScopedContext;
    if (subPath) {
      return scoped.send(subPath, values);
    }

    return super.receive(values, subPath, replace);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    const scoped = this.context as IScopedContext;
    scoped.unRegisterComponent(this as ScopedComponentType);
  }

  reloadTarget(target: string, data?: any) {
    const scoped = this.context as IScopedContext;
    scoped.reload(target, data);
  }

  setData(values: object, replace?: boolean) {
    return this.props.store.updateData(values, undefined, replace);
  }
}
