import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {BaseSchema, SchemaCollection} from '../Schema';
import {SchemaNode} from '../types';

/**
 * Wrapper 容器渲染器。
 * 文档：https://baidu.gitee.io/amis/docs/components/wrapper
 */
export interface WrapperSchema extends BaseSchema {
  /**
   * 指定为 container 类型
   */
  type: 'wrapper';

  /**
   * 内容
   */
  body: SchemaCollection;

  size?: 'xs' | 'sm' | 'md' | 'lg' | 'none';
}

export interface WrapperProps extends RendererProps, WrapperSchema {
  children?: JSX.Element | ((props?: any) => JSX.Element);
}

export default class Wrapper extends React.Component<WrapperProps, object> {
  static propsList: Array<string> = ['body', 'className', 'children', 'size'];
  static defaultProps: Partial<WrapperProps> = {
    className: 'bg-white'
  };

  renderBody(): JSX.Element | null {
    const {children, body, render} = this.props;

    return children
      ? typeof children === 'function'
        ? (children(this.props) as JSX.Element)
        : (children as JSX.Element)
      : body
      ? (render('body', body) as JSX.Element)
      : null;
  }

  render() {
    const {className, size, classnames: cx} = this.props;

    return (
      <div className={cx('Wrapper', size ? `Wrapper--${size}` : '', className)}>
        {this.renderBody()}
      </div>
    );
  }
}

@Renderer({
  test: /(^|\/)wrapper$/,
  name: 'wrapper'
})
export class WrapperRenderer extends Wrapper {}
