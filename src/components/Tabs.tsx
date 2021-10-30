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
import {autobind} from '../utils/helper';
import debounce from 'lodash/debounce';

const transitionStyles: {
  [propName: string]: string;
} = {
  [ENTERING]: 'in',
  [ENTERED]: 'in'
};

export interface TabProps extends ThemeProps {
  title?: string | React.ReactNode; // 标题
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
  scrollable?: boolean // 是否支持溢出滚动
}

export class Tabs extends React.Component<TabsProps, any> {
  static defaultProps: Pick<TabsProps, 'mode' | 'contentClassName'> = {
    mode: '',
    contentClassName: ''
  };

  static Tab = Tab;
  navMain = React.createRef<HTMLDivElement>();
  scroll:boolean = false;

  checkArrowStatus = debounce(
    () => {
      const {scrollLeft, scrollWidth, clientWidth} = this.navMain.current
        || {
          scrollLeft: 0,
          scrollWidth: 0,
          clientWidth: 0
        }
      const {arrowRightDisabled, arrowLeftDisabled} = this.state;
      if (scrollLeft === 0 && !arrowLeftDisabled) {
        this.setState({
          arrowRightDisabled: false,
          arrowLeftDisabled: true
        });
      } else if (scrollWidth === scrollLeft + clientWidth && !arrowRightDisabled) {
        this.setState({
          arrowRightDisabled: true,
          arrowLeftDisabled: false
        });
      } else if (scrollLeft !== 0 && arrowLeftDisabled) {
        this.setState({
          arrowLeftDisabled: false
        });
      } else if (scrollWidth !== scrollLeft + clientWidth && arrowRightDisabled) {
        this.setState({
          arrowRightDisabled: false
        });
      }
    },
    100,
    {
      trailing: true,
      leading: false
    }
  )

  constructor(props: TabsProps) {
    super(props);
    this.state = {
      isOverflow: false,
      arrowLeftDisabled: false,
      arrowRightDisabled: false,
    };
  }

  componentDidMount() {
    this.computedWidth();
    if (this.navMain) {
      this.navMain.current?.addEventListener('wheel', this.handleWheel, {passive: false});
      this.checkArrowStatus();
    }
  }

  componentDidUpdate() {
    // 判断是否是由滚动触发的数据更新，如果是则不需要再次判断容器与内容的关系
    if (!this.scroll) {
      this.computedWidth();
    }
    this.scroll = false;
  }

  componentWillUnmount() {
    this.checkArrowStatus.cancel();
  }

  /**
   * 处理内容与容器之间的位置关系
   */
  computedWidth() {
    const {mode: dMode, tabsMode, scrollable} = this.props;
    const mode = tabsMode || dMode;
    if (!scrollable || mode === 'vertical') {
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
   * 保证选中的tab始终显示在可视区域
   */
  showSelected(key?: string | number) {
    const {mode: dMode, tabsMode, scrollable} = this.props;
    const {isOverflow} = this.state;
    const mode = tabsMode || dMode;
    if (!scrollable || mode === 'vertical' || !isOverflow) {
      return;
    }
    const {activeKey, children} = this.props;
    const currentKey = key !== undefined ? key : activeKey;
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
    setTimeout(() => {
      this.checkArrowStatus();
    }, 500);
    onSelect && onSelect(key);
  }

  handleArrow(type: 'left' | 'right') {
    const {scrollLeft, scrollWidth, clientWidth} = this.navMain.current
      || {
        scrollLeft: 0,
        scrollWidth: 0,
        clientWidth: 0
      }
    if (type === 'left' && scrollLeft > 0) {
      this.navMain.current?.scrollTo({
        left: 0,
        behavior: 'smooth'
      });
      this.setState({
        arrowRightDisabled: false,
        arrowLeftDisabled: true
      });
    } else if (type === 'right' && scrollWidth > scrollLeft + clientWidth) {
      this.navMain.current?.scrollTo({
        left: this.navMain.current?.scrollWidth,
        behavior: 'smooth'
      });
      this.setState({
        arrowRightDisabled: true,
        arrowLeftDisabled: false
      });
    }
    this.scroll = true;
  }

  /**
   * 监听导航上的滚动事件
   */
  @autobind
  handleWheel(e: WheelEvent) {
    const {deltaY, deltaX} = e;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    // 当鼠标上下滚动时转换为左右滚动
    if (absY > absX) {
      this.navMain.current?.scrollTo({
        left: this.navMain.current?.scrollLeft + deltaY
      });
      e.preventDefault();
    }
    this.checkArrowStatus();
    this.scroll = true;
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
      toolbar,
      tabClassName
    } = child.props;
    const activeKey =
      activeKeyProp === undefined && index === 0 ? eventKey : activeKeyProp;

    const iconElement = generateIcon(cx, icon, 'Icon');

    return (
      <li
        className={cx(
          'Tabs-link',
          activeKey === eventKey ? 'is-active' : '',
          disabled ? 'is-disabled' : '',
          tabClassName
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
        {mode === 'chrome' ? (
          <div className="chrome-tab-background">
            <svg viewBox="0 0 124 124" className="chrome-tab-background--right">
              <path d="M0,0 C0,68.483309 55.516691,124 124,124 L0,124 L0,-1 C0.00132103964,-0.667821298 0,-0.334064922 0,0 Z"></path>
            </svg>
            <svg viewBox="0 0 124 124" className="chrome-tab-background--left">
              <path d="M124,0 L124,125 L0,125 L0,125 C68.483309,125 124,69.483309 124,1 L123.992,0 L124,0 Z"></path>
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
    const {isOverflow, arrowLeftDisabled, arrowRightDisabled} = this.state;
    const disabled = type === 'left' ? arrowLeftDisabled : arrowRightDisabled;
    return (isOverflow
      ? (<div onClick={() => this.handleArrow(type)}
          className={cx(
            'Tabs-linksContainer-arrow',
            'Tabs-linksContainer-arrow--' + type,
            disabled && 'Tabs-linksContainer-arrow--disabled'
          )}>
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
      linksClassName,
      scrollable
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
        {
          scrollable && !['vertical', 'chrome'].includes(mode) ?
            (<div className={cx('Tabs-linksContainer', isOverflow && 'Tabs-linksContainer--overflow')}>
              {this.renderArrow('left')}
              <div
                className={cx('Tabs-linksContainer-main')}
                ref={this.navMain}
              >
                <ul className={cx('Tabs-links', linksClassName)} role="tablist">
                  {children.map((tab, index) => this.renderNav(tab, index))}
                  {additionBtns}
                  {toolbar}
                </ul>
              </div>
              {this.renderArrow('right')}
            </div>)
          : (<ul className={cx('Tabs-links', linksClassName)} role="tablist">
              {children.map((tab, index) => this.renderNav(tab, index))}
              {additionBtns}
              {toolbar}
            </ul>)
        }

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
