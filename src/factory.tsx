import * as React from "react";
import * as PropTypes from 'prop-types';
import {
    RendererStore,
    IRendererStore,
    IIRendererStore
} from "./store/index";
import {
    getEnv
} from 'mobx-state-tree/';
import {
    Location
} from 'history';
import {
    wrapFetcher
} from './utils/api';
import {
    createObject,
    extendObject,
    guid,
    findIndex,
    promisify,
    anyChanged,
    syncDataFromSuper,
    isObjectShallowModified,
    isVisible
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
import { observer } from "mobx-react";
import getExprProperties from './utils/filter-schema';
import hoistNonReactStatic = require('hoist-non-react-statics');
import omit = require('lodash/omit');
import difference = require('lodash/difference');
import isPlainObject = require('lodash/isPlainObject');
import Scoped from './Scoped';
import { getTheme, ThemeInstance, ClassNamesFn, ThemeContext } from "./theme";
import find = require("lodash/find");
import Alert from "./components/Alert2";

export interface TestFunc {
    (path: string, schema?: object): boolean;
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
    fetcher: (api:Api, data?:any, options?: object) => Promise<Payload>;
    isCancel: (val:any) => boolean;
    notify: (type: "error" | "success", msg: string) => void;
    jumpTo: (to:string, action?: Action, ctx?: object) => void;
    alert: (msg:string) => void;
    confirm: (msg:string, title?: string) => Promise<boolean>;
    updateLocation: (location:any, replace?:boolean) => void;
    isCurrentUrl: (link:string) => boolean;
    rendererResolver?: (path:string, schema:Schema, props:any) => null | RendererConfig;
    copy?: (contents:string) => void;
    getModalContainer?: () => HTMLElement;
    theme: ThemeInstance;
    affixOffsetTop: number;
    affixOffsetBottom: number;
    richTextToken: string;
    [propName:string]: any;
};

export interface RendererProps {
    render: (region: string, node:SchemaNode, props?:any) => JSX.Element;
    env: RendererEnv;
    classPrefix: string;
    classnames: ClassNamesFn;
    $path: string; // 当前组件所在的层级信息
    store?: IIRendererStore;
    data: {
        [propName:string]: any;
    };
    defaultData?: object;
    className?: string;
    [propName:string]: any;
}

export interface renderChildProps extends Partial<RendererProps> {
    env: RendererEnv;
};

export type RendererComponent = React.ComponentType<RendererProps> & {
    propsList?: Array<string>;
}

export interface RendererConfig extends RendererBasicConfig {
    component: RendererComponent;
    Renderer?: RendererComponent; // 原始组件
}

export interface RenderSchemaFilter {
    (schema:Schema, renderer: RendererConfig, props?:object): SchemaNode;
};

export interface RootRenderProps {
    location?: Location;
    theme?: string;
    [propName:string]: any;
};


export interface RenderOptions {
    session?: string,
    fetcher?: (config: fetcherConfig) => Promise<fetcherResult>,
    isCancel?: (value:any) => boolean;
    notify?: (type: "error" | "success", msg: string) => void,
    jumpTo?: (to:string) => void,
    alert?: (msg:string) => void,
    confirm?: (msg:string, title?: string) => boolean | Promise<boolean>;
    rendererResolver?: (path:string, schema:Schema, props:any) => null | RendererConfig;
    copy?: (contents:string) => void;
    getModalContainer?: () => HTMLElement;
    affixOffsetTop?: number;
    affixOffsetBottom?: number;
    richTextToken?: string;
    [propName: string]: any
}

export interface fetcherConfig  {
    url: string;
    method: 'get' | 'post' | 'put' | 'patch' | 'delete';
    data?: any;
    config?: any;
};

export type ReactElement = React.ReactNode[] | JSX.Element | null | false;


const renderers:Array<RendererConfig> = [];
const rendererNames:Array<string> = [];
const schemaFilters:Array<RenderSchemaFilter> = [];
let anonymousIndex = 1;

export function addSchemaFilter(fn:RenderSchemaFilter) {
    schemaFilters.push(fn);
}

export function filterSchema(schema:Schema, render:RendererConfig, props?:any) {
    return schemaFilters.reduce((schema, filter) => filter(schema, render, props), schema) as Schema;
}

export function Renderer(config:RendererBasicConfig) {
    return function<T extends RendererComponent>(component:T):T {
        const renderer = registerRenderer({
            ...config,
            component: component
        });
        return renderer.component as T;
    }
}

export function registerRenderer(config:RendererConfig):RendererConfig {
    if (!config.test) {
        throw new TypeError("config.test is required");
    } else if (!config.component) {
        throw new TypeError("config.component is required");
    }

    config.weight = config.weight || 0;
    config.Renderer = config.component;
    config.name = config.name || `anonymous-${anonymousIndex++}`;

    if (~rendererNames.indexOf(config.name)) {
        throw new Error(`The renderer with name "${config.name}" has already exists, please try another name!`);
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

    const idx = findIndex(renderers, item => (config.weight as number) < item.weight);
    ~idx ? renderers.splice(idx, 0, config) : renderers.push(config);
    rendererNames.push(config.name);
    return config;
}

export function unRegisterRenderer(config:RendererConfig | string) {
    let idx = typeof config === 'string' ? findIndex(renderers, item => item.name === config) : renderers.indexOf(config);
    ~idx && renderers.splice(idx, 1);

    // 清空渲染器定位缓存
    cache = {};
}

export function renderChildren(prefix: string, node: SchemaNode, props:renderChildProps):ReactElement {
    if (Array.isArray(node)) {
        return node.map((node, index) => renderChild(`${prefix}/${index}`, node, {
            ...props,
            key: `${props.key ? `${props.key}-` : ''}${index}`
        }));
    }

    return renderChild(prefix, node, props);
}

export function renderChild(prefix:string, node:SchemaNode, props:renderChildProps):ReactElement {
    if (Array.isArray(node)) {
        return renderChildren(prefix, node, props);
    }

    const typeofnode = typeof node;
    let schema:Schema = typeofnode === 'string' || typeofnode === 'number' ? {type: 'tpl', tpl: String(node)} : node as Schema;
    const detectData = props[schema.detectField || 'data'];
    const exprProps = detectData ? getExprProperties(schema, detectData) : null;

    if (
        exprProps 
        && (
            exprProps.hidden
            || exprProps.visible === false
            || schema.hidden
            || schema.visible === false
            || props.hidden
            || props.visible === false
        )
    ) {
        return null;
    }

    return (
        <SchemaRenderer
            {...props}
            {...exprProps}
            schema={schema}
            $path={`${prefix ? `${prefix}/` : ''}${schema && schema.type || ''}`}
        />
    );
};

export interface RootRendererProps {
    schema: SchemaNode;
    rootStore: IRendererStore;
    env: RendererEnv;
    theme: string;
    pathPrefix?: string;
    [propName:string]: any;
};

const RootStoreContext = React.createContext<IRendererStore>(undefined as any);

export class RootRenderer extends React.Component<RootRendererProps> {
    render() {
        const {
            schema,
            rootStore,
            env,
            pathPrefix,
            ...rest
        } = this.props;

        const theme = env.theme;

        return (
            <RootStoreContext.Provider value={rootStore}>
                <ThemeContext.Provider value={this.props.theme || 'default'}>
                    {renderChild(pathPrefix || '', isPlainObject(schema) ? {
                        type: 'page',
                        ...(schema as Schema)
                    } : schema, {
                        ...rest,
                        env,
                        classnames: theme.classnames,
                        classPrefix: theme.classPrefix
                    }) as JSX.Element}
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
};

const defaultOmitList = [
    'type', 'className', 'data', 'children', 
    'ref', 'visible', 'visibleOn', 'hidden', 
    'hiddenOn', 'disabled', 'disabledOn',
    'children'
];

class SchemaRenderer extends React.Component<SchemaRendererProps, any> {
    static displayName:string = 'Renderer';

    renderer:RendererConfig | null;
    ref: any;
    
    constructor(props:SchemaRendererProps) {
        super(props);
        this.refFn = this.refFn.bind(this);
        this.renderChild = this.renderChild.bind(this);
    }

    componentWillMount() {
        this.resolveSchema(this.props);
    }

    componentWillReceiveProps(nextProps:SchemaRendererProps) {
        const props = this.props;
        
        if (
            props.schema.type !== nextProps.schema.type ||
            props.schema.$$id !== nextProps.schema.$$id
        ) {
            this.resolveSchema(nextProps);
        }
    }

    // 限制：只有 schema 除外的 props 变化，或者 schema 里面的某个成员值发生变化才更新。
    shouldComponentUpdate(nextProps:SchemaRendererProps) {
        const props = this.props;
        const list:Array<string> = difference(Object.keys(nextProps), ['schema']);

        if (
            difference(Object.keys(props), ['schema']).length !== list.length
            || anyChanged(list, this.props, nextProps)
        ) {
            return true;
        } else {
            const list:Array<string> = Object.keys(nextProps.schema);

            if (
                Object.keys(props.schema).length !== list.length
                || anyChanged(list, props.schema, nextProps.schema)
            ) {
                return true;
            }
        }

        return false;
    }

    resolveSchema(props:SchemaRendererProps):any {
        const schema = props.schema;
        const path = props.$path;
        const rendererResolver = props.env.rendererResolver || resolveRenderer;
        this.renderer = rendererResolver(path, schema, props);
    }

    getWrappedInstance() {
        return this.ref;
    }

    refFn(ref:any) {
        this.ref = ref;
    }

    renderChild(region: string, node?:SchemaNode, subProps: {
        data?: object;
        [propName: string]: any;
    } = {}) {
        let {
            schema,
            $path,
            env,
            ...rest
        } = this.props;

        const omitList = defaultOmitList.concat();
        if (this.renderer) {
            const Component = this.renderer.component;
            Component.propsList && omitList.push.apply(omitList, Component.propsList as Array<string>);
        }

        return renderChild(`${$path}${region ? `/${region}` : ''}`, node || '', {
            ...omit(rest, omitList),
            ...subProps,
            data: subProps.data || rest.data,
            env: env
        });
    }

    render():JSX.Element | null {
        let {
            schema,
            $path,
            ...rest
        } = this.props;

        const theme = this.props.env.theme;

        if (Array.isArray(schema)) {
            return renderChildren($path, schema, rest) as JSX.Element;
        } else if (schema.children) {
            return typeof schema.children === 'function' ? schema.children({
                ...rest,
                $path: $path,
                render: this.renderChild,
                ref: this.refFn,
            }, schema) : schema.children;
        } else if (!this.renderer) {
            return (
                <Alert level="danger">
                    <p>Error: 找不到对应的渲染器</p>
                    <p>Path: {$path}</p>
                    <pre><code>{JSON.stringify(schema, null, 2)}</code></pre>
                </Alert>
            );
        }

        const renderer = this.renderer as RendererConfig;
        schema = filterSchema(schema, renderer, rest);
        const {
            data: defaultData,
            ...restSchema
        } = schema;
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

export function HocStoreFactory(renderer:{
    storeType: string;
    extendsData?: boolean;
}):any {
    return function <T extends React.ComponentType<RendererProps>>(Component:T) {

        type Props = Omit<RendererProps, "store" | "data" | "dataUpdatedAt" | "scope"> & {
            store?: IIRendererStore;
            data?: RendererData;
            scope?: RendererData;
        };

        @observer
        class StoreFactory extends React.Component<Props> {
            static displayName = `WithStore(${Component.displayName || Component.name})`;
            static ComposedComponent = Component;
            static contextType = RootStoreContext;
            store:IIRendererStore;
            context!: React.ContextType<typeof RootStoreContext>;
            ref:any;

            getWrappedInstance() {
                return this.ref;
            }

            refFn(ref:any) {
                this.ref = ref;
            }

            formatData(data:any):object {
                if (Array.isArray(data)) {
                    return {
                        items: data
                    }
                }

                return data as object;
            }

            componentWillMount() {
                const rootStore = this.context;
                this.renderChild = this.renderChild.bind(this);
                this.refFn = this.refFn.bind(this);

                const store = this.store = rootStore.addStore({
                    id: guid(),
                    path: this.props.$path,
                    storeType: renderer.storeType,
                    parentId: this.props.store ? this.props.store.id : ''
                });

                if (renderer.extendsData === false) {
                    store.initData(createObject((this.props.data as any) ? (this.props.data as any).__super : null, {
                        ...this.formatData(this.props.defaultData),
                        ...this.formatData(this.props.data)
                    }));
                } else if (this.props.scope || this.props.data && (this.props.data as any).__super) {
                    if (this.props.store && this.props.data === this.props.store.data) {
                        store.initData(createObject(this.props.store.data, {
                            ...this.formatData(this.props.defaultData)
                        }))
                    } else {
                        store.initData(createObject((this.props.data as any).__super || this.props.scope, {
                            ...this.formatData(this.props.defaultData),
                            ...this.formatData(this.props.data)
                        }))
                    }
                } else {
                    store.initData({
                        ...this.formatData(this.props.defaultData),
                        ...this.formatData(this.props.data)
                    });
                }
            }

            componentWillReceiveProps(nextProps:RendererProps) {
                const props = this.props;
                const store = this.store;

                if (renderer.extendsData === false) {
                    (props.defaultData !== nextProps.defaultData || isObjectShallowModified(props.data, nextProps.data))
                    && store.initData(extendObject(nextProps.data, {
                        ...store.hasRemoteData ? store.data : null, // todo 只保留 remote 数据
                        ...this.formatData(nextProps.defaultData),
                        ...this.formatData(nextProps.data)
                    }));
                } else if (isObjectShallowModified(props.data, nextProps.data)) {
                    if (nextProps.store && nextProps.store.data === nextProps.data) {
                        const newData = createObject(nextProps.store.data, syncDataFromSuper(store.data,
                            nextProps.store.data, props.scope, nextProps.dataUpdatedAt !== props.dataUpdatedAt));
                        
                        // todo fix: dialog 种数据从孩子 form 同步过来后，会走这个逻辑让 form 更新 data，会导致里面的 __prev 丢失。
                        store.initData(newData);
                    } else if ((nextProps.data as any).__super) {
                        store.initData(extendObject(nextProps.data));
                    } else {
                        store.initData(createObject(nextProps.scope, nextProps.data));
                    }
                } else  if (nextProps.scope !== props.scope) {
                    store.initData(createObject(nextProps.scope, store.data));
                }
            }

            componentWillUnmount() {
                const rootStore = this.context as IRendererStore;
                const store = this.store;
                rootStore.removeStore(store);
                delete this.store;
            }

            renderChild(region: string, node:SchemaNode, subProps: {
                data?: object;
                [propName: string]: any;
            } = {}) {
                let {
                    render,
                } = this.props;
        
                return render(region, node, {
                    data: this.store.data,
                    dataUpdatedAt: this.store.updatedAt,
                    ...subProps,
                    scope: this.store.data,
                    store: this.store
                });
            }

            render() {
                const {
                    detectField,
                    ...rest
                } = this.props;

                let exprProps:any = {};
                if (!detectField || detectField === "data") {
                    exprProps = getExprProperties(rest, this.store.data);
                    
                    if (exprProps.hidden || exprProps.visible === false) {
                        return null;
                    }
                }

                return (
                    <Component
                        {...rest as any /* todo */}
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
    }
}


const defaultOptions:RenderOptions = {
    session: 'global',
    affixOffsetTop: 50,
    affixOffsetBottom: 0,
    richTextToken: '',
    fetcher() {
        return Promise.reject('fetcher is required');
    },
    isCancel() {
        console.error('Please implements this.');
        return false;
    },
    alert(msg:string) {
        alert(msg);
    },
    updateLocation() {
        console.error('Please implements this.');
    },
    confirm(msg:string) {
        return confirm(msg)
    },
    notify(msg) {
        alert(msg);
    },
    jumpTo() {
        console.error('Please implements this.');
    },
    isCurrentUrl() {
        return false;
    },
    copy(contents:string) {
        console.error('copy contents', contents)
    },
    rendererResolver: resolveRenderer
};
let stores:{
    [propName:string]: IRendererStore
} = {};
export function render(schema:SchemaNode, props:RootRenderProps = {}, options:RenderOptions = {}, pathPrefix:string = ''):JSX.Element {
    options = {
        ...defaultOptions,
        ...options
    };

    let store = stores[options.session || 'global'] || (stores[options.session || 'global'] = RendererStore.create({}, {
        ...options,
        fetcher: options.fetcher ? wrapFetcher(options.fetcher) : defaultOptions.fetcher,
        confirm: options.confirm ? promisify(options.confirm) : defaultOptions.confirm,
    }));

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

export function clearStoresCache(sessions?:Array<string>) {
    if (Array.isArray(sessions) && sessions.length) {
        sessions.forEach(key => delete stores[key]);
    } else {
        stores = {};
    }
}

let cache:{[propName: string]: RendererConfig} = {};
export function resolveRenderer(path:string, schema?:Schema, props?:any): null | RendererConfig {
    if (cache[path]) {
        return cache[path];
    } else if (path && path.length > 1024) {
        throw new Error('Path太长是不是死循环了？');
    }

    let renderer:null | RendererConfig = null;

    renderers.some(item => {
        let matched = false;

        if (typeof item.test === "function") {
            matched = item.test(path, schema);
        } else if (item.test instanceof RegExp) {
            matched = item.test.test(path);
        }

        if (matched) {
            renderer = item;
        }

        return matched;
    });

    // 只能缓存纯正则表达式的后者方法中没有用到第二个参数的，因为自定义 test 函数的有可能依赖 schema 的结果
    if (renderer !== null && 
        (
            (renderer as RendererConfig).test instanceof RegExp
            || typeof (renderer as RendererConfig).test === 'function' && ((renderer as RendererConfig).test as Function).length < 2
        )) {
        cache[path] = renderer;
    }

    return renderer;
}


export function getRenderers() {
    return renderers.concat();
}

export function getRendererByName(name:string) {
    return find(renderers, item => item.name === name);
}