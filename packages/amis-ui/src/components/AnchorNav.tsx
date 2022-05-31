/**
 * @file AnchorNav
 * @description 锚点导航
 * @author hsm-lv
 */

import React from 'react';
import {ThemeProps, themeable} from 'amis-core';

import {autobind} from 'amis-core';
import {uncontrollable} from 'uncontrollable';
import find from 'lodash/find';
import type {PlainObject, Schema} from 'amis-core';

export interface AnchorNavSectionProps extends ThemeProps {
  title?: string; // 标题
  name: string | number; // 标识
  body?: Schema; // Schema
  className?: string; // 样式名
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
}

export interface AnchorNavState {
  offsetArr: PlainObject[]; // 记录每个段落的offsetTop
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

  componentDidMount() {
    // 初始化滚动标识
    this.setState({fromSelect: false});

    // add scroll event
    const sectionRootDom =
      this.contentDom && (this.contentDom.current as HTMLElement);
    sectionRootDom.addEventListener('scroll', this.scrollToNav);
    let offsetArr: Array<object> = [];
    const {children, active} = this.props;

    // 收集段落区域offsetTop
    children &&
      React.Children.forEach(
        children,
        (section: AnchorNavSectionComponent, index: number) => {
          offsetArr.push({
            key: section.props.name,
            offsetTop: (sectionRootDom.children[index] as HTMLElement).offsetTop
          });
        }
      );

    this.setState(
      {
        offsetArr
      },
      () => active && this.scrollToSection(active)
    );
  }

  @autobind
  scrollToNav(e: Event) {
    if (this.state.fromSelect) {
      return;
    }

    // 获取滚动的scrollTop
    const scrollTop: number = (e.target as HTMLElement).scrollTop;

    // 判断scrollTop所在区域
    const offsetArr = this.state.offsetArr;
    const firstSection = offsetArr[0];
    const lastSection = offsetArr[offsetArr.length - 1];
    // 首层偏移
    const offset = scrollTop + firstSection.offsetTop;

    // 首层
    if (offset <= firstSection.offsetTop) {
      this.fireSelect(firstSection.key);
    }
    // 最后一层
    else if (offset >= lastSection.offsetTop) {
      this.fireSelect(lastSection.key);
    } else {
      // 段落区间判断
      offsetArr.forEach((item, index) => {
        if (
          offset >= item.offsetTop &&
          offset < offsetArr[index + 1].offsetTop
        ) {
          this.fireSelect(item.key);
        }
      });
    }
  }

  scrollToSection(key: string | number) {
    // 获取指定段落的offsettop
    const offsetArr = this.state.offsetArr;
    const section = find(offsetArr, item => item.key === key);
    const sectionRootDom =
      this.contentDom && (this.contentDom.current as HTMLElement);

    // 滚动到指定段落
    section &&
      (sectionRootDom.scrollTop = section.offsetTop - offsetArr[0].offsetTop);
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

    return (
      <li
        className={cx('AnchorNav-link', active === name ? 'is-active' : '')}
        key={index}
        onClick={() => this.handleSelect(name)}
      >
        <a>{title}</a>
      </li>
    );
  }

  renderSection(section: any, index: number) {
    if (!section) {
      return;
    }

    const {active: activeProp, classnames} = this.props;
    const name = section.props.name;
    const active = activeProp === undefined && index === 0 ? name : activeProp;

    return React.cloneElement(section, {
      ...section.props,
      key: index,
      classnames,
      active
    });
  }

  render() {
    const {
      classnames: cx,
      className,
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
