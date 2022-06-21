/**
 * 接管 store 的生命周期，这个比较轻量，适合在组件中使用。
 * 相比渲染器中的 withStore，这里面的 store 不会在一个大树中。
 * 而且不会知道父级和子级中还有哪些 store。
 */
import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import {destroy, IAnyStateTreeNode} from 'mobx-state-tree';
import {observer} from 'mobx-react';

export function withStore<K extends IAnyStateTreeNode>(
  storeFactory: (props: any) => K
) {
  return function <
    T extends React.ComponentType<
      React.ComponentProps<T> & {
        store: K;
      }
    >
  >(ComposedComponent: T) {
    ComposedComponent = observer(ComposedComponent);

    type OuterProps = JSX.LibraryManagedAttributes<
      T,
      Omit<React.ComponentProps<T>, 'store'>
    >;

    const result = hoistNonReactStatic(
      class extends React.Component<OuterProps> {
        static displayName = `WithStore(${
          ComposedComponent.displayName || 'Unkown'
        })`;
        static ComposedComponent = ComposedComponent as React.ComponentType<T>;
        ref: any;
        store?: K = storeFactory(this.props);
        refFn = (ref: any) => {
          this.ref = ref;
        };

        componentWillUnmount() {
          this.store && destroy(this.store);
          delete this.store;
        }

        getWrappedInstance() {
          return this.ref;
        }

        render() {
          const injectedProps = {
            store: this.store
          };

          return (
            <ComposedComponent
              {...(this.props as JSX.LibraryManagedAttributes<
                T,
                React.ComponentProps<T>
              > as any)}
              {...injectedProps}
              ref={this.refFn}
            />
          );
        }
      },
      ComposedComponent
    );

    return result as typeof result & {
      ComposedComponent: T;
    };
  };
}
