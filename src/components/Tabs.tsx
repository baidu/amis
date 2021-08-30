/**
 * @file Tabs
 * @description 选项卡
 * @author fex
 */

import React from 'react';
import {Schema} from '../types';
import Transition, {ENTERED, ENTERING} from 'react-transition-group/Transition';
import {themeable, ThemeProps} from '../theme';
import {uncontrollable} from 'uncontrollable';
import {generateIcon} from '../utils/icon';
import {SchemaClassName} from '../Schema';

const transitionStyles: {
  [propName: string]: string;
} = {
  [ENTERING]: 'in',
  [ENTERED]: 'in'
};

export interface TabProps extends ThemeProps {
  title?: string; // 标题
  icon?: string;
  iconPosition?: 'left' | 'right';
  disabled?: boolean | string;
  eventKey: string | number;
  tab?: Schema;
  className?: string;
  activeKey?: string | number;
  reload?: boolean;
  mountOnEnter?: boolean;
  unmountOnExit?: boolean;
  toolbar?: React.ReactNode;
}

class TabComponent extends React.PureComponent<TabProps> {
  contentDom: any;
  contentRef = (ref: any) => (this.contentDom = ref);

  render() {
    const {
      classnames: cx,
      mountOnEnter,
      reload,
      unmountOnExit,
      eventKey,
      activeKey,
      children,
      className
    } = this.props;

    return (
      <Transition
        in={activeKey === eventKey}
        mountOnEnter={mountOnEnter}
        unmountOnExit={typeof reload === 'boolean' ? reload : unmountOnExit}
        timeout={500}
      >
        {(status: string) => {
          if (status === ENTERING) {
            this.contentDom.offsetWidth;
          }
          return (
            <div
              ref={this.contentRef}
              className={cx(
                transitionStyles[status],
                activeKey === eventKey ? 'is-active' : '',
                'Tabs-pane',
                className
              )}
            >
              {children}
            </div>
          );
        }}
      </Transition>
    );
  }
}

export const Tab = themeable(TabComponent);

export interface TabsProps extends ThemeProps {
  mode: '' | 'line' | 'card' | 'radio' | 'vertical' | 'chrome';
  tabsMode?: '' | 'line' | 'card' | 'radio' | 'vertical' | 'chrome';
  additionBtns?: React.ReactNode;
  onSelect?: (key: string | number) => void;
  activeKey?: string | number;
  contentClassName: string;
  linksClassName?: SchemaClassName;
  className?: string;
  tabs?: Array<TabProps>;
  tabRender?: (tab: TabProps, props?: TabsProps) => JSX.Element;
  toolbar?: React.ReactNode;
}

export class Tabs extends React.Component<TabsProps, any> {
  static defaultProps: Pick<TabsProps, 'mode' | 'contentClassName'> = {
    mode: '',
    contentClassName: ''
  };

  static Tab = Tab;
  navMain = React.createRef<HTMLDivElement>();

  constructor(props: TabsProps) {
    super(props);
    this.state = {
      isOverflow: false
    };
  }

  componentDidMount() {
    this.computedWidth();
  }

  componentDidUpdate() {
    this.computedWidth();
  }

  /**
   * 处理内容与容器之间的位置关系
   */
  computedWidth() {
    const {mode: dMode, tabsMode,} = this.props;
    const mode = tabsMode || dMode;
    if (mode === 'vertical') {
      return;
    }
    const navMainRef = this.navMain.current;
    const clientWidth: number = navMainRef?.clientWidth || 0;
    const scrollWidth: number = navMainRef?.scrollWidth || 0;
    const isOverflow = scrollWidth > clientWidth;
    // 内容超出容器长度标记溢出
    if (isOverflow !== this.state.isOverflow) {
      this.setState({isOverflow});
    }
    if (isOverflow) {
      this.showSelected();
    }
  }
  /**
   * 保证选中的tab始终显示在可视区域的最左边
   */
  showSelected(key?: string | number) {
    const {mode: dMode, tabsMode,} = this.props;
    const {isOverflow} = this.state;
    const mode = tabsMode || dMode;
    if (mode === 'vertical' && !isOverflow) {
      return;
    }
    const {activeKey, children} = this.props;
    const currentKey = key || activeKey;
    const currentIndex = (children as any[])?.findIndex((item: any) => item.props.eventKey === currentKey);
    const li = this.navMain.current?.children[0]?.children || [];
    const currentLi = li[currentIndex] as HTMLElement;
    const liOffsetLeft = currentLi?.offsetLeft - 20;
    const liClientWidth = currentLi?.clientWidth;
    const scrollLeft = this.navMain.current?.scrollLeft || 0;
    const clientWidth = this.navMain.current?.clientWidth || 0;

    // 左边被遮住了
    if (scrollLeft > liOffsetLeft) {
      this.navMain.current?.scrollTo({
        left: liOffsetLeft,
        behavior: 'smooth'
      });
    }
    // 右边被遮住了
    if (liOffsetLeft + liClientWidth > scrollLeft + clientWidth) {
      this.navMain.current?.scrollTo({
        left: liOffsetLeft + liClientWidth - clientWidth,
        behavior: 'smooth'
      });
    }

  }

