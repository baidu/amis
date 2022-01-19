/**
 * @file Tag
 */

import React from 'react';
import {ClassNamesFn, themeable, ThemeProps} from '../theme';
import {Icon} from './icons';
import {autobind} from '../utils/helper';

export interface TagProps extends ThemeProps {
  className?: string;
  classnames: ClassNamesFn;
  color?: string;
  label?: string | React.ReactNode;
  mode?: 'normal' | 'rounded' | 'status';
  icon?: string | React.ReactNode;
  closable?: boolean;
  closeIcon?: string | React.ReactNode;
  onClose?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

export interface CheckableTagProps extends ThemeProps {
  className?: string;
  classnames: ClassNamesFn;
  onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onChange?: (checked: boolean) => void;
  disabled: boolean;
}

const PRESET_COLOR = [
  'inactive',
  'active',
  'success',
  'processing',
  'error',
  'warning'
];

export class Tag extends React.Component<TagProps> {
  constructor(props: TagProps) {
    super(props);
  }

  static defaultProps: Partial<TagProps> = {
    mode: 'normal',
    color: 'inactive'
  };

  renderCloseIcon() {
    const {closeIcon, classnames: cx, closable} = this.props;

    if (!closable) {
      return null;
    }

    const icon = closeIcon ? (
      typeof closeIcon === 'string' ? (
        <Icon icon={closeIcon} className="icon"></Icon>
      ) : (
        closeIcon
      )
    ) : (
      <Icon icon="close" className="icon" />
    );

    return (
      <span className={cx(`Tag--close`)} onClick={this.handleClose}>
        {icon}
      </span>
    );
  }

  @autobind
  handleClose(e: React.MouseEvent<HTMLElement>) {
    const {onClose} = this.props;
    e.stopPropagation();
    onClose?.(e);
  }

  render() {
    const {
      children,
      classnames: cx,
      className,
      mode,
      color,
      icon,
      style,
      label
    } = this.props;

    const isPresetColor = PRESET_COLOR.indexOf(color) !== -1;

    const tagClass = cx(
      'Tag',
      `Tag--${mode}`,
      isPresetColor && `Tag--${mode}--${color}`,
      className
    );

    const customColor = color && !isPresetColor ? color : undefined;

    const tagStyle = {
      backgroundColor: mode === 'normal' ? customColor : undefined,
      borderColor: mode === 'rounded' ? customColor : undefined,
      color: mode === 'rounded' ? customColor : undefined
    };

    const prevIcon = mode === 'status' && (
      <span className={cx('Tag--prev')}>
        {icon ? (
          typeof icon === 'string' ? (
            <Icon icon={icon} className="icon"></Icon>
          ) : (
            icon
          )
        ) : (
          <i className="fa fa-circle" style={{color: customColor}}></i>
        )}
      </span>
    );

    return (
      <span className={tagClass} style={tagStyle}>
        {prevIcon}
        {label || children}
        {this.renderCloseIcon()}
      </span>
    );
  }
}

class CheckableTag extends React.Component<CheckableTagProps> {
  constructor(props: TagProps) {
    super(props);
  }

  @autobind
  handleClick(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    const {onChange, onClick, checked, disabled} = this.props;

    onChange?.(!checked);
    onClick?.(e);
  }

  render() {
    const {classnames: cx, className, disabled, children, checked} = this.props;

    return (
      <span
        className={cx(className, 'Tag', 'Tag--checkable', {
          'Tag--checkable--checked': checked,
          'Tag--checkable--disable': disabled
        })}
        onClick={disabled ? () => {} : this.handleClick}
        disabled={disabled}
      >
        {children}
      </span>
    );
  }
}

Tag.CheckableTag = themeable(CheckableTag);

export default themeable(Tag);
