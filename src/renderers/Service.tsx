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
import {autobind, isVisible} from '../utils/helper';

export interface ServiceProps extends RendererProps {
  api?: Api;
  schemaApi?: Api;
  initFetch?: boolean;
  initFetchOn?: string;
  initFetchSchema?: boolean;
  interval?: number;
  silentPolling?: boolean;
  stopAutoRefreshWhen?: string;
  store: IServiceStore;
  body?: SchemaNode;
  messages: {
    fetchSuccess?: string;
    fetchFailed?: string;
  };
}
export default class Service extends React.Component<ServiceProps> {
  timer: NodeJS.Timeout;
  mounted: boolean;

  static defaultProps: Partial<ServiceProps> = {
    messages: {
      fetchFailed: '初始化失败'
    }
  };

  static propsList: Array<string> = [];

  constructor(props: ServiceProps) {
    super(props);

    this.handleQuery = this.handleQuery.bind(this);
    this.handleAction = this.handleAction.bind(this);
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

    const {
      messages: {fetchSuccess, fetchFailed}
    } = props;

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
  }

  componentWillUnmount() {
    this.mounted = false;
    clearTimeout(this.timer);
  }

  @autobind
  initFetch() {
    const {
      schemaApi,
      initFetchSchema,
      api,
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
  }

  afterDataFetch(data: any) {
    this.initInterval(data);
  }

  afterSchemaFetch(schema: any) {
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
        Math.max(interval, 3000)
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
    this.receive(query);
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

  renderBody() {
    const {render, store, body: schema, classnames: cx} = this.props;

    return (
      <div className={cx('Service-body')}>
        {
          render('body', store.schema || schema, {
            key: store.schemaKey || 'body',
            onQuery: this.handleQuery,
            onAction: this.handleAction
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
  test: /(^|\/)service$/,
  storeType: ServiceStore.name,
  name: 'service'
})
export class ServiceRenderer extends Service {
  static contextType = ScopedContext;

  componentWillMount() {
    // super.componentWillMount();
    const scoped = this.context as IScopedContext;
    scoped.registerComponent(this);
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
