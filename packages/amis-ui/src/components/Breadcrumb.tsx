/**
 * @file Breadcrumb 面包屑
 */

import React from 'react';
import TooltipWrapper, {Trigger} from './TooltipWrapper';
import {ClassNamesFn, themeable, ThemeProps} from 'amis-core';
import {RootClose} from 'amis-core';
import {removeHTMLTag} from 'amis-core';
import {Icon} from './icons';
import {generateIcon} from 'amis-core';

export type ItemPlace = 'start' | 'middle' | 'end';
export type TooltipPositionType = 'top' | 'bottom' | 'left' | 'right';

interface BreadcrumbItemState {
  isOpened: boolean;
  tooltipTrigger: Trigger | Array<Trigger>;
  tooltipRootClose: boolean;
}

interface BreadcrumbBaseItem {
  href: string;
  icon?: string;
  label?: string;
  dropdown?: Array<BreadcrumbBaseItem>;
}

interface BreadcrumbItemProps {
  item: BreadcrumbBaseItem;
  itemPlace: ItemPlace;
  labelMaxLength?: number;
  tooltipContainer?: any;
  tooltipPosition?: TooltipPositionType;
  classnames: ClassNamesFn;
  [propName: string]: any;
}

interface BreadcrumbProps extends ThemeProps {
  tooltipContainer?: any;
  tooltipPosition?: TooltipPositionType;
  items: Array<BreadcrumbBaseItem>;
  [propName: string]: any;
}

/**
 * Breadcrumb 面包屑类
 */
export class Breadcrumb extends React.Component<BreadcrumbProps> {
  Item: typeof BreadcrumbItem;

  static defaultProps: Pick<
    BreadcrumbProps,
    'separator' | 'labelMaxLength' | 'tooltipPosition'
  > = {
    separator: '>',
    labelMaxLength: 16,
    tooltipPosition: 'top'
  };

  render() {
    const cx = this.props.classnames;
    const {className, separatorClassName, items, separator, ...restProps} =
      this.props;

    const crumbsLength = items?.length;
    if (!crumbsLength) {
      return <div className={cx('Breadcrumb', className)}></div>;
    }

    const crumbs = items
      .map<React.ReactNode>((item, index) => {
        let itemPlace: ItemPlace = 'middle';
        if (index === 0) {
          itemPlace = 'start';
        }
        if (index === crumbsLength - 1) {
          itemPlace = 'end';
        }
        return (
          <BreadcrumbItem
            {...restProps}
            item={item}
            itemPlace={itemPlace}
            key={index}
          ></BreadcrumbItem>
        );
      })
      .reduce((prev, curr, index) => [
        prev,
        <span
          className={cx('Breadcrumb-separator', separatorClassName)}
          key={`separator-${index}`}
        >
          {separator}
        </span>,
        curr
      ]);

    return <div className={cx('Breadcrumb', className)}>{crumbs}</div>;
  }
}

/**
 * BreadcrumbItem 面包项类
 */
export class BreadcrumbItem extends React.Component<
  BreadcrumbItemProps,
  BreadcrumbItemState
