/**
 * @file Tag
 */

import React from 'react';
import {themeable, ThemeProps} from 'amis-core';
import {Icon, getIcon} from './icons';
import {autobind, noop} from 'amis-core';

export interface TagProps extends ThemeProps {
  style: React.CSSProperties;
  color?: string;
  label?: string | React.ReactNode;
  displayMode?: 'normal' | 'rounded' | 'status';
  icon?: string | React.ReactNode;
  closable?: boolean;
  disabled?: boolean;
  closeIcon?: string | React.ReactNode;
  onClose?: (e: React.MouseEvent) => void;
  onClick?: (e: React.MouseEvent) => void;
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseLeave?: (e: React.MouseEvent) => void;
  children?: React.ReactNode | Array<React.ReactNode>;
  dataIndex?: number;
}

export interface CheckableTagProps extends TagProps {
  onClick?: (e: React.MouseEvent) => void;
  onChange?: (checked: boolean) => void;
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
    displayMode: 'normal'
  };

  renderCloseIcon() {
    const {closeIcon, classnames: cx, closable} = this.props;

    if (!closable) {
      return null;
    }

    const icon = <Icon cx={cx} icon={closeIcon || 'close'} className="icon" />;

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

  @autobind
  handleClick(e: React.MouseEvent<HTMLElement>) {
    const {onClick} = this.props;
    onClick?.(e);
  }

  @autobind
  handleMouseEnter(e: React.MouseEvent<any>) {
    const {onMouseEnter} = this.props;
    onMouseEnter?.(e);
  }

  @autobind
  handleMouseLeave(e: React.MouseEvent<any>) {
    const {onMouseLeave} = this.props;
    onMouseLeave?.(e);
  }

  render() {
    const {
      children,
      classnames: cx,
      className,
      displayMode,
      disabled,
      color,
      icon,
      style,
      label,
      dataIndex
    } = this.props;

    const isPresetColor =
      color && PRESET_COLOR.indexOf(color as TagLevel) !== -1;

    const customColor = color && !isPresetColor ? color : undefined;

    const tagStyle = {
      backgroundColor: displayMode === 'normal' ? customColor : undefined,
      borderColor: displayMode === 'rounded' ? customColor : undefined,
      color: displayMode === 'rounded' ? customColor : undefined,
      ...style
    };

    let prevIcon;
    if (displayMode === 'status') {
      let iconItem;
      if (icon) {
        iconItem = <Icon icon={icon} className="icon" />;
      }
      if (!iconItem) {
        iconItem = (
          <Icon icon="dot" className={cx('icon', 'Tag-default-icon')} />
        );
      }

      const prevIconStyle = customColor ? {style: {color: customColor}} : {};
      prevIcon = (
        <span className={cx('Tag--prev')} {...prevIconStyle}>
          {iconItem}
        </span>
      );
    }

    return (
      <span
        className={cx('Tag', `Tag--${displayMode}`, className, {
          [`Tag--${displayMode}--${color}`]: isPresetColor,
          [`Tag--${displayMode}--hasColor`]: color,
          [`Tag--disabled`]: disabled
        })}
        style={tagStyle}
        onClick={this.handleClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        data-index={dataIndex}
      >
        <span
          className={cx('Tag-text')}
          title={typeof label === 'string' ? label : undefined}
        >
          {prevIcon}
          {label || children}
        </span>
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
      style = {},
      dataIndex
    } = this.props;

    return (
      <span
        className={cx(className, 'Tag', 'Tag--checkable', {
          'Tag--checkable--checked': checked,
          'Tag--checkable--disabled': disabled
        })}
        onClick={disabled ? noop : this.handleClick}
        style={style}
        title={typeof label === 'string' ? label : undefined}
        data-index={dataIndex}
      >
        {label || children}
      </span>
    );
  }
}

export const CheckableTag = themeable(CheckableTagComp);
export default themeable(Tag);
