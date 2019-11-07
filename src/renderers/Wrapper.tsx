import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {SchemaNode} from '../types';
import cx from 'classnames';

export interface WrapperProps extends RendererProps {
  body?: SchemaNode;
  className?: string;
  children?: JSX.Element | ((props?: any) => JSX.Element);
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'none';
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
