import React from 'react';
import {themeable, ThemeProps} from '../theme';
import {autobind} from '../utils/helper';
import {generateIcon} from '../utils/icon';

export interface LinkProps
  extends ThemeProps,
    React.DOMAttributes<HTMLAnchorElement> {
  /**
   * 禁用
   */
  disabled?: boolean;

  /**
   * 图标
   */
  icon?: string;

  /**
   * 图标位置
   */
  iconPosition?: 'left' | 'right';

  href?: string;
  htmlTarget?: string;
  title?: string;
  children?: JSX.Element;
}

export class Link extends React.Component<LinkProps, object> {
  constructor(props: LinkProps) {
    super(props);
  }

  @autobind
  aClick(e: React.MouseEvent<any>) {
    const {disabled, onClick} = this.props;
    if (disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    onClick?.(e);
  }

  render() {
    const {
      className,
      href,
      classnames: cx,
      disabled,
      htmlTarget,
      title,
      icon,
      iconPosition,
      children,
      classPrefix,
      theme,
      ...rest
    } = this.props;

    return (
      <a
        {...rest}
        href={href}
        target={htmlTarget}
        className={cx(
          `Link`,
          {
            'is-disabled': disabled
          },
          className
        )}
        title={title}
        onClick={this.aClick}
      >
        {icon && iconPosition !== 'right'
          ? generateIcon(cx, icon, 'Link-icon')
          : null}
        {children}
        {icon && iconPosition === 'right'
          ? generateIcon(cx, icon, 'Link-icon')
          : null}
      </a>
    );
  }
}

export default themeable(Link);
