/**
 * @file 角标组件
 */

import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';

import {evalExpression, buildStyle} from 'amis-core';
import {resolveVariable, resolveVariableAndFilter} from 'amis-core';
import {ClassNamesFn} from 'amis-core';

/**
 * Badge 角标。
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/badge
 */
export interface BadgeObject {
  className?: string;

  /**
   * 文本内容
   */
  text?: string | number;

  /**
   * 大小
   */
  size?: number;

  /**
   * 角标类型
   */
  mode?: 'text' | 'dot' | 'ribbon';

  /**
   * 角标位置，相对于position的位置进行偏移
   */
  offset?: [number | string, number | string];

  /**
   * 角标位置
   */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

  /**
   * 封顶的数字值
   */
  overflowCount?: number;

  /**
   * 动态控制是否显示
   */
  visibleOn?: string;

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

  /**
   * 提示类型
   */
  level?: 'info' | 'warning' | 'success' | 'danger' | string;
}

export interface BadgeProps {
  badge?: BadgeObject;
  classnames: ClassNamesFn;
  data?: any;
  children?: React.ReactNode | Array<React.ReactNode>;
}

export class Badge extends React.Component<BadgeProps, object> {
  static propsList: Array<string> = ['body', 'className', 'children'];

  constructor(props: BadgeProps) {
    super(props);
  }

  renderBadge(
    text: any,
    size: number,
    position: any,
    offsetStyle: any,
    sizeStyle: any,
    animationElement: any
  ) {
    const {classnames: cx, badge, data} = this.props;
    let {mode = 'dot', level = 'danger', style} = badge as BadgeObject;

    const customStyle = buildStyle(style, data);

    if (typeof level === 'string' && level[0] === '$') {
      level = resolveVariableAndFilter(level, data);
    }

    switch (mode) {
      case 'dot':
        return (
          <span
            className={cx('Badge-dot', `Badge--${position}`, `Badge--${level}`)}
            style={{...offsetStyle, ...sizeStyle, ...customStyle}}
          >
            {animationElement}
          </span>
        );
      case 'text':
        return (
          <span
            className={cx(
              'Badge-text',
              `Badge--${position}`,
              `Badge--${level}`
            )}
            style={{...offsetStyle, ...sizeStyle, ...customStyle}}
          >
            {text}
            {animationElement}
          </span>
        );
      case 'ribbon':
        const outSize = size * Math.sqrt(2) + 5;
        return (
          <div
            className={cx('Badge-ribbon-out', `Badge-ribbon-out--${position}`)}
            style={{width: outSize, height: outSize}}
          >
            <span
              className={cx(
                'Badge-ribbon',
                `Badge-ribbon--${position}`,
                `Badge--${level}`
              )}
              style={{...sizeStyle, ...customStyle}}
            >
              {text}
              {animationElement}
            </span>
          </div>
        );
      default:
        return null;
    }
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
      level,
      size,
      style,
      offset,
      position = 'top-right',
      overflowCount = 99,
      visibleOn,
      className,
      animation
    } = badge;

    if (visibleOn) {
      isDisplay = evalExpression(visibleOn, data) === true;
    }

    if (typeof text === 'string' && text[0] === '$') {
      text = resolveVariableAndFilter(text, data);
    }

    // 设置默认值
    if (typeof size === 'undefined') {
      if (mode === 'dot') {
        size = 6;
      } else if (mode === 'ribbon') {
        size = 12;
      } else {
        size = 16;
      }
    }

    let sizeStyle = {};
    if (mode === 'text') {
      sizeStyle = {
        borderRadius: size / 2,
        height: size + 2,
        lineHeight: size + 'px'
      };
      // 当text、overflowCount都为number类型时，进行封顶值处理
      // 当text从模版字符串解析（text: "${badge}"）数字就会变为字符串
      // 因此当设置了overflowCount属性时 如果text可以强制转换成数字 那么也进行封顶处理
      if (
        typeof overflowCount === 'number' &&
        (typeof text === 'number' || (text && !isNaN(Number(text))))
      ) {
        text = (
          (text as number) > (overflowCount as number)
            ? `${overflowCount}+`
            : text
        ) as string | number;
      }

      if (!text) {
        isDisplay = false;
      }
    }

    if (mode === 'dot') {
      sizeStyle = {width: size, height: size};
    }

    if (mode === 'ribbon') {
      sizeStyle = {
        height: size,
        lineHeight: size + 'px',
        fontSize: size
      };
    }

    let offsetStyle = {};
    if (offset && offset.length) {
      const left = `calc(50% + ${parseInt(offset[0] as string, 10)}px)`;
      const right = `calc(-50% + ${parseInt(offset[1] as string, 10)}px)`;
      offsetStyle = {
        transform: `translate(${left}, ${right})`
      };
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
        {isDisplay
          ? this.renderBadge(
              text,
              size,
              position,
              offsetStyle,
              sizeStyle,
              animationElement
            )
          : null}
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
