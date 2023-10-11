import React from 'react';
import {
  Renderer,
  RendererProps,
  CustomStyle,
  setThemeClassName
} from 'amis-core';
import {BaseSchema, SchemaCollection} from '../Schema';

/**
 * Divider 分割线渲染器。
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/divider
 */
export interface DividerSchema extends BaseSchema {
  type: 'divider';
  lineStyle?: 'dashed' | 'solid';
  direction?: 'horizontal' | 'vertical';
  color?: string;
  rotate?: number;
  title?: SchemaCollection;
  titleClassName?: string;
  orientation?: 'left' | 'center' | 'right';
  [propName: string]: any;
}

export interface DividerProps
  extends RendererProps,
    Omit<DividerSchema, 'type' | 'className'> {}

export default class Divider extends React.Component<DividerProps, object> {
  static defaultProps: Pick<
    DividerProps,
    'className' | 'lineStyle' | 'titleClassName' | 'orientation'
  > = {
    className: '',
    lineStyle: 'solid',
    titleClassName: '',
    orientation: 'center'
  };

  render() {
    const {
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
      orientation,
      id,
      themeCss,
      env
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

    const classNames = cx(
      'Divider',
      lineStyle ? `Divider--${lineStyle}` : '',
      direction === 'vertical' ? 'Divider--vertical' : 'Divider--horizontal',
      title && direction !== 'vertical' ? 'Divider--with-text' : '',
      title && direction !== 'vertical' && orientation
        ? `Divider--with-text-${orientation}`
        : '',
      title && direction !== 'vertical'
        ? setThemeClassName('titleWrapperControlClassName', id, themeCss)
        : '',
      className
    );

    return (
      <div className={classNames} style={{...style, ...borderColor, transform}}>
        {title && direction !== 'vertical' ? (
          <span
            className={cx(
              `Divider-text Divider-text-${orientation} ${titleClassName}`,
              setThemeClassName('titleControlClassName', id, themeCss)
            )}
          >
            {render('title', title)}
          </span>
        ) : null}
        <CustomStyle
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
