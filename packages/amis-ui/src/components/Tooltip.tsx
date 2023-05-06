/**
 * @file Tooltip
 * @description
 * @author fex
 */

import React from 'react';
import {ClassNamesFn, themeable} from 'amis-core';

interface TooltipProps extends React.HTMLProps<HTMLDivElement> {
  title?: string;
  classPrefix: string;
  classnames: ClassNamesFn;
  theme?: string;
  className?: string;
  style?: any;
  arrowProps?: any;
  placement?: string;
  showArrow?: boolean;
  tooltipTheme?: string;
  bodyClassName?: string;
  [propName: string]: any;
}

export class Tooltip extends React.Component<TooltipProps> {
  static defaultProps = {
    className: '',
    tooltipTheme: 'light',
    showArrow: true
  };

  render() {
    const {
      classPrefix: ns,
      className,
      tooltipTheme,
      title,
      children,
      arrowProps,
      style,
      placement,
      arrowOffsetLeft,
      arrowOffsetTop,
      positionLeft,
      positionTop,
      classnames: cx,
      activePlacement,
      showArrow,
      onMouseEnter,
      onMouseLeave,
      bodyClassName,
      ...rest
    } = this.props;

    return (
      <div
        {...rest}
        className={cx(
          `Tooltip`,
          activePlacement ? `Tooltip--${activePlacement}` : '',
          className,
          `Tooltip--${tooltipTheme === 'dark' ? 'dark' : 'light'}`
        )}
        style={style}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        role="tooltip"
      >
        {showArrow ? (
          <div className={cx(`Tooltip-arrow`)} {...arrowProps} />
        ) : null}
        {title ? <div className={cx('Tooltip-title')}>{title}</div> : null}
        <div className={cx(bodyClassName, 'Tooltip-body')}>{children}</div>
      </div>
    );
  }
}

export default themeable(Tooltip);
