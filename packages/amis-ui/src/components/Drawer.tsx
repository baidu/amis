/**
 * @file Drawer
 * @description
 * @author fex
 */

import React from 'react';
import Transition, {
  ENTERED,
  ENTERING,
  EXITING,
  EXITED
} from 'react-transition-group/Transition';
import Portal from 'react-overlays/Portal';
import {Icon} from './icons';
import cx from 'classnames';
import {current, addModal, removeModal} from './ModalManager';
import {ClassNamesFn, themeable} from 'amis-core';
import {noop, autobind, getScrollbarWidth} from 'amis-core';

type DrawerPosition = 'top' | 'right' | 'bottom' | 'left';

export interface DrawerProps {
  className?: string;
  bodyClassName?: string;
  size: any;
  overlay: boolean;
  onHide: (e: any) => void;
  closeOnEsc?: boolean;
  container: any;
  show?: boolean;
  showCloseButton?: boolean;
  width?: number | string;
  height?: number | string;
  position: DrawerPosition;
  disabled?: boolean;
  closeOnOutside?: boolean;
  classPrefix: string;
  resizable?: boolean;
  classnames: ClassNamesFn;
  onExited?: () => void;
  onEntered?: () => void;
}
export interface DrawerState {}
const fadeStyles: {
  [propName: string]: string;
} = {
  [ENTERING]: 'in',
  [ENTERED]: 'in'
};
export class Drawer extends React.Component<DrawerProps, DrawerState> {
  static defaultProps: Pick<
    DrawerProps,
    'container' | 'position' | 'size' | 'overlay' | 'showCloseButton'
  > = {
    container: document.body,
    position: 'left',
    size: 'md',
    showCloseButton: true,
    overlay: true
  };

  modalDom: HTMLElement;
  contentDom: HTMLElement;
  isRootClosed = false;
  resizer = React.createRef<HTMLDivElement>();
  resizeCoord: number = 0;

  componentDidMount() {
    if (this.props.show) {
      this.handleEntered();
    }

    document.body.addEventListener('click', this.handleRootClickCapture, true);
    document.body.addEventListener('click', this.handleRootClick);
  }

  componentDidUpdate(prevProps: DrawerProps) {
    // jest 里面没有触发 entered 导致后续的逻辑错误，
    // 所以直接 300 ms 后触发
    if (
      typeof jest !== 'undefined' &&
      prevProps.show !== this.props.show &&
      this.props.show
    ) {
      setTimeout(() => {
        this.handleEntered();
      }, 300);
    }
  }

  componentWillUnmount() {
    if (this.props.show) {
      this.handleExited();
    }

    document.body.removeEventListener('click', this.handleRootClick);
    document.body.removeEventListener(
      'click',
      this.handleRootClickCapture,
      true
    );
  }

  contentRef = (ref: any) => (this.contentDom = ref);

  handleEnter = () => {
    document.body.classList.add(`is-modalOpened`);
    if (
      window.innerWidth - document.documentElement.clientWidth > 0 ||
      document.body.scrollHeight > document.body.clientHeight
    ) {
      const scrollbarWidth = getScrollbarWidth();
      if (scrollbarWidth) {
        document.body.style.width = `calc(100% - ${scrollbarWidth}px)`;
      }
    }
  };

  handleEntered = () => {
    const onEntered = this.props.onEntered;
    onEntered && onEntered();
  };
  handleExited = () => {
    const onExited = this.props.onExited;
    document.activeElement && (document.activeElement as HTMLElement)?.blur?.();
    onExited && onExited();
    setTimeout(() => {
      if (!document.querySelector('.amis-dialog-widget')) {
        document.body.classList.remove(`is-modalOpened`);
        document.body.style.width = '';
      }
    }, 200);
  };

  modalRef = (ref: any) => {
    this.modalDom = ref;
    if (ref) {
      addModal(this);
      (ref as HTMLElement).classList.add(
        `${this.props.classPrefix}Modal--${current()}th`
      );
    } else {
      removeModal(this);
    }
  };

  @autobind
  handleRootClickCapture(e: MouseEvent) {
    const target = e.target as HTMLElement;
    const {closeOnOutside, classPrefix: ns} = this.props;
    const isLeftButton =
      (e.button === 1 && window.event !== null) || e.button === 0;

    this.isRootClosed = !!(
      isLeftButton &&
      closeOnOutside &&
      target &&
      this.modalDom &&
      ((!this.modalDom.contains(target) && !target.closest('[role=dialog]')) ||
        (target.matches(`.${ns}Drawer-overlay`) &&
          target.parentElement === this.modalDom))
    ); // 干脆过滤掉来自弹框里面的点击
  }

  @autobind
  handleRootClick(e: MouseEvent) {
    const {onHide} = this.props;

    this.isRootClosed && !e.defaultPrevented && onHide(e);
  }

