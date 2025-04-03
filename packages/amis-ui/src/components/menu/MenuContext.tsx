/**
 * @file Menu
 * @description 导航菜单上下文
 * @author fex
 */

import {createContext} from 'react';
import type {SubMenuProps} from './SubMenu';
import type {NavigationItem} from './';
export interface MenuContextProps {
  /**
   * 主题色
   *
   * @type {('light' | 'dark')}
   * @memberof MenuContextProps
   */
  themeColor: 'light' | 'dark';

  /**
   * 导航模式
   *
   * @type {(true | false)}
   * @memberof MenuContextProps
   */
  stacked?: true | false;
  /**
   * 布局
   *
   * @type {('inline' | 'float' | 'panel')}
   * @memberof MenuContextProps
   */
  mode?: 'inline' | 'float' | 'panel';

  /**
   * mode不为horizontal时
   *
   * @type {boolean}
   * @memberof MenuContextProps
   */
  collapsed?: boolean;

  /**
   * 布局方向
   *
   * @type {('ltr' | 'rtl')}
   * @memberof MenuContextProps
   */
  direction?: 'ltr' | 'rtl';

  /**
   * 统一路由前缀
   *
   * @type {string}
   * @memberof MenuContextProps
   */
  prefix?: string;

  /**
   * 垂直导航水平缩进值
   */
  inlineIndent?: number;

  /**
   * 手风琴模式
   */
  accordion?: boolean;

  /**
   * 是否可拖拽排序
   */
  draggable?: boolean;

  /**
   * 触发访问带有子菜单的父级路由
   */
  onSubmenuClick?: (SubmenuInfo: {
    key: string;
    domEvent: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;
    props: SubMenuProps;
  }) => void;

  /**
   * 面板菜单中的菜单项点击事件
   */
  onPanelMenuClick?: (PanelItemMenuInfo: {
    key: string;
    domEvent: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;
    keyPath: string[];
    props: NavigationItem;
  }) => void;

  onDragStart?: (
    link: any
  ) => (event: React.DragEvent<HTMLAnchorElement>) => void;
}

export const MenuContext = createContext<MenuContextProps>({
  themeColor: 'light',
  stacked: true,
  mode: 'inline',
  collapsed: false,
  direction: 'ltr',
  prefix: '',
  inlineIndent: 15,
  accordion: false,
  draggable: false
});
