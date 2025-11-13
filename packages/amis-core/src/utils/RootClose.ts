/**
 * 兼容之前的 RootCloseWrapper 写法
 */

import React, {useState} from 'react';
import useRootClose from 'react-overlays/useRootClose';
import {findDomCompat as findDOMNode} from '../utils/findDomCompat';

export const RootClose = ({children, onRootClose, ...props}: any) => {
  const [rootComponent, attachRef] = useState(null);
  const rootElement = findDOMNode(rootComponent) as Element;
  const onClose = React.useCallback(
    (e: Event) => {
      const target = e.target as HTMLElement;
      const belongedModal = target.closest('[role=dialog]');
      if (
        !target.isConnected || // 如果不在文档树中，忽略
        (rootElement && belongedModal && !belongedModal.contains(rootElement)) // 如果点击的是 modal 里面的，但是 rootElement 不在 modal 里面，忽略
      ) {
        return;
      }
      onRootClose && onRootClose(e);
    },
    [rootComponent, onRootClose]
  );

  useRootClose(rootElement, onClose, props);

  return typeof children === 'function' ? children(attachRef) : children;
};
