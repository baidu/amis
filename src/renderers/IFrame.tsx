import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {filter} from '../utils/tpl';
import {autobind, createObject} from '../utils/helper';
import {ScopedContext, IScopedContext} from '../Scoped';
import {buildApi, isApiOutdated} from '../utils/api';
import {BaseSchema, SchemaUrlPath} from '../Schema';
import {ActionSchema} from './Action';
import {dataMapping, resolveVariableAndFilter} from '../utils/tpl-builtin';

/**
 * IFrame 渲染器
 * 文档：https://baidu.gitee.io/amis/docs/components/iframe
 */
export interface IFrameSchema extends BaseSchema {
  type: 'iframe';

  /**
   * 页面地址
   */
  src: SchemaUrlPath;

  /**
   * 事件相应，配置后当 iframe 通过 postMessage 发送事件时，可以触发 AMIS 内部的动作。
   */
  events?: {
    [eventName: string]: ActionSchema;
  };

  width?: number | string;
  height?: number | string;

  alloow?: string;

  name?: string;

  referrerpolicy?:
    | 'no-referrer'
    | 'no-referrer-when-downgrade'
    | 'origin'
    | 'origin-when-cross-origin'
    | 'same-origin'
    | 'strict-origin'
    | 'strict-origin-when-cross-origin'
    | 'unsafe-url';

  sandbox?: string;
}

export interface IFrameProps
  extends RendererProps,
    Omit<IFrameSchema, 'type' | 'className'> {}

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
    } else if (
      this.props.width !== prevProps.width ||
      this.props.height !== prevProps.height
    ) {
      this.setState({
        width: this.props.width || '100%',
        height: this.props.height || '100%'
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.onMessage);
  }

  @autobind
  onMessage(e: MessageEvent) {
    const {events, onAction, data} = this.props;

    if (typeof e?.data?.type !== 'string' || !events) {
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
      (this.IFrameRef.current as HTMLIFrameElement).src =
        resolveVariableAndFilter(src, data, '| raw');
    }
  }

  // 当别的组件把数据发给 iframe 里面的时候执行。
  @autobind
  receive(values: object) {
    const {src, data} = this.props;
    const newData = createObject(data, values);

    this.postMessage('receive', newData);

    if (isApiOutdated(src, src, data, newData)) {
      (this.IFrameRef.current as HTMLIFrameElement).src =
        resolveVariableAndFilter(src, newData, '| raw');
    }
  }

  @autobind
  postMessage(type: string, data: any) {
    (this.IFrameRef.current as HTMLIFrameElement)?.contentWindow?.postMessage(
      {
        type: `amis:${type}`,
        data: JSON.parse(JSON.stringify(data))
      },
      '*'
    );
  }

  render() {
    const {width, height} = this.state;
    let {
      className,
      src,
      name,
      frameBorder,
      data,
      style,
      allow,
      sandbox,
      referrerpolicy
    } = this.props;

    let tempStyle: any = {};

    width !== void 0 && (tempStyle.width = width);
    height !== void 0 && (tempStyle.height = height);

    style = {
      ...tempStyle,
      ...style
    };

    const finalSrc = src
      ? resolveVariableAndFilter(src, data, '| raw')
      : undefined;

    if (
      typeof finalSrc === 'string' &&
      finalSrc &&
      !/^(\.\/|\.\.\/|\/|https?\:\/\/|\/\/)/.test(finalSrc)
    ) {
      return <p>请填写合法的 iframe 地址</p>;
    }

    return (
      <iframe
        name={name}
        className={className}
        frameBorder={frameBorder}
        style={style}
        ref={this.IFrameRef}
        onLoad={this.onLoad}
        src={finalSrc}
        allow={allow}
        referrerPolicy={referrerpolicy}
        sandbox={sandbox}
      />
    );
  }
}

@Renderer({
  type: 'iframe'
})
export class IFrameRenderer extends IFrame {
  static contextType = ScopedContext;

  constructor(props: IFrameProps, context: IScopedContext) {
    super(props);

    const scoped = context;
    scoped.registerComponent(this);
  }

  componentWillUnmount() {
    const scoped = this.context as IScopedContext;
    scoped.unRegisterComponent(this);
  }
}
