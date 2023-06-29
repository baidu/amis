/**
 * @file MenuItem
 * @description 导航项目
 * @author fex
 */

import React from 'react';
import pick from 'lodash/pick';
import {Item as RcItem, MenuItemProps as RcMenuItemProps} from 'rc-menu';
import {ClassNamesFn, themeable, createObject} from 'amis-core';

import {Badge} from '../Badge';
import {getIcon} from '../icons';
import TooltipWrapper, {Trigger} from '../TooltipWrapper';
import {MenuContextProps, MenuContext} from './MenuContext';
import type {NavigationItem} from './';

const DragIcon = getIcon('drag-bar') as any;

export interface MenuItemProps
  extends Omit<NavigationItem, 'children'>,
    RcMenuItemProps {
  depth?: number;
  icon?: string | React.ReactNode;
  children?: React.ReactNode;
  classPrefix: string;
  classnames: ClassNamesFn;
  tooltipClassName?: string;
  tooltipContainer?: HTMLElement | (() => HTMLElement);
  tooltipTrigger?: Trigger | Array<Trigger>;
  renderLink: Function;
  extra?: React.ReactNode;
}

export class MenuItem extends React.Component<MenuItemProps> {
  static defaultProps: Pick<MenuItemProps, 'tooltipTrigger' | 'disabled'> = {
    disabled: false,
    tooltipTrigger: ['hover', 'focus']
  };

  static contextType = MenuContext;

  // container: React.RefObject<any> = React.createRef();

  /**
   * Menu上下文数据
   *
   * @type {MenuContextProps}
   * @memberof MenuItem
   */
  context: MenuContextProps;

  /**
   * 内部使用的属性
   *
   * @memberof MenuItem
   */
  internalProps = [
    'children',
    'eventKey',
    'warnKey',
    'disabled',
    'itemIcon',
    'attribute',
    'onMouseEnter',
    'onMouseLeave',
    'onClick',
    'className'
  ];

  /** 检查icon参数值是否为文件路径 */
  isImgPath(raw: string) {
    return (
      typeof raw === 'string' &&
      (!!~raw.indexOf('.') || /^\/images\//.test(raw))
    );
  }

  renderMenuItem() {
    const {collapsed, draggable, stacked, mode, onDragStart} = this.context;
    const {
      classnames: cx,
      icon,
      label,
      labelExtra,
      path,
      depth,
      badge,
      badgeClassName,
      renderLink,
      extra,
      disabled,
      id,
      data: defaultData
    } = this.props;
    const isCollapsedNode = collapsed && depth === 1;
    const iconNode = icon ? (
      typeof icon === 'string' ? (
        this.isImgPath(icon) ? (
          <div className={cx(`Nav-Menu-item-icon`)}>
            <img width="14px" src={icon} />
          </div>
        ) : (
          <i
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
          className={cx(`Nav-Menu-item-label`, {
            ['Nav-Menu-item-label-collapsed']: isCollapsedNode
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
        <span className={cx('Nav-Menu-item-dragBar')} draggable>
          <DragIcon />
        </span>
      ) : null;

    const link =
      renderLink && typeof renderLink === 'function'
        ? renderLink(this.props)
        : path || '';

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
          <a
            className={cx('Nav-Menu-item-link')}
            title={typeof link?.label === 'string' ? link?.label : undefined}
            data-id={link?.__id || id}
            data-depth={depth}
            onDragStart={onDragStart?.(link)}
          >
            {isCollapsedNode ? (
              <>{iconNode || labelNode}</>
            ) : (
              <>
                {dragNode}
                {iconNode}
                {labelNode}
                {labelExtra}
              </>
            )}
          </a>
        </Badge>
        {extra ? (
          <div className={cx('Nav-Menu-item-extra')}>{extra}</div>
        ) : null}
      </div>
    );
  }

  render() {
    const {
      tooltipClassName,
      classnames: cx,
      label,
      disabled,
      disabledTip,
      tooltipContainer,
      tooltipTrigger,
      depth,
      hidden,
      order,
      overflowedIndicator,
      overflowMaxCount
    } = this.props;
    const {collapsed, mode, stacked, themeColor, direction} = this.context;
    const showToolTip =
      stacked && mode === 'inline' && collapsed && depth === 1;
    const isMaxOverflow = overflowedIndicator && overflowMaxCount;

    // 多套一层ul 是因为disabled情况下 RcItem触发不了tooltipwrapper的事件
    // 横向模式使用rc-overflow rc-overflow中会给li设置一个order属性
    // 这里的ul可能和rc-overflow里的li并列 就导致展示顺序不正确 因此给url也设置一个order属性
    // 当启用响应式收纳且设置了maxVisibleCount rc-overflow不会设置order属性 因此这种情况下ul也不需要设置
    return hidden ? null : (
      <TooltipWrapper
        tooltipClassName={cx('Nav-Menu-item-tooltip', tooltipClassName, {
          ['Nav-Menu-item-tooltip-dark']: themeColor === 'dark'
        })}
        placement={direction === 'rtl' ? 'left' : 'right'}
        tooltip={disabled ? disabledTip : showToolTip ? label : ''}
        container={tooltipContainer}
        trigger={tooltipTrigger}
        rootClose
      >
        <ul
          className={cx('Nav-Menu-item-tooltip-wrap')}
          style={isMaxOverflow ? {} : {order}}
        >
          <RcItem {...pick(this.props, this.internalProps)}>
            {this.renderMenuItem()}
          </RcItem>
        </ul>
      </TooltipWrapper>
    );
  }
}

export default themeable(MenuItem);
