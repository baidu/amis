/**
 * @file Alert2
 * @author fex
 */

import React from 'react';
import {ClassNamesFn, themeable} from 'amis-core';
import {Icon, getIcon} from './icons';

export interface AlertProps {
  level: 'danger' | 'info' | 'success' | 'warning';
  title?: string;
  className?: string;
  style?: any;
  showCloseButton: boolean;
  showIcon?: boolean;
  icon?: string | React.ReactNode;
  iconClassName?: string;
  closeButtonClassName?: string;
  onClose?: () => void;
  classnames: ClassNamesFn;
  classPrefix: string;
  children?: React.ReactNode | Array<React.ReactNode>;
  actions?: React.ReactNode | React.ReactNode[];
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
      style,
      level,
      children,
      actions,
      showCloseButton,
      title,
      icon,
      showIcon,
      iconClassName,
      closeButtonClassName
    } = this.props;

    // 优先使用内置svg，其次使用icon库
    const iconNode = showIcon ? (
      <Icon cx={cx} icon={icon || `alert-${level}`} className="icon" />
    ) : null;

    return this.state.show ? (
      <div
        className={cx(
          'Alert',
          level ? `Alert--${level}` : '',
          title ? 'Alert-has-title' : '',
          className
        )}
        style={style}
      >
        {showIcon && iconNode ? (
          <div className={cx('Alert-icon', iconClassName)}>{iconNode}</div>
        ) : null}
        <div className={cx('Alert-content')}>
          {title ? <div className={cx('Alert-title')}>{title}</div> : null}
          <div className={cx('Alert-desc')}>{children}</div>
        </div>
        {actions ? <div className={cx('Alert-actions')}>{actions}</div> : null}
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
