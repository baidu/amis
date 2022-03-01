import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {BaseSchema, SchemaCollection} from '../Schema';
import {filter} from '../utils/tpl';
import {escapeHtml} from '../utils/tpl-builtin';
import {buildStyle} from '../utils/style';
import {TooltipWrapper as TooltipWrapperComp} from '../components';

import type {Trigger} from '../components/TooltipWrapper';

export interface TooltipWrapperSchema extends BaseSchema {
  /**
   * 文字提示容器
   */
  type: 'tooltip-wrapper';

  /**
   * 文字提示标题
   */
  title?: string;

  /**
   * 文字提示
   */
  tooltip?: string;

  /**
   * 文字提示浮层出现位置，默认为top
   */
  placement?: 'top' | 'right' | 'bottom' | 'left';

  /**
   * 浮层触发方式，默认为hover
   */
  trigger?: Trigger | Array<Trigger>;

  /**
   * 浮层隐藏延迟时间，单位ms，默认0
   */
  delay?: number;

  /**
   * 是否点击非内容区域关闭提示，默认为true
   */
  rootClose?: boolean;

  /**
   * 内容区域
   */
  body?: SchemaCollection;

  /**
   * 内容区包裹标签
   */
  wrapperComponent: string;

  /**
   * 内容区是否内联显示，默认为false
   */
  inline?: boolean;

  /**
   * 浮层主题色，默认为light
   */
  tooltipTheme?: 'light' | 'dark';

  /**
   * 内容区自定义样式
   */
  style?: {
    [propName: string]: any;
  };

  /**
   * 自定义提示浮层样式
   */
  tooltipStyle?: {
    [propName: string]: any;
  };

  /**
   * 内容区CSS类名
   */
  className?: string;

  /**
   * 文字提示浮层CSS类名
   */
  tooltipClassName?: string;
}

export interface TooltipWrapperProps extends RendererProps {
  /**
   * 文字提示标题
   */
  title?: string;
  /**
   * 文字提示
   */
  tooltip?: string;
  /**
   * 文字提示位置
   */
  placement: 'top' | 'right' | 'bottom' | 'left';
  inline?: boolean;
  trigger: Trigger | Array<Trigger>;
  rootClose?: boolean;
  delay?: number;
  container?: React.ReactNode;
  style?: React.CSSProperties;
  tooltipStyle?: React.CSSProperties;
  wrapperComponent?: string;
  tooltipTheme?: 'light' | 'dark';
}

interface TooltipWrapperState {}

export default class TooltipWrapper extends React.Component<
  TooltipWrapperProps,
  TooltipWrapperState
> {
  static defaultProps: Pick<
    TooltipWrapperProps,
    | 'placement'
    | 'trigger'
    | 'rootClose'
    | 'delay'
    | 'inline'
    | 'wrap'
    | 'tooltipTheme'
  > = {
    placement: 'top',
    trigger: 'hover',
    rootClose: true,
    delay: 0,
    inline: false,
    wrap: false,
    tooltipTheme: 'light'
  };

  constructor(props: TooltipWrapperProps) {
    super(props);
  }

  renderBody() {
    const {
      render,
      classnames: cx,
      body,
      className,
      wrapperComponent,
      inline,
      style,
      data,
      wrap
    } = this.props;
    const Comp =
      (wrapperComponent as keyof JSX.IntrinsicElements) ||
      (inline ? 'span' : 'div');

    return (
      <Comp
        className={cx('TooltipWrapper', className, {
          'TooltipWrapper--inline': inline
        })}
        style={buildStyle(style, data)}
      >
        {render('body', body)}
      </Comp>
    );
  }

  render() {
    const {
      tooltipClassName,
      classPrefix: ns,
      classnames: cx,
      container,
      placement,
      rootClose,
      tooltipStyle,
      title,
      tooltip,
      delay,
      trigger,
      tooltipTheme,
      data
    } = this.props;

    const tooltipObj = {
      title: escapeHtml(filter(title, data)),
      content: escapeHtml(filter(tooltip, data))
    };

    return (
      <TooltipWrapperComp
        classPrefix={ns}
        classnames={cx}
        style={buildStyle(tooltipStyle, data)}
        placement={placement}
        tooltip={tooltipObj}
        trigger={trigger}
        rootClose={rootClose}
        delay={delay}
        container={container}
        tooltipClassName={cx(tooltipClassName, {
          'Tooltip--dark': tooltipTheme === 'dark'
        })}
      >
        {this.renderBody()}
      </TooltipWrapperComp>
    );
  }
}

@Renderer({
  type: 'tooltip-wrapper'
})
export class TooltipWrapperRenderer extends TooltipWrapper {}
