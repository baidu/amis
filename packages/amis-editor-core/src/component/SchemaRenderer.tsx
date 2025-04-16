import React from 'react';
import {SchemaRenderer as CoreSchemaRenderer} from 'amis-core';

// 编辑态时用这个来代替默认的组件渲染
export const SchemaRenderer = React.forwardRef((props: any, ref: any) => {
  const statusStore = props.statusStore;
  const proxyStatusStore = React.useMemo(() => {
    return statusStore.isEditorProxy
      ? statusStore
      : new Proxy(statusStore, {
          get(target, prop, receiver) {
            // 始终是可见的, 否则没法编辑了
            if (prop === 'visibleState') {
              return {};
            } else if (prop === 'isEditorProxy') {
              return true;
            } else if (prop === 'raw') {
              return target;
            }
            return Reflect.get(target, prop, receiver);
          }
        });
  }, [statusStore]);

  return (
    <CoreSchemaRenderer {...props} statusStore={proxyStatusStore} ref={ref} />
  );
});
