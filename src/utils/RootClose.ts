/**
 * 兼容之前的 RootCloseWrapper 写法
 */

import React, {useState} from 'react';
import useRootClose from 'react-overlays/useRootClose';

export const RootClose = ({children, onRootClose, ...props}: any) => {
  const [rootElement, attachRef] = useState(null);
  useRootClose(rootElement, onRootClose, props);
  return typeof children === 'function' ? children(attachRef) : children;
};
