import React from 'react';

export function lazyData<T, U>(
  getData: () => Promise<U>,
  getComponent: (
    data: U
  ) => React.ComponentType<T> | Promise<React.ComponentType<T>>
) {
  return React.lazy(async () => {
    const data = await getData();
    let component = await getComponent(data);

    return {
      default: component as React.ComponentType<T>
    };
  });
}
