import React from 'react';
import qs from 'qs';
import {RendererStore, IRendererStore, IIRendererStore} from './store/index';
import {getEnv, destroy} from 'mobx-state-tree';
import {wrapFetcher} from './utils/api';
import {normalizeLink} from './utils/normalizeLink';
import {findIndex, promisify} from './utils/helper';
import {Api, fetcherResult, Payload, SchemaNode, Schema, Action} from './types';
import {observer} from 'mobx-react';
import Scoped from './Scoped';
import {getTheme, ThemeInstance, ThemeProps} from './theme';
import find from 'lodash/find';
import Alert from './components/Alert2';
import {toast} from './components/Toast';
import {alert, confirm, setRenderSchemaFn} from './components/Alert';
import {getDefaultLocale, makeTranslator, LocaleProps} from './locale';
import ScopedRootRenderer, {RootRenderProps} from './Root';
import {HocStoreFactory} from './WithStore';

export interface TestFunc {
  (
    path: string,
    schema?: Schema,
    resolveRenderer?: (
      path: string,
      schema?: Schema,
      props?: any
    ) => null | RendererConfig
  ): boolean;
}

export interface RendererBasicConfig {
  test: RegExp | TestFunc;
  name?: string;
  storeType?: string;
  shouldSyncSuperStore?: (
    store: any,
    props: any,
    prevProps: any
  ) => boolean | undefined;
  storeExtendsData?: boolean; // 是否需要继承上层数据。
  weight?: number; // 权重，值越低越优先命中。
  isolateScope?: boolean;
  isFormItem?: boolean;
  // [propName:string]:any;
}

export interface RendererEnv {
  fetcher: (api: Api, data?: any, options?: object) => Promise<Payload>;
  isCancel: (val: any) => boolean;
  notify: (
    type: 'error' | 'success',
    msg: string,
    conf?: {
      closeButton?: boolean;
      timeout?: number;
    }
  ) => void;
  jumpTo: (to: string, action?: Action, ctx?: object) => void;
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
  rendererResolver?: (
    path: string,
    schema: Schema,
    props: any
  ) => null | RendererConfig;
  copy?: (contents: string) => void;
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
  [propName: string]: any;
}

export interface RendererProps extends ThemeProps, LocaleProps {
  render: (region: string, node: SchemaNode, props?: any) => JSX.Element;
  env: RendererEnv;
  $path: string; // 当前组件所在的层级信息
  store?: IIRendererStore;
  syncSuperStore?: boolean;
  data: {
    [propName: string]: any;
  };
  defaultData?: object;
  className?: any;
  [propName: string]: any;
}

export type RendererComponent = React.ComponentType<RendererProps> & {
  propsList?: Array<any>;
};

export interface RendererConfig extends RendererBasicConfig {
  component: RendererComponent;
  Renderer?: RendererComponent; // 原始组件
}

export interface RenderSchemaFilter {
  (schema: Schema, renderer: RendererConfig, props?: any): Schema;
}

export interface RenderOptions {
  session?: string;
  fetcher?: (config: fetcherConfig) => Promise<fetcherResult>;
  wsFetcher?: (
    ws: string,
    onMessage: (data: any) => void,
    onError: (error: any) => void
  ) => void;
  isCancel?: (value: any) => boolean;
  notify?: (
    type: 'error' | 'success',
    msg: string,
    conf?: {
      closeButton?: boolean;
      timeout?: number;
    }
  ) => void;
  jumpTo?: (to: string, action?: Action, ctx?: object) => void;
  alert?: (msg: string) => void;
  confirm?: (msg: string, title?: string) => boolean | Promise<boolean>;
  rendererResolver?: (
    path: string,
    schema: Schema,
    props: any
  ) => null | RendererConfig;
  copy?: (contents: string) => void;
  getModalContainer?: () => HTMLElement;
  loadRenderer?: (
    schema: Schema,
    path: string,
    reRender: Function
  ) => Promise<React.ReactType> | React.ReactType | JSX.Element | void;
  affixOffsetTop?: number;
  affixOffsetBottom?: number;
  richTextToken?: string;
  [propName: string]: any;
}

export interface fetcherConfig {
  url: string;
  method?: 'get' | 'post' | 'put' | 'patch' | 'delete';
  data?: any;
  config?: any;
}

const renderers: Array<RendererConfig> = [];
const rendererNames: Array<string> = [];
const schemaFilters: Array<RenderSchemaFilter> = [];
let anonymousIndex = 1;

export function addSchemaFilter(fn: RenderSchemaFilter) {
  schemaFilters.push(fn);
}

