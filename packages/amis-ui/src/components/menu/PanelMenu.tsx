/**
 * @file PanelMenu
 * @description 导航子菜单
 * @author fex
 */

import React from 'react';
import type {NavigationItem} from './';
import {ClassNamesFn, themeable} from 'amis-core';
import {Item as RcItem} from 'rc-menu';
import {MenuContextProps, MenuContext} from './MenuContext';
import Icon from '../Icon';
interface PanelMenuProps extends NavigationItem {
  cx: ClassNamesFn;
}

/**
 * 面板菜单 菜单项组件
 */
function PanelMenuItem(props: PanelMenuProps) {
  const {cx, isGroupHeader, link, label} = props;
  const context: MenuContextProps = React.useContext(MenuContext);
  const {onPanelMenuClick} = context;

  function onMenuClick({domEvent, keyPath}: any) {
    onPanelMenuClick?.({key: props.id || '', domEvent, props, keyPath});
  }

  return (
    // eventKey不传会影响rc-menu构建keyPath，影响父级菜单选中状态
    <RcItem key={props.id} eventKey={props.id} {...props} onClick={onMenuClick}>
      <div className={cx('Nav-Menu-panel-item')}>
        {!!link?.icon && (
          <span className={cx(`Nav-Menu-panel-item__icon-wrapper`)}>
            <Icon
              className={cx(`Nav-Menu-panel-item__icon`)}
              icon={link?.icon}
            />
          </span>
        )}
        <span
          className={cx(
            'Nav-Menu-panel-item__label',
            isGroupHeader ? 'is-group-header' : ''
          )}
        >
          {label}
        </span>
      </div>
    </RcItem>
  );
}

interface PanelMenuGroupProps {
  cx: ClassNamesFn;
  children?: Array<NavigationItem>;
}
/**
 * 面板菜单 菜单分组
 */
function PanelMenuGroup(props: PanelMenuGroupProps) {
  const {cx, children = []} = props;
  return (
    <div className={cx('Nav-Menu-panel-group')}>
      {children.map((child: NavigationItem) => (
        <div key={child.id} className={cx('Nav-Menu-panel-group-item')}>
          <div className={cx('Nav-Menu-panel-group-item__header')}>
            <PanelMenuItem
              cx={cx}
              {...child}
              isGroupHeader={true}
            ></PanelMenuItem>
          </div>
          {child?.children?.map((subChild: NavigationItem) => (
            <PanelMenuItem
              key={subChild.id}
              cx={cx}
              {...subChild}
            ></PanelMenuItem>
          ))}
        </div>
      ))}
    </div>
  );
}

interface PanelMenuListProps {
  cx: ClassNamesFn;
  children?: Array<NavigationItem>;
}
/**
 * 面板菜单 菜单列表
 */
function PanelMenuList(props: PanelMenuListProps) {
  const {cx, children = []} = props;
  return (
    <div className={cx('Nav-Menu-panel-list')}>
      {children.map((child: NavigationItem) => (
        <PanelMenuItem key={child.id} cx={cx} {...child}></PanelMenuItem>
      ))}
    </div>
  );
}

/**
 * 面板菜单
 */
function PanelMenu(props: NavigationItem) {
  const {classnames: cx, children = []} = props;
  // 是否有三级菜单
  const hasThirdLevelMenu = children?.some(
    (child: any) => child?.children?.length
  );
  return (
    <section key={props.id} className={cx('Nav-Menu-panel-wrapper')}>
      {hasThirdLevelMenu ? (
        <PanelMenuGroup cx={cx} children={children} />
      ) : (
        <PanelMenuList cx={cx} children={children} />
      )}
    </section>
  );
}

export default themeable(PanelMenu);
