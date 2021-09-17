import React from 'react';
import PropTypes from 'prop-types';
import {Renderer, RendererProps} from '../factory';
import {ServiceStore, IServiceStore} from '../store/service';
import {Api, SchemaNode, ApiObject, RendererData, Action} from '../types';
import {filter, evalExpression} from '../utils/tpl';
import cx from 'classnames';
import Scoped, {ScopedContext, IScopedContext} from '../Scoped';
import {observer} from 'mobx-react';
import {isApiOutdated, isEffectiveApi} from '../utils/api';
import {Spinner} from '../components';
import {autobind, isEmpty, isVisible, qsstringify} from '../utils/helper';
import {
  BaseSchema,
  SchemaApi,
  SchemaCollection,
  SchemaExpression,
  SchemaMessage,
  SchemaName
} from '../Schema';
import {IIRendererStore} from '../store';

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

  static defaultProps: Partial<ServiceProps> = {
    messages: {
      fetchFailed: 'fetchFailed'
    }
  };

  static propsList: Array<string> = [];

  constructor(props: ServiceProps) {
    super(props);

    this.handleQuery = this.handleQuery.bind(this);
    this.handleAction = this.handleAction.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.reload = this.reload.bind(this);
    this.silentReload = this.silentReload.bind(this);
    this.initInterval = this.initInterval.bind(this);
    this.afterDataFetch = this.afterDataFetch.bind(this);
    this.afterSchemaFetch = this.afterSchemaFetch.bind(this);
  }

  componentDidMount() {
    this.mounted = true;
    this.initFetch();
  }

  componentDidUpdate(prevProps: ServiceProps) {
    const props = this.props;
    const store = props.store;

    const {fetchSuccess, fetchFailed} = props.messages!;

    isApiOutdated(prevProps.api, props.api, prevProps.data, props.data) &&
      store
        .fetchData(props.api as Api, store.data, {
          successMessage: fetchSuccess,
          errorMessage: fetchFailed
        })
        .then(this.afterDataFetch);

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
        .then(this.afterSchemaFetch);

    if (props.ws && prevProps.ws !== props.ws) {
      if (this.socket) {
        this.socket.close();
      }
      this.socket = store.fetchWSData(props.ws, this.afterDataFetch);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    clearTimeout(this.timer);
    if (this.socket && this.socket.close) {
      this.socket.close();
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
      store,
      messages: {fetchSuccess, fetchFailed}
    } = this.props;

    if (isEffectiveApi(schemaApi, store.data, initFetchSchema)) {
      store
        .fetchSchema(schemaApi, store.data, {
          successMessage: fetchSuccess,
          errorMessage: fetchFailed
        })
        .then(this.afterSchemaFetch);
    }

    if (isEffectiveApi(api, store.data, initFetch, initFetchOn)) {
      store
        .fetchInitData(api, store.data, {
          successMessage: fetchSuccess,
          errorMessage: fetchFailed
        })
        .then(this.afterDataFetch);
    }

    if (ws) {
      this.socket = store.fetchWSData(ws, this.afterDataFetch);
    }
  }

  afterDataFetch(result: any) {
    // todo 应该统一这块
    // 初始化接口返回的是整个 response，
    // 保存 ajax 请求的时候返回时数据部分。
    const data = result?.hasOwnProperty('ok') ? result.data : result;
    const {onBulkChange, formStore} = this.props;
    if (formStore && !isEmpty(data) && onBulkChange) {
      onBulkChange(data);
    }

    this.initInterval(data);
  }

  afterSchemaFetch(schema: any) {
    const {onBulkChange, formStore} = this.props;
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
      (!stopAutoRefreshWhen || !evalExpression(stopAutoRefreshWhen, data)) &&
      (this.timer = setTimeout(
        silentPolling ? this.silentReload : this.reload,
        Math.max(interval, 1000)
      ));
    return value;
  }

  reload(subpath?: string, query?: any, ctx?: RendererData, silent?: boolean) {
    if (query) {
      return this.receive(query);
    }

    const {
      schemaApi,
      initFetchSchema,
      api,
      initFetch,
      initFetchOn,
      store,
      messages: {fetchSuccess, fetchFailed}
    } = this.props;

    clearTimeout(this.timer);

    if (isEffectiveApi(schemaApi, store.data)) {
      store
        .fetchSchema(schemaApi, store.data, {
          successMessage: fetchSuccess,
          errorMessage: fetchFailed
        })
        .then(this.afterSchemaFetch);
    }

    if (isEffectiveApi(api, store.data)) {
      store
        .fetchData(api, store.data, {
          silent,
          successMessage: fetchSuccess,
          errorMessage: fetchFailed
        })
        .then(this.afterDataFetch);
    }
  }

  silentReload(target?: string, query?: any) {
    this.reload(target, query, undefined, true);
  }

  receive(values: object) {
    const {store} = this.props;

    store.updateData(values);
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

  openFeedback(dialog: any, ctx: any) {
    return new Promise(resolve => {
      const {store} = this.props;
      const parentStore = store.parentStore;

      // 暂时自己不支持弹出 dialog
      if (parentStore && parentStore.openDialog) {
        store.setCurrentAction({
          type: 'button',
          actionType: 'dialog',
          dialog: dialog
        });
        store.openDialog(ctx, undefined, confirmed => {
          resolve(confirmed);
        });
      }
    });
  }

  handleAction(
    e: React.UIEvent<any> | void,
    action: Action,
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
        .catch(() => {});
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

    return (
      <div className={cx('Service-body')}>
        {
          render('body', store.schema || schema, {
            key: store.schemaKey || 'body',
            onQuery: this.handleQuery,
            onAction: this.handleAction,
            onChange: this.handleChange
          }) as JSX.Element
        }
      </div>
    );
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
    scoped.registerComponent(this);
  }

  reload(subpath?: string, query?: any, ctx?: any, silent?: boolean) {
    const scoped = this.context as IScopedContext;
    if (subpath) {
      return scoped.reload(
        query ? `${subpath}?${qsstringify(query)}` : subpath,
        ctx
      );
    }

    return super.reload(subpath, query, ctx, silent);
  }

  receive(values: any, subPath?: string) {
    const scoped = this.context as IScopedContext;
    if (subPath) {
      return scoped.send(subPath, values);
    }

    return super.receive(values);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    const scoped = this.context as IScopedContext;
    scoped.unRegisterComponent(this);
  }

  reloadTarget(target: string, data?: any) {
    const scoped = this.context as IScopedContext;
    scoped.reload(target, data);
  }
}
