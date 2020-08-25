import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {filter} from '../utils/tpl';
import {autobind, createObject} from '../utils/helper';
import {ScopedContext, IScopedContext} from '../Scoped';
import {buildApi} from '../utils/api';

export interface IFrameProps extends RendererProps {
  className?: string;
  src?: string;
  events?: {
    [eventName: string]: Object;
  };
}

export default class IFrame extends React.Component<IFrameProps, object> {
  IFrameRef: React.RefObject<HTMLIFrameElement> = React.createRef();
  static propsList: Array<string> = ['src', 'className'];
  static defaultProps: Partial<IFrameProps> = {
    className: '',
    frameBorder: 0
  };

  state = {
    width: this.props.width || '100%',
    height: this.props.height || '100%'
  };

  componentDidMount() {
    window.addEventListener('message', this.onMessage);
  }

  componentDidUpdate(prevProps: IFrameProps) {
    const data = this.props.data;

    if (data !== prevProps.data) {
      this.postMessage('update', data);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.onMessage);
  }

  @autobind
  onMessage(e: MessageEvent) {
    const {events, onAction, data} = this.props;

    if (!e.data || e.data === '' || !events) {
      return;
    }

    const [prefix, type] = e.data.type.split(':');

    if (prefix !== 'amis' || !type) {
      return;
    }

    if (type === 'resize' && e.data.data) {
      this.setState({
        width: e.data.data.width || '100%',
        height: e.data.data.height || '100%'
      });
    } else {
      const action = events[type];
      action && onAction(e, action, createObject(data, e.data.data));
    }
  }

  @autobind
  onLoad() {
    const {src, data} = this.props;
    src && this.postMessage('init', data);
  }

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

      this.postMessage('receive', createObject(data, values));
    }
  }

  @autobind
  postMessage(type: string, data: any) {
    (this.IFrameRef.current as HTMLIFrameElement).contentWindow?.postMessage(
      {
        type: `amis:${type}`,
        data
      },
      '*'
    );
  }

  render() {
    const {width, height} = this.state;
    let {className, src, frameBorder, data, style} = this.props;

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
        onLoad={this.onLoad}
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
