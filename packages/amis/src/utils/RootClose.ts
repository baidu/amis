/**
 * 兼容之前的 RootCloseWrapper 写法
 */

import React, {useState} from 'react';
import useRootClose from 'react-overlays/useRootClose';
import {findDOMNode} from 'react-dom';

export const RootClose = ({children, onRootClose, ...props}: any) => {
  const [rootComponent, attachRef] = useState(null);
  const rootElement = findDOMNode(rootComponent) as Element;

  useRootClose(rootElement, onRootClose, props);

  return typeof children === 'function' ? children(attachRef) : children;
};
