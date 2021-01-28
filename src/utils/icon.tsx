/**
 * @file 图标支持的公共方法，主要是支持自动识别地址和 icon-font
 */

import React from 'react';
import {ClassNamesFn} from '../theme';

/**
 * 判断字符串来生成 i 或 img
 * @param icon icon 设置
 * @param className 内部用的 className
 * @param classNameProp amis 配置里设置的 className
 */
export const generateIcon = (
  cx: ClassNamesFn,
  icon?: string,
  className?: string,
  classNameProp?: string
) => {
  const isURLIcon = icon?.indexOf('.') !== -1;

  return icon ? (
    isURLIcon ? (
      <img className={cx(className, classNameProp)} src={icon} />
    ) : (
      <i className={cx(className, icon, classNameProp)} />
    )
  ) : null;
};
