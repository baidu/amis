/**
 * @file 图标支持的公共方法，主要是支持自动识别地址和 icon-font
 */

import React from 'react';
import {isObject} from 'lodash';
import {ClassNamesFn} from '../theme';

export interface IconCheckedSchema {
  id: string;
  name?: string;
}

/**
 * 判断字符串来生成 i 或 img
 * @param icon icon 设置
 * @param className 内部用的 className
 * @param classNameProp amis 配置里设置的 className
 */
export const generateIcon = (
  cx: ClassNamesFn,
  icon?: string | IconCheckedSchema | React.ReactNode,
  className?: string,
  classNameProp?: string
) => {
  if (React.isValidElement(icon)) {
    return icon;
  }

  if (typeof icon !== 'string') {
    if (
      isObject(icon) &&
      typeof (icon as IconCheckedSchema).id === 'string' &&
      (icon as IconCheckedSchema).id.startsWith('svg-')
    ) {
      return (
        <svg className={cx('icon', 'icon-object', className, classNameProp)}>
          <use
            xlinkHref={`#${(icon as IconCheckedSchema).id.replace(
              /^svg-/,
              ''
            )}`}
          ></use>
        </svg>
      );
    }

    return;
  }

  const isURLIcon = icon?.indexOf('.') !== -1;

  return icon ? (
    isURLIcon ? (
      <img className={cx(className, classNameProp)} src={icon} key={icon} />
    ) : (
      <i className={cx(className, icon, classNameProp)} key={icon} />
    )
  ) : null;
};
