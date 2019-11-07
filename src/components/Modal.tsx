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
import cx from 'classnames';
import {current, addModal, removeModal} from './ModalManager';
import {ClassNamesFn, themeable} from '../theme';

export interface ModalProps {
  className?: string;
  size?: any;
  overlay?: boolean;
  onHide: () => void;
  closeOnEsc?: boolean;
  container?: any;
  show?: boolean;
  disabled?: boolean;
  classPrefix: string;
  classnames: ClassNamesFn;
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

  handleEntered = () => {
    const onEntered = this.props.onEntered;
    document.body.classList.add(`is-modalOpened`);
    onEntered && onEntered();
  };
  handleExited = () => {
    const onExited = this.props.onExited;
    onExited && onExited();
    setTimeout(() => {
      document.querySelector('.amis-dialog-widget') ||
        document.body.classList.remove(`is-modalOpened`);
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
      children,
      container,
      show,
      size,
      overlay,
      classPrefix: ns
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
          {(status: string) => (
            <div
              ref={this.modalRef}
              role="dialog"
              className={cx(
                `amis-dialog-widget ${ns}Modal`,
                {
                  [`${ns}Modal--${size}`]: size
                },
                className
              )}
            >
              {overlay ? (
                <div className={cx(`${ns}Modal-overlay`, fadeStyles[status])} />
              ) : null}
              <div className={cx(`${ns}Modal-content`, fadeStyles[status])}>
                {children}
              </div>
            </div>
          )}
        </Transition>
      </Portal>
    );
  }
}

export default themeable(Modal);
