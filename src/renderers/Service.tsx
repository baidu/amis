import React from 'react';
import PropTypes from 'prop-types';
import {Renderer, RendererProps} from '../factory';
import {ServiceStore, IServiceStore} from '../store/service';
import {Api, SchemaNode, ApiObject, RendererData} from '../types';
import {filter, evalExpression} from '../utils/tpl';
import cx from 'classnames';
import Scoped, {ScopedContext, IScopedContext} from '../Scoped';
import {observer} from 'mobx-react';
import {isApiOutdated, isEffectiveApi} from '../utils/api';
import {Spinner} from '../components';

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
  timer: number;
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
    this.reload = this.reload.bind(this);
    this.silentReload = this.silentReload.bind(this);
    this.initInterval = this.initInterval.bind(this);
  }

  componentDidMount() {
    const {
      schemaApi,
      initFetchSchema,
      api,
      initFetch,
      initFetchOn,
      store,
      messages: {fetchSuccess, fetchFailed}
    } = this.props;

    this.mounted = true;

    if (isEffectiveApi(schemaApi, store.data, initFetchSchema)) {
      store.fetchSchema(schemaApi, store.data, {
        successMessage: fetchSuccess,
        errorMessage: fetchFailed
      });
    }

    if (isEffectiveApi(api, store.data, initFetch, initFetchOn)) {
      store
        .fetchInitData(api, store.data, {
          successMessage: fetchSuccess,
          errorMessage: fetchFailed
        })
        .then(this.initInterval);
    }
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
        .then(this.initInterval);

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
        .then(this.initInterval);
  }

  componentWillUnmount() {
    this.mounted = false;
    clearTimeout(this.timer);
  }

  initInterval(value: any) {
    const {interval, silentPolling, stopAutoRefreshWhen, data} = this.props;

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
        .then(this.initInterval);
    }

    if (isEffectiveApi(api, store.data)) {
      store
        .fetchData(api, store.data, {
          silent,
          successMessage: fetchSuccess,
          errorMessage: fetchFailed
        })
        .then(this.initInterval);
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

  renderBody() {
    const {render, store, body: schema, classnames: cx} = this.props;

    return (
      <div className={cx('Service-body')}>
        {
          render('body', store.schema || schema, {
            key: store.schemaKey || 'body',
            onQuery: this.handleQuery
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
}
