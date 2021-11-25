/**
 * @file Alert2
 * @author fex
 */

import React from 'react';
import {ClassNamesFn, themeable} from '../theme';
import {Icon} from './icons';

export interface AlertProps {
  level: 'danger' | 'info' | 'success' | 'warning';
  className: string;
  showCloseButton: boolean;
  onClose?: () => void;
  classnames: ClassNamesFn;
  classPrefix: string;
}

export interface AlertState {
  show: boolean;
}

export class Alert extends React.Component<AlertProps, AlertState> {
  static defaultProps: Pick<
    AlertProps,
    'level' | 'className' | 'showCloseButton'
  > = {
    level: 'info',
    className: '',
    showCloseButton: false
  };
  static propsList: Array<string> = [
    'level',
    'className',
    'showCloseButton',
    'onClose'
  ];

  constructor(props: AlertProps) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.state = {
      show: true
    };
  }

  handleClick() {
    this.setState(
      {
        show: false
      },
      this.props.onClose
    );
  }

  render() {
    const {
      classnames: cx,
      className,
      level,
      children,
      showCloseButton
    } = this.props;

    return this.state.show ? (
      <div className={cx('Alert', level ? `Alert--${level}` : '', className)}>
        {showCloseButton ? (
          <button
            className={cx('Alert-close')}
            onClick={this.handleClick}
            type="button"
          >
            <Icon icon="close" className="icon" />
          </button>
        ) : null}
        {children}
      </div>
    ) : null;
  }
}

export default themeable(Alert);
