import React from 'react';
import qs from 'qs';
import {RendererStore, IRendererStore, IIRendererStore} from './store/index';
import {getEnv} from 'mobx-state-tree';
import {Location, parsePath} from 'history';
import {wrapFetcher} from './utils/api';
import {
  createObject,
  extendObject,
  guid,
  findIndex,
  promisify,
  anyChanged,
  syncDataFromSuper,
  isObjectShallowModified,
  isVisible,
  isEmpty,
  autobind
} from './utils/helper';
import {
  Api,
  fetcherResult,
  Payload,
  SchemaNode,
  Schema,
  Action,
  ExtractProps,
  Omit,
  PlainObject,
  RendererData
} from './types';
import {observer} from 'mobx-react';
import getExprProperties from './utils/filter-schema';
import hoistNonReactStatic = require('hoist-non-react-statics');
import omit = require('lodash/omit');
import difference = require('lodash/difference');
import isPlainObject = require('lodash/isPlainObject');
import Scoped from './Scoped';
import {getTheme, ThemeInstance, ClassNamesFn, ThemeContext} from './theme';
import find = require('lodash/find');
import Alert from './components/Alert2';
import {LazyComponent} from './components';

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
  storeExtendsData?: boolean; // 是否需要继承上层数据。
  weight?: number; // 权重，值越低越优先命中。
  isolateScope?: boolean;
  isFormItem?: boolean;
  // [propName:string]:any;
}

