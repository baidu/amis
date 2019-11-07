import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {filter} from '../utils/tpl';
import {autobind} from '../utils/helper';
import {ScopedContext, IScopedContext} from '../Scoped';

export interface IFrameProps extends RendererProps {
  className?: string;
  src?: string;
}

export default class IFrame extends React.Component<IFrameProps, object> {
  IFrameRef: React.RefObject<HTMLIFrameElement> = React.createRef();
  static propsList: Array<string> = ['src', 'className'];
  static defaultProps: Partial<IFrameProps> = {
    className: '',
    width: '100%',
    height: '100%',
    frameBorder: 0
  };

  @autobind
  reload() {
    (this.IFrameRef.current as HTMLIFrameElement).src = (this.IFrameRef
      .current as HTMLIFrameElement).src;
  }

  render() {
    let {className, src, width, height, frameBorder, data, style} = this.props;

    style = {
      ...style
    };

    width !== void 0 && (style.width = width);
    height !== void 0 && (style.height = height);

    return (
      <iframe
        className={className}
        frameBorder={frameBorder}
        style={style}
        ref={this.IFrameRef}
        src={src ? filter(src, data) : undefined}
      />
    );
  }
}

@Renderer({
  test: /(^|\/)iframe$/,
  name: 'iframe'
})
export class IFrameRenderer extends IFrame {
  static contextType = ScopedContext;

  componentWillMount() {
    const scoped = this.context as IScopedContext;
    scoped.registerComponent(this);
  }

  componentWillUnmount() {
    const scoped = this.context as IScopedContext;
    scoped.unRegisterComponent(this);
  }
}
