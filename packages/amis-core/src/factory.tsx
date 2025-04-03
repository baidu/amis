import React from 'react';
import {RendererStore, IRendererStore, IIRendererStore} from './store/index';
import {getEnv, destroy} from 'mobx-state-tree';
import {wrapFetcher} from './utils/api';
import {normalizeLink} from './utils/normalizeLink';
import {
  findIndex,
  promisify,
  qsparse,
  string2regExp,
  parseQuery,
  isMobile,
  TestIdBuilder
} from './utils/helper';
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
import type {RendererEnv} from './env';
import {OnEventProps, RendererEvent} from './utils/renderer-event';
import {Placeholder} from './renderers/Placeholder';
import {StatusScopedProps} from './StatusScoped';
import type {IScopedContext} from './Scoped';
import {getPageId} from './utils/getPageId';
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
  alias?: Array<string>; // 别名, 可以绑定多个类型，命中其中一个即可。
  name?: string;
  origin?: RendererBasicConfig;
  storeType?: string;
  defaultProps?: (type: string, schema: any) => any;
  shouldSyncSuperStore?: (
    store: any,
    props: any,
    prevProps: any
  ) => boolean | undefined;
  storeExtendsData?: boolean | ((props: any) => boolean); // 是否需要继承上层数据。
  // 当全局渲染器关联的全局变量发生变化时执行
  // 因为全局变量永远都是最新的，有些组件是 didUpdate 的时候比对有变化才更新
  // 这里给组件一个自定义更新的机会
  onGlobalVarChanged?: (
    instance: React.Component,
    schema: any,
    data: any
  ) => void | boolean;
  weight?: number; // 权重，值越低越优先命中。
  isolateScope?: boolean;
  isFormItem?: boolean;
  autoVar?: boolean; // 自动解析变量
  // 如果要替换系统渲染器，则需要设置这个为 true
  override?: boolean;
  // [propName:string]:any;
}

export interface RendererProps
  extends ThemeProps,
    LocaleProps,
    OnEventProps,
    StatusScopedProps {
  render: (
    region: string,
    node: SchemaNode,
    props?: PlainObject
  ) => JSX.Element;
  env: RendererEnv;
  $path: string; // 当前组件所在的层级信息
  $schema: any; // 原始 schema 配置
  testIdBuilder?: TestIdBuilder;
  store?: IIRendererStore;
  syncSuperStore?: boolean;
  data: {
    [propName: string]: any;
  };
  defaultData?: object;
  className?: any;
  style?: {
    [propName: string]: any;
  };
  onBroadcast?: (type: string, rawEvent: RendererEvent<any>, ctx: any) => any;
  dispatchEvent: (
    e: string | React.MouseEvent<any>,
    data: any,
    renderer?: React.Component<RendererProps>,
    scoped?: IScopedContext
  ) => Promise<RendererEvent<any>>;
  mobileUI?: boolean;
  [propName: string]: any;
}

export type RendererComponent = React.ComponentType<RendererProps> & {
  propsList?: Array<any>;
};

export interface RendererConfig extends RendererBasicConfig {
  // 渲染器组件，与 Renderer 的区别是，这个可能是包裹了 store 的。
  component?: RendererComponent;
  // 异步渲染器
  getComponent?: () => Promise<{default: RendererComponent} | any>;

  // 原始组件
  Renderer?: RendererComponent;
}

export interface RenderSchemaFilter {
  (schema: Schema, renderer: RendererConfig, props?: any): Schema;
}

export interface WsObject {
  url: string;
  responseKey?: string;
  body?: any;
}

export interface FetcherConfig {
  url: string;
  method?: 'get' | 'post' | 'put' | 'patch' | 'delete' | 'jsonp' | 'js';
  data?: any;
  config?: any;
}

export interface RenderOptions
  extends Partial<Omit<RendererEnv, 'fetcher' | 'theme'>> {
  session?: string;
  theme?: string;
  fetcher?: (config: FetcherConfig) => Promise<fetcherResult>;
}

