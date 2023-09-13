/**
 * @file Button
 * @author fex
 */

import React from 'react';
import TooltipWrapper, {TooltipObject, Trigger} from './TooltipWrapper';
import {pickEventsProps} from 'amis-core';
import {ClassNamesFn, themeable} from 'amis-core';
import Spinner, {SpinnerExtraProps} from './Spinner';

export interface ButtonProps
  extends React.DOMAttributes<HTMLButtonElement>,
    SpinnerExtraProps {
  id?: string;
  className?: string;
  style?: any;
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
  componentClass: React.ElementType;
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
      size = 'default',
      disabled,
      className,
      style,
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
      loadingConfig,
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
                [`Button--size-${size}`]: size,
                [`Button--block`]: block,
                [`Button--iconOnly`]: iconOnly,
                'is-disabled': disabled,
                'is-active': active
              },
          className
        )}
        style={style}
        title={title}
        disabled={disabled}
      >
        {loading && !disabled && (
          <Spinner
            loadingConfig={loadingConfig}
            size="sm"
            show
            icon="loading-outline"
            className={cx(
              overrideClassName
                ? ''
                : {[`Button--loading Button--loading--${level}`]: level},
              loadingClassName
            )}
          />
        )}
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
