/**
 * @file Layout
 * @description 页面布局，支持左边栏、顶部、内容区域布局。
 * @author fex
 *
 * @param 参数说明：
 * * children 会渲染在内容区。
 * * header 头部区域
 * * aside 边栏
 * * asideClassName 边栏附加样式class
 * * footer 页脚
 * * folder 是否收起边栏
 * * asideFixed 边栏是否为固定模式，如果是会用 position:fixed 来定位.
 * * className 附件的样式名
 * * contentClassName 内容区域附加样式名称
 */

import React from 'react';
import {ClassNamesFn, themeable} from '../theme';

interface LayoutProps {
  header?: boolean | React.ReactNode;
  headerClassName?: string;
  aside?: boolean | React.ReactNode;
  asideClassName: string;
  boxed?: boolean;
  folded?: boolean;
  asideFixed: boolean;
  headerFixed: boolean;
  className?: string;
  contentClassName?: string;
  footer: boolean | React.ReactNode;
  offScreen: boolean;
  classPrefix: string;
  classnames: ClassNamesFn;
  size?: 'sm' | 'base' | 'md' | 'lg';
  children?: React.ReactNode;
  bodyClassName?: string;
}

export function Layout({
  header,
  headerClassName,
  aside,
  asideClassName,
  children,
  className,
  contentClassName,
  folded,
  asideFixed,
  headerFixed,
  footer,
  offScreen,
  size,
  boxed,
  classnames: cx,
  bodyClassName
}: LayoutProps) {
  let body = (
    <div className={cx(`Layout-body`, contentClassName)}>{children}</div>
  );

  if (aside) {
    body = (
      <div className={cx('Layout-content')} role="main">
        {body}
      </div>
    );
  }

  React.useEffect(() => {
    bodyClassName && document.body.classList.add(bodyClassName);

    return () => {
      bodyClassName && document.body.classList.remove(bodyClassName);
    };
  }, [bodyClassName]);

  return (
    <div
      className={cx(`Layout`, className, {
        'Layout--boxed': boxed,
        'Layout--withAside': !!aside,
        'Layout--headerFixed': header ? headerFixed : false,
        'Layout--asideFixed': aside ? asideFixed : false,
        'Layout--folded': folded,
        'Layout--offScreen': offScreen,
        [`Layout--${size}`]: size,
        'Layout--noFooter': !footer
      })}
    >
      {header ? (
        <div className={cx('Layout-header', headerClassName)}>{header}</div>
      ) : null}
      {aside ? (
        <div className={cx(`Layout-aside`, asideClassName)}>
          <div className={cx('Layout-asideWrap')}>
            <div id="asideInner" className={cx('Layout-asideInner')}>
              {aside}
            </div>
          </div>
        </div>
      ) : null}
      {body}
      {footer ? (
        <footer className={cx('Layout-footer')} role="footer">
          {footer}
        </footer>
      ) : null}
    </div>
  );
}

Layout.defaultProps = {
  // asideWide: false,
  asideFixed: true,
  asideClassName: '',
  headerFixed: true,
  offScreen: false,
  footer: false
};

export default themeable(Layout);
