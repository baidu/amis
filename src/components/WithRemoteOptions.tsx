/**
 * 让选项类的组件支持远程加载选项。
 *
 * 目前这个逻辑其实在 renderer/form/options 中有
 * 但是那个里面耦合较多，没办法简单的在组件之间相互调用，
 * 所以先单独弄个 hoc 出来，后续再想个更加合理的方案。
 */
import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import {Api, Payload} from '../types';
import {Option, SchemaApi, SchemaTokenizeableString} from '../Schema';
import {withStore} from './WithStore';

import {EnvContext, RendererEnv} from '../env';

import {flow, Instance, types} from 'mobx-state-tree';
import {buildApi, isEffectiveApi} from '../utils/api';
import {isPureVariable, resolveVariableAndFilter} from '../utils/tpl-builtin';
import {normalizeOptions} from './Select';
import {reaction} from 'mobx';

export const Store = types
  .model('OptionsStore')
  .props({
    fetching: false,
    errorMsg: '',
    options: types.frozen<Array<Option>>([]),
    data: types.frozen({})
  })
  .actions(self => {
    const load: (env: RendererEnv, api: Api, data: any) => Promise<any> = flow(
      function* (env, api, data) {
        try {
          self.fetching = true;
          const ret: Payload = yield env.fetcher(api, data);

          if (ret.ok) {
            const data = ret.data || {};
            let options = data.options || data.items || data.rows || data;
            (self as any).setOptions(options);
          } else {
            throw new Error(ret.msg || 'fetch error');
          }
        } catch (e) {
          self.errorMsg = e.message;
        } finally {
          self.fetching = false;
        }
      }
    );

    return {
      load,
      setData(data: any) {
        self.data = data || {};
      },
      setOptions(options: any) {
        options = normalizeOptions(options);

        if (Array.isArray(options)) {
          self.options = options.concat();
        }
      }
    };
  });

export type IStore = Instance<typeof Store>;

export interface RemoteOptionsProps {
  options: Array<Option>;
  loading?: boolean;
}

export interface OutterProps {
  env?: RendererEnv;
  data: any;
  source?: SchemaApi | SchemaTokenizeableString;
  options?: Array<Option>;
}

export function withRemoteOptions<
  T extends React.ComponentType<React.ComponentProps<T> & RemoteOptionsProps>
>(ComposedComponent: T) {
  type FinalOutterProps = JSX.LibraryManagedAttributes<
    T,
    Omit<React.ComponentProps<T>, keyof RemoteOptionsProps>
  > &
    OutterProps;

  const result = hoistNonReactStatic(
    withStore(() => Store.create())(
      class extends React.Component<
        FinalOutterProps & {
          store: IStore;
        }
      > {
        static displayName = `WithRemoteOptions(${
          ComposedComponent.displayName || ComposedComponent.name
        })`;
        static ComposedComponent = ComposedComponent;
        static contextType = EnvContext;
        toDispose: Array<() => void> = [];

        componentDidMount() {
          const env: RendererEnv = this.props.env || this.context;
          const {store, source, data, options} = this.props;

          store.setData(data);
          options && store.setOptions(options);

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
                () =>
                  buildApi(source as string, store.data, {
                    ignoreData: true
                  }).url,
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
          const {store, source, data, options} = this.props;

          if (env && isEffectiveApi(source, data)) {
            store.load(env, source, data);
          }
        }

        syncOptions() {
          const {store, source, data} = this.props;

          if (isPureVariable(source)) {
            store.setOptions(
              resolveVariableAndFilter(source as string, data, '| raw') || []
            );
          }
        }

        render() {
          const store = this.props.store;
          const injectedProps: RemoteOptionsProps = {
            options: store.options,
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
}
