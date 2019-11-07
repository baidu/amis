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
  size: any;
  overlay: boolean;
  onHide: () => void;
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
  disableOnClickOutside: () => void;
  enableOnClickOutside: () => void;
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
    | 'container'
    | 'position'
    | 'size'
    | 'overlay'
    | 'disableOnClickOutside'
    | 'enableOnClickOutside'
  > = {
    container: document.body,
    position: 'left',
    size: 'md',
    overlay: true,
    disableOnClickOutside: noop,
    enableOnClickOutside: noop
  };

  contentDom: any;

  componentDidMount() {
    if (this.props.show) {
      this.handleEntered();
    }
  }

  componentWillUnmount() {
    if (this.props.show) {
      this.handleExited();
    }
  }

  contentRef = (ref: any) => (this.contentDom = ref);
  handleEntered = () => {
    const onEntered = this.props.onEntered;
    document.body.classList.add(`is-modalOpened`);
    onEntered && onEntered();
  };
  handleExited = () => {
    const onExited = this.props.onExited;
    document.activeElement && (document.activeElement as HTMLElement).blur();
    onExited && onExited();
    setTimeout(() => {
      document.querySelector('.amis-dialog-widget') ||
        document.body.classList.remove(`is-modalOpened`);
    }, 200);
  };

  modalRef = (ref: any) => {
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
  handleWidgetClick(e: React.MouseEvent) {
    const {classPrefix: ns, closeOnOutside, onHide} = this.props;
    if ((e.target as HTMLElement).closest(`.${ns}Drawer-content`)) {
      return;
    }
    closeOnOutside && onHide && onHide();
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
      overlay
    } = this.props;

    return (
      <Portal container={container}>
        <Transition
          mountOnEnter
          unmountOnExit
          in={show}
          timeout={500}
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
                onClick={this.handleWidgetClick} // 其实不需要插件，直接写逻辑吧
              >
                {overlay ? (
                  <div
                    className={cx(`${ns}Drawer-overlay`, fadeStyles[status])}
                  />
                ) : null}
                <div
                  ref={this.contentRef}
                  className={cx(`${ns}Drawer-content`, fadeStyles[status])}
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
