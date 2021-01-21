/**
 * @file Modal
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
import {current, addModal, removeModal} from './ModalManager';
import {ClassNamesFn, themeable, ThemeProps} from '../theme';
import {Icon} from './icons';
import {LocaleProps, localeable} from '../locale';

export interface ModalProps extends ThemeProps, LocaleProps {
  className?: string;
  contentClassName?: string;
  size?: any;
  overlay?: boolean;
  onHide: (e: any) => void;
  closeOnEsc?: boolean;
  container?: any;
  show?: boolean;
  disabled?: boolean;
  onExited?: () => void;
  onEntered?: () => void;
}
export interface ModalState {}
const fadeStyles: {
  [propName: string]: string;
} = {
  [ENTERING]: 'in',
  [ENTERED]: 'in',
  [EXITING]: 'out'
};
export class Modal extends React.Component<ModalProps, ModalState> {
  static defaultProps = {
    container: document.body,
    size: '',
    overlay: true
  };

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
        ...rest
      }: ThemeProps &
        LocaleProps & {
          className?: string;
          showCloseButton?: boolean;
          onClose?: () => void;
          children?: React.ReactNode;
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
      ...rest
    }: ThemeProps & {
      className?: string;
      children?: React.ReactNode;
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
      ...rest
    }: ThemeProps & {
      className?: string;
      children?: React.ReactNode;
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
      ...rest
    }: ThemeProps & {
      className?: string;
      children?: React.ReactNode;
    } & React.HTMLAttributes<HTMLDivElement>) => (
      <div {...rest} className={cx('Modal-footer', className)}>
        {children}
      </div>
    )
  );

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
    onExited && onExited();
    setTimeout(() => {
      if (!document.querySelector('.amis-dialog-widget')) {
        document.body.classList.remove(`is-modalOpened`);
        document.body.classList.remove(`has-scrollbar`);
      }
    }, 200);
  };

  modalRef = (ref: any) => {
    const {classPrefix: ns} = this.props;
    if (ref) {
      addModal(this);
      (ref as HTMLElement).classList.add(`${ns}Modal--${current()}th`);
    } else {
      removeModal();
    }
  };

  render() {
    const {
      className,
      contentClassName,
      children,
      container,
      show,
      size,
      overlay,
      classnames: cx
    } = this.props;

    return (
      // @ts-ignore
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
          {(status: string) => (
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
                <div className={cx(`Modal-overlay`, fadeStyles[status])} />
              ) : null}
              <div
                className={cx(
                  `Modal-content`,
                  contentClassName,
                  fadeStyles[status]
                )}
              >
                {children}
              </div>
            </div>
          )}
        </Transition>
      </Portal>
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
