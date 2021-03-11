/**
 * @file Drawer
 * @description
 * @author fex
 */

import React from 'react';
import Transition, {
  ENTERED,
  ENTERING,
  EXITING
} from 'react-transition-group/Transition';
import {Portal} from 'react-overlays';
import {Icon} from './icons';
import cx from 'classnames';
import {current, addModal, removeModal} from './ModalManager';
import {ClassNamesFn, themeable} from '../theme';
import {noop, autobind} from '../utils/helper';

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
  position: DrawerPosition;
  disabled?: boolean;
  closeOnOutside?: boolean;
  classPrefix: string;
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
    'container' | 'position' | 'size' | 'overlay'
  > = {
    container: document.body,
    position: 'left',
    size: 'md',
    overlay: true
  };

  modalDom: HTMLElement;
  contentDom: HTMLElement;
  isRootClosed = false;

  componentDidMount() {
    if (this.props.show) {
      this.handleEntered();
    }

    document.body.addEventListener('click', this.handleRootClickCapture, true);
    document.body.addEventListener('click', this.handleRootClick);
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
    if (document.body.scrollHeight > window.innerHeight) {
      document.body.classList.add(`has-scrollbar`);
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
        document.body.classList.remove(`has-scrollbar`);
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
      removeModal();
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

  render() {
    const {
      classPrefix: ns,
      className,
      children,
      container,
      show,
      position,
      size,
      onHide,
      disabled,
      overlay,
      bodyClassName
    } = this.props;

    return (
      <Portal container={container}>
        <Transition
          mountOnEnter
          unmountOnExit
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
                  className={cx(
                    `${ns}Drawer-content`,
                    bodyClassName,
                    fadeStyles[status]
                  )}
                >
                  <a
                    onClick={disabled ? undefined : onHide}
                    className={`${ns}Drawer-close`}
                  >
                    <Icon icon="close" className="icon" />
                  </a>
                  {children}
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
