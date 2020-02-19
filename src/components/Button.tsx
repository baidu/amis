/**
 * @file Button
 * @author fex
 */

import React from 'react';
import TooltipWrapper, {TooltipObject, Trigger} from './TooltipWrapper';
import {pickEventsProps} from '../utils/helper';
import {ClassNamesFn, themeable} from '../theme';

interface ButtonProps extends React.DOMAttributes<HTMLButtonElement> {
  id?: string;
  className?: string;
  href?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  type: 'button' | 'reset' | 'submit';
  level: string; // 'link' | 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'danger' | 'light' | 'dark' | 'default';
  tooltip?: string | TooltipObject;
  placement: 'top' | 'right' | 'bottom' | 'left';
  tooltipContainer?: any;
  tooltipTrigger: Trigger | Array<Trigger>;
  tooltipRootClose: boolean;
  disabled?: boolean;
  active?: boolean;
  block?: boolean;
  iconOnly?: boolean;
  disabledTip?: string | TooltipObject;
  classPrefix: string;
  classnames: ClassNamesFn;
  componentClass: React.ReactType;
}

export class Button extends React.Component<ButtonProps> {
  static defaultProps: Pick<
    ButtonProps,
    | 'componentClass'
    | 'level'
    | 'type'
    | 'placement'
    | 'tooltipTrigger'
    | 'tooltipRootClose'
  > = {
    componentClass: 'button',
    level: 'default',
    type: 'button',
    placement: 'top',
    tooltipTrigger: ['hover', 'focus'],
    tooltipRootClose: false
  };

  renderButton() {
    let {
      level,
      size,
      disabled,
      className,
      componentClass: Comp,
      classnames: cx,
      children,
      disabledTip,
      block,
      type,
      active,
      iconOnly,
      href,
      ...rest
    } = this.props;

    if (href) {
      Comp = 'a';
    }

    return (
      <Comp
        type={Comp === 'a' ? undefined : type}
        {...pickEventsProps(rest)}
        href={href}
        className={cx(
          `Button`,
          {
            [`Button--${level}`]: level,
            [`Button--${size}`]: size,
            [`Button--block`]: block,
            [`Button--iconOnly`]: iconOnly,
            'is-disabled': disabled,
            'is-active': active
          },
          className
        )}
        disabled={disabled}
      >
        {children}
      </Comp>
    );
  }

  render() {
    const {
      tooltip,
      placement,
      tooltipContainer,
      tooltipTrigger,
      tooltipRootClose,
      disabled,
      disabledTip,
      classPrefix,
      classnames: cx
    } = this.props;

    return (
      <TooltipWrapper
        placement={placement}
        tooltip={disabled ? disabledTip : tooltip}
        container={tooltipContainer}
        trigger={tooltipTrigger}
        rootClose={tooltipRootClose}
      >
        {disabled && disabledTip ? (
          <div className={cx('Button--disabled-wrap')}>
            {this.renderButton()}
          </div>
        ) : (
          this.renderButton()
        )}
      </TooltipWrapper>
    );
  }
}

export default themeable(Button);
