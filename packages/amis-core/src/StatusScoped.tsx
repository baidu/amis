// 多语言支持
import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import {IStatusStore, StatusStore} from './store/status';
import {destroy} from 'mobx-state-tree';

export interface StatusScopedProps {
  statusStore: IStatusStore;
}

export interface StatusScopedWrapperProps {
  children: (props: {statusStore: IStatusStore}) => JSX.Element;
}

export function StatusScopedWrapper({children}: StatusScopedWrapperProps) {
  const store = React.useMemo(() => StatusStore.create({}), []);
  React.useEffect(() => {
    return () => {
      destroy(store);
    };
  }, []);

  return children({statusStore: store});
}

export function StatusScoped<
  T extends React.ComponentType<React.ComponentProps<T> & StatusScopedProps>
>(ComposedComponent: T) {
  const wrapped = (
    props: JSX.LibraryManagedAttributes<
      T,
      Omit<React.ComponentProps<T>, keyof StatusScopedProps>
    > & {},
    ref: any
  ) => {
    return (
      <StatusScopedWrapper>
        {({statusStore}) => (
          <ComposedComponent
            {...(props as any)}
            statusStore={statusStore}
            ref={ref}
          />
        )}
      </StatusScopedWrapper>
    );
  };

  return React.forwardRef(wrapped as any) as typeof wrapped;
}
