/**
 * @file AsideNav
 * @description 左侧导航。
 * @author fex
 */

import React from 'react';
import {TestIdBuilder, mapTree} from 'amis-core';
import {ClassNamesFn, themeable} from 'amis-core';

export type LinkItem = LinkItemProps;
interface LinkItemProps {
  id?: number;
  parentIds?: number[];
  label: string;
  hidden?: boolean;
  open?: boolean;
  active?: boolean;
  className?: string;
  children?: Array<LinkItem>;
  path?: string;
  icon?: string;
  component?: React.ElementType;
  testIdBuilder?: TestIdBuilder;
}

export interface Navigation {
  label: string;
  children?: Array<LinkItem>;
  prefix?: JSX.Element;
  affix?: JSX.Element;
  className?: string;
  [propName: string]: any;
}

export interface AsideNavProps {
  id?: string;
  className?: string;
  classPrefix: string;
  folded?: boolean;
  classnames: ClassNamesFn;
  renderLink: Function;
  isActive: Function;
  isOpen: (link: LinkItemProps) => boolean;
  navigations: Array<Navigation>;
  renderSubLinks: (
    link: LinkItemProps,
    renderLink: Function,
    depth: number,
    props: AsideNavProps
  ) => React.ReactNode;
}

interface AsideNavState {
  navigations: Array<Navigation>;
}

export class AsideNav extends React.Component<AsideNavProps, AsideNavState> {
  static defaultProps = {
    renderLink: (item: LinkItemProps) => (
      <a {...item.testIdBuilder?.getTestId()}>{item.label}</a>
    ),
    renderSubLinks: (
      link: LinkItemProps,
      renderLink: Function,
      depth: number,
      {classnames: cx}: AsideNavProps
    ) =>
      link.children && link.children.length ? (
        <ul className={cx('AsideNav-subList')}>
          {link.label ? (
            <li key="subHeader" className={cx('AsideNav-subHeader')}>
              {renderLink(
                {
                  ...link,
                  children: undefined
                },
                'subHeader',
                {},
                depth
              )}
            </li>
          ) : null}
          {link.children.map((link, key) =>
            renderLink(link, key, {}, depth + 1)
          )}
        </ul>
      ) : link.label && depth === 1 ? (
        <div className={cx('AsideNav-tooltip')}>{link.label}</div>
      ) : null,
    isActive: (link: LinkItem) => link.open,
    isOpen: (item: LinkItemProps) =>
      item.children ? item.children.some(item => item.open) : false
  };

  constructor(props: AsideNavProps) {
    super(props);

    this.state = {
      navigations: this.prepareNavigations(props)
    };

    this.renderLink = this.renderLink.bind(this);
    this.toggleExpand = this.toggleExpand.bind(this);
    this.handleSubMenuHover = this.handleSubMenuHover.bind(this);
    this.handleSubMenuLeave = this.handleSubMenuLeave.bind(this);
  }

  componentDidUpdate(prevProps: AsideNavProps) {
    const props = this.props;

    if (
      prevProps.navigations !== props.navigations ||
      prevProps.isActive !== props.isActive
    ) {
      this.setState({
        navigations: this.prepareNavigations(props, prevProps)
      });
    }
  }

  private prepareNavigations(
    props: AsideNavProps,
    prevProps?: AsideNavProps
  ): Navigation[] {
    const isOpen = prevProps?.isOpen || props.isOpen;
    let id = 1;
    const navigations = mapTree(
      props.navigations,
      (item: Navigation) => {
        const isActive =
          typeof item.active === 'undefined'
            ? (props.isActive as Function)(item)
            : item.active;

        return {
          ...item,
          id: id++,
          active: isActive,
          open: isActive || isOpen(item as LinkItemProps)
        };
      },
      1,
      true
    );
    return mapTree(
      navigations,
      (
        item: Navigation,
        key: number,
        level: number,
        paths: Array<Navigation>,
        indexes: Array<number>
      ) => {
        return {
          ...item,
          parentIds: paths.map(item => item.id)
        };
      },
      1,
      true
    );
  }

