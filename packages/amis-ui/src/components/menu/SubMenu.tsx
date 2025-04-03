/**
 * @file SubMenu
 * @description 导航子菜单
 * @author fex
 */

import React from 'react';
import pick from 'lodash/pick';
import {SubMenu as RcSubMenu, SubMenuProps as RcSubMenuProps} from 'rc-menu';
import {
  ClassNamesFn,
  themeable,
  autobind,
  createObject,
  TestIdBuilder,
  filter
} from 'amis-core';

import {getIcon, Icon} from '../icons';
import {Badge} from '../Badge';
import {MenuContextProps, MenuContext} from './MenuContext';
import type {NavigationItem} from './';

const DragIcon = getIcon('drag-bar') as any;

interface MenuItemTitleInfo {
  key: string;
  domEvent: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;
}

export interface SubMenuProps
  extends Omit<NavigationItem, 'children'>,
    Omit<RcSubMenuProps, 'expandIcon'> {
  depth?: number;
  icon?: string | React.ReactNode;
  children?: React.ReactNode;
  classPrefix: string;
  classnames: ClassNamesFn;
  popupClassName?: string;
  onTitleMouseEnter?: (e: MenuItemTitleInfo) => void;
  onTitleMouseLeave?: (e: MenuItemTitleInfo) => void;
  onTitleClick?: (e: MenuItemTitleInfo) => void;
  renderLink: Function;
  [propName: string]: any;
  testIdBuilder?: TestIdBuilder;
}

export class SubMenu extends React.Component<SubMenuProps> {
  static contextType = MenuContext;

  /**
   * Menu上下文数据
   *
   * @type {MenuContextProps}
   * @memberof SubMenu
   */
  context: MenuContextProps;

  /**
   * 内部使用的属性
   *
   * @memberof SubMenu
   */
  internalProps = [
    'key',
    'style',
    'className',
    'title',
    'children',
    'disabled',
    'eventKey',
    'warnKey',
    'itemIcon',
    'expandIcon',
    'onMouseEnter',
    'onMouseLeave',
    'popupClassName',
    'popupOffset',
    'onClick',
    'onTitleClick',
    'onTitleMouseEnter',
    'onTitleMouseLeave'
  ];

  @autobind
  handleSubmenuTitleActived(menuItemTitleInfo: MenuItemTitleInfo) {
    const {key, domEvent} = menuItemTitleInfo;
    const {onSubmenuClick, stacked} = this.context;
    const {onTitleClick} = this.props;

    stacked && onSubmenuClick?.({key, domEvent, props: this.props});

    onTitleClick?.({...menuItemTitleInfo, keyPath: [key]} as any);
  }

  /** 检查icon参数值是否为文件路径 */
  isImgPath(raw: string) {
    return (
      typeof raw === 'string' &&
      (!!~raw.indexOf('.') || /^\/images\//.test(raw))
    );
  }

  renderSubMenuTitle() {
    const {collapsed, stacked, mode, draggable, onDragStart} = this.context;
    const {
      classnames: cx,
      id,
      label,
      labelExtra,
      icon,
      path,
      depth,
      badge,
      badgeClassName,
      disabled,
      data: defaultData,
      extra,
      testIdBuilder,
      renderLink
    } = this.props;
    const isCollapsedNode = collapsed && depth === 1;
    const link =
      renderLink && typeof renderLink === 'function'
        ? renderLink(this.props)
        : path || '';
    const iconNode = icon ? (
      typeof icon === 'string' ? (
        this.isImgPath(icon) ? (
          <div className={cx(`Nav-Menu-item-icon`)}>
            <img width="14px" src={icon} />
          </div>
        ) : (
          <i
            key="icon"
            className={cx(`Nav-Menu-item-icon`, icon, {
              ['Nav-Menu-item-icon-collapsed']: isCollapsedNode
            })}
          />
        )
      ) : React.isValidElement(icon) ? (
        React.cloneElement(icon as React.ReactElement, {
          className: cx(`Nav-Menu-item-icon`, icon.props?.className, {
            ['Nav-Menu-item-icon-svg-collapsed']: isCollapsedNode
          })
        })
      ) : null
    ) : null;
    const labelNode =
      label && (typeof label === 'string' || Array.isArray(label)) ? (
        <span
          className={cx('Nav-Menu-item-label', {
            ['Nav-Menu-item-label-collapsed']: isCollapsedNode,
            ['Nav-Menu-item-label-subTitle']: !isCollapsedNode
          })}
          title={isCollapsedNode || Array.isArray(label) ? '' : label}
        >
          {isCollapsedNode ? label.slice(0, 1) : label}
        </span>
      ) : React.isValidElement(label) ? (
        React.cloneElement(label as any, {
          className: cx(
            'Nav-Menu-item-label',
            (label as any)?.props?.className,
            {
              ['Nav-Menu-item-label-collapsed']: isCollapsedNode,
              ['Nav-Menu-item-label-subTitle']: !isCollapsedNode
            }
          )
        })
      ) : null;
    const dragNode =
      !disabled && stacked && mode === 'inline' && !collapsed && draggable ? (
        <span
          className={cx('Nav-Menu-item-dragBar')}
          draggable
          {...testIdBuilder?.getChild('drag-bar').getTestId()}
        >
          <DragIcon />
        </span>
      ) : null;

    const renderContent = () => {
      return isCollapsedNode ? (
        <>{iconNode || labelNode}</>
      ) : (
        <>
          {dragNode}
          {iconNode}
          {labelNode}
          {labelExtra}
          {!stacked && depth === 1 ? (
            <span
              key="expand-toggle"
              className={cx('Nav-Menu-submenu-arrow')}
              {...testIdBuilder?.getChild('expand-toggle').getTestId()}
            >
              <Icon icon="right-arrow-bold" className="icon" />
            </span>
          ) : null}
        </>
      );
    };

    return (
      <div className={cx('Nav-Menu-item-wrap')}>
        <Badge
          classnames={cx}
          badge={
            badge && !isCollapsedNode // 收起模式下 不展示角标
              ? {...badge, className: badgeClassName}
              : null
          }
          data={createObject(defaultData, link)}
        >
          {/* 这里使用a标签来做事件传递标签定位 */}
          <a
            className={cx(`Nav-Menu-item-link`)}
            data-id={link?.__id || id}
            data-depth={depth}
            onDragStart={onDragStart?.(link)}
            {...testIdBuilder?.getTestId()}
            href={stacked === false && link?.to}
            onClick={e => {
              e.preventDefault();

              const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true
              });

              // 这里跳过a标签本身的跳转事件，让它继续传递让rc menu来处理
              (e.target as HTMLDivElement).parentNode?.dispatchEvent?.(
                clickEvent
              );
            }}
          >
            {renderContent()}
          </a>
        </Badge>
        {extra ? (
          <div className={cx('Nav-Menu-item-extra')}>{extra}</div>
        ) : null}
      </div>
    );
  }

  render() {
    const {popupClassName, classnames: cx, hidden, className} = this.props;
    const isDarkTheme = this.context.themeColor === 'dark';
    return hidden ? null : (
      <RcSubMenu
        {...pick(this.props, this.internalProps)}
        className={cx(
          'Nav-Menu-submenu',
          {
            ['Nav-Menu-submenu-dark']: isDarkTheme
          },
          className
        )}
        popupClassName={cx(
          {
            ['Nav-Menu-submenu-popup-dark']: isDarkTheme
          },
          popupClassName
        )}
        title={this.renderSubMenuTitle()}
        onTitleClick={this.handleSubmenuTitleActived}
      />
    );
  }
}

export default themeable(SubMenu);
