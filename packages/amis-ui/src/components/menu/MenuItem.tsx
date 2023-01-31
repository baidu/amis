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
  tooltipContainer?: React.ReactNode;
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
    'onClick'
  ];

  getDynamicStyle(hasIcon: boolean) {
    const {stacked, inlineIndent = 16} = this.context;
    const {depth} = this.props;
    const isHorizontal = !stacked;
    const defaultIndentWidth =
      typeof inlineIndent === 'number' ? inlineIndent : 16;
    const indentWidth = `(
      ${hasIcon ? 'var(--Menu-icon-size) + var(--gap-sm) +' : ''}
      ${
        depth === 1
          ? isHorizontal
            ? 'var(--Menu-Submenu-title-paddingX) * 2'
            : '0px'
          : isHorizontal
          ? `var(--Menu-Submenu-title-paddingX) + ${defaultIndentWidth}px`
          : `${defaultIndentWidth}px`
      }
    )`;

    return {
      maxWidth: isHorizontal
        ? `calc(var(--Menu-width) - ${indentWidth})`
        : `calc(100% - ${indentWidth})`
    };
  }

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
      label && typeof label === 'string' ? (
        <span
          className={cx(`Nav-Menu-item-label`, {
            ['Nav-Menu-item-label-collapsed']: isCollapsedNode
          })}
          title={isCollapsedNode ? '' : label}
          style={this.getDynamicStyle(!!iconNode)}
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
          ),
          style: this.getDynamicStyle(!!iconNode)
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
          badge={badge ? {...badge, className: badgeClassName} : null}
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
      className,
      tooltipClassName,
      classnames: cx,
      label,
      disabled,
      disabledTip,
      tooltipContainer,
      tooltipTrigger,
      depth,
      hidden
    } = this.props;
    const {collapsed, mode, stacked, themeColor, direction} = this.context;
    const showToolTip =
      stacked && mode === 'inline' && collapsed && depth === 1;

    // 多套一层div 是因为disabled情况下 RcItem触发不了tooltipwrapper的事件
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
        <div className={cx('Nav-Menu-item-tooltip-wrap')}>
          <RcItem
            {...pick(this.props, this.internalProps)}
            className={cx(className)}
          >
            {this.renderMenuItem()}
          </RcItem>
        </div>
      </TooltipWrapper>
    );
  }
}

export default themeable(MenuItem);
