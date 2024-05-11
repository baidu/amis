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
import type {PlainObject, Schema} from 'amis-core';

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
    const {classnames: cx, children, className} = this.props;

    return (
      <div ref={this.contentRef} className={cx('AnchorNav-section', className)}>
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

interface SectionOffset {
  key: string | number;
  offsetTop: number;
}

export interface AnchorNavState {
  offsetArr: SectionOffset[]; // 记录每个段落的offsetTop
  fromSelect: boolean; // 标识滚动触发来源
}

export class AnchorNav extends React.Component<AnchorNavProps, AnchorNavState> {
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
  observer: MutationObserver;

  sections: {
    key: string | number;
    element: HTMLDivElement;
  }[] = [];

  componentDidMount() {
    // 初始化滚动标识
    this.setState({fromSelect: false});

    const sectionRootDom =
      this.contentDom && (this.contentDom.current as HTMLElement);
    sectionRootDom.addEventListener('scroll', this.scrollToNav);
  }

  componentWillUnmount() {
    if (this.contentDom && this.contentDom.current) {
      this.contentDom.current.removeEventListener('scroll', this.scrollToNav);
    }
  }

  @autobind
  scrollToNav(e: Event) {
    if (this.state.fromSelect) {
      return;
    }

    // 获取滚动的scrollTop
    const {scrollTop, scrollHeight, clientHeight} = e.target as HTMLElement;

    // 是否到达最底部，以防最后一个因为高度不够无法高亮
    const isReachBottom = scrollTop + clientHeight >= scrollHeight;

    // 判断scrollTop所在区域
    const firstSection = this.sections[0];
    const lastSection = this.sections[this.sections.length - 1];
    // 首层偏移
    const offset = scrollTop + firstSection.element.offsetTop;

    // 首层
    if (offset <= firstSection.element.offsetTop) {
      this.fireSelect(firstSection.key);
    }
    // 最后一层
    else if (isReachBottom || offset >= lastSection.element.offsetTop) {
      this.fireSelect(lastSection.key);
    } else {
      // 段落区间判断
      this.sections.forEach((item, index) => {
        if (
          offset >= item.element.offsetTop &&
          offset < this.sections[index + 1].element.offsetTop
        ) {
          this.fireSelect(item.key);
        }
      });
    }
  }

  scrollToSection(key: string | number) {
    // 获取指定段落的offsettop
    const node = find(this.sections, item => item.key === key);
    const sectionRootDom =
      this.contentDom && (this.contentDom.current as HTMLElement);

    // 滚动到指定段落
    node &&
      (sectionRootDom.scrollTop =
        node.element.offsetTop - this.sections[0].element.offsetTop);
  }

  handleSelect(key: string | number) {
    // 标记滚动来自导航选择
    this.setState({fromSelect: true});
    // 滚动到对应段落
    this.scrollToSection(key);
    const sectionRootDom =
      this.contentDom && (this.contentDom.current as HTMLElement);

    // 如果已经滚到底就不去更新导航选中了
    if (
      sectionRootDom.scrollHeight - sectionRootDom.scrollTop <
      sectionRootDom.clientHeight
    ) {
      // fire event
      this.fireSelect(key);
    }

    // 取消标记
    this.setState({fromSelect: false});
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
        if (props && !this.sections.find(item => item.key === key)) {
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
