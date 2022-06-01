/**
 * @file 组件 Env，包括如何发送 ajax，如何通知，如何跳转等等。。
 */
import React from 'react';
import {RendererConfig} from './factory';
import {ThemeInstance} from './theme';
import {
  ActionObject,
  Api,
  EventTrack,
  Payload,
  PlainObject,
  Schema,
  ToastConf,
  ToastLevel
} from './types';
import hoistNonReactStatic from 'hoist-non-react-statics';
import {IScopedContext} from './Scoped';
import {RendererEvent} from './utils/renderer-event';

export interface wsObject {
  url: string;
  responseKey?: string;
  body?: any;
}

export interface RendererEnv {
  fetcher: (api: Api, data?: any, options?: object) => Promise<Payload>;
  isCancel: (val: any) => boolean;
  wsFetcher: (
    ws: wsObject,
    onMessage: (data: any) => void,
    onError: (error: any) => void
  ) => void;
  notify: (type: ToastLevel, msg: any, conf?: ToastConf) => void;
  jumpTo: (to: string, action?: ActionObject, ctx?: object) => void;
  alert: (msg: string) => void;
  confirm: (msg: string, title?: string) => Promise<boolean>;
  updateLocation: (location: any, replace?: boolean) => void;

  /**
   * 阻止路由跳转，有时候 form 没有保存，但是路由跳转了，导致页面没有更新，
   * 所以先让用户确认一下。
   *
   * 单页模式需要这个，如果非单页模式，不需要处理这个。
   */
  blockRouting?: (fn: (targetLocation: any) => void | string) => () => void;
  isCurrentUrl: (link: string, ctx?: any) => boolean | {params?: object};

  /**
   * 监控路由变化，如果 jssdk 需要做单页跳转需要实现这个。
   */
  watchRouteChange?: (fn: () => void) => () => void;
  // 用于跟踪用户在界面中的各种操作
  tracker: (eventTrack: EventTrack, props?: PlainObject) => void;
  rendererResolver?: (
    path: string,
    schema: Schema,
    props: any
  ) => null | RendererConfig;
  copy?: (contents: string, format?: any) => void;
  getModalContainer?: () => HTMLElement;
  theme: ThemeInstance;
  affixOffsetTop: number;
  affixOffsetBottom: number;
  richTextToken: string;
  loadRenderer: (
    schema: Schema,
    path: string,
    reRender: Function
  ) => Promise<React.ReactType> | React.ReactType | JSX.Element | void;
  loadChartExtends?: () => void | Promise<void>;
  useMobileUI?: boolean;
  /**
   * 过滤 html 标签，可用来添加 xss 保护逻辑
   */
  filterHtml: (input: string) => string;
  beforeDispatchEvent: (
    e:
      | string
      | React.ClipboardEvent<any>
      | React.DragEvent<any>
      | React.ChangeEvent<any>
      | React.KeyboardEvent<any>
      | React.TouchEvent<any>
      | React.WheelEvent<any>
      | React.AnimationEvent<any>
      | React.TransitionEvent<any>
      | React.MouseEvent<any>,
    context: any,
    scoped: IScopedContext,
    data: any,
    broadcast?: RendererEvent<any>
  ) => void;

  /**
   * 是否开启 amis 调试
   */
  enableAMISDebug?: boolean;

  /**
   * 替换文本，用于实现 URL 替换、语言替换等
   */
  replaceText?: {[propName: string]: any};
  /**
   * 文本替换的黑名单，因为属性太多了所以改成黑名单的 fangs
   */
  replaceTextIgnoreKeys?: String[];
}

export const EnvContext = React.createContext<RendererEnv | void>(undefined);

export interface EnvProps {
  env: RendererEnv;
}

export function withRendererEnv<
  T extends React.ComponentType<React.ComponentProps<T> & EnvProps>
>(ComposedComponent: T) {
  type OuterProps = JSX.LibraryManagedAttributes<
    T,
    Omit<React.ComponentProps<T>, keyof EnvProps>
  > & {
    env?: RendererEnv;
  };

  const result = hoistNonReactStatic(
    class extends React.Component<OuterProps> {
      static displayName = `WithEnv(${
        ComposedComponent.displayName || ComposedComponent.name
      })`;
      static contextType = EnvContext;
      static ComposedComponent = ComposedComponent as React.ComponentType<T>;

      render() {
        const injectedProps: {
          env: RendererEnv;
        } = {
          env: this.props.env || this.context
        };

        if (!injectedProps.env) {
          throw new Error('Env 信息获取失败，组件用法不正确');
        }

        return (
          <ComposedComponent
            {...(this.props as JSX.LibraryManagedAttributes<
              T,
              React.ComponentProps<T>
            > as any)}
            {...injectedProps}
          />
        );
      }
    },
    ComposedComponent
  );

  return result as typeof result & {
    ComposedComponent: T;
  };
}