export function filterSchema(
  schema: Schema,
  render: RendererConfig,
  props?: any
) {
  return schemaFilters.reduce(
    (schema, filter) => filter(schema, render, props),
    schema
  ) as Schema;
}

export function Renderer(config: RendererBasicConfig) {
  return function <T extends RendererComponent>(component: T): T {
    const renderer = registerRenderer({
      ...config,
      component: component
    });
    return renderer.component as T;
  };
}

export function registerRenderer(config: RendererConfig): RendererConfig {
  if (!config.test) {
    throw new TypeError('config.test is required');
  } else if (!config.component) {
    throw new TypeError('config.component is required');
  }

  config.weight = config.weight || 0;
  config.Renderer = config.component;
  config.name = config.name || `anonymous-${anonymousIndex++}`;

  if (~rendererNames.indexOf(config.name)) {
    throw new Error(
      `The renderer with name "${config.name}" has already exists, please try another name!`
    );
  }

  if (config.storeType && config.component) {
    config.component = HocStoreFactory({
      storeType: config.storeType,
      extendsData: config.storeExtendsData,
      shouldSyncSuperStore: config.shouldSyncSuperStore
    })(observer(config.component));
  }

  if (config.isolateScope) {
    config.component = Scoped(config.component);
  }

  const idx = findIndex(
    renderers,
    item => (config.weight as number) < item.weight
  );
  ~idx ? renderers.splice(idx, 0, config) : renderers.push(config);
  rendererNames.push(config.name);
  return config;
}

export function unRegisterRenderer(config: RendererConfig | string) {
  let idx =
    typeof config === 'string'
      ? findIndex(renderers, item => item.name === config)
      : renderers.indexOf(config);
  ~idx && renderers.splice(idx, 1);

  let idx2 =
    typeof config === 'string'
      ? findIndex(rendererNames, item => item === config)
      : rendererNames.indexOf(config.name || '');
  ~idx2 && rendererNames.splice(idx2, 1);

  // 清空渲染器定位缓存
  cache = {};
}

export function loadRenderer(schema: Schema, path: string) {
  return (
    <Alert level="danger">
      <p>Error: 找不到对应的渲染器</p>
      <p>Path: {path}</p>
      <pre>
        <code>{JSON.stringify(schema, null, 2)}</code>
      </pre>
    </Alert>
  );
}

const defaultOptions: RenderOptions = {
  session: 'global',
  affixOffsetTop: 50,
  affixOffsetBottom: 0,
  richTextToken: '',
  loadRenderer,
  fetcher() {
    return Promise.reject('fetcher is required');
  },
  // 使用 WebSocket 来实时获取数据
  wsFetcher(ws, onMessage, onError) {
    if (ws) {
      const socket = new WebSocket(ws);
      socket.onmessage = (event: any) => {
        if (event.data) {
          onMessage(JSON.parse(event.data));
        }
      };
      socket.onerror = onError;
      return {
        close: socket.close
      };
    } else {
      return {
        close: () => {}
      };
    }
  },
  isCancel() {
    console.error(
      'Please implements this. see https://baidu.gitee.io/amis/docs/start/getting-started#%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97'
    );
    return false;
  },
  updateLocation() {
    console.error(
      'Please implements this. see https://baidu.gitee.io/amis/docs/start/getting-started#%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97'
    );
  },
  alert,
  confirm,
  notify: (type, msg, conf) =>
    toast[type]
      ? toast[type](msg, type === 'error' ? 'Error' : 'Info', conf)
      : console.warn('[Notify]', type, msg),

  jumpTo: (to: string, action?: any) => {
    if (to === 'goBack') {
      return window.history.back();
    }
    to = normalizeLink(to);
    if (action && action.actionType === 'url') {
      action.blank === false ? (window.location.href = to) : window.open(to);
      return;
    }
    if (/^https?:\/\//.test(to)) {
      window.location.replace(to);
    } else {
      location.href = to;
    }
  },
  isCurrentUrl: (to: string) => {
    if (!to) {
      return false;
    }

    const link = normalizeLink(to);
    const location = window.location;
    let pathname = link;
    let search = '';
    const idx = link.indexOf('?');
    if (~idx) {
      pathname = link.substring(0, idx);
      search = link.substring(idx);
    }
    if (search) {
      if (pathname !== location.pathname || !location.search) {
        return false;
      }
      const query = qs.parse(search.substring(1));
      const currentQuery = qs.parse(location.search.substring(1));
      return Object.keys(query).every(key => query[key] === currentQuery[key]);
    } else if (pathname === location.pathname) {
      return true;
    }
    return false;
  },
  copy(contents: string) {
    console.error('copy contents', contents);
  },
  rendererResolver: resolveRenderer
};
let stores: {
  [propName: string]: IRendererStore;
} = {};
export function render(
  schema: Schema,
  props: RootRenderProps = {},
  options: RenderOptions = {},
  pathPrefix: string = ''
): JSX.Element {
  let locale = props.locale || getDefaultLocale();
  // 兼容 locale 的不同写法
  locale = locale.replace('_', '-');
  locale = locale === 'en' ? 'en-US' : locale;
  locale = locale === 'zh' ? 'zh-CN' : locale;
  locale = locale === 'cn' ? 'zh-CN' : locale;
  const translate = props.translate || makeTranslator(locale);
  let store = stores[options.session || 'global'];

  if (!store) {
    options = {
      ...defaultOptions,
      ...options,
      fetcher: options.fetcher
        ? wrapFetcher(options.fetcher)
        : defaultOptions.fetcher,
      confirm: promisify(
        options.confirm || defaultOptions.confirm || window.confirm
      ),
      locale,
      translate
    } as any;

    store = RendererStore.create({}, options);
    stores[options.session || 'global'] = store;
  }

  (window as any).amisStore = store; // 为了方便 debug.
  const env = getEnv(store);

  const theme = props.theme || options.theme || 'default';
  env.theme = getTheme(theme);

  if (props.locale !== undefined) {
    env.translate = translate;
    env.locale = locale;
  }

  return (
    <ScopedRootRenderer
      {...props}
      schema={schema}
      pathPrefix={pathPrefix}
      rootStore={store}
      env={env}
      theme={theme}
      locale={locale}
      translate={translate}
    />
  );
}

