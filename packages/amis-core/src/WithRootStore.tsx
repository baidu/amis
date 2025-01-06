import React from 'react';
import {IRendererStore} from './store';
import hoistNonReactStatic from 'hoist-non-react-statics';

export const RootStoreContext = React.createContext<IRendererStore>(
  undefined as any
);

export function withRootStore<
  T extends React.ComponentType<
    React.ComponentProps<T> & {
      rootStore: IRendererStore;
    }
  >
>(ComposedComponent: T) {
  type OuterProps = JSX.LibraryManagedAttributes<
    T,
    Omit<React.ComponentProps<T>, 'rootStore'>
  >;

  const result = hoistNonReactStatic(
    class extends React.Component<OuterProps> {
      static displayName: string = `WithRootStore(${
        ComposedComponent.displayName || ComposedComponent.name
      })`;
      static contextType = RootStoreContext;
      static ComposedComponent = ComposedComponent as React.ComponentType<T>;
      ref: any;

      constructor(props: OuterProps) {
        super(props);
        this.refFn = this.refFn.bind(this);
      }

      getWrappedInstance() {
        return this.ref.control;
      }

      refFn(ref: any) {
        this.ref = ref;
      }

      render() {
        const rootStore: IRendererStore = this.context as any;
        const injectedProps: {
          rootStore: IRendererStore;
        } = {
          rootStore
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
}
