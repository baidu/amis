import React from 'react';
import {RendererStore, IRendererStore, IIRendererStore} from './store/index';
import {getEnv, destroy} from 'mobx-state-tree';
import {wrapFetcher} from './utils/api';
import {normalizeLink} from './utils/normalizeLink';
import {findIndex, promisify, qsparse, string2regExp} from './utils/helper';
import {
  fetcherResult,
  SchemaNode,
  Schema,
  EventTrack,
  PlainObject
} from './types';
import {observer} from 'mobx-react';
import Scoped from './Scoped';
import {ThemeProps} from './theme';
import find from 'lodash/find';
import {LocaleProps} from './locale';
import {HocStoreFactory} from './WithStore';
import {RendererEnv} from './env';
import {OnEventProps} from './utils/renderer-event';
import {Placeholder} from './renderers/Placeholder';

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
  test?: RegExp | TestFunc;
  type?: string;
  name?: string;
  storeType?: string;
  shouldSyncSuperStore?: (
    store: any,
    props: any,
    prevProps: any
  ) => boolean | undefined;
  storeExtendsData?: boolean | ((props: any) => boolean); // 是否需要继承上层数据。
  weight?: number; // 权重，值越低越优先命中。
  isolateScope?: boolean;
  isFormItem?: boolean;
  autoVar?: boolean; // 自动解析变量
  // [propName:string]:any;
}

export interface RendererProps extends ThemeProps, LocaleProps, OnEventProps {
  render: (
    region: string,
    node: SchemaNode,
    props?: PlainObject
  ) => JSX.Element;
  env: RendererEnv;
  $path: string; // 当前组件所在的层级信息
  $schema: any; // 原始 schema 配置
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

export interface wsObject {
  url: string;
  responseKey?: string;
  body?: any;
}

export interface RenderOptions
  extends Partial<Omit<RendererEnv, 'fetcher' | 'theme'>> {
  session?: string;
  theme?: string;
  fetcher?: (config: fetcherConfig) => Promise<fetcherResult>;
}

export interface fetcherConfig {
  url: string;
  method?: 'get' | 'post' | 'put' | 'patch' | 'delete' | 'jsonp';
  data?: any;
  config?: any;
}

const renderers: Array<RendererConfig> = [];
const renderersMap: {
  [propName: string]: boolean;
} = {};
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
  if (!config.test && !config.type) {
    throw new TypeError('please set config.test or config.type');
  } else if (!config.component) {
    throw new TypeError('config.component is required');
  }

  if (typeof config.type === 'string' && config.type) {
    config.type = config.type.toLowerCase();
    config.test =
      config.test || new RegExp(`(^|\/)${string2regExp(config.type)}$`, 'i');
  }

  config.weight = config.weight || 0;
  config.Renderer = config.component;
  config.name = config.name || config.type || `anonymous-${anonymousIndex++}`;

  if (renderersMap[config.name]) {
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
  renderersMap[config.name] = config.Renderer !== Placeholder;
  return config;
}

export function unRegisterRenderer(config: RendererConfig | string) {
  const name = (typeof config === 'string' ? config : config.name)!;
  delete renderersMap[name];

  // 清空渲染器定位缓存
  cache = {};
}

export function loadRenderer(schema: Schema, path: string) {
  return (
    <div className="RuntimeError">
      <p>Error: 找不到对应的渲染器</p>
      <p>Path: {path}</p>
      <pre>
        <code>{JSON.stringify(schema, null, 2)}</code>
      </pre>
    </div>
  );
}

export const defaultOptions: RenderOptions = {
  session: 'global',
  affixOffsetTop: 0,
  affixOffsetBottom: 0,
  richTextToken: '',
  useMobileUI: true, // 是否启用移动端原生 UI
  enableAMISDebug:
    (window as any).enableAMISDebug ??
    location.search.indexOf('amisDebug=1') !== -1 ??
    false,
  loadRenderer,
  fetcher() {
    return Promise.reject('fetcher is required');
  },
  // 使用 WebSocket 来实时获取数据
  wsFetcher(
    ws: wsObject,
    onMessage: (data: any) => void,
    onError: (error: any) => void
  ) {
    if (ws) {
      const socket = new WebSocket(ws.url);
      socket.onopen = event => {
        if (ws.body) {
          socket.send(JSON.stringify(ws.body));
        }
      };
      socket.onmessage = event => {
        if (event.data) {
          let data;
          try {
            data = JSON.parse(event.data);
          } catch (error) {}
          if (typeof data !== 'object') {
            let key = ws.responseKey || 'data';
            data = {
              [key]: event.data
            };
          }

          onMessage(data);
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
      'Please implement isCancel. see https://baidu.gitee.io/amis/docs/start/getting-started#%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97'
    );
    return false;
  },
  updateLocation() {
    console.error(
      'Please implement updateLocation. see https://baidu.gitee.io/amis/docs/start/getting-started#%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97'
    );
  },

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
      const query = qsparse(search.substring(1));
      const currentQuery = qsparse(location.search.substring(1));
      return Object.keys(query).every(key => query[key] === currentQuery[key]);
    } else if (pathname === location.pathname) {
      return true;
    }
    return false;
  },
  copy(contents: string) {
    console.error('copy contents', contents);
  },
  // 用于跟踪用户在界面中的各种操作
  tracker(eventTrack: EventTrack, props: PlainObject) {},
  rendererResolver: resolveRenderer,
  replaceTextIgnoreKeys: [
    'type',
    'name',
    'mode',
    'target',
    'reload',
    'persistData'
  ],
  /**
   * 过滤 html 标签，可用来添加 xss 保护逻辑
   */
  filterHtml: (input: string) => input
};
export const stores: {
  [propName: string]: IRendererStore;
} = {};

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
    options.fetcher = wrapFetcher(options.fetcher, options.tracker) as any;
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
  const type = typeof schema?.type == 'string' ? schema.type.toLowerCase() : '';

  if (type && cache[type]) {
    return cache[type];
  } else if (cache[path]) {
    return cache[path];
  } else if (path && path.length > 1024) {
    throw new Error('Path太长是不是死循环了？');
  }

  let renderer: null | RendererConfig = null;

  renderers.some(item => {
    let matched = false;

    // 直接匹配类型，后续注册渲染都应该用这个方式而不是之前的判断路径。
    if (item.type && type) {
      matched = item.type === type;

      // 如果是type来命中的，那么cache的key直接用 type 即可。
      if (matched) {
        cache[type] = item;
      }
    } else if (typeof item.test === 'function') {
      // 不应该搞得这么复杂的，让每个渲染器唯一 id，自己不晕别人用起来也不晕。
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
    ((renderer as RendererConfig).type ||
      (renderer as RendererConfig).test instanceof RegExp ||
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

export {RendererEnv};