> {
  target: any;

  state: BreadcrumbItemState = {
    tooltipTrigger: ['hover', 'focus'],
    tooltipRootClose: false,
    isOpened: false
  };

  domRef = (ref: any) => {
    this.target = ref;
  };

  toogle = (e: React.MouseEvent<any>) => {
    e.preventDefault();

    this.setState({
      isOpened: !this.state.isOpened
    });
  };

  close = () => {
    this.setState({
      isOpened: false
    });
  };

  /**
   * 渲染基础面包项
   * @param showHref 是否显示超链接
   * @param itemType 基础面包项类型
   * @param item 面包项
   * @param label 渲染文本
   * @returns
   */
  renderBreadcrumbBaseItem(
    showHref: boolean,
    itemType: 'default' | 'dropdown',
    item: BreadcrumbBaseItem,
    label?: string
  ) {
    const {itemClassName, dropdownItemClassName, classnames: cx} = this.props;
    const baseItemClassName =
      itemType === 'default' ? itemClassName : dropdownItemClassName;
    if (showHref) {
      return (
        <a
          href={item.href}
          className={cx('Breadcrumb-item-' + itemType, baseItemClassName)}
        >
          {item.icon
            ? generateIcon(cx, item.icon, 'Icon', 'Breadcrumb-icon')
            : null}
          <span className={cx('TplField')}>{label}</span>
        </a>
      );
    }
    return (
      <span className={cx('Breadcrumb-item-' + itemType, baseItemClassName)}>
        {item.icon
          ? generateIcon(cx, item.icon, 'Icon', 'Breadcrumb-icon')
          : null}
        <span className={cx('TplField')}>{label}</span>
      </span>
    );
  }

  /**
   * 渲染基础面包项完整节点
   * @param item 面包项
   * @param tooltipPosition 浮窗提示位置
   * @param itemPlace 面包香所在相对位置
   * @param itemType 基础面包项类型
   * @returns
   */
  renderBreadcrumbNode(
    item: BreadcrumbBaseItem,
    tooltipPosition: TooltipPositionType = 'top',
    itemPlace: ItemPlace,
    itemType: 'default' | 'dropdown'
  ) {
    const {labelMaxLength, tooltipContainer} = this.props;
    const {tooltipTrigger, tooltipRootClose} = this.state;
    const pureLabel = item.label ? removeHTMLTag(item.label) : '';
    // 限制最大展示长度的最小值
    const maxLength =
      labelMaxLength && +labelMaxLength > 1 ? +labelMaxLength : 1;
    // 面包项相对位置为 middle ，且超过最大展示长度的面包项，进行缩略展示，并使用浮窗提示
    if (pureLabel.length > maxLength && itemPlace === 'middle') {
      return (
        <TooltipWrapper
          tooltip={pureLabel}
          placement={tooltipPosition}
          container={tooltipContainer}
          trigger={tooltipTrigger}
          rootClose={tooltipRootClose}
        >
          {this.renderBreadcrumbBaseItem(
            true,
            itemType,
            item,
            pureLabel.substring(0, maxLength) + '...'
          )}
        </TooltipWrapper>
      );
    }
    const showHref = !item.href || itemPlace === 'end';
    return this.renderBreadcrumbBaseItem(!showHref, itemType, item, pureLabel);
  }

  /**
   * 渲染下拉菜单节点
   * @param dropdown 面包项下拉菜单
   * @returns
   */
  renderDropdownNode(dropdown: BreadcrumbBaseItem[]) {
    const {dropdownClassName, classnames: cx} = this.props;
    return (
      <RootClose disabled={!this.state.isOpened} onRootClose={this.close}>
        {(ref: any) => {
          return (
            <ul
              className={cx('Breadcrumb-dropdown', dropdownClassName)}
              onClick={this.close}
              ref={ref}
            >
              {Array.isArray(dropdown) &&
                dropdown.map((menuItem: BreadcrumbBaseItem, index: number) => {
                  return (
                    <li key={'dropdown-item' + index}>
                      {this.renderBreadcrumbNode(
                        menuItem,
                        'right',
                        'middle',
                        'dropdown'
                      )}
                    </li>
                  );
                })}
            </ul>
          );
        }}
      </RootClose>
    );
  }

  render() {
    const {item, itemPlace, tooltipPosition, classnames: cx} = this.props;
    const {dropdown, ...restItemProps} = item;
    return (
      <span
        className={cx(
          'Breadcrumb-item',
          {
            'is-opened': this.state.isOpened
          },
          {
            'Breadcrumb-item-last': itemPlace === 'end'
          }
        )}
        ref={this.domRef}
      >
        {this.renderBreadcrumbNode(
          {...restItemProps},
          tooltipPosition,
          itemPlace,
          'default'
        )}
        {dropdown ? (
          <span onClick={this.toogle} className={cx('Breadcrumb-item-caret')}>
            <Icon icon="down" className="icon" />
          </span>
        ) : null}
        {dropdown && this.state.isOpened
          ? this.renderDropdownNode(dropdown)
          : null}
      </span>
    );
  }
}

export default themeable(Breadcrumb);
