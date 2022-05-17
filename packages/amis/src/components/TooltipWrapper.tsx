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
import {isObject} from '../utils/helper';

export type Trigger = 'hover' | 'click' | 'focus';

export interface TooltipObject {
  /**
   * 文字提示标题
   */
  title?: string;
  /**
   * 文字提示内容
   */
  content?: string;
  /**
   * 浮层出现位置
   */
  placement?: 'top' | 'right' | 'bottom' | 'left';
  /**
   * 主题样式
   */
  tooltipTheme?: 'light' | 'dark';
  /**
   * 浮层位置相对偏移量
   */
  offset?: [number, number];
  /**
   * 内容区自定义样式
   */
  style?: React.CSSProperties;
  /**
   * 是否可以移入浮层中, 默认true
   */
  enterable?: boolean;
  /**
   * 是否展示浮层指向箭头
   */
  showArrow?: boolean;
  /**
   * 是否禁用提示
   */
  disabled?: boolean;
  /**
   * 浮层延迟显示时间, 单位 ms
   */
  mouseEnterDelay?: number;
  /**
   * 浮层延迟隐藏时间, 单位 ms
   */
  mouseLeaveDelay?: number;
  /**
   * 浮层内容可通过JSX渲染
   */
  children?: () => JSX.Element;
  /**
   * 挂载容器元素
   */
  container?: React.ReactNode;
  /**
   * 浮层触发方式
   */
  trigger?: Trigger | Array<Trigger>;
  /**
   * 是否点击非内容区域关闭提示，默认为true
   */
  rootClose?: boolean;
  /**
   * 文字提示浮层CSS类名
   */
  tooltipClassName?: string;
}

export interface TooltipWrapperProps {
  tooltip?: string | TooltipObject;
  classPrefix: string;
  classnames: ClassNamesFn;
  placement: 'top' | 'right' | 'bottom' | 'left';
  container?: React.ReactNode;
  trigger: Trigger | Array<Trigger>;
  rootClose: boolean;
  overlay?: any;
  delay: number;
  tooltipTheme?: string;
  tooltipClassName?: string;
  style?: React.CSSProperties;
  /**
   * 显示&隐藏时触发
   */
  onVisibleChange?: (visible: boolean) => void;
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
    this.setState(
      {
        show: true
      },
      () => {
        if (this.props.onVisibleChange) {
          this.props.onVisibleChange(true);
        }
      }
    );
  }

  hide() {
    waitToHide = null;
    this.moutned &&
      this.setState(
        {
          show: false
        },
        () => {
          if (this.props.onVisibleChange) {
            this.props.onVisibleChange(false);
          }
        }
      );
  }

  getChildProps() {
    const child = React.Children.only(this.props.children);
    return child && (child as any).props;
  }

  tooltipMouseEnter = (e: MouseEvent) => {
    const tooltip = this.props.tooltip;
    const enterable = (tooltip as any)?.enterable ?? true;
    enterable && clearTimeout(this.timer);
  };

  tooltipMouseLeave = (e: MouseEvent) => {
    const tooltip = this.props.tooltip;
    const enterable = (tooltip as any)?.enterable ?? true;
    enterable && clearTimeout(this.timer);
    this.hide();
  };

  handleShow() {
    this.timer && clearTimeout(this.timer);
    waitToHide && waitToHide();
    const tooltip = this.props.tooltip;
    if (isObject(tooltip)) {
      const {mouseEnterDelay = 0} = tooltip as TooltipObject;
      this.timer = setTimeout(this.show, mouseEnterDelay);
    } else {
      this.timer = setTimeout(this.show, 0);
    }
  }

  handleHide() {
    clearTimeout(this.timer);
    const {delay, tooltip} = this.props;

    waitToHide = this.hide.bind(this);
    if (isObject(tooltip)) {
      const {mouseLeaveDelay = 300} = tooltip as TooltipObject;
      this.timer = setTimeout(this.hide, mouseLeaveDelay);
    } else {
      this.timer = setTimeout(this.hide, delay);
    }
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
    const props = this.props;

    const child = React.Children.only(props.children);
    if (!props.tooltip) {
      return child;
    }

    // tooltip 对象内属性优先级更高
    const tooltipObj: TooltipObject = {
      placement: props.placement,
      container: props.container,
      trigger: props.trigger,
      rootClose: props.rootClose,
      tooltipClassName: props.tooltipClassName,
      style: props.style,
      mouseLeaveDelay: props.delay,
      tooltipTheme: props.tooltipTheme as 'dark' | 'light',
      ...(typeof props.tooltip === 'string'
        ? {content: props.tooltip}
        : props.tooltip)
    };

    const {
      title,
      content,
      placement,
      container,
      trigger,
      rootClose,
      tooltipClassName,
      style,
      disabled = false,
      offset,
      tooltipTheme = 'light',
      showArrow = true,
      children
    } = tooltipObj;

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
        show={this.state.show && !disabled}
        onHide={this.handleHide}
        rootClose={rootClose}
        placement={placement}
        container={container}
        offset={Array.isArray(offset) ? offset : [0, 0]}
      >
        <Tooltip
          title={typeof title === 'string' ? title : undefined}
          style={style}
          className={tooltipClassName}
          tooltipTheme={tooltipTheme}
          showArrow={showArrow}
          onMouseEnter={
            ~triggers.indexOf('hover') ? this.tooltipMouseEnter : () => {}
          }
          onMouseLeave={
            ~triggers.indexOf('hover') ? this.tooltipMouseLeave : () => {}
          }
        >
          {children ? (
            <>{typeof children === 'function' ? children() : children}</>
          ) : (
            <Html html={typeof content === 'string' ? content : ''} />
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
