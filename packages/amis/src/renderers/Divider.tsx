import React from 'react';
import {Renderer, RendererProps} from 'amis-core';
import {BaseSchema} from '../Schema';

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
  [propName: string]: any;
}

export interface DividerProps
  extends RendererProps,
    Omit<DividerSchema, 'type' | 'className'> {}

export default class Divider extends React.Component<DividerProps, object> {
  static defaultProps: Pick<DividerProps, 'className' | 'lineStyle'> = {
    className: '',
    lineStyle: 'solid'
  };

  render() {
    const {
      classnames: cx,
      className,
      style = {},
      lineStyle,
      direction,
      color,
      rotate
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

    let transform;
    if (rotate) {
      transform = `${style?.transform || ''} rotate(${rotate}deg)`;
    }
    return (
      <div
        className={cx(
          'Divider',
          lineStyle ? `Divider--${lineStyle}` : '',
          direction === 'vertical'
            ? 'Divider--vertical'
            : 'Divider--horizontal',
          className
        )}
        style={{...style, ...borderColor, transform}}
      />
    );
  }
}

@Renderer({
  type: 'divider'
})
export class DividerRenderer extends Divider {}
