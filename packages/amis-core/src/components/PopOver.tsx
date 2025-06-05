/**
 * @file PopOver
 * @description
 * @author fex
 */

import React from 'react';
import {findDOMNode} from 'react-dom';
import {ClassNamesFn, themeable} from '../theme';
import {autobind, camel, preventDefault, TestIdBuilder} from '../utils';
import {SubPopoverDisplayedID} from './Overlay';

export interface Offset {
  x: number;
  y: number;
}

export interface PopOverProps {
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
  testIdBuilder?: TestIdBuilder;
  [propName: string]: any;
}

interface PopOverState {
  xOffset: number;
  yOffset: number;
}

export class PopOver extends React.PureComponent<PopOverProps, PopOverState> {
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
  wrapperRef: React.RefObject<HTMLDivElement> = React.createRef();
  isRootClosed = false;

  componentDidMount() {
    this.mayUpdateOffset();
    const dom = findDOMNode(this) as HTMLElement;
    this.parent = dom.parentNode as HTMLElement;
    this.parent.classList.add('has-popover');

    if (this.wrapperRef && this.wrapperRef.current) {
      // https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener#使用_passive_改善的滚屏性能
      this.wrapperRef.current.addEventListener('touchmove', preventDefault, {
        passive: false,
        capture: false
      });
    }

    // 从弹窗中处理复制过来的，如果要修改，请同步修改
    // 因为 overlay 功能其实是用 postion: fixed 来实现的
    // 目的是加一个蒙层监听蒙层点击然后关闭弹窗。意图就是 closeOnOutside
    // 但是如果上层有个 translateZ 之类的样式就会影响 fixed 的定位，导致功能失效
    // 所以这里兜底加了个 closeOnOutside 的功能
    document.body.addEventListener(
      'mousedown',
      this.handleRootMouseDownCapture,
      true
    );
    document.body.addEventListener(
      'mouseup',
      this.handleRootMouseUpCapture,
      true
    );
    document.body.addEventListener('mouseup', this.handleRootMouseUp);
  }

  componentDidUpdate() {
    this.mayUpdateOffset();
  }

  componentWillUnmount() {
    this.parent && this.parent.classList.remove('has-popover');

    if (this.wrapperRef && this.wrapperRef.current) {
      this.wrapperRef.current.removeEventListener('touchmove', preventDefault);
    }

    document.body.removeEventListener('mouseup', this.handleRootMouseUp);
    document.body.removeEventListener(
      'mousedown',
      this.handleRootMouseDownCapture,
      true
    );
    document.body.removeEventListener(
      'mouseup',
      this.handleRootMouseUpCapture,
      true
    );
  }

  @autobind
  handleRootMouseDownCapture(e: MouseEvent) {
    const target = e.target as HTMLElement;
    const {overlay: closeOnOutside, classPrefix: ns} = this.props;
    const isLeftButton =
      (e.button === 1 && window.event !== null) || e.button === 0;

    this.isRootClosed = !!(
      isLeftButton &&
      closeOnOutside &&
      target &&
      this.wrapperRef.current &&
      // 要可见，不可见就不处理了，通常是打开了新页签
      this.wrapperRef.current.offsetHeight &&
      !this.wrapperRef.current
        .getAttributeNames()
        .find(n => n.startsWith(SubPopoverDisplayedID)) &&
      ((!this.wrapperRef.current.contains(target) &&
        !target.closest('[role=dialog]')) ||
        (target.matches(`.${ns}Modal`) && target === this.wrapperRef.current))
    ); // 干脆过滤掉来自弹框里面的点击
  }

  @autobind
  handleRootMouseUpCapture(e: MouseEvent) {
    // mousedown 的时候不在弹窗里面，则不需要判断了
    if (!this.isRootClosed) {
      return;
    }

    // 再判断 mouseup 的时候是不是在弹窗里面
    this.handleRootMouseDownCapture(e);
  }

  @autobind
  handleRootMouseUp(e: MouseEvent) {
    const {onHide} = this.props;
    if (this.isRootClosed && !e.defaultPrevented) {
      // 因为原来 overlay 是不会让别的部分还有点击事件的，所以这里要阻止默认事件
      // 参考：https://stackoverflow.com/questions/8643739/cancel-click-event-in-the-mouseup-event-handler
      let captureClick = (e: Event) => {
        e.stopPropagation();
        window.removeEventListener('click', captureClick, true);
      };
      window.addEventListener('click', captureClick, true);
      onHide?.();
    }
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

  @autobind
  handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    this.props.onHide?.();
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
      componentId,
      testIdBuilder,
      ...rest
    } = this.props;

    const {xOffset, yOffset} = this.state;
    const outerStyle = {
      display: 'block',
      ...style,
      top: (positionTop as number) + yOffset,
      left: (positionLeft as number) + xOffset
    };
    const placements =
      typeof activePlacement === 'string' ? activePlacement.split('-') : [];

    return (
      <div
        ref={this.wrapperRef}
        role="popover"
        className={cx(
          `PopOver`,
          className,
          activePlacement ? `PopOver--${camel(activePlacement)}` : '',
          placements[3] ? `PopOver--v-${placements[3]}` : ''
        )}
        style={outerStyle}
        {...testIdBuilder?.getTestId()}
        {...rest}
      >
        {overlay ? (
          <div
            className={`${ns}PopOver-overlay`}
            onClick={this.handleOverlayClick}
            {...testIdBuilder?.getChild('overlay').getTestId()}
          />
        ) : null}
        {children}
      </div>
    );
  }
}

export default themeable(PopOver);
