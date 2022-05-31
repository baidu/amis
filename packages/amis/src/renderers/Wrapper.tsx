import React from 'react';
import {Renderer, RendererProps} from 'amis-core';
import {BaseSchema, SchemaCollection} from '../Schema';
import {resolveVariable} from 'amis-core';
import {SchemaNode} from 'amis-core';
import mapValues from 'lodash/mapValues';
import {buildStyle} from 'amis-core';

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

  wrap?: boolean;

  /**
   * 自定义样式
   */
  style?: {
    [propName: string]: any;
  };
}

export interface WrapperProps
  extends RendererProps,
    Omit<WrapperSchema, 'className'> {
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
    const {className, size, classnames: cx, style, data, wrap} = this.props;

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
