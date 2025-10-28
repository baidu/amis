import React from 'react';
import {Renderer, RendererProps, AMISSchemaCollection} from 'amis-core';
import {buildStyle} from 'amis-core';
import {AMISSchemaBase} from 'amis-core';

/**
 * Wrapper 容器渲染器。
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/wrapper
 */
/**
 * 包装器组件，为子组件提供统一样式与容器结构。
 */
export interface AMISWrapperSchema extends AMISSchemaBase {
  /**
   * 指定为 container 类型
   */
  type: 'wrapper';

  /**
   * 内容
   */
  body: AMISSchemaCollection;

  size?: 'xs' | 'sm' | 'md' | 'lg' | 'none';

  /**
   * 是否包裹内容 默认 true
   */
  wrap?: boolean;
}

export interface WrapperProps
  extends RendererProps,
    Omit<AMISWrapperSchema, 'className'> {
  children?: JSX.Element | ((props?: any) => JSX.Element);
}

export default class Wrapper extends React.Component<WrapperProps, object> {
  static propsList: Array<string> = ['body', 'className', 'children', 'size'];
  static defaultProps: Partial<WrapperProps> = {
    className: '',
    size: 'md'
  };

  renderBody(): JSX.Element | null {
    const {children, body, render, disabled} = this.props;

    return children
      ? typeof children === 'function'
        ? (children(this.props) as JSX.Element)
        : (children as JSX.Element)
      : body
      ? (render('body', body, {disabled}) as JSX.Element)
      : null;
  }

  render() {
    const {className, size, classnames: cx, style, data, wrap, id} = this.props;

    // 期望不要使用，给 form controls 用法自动转换时使用的。
    if (wrap === false) {
      return this.renderBody();
    }

    return (
      <div
        className={cx(
          'Wrapper',
          size && size !== 'none' ? `Wrapper--${size}` : '',
          className
        )}
        style={buildStyle(style, data)}
        data-id={id}
      >
        {this.renderBody()}
      </div>
    );
  }
}

@Renderer({
  type: 'wrapper'
})
export class WrapperRenderer extends Wrapper {}
