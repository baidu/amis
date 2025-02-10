/**
 * @file Tabs
 * @description 选项卡
 * @author fex
 */

import React from 'react';
import {
  ClassName,
  localeable,
  LocaleProps,
  Schema,
  TestIdBuilder
} from 'amis-core';
import Transition, {ENTERED, ENTERING} from 'react-transition-group/Transition';
import {themeable, ThemeProps, noop} from 'amis-core';
import {uncontrollable} from 'amis-core';
import {isObjectShallowModified} from 'amis-core';
import {autobind, guid} from 'amis-core';
import {Icon} from './icons';
import debounce from 'lodash/debounce';
import {findDOMNode} from 'react-dom';
import TooltipWrapper from './TooltipWrapper';
import {resizeSensor} from 'amis-core';
import PopOverContainer from './PopOverContainer';

import Sortable from 'sortablejs';

const transitionStyles: {
  [propName: string]: string;
} = {
  [ENTERING]: 'in',
  [ENTERED]: 'in'
};

export type TabsMode =
  | ''
  | 'line'
  | 'card'
  | 'radio'
  | 'vertical'
  | 'chrome'
  | 'simple'
  | 'strong'
  | 'tiled'
  | 'sidebar';

export interface TabProps extends ThemeProps {
  title?: string | React.ReactNode; // 标题
  icon?: string;
  iconPosition?: 'left' | 'right';
  disabled?: boolean | string;
  eventKey: string | number;
  prevKey?: string | number;
  nextKey?: string | number;
  tip?: string;
  tab?: Schema;
  className?: string;
  tabClassName?: string;
  activeKey?: string | number;
  reload?: boolean;
  mountOnEnter?: boolean;
  unmountOnExit?: boolean;
  toolbar?: React.ReactNode;
  children?: React.ReactNode | Array<React.ReactNode>;
  swipeable?: boolean;
  onSelect?: (eventKey: string | number) => void;
  testIdBuilder?: TestIdBuilder;
}

class TabComponent extends React.PureComponent<TabProps> {
  contentDom: any;
  touch: any = {};
  touchStartTime: number;
  contentRef = (ref: any) => (this.contentDom = ref);

  @autobind
  onTouchStart(event: React.TouchEvent) {
    this.touch.startX = event.touches[0].clientX;
    this.touch.startY = event.touches[0].clientY;
    this.touchStartTime = Date.now();
  }

  @autobind
  onTouchMove(event: React.TouchEvent) {
    const touch = event.touches[0];
    const newState = {...this.touch};

    newState.deltaX = touch.clientX < 0 ? 0 : touch.clientX - newState.startX;
    newState.deltaY = touch.clientY - newState.startY;
    newState.offsetX = Math.abs(newState.deltaX);
    newState.offsetY = Math.abs(newState.deltaY);
    this.touch = newState;
  }

  @autobind
  onTouchEnd() {
    const duration = Date.now() - this.touchStartTime;
    const speed = this.touch.deltaX / duration;
    const shouldSwipe = Math.abs(speed) > 0.25;
    const {prevKey, nextKey, onSelect} = this.props;

    if (shouldSwipe) {
      if (this.touch.deltaX > 0) {
        prevKey !== undefined && onSelect?.(prevKey);
      } else {
        nextKey && onSelect?.(nextKey);
      }
    }
  }