  toggleExpand(link: LinkItemProps, e?: React.MouseEvent<HTMLElement>) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    this.setState({
      navigations: mapTree(
        this.state.navigations,
        item => {
          // 切换当前节点
          if (link.id === item.id) {
            return {
              ...item,
              open: !item.open
            };
          }
          // 如果未打开，或者边栏不是折叠状态，不用处理
          if (!this.props.folded) {
            return item;
          }
          // 祖辈节点保持打开状态
          if (link.parentIds!.some(id => id === item.parentId)) {
            return {
              ...item,
              open: true
            };
          }
          // 折叠状态下，关闭所有非祖辈节点
          return {
            ...item,
            open: false
          };
        },
        1,
        true
      )
    });
  }

  renderLink(
    link: LinkItemProps,
    key: any,
    props: Partial<AsideNavProps> = {},
    depth = 1
  ): React.ReactNode {
    const {
      folded,
      renderLink,
      isActive,
      renderSubLinks,
      classnames: cx,
      ...others
    } = this.props;

    const dom = (renderLink as Function)({
      link,
      active: link.active,
      open: link.open,
      toggleExpand: this.toggleExpand,
      depth,
      classnames: cx,
      subHeader: key === 'subHeader',
      ...others
    });

    if (!dom) {
      return;
    } else if (key === 'subHeader') {
      return React.cloneElement(dom, {
        key
      });
    }

    return (
      <li
        {...props}
        key={key}
        className={cx(`AsideNav-item`, link.className, {
          [`is-open`]: link.open,
          [`is-active`]: link.active
        })}
        onMouseEnter={
          !folded || !link.children || !link.children.length
            ? undefined
            : e => {
              if (!link.open) {
                this.toggleExpand(link, e);
              }
              const subMenuElement = e.currentTarget.querySelector(
                `.${cx('AsideNav-subList')}`
              ) as HTMLElement;
              if (subMenuElement && link.id) {
                this.handleSubMenuHover(link.id!, subMenuElement);
              }
            }
        }
        onMouseLeave={
          !folded || !link.children || !link.children.length
            ? undefined
            : e => {
              if (link.open) {
                this.toggleExpand(link, e);
              }
              const subMenuElement = e.currentTarget.querySelector(
                `.${cx('AsideNav-subList')}`
              ) as HTMLElement;
              if (subMenuElement && link.id) {
                this.handleSubMenuLeave(link.id, subMenuElement);
              }
            }
        }
      >
        {dom}
        {renderSubLinks(link, this.renderLink, depth, this.props)}
      </li>
    );
  }

  render() {
    const navigations = this.state.navigations;
    let links: Array<React.ReactNode> = [];
    const {className, classnames: cx} = this.props;

    navigations.forEach((navigation, index) => {
      if (!Array.isArray(navigation.children)) {
        return;
      }

      if (navigation.prefix) {
        const prefix: JSX.Element =
          typeof navigation.prefix === 'function'
            ? (navigation.prefix as any)(this.props)
            : navigation.prefix;
        links.push(
          React.cloneElement(prefix, {
            ...prefix.props,
            key: `${index}-prefix`
          })
        );
      }

      navigation.label &&
        links.push(
          <li
            key={`${index}-label`}
            className={cx(`AsideNav-label`, navigation.className)}
          >
            <span>{navigation.label}</span>
          </li>
        );

      navigation.children.forEach((item, key) => {
        const link = this.renderLink(item, `${index}-${key}`);
        link && links.push(link);
      });

      if (navigation.affix) {
        const affix: JSX.Element =
          typeof navigation.affix === 'function'
            ? (navigation.affix as any)(this.props)
            : navigation.affix;
        links.push(
          React.cloneElement(affix, {
            ...affix.props,
            key: `${index}-affix`
          })
        );
      }
    });

    return (
      <nav className={cx(`AsideNav`, className)}>
        <ul className={cx(`AsideNav-list`)}>{links}</ul>
      </nav>
    );
  }

  handleSubMenuHover(linkId: number, subMenuElement: HTMLElement) {
    if (!this.props.folded || !subMenuElement) return;

    const { classnames: cx } = this.props;

    // 获取父级菜单项的位置信息
    const parentElement = subMenuElement.closest(
      `.${cx('AsideNav-item')}`
    ) as HTMLElement;
    if (!parentElement) return;

    const parentRect = parentElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // 重置所有属性
    subMenuElement.removeAttribute('data-pop-direction');
    subMenuElement.removeAttribute('data-pop-vertical');

    // 临时显示子菜单以获取其真实尺寸
    const originalDisplay = subMenuElement.style.display;
    const originalOpacity = subMenuElement.style.opacity;
    const originalHeight = subMenuElement.style.height;
    const originalMaxHeight = subMenuElement.style.maxHeight;

    subMenuElement.style.display = 'block';
    subMenuElement.style.opacity = '0';
    subMenuElement.style.height = 'auto';
    subMenuElement.style.maxHeight = 'none';

    const rect = subMenuElement.getBoundingClientRect();

    // 恢复原始样式
    subMenuElement.style.display = originalDisplay;
    subMenuElement.style.opacity = originalOpacity;
    subMenuElement.style.height = originalHeight;
    subMenuElement.style.maxHeight = originalMaxHeight;

    // 检测水平方向是否溢出
    const willOverflowRight = rect.right > viewportWidth;

    // 检测垂直方向溢出情况
    const spaceBelow = viewportHeight - parentRect.bottom;
    const spaceAbove = parentRect.top;
    const subMenuHeight = rect.height;

    // 判断是否需要向上展开
    const shouldExpandUp = spaceBelow < subMenuHeight && spaceAbove > spaceBelow;

    // 设置水平方向
    if (willOverflowRight) {
      subMenuElement.setAttribute('data-pop-direction', 'left');
    }

    // 设置垂直方向
    if (shouldExpandUp) {
      subMenuElement.setAttribute('data-pop-vertical', 'up');
    }
  }

  handleSubMenuLeave(linkId: number, subMenuElement: HTMLElement) {
    // 只在折叠状态下处理
    if (!this.props.folded || !subMenuElement) return;

    // 清除所有调整属性
    subMenuElement.removeAttribute('data-pop-direction');
    subMenuElement.removeAttribute('data-pop-vertical');
  }
}

export default themeable(AsideNav);
