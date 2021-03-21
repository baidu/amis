import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {BaseSchema, SchemaCollection, SchemaExpression} from '../Schema';
import {evalExpression} from '../utils/tpl';
import {resolveVariable} from '../utils/tpl-builtin';

/**
 * Badge 角标渲染器。
 * 文档：https://baidu.gitee.io/amis/docs/components/badge
 */
export interface BadgeSchema extends BaseSchema {
  /**
   * 指定为 badge 类型
   */
  type: 'badge';

  /**
   * 内容
   */
  body: SchemaCollection;

  /**
   * 显示内容
   */
  text?: string;

  /**
   * 大小
   */
  size?: number;

  /**
   * 角标类型
   */
  mode?: 'text' | 'dot';

  /**
   * 角标位置
   */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

  /**
   * 动态控制是否显示
   */
  displayOn?: SchemaExpression;

  /**
   * 自定义样式
   */
  style?: {
    [propName: string]: any;
  };

  /**
   *  角标的自定义样式
   */
  badgeStyle?: {
    [propName: string]: any;
  };
}

export interface BadgeProps
  extends RendererProps,
    Omit<BadgeSchema, 'className'> {
  children?: JSX.Element | ((props?: any) => JSX.Element);
}

export default class Badge extends React.Component<BadgeProps, object> {
  static propsList: Array<string> = ['body', 'className', 'children'];

  renderBody(): JSX.Element | null {
    const {children, body, render} = this.props;

    return children
      ? typeof children === 'function'
        ? children(this.props)
        : (children as JSX.Element)
      : body
      ? render('body', body)
      : null;
  }

  render() {
    let {
      mode = 'dot',
      text,
      classnames: cx,
      badgeStyle,
      size,
      style,
      data,
      position = 'top-right',
      displayOn = 'true',
      className
    } = this.props;

    let isDisplay = evalExpression(displayOn, data) === true;

    if (typeof text === 'string' && text[0] === '$') {
      text = resolveVariable(text, data);
    }

    // 设置默认值
    if (typeof size === 'undefined') {
      if (mode === 'dot') {
        size = 6;
      } else {
        size = 16;
      }
    }

    let sizeStyle = {};
    if (mode === 'text') {
      sizeStyle = {
        borderRadius: size / 2,
        height: size,
        lineHeight: size + 'px'
      };

      if (!text) {
        isDisplay = false;
      }
    }

    if (mode === 'dot') {
      sizeStyle = {width: size, height: size};
    }

    return (
      <div className={cx('Badge', className)} style={style}>
        {this.renderBody()}
        {isDisplay ? (
          mode === 'dot' ? (
            <span
              className={cx('Badge-dot', `Badge--${position}`)}
              style={{...sizeStyle, ...badgeStyle}}
            ></span>
          ) : (
            <span
              className={cx('Badge-text', `Badge--${position}`)}
              style={{...sizeStyle, ...badgeStyle}}
            >
              {text}
            </span>
          )
        ) : null}
        {}
      </div>
    );
  }
}

@Renderer({
  test: /(^|\/)badge$/,
  name: 'badge'
})
export class BadgeRenderer extends Badge {}
