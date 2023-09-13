import React from 'react';
import {themeable, ThemeProps} from 'amis-core';
import {autobind} from 'amis-core';
import {Icon} from './icons';

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
   * 右侧图标
   */
  rightIcon?: string;

  href?: string;
  htmlTarget?: string;
  title?: string;
  children?: React.ReactNode | Array<React.ReactNode>;
}

export class Link extends React.Component<LinkProps, object> {
  constructor(props: LinkProps) {
    super(props);
  }

  @autobind
  handleClick(e: React.MouseEvent<any>) {
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
      style,
      href,
      classnames: cx,
      disabled,
      htmlTarget,
      title,
      icon,
      rightIcon,
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
        style={style}
        title={title}
        onClick={this.handleClick}
      >
        {icon ? <Icon cx={cx} icon={icon} className="Link-icon" /> : null}
        {children}
        {rightIcon ? (
          <Icon cx={cx} icon={rightIcon} className="Link-icon" />
        ) : null}
      </a>
    );
  }
}

export default themeable(Link);
