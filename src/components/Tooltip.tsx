/**
 * @file Tooltip
 * @description
 * @author fex
 */

import React from 'react';
import cx from 'classnames';
import {classPrefix, classnames} from '../themes/default';
import {ClassNamesFn, themeable} from '../theme';

interface TooltipProps extends React.HTMLProps<HTMLDivElement> {
  title?: string;
  classPrefix: string;
  classnames: ClassNamesFn;
  theme?: string;
  className?: string;
  style?: any;
  arrowProps?: any;
  placement?: string;
  [propName: string]: any;
}

export class Tooltip extends React.Component<TooltipProps> {
  static defaultProps = {
    className: ''
  };

  render() {
    const {
      classPrefix: ns,
      className,
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
      ...rest
    } = this.props;

    return (
      <div
        {...rest}
        className={cx(
          `Tooltip`,
          activePlacement ? `Tooltip--${activePlacement}` : '',
          className
        )}
        style={style}
        role="tooltip"
      >
        <div className={cx(`Tooltip-arrow`)} {...arrowProps} />
        {title ? <div className={cx('Tooltip-title')}>{title}</div> : null}
        <div className={cx('Tooltip-body')}>{children}</div>
      </div>
    );
  }
}

export default themeable(Tooltip);
