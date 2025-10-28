import React from 'react';
import {
  Renderer,
  RendererProps,
  CustomStyle,
  setThemeClassName,
  isPureVariable,
  resolveVariableAndFilter,
  AMISSchemaBase,
  AMISSchemaCollection
} from 'amis-core';

/**
 * Divider 分割线渲染器。
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/divider
 */
/**
 * 分割线组件，用于分隔内容区域。支持水平/垂直、文字与样式。
 */
export interface AMISDividerSchema extends AMISSchemaBase {
  /**
   * 指定为 divider 组件
   */
  type: 'divider';
  /**
   * 分割线的类型，可选值：'dashed'（虚线）、'solid'（实线）
   */
  lineStyle?: 'dashed' | 'solid';

  /**
   * 分割线方向，可选值：'horizontal'（水平）、'vertical'（垂直）
   */
  direction?: 'horizontal' | 'vertical';

  /**
   * 分割线颜色，支持普通颜色值和渐变
   */
  color?: string;

  /**
   * 分割线旋转角度
   */
  rotate?: number;

  /**
   * 分割线标题内容
   */
  title?: AMISSchemaCollection;

  /**
   * 分割线标题自定义样式类名
   */
  titleClassName?: string;

  /**
   * 分割线标题位置，可选值：'left'、'center'、'right'
   */
  titlePosition?: 'left' | 'center' | 'right';
}

export interface DividerProps
  extends RendererProps,
    Omit<AMISDividerSchema, 'type' | 'className'> {}

export default class Divider extends React.Component<DividerProps, object> {
  static defaultProps: Pick<
    DividerProps,
    'className' | 'lineStyle' | 'titleClassName' | 'titlePosition'
  > = {
    className: '',
    lineStyle: 'solid',
    titleClassName: '',
    titlePosition: 'center'
  };

  render() {
    let {
      render,
      classnames: cx,
      className,
      style = {},
      lineStyle,
      direction,
      color,
      rotate,
      title,
      titleClassName,
      titlePosition,
      id,
      themeCss,
      env,
      data
    } = this.props;

    const borderColor: any = {};
    if (color) {
      // 处理渐变色的情况
      if (~color?.indexOf('linear-gradient')) {
        borderColor.borderImage = color + ' 10';
      } else {
        borderColor.borderColor = color;
      }
    }

    let transform = style?.transform || '';
    if (rotate) {
      transform += ` rotate(${rotate}deg)`;
    }

    if (isPureVariable(title)) {
      title = resolveVariableAndFilter(title, data);
    }

    const classNames = cx(
      'Divider',
      lineStyle ? `Divider--${lineStyle}` : '',
      direction === 'vertical' ? 'Divider--vertical' : 'Divider--horizontal',
      title && direction !== 'vertical' ? 'Divider--with-text' : '',
      title && direction !== 'vertical' && titlePosition
        ? `Divider--with-text-${titlePosition}`
        : '',
      title && direction !== 'vertical'
        ? setThemeClassName({
            ...this.props,
            name: 'titleWrapperControlClassName',
            id,
            themeCss
          })
        : '',
      className
    );

    return (
      <div className={classNames} style={{...style, ...borderColor, transform}}>
        {title && direction !== 'vertical' ? (
          <span
            className={cx(
              `Divider-text Divider-text-${titlePosition} ${titleClassName}`,
              setThemeClassName({
                ...this.props,
                name: 'titleControlClassName',
                id,
                themeCss
              })
            )}
          >
            {render('title', title)}
          </span>
        ) : null}
        <CustomStyle
          {...this.props}
          config={{
            themeCss: themeCss,
            classNames: [
              {
                key: 'titleWrapperControlClassName',
                weights: {
                  default: {
                    suf: '::before',
                    important: true
                  }
                }
              },
              {
                key: 'titleWrapperControlClassName',
                weights: {
                  default: {
                    suf: '::after',
                    important: true
                  }
                }
              },
              {
                key: 'titleControlClassName',
                weights: {
                  default: {
                    important: true
                  }
                }
              }
            ],
            id
          }}
          env={env}
        />
      </div>
    );
  }
}

@Renderer({
  type: 'divider'
})
export class DividerRenderer extends Divider {}
