/**
 * @file TooltipWrapper
 * @description
 * @author fex
 */

import React from 'react';
import Html from './Html';
import {uncontrollable} from 'uncontrollable';
import {findDOMNode} from 'react-dom';
import Tooltip from './Tooltip';
import {ClassNamesFn, themeable} from '../theme';
import Overlay from './Overlay';

export interface TooltipObject {
  title?: string;
  content?: string;
  render?: () => JSX.Element;
  dom?: JSX.Element;
}

export type Trigger = 'hover' | 'click' | 'focus';

export interface TooltipWrapperProps {
  classPrefix: string;
  classnames: ClassNamesFn;
  placement: 'top' | 'right' | 'bottom' | 'left';
  tooltip?: string | TooltipObject;
  container?: React.ReactNode;
  trigger: Trigger | Array<Trigger>;
  rootClose: boolean;
  overlay?: any;
  delay: number;
  theme?: string;
  tooltipClassName?: string;
  style?: React.CSSProperties;
}

interface TooltipWrapperState {
  show?: boolean;
}

let waitToHide: Function | null = null;

export class TooltipWrapper extends React.Component<
  TooltipWrapperProps,
  TooltipWrapperState
> {
  static defaultProps: Pick<
    TooltipWrapperProps,
    'placement' | 'trigger' | 'rootClose' | 'delay'
  > = {
    placement: 'top',
    trigger: ['hover', 'focus'],
    rootClose: false,
    delay: 300
  };

  target: HTMLElement;
  timer: ReturnType<typeof setTimeout>;
  moutned = true;
  constructor(props: TooltipWrapperProps) {
    super(props);

    this.getTarget = this.getTarget.bind(this);
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleHide = this.handleHide.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);

    this.state = {
      show: false
    };
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    this.moutned = false;
  }

  getTarget() {
    return findDOMNode(this);
  }

  show() {
    this.setState({
      show: true
    });
  }

  hide() {
    waitToHide = null;
    this.moutned &&
      this.setState({
        show: false
      });
  }

  getChildProps() {
    const child = React.Children.only(this.props.children);
    return child && (child as any).props;
  }

  handleShow() {
    this.timer && clearTimeout(this.timer);
    waitToHide && waitToHide();
    this.show();
  }

  handleHide() {
    clearTimeout(this.timer);
    const {delay} = this.props;

    waitToHide = this.hide.bind(this);
    this.timer = setTimeout(this.hide, delay);
  }

  handleFocus(e: any) {
    const {onFocus} = this.getChildProps();
    this.handleShow();
    onFocus && onFocus(e);
  }

  handleBlur(e: any) {
    const {onBlur} = this.getChildProps();
    this.handleHide();
    onBlur && onBlur(e);
  }

  handleMouseOver(e: any) {
    this.handleMouseOverOut(this.handleShow, e, 'fromElement');
  }

  handleMouseOut(e: any) {
    this.handleMouseOverOut(this.handleHide, e, 'toElement');
  }

  handleMouseOverOut(
    handler: Function,
    e: React.MouseEvent<HTMLElement>,
    relatedNative: string
  ) {
    const target = e.currentTarget;
    const related: any =
      e.relatedTarget || (e as any).nativeEvent[relatedNative];

    if ((!related || related !== target) && !target.contains(related)) {
      handler(e);
    }
  }

  handleClick(e: any) {
    const {onClick} = this.getChildProps();
    this.state.show ? this.hide() : this.show();
    onClick && onClick(e);
  }

  render() {
    const {
      tooltip,
      children,
      placement,
      container,
      trigger,
      rootClose,
      tooltipClassName,
      style
    } = this.props;

    const child = React.Children.only(children);

    if (!tooltip) {
      return child;
    }

    const childProps: any = {
      key: 'target'
    };

    const triggers = Array.isArray(trigger) ? trigger.concat() : [trigger];

    if (~triggers.indexOf('click')) {
      childProps.onClick = this.handleClick;
    }

    if (~triggers.indexOf('focus')) {
      childProps.onFocus = this.handleShow;
      childProps.onBlur = this.handleHide;
    }

    if (~triggers.indexOf('hover')) {
      childProps.onMouseOver = this.handleMouseOver;
      childProps.onMouseOut = this.handleMouseOut;
    }

    return [
      child ? React.cloneElement(child as any, childProps) : null,

      <Overlay
        key="overlay"
        target={this.getTarget}
        show={this.state.show}
        onHide={this.handleHide}
        rootClose={rootClose}
        placement={placement}
        container={container}
      >
        <Tooltip
          title={typeof tooltip !== 'string' ? tooltip.title : undefined}
          style={style}
          className={tooltipClassName}
          onMouseEnter={~triggers.indexOf('hover') && this.handleMouseOver}
          onMouseLeave={~triggers.indexOf('hover') && this.handleMouseOut}
        >
          {tooltip && (tooltip as TooltipObject).render ? (
            this.state.show ? (
              (tooltip as TooltipObject).render!()
            ) : null
          ) : tooltip && (tooltip as TooltipObject).dom ? (
            (tooltip as TooltipObject).dom!
          ) : (
            <Html
              html={
                typeof tooltip === 'string' ? tooltip : tooltip.content || ''
              }
            />
          )}
        </Tooltip>
      </Overlay>
    ];
  }
}

export default themeable(
  uncontrollable(TooltipWrapper, {
    show: 'onVisibleChange'
  })
);
