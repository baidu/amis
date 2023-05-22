// 多语言支持
import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import {IStatusStore, StatusStore} from './store/status';
import {destroy} from 'mobx-state-tree';

export interface StatusScopedProps {
  statusStore: IStatusStore;
}

export function StatusScoped<
  T extends React.ComponentType<React.ComponentProps<T> & StatusScopedProps>
>(ComposedComponent: T) {
  type OuterProps = JSX.LibraryManagedAttributes<
    T,
    Omit<React.ComponentProps<T>, keyof StatusScopedProps>
  > & {};

  const result = hoistNonReactStatic(
    class extends React.Component<OuterProps> {
      static displayName = `StatusScoped(${
        ComposedComponent.displayName || ComposedComponent.name
      })`;
      static ComposedComponent = ComposedComponent as React.ComponentType<T>;

      store?: IStatusStore;

      constructor(props: OuterProps) {
        super(props);

        this.childRef = this.childRef.bind(this);
        this.getWrappedInstance = this.getWrappedInstance.bind(this);

        this.store = StatusStore.create({});
      }

      ref: any;

      childRef(ref: any) {
        while (ref && ref.getWrappedInstance) {
          ref = ref.getWrappedInstance();
        }

        this.ref = ref;
      }

      getWrappedInstance() {
        return this.ref;
      }

      componentWillUnmount(): void {
        this.store && destroy(this.store);
        delete this.store;
      }

      render() {
        const injectedProps: {
          statusStore: IStatusStore;
        } = {
          statusStore: this.store!
        };
        const refConfig = ComposedComponent.prototype?.isReactComponent
          ? {ref: this.childRef}
          : {forwardedRef: this.childRef};

        return (
          <ComposedComponent
            {...(this.props as JSX.LibraryManagedAttributes<
              T,
              React.ComponentProps<T>
            > as any)}
            {...injectedProps}
            {...refConfig}
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
