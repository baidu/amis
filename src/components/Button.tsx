/**
 * @file Button
 * @author fex
 */

import React from 'react';
import TooltipWrapper, {TooltipObject, Trigger} from './TooltipWrapper';
import {pickEventsProps} from '../utils/helper';
import {ClassNamesFn, themeable} from '../theme';
import {Icon} from './icons';
interface ButtonProps extends React.DOMAttributes<HTMLButtonElement> {
  id?: string;
  className?: string;
  href?: string;
  title?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  type: 'button' | 'reset' | 'submit';
  level: string; // 'link' | 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'danger' | 'light' | 'dark' | 'default';
  tooltip?: string | TooltipObject;
  tooltipPlacement: 'top' | 'right' | 'bottom' | 'left';
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
  overrideClassName?: boolean;
  loading?: boolean;
  loadingClassName?: string;
}

export class Button extends React.Component<ButtonProps> {
  static defaultProps: Pick<
    ButtonProps,
    | 'componentClass'
    | 'level'
    | 'type'
    | 'tooltipPlacement'
    | 'tooltipTrigger'
    | 'tooltipRootClose'
  > = {
    componentClass: 'button',
    level: 'default',
    type: 'button',
    tooltipPlacement: 'top',
    tooltipTrigger: ['hover', 'focus'],
    tooltipRootClose: false
  };

  renderButton() {
    let {
      level,
      size,
      disabled,
      className,
      title,
      componentClass: Comp,
      classnames: cx,
      children,
      disabledTip,
      block,
      type,
      active,
      iconOnly,
      href,
      loading,
      loadingClassName,
      overrideClassName,
      ...rest
    } = this.props;

    if (href) {
      Comp = 'a';
    } else if ((Comp === 'button' && disabled) || loading) {
      Comp = 'div';
    }

    return (
      <Comp
        type={Comp === 'input' || Comp === 'button' ? type : undefined}
        {...pickEventsProps(rest)}
        onClick={rest.onClick && disabled ? () => {} : rest.onClick}
        href={href}
        className={cx(
          overrideClassName
            ? ''
            : {
                'Button': true,
                [`Button--${level}`]: level,
                [`Button--${size}`]: size,
                [`Button--block`]: block,
                [`Button--iconOnly`]: iconOnly,
                'is-disabled': disabled,
                'is-active': active
              },
          className
        )}
        title={title}
        disabled={disabled}
      >
        {loading && !disabled ? (
          <span
            className={cx(
              overrideClassName
                ? ''
                : {[`Button--loading Button--loading--${level}`]: level},
              loadingClassName
            )}
          >
            <Icon icon="loading-outline" className="icon" />
          </span>
        ) : null}
        {children}
      </Comp>
    );
  }

  render() {
    const {
      tooltip,
      tooltipPlacement,
      tooltipContainer,
      tooltipTrigger,
      tooltipRootClose,
      disabled,
      disabledTip,
      classnames: cx
    } = this.props;

    return (
      <TooltipWrapper
        placement={tooltipPlacement}
        tooltip={disabled ? disabledTip : tooltip}
        container={tooltipContainer}
        trigger={tooltipTrigger}
        rootClose={tooltipRootClose}
      >
        {this.renderButton()}
      </TooltipWrapper>
    );
  }
}

export default themeable(Button);
