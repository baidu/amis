/**
 * @file Tag
 */

import React from 'react';
import {themeable, ThemeProps} from '../theme';
import {Icon, getIcon} from './icons';
import {generateIcon} from '../utils/icon';
import {autobind, noop} from '../utils/helper';

export interface TagProps extends ThemeProps {
  style: React.CSSProperties;
  color?: string;
  label?: string | React.ReactNode;
  mode?: 'normal' | 'rounded' | 'status';
  icon?: string | React.ReactNode;
  closable?: boolean;
  closeIcon?: string | React.ReactNode;
  onClose?: (e: React.MouseEvent) => void;
}

export interface CheckableTagProps extends TagProps {
  onClick?: (e: React.MouseEvent) => void;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  checked?: boolean;
}

export type TagLevel =
  | 'inactive'
  | 'active'
  | 'success'
  | 'processing'
  | 'error'
  | 'warning';

const PRESET_COLOR: TagLevel[] = [
  'inactive',
  'active',
  'success',
  'processing',
  'error',
  'warning'
];

export class Tag extends React.Component<TagProps> {
  static defaultProps: Partial<TagProps> = {
    mode: 'normal'
  };

  renderCloseIcon() {
    const {closeIcon, classnames: cx, closable} = this.props;

    if (!closable) {
      return null;
    }

    const icon =
      typeof closeIcon === 'string' ? (
        getIcon(closeIcon) ? (
          <Icon icon={closeIcon} className="icon" />
        ) : (
          generateIcon(cx, closeIcon, 'Icon')
        )
      ) : React.isValidElement(closeIcon) ? (
        closeIcon
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

    const isPresetColor =
      color && PRESET_COLOR.indexOf(color as TagLevel) !== -1;

    const customColor = color && !isPresetColor ? color : undefined;

    const tagStyle = {
      backgroundColor: mode === 'normal' ? customColor : undefined,
      borderColor: mode === 'rounded' ? customColor : undefined,
      color: mode === 'rounded' ? customColor : undefined,
      ...style
    };

    const prevIcon = mode === 'status' && (
      <span className={cx('Tag--prev')}>
        {typeof icon === 'string' ? (
          getIcon(icon) ? (
            <Icon icon={icon} className="icon" />
          ) : (
            generateIcon(cx, icon, 'Icon')
          )
        ) : React.isValidElement(icon) ? (
          icon
        ) : (
          <Icon icon="dot" className="icon" />
        )}
      </span>
    );

    return (
      <span
        className={cx('Tag', `Tag--${mode}`, className, {
          [`Tag--${mode}--${color}`]: isPresetColor,
          [`Tag--${mode}--hasColor`]: color
        })}
        style={tagStyle}
      >
        {prevIcon}
        {label || children}
        {this.renderCloseIcon()}
      </span>
    );
  }
}

class CheckableTagComp extends React.Component<CheckableTagProps> {
  @autobind
  handleClick(e: React.MouseEvent) {
    const {onChange, onClick, checked} = this.props;

    onChange?.(!checked);
    onClick?.(e);
  }

  render() {
    const {
      classnames: cx,
      className,
      disabled,
      label,
      children,
      checked,
      style = {}
    } = this.props;

    return (
      <span
        className={cx(className, 'Tag', 'Tag--checkable', {
          'Tag--checkable--checked': checked,
          'Tag--checkable--disabled': disabled
        })}
        onClick={disabled ? noop : this.handleClick}
        style={style}
      >
        {label || children}
      </span>
    );
  }
}

export const CheckableTag = themeable(CheckableTagComp);
export default themeable(Tag);