// 默认 env 会被缓存，所以新传入的 env 不会替换旧的。
// 除非先删了旧的，新的才会生效。
export function clearStoresCache(
  sessions: Array<string> | string = Object.keys(stores)
) {
  if (!Array.isArray(sessions)) {
    sessions = [sessions];
  }

  sessions.forEach(key => {
    const store = stores[key];

    // @ts-ignore
    delete stores[key];

    store && destroy(store);
  });
}

// 当然也可以直接这样更新。
// 主要是有时候第一次创建的时候并没有准备多少接口，
// 可以后续补充点，比如 amis 自己实现的，prompt 里面的表单。
export function updateEnv(options: Partial<RenderOptions>, session = 'global') {
  options = {
    ...options
  };

  if (options.fetcher) {
    options.fetcher = wrapFetcher(options.fetcher) as any;
  }

  if (options.confirm) {
    options.confirm = promisify(options.confirm);
  }

  let store = stores[options.session || session];
  if (!store) {
    store = RendererStore.create({}, options);
    stores[options.session || session] = store;
  } else {
    const env = getEnv(store);
    Object.assign(env, options);
  }
}

let cache: {[propName: string]: RendererConfig} = {};
export function resolveRenderer(
  path: string,
  schema?: Schema
): null | RendererConfig {
  if (cache[path]) {
    return cache[path];
  } else if (path && path.length > 1024) {
    throw new Error('Path太长是不是死循环了？');
  }

  let renderer: null | RendererConfig = null;

  renderers.some(item => {
    let matched = false;

    // 不应该搞得这么复杂的，让每个渲染器唯一 id，自己不晕别人用起来也不晕。
    if (typeof item.test === 'function') {
      matched = item.test(path, schema, resolveRenderer);
    } else if (item.test instanceof RegExp) {
      matched = item.test.test(path);
    }

    if (matched) {
      renderer = item;
    }

    return matched;
  });

  // 只能缓存纯正则表达式的后者方法中没有用到第二个参数的，
  // 因为自定义 test 函数的有可能依赖 schema 的结果
  if (
    renderer !== null &&
    ((renderer as RendererConfig).test instanceof RegExp ||
      (typeof (renderer as RendererConfig).test === 'function' &&
        ((renderer as RendererConfig).test as Function).length < 2))
  ) {
    cache[path] = renderer;
  }

  return renderer;
}

export function getRenderers() {
  return renderers.concat();
}

export function getRendererByName(name: string) {
  return find(renderers, item => item.name === name);
}

setRenderSchemaFn((controls, value, callback, scopeRef, theme) => {
  return render(
    {
      name: 'form',
      type: 'form',
      wrapWithPanel: false,
      mode: 'horizontal',
      controls,
      messages: {
        validateFailed: ''
      }
    },
    {
      data: value,
      onFinished: callback,
      scopeRef,
      theme
    },
    {
      session: 'prompt'
    }
  );
});
