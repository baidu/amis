/**
 * @file AnchorNav
 * @description 锚点导航
 * @author hsm-lv
 */

import React from 'react';
import {ThemeProps, themeable} from 'amis-core';

import {autobind} from 'amis-core';
import {uncontrollable} from 'amis-core';
import find from 'lodash/find';
import type {Schema} from 'amis-core';

export interface AnchorNavSectionProps extends ThemeProps {
  title?: string; // 标题
  name: string | number; // 标识
  body?: Schema; // Schema
  className?: string; // 样式名
  style?: any;
  children?: React.ReactNode | Array<React.ReactNode>;
}

class AnchorNavSectionComponent extends React.PureComponent<AnchorNavSectionProps> {
  contentDom: any;
  contentRef = (ref: any) => (this.contentDom = ref);

  render() {
    const {classnames: cx, children, className, name} = this.props;

    return (
      <div
        ref={this.contentRef}
        className={cx('AnchorNav-section', className)}
        data-id={name + ''}
      >
        {children}
      </div>
    );
  }
}

export const AnchorNavSection = themeable(AnchorNavSectionComponent);

export interface AnchorNavProps extends ThemeProps {
  links?: Array<AnchorNavSectionProps>; // 锚点数据
  active?: string | number; // 激活标识
  linkClassName?: string; // 导航 CSS类名
  sectionClassName?: string; // 区域 CSS类名
  sectionRender?: (
    section: AnchorNavSectionProps,
    props?: AnchorNavProps
  ) => JSX.Element; // 锚点区域渲染器
  onSelect?: (key: string | number) => void; // 选中回调方法
  direction?: 'vertical' | 'horizontal'; // 导航方向
  children?: React.ReactNode | Array<React.ReactNode>;
}

export class AnchorNav extends React.Component<AnchorNavProps> {
  static defaultProps: Pick<
    AnchorNavProps,
    'linkClassName' | 'sectionClassName' | 'direction'
  > = {
    linkClassName: '',
    sectionClassName: '',
    direction: 'vertical'
  };

  // 滚动区域DOM
  contentDom: React.RefObject<HTMLDivElement> = React.createRef();

  // 后代节点观察器
  observer: IntersectionObserver;

  sections: {
    key: string | number;
    element: HTMLDivElement;
    isIntersecting?: boolean;
  }[] = [];

  fromSelect: boolean = false;
  fromSelectTimer: any;

  componentDidMount() {
    this.observer = new IntersectionObserver(this.scrollToNav);
    this.sections.forEach(item => {
      this.observer.observe(item.element);
    });
    if (this.props.active) {
      this.scrollToSection(this.props.active);
    }
  }

  componentWillUnmount() {
    this.observer.disconnect();
  }

  @autobind
  scrollToNav(entries: IntersectionObserverEntry[]) {
    entries.forEach(entry => {
      const key = entry.target.getAttribute('data-id');
      const currentSection = this.sections.find(item => item.key === key);
      if (currentSection) {
        currentSection.isIntersecting = entry.isIntersecting;
      }
    });
    // 找到第一个可见的区域
    const firstIntersectingSection = this.sections.find(
      item => item.isIntersecting
    );
    if (!this.fromSelect) {
      firstIntersectingSection && this.fireSelect(firstIntersectingSection.key);
    } else {
      // 滚动结束后，重置fromSelect状态
      if (this.fromSelectTimer) {
        clearTimeout(this.fromSelectTimer);
      }
      this.fromSelectTimer = setTimeout(() => {
        this.fromSelect = false;
      }, 300);
    }
  }

  scrollToSection(key: string | number) {
    this.fromSelect = true;
    const node = find(this.sections, item => item.key === key)?.element;
    node?.scrollIntoView?.({behavior: 'smooth'});
  }

  handleSelect(key: string | number) {
    this.scrollToSection(key);
    this.fireSelect(key);
  }

  fireSelect(key: string | number) {
    const {onSelect} = this.props;
    onSelect && onSelect(key);
  }

  renderLink(link: any, index: number) {
    if (!link) {
      return;
    }

    const {classnames: cx, active: activeProp} = this.props;
    const {title, name} = link.props;
    const active = activeProp === undefined && index === 0 ? name : activeProp;
    // 判断是否为子节点，子节点key为 <父节点索引>-<子节点索引>
    const isChild = link.key?.split('-').length >= 2;

    return (
      <li
        className={cx(
          'AnchorNav-link',
          isChild ? 'AnchorNav-link-child' : '',
          String(active) === String(name) ? 'is-active' : ''
        )}
        key={link.key}
        onClick={() => this.handleSelect(name)}
      >
        <a title={title}>{title}</a>
      </li>
    );
  }

  renderSection(section: any, index: number) {
    if (!section) {
      return;
    }

    const {active: activeProp, classnames} = this.props;
    const name = section.props.name;
    const key = section.key;
    const active = activeProp === undefined && index === 0 ? name : activeProp;
    return React.cloneElement(section, {
      ...section.props,
      key,
      classnames,
      active,
      ref: (props: any) => {
        if (props && !this.sections.find(item => item.key === name)) {
          // 收集每个段落的真实dom节点
          this.sections.push({key: name, element: props.ref.contentDom});
        }
      }
    });
  }

  render() {
    const {
      classnames: cx,
      className,
      style,
      linkClassName,
      sectionClassName,
      children,
      direction
    } = this.props;

    if (!Array.isArray(children)) {
      return null;
    }

    return (
      <div
        className={cx(
          'AnchorNav',
          {
            [`AnchorNav--${direction}`]: direction
          },
          className
        )}
        style={style}
      >
        <ul
          className={cx('AnchorNav-link-wrap', linkClassName)}
          role="anchorlist"
        >
          {children.map((link, index) => this.renderLink(link, index))}
        </ul>

        <div
          className={cx('AnchorNav-section-wrap', sectionClassName)}
          ref={this.contentDom}
        >
          {children.map((section, index) => {
            return this.renderSection(section, index);
          })}
        </div>
      </div>
    );
  }
}

const ThemedAnchorNav = themeable(
  uncontrollable(AnchorNav, {
    active: 'onSelect'
  })
);

export default ThemedAnchorNav as typeof ThemedAnchorNav & {
  AnchorNavSection: typeof AnchorNavSection;
};