  handleSelect(key: string | number) {
    const {onSelect} = this.props;
    this.showSelected(key);
    onSelect && onSelect(key);
  }

  handleArrow(type: 'left' | 'right') {
    if (type === 'left') {
      this.navMain.current?.scrollTo({
        left: 0,
        behavior: 'smooth'
      });
    } else {
      this.navMain.current?.scrollTo({
        left: this.navMain.current?.scrollWidth,
        behavior: 'smooth'
      });
    }
  }

  renderNav(child: any, index: number) {
    if (!child) {
      return;
    }

    const {classnames: cx, activeKey: activeKeyProp, mode} = this.props;
    const {
      eventKey,
      disabled,
      icon,
      iconPosition,
      title,
      toolbar
    } = child.props;
    const activeKey =
      activeKeyProp === undefined && index === 0 ? eventKey : activeKeyProp;

    const iconElement = generateIcon(cx, icon, 'Icon');

    return (
      <li
        className={cx(
          'Tabs-link',
          activeKey === eventKey ? 'is-active' : '',
          disabled ? 'is-disabled' : ''
        )}
        key={eventKey ?? index}
        onClick={() => (disabled ? '' : this.handleSelect(eventKey))}
      >
        <a>
          {icon ? (
            iconPosition === 'right' ? (
              <>
                {title} {iconElement}
              </>
            ) : (
              <>
                {iconElement} {title}
              </>
            )
          ) : (
            title
          )}
          {React.isValidElement(toolbar) ? toolbar : null}
        </a>
        {/* svg 来自 https://github.com/adamschwartz/chrome-tabs */}
        {mode === 'chrome' ? (
          <div className="chrome-tab-background">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <symbol id="chrome-tab-geometry-left" viewBox="0 0 214 36">
                  <path d="M17 0h197v36H0v-2c4.5 0 9-3.5 9-8V8c0-4.5 3.5-8 8-8z" />
                </symbol>
                <symbol id="chrome-tab-geometry-right" viewBox="0 0 214 36">
                  <use href="#chrome-tab-geometry-left" />
                </symbol>
                <clipPath id="crop">
                  <rect className="mask" width="100%" height="100%" x="0" />
                </clipPath>
              </defs>
              <svg width="52%" height="100%">
                <use
                  href="#chrome-tab-geometry-left"
                  width="214"
                  height="36"
                  className="chrome-tab-geometry"
                />
              </svg>
              <g transform="scale(-1, 1)">
                <svg width="52%" height="100%" x="-100%" y="0">
                  <use
                    href="#chrome-tab-geometry-right"
                    width="214"
                    height="36"
                    className="chrome-tab-geometry"
                  />
                </svg>
              </g>
            </svg>
          </div>
        ) : null}
      </li>
    );
  }

  renderTab(child: any, index: number) {
    if (!child) {
      return;
    }

    const {activeKey: activeKeyProp, classnames} = this.props;
    const eventKey = child.props.eventKey;
    const activeKey =
      activeKeyProp === undefined && index === 0 ? eventKey : activeKeyProp;

    return React.cloneElement(child, {
      ...child.props,
      key: eventKey,
      classnames: classnames,
      activeKey: activeKey
    });
  }

  renderArrow(type: 'left' | 'right') {
    const {mode: dMode, tabsMode,} = this.props;
    const mode = tabsMode || dMode;
    if (mode === 'vertical') {
      return;
    }
    const {classnames: cx} = this.props;
    const {isOverflow} = this.state;
    return (isOverflow
      ? (<div onClick={() => this.handleArrow(type)}
          className={cx('Tabs-linksContainer-arrow', 'Tabs-linksContainer-arrow--' + type)}>
          <i className={'iconfont icon-arrow-' + type} />
        </div>)
      : null
    )
  }

  render() {
    const {
      classnames: cx,
      contentClassName,
      className,
      mode: dMode,
      tabsMode,
      children,
      additionBtns,
      toolbar,
      linksClassName
    } = this.props;
    const {isOverflow} = this.state;
    if (!Array.isArray(children)) {
      return null;
    }

    const mode = tabsMode || dMode;

    return (
      <div
        className={cx(
          `Tabs`,
          {
            [`Tabs--${mode}`]: mode
          },
          className
        )}
      >
        <div className={cx('Tabs-linksContainer', isOverflow && 'Tabs-linksContainer--overflow')}>
          {this.renderArrow('left')}
          <div
            className={cx(
              mode !== 'vertical' && 'Tabs-linksContainer-main--scroll'
            )}
            ref={this.navMain}>
            <ul className={cx('Tabs-links', linksClassName)} role="tablist">
              {children.map((tab, index) => this.renderNav(tab, index))}
              {additionBtns}
              {toolbar}
            </ul>
          </div>
          {this.renderArrow('right')}
        </div>
        <div className={cx('Tabs-content', contentClassName)}>
          {children.map((child, index) => {
            return this.renderTab(child, index);
          })}
        </div>
      </div>
    );
  }
}

const ThemedTabs = themeable(
  uncontrollable(Tabs, {
    activeKey: 'onSelect'
  })
);

export default ThemedTabs as typeof ThemedTabs & {
  Tab: typeof Tab;
};
