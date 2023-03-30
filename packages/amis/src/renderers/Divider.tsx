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
  [propName: string]: any;
}

export interface DividerProps
  extends RendererProps,
    Omit<DividerSchema, 'type' | 'className'> {}

export default class Divider extends React.Component<DividerProps, object> {
  static defaultProps: Pick<DividerProps, 'className' | 'lineStyle'> = {
    className: '',
    lineStyle: 'dashed'
  };

  render() {
    const {classnames: cx, className, style, lineStyle} = this.props;
    return (
      <div
        className={cx(
          'Divider',
          lineStyle ? `Divider--${lineStyle}` : '',
          className
        )}
        style={style}
      />
    );
  }
}

@Renderer({
  type: 'divider'
})
export class DividerRenderer extends Divider {}
