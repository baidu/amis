/**
 * @file 角标组件
 */

import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import {BaseSchema, SchemaExpression} from '../Schema';
import {evalExpression} from '../utils/tpl';
import {resolveVariable, resolveVariableAndFilter} from '../utils/tpl-builtin';
import {ClassNamesFn} from '../theme';
import {buildStyle} from '../utils/style';

/**
 * Badge 角标。
 * 文档：https://baidu.gitee.io/amis/docs/components/badge
 */
export interface BadgeSchema extends Omit<BaseSchema, 'type'> {
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
   * 角标位置，优先级大于position
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

  /**
   * 提示类型
   */
  level?: 'info' | 'warning' | 'success' | 'danger' | SchemaExpression;
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

  renderBadge(
    text: any,
    size: number,
    position: any,
    offsetStyle: any,
    sizeStyle: any,
    animationElement: any
  ) {
    const {classnames: cx, badge, data} = this.props;
    let {mode = 'dot', level = 'danger', style} = badge as BadgeSchema;

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
        height: size,
        lineHeight: size + 'px'
      };
      // 当text、overflowCount都为number类型时，进行封顶值处理
      if (typeof text === 'number' && typeof overflowCount === 'number') {
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
    // 如果设置了offset属性，offset在position为'top-right'的基础上进行translate定位
    if (offset && offset.length) {
      position = 'top-right';
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
