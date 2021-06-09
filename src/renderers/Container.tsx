import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {BaseSchema, SchemaClassName, SchemaCollection} from '../Schema';
import {SchemaNode} from '../types';

/**
 * Container 容器渲染器。
 * 文档：https://baidu.gitee.io/amis/docs/components/container
 */
export interface ContainerSchema extends BaseSchema {
  /**
   * 指定为 container 类型
   */
  type: 'container';

  /**
   * 内容
   */
  body: SchemaCollection;

  /**
   * body 类名
   */
  bodyClassName?: SchemaClassName;

  /**
   * 自定义样式
   */
  style?: {
    [propName: string]: any;
  };

  /**
   * 使用的标签
   */
  wrapperComponent?: string;
}

export interface ContainerProps
  extends RendererProps,
    Omit<ContainerSchema, 'type' | 'className'> {
  children?: (props: any) => React.ReactNode;
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
            ? ((children as any)(this.props) as JSX.Element)
            : (children as JSX.Element)
          : body
          ? (render('body', body as any) as JSX.Element)
          : null}
      </div>
    );
  }

  render() {
    const {
      className,
      wrapperComponent,
      size,
      classnames: cx,
      style
    } = this.props;

    const Component =
      (wrapperComponent as keyof JSX.IntrinsicElements) || 'div';

    return (
      <Component className={cx('Container', className)} style={style}>
        {this.renderBody()}
      </Component>
    );
  }
}

@Renderer({
  type: 'container'
})
export class ContainerRenderer extends Container<{}> {}