  render() {
    const {
      classnames: cx,
      mountOnEnter,
      reload,
      unmountOnExit,
      eventKey,
      activeKey,
      children,
      className,
      swipeable,
      mobileUI,
      testIdBuilder
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
              onTouchStart={swipeable && mobileUI ? this.onTouchStart : noop}
              onTouchMove={swipeable && mobileUI ? this.onTouchMove : noop}
              onTouchEnd={swipeable && mobileUI ? this.onTouchEnd : noop}
              onTouchCancel={swipeable && mobileUI ? this.onTouchEnd : noop}
              {...testIdBuilder?.getTestId()}
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

export interface TabsProps extends ThemeProps, LocaleProps {
  mode: TabsMode;
  tabsMode?: TabsMode;
  additionBtns?: React.ReactNode;
  onSelect?: (key: string | number) => void;
  activeKey?: string | number;
  contentClassName: string;
  linksClassName?: ClassName;
  titleClassName?: ClassName;
  className?: string;
  tabs?: Array<TabProps>;
  tabRender?: (tab: TabProps, props?: TabsProps) => JSX.Element;
  toolbar?: React.ReactNode;
  addable?: boolean; // 是否显示增加按钮
  onAdd?: () => void;
  closable?: boolean;
  onClose?: (key: string | number) => void;
  draggable?: boolean;
  onDragChange?: (e: any) => void;
  showTip?: boolean;
  showTipClassName?: string;
  scrollable?: boolean; // 属性废弃，为了兼容暂且保留
  editable?: boolean;
  onEdit?: (index: number, text: string) => void;
  sidePosition?: 'left' | 'right';
  addBtnText?: string;
  collapseOnExceed?: number;
  collapseBtnLabel?: string;
  popOverContainer?: any;
  children?: React.ReactNode | Array<React.ReactNode>;
  testIdBuilder?: TestIdBuilder;
}

export interface IDragInfo {
  nodeId: string;
}

export class Tabs extends React.Component<TabsProps, any> {
  static defaultProps: Pick<
    TabsProps,
    | 'mode'
    | 'contentClassName'
    | 'showTip'
    | 'showTipClassName'
    | 'sidePosition'
    | 'addBtnText'
    | 'collapseBtnLabel'
  > = {
    mode: '',
    contentClassName: '',
    showTip: false,
    showTipClassName: '',
    sidePosition: 'left',
    addBtnText: '新增', // 由于组件用的地方比较多，这里暂时不好改翻译
    collapseBtnLabel: 'more'
  };

  static Tab = Tab;
  navMain = React.createRef<HTMLUListElement>(); // HTMLDivElement
  scroll: boolean = false;
  sortable?: Sortable;
  dragTip?: HTMLElement;
  id: string = guid();
  draging: boolean = false;
  toDispose: Array<() => void> = [];
  resizeDom = React.createRef<HTMLDivElement>();

  checkArrowStatus = debounce(
    () => {
      const {scrollLeft, scrollWidth, clientWidth} = this.navMain.current || {
        scrollLeft: 0,
        scrollWidth: 0,
        clientWidth: 0
      };
      const {arrowRightDisabled, arrowLeftDisabled} = this.state;
      if (scrollLeft === 0 && !arrowLeftDisabled) {
        this.setState({
          arrowRightDisabled: false,
          arrowLeftDisabled: true
        });
      } else if (
        scrollWidth === scrollLeft + clientWidth &&
        !arrowRightDisabled
      ) {
        this.setState({
          arrowRightDisabled: true,
          arrowLeftDisabled: false
        });
      } else if (scrollLeft !== 0 && arrowLeftDisabled) {
        this.setState({
          arrowLeftDisabled: false
        });
      } else if (
        scrollWidth !== scrollLeft + clientWidth &&
        arrowRightDisabled
      ) {
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
  );

  constructor(props: TabsProps) {
    super(props);
    this.state = {
      isOverflow: false,
      arrowLeftDisabled: false,
      arrowRightDisabled: false,
      dragIndicator: null,
      editingIndex: null,
      editInputText: null,
      editOriginText: null
    };
  }

  componentDidMount() {
    this.computedWidth();
    if (this.navMain) {
      this.navMain.current?.addEventListener('wheel', this.handleWheel, {
        passive: false
      });
      this.checkArrowStatus();
    }

    this.resizeDom?.current &&
      this.toDispose.push(
        resizeSensor(this.resizeDom.current as HTMLElement, () =>
          this.computedWidth()
        )
      );
  }

  componentDidUpdate(preProps: any) {
    // 只有 key 变化或者 tab 改变，才会重新计算，避免多次计算导致 顶部标签 滚动问题
    const isTabsModified = isObjectShallowModified(
      {
        activeKey: this.props.activeKey,
        children: Array.isArray(this.props.children)
          ? this.props.children!.map(item => ({
              eventKey: (item as JSX.Element)?.props?.eventKey,
              // 这里 title 可能是 React.ReactNode，只对比 string
              title:
                typeof (item as JSX.Element)?.props?.title === 'string'
                  ? (item as JSX.Element).props.title
                  : ''
            }))
          : []
      },
      {
        activeKey: preProps.activeKey,
        children: Array.isArray(preProps.children)
          ? preProps.children!.map((item: any) => ({
              eventKey: item?.props?.eventKey,
              title:
                typeof item?.props?.title === 'string' ? item.props.title : ''
            }))
          : []
      }
    );

    // 判断是否是由滚动触发的数据更新，如果是则不需要再次判断容器与内容的关系
    if (!this.scroll && !this.draging && isTabsModified) {
      this.computedWidth();
    }

    // 移动端取消箭头切换，改为滚动切换激活项居中
    const {classPrefix: ns, activeKey, mobileUI} = this.props;
    if (mobileUI && preProps.activeKey !== activeKey) {
      const {classPrefix: ns} = this.props;
      const dom = findDOMNode(this) as HTMLElement;
      const activeTab = dom.querySelector(
        `.${ns}Tabs-link.is-active`
      ) as HTMLElement;
      const parentWidth = (activeTab.parentNode?.parentNode as any).offsetWidth;
      const offsetLeft = activeTab.offsetLeft;
      const offsetWidth = activeTab.offsetWidth;
      if (activeTab.parentNode) {
        (activeTab.parentNode as any).scrollLeft =
          offsetLeft > parentWidth
            ? (offsetLeft / parentWidth) * parentWidth -
              parentWidth / 2 +
              offsetWidth / 2
            : offsetLeft - parentWidth / 2 + offsetWidth / 2;
      }
    }

    this.scroll = false;
  }

  componentWillUnmount() {
    this.checkArrowStatus.cancel();
    this.toDispose.forEach(fn => fn());
    this.toDispose = [];
  }

  /**
   * 处理内容与容器之间的位置关系
   */
  computedWidth() {
    const {mode: dMode, tabsMode} = this.props;
    const mode = tabsMode || dMode;
    if (['vertical', 'sidebar'].includes(mode)) {
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

    // 正在拖动的不自动定位
    if (isOverflow && !this.draging) {
      this.showSelected();
    }
  }
  /**
   * 保证选中的tab始终显示在可视区域
   */
  showSelected(key?: string | number) {
    const {mode: dMode, tabsMode} = this.props;
    const {isOverflow} = this.state;
    const mode = tabsMode || dMode;
    if (['vertical', 'sidebar'].includes(mode) || !isOverflow) {
      return;
    }
    const {activeKey, children} = this.props;
    const currentKey = key !== undefined ? key : activeKey;
    const currentIndex = (children as any[])?.findIndex((item: any) =>
      item === null ? false : item.props.eventKey === currentKey
    );
    const li = this.navMain.current?.children || [];
    const currentLi = li[currentIndex] as HTMLElement;
    const liOffsetLeft = currentLi?.offsetLeft;
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

  @autobind
  handleStartEdit(index: number, title: string) {
    this.setState({
      editingIndex: index,
      editInputText: title,
      editOriginText: title
    });
  }

  @autobind
  handleEditInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      editInputText: e.currentTarget.value
    });
  }

  @autobind
  handleEdit() {
    let {editingIndex, editInputText, editOriginText} = this.state;
    const {onEdit} = this.props;

    this.setState({
      editingIndex: null,
      editInputText: null,
      editOriginText: null
    });

    onEdit &&
      (editInputText = String(editInputText).trim()) &&
      editInputText !== editOriginText &&
      onEdit(editingIndex, editInputText);
  }

  @autobind
  dragTipRef(ref: any) {
    if (!this.dragTip && ref) {
      this.initDragging();
    } else if (this.dragTip && !ref) {
      this.destroyDragging();
    }

    this.dragTip = ref;
  }

  @autobind
  destroyDragging() {
    this.sortable && this.sortable.destroy();
  }

  @autobind
  initDragging() {
    const {classPrefix: ns, onDragChange} = this.props;
    const dom = findDOMNode(this) as HTMLElement;

    this.sortable = new Sortable(
      dom.querySelector(`.${ns}Tabs-links`) as HTMLElement,
      {
        group: this.id,
        animation: 250,
        handle: `.${ns}Tabs-link`,
        ghostClass: `${ns}Tabs-link--dragging`,
        onStart: () => {
          this.draging = true;
        },
        onEnd: (e: any) => {
          // 没有移动
          if (e.newIndex === e.oldIndex) {
            return;
          }

          // 再交换回来
          const parent = e.to as HTMLElement;
          if (e.oldIndex < parent.childNodes.length - 1) {
            parent.insertBefore(
              e.item,
              parent.childNodes[
                e.oldIndex > e.newIndex ? e.oldIndex + 1 : e.oldIndex
              ]
            );
          } else {
            parent.appendChild(e.item);
          }

          setTimeout(() => {
            this.draging = false;
          });

          onDragChange && onDragChange(e);
        }
      }
    );
  }

  handleArrow(type: 'left' | 'right') {
    const {scrollLeft, scrollWidth, clientWidth} = this.navMain.current || {
      scrollLeft: 0,
      scrollWidth: 0,
      clientWidth: 0
    };
    if (type === 'left' && scrollLeft > 0) {
      const newScrollLeft = scrollLeft - clientWidth;

      this.navMain.current?.scrollTo({
        left: newScrollLeft > 0 ? newScrollLeft : 0,
        behavior: 'smooth'
      });
      this.setState({
        arrowRightDisabled: false,
        arrowLeftDisabled: newScrollLeft <= 0
      });
    } else if (type === 'right' && scrollWidth > scrollLeft + clientWidth) {
      const newScrollLeft = scrollLeft + clientWidth;

      this.navMain.current?.scrollTo({
        left: newScrollLeft > scrollWidth ? scrollWidth : newScrollLeft,
        behavior: 'smooth'
      });
      this.setState({
        arrowRightDisabled: newScrollLeft > scrollWidth - clientWidth,
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

  // 处理 hash 作为 key 时重复的问题
  generateTabKey(hash: any, eventKey: any, index: number) {
    return (hash === eventKey ? 'hash-' : '') + (eventKey ?? index);
  }

  renderNav(child: any, index: number, showClose: boolean) {
    if (!child) {
      return;
    }

    const {
      classnames: cx,
      activeKey: activeKeyProp,
      mode,
      closable,
      draggable,
      showTip,
      showTipClassName,
      editable,
      testIdBuilder,
      titleClassName
    } = this.props;

    const {
      eventKey,
      disabled,
      icon,
      iconPosition,
      title,
      toolbar,
      className,
      tabClassName,
      closable: tabClosable,
      tip,
      hash
    } = child.props;

    const {editingIndex, editInputText} = this.state;

    const activeKey =
      activeKeyProp === undefined && index === 0 ? eventKey : activeKeyProp;

    const iconElement = <Icon cx={cx} icon={icon} className="Icon" />;

    const link = (
      <a title={typeof title === 'string' ? title : undefined}>
        {editable && editingIndex === index ? (
          <input
            className={cx('Tabs-link-edit')}
            type="text"
            value={editInputText}
            autoFocus
            onFocus={(e: React.ChangeEvent<HTMLInputElement>) =>
              e.currentTarget.select()
            }
            onChange={this.handleEditInputChange}
            onBlur={this.handleEdit}
            onKeyPress={(e: React.KeyboardEvent) =>
              e && e.key === 'Enter' && this.handleEdit()
            }
          />
        ) : (
          <>
            {icon ? (
              iconPosition === 'right' ? (
                <>
                  <span className={cx('Tabs-link-text mr-1')}>{title}</span>
                  {iconElement}
                </>
              ) : (
                <>
                  {iconElement}
                  <span className={cx('Tabs-link-text ml-1')}>{title}</span>
                </>
              )
            ) : (
              <span className={cx('Tabs-link-text')}>{title}</span>
            )}
            {React.isValidElement(toolbar) ? toolbar : null}
          </>
        )}
      </a>
    );
    const tabTestIdBuidr = testIdBuilder?.getChild(
      `tab-${typeof title === 'string' ? title : index}`
    );
    return (
      <li
        className={cx(
          'Tabs-link',
          titleClassName,
          activeKey === eventKey ? 'is-active' : '',
          disabled ? 'is-disabled' : '',
          className,
          tabClassName
        )}
        key={this.generateTabKey(hash, eventKey, index)}
        onClick={() => (disabled ? '' : this.handleSelect(eventKey))}
        onDoubleClick={() => {
          editable &&
            typeof title === 'string' &&
            this.handleStartEdit(index, title);
        }}
        {...tabTestIdBuidr?.getChild('link').getTestId()}
      >
        {showTip ? (
          <TooltipWrapper
            placement="top"
            tooltip={tip ?? (typeof title === 'string' ? title : '')}
            trigger="hover"
            tooltipClassName={showTipClassName}
          >
            {link}
          </TooltipWrapper>
        ) : (
          link
        )}

        {showClose && (tabClosable ?? closable) && (
          <span
            className={cx('Tabs-link-close')}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              this.props.onClose && this.props.onClose(eventKey);
            }}
            {...tabTestIdBuidr?.getChild('close').getTestId()}
          >
            <Icon icon="close" className={cx('Tabs-link-close-icon')} />
          </span>
        )}
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

    const {hash, eventKey} = child?.props || {};

    const {activeKey: activeKeyProp, classnames} = this.props;
    const activeKey =
      activeKeyProp === undefined && index === 0 ? eventKey : activeKeyProp;

    return React.cloneElement(child, {
      ...child.props,
      key: this.generateTabKey(hash, eventKey, index),
      classnames: classnames,
      activeKey: activeKey
    });
  }

  renderArrow(type: 'left' | 'right') {
    const {mode: dMode, tabsMode, testIdBuilder} = this.props;
    const mode = tabsMode || dMode;
    if (['vertical', 'sidebar'].includes(mode)) {
      return;
    }
    const {classnames: cx} = this.props;
    const {isOverflow, arrowLeftDisabled, arrowRightDisabled} = this.state;
    const disabled = type === 'left' ? arrowLeftDisabled : arrowRightDisabled;
    return isOverflow ? (
      <div
        onClick={() => this.handleArrow(type)}
        className={cx(
          'Tabs-linksContainer-arrow',
          'Tabs-linksContainer-arrow--' + type,
          disabled && 'Tabs-linksContainer-arrow--disabled'
        )}
        {...testIdBuilder?.getChild(`arrow-${type}`).getTestId()}
      >
        <Icon icon="right-arrow-bold" className="icon" />
      </div>
    ) : null;
  }

  handleAddBtn() {
    const {onAdd} = this.props;

    onAdd && onAdd();
  }

  renderNavs(showClose = false) {
    const {
      children,
      collapseOnExceed,
      translate: __,
      classnames: cx,
      popOverContainer,
      collapseBtnLabel,
      titleClassName
    } = this.props;

    if (!Array.isArray(children)) {
      return null;
    }

    let doms: Array<any> = (children as Array<any>).map((tab, index) =>
      this.renderNav(tab, index, showClose)
    );

    if (
      typeof collapseOnExceed == 'number' &&
      collapseOnExceed &&
      doms.length > collapseOnExceed
    ) {
      const rest = doms.splice(
        collapseOnExceed - 1,
        doms.length + 1 - collapseOnExceed
      );
      doms.push(
        <PopOverContainer
          key="togglor"
          placement="center-bottom-center-top center-top-center-bottom"
          popOverClassName={cx('Tabs-PopOver')}
          popOverContainer={popOverContainer || (() => findDOMNode(this))}
          popOverRender={({onClose}) => (
            <ul
              className={cx('Tabs-PopOverList', 'DropDown-menu')}
              onClick={onClose}
            >
              {rest}
            </ul>
          )}
        >
          {({onClick, ref, isOpened}) => (
            <li
              className={cx(
                'Tabs-link',
                titleClassName,
                rest.some(item => ~item.props.className.indexOf('is-active'))
                  ? 'is-active'
                  : ''
              )}
            >
              <a
                className={cx('Tabs-togglor', isOpened ? 'is-opened' : '')}
                onClick={onClick}
              >
                <span>{__(collapseBtnLabel || 'more')}</span>
                <span className={cx('Tabs-togglor-arrow')}>
                  <Icon icon="right-arrow-bold" className="icon" />
                </span>
              </a>
            </li>
          )}
        </PopOverContainer>
      );
    }

    return doms;
  }

  render() {
    const {
      classnames: cx,
      contentClassName,
      className,
      style,
      mode: dMode,
      tabsMode,
      children,
      additionBtns,
      toolbar,
      linksClassName,
      addable,
      draggable,
      sidePosition,
      addBtnText,
      mobileUI,
      testIdBuilder
    } = this.props;

    const {isOverflow} = this.state;
    if (!Array.isArray(children)) {
      return null;
    }

    const mode = tabsMode || dMode;

    const toolButtons = (
      <>
        {addable && (
          <div
            className={cx('Tabs-addable')}
            onClick={() => this.handleAddBtn()}
            {...testIdBuilder?.getChild('add-tab').getTestId()}
          >
            <Icon icon="plus" className={cx('Tabs-addable-icon')} />
            {addBtnText}
          </div>
        )}
        {toolbar}
      </>
    );

    return (
      <div
        className={cx(
          `Tabs`,
          {
            [`Tabs--${mode}`]: mode,
            [`sidebar--${sidePosition}`]: mode === 'sidebar'
          },
          className
        )}
        style={style}
        {...testIdBuilder?.getTestId()}
        data-role="container"
      >
        {!['vertical', 'sidebar', 'chrome'].includes(mode) ? (
          <div
            className={cx(
              'Tabs-linksContainer-wrapper',
              toolbar && 'Tabs-linksContainer-wrapper--toolbar'
            )}
            ref={this.resizeDom}
          >
            <div
              className={cx(
                'Tabs-linksContainer',
                isOverflow && 'Tabs-linksContainer--overflow'
              )}
              {...testIdBuilder?.getChild('links').getTestId()}
            >
              {!mobileUI ? this.renderArrow('left') : null}
              <div className={cx('Tabs-linksContainer-main')}>
                <ul
                  className={cx('Tabs-links', linksClassName, {
                    'is-mobile': mobileUI
                  })}
                  role="tablist"
                  ref={this.navMain}
                >
                  {this.renderNavs(true)}
                  {additionBtns}
                  {!isOverflow && toolButtons}
                </ul>
              </div>
              {!mobileUI ? this.renderArrow('right') : null}
            </div>
            {isOverflow && toolButtons}
          </div>
        ) : (
          <div className={cx('Tabs-linksWrapper')}>
            <ul
              className={cx('Tabs-links', linksClassName, {
                'is-mobile': mobileUI
              })}
              role="tablist"
              {...testIdBuilder?.getChild('links').getTestId()}
            >
              {this.renderNavs()}
              {additionBtns}
              {toolbar}
            </ul>
          </div>
        )}

        <div className={cx('Tabs-content', contentClassName)}>
          {children.map((child, index) => {
            return this.renderTab(child, index);
          })}
        </div>
        {draggable && (
          <div
            className={cx('Tabs-drag-tip')}
            ref={this.dragTipRef}
            {...testIdBuilder?.getChild('drag').getTestId()}
          />
        )}
      </div>
    );
  }
}

const ThemedTabs = localeable(
  themeable(
    uncontrollable(Tabs, {
      activeKey: 'onSelect'
    })
  )
);

export default ThemedTabs as typeof ThemedTabs & {
  Tab: typeof Tab;
};