  getDrawerStyle() {
    const {width, height, position} = this.props;
    const offsetStyle: {
      width?: number | string;
      height?: number | string;
    } = {};
    if ((position === 'left' || position === 'right') && width !== undefined) {
      offsetStyle.width = width;
    } else if (
      (position === 'top' || position === 'bottom') &&
      height !== undefined
    ) {
      offsetStyle.height = height;
    }
    return offsetStyle;
  }

  @autobind
  resizeMouseDown(e: React.MouseEvent<any>) {
    const {position, classPrefix: ns} = this.props;
    const drawer = this.contentDom;
    const resizer = this.resizer.current!;

    const drawerWidth = getComputedStyle(drawer).width as string;
    const drawerHeight = getComputedStyle(drawer).height as string;

    this.resizeCoord =
      (position === 'left' &&
        e.clientX -
          resizer.offsetWidth -
          parseInt(drawerWidth.substring(0, drawerWidth.length - 2))) ||
      (position === 'right' &&
        document.body.offsetWidth -
          e.clientX -
          resizer.offsetWidth -
          parseInt(drawerWidth.substring(0, drawerWidth.length - 2))) ||
      (position === 'top' &&
        e.clientY -
          resizer.offsetHeight -
          parseInt(drawerHeight.substring(0, drawerHeight.length - 2))) ||
      (position === 'bottom' &&
        document.body.offsetHeight -
          e.clientY -
          resizer.offsetHeight -
          parseInt(drawerHeight.substring(0, drawerHeight.length - 2))) ||
      0;

    document.body.addEventListener('mousemove', this.bindResize);
    document.body.addEventListener('mouseup', this.removeResize);
  }

  @autobind
  bindResize(e: any) {
    const {position} = this.props;
    const maxWH = 'calc(100% - 50px)';
    const drawer = this.contentDom;
    const drawerStyle = drawer.style;
    let wh =
      (position === 'left' && e.clientX) ||
      (position === 'right' && document.body.offsetWidth - e.clientX) ||
      (position === 'top' && e.clientY) ||
      (position === 'bottom' && document.body.offsetHeight - e.clientY) ||
      0;
    wh = wh - this.resizeCoord + 'px';

    if (position === 'left' || position === 'right') {
      drawerStyle.maxWidth = maxWH;
      drawerStyle.width = wh;
    }

    if (position === 'top' || position === 'bottom') {
      drawerStyle.maxHeight = maxWH;
      drawerStyle.height = wh;
    }
  }

  @autobind
  removeResize() {
    document.body.removeEventListener('mousemove', this.bindResize);
    document.body.removeEventListener('mouseup', this.removeResize);
  }

  renderResizeCtrl() {
    const {classnames: cx} = this.props;

    return (
      <div
        className={cx('Drawer-resizeCtrl')}
        ref={this.resizer}
        onMouseDown={this.resizeMouseDown}
      >
        <div className={cx('Drawer-resizeIcon')}>···</div>
      </div>
    );
  }

  render() {
    const {
      classPrefix: ns,
      className,
      children,
      container,
      show,
      showCloseButton,
      position,
      size,
      onHide,
      disabled,
      overlay,
      bodyClassName,
      resizable
    } = this.props;

    const bodyStyle = this.getDrawerStyle();

    return (
      <Portal container={container}>
        <Transition
          mountOnEnter
          unmountOnExit
          appear
          in={show}
          timeout={500}
          onEnter={this.handleEnter}
          onExited={this.handleExited}
          onEntered={this.handleEntered}
        >
          {(status: string) => {
            if (status === ENTERING) {
              // force reflow
              // 由于从 mount 进来到加上 in 这个 class 估计是时间太短，上次的样式还没应用进去，所以这里强制reflow一把。
              // 否则看不到动画。
              this.contentDom.offsetWidth;
            }

            return (
              <div
                ref={this.modalRef}
                role="dialog"
                className={cx(
                  `amis-dialog-widget ${ns}Drawer`,
                  {
                    [`${ns}Drawer--${position}`]: position,
                    [`${ns}Drawer--${size}`]: size,
                    [`${ns}Drawer--noOverlay`]: !overlay
                  },
                  className
                )}
                // onClick={this.handleWidgetClick} // 其实不需要插件，直接写逻辑吧
              >
                {overlay ? (
                  <div
                    className={cx(`${ns}Drawer-overlay`, fadeStyles[status])}
                  />
                ) : null}
                <div
                  ref={this.contentRef}
                  style={bodyStyle}
                  className={cx(
                    `${ns}Drawer-content`,
                    bodyClassName,
                    fadeStyles[status]
                  )}
                >
                  {show && showCloseButton ? (
                    <a
                      onClick={disabled ? undefined : onHide}
                      className={`${ns}Drawer-close`}
                    >
                      <Icon icon="close" className="icon" />
                    </a>
                  ) : null}
                  {status === EXITED ? null : children}
                  {resizable ? this.renderResizeCtrl() : null}
                </div>
              </div>
            );
          }}
        </Transition>
      </Portal>
    );
  }
}

export default themeable(Drawer);
