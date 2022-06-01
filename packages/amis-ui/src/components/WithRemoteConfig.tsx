/**
 * 一个可以拉取远程配置的 HOC
 *
 */
import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import debounce from 'lodash/debounce';
import {withStore} from './WithStore';

import {flow, Instance, isAlive, types} from 'mobx-state-tree';
import {
  buildApi,
  EnvContext,
  isEffectiveApi,
  normalizeApi,
  normalizeApiResponseData
} from 'amis-core';
import type {RendererEnv} from 'amis-core';
import {isPureVariable, resolveVariableAndFilter, tokenize} from 'amis-core';
import {reaction} from 'mobx';
import {createObject, findTreeIndex, isObject} from 'amis-core';
import {Api, ApiObject, Payload} from 'amis-core';

export const Store = types
  .model('RemoteConfigStore')
  .props({
    fetching: false,
    errorMsg: '',
    config: types.frozen(),
    data: types.frozen({})
  })
  .actions(self => {
    let component: any = undefined;

    const load = flow(function* (
      env: RendererEnv,
      api: Api,
      ctx: any,
      config: WithRemoteConfigSettings = {}
    ): any {
      try {
        self.fetching = true;
        const ret: Payload = yield env.fetcher(api, ctx);
        if (!isAlive(self)) {
          return;
        }

        if (ret.ok) {
          const data = normalizeApiResponseData(ret.data);
          let options = config.adaptor
            ? config.adaptor(data, component.props)
            : data;
          (self as any).setConfig(options, config, 'remote');
          config.afterLoad?.(data, self.config, component.props);
          return ret;
        } else {
          throw new Error(ret.msg || 'fetch error');
        }
      } catch (e) {
        isAlive(self) && (self.errorMsg = e.message);
      } finally {
        isAlive(self) && (self.fetching = false);
      }
    });

    return {
      setComponent(c: any) {
        component = c;
      },

      load,
      setData(data: any) {
        self.data = data || {};
      },
      setConfig(
        options: any,
        config: WithRemoteConfigSettings,
        motivation?: any
      ) {
        if (config.normalizeConfig) {
          options =
            config.normalizeConfig(
              options,
              self.config,
              component.props,
              motivation
            ) || options;
        }

        self.config = options;
      }
    };
  });

export type IStore = Instance<typeof Store>;

export interface OutterProps {
  env?: RendererEnv;
  data: any;
  source?: Api;
  autoComplete?: Api;
  deferApi?: Api;
  remoteConfigRef?: (
    instance:
      | {
          loadConfig: (ctx?: any) => Promise<any> | void;
          setConfig: (value: any) => void;
        }
      | undefined
  ) => void;
}

export interface RemoteOptionsProps<T = any> {
  config: T;
  loading?: boolean;
  deferLoad: (item: any) => Promise<any>;
  updateConfig: (value: T, ctx?: any) => void;
}

export interface WithRemoteConfigSettings {
  sourceField?: string;

  /**
   * 从接口返回数据适配到配置
   */
  adaptor?: (json: any, props: any) => any;

  /**
   * 配置格式化
   */
  normalizeConfig?: (
    config: any,
    origin: any,
    props: any,
    motivation?: any
  ) => any;

  /**
   * 请求返回后的回调
   */
  afterLoad?: (ret: any, config: any, props: any) => void;

  /**
   * 懒加载选项相关，开始懒加载的回调
   */
  beforeDeferLoad?: (
    item: any,
    indexes: Array<number>,
    config: any,
    props: any
  ) => any;

  /**
   * 懒加载选项相关，结束懒加载的回调
   */
  afterDeferLoad?: (
    item: any,
    indexes: Array<number>,
    reponse: Payload,
    config: any,
    props: any
  ) => any;

  injectedPropsFilter?: (
    injectedProps: {
      config: any;
      loading?: boolean;
      deferLoad: (term: string) => any;
      updateConfig: (config: any) => void;
    },
    props: any
  ) => any;
}