export interface RendererEnv {
  fetcher: (api: Api, data?: any, options?: object) => Promise<Payload>;
  isCancel: (val: any) => boolean;
  notify: (type: 'error' | 'success', msg: string) => void;
  jumpTo: (to: string, action?: Action, ctx?: object) => void;
  alert: (msg: string) => void;
  confirm: (msg: string, title?: string) => Promise<boolean>;
  updateLocation: (location: any, replace?: boolean) => void;
  isCurrentUrl: (link: string) => boolean;
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

export interface RendererProps {
  render: (region: string, node: SchemaNode, props?: any) => JSX.Element;
  env: RendererEnv;
  classPrefix: string;
  classnames: ClassNamesFn;
  $path: string; // 当前组件所在的层级信息
  store?: IIRendererStore;
  data: {
    [propName: string]: any;
  };
  defaultData?: object;
  className?: string;
  [propName: string]: any;
}

export interface renderChildProps extends Partial<RendererProps> {
  env: RendererEnv;
}

export type RendererComponent = React.ComponentType<RendererProps> & {
  propsList?: Array<string>;
};

export interface RendererConfig extends RendererBasicConfig {
  component: RendererComponent;
  Renderer?: RendererComponent; // 原始组件
}

export interface RenderSchemaFilter {
  (schema: Schema, renderer: RendererConfig, props?: object): SchemaNode;
}

export interface RootRenderProps {
  location?: Location;
  theme?: string;
  [propName: string]: any;
}

export interface RenderOptions {
  session?: string;
  fetcher?: (config: fetcherConfig) => Promise<fetcherResult>;
  isCancel?: (value: any) => boolean;
  notify?: (type: 'error' | 'success', msg: string) => void;
  jumpTo?: (to: string) => void;
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
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
  data?: any;
  config?: any;
}

export type ReactElement = React.ReactNode[] | JSX.Element | null | false;

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
  return function<T extends RendererComponent>(component: T): T {
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
      `The renderer with name "${
        config.name
      }" has already exists, please try another name!`
    );
  }

  if (config.storeType && config.component) {
    config.component = HocStoreFactory({
      storeType: config.storeType,
      extendsData: config.storeExtendsData
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

  // 清空渲染器定位缓存
  cache = {};
}

export function renderChildren(
  prefix: string,
  node: SchemaNode,
  props: renderChildProps
): ReactElement {
  if (Array.isArray(node)) {
    return node.map((node, index) =>
      renderChild(`${prefix}/${index}`, node, {
        ...props,
        key: `${props.key ? `${props.key}-` : ''}${index}`
      })
    );
  }

  return renderChild(prefix, node, props);
}

export function renderChild(
  prefix: string,
  node: SchemaNode,
  props: renderChildProps
): ReactElement {
  if (Array.isArray(node)) {
    return renderChildren(prefix, node, props);
  }

  const typeofnode = typeof node;
  let schema: Schema =
    typeofnode === 'string' || typeofnode === 'number'
      ? {type: 'tpl', tpl: String(node)}
      : (node as Schema);
  const detectData =
    schema.detectField === '&' ? props : props[schema.detectField || 'data'];
  const exprProps = detectData ? getExprProperties(schema, detectData) : null;

  if (
    exprProps &&
    (exprProps.hidden ||
      exprProps.visible === false ||
      schema.hidden ||
      schema.visible === false ||
      props.hidden ||
      props.visible === false)
  ) {
    return null;
  }

  const transform = props.propsTransform;

  if (transform) {
    delete props.propsTransform;
    props = transform(props);
  }

  return (
    <SchemaRenderer
      {...props}
      {...exprProps}
      schema={schema}
      $path={`${prefix ? `${prefix}/` : ''}${(schema && schema.type) || ''}`}
    />
  );
}

export interface RootRendererProps {
  schema: SchemaNode;
  rootStore: IRendererStore;
  env: RendererEnv;
  theme: string;
  pathPrefix?: string;
  [propName: string]: any;
}

const RootStoreContext = React.createContext<IRendererStore>(undefined as any);

export class RootRenderer extends React.Component<RootRendererProps> {
  state = {
    error: null,
    errorInfo: null
  };

  componentDidCatch(error: any, errorInfo: any) {
    console.error(error);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  @autobind
  resolveDefinitions(name: string) {
    const definitions = (this.props.schema as Schema).definitions;
    if (!name || isEmpty(definitions)) {
      return {};
    }
    return definitions && definitions[name];
  }

  render() {
    const {error, errorInfo} = this.state;
    if (errorInfo) {
      return errorRenderer(error, errorInfo);
    }
    const {
      schema,
      rootStore,
      env,
      pathPrefix,
      location,
      data,
      ...rest
    } = this.props;

    const theme = env.theme;
    const query =
      (location && location.query) ||
      (location && location.search && qs.parse(location.search.substring(1))) ||
      (window.location.search && qs.parse(window.location.search.substring(1)));

    const finalData = query
      ? createObject(
          {
            ...(data && data.__super ? data.__super : null),
            ...query,
            query
          },
          data
        )
      : data;

    return (
      <RootStoreContext.Provider value={rootStore}>
        <ThemeContext.Provider value={this.props.theme || 'default'}>
          {
            renderChild(
              pathPrefix || '',
              isPlainObject(schema)
                ? {
                    type: 'page',
                    ...(schema as Schema)
                  }
                : schema,
              {
                ...rest,
                resolveDefinitions: this.resolveDefinitions,
                location: location,
                data: finalData,
                env,
                classnames: theme.classnames,
                classPrefix: theme.classPrefix
              }
            ) as JSX.Element
          }
        </ThemeContext.Provider>
      </RootStoreContext.Provider>
    );
  }
}

export const ScopedRootRenderer = Scoped(RootRenderer);

interface SchemaRendererProps extends Partial<RendererProps> {
  schema: Schema;
  $path: string;
  env: RendererEnv;
}

const defaultOmitList = [
  'type',
  'name',
  '$ref',
  'className',
  'data',
  'children',
  'ref',
  'visible',
  'visibleOn',
  'hidden',
  'hiddenOn',
  'disabled',
  'disabledOn',
  'component',
  'detectField'
];

class SchemaRenderer extends React.Component<SchemaRendererProps, any> {
  static displayName: string = 'Renderer';

  renderer: RendererConfig | null;
  ref: any;

  constructor(props: SchemaRendererProps) {
    super(props);
    this.refFn = this.refFn.bind(this);
    this.renderChild = this.renderChild.bind(this);
    this.reRender = this.reRender.bind(this);
  }

  componentWillMount() {
    this.resolveRenderer(this.props);
  }

  componentWillReceiveProps(nextProps: SchemaRendererProps) {
    const props = this.props;

    if (
      props.schema.type !== nextProps.schema.type ||
      props.schema.$$id !== nextProps.schema.$$id
    ) {
      this.resolveRenderer(nextProps);
    }
  }

  // 限制：只有 schema 除外的 props 变化，或者 schema 里面的某个成员值发生变化才更新。
  shouldComponentUpdate(nextProps: SchemaRendererProps) {
    const props = this.props;
    const list: Array<string> = difference(Object.keys(nextProps), ['schema']);

    if (
      difference(Object.keys(props), ['schema']).length !== list.length ||
      anyChanged(list, this.props, nextProps)
    ) {
      return true;
    } else {
      const list: Array<string> = Object.keys(nextProps.schema);

      if (
        Object.keys(props.schema).length !== list.length ||
        anyChanged(list, props.schema, nextProps.schema)
      ) {
        return true;
      }
    }

    return false;
  }

  resolveRenderer(props: SchemaRendererProps): any {
    let schema = props.schema;
    let path = props.$path;
    const rendererResolver = props.env.rendererResolver || resolveRenderer;
    if (schema.$ref) {
      schema = {
        ...props.resolveDefinitions(schema.$ref),
        ...schema
      };
      delete schema.$ref;
      path = path.replace(/(?!.*\/).*/, schema.type);
    }
    // value 会提前从 control 中获取到，所有需要把control中的属性也补充完整
    // if (schema.control && schema.control.$ref) {
    //     schema.control = {
    //         ...props.resolveDefinitions(schema.control.$ref),
    //         ...schema.control
    //     }
    //     delete schema.control.$ref;
    // }
    this.renderer = rendererResolver(path, schema, props);
    return schema;
  }

  getWrappedInstance() {
    return this.ref;
  }

  refFn(ref: any) {
    this.ref = ref;
  }

  renderChild(
    region: string,
    node?: SchemaNode,
    subProps: {
      data?: object;
      [propName: string]: any;
    } = {}
  ) {
    let {schema, $path, env, ...rest} = this.props;

    const omitList = defaultOmitList.concat();
    if (this.renderer) {
      const Component = this.renderer.component;
      Component.propsList &&
        omitList.push.apply(omitList, Component.propsList as Array<string>);
    }

    return renderChild(`${$path}${region ? `/${region}` : ''}`, node || '', {
      ...omit(rest, omitList),
      ...subProps,
      data: subProps.data || rest.data,
      env: env
    });
  }

  reRender() {
    this.resolveRenderer(this.props);
    this.forceUpdate();
  }

  render(): JSX.Element | null {
    let {$path, schema, ...rest} = this.props;

    if (schema.$ref) {
      schema = this.resolveRenderer(this.props);
    }

    const theme = this.props.env.theme;

    if (Array.isArray(schema)) {
      return renderChildren($path, schema, rest) as JSX.Element;
    } else if (schema.children) {
      return React.isValidElement(schema.children)
        ? schema.children
        : (schema.children as Function)({
            ...rest,
            $path: $path,
            render: this.renderChild
          });
    } else if (typeof schema.component === 'function') {
      return React.createElement(schema.component as any, {
        ...rest,
        $path: $path,
        render: this.renderChild
      });
    } else if (!this.renderer) {
      return (
        <LazyComponent
          {...rest}
          getComponent={async () => {
            const result = await rest.env.loadRenderer(
              schema,
              $path,
              this.reRender
            );
            if (result && typeof result === 'function') {
              return result;
            } else if (result && React.isValidElement(result)) {
              return () => result;
            }

            this.reRender();
            return () => loadRenderer(schema, $path);
          }}
          $path={$path}
          retry={this.reRender}
        />
      );
    }

    const renderer = this.renderer as RendererConfig;
    schema = filterSchema(schema, renderer, rest);
    const {data: defaultData, ...restSchema} = schema;
    const Component = renderer.component;

    return (
      <Component
        {...theme.getRendererConfig(renderer.name)}
        {...restSchema}
        {...rest}
        defaultData={defaultData}
        $path={$path}
        ref={this.refFn}
        render={this.renderChild}
      />
    );
  }
}

export function HocStoreFactory(renderer: {
  storeType: string;
  extendsData?: boolean;
}): any {
  return function<T extends React.ComponentType<RendererProps>>(Component: T) {
    type Props = Omit<
      RendererProps,
      'store' | 'data' | 'dataUpdatedAt' | 'scope'
    > & {
      store?: IIRendererStore;
      data?: RendererData;
      scope?: RendererData;
    };

    @observer
    class StoreFactory extends React.Component<Props> {
      static displayName = `WithStore(${Component.displayName ||
        Component.name})`;
      static ComposedComponent = Component;
      static contextType = RootStoreContext;
      store: IIRendererStore;
      context!: React.ContextType<typeof RootStoreContext>;
      ref: any;

      getWrappedInstance() {
        return this.ref;
      }

      refFn(ref: any) {
        this.ref = ref;
      }

      formatData(data: any): object {
        if (Array.isArray(data)) {
          return {
            items: data
          };
        }

        return data as object;
      }

      componentWillMount() {
        const rootStore = this.context;
        this.renderChild = this.renderChild.bind(this);
        this.refFn = this.refFn.bind(this);

        const store = (this.store = rootStore.addStore({
          id: guid(),
          path: this.props.$path,
          storeType: renderer.storeType,
          parentId: this.props.store ? this.props.store.id : ''
        } as any));

        if (renderer.extendsData === false) {
          store.initData(
            createObject(
              (this.props.data as any)
                ? (this.props.data as any).__super
                : null,
              {
                ...this.formatData(this.props.defaultData),
                ...this.formatData(this.props.data)
              }
            )
          );
        } else if (
          this.props.scope ||
          (this.props.data && (this.props.data as any).__super)
        ) {
          if (this.props.store && this.props.data === this.props.store.data) {
            store.initData(
              createObject(this.props.store.data, {
                ...this.formatData(this.props.defaultData)
              })
            );
          } else {
            store.initData(
              createObject(
                (this.props.data as any).__super || this.props.scope,
                {
                  ...this.formatData(this.props.defaultData),
                  ...this.formatData(this.props.data)
                }
              )
            );
          }
        } else {
          store.initData({
            ...this.formatData(this.props.defaultData),
            ...this.formatData(this.props.data)
          });
        }
      }

      componentWillReceiveProps(nextProps: RendererProps) {
        const props = this.props;
        const store = this.store;

        if (renderer.extendsData === false) {
          (props.defaultData !== nextProps.defaultData ||
            isObjectShallowModified(props.data, nextProps.data) ||
            // CRUD 中 toolbar 里面的 data 是空对象，但是 __super 会不一样
            (nextProps.data &&
              props.data &&
              nextProps.data.__super !== props.data.__super)) &&
            store.initData(
              extendObject(nextProps.data, {
                ...(store.hasRemoteData ? store.data : null), // todo 只保留 remote 数据
                ...this.formatData(nextProps.defaultData),
                ...this.formatData(nextProps.data)
              })
            );
        } else if (isObjectShallowModified(props.data, nextProps.data)) {
          if (nextProps.store && nextProps.store.data === nextProps.data) {
            store.initData(
              createObject(
                nextProps.store.data,
                syncDataFromSuper(
                  store.data,
                  nextProps.store.data,
                  props.scope,
                  nextProps.dataUpdatedAt !== props.dataUpdatedAt,
                  store
                )
              )
            );
          } else if (nextProps.data && (nextProps.data as any).__super) {
            store.initData(extendObject(nextProps.data));
          } else {
            store.initData(createObject(nextProps.scope, nextProps.data));
          }
        } else if (
          (!nextProps.store || nextProps.data !== nextProps.store.data) &&
          nextProps.data &&
          nextProps.data.__super
        ) {
          // 这个用法很少，当 data.__super 值发生变化时，更新 store.data
          (!props.data ||
            isObjectShallowModified(
              nextProps.data.__super,
              props.data.__super,
              false
            )) &&
            store.initData(
              createObject(nextProps.data.__super, {
                ...nextProps.data,
                ...store.data
              })
            );
        } else if (props.scope !== nextProps.scope) {
          store.initData(
            createObject(nextProps.scope, {
              // ...nextProps.data,
              ...store.data
            })
          );
        }
      }

      componentWillUnmount() {
        const rootStore = this.context as IRendererStore;
        const store = this.store;
        rootStore.removeStore(store);
        delete this.store;
      }

      renderChild(
        region: string,
        node: SchemaNode,
        subProps: {
          data?: object;
          [propName: string]: any;
        } = {}
      ) {
        let {render} = this.props;

        return render(region, node, {
          data: this.store.data,
          dataUpdatedAt: this.store.updatedAt,
          ...subProps,
          scope: this.store.data,
          store: this.store
        });
      }

      render() {
        const {detectField, ...rest} = this.props;

        let exprProps: any = {};
        if (!detectField || detectField === 'data') {
          exprProps = getExprProperties(rest, this.store.data);

          if (exprProps.hidden || exprProps.visible === false) {
            return null;
          }
        }

        return (
          <Component
            {
              ...rest as any /* todo */
            }
            {...exprProps}
            ref={this.refFn}
            data={this.store.data}
            dataUpdatedAt={this.store.updatedAt}
            store={this.store}
            scope={this.store.data}
            render={this.renderChild}
          />
        );
      }
    }
    hoistNonReactStatic(StoreFactory, Component);

    return StoreFactory;
  };
}

function loadRenderer(schema: Schema, path: string) {
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

function errorRenderer(error: any, errorInfo: any) {
  return (
    <Alert level="danger">
      <p>{error && error.toString()}</p>
      <pre>
        <code>{errorInfo.componentStack}</code>
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
  isCancel() {
    console.error(
      'Please implements this. see https://baidu.github.io/amis/docs/getting-started#%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8'
    );
    return false;
  },
  alert(msg: string) {
    alert(msg);
  },
  updateLocation() {
    console.error(
      'Please implements this. see https://baidu.github.io/amis/docs/getting-started#%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8'
    );
  },
  confirm(msg: string) {
    return confirm(msg);
  },
  notify(msg) {
    alert(msg);
  },
  jumpTo() {
    console.error(
      'Please implements this. see https://baidu.github.io/amis/docs/getting-started#%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8'
    );
  },
  isCurrentUrl() {
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
  schema: SchemaNode,
  props: RootRenderProps = {},
  options: RenderOptions = {},
  pathPrefix: string = ''
): JSX.Element {
  options = {
    ...defaultOptions,
    ...options
  };

  let store =
    stores[options.session || 'global'] ||
    (stores[options.session || 'global'] = RendererStore.create(
      {},
      {
        ...options,
        fetcher: options.fetcher
          ? wrapFetcher(options.fetcher)
          : defaultOptions.fetcher,
        confirm: options.confirm
          ? promisify(options.confirm)
          : defaultOptions.confirm
      }
    ));

  (window as any).amisStore = store; // 为了方便 debug.
  const env = getEnv(store);
  const theme = props.theme || options.theme || 'default';
  env.theme = getTheme(theme);

  return (
    <ScopedRootRenderer
      {...props}
      schema={schema}
      pathPrefix={pathPrefix}
      rootStore={store}
      env={env}
      theme={theme}
    />
  );
}

export function clearStoresCache(sessions?: Array<string>) {
  if (Array.isArray(sessions) && sessions.length) {
    sessions.forEach(key => delete stores[key]);
  } else {
    stores = {};
  }
}

let cache: {[propName: string]: RendererConfig} = {};
export function resolveRenderer(
  path: string,
  schema?: Schema,
  props?: any
): null | RendererConfig {
  if (cache[path]) {
    return cache[path];
  } else if (path && path.length > 1024) {
    throw new Error('Path太长是不是死循环了？');
  }

  let renderer: null | RendererConfig = null;

  renderers.some(item => {
    let matched = false;

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

  // 只能缓存纯正则表达式的后者方法中没有用到第二个参数的，因为自定义 test 函数的有可能依赖 schema 的结果
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
