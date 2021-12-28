/**
 * @file Alert2
 * @author fex
 */

import React from 'react';
import {ClassNamesFn, themeable} from '../theme';
import {Icon} from './icons';

export interface AlertProps {
  level: 'danger' | 'info' | 'success' | 'warning';
  title?: string;
  className?: string;
  showCloseButton: boolean;
  showIcon?: boolean;
  icon?: string | React.ReactNode;
  iconClassName?: string;
  closeButtonClassName?: string;
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
      showCloseButton,
      title,
      icon,
      showIcon,
      iconClassName,
      closeButtonClassName
    } = this.props;

    const iconNode = icon ? (
      typeof icon === 'string' ? (
        <Icon icon={icon} className={cx(`Alert-icon icon`)} />
      ) : React.isValidElement(icon) ? (
        React.cloneElement(icon, {
          className: cx(`Alert-icon`, icon.props?.className)
        })
      ) : null
    ) : showIcon ? (
      <Icon icon={`alert-${level}`} className={cx(`Alert-icon icon`)} />
    ) : null;

    return this.state.show ? (
      <div className={cx('Alert', level ? `Alert--${level}` : '', className)}>
        {showIcon && iconNode ? (
          <div className={cx('Alert-icon', iconClassName)}>{iconNode}</div>
        ) : null}
        <div className={cx('Alert-content')}>
          {title ? <div className={cx('Alert-title')}>{title}</div> : null}
          <div className={cx('Alert-desc')}>{children}</div>
        </div>
        {showCloseButton ? (
          <button
            className={cx('Alert-close', closeButtonClassName)}
            onClick={this.handleClick}
            type="button"
          >
            <Icon icon="close" className="icon" />
          </button>
        ) : null}
      </div>
    ) : null;
  }
}

export default themeable(Alert);
