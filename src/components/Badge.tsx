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
   * 自定义背景颜色
   */
  color?: string
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
      offset,
      position = 'top-right',
      overflowCount = 99,
      visibleOn,
      className,
      animation,
      color
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
    if (['text', 'ribbon'].includes(mode)) {
      sizeStyle = {
        borderRadius: size / 2,
        height: size,
        lineHeight: size + 'px'
      };
      // 当text、overflowCount都为number类型时，进行封顶值处理
      if (typeof text === 'number' && typeof overflowCount === 'number') {
        text = (
          (text as number) > (overflowCount as number) ? `${overflowCount}+` : text
        ) as string | number;
      }

      if (!text) {
        isDisplay = false;
      }
    }

    if (mode === 'dot') {
      sizeStyle = {width: size, height: size};
    }

    let offsetStyle = {};
    // 如果设置了offset属性，offset在position为'top-right'的基础上进行translate定位
    if (offset && offset.length) {
      position = 'top-right';
      const left = `calc(50% + ${parseInt(offset[0] as string, 10)}px)`;
      const right = `calc(-50% + ${parseInt(offset[1] as string, 10)}px)`;
      offsetStyle = {
        transform: `translate(${left}, ${right})`,
      };
    }

    let animationBackground = 'var(--danger)';

    if (color) {
      style ? style.background = color : (
        style = {
          'background': color,
        }
      )
    }

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

    const getContext = () => {
      if (!isDisplay) {
        return (
          <div className={cx('Badge', className)}>
            {children}
          </div>
        );
      }
      switch (mode) {
        case 'dot':
          return (
            <div className={cx('Badge', className)}>
              {children}
              <span
                className={cx('Badge-dot', `Badge--${position}`)}
                style={{...offsetStyle, ...sizeStyle, ...style}}
              >
                {animationElement}
              </span>
            </div>
          )
        case 'text':
          return (
            <div className={cx('Badge', className)}>
              {children}
              <span
                className={cx('Badge-text', `Badge--${position}`)}
                style={{...offsetStyle, ...sizeStyle, ...style}}
              >
                {text}
                {animationElement}
              </span>
            </div>
          )
        case 'ribbon':
          return (
            <div className={cx('Badge', className)}>
              <div
                className={cx('Badge-ribbon', `Badge-ribbon--${position}`)} 
              >
                {children}
                <div className="wrap" style={{...style}}>
                  {text}
                </div>
              </div>
            </div>
          )
      }
      return null;
    }

    return (
      getContext()
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