const renderers: Array<RendererConfig> = [];
// type 与 RendererConfig 的映射关系
const renderersTypeMap: {
  [propName: string]: RendererConfig;
} = {};
export const renderersMap: {
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

// mobx-react 的 observer 会修改原型链的 render 方法
// 如果想继承覆盖组件的 render 方法，需要把原型链 render 还原回来
// 否则无法调用 super.render 方法
function fixMobxInjectRender<T extends Function>(klass: T): T {
  const target = klass.prototype;

  // mobx-react 篡改之前先记录原始 render
  if (target?.render) {
    target.__originRender = target.render;
  }

  // 将父级类上面被 mobx 篡改的 render 方法还原回来
  // 而且当前类的 render 也是会被篡改的，所以父级上的其实不需要篡改
  if (target?.__proto__?.hasOwnProperty('__originRender')) {
    const originProto = target.__proto__;
    target.__proto__ = Object.create(originProto.__proto__ || Object);
    Object.assign(target.__proto__, originProto);
    target.__proto__.render = originProto.__originRender;
  }

  return klass;
}

// 将 renderer 转成组件
function rendererToComponent(
  component: RendererComponent,
  config: RendererConfig
): RendererComponent {
  if (config.storeType && config.component) {
    component = HocStoreFactory({
      storeType: config.storeType,
      extendsData: config.storeExtendsData,
      shouldSyncSuperStore: config.shouldSyncSuperStore
    })(observer(fixMobxInjectRender(component)));
  }

  if (config.isolateScope) {
    component = Scoped(component, config.type);
  }
  return component;
}

export function registerRenderer(config: RendererConfig): RendererConfig {
  if (!config.test && !config.type) {
    throw new TypeError('please set config.type or config.test');
  } else if (!config.type && config.name !== 'static') {
    // todo static 目前还没办法不用 test 来实现
    console.warn(
      `config.type is recommended for register renderer(${config.test})`
    );
  }

  if (typeof config.type === 'string' && config.type) {
    config.type = config.type.toLowerCase();
    config.test =
      config.test ||
      new RegExp(
        `(^|\/)(?:${(config.alias || [])
          .concat(config.type)
          .map(type => string2regExp(type))
          .join('|')})$`,
        'i'
      );
  }

  const exists = renderersTypeMap[config.type || ''];
  let renderer = {...config};
  if (
    exists &&
    exists.component &&
    exists.component !== Placeholder &&
    config.component &&
    !exists.origin &&
    !config.override
  ) {
    throw new Error(
      `The renderer with type "${config.type}" has already exists, please try another type!`
    );
  } else if (exists) {
    // 如果已经存在，合并配置，并用合并后的配置
    renderer = Object.assign(exists, config);
    // 如果已存在的配置有占位组件，并且新的配置是异步渲染器，在把占位组件删除
    // 避免遇到设置了 visibleOn/hiddenOn 条件的 Schema 无法渲染的问题
    if (
      exists.component === Placeholder &&
      !config.component &&
      config.getComponent
    ) {
      delete renderer.component;
      delete renderer.Renderer;
    }
  }

  renderer.weight = renderer.weight || 0;
  renderer.name =
    renderer.name || renderer.type || `anonymous-${anonymousIndex++}`;

  if (config.component) {
    renderer.Renderer = config.component;
    renderer.component = rendererToComponent(config.component, renderer);
  }

  if (!exists) {
    const idx = findIndex(
      renderers,
      item => (config.weight as number) < item.weight
    );
    ~idx ? renderers.splice(idx, 0, renderer) : renderers.push(renderer);
  }
  renderersMap[renderer.name] = !!(
    renderer.component && renderer.component !== Placeholder
  );
  renderer.type && (renderersTypeMap[renderer.type] = renderer);
  (renderer.alias || []).forEach(alias => {
    const fork = {
      ...renderer,
      type: alias,
      name: alias,
      alias: undefined,
      origin: renderer
    };

    const idx = renderers.findIndex(item => item.name === alias);
    if (~idx) {
      Object.assign(renderers[idx], fork);
    } else {
      renderers.push(fork);
    }
    renderersTypeMap[alias] = fork;
    renderersMap[alias] = true;
  });
  return renderer;
}

export function unRegisterRenderer(config: RendererConfig | string) {
  const name = (typeof config === 'string' ? config : config.name)!;
  const idx = renderers.findIndex(item => item.name === name);
  if (~idx) {
    const renderer = renderers[idx];
    renderers.splice(idx, 1);

    delete renderersMap[name];
    delete renderersTypeMap[renderer.type || ''];
    renderer.alias?.forEach(alias => {
      const idx = renderers.findIndex(item => item.name === alias);
      idx > -1 && renderers.splice(idx, 1);
      delete renderersTypeMap[alias];
      delete renderersMap[alias];
    });

    // 清空渲染器定位缓存
    Object.keys(cache).forEach(key => {
      const value = cache[key];
      if (value === renderer) {
        delete cache[key];
      }
    });
  }
}

export function loadRendererError(schema: Schema, path: string) {
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

export async function loadAsyncRenderer(renderer: RendererConfig) {
  if (!isAsyncRenderer(renderer)) {
    // already loaded
    return;
  }

  const result = await renderer.getComponent!();

  // 如果异步加载的组件没有注册渲染器
  // 同时默认导出了一个组件，则自动注册
  if (!renderer.component && result.default) {
    registerRenderer({
      ...renderer,
      component: result.default
    });
  }
}

export function isAsyncRenderer(item: RendererConfig) {
  return (
    item &&
    (!item.component || item.component === Placeholder) &&
    item.getComponent
  );
}

export function hasAsyncRenderers(types?: Array<string>) {
  return (
    Array.isArray(types)
      ? renderers.filter(item => item.type && types.includes(item.type))
      : renderers
  ).some(isAsyncRenderer);
}

export async function loadAsyncRenderersByType(
  type: string | Array<string>,
  ignore = false
) {
  const types = Array.isArray(type) ? type : [type];
  const asyncRenderers = types
    .map(type => {
      const renderer = renderersTypeMap[type];
      if (!renderer && !ignore) {
        throw new Error(`Can not find the renderer by type: ${type}`);
      }
      return renderer;
    })
    .filter(isAsyncRenderer);

  if (asyncRenderers.length) {
    await Promise.all(asyncRenderers.map(item => loadAsyncRenderer(item)));
  }
}

export async function loadAllAsyncRenderers() {
  const asyncRenderers = renderers.filter(isAsyncRenderer);
  if (asyncRenderers.length) {
    await Promise.all(
      renderers.map(async renderer => {
        await loadAsyncRenderer(renderer);
      })
    );
  }
}

export const defaultOptions: RenderOptions = {
  session: 'global',
  richTextToken: '',
  useMobileUI: true, // 是否启用移动端原生 UI
  enableAMISDebug:
    (window as any).enableAMISDebug ??
    location.search.indexOf('amisDebug=1') !== -1 ??
    false,
  loadRenderer: loadRendererError,
  fetcher() {
    return Promise.reject('fetcher is required');
  },
  // 使用 WebSocket 来实时获取数据
  wsFetcher(
    ws: WsObject,
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
      'Please implement isCancel. see https://aisuda.bce.baidu.com/amis/zh-CN/start/getting-started#%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97'
    );
    return false;
  },
  updateLocation() {
    console.error(
      'Please implement updateLocation. see https://aisuda.bce.baidu.com/amis/zh-CN/start/getting-started#%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97'
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
    // link动作新增了targetType属性，默认是内容区打开(page),在新窗口打开(blank);在当前页签打开(self)
    if (
      action?.actionType === 'link' &&
      ['blank', 'self'].includes(action?.targetType)
    ) {
      if (action.targetType === 'self') {
        // 当前页签打开，需要刷新页面
        window.history.pushState(null, '', to);
        location.reload();
      } else {
        window.open(to);
      }
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
      const currentQuery = parseQuery(location);
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
  filterHtml: (input: string) => input,
  isMobile: isMobile,
  getPageId: getPageId
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
    store = RendererStore.create(
      {},
      {
        ...defaultOptions,
        ...options
      }
    );
    stores[options.session || session] = store;
  } else {
    const env = getEnv(store);
    Object.assign(env, options);
  }
}

// 扩充默认的 env ，这样使用方不需要指定都会有。
export function extendDefaultEnv(env: Partial<RenderOptions>) {
  Object.assign(defaultOptions, env);
}

let cache: {[propName: string]: RendererConfig} = {};
export function resolveRenderer(
  path: string,
  schema?: Schema
): null | RendererConfig {
  const type = typeof schema?.type == 'string' ? schema.type.toLowerCase() : '';

  // 直接匹配类型，后续注册渲染都应该用这个方式而不是之前的判断路径。
  if (type && renderersTypeMap[type]) {
    return renderersTypeMap[type];
  } else if (cache[path]) {
    return cache[path];
  } else if (path && path.length > 3072) {
    throw new Error('Path太长是不是死循环了？');
  }

  let renderer: null | RendererConfig = null;

  renderers.some(item => {
    let matched = false;

    if (typeof item.test === 'function') {
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
    (renderer as RendererConfig).component !== Placeholder &&
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

export interface IGlobalOptions {
  pdfjsWorkerSrc: string;
}

const GlobalOptions: IGlobalOptions = {
  pdfjsWorkerSrc: ''
};

export function setGlobalOptions(options: Partial<IGlobalOptions>) {
  Object.assign(GlobalOptions, options);
}

export function getGlobalOptions() {
  return GlobalOptions;
}
