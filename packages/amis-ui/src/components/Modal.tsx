/**
 * @file Modal
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
import {current, addModal, removeModal} from './ModalManager';
import {ClassNamesFn, themeable, ThemeProps} from 'amis-core';
import {Icon} from './icons';
import {LocaleProps, localeable} from 'amis-core';
import {autobind, getScrollbarWidth} from 'amis-core';
import {
  DraggableCore,
  type DraggableBounds,
  type DraggableData,
  type DraggableEvent
} from 'react-draggable';
import isNumber from 'lodash/isNumber';

export const getContainerWithFullscreen =
  (container?: () => HTMLElement | HTMLElement | null) => () => {
    const envContainer =
      typeof container === 'function' ? container() : container;

    // 获取当前全屏元素
    const fullscreenElement = document.fullscreenElement;

    if (
      fullscreenElement &&
      (!envContainer || !fullscreenElement.contains(envContainer))
    ) {
      return fullscreenElement as HTMLElement;
    }
    return envContainer || null;
  };

export interface ModalProps extends ThemeProps, LocaleProps {
  className?: string;
  contentClassName?: string;
  size?: any;
  width?: any;
  height?: any;
  overlay?: boolean;
  onHide: (e: any) => void;
  closeOnEsc?: boolean;
  closeOnOutside?: boolean;
  container?: any;
  show?: boolean;
  disabled?: boolean;
  onExited?: () => void;
  onEntered?: () => void;
  children?: React.ReactNode | Array<React.ReactNode>;
  modalClassName?: string;
  modalMaskClassName?: string;
  draggable?: boolean;
}

export interface ModalState {
  bounds?: DraggableBounds;
  dragPos?: {x: number; y: number};
}

const fadeStyles: {
  [propName: string]: string;
} = {
  [ENTERING]: 'in',
  [ENTERED]: 'in',
  [EXITING]: 'out'
};

const contentFadeStyles: {
  [propName: string]: string;
} = {
  [ENTERING]: 'in',
  [ENTERED]: '',
  [EXITING]: 'out'
};

export class Modal extends React.Component<ModalProps, ModalState> {
  static defaultProps = {
    container: document.body,
    size: '',
    overlay: true,
    draggable: false
  };

  isRootClosed = false;
  modalDom: HTMLElement;

  static Header = themeable(
    localeable(
      ({
        classnames: cx,
        className,
        showCloseButton,
        onClose,
        children,
        classPrefix,
        translate: __,
        forwardedRef,
        ...rest
      }: ThemeProps &
        LocaleProps & {
          className?: string;
          showCloseButton?: boolean;
          onClose?: () => void;
          children?: React.ReactNode;
          forwardedRef?: any;
        } & React.HTMLAttributes<HTMLDivElement>) => (
        <div {...rest} className={cx('Modal-header', className)}>
          {showCloseButton !== false ? (
            <a
              data-tooltip={__('Dialog.close')}
              data-position="left"
              onClick={onClose}
              className={cx('Modal-close')}
            >
              <Icon icon="close" className="icon" />
            </a>
          ) : null}
          {children}
        </div>
      )
    )
  );

  static Title = themeable(
    ({
      classnames: cx,
      className,
      children,
      classPrefix,
      forwardedRef,
      ...rest
    }: ThemeProps & {
      className?: string;
      children?: React.ReactNode;
      forwardedRef?: any;
    } & React.HTMLAttributes<HTMLDivElement>) => (
      <div {...rest} className={cx('Modal-title', className)}>
        {children}
      </div>
    )
  );

  static Body = themeable(
    ({
      classnames: cx,
      className,
      children,
      classPrefix,
      forwardedRef,
      ...rest
    }: ThemeProps & {
      className?: string;
      children?: React.ReactNode;
      forwardedRef?: any;
    } & React.HTMLAttributes<HTMLDivElement>) => (
      <div {...rest} className={cx('Modal-body', className)}>
        {children}
      </div>
    )
  );

  static Footer = themeable(
    ({
      classnames: cx,
      className,
      children,
      classPrefix,
      forwardedRef,
      ...rest
    }: ThemeProps & {
      className?: string;
      children?: React.ReactNode;
      forwardedRef?: any;
    } & React.HTMLAttributes<HTMLDivElement>) => (
      <div {...rest} className={cx('Modal-footer', className)}>
        {children}
      </div>
    )
  );

  state: Readonly<ModalState> = {dragPos: undefined};

  componentDidMount() {
    if (this.props.show) {
      this.handleEnter();
      this.handleEntered();
    }
  }

  componentWillUnmount() {
    if (this.props.show) {
      this.handleExited();
    }
  }

  handleEnter = () => {
    document.body.classList.add(`is-modalOpened`);
    if (
      window.innerWidth - document.documentElement.clientWidth > 0 ||
      document.body.scrollHeight > document.body.clientHeight
    ) {
      const scrollbarWidth = getScrollbarWidth();
      document.body.style.width = `calc(100% - ${scrollbarWidth}px)`;
    }
  };

  handleEntered = () => {
    const onEntered = this.props.onEntered;

    document.body.addEventListener(
      'mousedown',
      this.handleRootMouseDownCapture,
      true
    );
    document.body.addEventListener(
      'mouseup',
      this.handleRootMouseUpCapture,
      true
    );
    document.body.addEventListener('mouseup', this.handleRootMouseUp);

    onEntered && onEntered();
  };
  handleExited = () => {
    const onExited = this.props.onExited;

    document.body.removeEventListener('mouseup', this.handleRootMouseUp);
    document.body.removeEventListener(
      'mousedown',
      this.handleRootMouseDownCapture,
      true
    );
    document.body.removeEventListener(
      'mouseup',
      this.handleRootMouseUpCapture,
      true
    );

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
    const {classPrefix: ns} = this.props;
    if (ref) {
      addModal(this);
      (ref as HTMLElement).classList.add(`${ns}Modal--${current()}th`);
    } else {
      removeModal(this);
    }
  };

  @autobind
  handleRootMouseDownCapture(e: MouseEvent) {
    const target = e.target as HTMLElement;
    const {closeOnOutside, classPrefix: ns, mobileUI} = this.props;
    const isLeftButton =
      (e.button === 1 && window.event !== null) || e.button === 0;

    this.isRootClosed = !!(
      isLeftButton &&
      closeOnOutside &&
      target &&
      this.modalDom &&
      ((!mobileUI &&
        !this.modalDom.contains(target) &&
        !target.closest('[role=dialog]')) ||
        (target.matches(`.${ns}Modal`) && target === this.modalDom))
    ); // 干脆过滤掉来自弹框里面的点击
  }

  @autobind
  handleRootMouseUpCapture(e: MouseEvent) {
    // mousedown 的时候不在弹窗里面，则不需要判断了
    if (!this.isRootClosed) {
      return;
    }

    // 再判断 mouseup 的时候是不是在弹窗里面
    this.handleRootMouseDownCapture(e);
  }

  @autobind
  handleRootMouseUp(e: MouseEvent) {
    const {onHide} = this.props;
    this.isRootClosed && !e.defaultPrevented && onHide(e);
  }

  // #region 处理dialog拖动

  handleDragStart = (_event: DraggableEvent, uiData: DraggableData) => {
    const node = uiData.node;
    const {offsetParent} = node;
    if (!node || !offsetParent) {
      return;
    }
    const {clientWidth, clientHeight} = window.document.documentElement;
    const nodeStyle = getComputedStyle(node);
    const marginTop = parseInt(nodeStyle.marginTop, 10);
    const nodeWidth = parseInt(nodeStyle.width, 10);
    const nodeHeight = parseInt(nodeStyle.height, 10);
    const bounds = {
      left: 0,
      right: clientWidth - nodeWidth,
      top: -marginTop,
      bottom: clientHeight - nodeHeight - marginTop
    };
    const parentRect = offsetParent.getBoundingClientRect();
    const clientRect = node.getBoundingClientRect();
    const cLeft = clientRect.left;
    const pLeft = parentRect.left;
    const cTop = clientRect.top;
    const pTop = parentRect.top;
    const left = cLeft - pLeft + offsetParent.scrollLeft;
    const top = cTop - pTop + offsetParent.scrollTop - marginTop;
    this.setState({dragPos: {x: left, y: top}, bounds});
    // 阻止冒泡  存在弹窗里面套弹窗
    _event.stopPropagation();
  };

  handleDrag = (e: DraggableEvent, {deltaX, deltaY}: DraggableData) => {
    e.stopPropagation();
    if (!this.state.dragPos) {
      return;
    }
    const {
      dragPos: {x, y},
      bounds
    } = this.state;

    let calcY = y + deltaY;
    let calcX = x + deltaX;

    // 防止拖动到屏幕外 处理边界
    if (isNumber(bounds?.right)) {
      calcX = Math.min(calcX, bounds!.right);
    }
    if (isNumber(bounds?.bottom)) {
      calcY = Math.min(calcY, bounds!.bottom);
    }
    if (isNumber(bounds?.left)) {
      calcX = Math.max(calcX, bounds!.left);
    }
    if (isNumber(bounds?.top)) {
      calcY = Math.max(calcY, bounds!.top);
    }
    this.setState({dragPos: {x: calcX, y: calcY}});
  };

  handleDragStop = (e: DraggableEvent) => {
    e.stopPropagation();
  };

  getDragStyle = (): React.CSSProperties => {
    const {draggable} = this.props;
    const {dragPos} = this.state;
    if (!dragPos || !draggable) {
      return {};
    }
    const {x, y} = dragPos;
    return {
      top: `${y}px`,
      left: `${x}px`,
      position: 'absolute'
    };
  };

  // #endregion

  render() {
    const {
      className,
      contentClassName,
      children,
      container,
      show,
      size,
      style,
      overlay,
      width,
      height,
      modalClassName,
      modalMaskClassName,
      classnames: cx,
      mobileUI,
      draggable,
      classPrefix
    } = this.props;

    let _style = {
      width: style?.width ? style?.width : width,
      height: style?.height ? style?.height : height
    };
    return (
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
        {(status: string) => (
          <Portal container={getContainerWithFullscreen(container)}>
            <div
              ref={this.modalRef}
              role="dialog"
              className={cx(
                `amis-dialog-widget Modal`,
                {
                  [`Modal--${size}`]: size
                },
                className
              )}
            >
              {overlay ? (
                <div
                  className={cx(
                    `Modal-overlay`,
                    fadeStyles[status],
                    modalMaskClassName
                  )}
                />
              ) : null}
              <DraggableCore
                disabled={!draggable || mobileUI}
                onStart={this.handleDragStart}
                onDrag={this.handleDrag}
                onStop={this.handleDragStop}
                cancel="Icon, svg, a, svg *"
                handle={`.${classPrefix}Modal-header`}
              >
                <div
                  className={cx(
                    `Modal-content`,
                    draggable && !mobileUI ? 'Modal-draggable' : '',
                    size === 'custom' ? 'Modal-content-custom' : '',
                    contentClassName,
                    modalClassName,
                    contentFadeStyles[status]
                  )}
                  style={{..._style, ...this.getDragStyle()}}
                >
                  {status === EXITED ? null : children}
                </div>
              </DraggableCore>
            </div>
          </Portal>
        )}
      </Transition>
    );
  }
}

const FinalModal = themeable(localeable(Modal));

export default FinalModal as typeof FinalModal & {
  Header: typeof Modal.Header;
  Title: typeof Modal.Title;
  Body: typeof Modal.Body;
  Footer: typeof Modal.Footer;
};
