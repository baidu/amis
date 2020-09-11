import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {BaseSchema} from '../Schema';

/**
 * Divider 分割线渲染器。
 * 文档：https://baidu.gitee.io/amis/docs/components/divider
 */
export interface DividerSchema extends BaseSchema {
  type: 'divider';
  lineStyle?: 'dashed' | 'solid';
}

export interface DividerProps extends RendererProps, DividerSchema {}

export default class Divider extends React.Component<DividerProps, object> {
  static defaultProps: Pick<DividerProps, 'className' | 'lineStyle'> = {
    className: '',
    lineStyle: 'dashed'
  };

  render() {
    const {classnames: cx, className, lineStyle} = this.props;
    return (
      <div
        className={cx(
          'Divider',
          lineStyle ? `Divider--${lineStyle}` : '',
          className
        )}
      />
    );
  }
}

@Renderer({
  test: /(^|\/)(?:divider|hr)$/,
  name: 'divider'
})
export class DividerRenderer extends Divider {}
