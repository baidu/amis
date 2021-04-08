/**
 * 一个可以拉取远程配置的 HOC
 *
 */
import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import {Api, Payload} from '../types';
import {SchemaApi, SchemaTokenizeableString} from '../Schema';
import {withStore} from './WithStore';

import {EnvContext, RendererEnv} from '../env';

import {flow, Instance, types} from 'mobx-state-tree';
import {buildApi, isEffectiveApi, normalizeApi} from '../utils/api';
import {
  isPureVariable,
  resolveVariableAndFilter,
  tokenize
} from '../utils/tpl-builtin';
import {reaction} from 'mobx';

export const Store = types
  .model('OptionsStore')
  .props({
    fetching: false,
    errorMsg: '',
    config: types.frozen(),
    data: types.frozen({})
  })
  .actions(self => {
    const load: (
      env: RendererEnv,
      api: Api,
      data: any,
      config: WithRemoteConfigSettings
    ) => Promise<any> = flow(function* (env, api, data, config = {}) {
      try {
        self.fetching = true;
        const ret: Payload = yield env.fetcher(api, data);

        if (ret.ok) {
          const data = ret.data || {};
          let options = config.adaptor ? config.adaptor(data) : data;
          (self as any).setConfig(options, config);
        } else {
          throw new Error(ret.msg || 'fetch error');
        }
      } catch (e) {
        self.errorMsg = e.message;
      } finally {
        self.fetching = false;
      }
    });

    return {
      load,
      setData(data: any) {
        self.data = data || {};
      },
      setConfig(options: any, config: WithRemoteConfigSettings) {
        if (config.normalizeConfig) {
          options = config.normalizeConfig(options, self.config) || options;
        }

        self.config = options;
      }
    };
  });

export type IStore = Instance<typeof Store>;

export interface OutterProps {
  env?: RendererEnv;
  data: any;
  source?: SchemaApi | SchemaTokenizeableString;
}

export interface RemoteOptionsProps<T = any> {
  config: T;
  loading?: boolean;
}

export interface WithRemoteConfigSettings {
  configField?: string;
  adaptor?: (json: any) => any;
  normalizeConfig?: (config: any, origin: any) => any;
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
          static ComposedComponent = ComposedComponent;
          static contextType = EnvContext;
          toDispose: Array<() => void> = [];

          componentDidMount() {
            const env: RendererEnv = this.props.env || this.context;
            const {store, source, data} = this.props;

            store.setData(data);

            if (isPureVariable(source)) {
              this.syncOptions();
              this.toDispose.push(
                reaction(
                  () =>
                    resolveVariableAndFilter(
                      source as string,
                      store.data,
                      '| raw'
                    ),
                  () => this.syncOptions()
                )
              );
            } else if (env && isEffectiveApi(source, data)) {
              this.loadOptions();
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
                  () => this.loadOptions()
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
          }

          loadOptions() {
            const env: RendererEnv = this.props.env || this.context;
            const {store, source, data} = this.props;

            if (env && isEffectiveApi(source, data)) {
              store.load(env, source, data, config);
            }
          }

          syncOptions() {
            const {store, source, data} = this.props;

            if (isPureVariable(source)) {
              store.setConfig(
                resolveVariableAndFilter(source as string, data, '| raw') || [],
                config
              );
            }
          }

          render() {
            const store = this.props.store;
            const injectedProps: RemoteOptionsProps<P> = {
              config: store.config,
              loading: store.fetching
            };

            return (
              <ComposedComponent
                {...(this.props as JSX.LibraryManagedAttributes<
                  T,
                  React.ComponentProps<T>
                >)}
                {...injectedProps}
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
