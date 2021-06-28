/**
 * @file AsideNav
 * @description 左侧导航。
 * @author fex
 */

import React from 'react';
import {mapTree} from '../utils/helper';
import {ClassNamesFn, themeable} from '../theme';

export type LinkItem = LinkItemProps;
interface LinkItemProps {
  id?: number;
  label: string;
  hidden?: boolean;
  open?: boolean;
  active?: boolean;
  className?: string;
  children?: Array<LinkItem>;
  path?: string;
  icon?: string;
  component?: React.ReactType;
}

export interface Navigation {
  label: string;
  children: Array<LinkItem>;
  prefix?: JSX.Element;
  affix?: JSX.Element;
  className?: string;
  [propName: string]: any;
}

export interface AsideNavProps {
  id?: string;
  className?: string;
  classPrefix: string;
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
    renderLink: (item: LinkItemProps) => <a>{item.label}</a>,
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

    const isOpen = props.isOpen;
    let id = 1;
    this.state = {
      navigations: mapTree(
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
      )
    };

    this.renderLink = this.renderLink.bind(this);
    this.toggleExpand = this.toggleExpand.bind(this);
  }

  componentDidUpdate(prevProps: AsideNavProps) {
    const props = this.props;
    const isOpen = prevProps.isOpen;

    if (
      prevProps.navigations !== props.navigations ||
      prevProps.isActive !== props.isActive
    ) {
      let id = 1;
      this.setState({
        navigations: mapTree(
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
        )
      });
    }
  }

  toggleExpand(link: LinkItemProps, e?: React.MouseEvent<HTMLElement>) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    this.setState({
      navigations: mapTree(
        this.state.navigations,
        (item: Navigation) => ({
          ...item,
          open: link.id === item.id ? !item.open : item.open
        }),
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
}

export default themeable(AsideNav);
