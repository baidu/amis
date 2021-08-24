/**
 * @file 角标组件
 */

import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import {BaseSchema, SchemaExpression} from '../Schema';
import {evalExpression} from '../utils/tpl';
import {resolveVariable} from '../utils/tpl-builtin';
import {ClassNamesFn} from '../theme';

/**
 * Badge 角标。
 * 文档：https://baidu.gitee.io/amis/docs/components/badge
 */
export interface BadgeSchema extends BaseSchema {
  /**
   * 文本内容
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
  visibleOn?: SchemaExpression;

  /**
   * 是否显示动画
   */
  animation?: boolean;

  /**
   * 角标的自定义样式
   */
  style?: {
    [propName: string]: any;
  };
}

export interface BadgeProps {
  badge?: BadgeSchema;
  classnames: ClassNamesFn;
  data: any;
}

export class Badge extends React.Component<BadgeProps, object> {
  static propsList: Array<string> = ['body', 'className', 'children'];

  constructor(props: BadgeProps) {
    super(props);
  }

  render() {
    const badge = this.props.badge;
    if (!badge) {
      return this.props.children;
    }
    const {children, classnames: cx, data} = this.props;
    let isDisplay = true;
    if (typeof badge === 'string') {
      isDisplay = evalExpression(badge, data) === true;
    }

    let {
      mode = 'dot',
      text,
      size,
      style,
      position = 'top-right',
      visibleOn,
      className,
      animation
    } = badge;

    if (visibleOn) {
      isDisplay = evalExpression(visibleOn, data) === true;
    }

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

    let animationBackground = 'var(--danger)';

    if (style && style.background) {
      animationBackground = style.background;
    }

    const animationElement = animation ? (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: `1px solid ${animationBackground}`,
          borderRadius: '50%',
          animation: 'badgeDotAnimation 1.2s infinite ease-in-out'
        }}
      ></div>
    ) : null;

    return (
      <div className={cx('Badge', className)}>
        {children}
        {isDisplay ? (
          mode === 'dot' ? (
            <span
              className={cx('Badge-dot', `Badge--${position}`)}
              style={{...sizeStyle, ...style}}
            >
              {animationElement}
            </span>
          ) : (
            <span
              className={cx('Badge-text', `Badge--${position}`)}
              style={{...sizeStyle, ...style}}
            >
              {text}
              {animationElement}
            </span>
          )
        ) : null}
      </div>
    );
  }
}

export function withBadge<P extends object>(Component: React.ComponentType<P>) {
  return hoistNonReactStatic(
    class WithBadge extends React.Component<P & BadgeProps> {
      static displayName = `WithBadge(${
        Component.displayName || Component.name
      })`;

      render() {
        const badge = this.props.badge;

        if (!badge) {
          return <Component {...(this.props as P)} />;
        }

        return (
          <Badge {...(this.props as BadgeProps)}>
            <Component {...(this.props as P)} />
          </Badge>
        );
      }
    },
    Component
  );
}
