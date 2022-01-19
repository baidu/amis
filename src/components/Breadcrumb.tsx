/**
 * @file Breadcrumb 面包屑
 */

import React from 'react';
import TooltipWrapper, {Trigger} from './TooltipWrapper';
import {ClassNamesFn, themeable} from '../theme';
import {RendererProps} from '../factory';
import {filter} from '../utils/tpl';
import {RootClose} from '../utils/RootClose';
import {noop} from '../utils/helper';
import {Icon} from '../components/icons';
import {generateIcon} from '../utils/icon';
import {
  BreadcrumbProps,
  tooltipPositionType,
  BreadcrumbItemSchema,
  BreadcrumbBaseItemSchema
} from '../renderers/Breadcrumb';

export type itemPlace = 'start' | 'middle' | 'end';

interface BreadcrumbItemProps extends Omit<RendererProps, 'data'>,
  Omit<BreadcrumbItemSchema, 'type' | 'className'> {
  itemClassName?: string;
  dropdownClassName?: string;
  classnames: ClassNamesFn;
  itemPlace: itemPlace;
  tooltipContainer?: any;
}

interface BreadcrumbItemState {
  isOpened: boolean;
  tooltipTrigger: Trigger | Array<Trigger>;
  tooltipRootClose: boolean;
}

/**
 * Breadcrumb 面包屑类
 */
export class Breadcrumb extends React.Component<BreadcrumbProps> {
  constructor(props: BreadcrumbProps) {
    super(props);
  }

  Item: typeof BreadcrumbItem;

  render() {
    const cx = this.props.classnames;
    const {
      className,
      separatorClassName,
      items,
      data,
      separator,
      env,
      tooltipPosition,
      ...restProps
    } = this.props;

    const tooltipContainer = env && env.getModalContainer ? env.getModalContainer : undefined;

    const crumbsLength = items?.length;
    const crumbs = items.map<React.ReactNode>((item, index) => {
      let itemPlace: itemPlace = 'middle';
      if (index === 0) {
        itemPlace = 'start';
      }
      if (index === crumbsLength - 1) {
        itemPlace = 'end';
      }
      // 从data中获取动态label数据
      item.label = filter(item.label, data);
      return (
        <BreadcrumbItem
          item={item}
          itemPlace={itemPlace}
          tooltipContainer={tooltipContainer}
          tooltipPosition={tooltipPosition}
          key={index}
          {...restProps}
        ></BreadcrumbItem>
      )
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

    return (
      <div className={cx('Breadcrumb', className)}>{crumbs}</div>
    );
  }
}

/**
 * BreadcrumbItem 面包项类
 */
export class BreadcrumbItem extends React.Component<BreadcrumbItemProps, BreadcrumbItemState> {
  static defaultProps: Pick<BreadcrumbItemProps, 'tooltipPosition'> = {
    tooltipPosition: 'top',
  };

  constructor(props: BreadcrumbItemProps) {
    super(props);
    this.toogle = this.toogle.bind(this);
    this.close = this.close.bind(this);
    this.domRef = this.domRef.bind(this);
  }

  target: any;

  state: BreadcrumbItemState = {
    tooltipTrigger: ['hover', 'focus'],
    tooltipRootClose: false,
    isOpened: false
  };

  domRef(ref: any) {
    this.target = ref;
  }

  toogle(e: React.MouseEvent<any>) {
    e.preventDefault();

    this.setState({
      isOpened: !this.state.isOpened
    });
  }

  close() {
    this.setState({
      isOpened: false
    });
  }

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
    item: BreadcrumbBaseItemSchema,
    label?: string,
  ) {
    const {
      classnames: cx,
      render
    } = this.props;
    if (showHref) {
      return (
        <a href={item.href} className={cx('Breadcrumb-item-' + itemType)}>
          {item.icon
            ? generateIcon(cx, item.icon, 'Icon', 'Breadcrumb-icon')
            : null}
          {render('label', label)}
        </a>
      );
    }
    return (
      <span className={cx('Breadcrumb-item-' + itemType)}>
        {item.icon
          ? generateIcon(cx, item.icon, 'Icon', 'Breadcrumb-icon')
          : null}
        {render('label', label)}
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
    item: BreadcrumbBaseItemSchema,
    tooltipPosition: tooltipPositionType,
    itemPlace: itemPlace,
    itemType: 'default' | 'dropdown'
  ) {
    const {
      labelMaxLength,
      tooltipContainer
    } = this.props;
    const {
      tooltipTrigger,
      tooltipRootClose
    } = this.state;
    const pureLabel = item.label ? item.label.replace(/<\/?.+?>/g, '') : '';
    // 限制最大展示长度的最小值
    const maxLength = +labelMaxLength > 1 ? +labelMaxLength : 1;
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
          {this.renderBreadcrumbBaseItem(true, itemType, item, pureLabel.substring(0, maxLength) + '...')}
        </TooltipWrapper>
      );
    }
    if (!item.href || itemPlace === 'end') {
      return this.renderBreadcrumbBaseItem(false, itemType, item, item.label);
    }
    return this.renderBreadcrumbBaseItem(true, itemType, item, item.label);
  }

  /**
   * 渲染下拉菜单节点
   * @param dropdown 面包项下拉菜单
   * @returns 
   */
  renderDropdownNode(dropdown: BreadcrumbBaseItemSchema[]) {
    const {
      dropdownClassName,
      closeOnClick,
      classnames: cx
    } = this.props;
    return (
      <RootClose
        disabled={!this.state.isOpened}
        onRootClose={this.close}
      >
        {(ref: any) => {
          return (
            <ul
              className={cx('Breadcrumb-dropdown', dropdownClassName)}
              onClick={closeOnClick ? this.close : noop}
              ref={ref}
            >
              {Array.isArray(dropdown) 
                && dropdown.map((menuItem: BreadcrumbBaseItemSchema, index: number) => {
                return (
                  <li key={'dropdown-item' + index}>
                    {this.renderBreadcrumbNode(menuItem, 'right', 'middle', 'dropdown')}
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
    const {
      itemClassName,
      item,
      itemPlace,
      tooltipPosition,
      classnames: cx
    } = this.props;
    const {dropdown, ...restItemProps} = item;
    return (
      <span
        className={cx('Breadcrumb-item', itemClassName,
          {
            'is-opened': this.state.isOpened
          },
          {
            'Breadcrumb-item-last': itemPlace === 'end'
          }
        )}
        ref={this.domRef}
      >
        {this.renderBreadcrumbNode({...restItemProps}, tooltipPosition, itemPlace, 'default')}
        {dropdown ? (
          <span onClick={this.toogle} className={cx('Breadcrumb-item-caret')}>
            <Icon icon="caret" className="icon" />
          </span>
        ): null}
        {this.state.isOpened ? this.renderDropdownNode(dropdown) : null}
      </span>
    );
  }
}

export default themeable(Breadcrumb);