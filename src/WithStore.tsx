import hoistNonReactStatic from 'hoist-non-react-statics';
import {observer} from 'mobx-react';
import React from 'react';
import {RendererProps} from './factory';
import {IIRendererStore, IRendererStore} from './store';
import {RendererData, SchemaNode} from './types';
import getExprProperties from './utils/filter-schema';
import {
  createObject,
  extendObject,
  guid,
  isObjectShallowModified,
  syncDataFromSuper
} from './utils/helper';
import {dataMapping} from './utils/tpl-builtin';
import {RootStoreContext} from './WithRootStore';

export function HocStoreFactory(renderer: {
  storeType: string;
  extendsData?: boolean | ((props: any) => boolean);
  shouldSyncSuperStore?: (
    store: any,
    props: any,
    prevProps: any
  ) => boolean | undefined;
}): any {
  return function <T extends React.ComponentType<RendererProps>>(Component: T) {
    type Props = Omit<
      RendererProps,
      'store' | 'data' | 'dataUpdatedAt' | 'scope'
    > & {
      store?: IIRendererStore;
      data?: RendererData;
      scope?: RendererData;
    };

    @observer
    class StoreFactory extends React.Component<Props> {
      static displayName = `WithStore(${
        Component.displayName || Component.name
      })`;
      static ComposedComponent = Component;
      static contextType = RootStoreContext;
      store: IIRendererStore;
      context!: React.ContextType<typeof RootStoreContext>;
      ref: any;

      constructor(
        props: Props,
        context: React.ContextType<typeof RootStoreContext>
      ) {
        super(props);

        const rootStore = context;
        this.renderChild = this.renderChild.bind(this);
        this.refFn = this.refFn.bind(this);

        const store = rootStore.addStore({
          id: guid(),
          path: this.props.$path,
          storeType: renderer.storeType,
          parentId: this.props.store ? this.props.store.id : ''
        }) as IIRendererStore;
        this.store = store;

        const extendsData =
          typeof renderer.extendsData === 'function'
            ? renderer.extendsData(props)
            : renderer.extendsData;

        if (extendsData === false) {
          store.initData(
            createObject(
              (this.props.data as any)
                ? (this.props.data as any).__super
                : null,
              {
                ...this.formatData(
                  dataMapping(this.props.defaultData, this.props.data)
                ),
                ...this.formatData(this.props.data)
              }
            )
          );
        } else if (
          this.props.scope ||
          (this.props.data && (this.props.data as any).__super)
        ) {
          if (this.props.store && this.props.data === this.props.store.data) {
            store.initData(
              createObject(this.props.store.data, {
                ...this.formatData(
                  dataMapping(this.props.defaultData, this.props.data)
                )
              })
            );
          } else {
            store.initData(
              createObject(
                (this.props.data as any).__super || this.props.scope,
                {
                  ...this.formatData(
                    dataMapping(this.props.defaultData, this.props.data)
                  ),
                  ...this.formatData(this.props.data)
                }
              )
            );
          }
        } else {
          store.initData({
            ...this.formatData(
              dataMapping(this.props.defaultData, this.props.data)
            ),
            ...this.formatData(this.props.data)
          });
        }
      }

      getWrappedInstance() {
        return this.ref;
      }

      refFn(ref: any) {
        this.ref = ref;
      }

      formatData(data: any): object {
        if (Array.isArray(data)) {
          return {
            items: data
          };
        }

        return data as object;
      }

      componentDidUpdate(prevProps: RendererProps) {
        const props = this.props;
        const store = this.store;
        const shouldSync = renderer.shouldSyncSuperStore?.(
          store,
          props,
          prevProps
        );

        if (shouldSync === false) {
          return;
        }

        const extendsData =
          typeof renderer.extendsData === 'function'
            ? renderer.extendsData(props)
            : renderer.extendsData;
        if (extendsData === false) {
          if (
            shouldSync === true ||
            prevProps.defaultData !== props.defaultData ||
            isObjectShallowModified(prevProps.data, props.data) ||
            //
            // 特殊处理 CRUD。
            // CRUD 中 toolbar 里面的 data 是空对象，但是 __super 会不一样
            (props.data &&
              prevProps.data &&
              props.data.__super !== prevProps.data.__super)
          ) {
            store.initData(
              extendObject(props.data, {
                ...(store.hasRemoteData ? store.data : null), // todo 只保留 remote 数据
                ...this.formatData(props.defaultData),
                ...this.formatData(props.data)
              })
            );
          }
        } else if (
          shouldSync === true ||
          isObjectShallowModified(prevProps.data, props.data)
        ) {
          if (props.store && props.store.data === props.data) {
            store.initData(
              createObject(
                props.store.data,
                props.syncSuperStore === false
                  ? {
                      ...store.data
                    }
                  : syncDataFromSuper(
                      store.data,
                      props.store.data,
                      prevProps.scope,
                      store,
                      props.syncSuperStore === true
                    )
              )
            );
          } else if (props.data && (props.data as any).__super) {
            store.initData(
              extendObject(
                props.data,
                store.hasRemoteData
                  ? {
                      ...store.data,
                      ...props.data
                    }
                  : undefined
              )
            );
          } else {
            store.initData(createObject(props.scope, props.data));
          }
        } else if (
          (shouldSync === true ||
            !props.store ||
            props.data !== props.store.data) &&
          props.data &&
          props.data.__super
        ) {
          // 这个用法很少，当 data.__super 值发生变化时，更新 store.data
          if (
            !prevProps.data ||
            isObjectShallowModified(
              props.data.__super,
              prevProps.data.__super,
              false
            )
          ) {
            store.initData(
              createObject(props.data.__super, {
                ...props.data,
                ...store.data
              }),

              store.storeType === 'FormStore' &&
                prevProps.store?.storeType === 'CRUDStore'
            );
          }
          // nextProps.data.__super !== props.data.__super) &&
        } else if (
          props.scope &&
          props.data === props.store!.data &&
          (shouldSync === true || prevProps.data !== props.data)
        ) {
          // 只有父级数据变动的时候才应该进来，
          // 目前看来这个 case 很少有情况下能进来
          store.initData(
            createObject(props.scope, {
              // ...nextProps.data,
              ...store.data
            })
          );
        }
      }

      componentWillUnmount() {
        const rootStore = this.context as IRendererStore;
        const store = this.store;
        rootStore.removeStore(store);

        // @ts-ignore
        delete this.store;
      }

      renderChild(
        region: string,
        node: SchemaNode,
        subProps: {
          data?: object;
          [propName: string]: any;
        } = {}
      ) {
        let {render} = this.props;

        return render(region, node, {
          data: this.store.data,
          dataUpdatedAt: this.store.updatedAt,
          ...subProps,
          scope: this.store.data,
          store: this.store
        });
      }

      render() {
        const {detectField, ...rest} = this.props;

        let exprProps: any = {};
        if (!detectField || detectField === 'data') {
          exprProps = getExprProperties(rest, this.store.data, undefined, rest);

          if (exprProps.hidden || exprProps.visible === false) {
            return null;
          }
        }

        return (
          <Component
            {
              ...(rest as any) /* todo */
            }
            {...exprProps}
            ref={this.refFn}
            data={this.store.data}
            dataUpdatedAt={this.store.updatedAt}
            store={this.store}
            scope={this.store.data}
            render={this.renderChild}
          />
        );
      }
    }
    hoistNonReactStatic(StoreFactory, Component);

    return StoreFactory;
  };
}
