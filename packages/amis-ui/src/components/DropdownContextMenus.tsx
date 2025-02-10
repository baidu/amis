/**
 * @file DropdownContextMenus
 * @desc 下拉菜单组件,用于展示上下文菜单
 */

import React from 'react';
import {themeable} from 'amis-core';
import {Icon} from './icons';
import {ThemeProps} from 'amis-core';
import PopOverContainer from './PopOverContainer';

/**
 * 菜单项配置
 */
export interface ContextMenu<T = any> {
  /** 菜单项 ID */
  id?: string;
  /** 菜单项文本 */
  label: string;
  /** 菜单项图标 */
  icon?: string;
  /** 菜单项等级 */
  level?: 'normal' | 'danger';

  className?: string;
  disabled?: boolean;
  /** 点击菜单项的回调 */
  onClick?: (item: T) => void;
}

/**
 * 组件属性定义
 */
interface DropdownContextMenusProps<T = Record<string, any>>
  extends ThemeProps {
  /** 是否禁用 */
  disabled?: boolean;
  /** 上下文数据 */
  context: T;

  /** 获取目标元素的方法 */
  getTargetElement?: (dom: HTMLElement) => HTMLElement;

  /** 上下文菜单配置，可以是数组或返回数组的函数 */
  contextMenus: ContextMenu<T>[] | ((item: T) => ContextMenu<T>[]);
  /** 上下文菜单点击回调 */
  onContextMenu?: (item: T, menu: ContextMenu<T>) => void;

  /** 弹出框容器 */
  popOverContainer?: React.ReactNode | (() => React.ReactNode);

  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 自定义类名 */
  className?: string;
}

/**
 * 下拉菜单组件
 * 用于展示上下文菜单的弹出层组件
 */
export function DropdownContextMenus<T = Record<string, any>>({
  context,
  contextMenus,
  classnames: cx,
  onContextMenu,
  popOverContainer,
  getTargetElement,
  style,
  className
}: DropdownContextMenusProps<T>) {
  const [menus, setMenus] = React.useState<ContextMenu<T>[]>([]);
  const domRef = React.useRef<HTMLElement>();

  /** 处理菜单项点击事件 */
  const handleItemClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const index = e.currentTarget.getAttribute('data-index') || '';
      const menu = menus[parseInt(index, 10)];
      if (menu) {
        menu.onClick?.(context);
        onContextMenu?.(context, menu);
      }
    },
    [menus, onContextMenu, context]
  );

  /** 渲染弹出层内容 */
  const popOverRender = React.useMemo(() => {
    return ({onClose}: any) => {
      return (
        <ul className={cx('ContextMenu-list')} onClick={onClose}>
          {Array.isArray(menus) && menus.length ? (
            menus.map((menu, index) => (
              <li
                key={`${index}`}
                className={cx('ContextMenu-item', menu.className, {
                  [`is-${menu.level}`]: menu.level && menu.level !== 'normal',
                  'is-disabled': menu.disabled
                })}
              >
                <a data-index={index} onClick={handleItemClick}>
                  {menu.icon ? (
                    <span className={cx('ContextMenu-itemIcon', menu.icon)} />
                  ) : null}
                  {menu.label}
                </a>
              </li>
            ))
          ) : (
            <li
              onClick={handleItemClick}
              className={cx('ContextMenu-item is-disabled is-placeholder')}
            >
              <a>无</a>
            </li>
          )}
        </ul>
      );
    };
  }, [menus]);

  /** 处理弹出层打开事件 */
  const handleOpen = React.useCallback(async () => {
    if (typeof contextMenus === 'function') {
      setMenus(await contextMenus(context));
    } else {
      setMenus(contextMenus);
    }
  }, [context, contextMenus]);

  /** 获取弹出层容器 */
  const getContainer = React.useCallback(() => {
    return typeof popOverContainer === 'function'
      ? popOverContainer()
      : popOverContainer || domRef.current;
  }, [popOverContainer]);

  return (
    <PopOverContainer
      popOverRender={popOverRender}
      popOverContainer={getContainer}
      onOpen={handleOpen}
    >
      {({onClick, ref: targetRef, isOpened}) => {
        const filterRef = (ref: any) => {
          domRef.current = ref;
          if (ref && getTargetElement) {
            ref = getTargetElement(ref);
          }
          targetRef(ref);
        };

        return (
          <a
            ref={filterRef}
            className={cx(
              'DropdownContextMenus',
              className,
              isOpened ? 'is-open' : ''
            )}
            onClick={onClick}
            style={style}
          >
            <Icon icon="ellipsis-v" />
          </a>
        );
      }}
    </PopOverContainer>
  );
}

export default themeable(DropdownContextMenus);
