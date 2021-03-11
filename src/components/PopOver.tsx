/**
 * @file PopOver
 * @description
 * @author fex
 */

import React from 'react';
import {findDOMNode} from 'react-dom';
import {ClassNamesFn, themeable} from '../theme';
import {camel} from '../utils/helper';

export interface Offset {
  x: number;
  y: number;
}

export interface PopOverPorps {
  className?: string;
  placement?: string;
  positionTop?: number;
  positionLeft?: number;
  arrowOffsetLeft?: number;
  arrowOffsetTop?: number;
  offset?: ((clip: object, offset: object) => Offset) | Offset;
  style?: object;
  overlay?: boolean;
  onHide?: () => void;
  onClick?: (e: React.MouseEvent<any>) => void;
  classPrefix: string;
  classnames: ClassNamesFn;
  [propName: string]: any;
}

interface PopOverState {
  xOffset: number;
  yOffset: number;
}

export class PopOver extends React.PureComponent<PopOverPorps, PopOverState> {
  static defaultProps = {
    className: '',
    offset: {
      x: 0,
      y: 0
    },
    overlay: false,
    placement: 'auto'
  };

  state = {
    xOffset: 0,
    yOffset: 0
  };

  parent: HTMLElement;

  componentDidMount() {
    this.mayUpdateOffset();
    const dom = findDOMNode(this) as HTMLElement;
    this.parent = dom.parentNode as HTMLElement;
    this.parent.classList.add('has-popover');
  }

  componentDidUpdate() {
    this.mayUpdateOffset();
  }

  componentWillUnmount() {
    this.parent && this.parent.classList.remove('has-popover');
  }

  mayUpdateOffset() {
    let offset: Offset;
    let getOffset = this.props.offset;

    if (getOffset && typeof getOffset === 'function') {
      const {placement, positionTop: y, positionLeft: x} = this.props;

      offset = getOffset(
        (findDOMNode(this) as HTMLElement).getBoundingClientRect(),
        {
          x,
          y,
          placement
        }
      );
    } else {
      offset = getOffset as Offset;
    }
    this.setState({
      xOffset: offset && offset.x ? (offset as Offset).x : 0,
      yOffset: offset && offset.y ? (offset as Offset).y : 0
    });
  }

  render() {
    const {
      placement,
      activePlacement,
      positionTop,
      positionLeft,
      arrowOffsetLeft,
      arrowOffsetTop,
      style,
      children,
      offset,
      overlay,
      onHide,
      classPrefix: ns,
      classnames: cx,
      className,
      ...rest
    } = this.props;

    const {xOffset, yOffset} = this.state;
    const outerStyle = {
      display: 'block',
      ...style,
      top: (positionTop as number) + yOffset,
      left: (positionLeft as number) + xOffset
    };

    return (
      <div
        className={cx(
          `${ns}PopOver`,
          className,
          `${ns}PopOver--${camel(activePlacement)}`
        )}
        style={outerStyle}
        {...rest}
      >
        {overlay ? (
          <div className={`${ns}PopOver-overlay`} onClick={onHide} />
        ) : null}
        {children}
      </div>
    );
  }
}

export default themeable(PopOver);