export function withRemoteConfig<P = any>(
  config: WithRemoteConfigSettings = {}
) {
  return function <
    T extends React.ComponentType<
      React.ComponentProps<T> & RemoteOptionsProps<P>
    >
  >(ComposedComponent: T) {
    type FinalOutterProps = JSX.LibraryManagedAttributes<
      T,
      Omit<React.ComponentProps<T>, keyof RemoteOptionsProps<P>>
    > &
      OutterProps;

    const result = hoistNonReactStatic(
      withStore(() => Store.create())(
        class extends React.Component<
          FinalOutterProps & {
            store: IStore;
          }
        > {
          static displayName = `WithRemoteConfig(${
            ComposedComponent.displayName || ComposedComponent.name
          })`;
          static ComposedComponent =
            ComposedComponent as React.ComponentType<T>;
          static contextType = EnvContext;
          toDispose: Array<() => void> = [];

          loadOptions = debounce(this.loadAutoComplete.bind(this), 250, {
            trailing: true,
            leading: false
          });

          constructor(
            props: FinalOutterProps & {
              store: IStore;
            }
          ) {
            super(props);

            this.setConfig = this.setConfig.bind(this);
            props.store.setComponent(this);
            this.deferLoadConfig = this.deferLoadConfig.bind(this);
            props.remoteConfigRef?.(this);
            props.store.setData(props.data);
            this.syncConfig();
          }

          componentDidMount() {
            const env: RendererEnv = this.props.env || this.context;
            const {store, data} = this.props;
            const source = (this.props as any)[config.sourceField || 'source'];

            if (isPureVariable(source)) {
              this.toDispose.push(
                reaction(
                  () =>
                    resolveVariableAndFilter(
                      source as string,
                      store.data,
                      '| raw'
                    ),
                  () => this.syncConfig()
                )
              );
            } else if (env && isEffectiveApi(source, data)) {
              this.loadConfig();
              (source as ApiObject).autoRefresh !== false &&
                this.toDispose.push(
                  reaction(
                    () => {
                      const api = normalizeApi(source as string);
                      return api.trackExpression
                        ? tokenize(api.trackExpression, store.data)
                        : buildApi(api, store.data, {
                            ignoreData: true
                          }).url;
                    },
                    () => this.loadConfig()
                  )
                );
            }
          }

          componentDidUpdate(prevProps: any) {
            const props = this.props;

            if (props.data !== prevProps.data) {
              props.store.setData(props.data);
            }
          }

          componentWillUnmount() {
            this.toDispose.forEach(fn => fn());
            this.toDispose = [];

            this.props.remoteConfigRef?.(undefined);
            this.loadOptions.cancel();
          }

          async loadConfig(ctx = this.props.data) {
            const env: RendererEnv = this.props.env || this.context;
            const {store} = this.props;
            const source = (this.props as any)[config.sourceField || 'source'];

            if (env && isEffectiveApi(source, ctx)) {
              await store.load(env, source, ctx, config);
            }
          }

          loadAutoComplete(input: string) {
            const env: RendererEnv = this.props.env || this.context;
            const {autoComplete, data, store} = this.props;

            if (!env || !env.fetcher) {
              throw new Error('fetcher is required');
            }

            const ctx = createObject(data, {
              term: input,
              value: input
            });

            if (!isEffectiveApi(autoComplete, ctx)) {
              return Promise.resolve({
                options: []
              });
            }

            return store.load(env, autoComplete, ctx, config);
          }

          setConfig(value: any, ctx?: any) {
            const {store} = this.props;
            store.setConfig(value, config, ctx);
          }

          syncConfig() {
            const {store, data} = this.props;
            const source = (this.props as any)[config.sourceField || 'source'];

            if (isPureVariable(source)) {
              store.setConfig(
                resolveVariableAndFilter(source as string, data, '| raw') || [],
                config,
                'syncConfig'
              );
            } else if (isObject(source) && !isEffectiveApi(source, data)) {
              store.setConfig(source, config, 'syncConfig');
            }
          }

          async deferLoadConfig(item: any) {
            const {store, data, deferApi} = this.props;
            const source = (this.props as any)[config.sourceField || 'source'];
            const env: RendererEnv = this.props.env || this.context;
            const indexes = findTreeIndex(store.config, a => a === item)!;

            const ret = config.beforeDeferLoad?.(
              item,
              indexes,
              store.config,
              this.props
            );

            ret && store.setConfig(ret, config, 'before-defer-load');
            let response: Payload;
            try {
              if (!isEffectiveApi(item.deferApi || deferApi || source)) {
                throw new Error('deferApi is required');
              }

              response = await env.fetcher(
                item.deferApi || deferApi || source,
                createObject(data, item)
              );
            } catch (e) {
              response = {
                ok: false,
                msg: e.message,
                status: 500,
                data: undefined
              };
            }
            const ret2 = config.afterDeferLoad?.(
              item,
              indexes, // 只能假定还是那个 index 了
              response,
              store.config,
              this.props
            );
            ret2 && store.setConfig(ret2, config, 'after-defer-load');
          }

          render() {
            const store = this.props.store;
            const env: RendererEnv = this.props.env || this.context;
            const injectedProps: RemoteOptionsProps<P> = {
              config: store.config,
              loading: store.fetching,
              deferLoad: this.deferLoadConfig,
              updateConfig: this.setConfig
            };
            const {remoteConfigRef, autoComplete, ...rest} = this.props;

            return (
              <ComposedComponent
                {...(rest as JSX.LibraryManagedAttributes<
                  T,
                  React.ComponentProps<T>
                >)}
                {...(env && isEffectiveApi(autoComplete) && this.loadOptions
                  ? {loadOptions: this.loadOptions}
                  : {})}
                {...(config.injectedPropsFilter
                  ? config.injectedPropsFilter(injectedProps, this.props)
                  : injectedProps)}
              />
            );
          }
        }
      ),
      ComposedComponent
    );

    return result as typeof result & {
      ComposedComponent: T;
    };
  };
}
