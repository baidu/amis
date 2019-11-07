import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {SchemaNode} from '../types';

export interface ContainerProps extends RendererProps {
  body?: SchemaNode;
  children?: (props: any) => React.ReactNode;
  className?: string;
}

export default class Container<T> extends React.Component<
  ContainerProps & T,
  object
> {
  static propsList: Array<string> = ['body', 'className'];
  static defaultProps = {
    className: ''
  };

  renderBody(): JSX.Element | null {
    const {children, body, render, classnames: cx, bodyClassName} = this.props;

    return (
      <div className={cx('Container-body', bodyClassName)}>
        {children
          ? typeof children === 'function'
            ? (children(this.props) as JSX.Element)
            : (children as JSX.Element)
          : body
          ? (render('body', body) as JSX.Element)
          : null}
      </div>
    );
  }

  render() {
    const {className, size, classnames: cx} = this.props;

    return (
      <div className={cx('Container', className)}>{this.renderBody()}</div>
    );
  }
}

@Renderer({
  test: /(^|\/)container$/,
  name: 'container'
})
export class ContainerRenderer extends Container<{}> {}
