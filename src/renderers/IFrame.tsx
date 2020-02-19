import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {filter} from '../utils/tpl';
import {autobind, createObject} from '../utils/helper';
import {ScopedContext, IScopedContext} from '../Scoped';
import {buildApi} from '../utils/api';

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

  // 当别的组件通知 iframe reload 的时候执行。
  @autobind
  reload(subpath?: any, query?: any) {
    if (query) {
      return this.receive(query);
    }

    const {src, data} = this.props;

    if (src) {
      (this.IFrameRef.current as HTMLIFrameElement).src = buildApi(
        src,
        data
      ).url;
    }
  }

  // 当别的组件把数据发给 iframe 里面的时候执行。
  @autobind
  receive(values: object) {
    const {src, data} = this.props;

    if (src) {
      (this.IFrameRef.current as HTMLIFrameElement).src = buildApi(
        src,
        createObject(data, values)
      ).url;
    }
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
        src={src ? buildApi(src, data).url : undefined}
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
