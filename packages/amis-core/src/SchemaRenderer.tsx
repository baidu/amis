import difference from 'lodash/difference';
import findLastIndex from 'lodash/findLastIndex';
import omit from 'lodash/omit';
import React from 'react';
import {isValidElementType} from 'react-is';
import LazyComponent from './components/LazyComponent';
import {
  filterSchema,
  loadRendererError,
  loadAsyncRenderer,
  registerRenderer,
  RendererConfig,
  RendererEnv,
  RendererProps,
  resolveRenderer
} from './factory';
import {asFormItem} from './renderers/Item';
import {IScopedContext, ScopedContext} from './Scoped';
import {Schema, SchemaNode} from './types';
import {DebugWrapper} from './utils/debug';
import getExprProperties from './utils/filter-schema';
import {
  anyChanged,
  chainEvents,
  autobind,
  TestIdBuilder,
  formateId
} from './utils/helper';
import {SimpleMap} from './utils/SimpleMap';
import {
  bindEvent,
  bindGlobalEventForRenderer as bindGlobalEvent,
  dispatchEvent,
  RendererEvent
} from './utils/renderer-event';
import {isAlive} from 'mobx-state-tree';
import {reaction} from 'mobx';
import {resolveVariableAndFilter} from './utils/tpl-builtin';
import {buildStyle, mergeStyle} from './utils/style';
import {isExpression} from './utils/formula';
import {StatusScopedProps} from './StatusScoped';
import {evalExpression, filter} from './utils/tpl';
import Animations from './components/Animations';
import {cloneObject} from './utils/object';
import {observeGlobalVars} from './globalVar';
import type {IRootStore} from './store/root';
import {createObjectFromChain, extractObjectChain} from './utils';
import {IIRendererStore} from './store/index';

interface SchemaRendererProps
  extends Partial<Omit<RendererProps, 'statusStore'>>,
    StatusScopedProps {
  schema: Schema;
  $path: string;
  env: RendererEnv;
}

export const RENDERER_TRANSMISSION_OMIT_PROPS = [
  'type',
  'name',
  '$ref',
  'className',
  'style',
  'data',
  'originData',
  'children',
  'ref',
  'visible',
  'loading',
  'visibleOn',
  'hidden',
  'hiddenOn',
  'disabled',
  'disabledOn',
  'static',
  'staticOn',
  'component',
  'detectField',
  'defaultValue',
  'defaultData',
  'required',
  'requiredOn',
  'syncSuperStore',
  'mode',
  'body',
  'id',
  'inputOnly',
  'label',
  'renderLabel',
  'trackExpression',
  'editorSetting',
  'updatePristineAfterStoreDataReInit',
  'source'
];

const componentCache: SimpleMap = new SimpleMap();

export class SchemaRenderer extends React.Component<SchemaRendererProps, any> {
  static displayName: string = 'Renderer';
  static contextType = ScopedContext;

  rendererKey = '';
  renderer: RendererConfig | null;
  ref: any;
  cRef: any;

  schema: any;
  path: string;

  tmpData: any;

  toDispose: Array<() => any> = [];
  unbindEvent: (() => void) | undefined = undefined;
  unbindGlobalEvent: (() => void) | undefined = undefined;
  isStatic: any = undefined;

  subStore?: IIRendererStore | null;

  constructor(props: SchemaRendererProps) {
    super(props);

    this.refFn = this.refFn.bind(this);
    this.renderChild = this.renderChild.bind(this);
    this.reRender = this.reRender.bind(this);
    this.resolveRenderer(this.props);
    this.dispatchEvent = this.dispatchEvent.bind(this);
    this.storeRef = this.storeRef.bind(this);
    this.handleGlobalVarChange = this.handleGlobalVarChange.bind(this);

    const schema = props.schema;

    // 监听statusStore更新
    this.toDispose.push(
      reaction(
        () => {
          const id = filter(schema.id, props.data);
          const name = filter(schema.name, props.data);
          return `${
            props.statusStore.visibleState[id] ??
            props.statusStore.visibleState[name]
          }${
            props.statusStore.disableState[id] ??
            props.statusStore.disableState[name]
          }${
            props.statusStore.staticState[id] ??
            props.statusStore.staticState[name]
          }`;
        },
        () => this.forceUpdate()
      )
    );

    this.toDispose.push(
      observeGlobalVars(schema, props.topStore, this.handleGlobalVarChange)
    );
  }

  componentWillUnmount() {
    this.toDispose.forEach(fn => fn());
    this.toDispose = [];
    this.unbindEvent?.();
    this.unbindGlobalEvent?.();
  }

  // 限制：只有 schema 除外的 props 变化，或者 schema 里面的某个成员值发生变化才更新。
  shouldComponentUpdate(nextProps: SchemaRendererProps) {
    const props = this.props;
    const list: Array<string> = difference(Object.keys(nextProps), [
      'schema',
      'scope'
    ]);

    if (
      difference(Object.keys(props), ['schema', 'scope']).length !==
        list.length ||
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

  storeRef(store: IIRendererStore | null) {
    this.subStore = store;
  }

  handleGlobalVarChange() {
    const handler = this.renderer?.onGlobalVarChanged;
    const topStore: IRootStore = this.props.topStore;
    const chain = extractObjectChain(this.props.data).filter(
      (item: any) => !item.hasOwnProperty('__isTempGlobalLayer')
    );
    const globalLayerIdx = findLastIndex(
      chain,
      item =>
        item.hasOwnProperty('global') || item.hasOwnProperty('globalState')
    );

    const globalData = {
      global: topStore.nextGlobalData.global,
      globalState: topStore.nextGlobalData.globalState,
      // 兼容旧的全局变量
      __page: topStore.nextGlobalData.__page,
      appVariables: topStore.nextGlobalData.appVariables,
      __isTempGlobalLayer: true
    };

    if (globalLayerIdx !== -1) {
      chain.splice(globalLayerIdx + 1, 0, globalData);
    }
    const newData = createObjectFromChain(chain);

    // 如果渲染器自己做了实现，且返回 false，则不再继续往下执行
    if (handler?.(this.cRef, this.props.schema, newData) === false) {
      return;
    }

    // 强制刷新并通过一个临时对象让下发给组件的全局变量更新
    // 等 react 完成一轮渲染后，将临时渲染切成正式渲染
    // 也就是说删掉临时对象，后续渲染读取真正变更后的全局变量
    //

    // 为什么这么做？因为很多组件内部都会 diff  this.props.data 和 prevProps.data
    // 如果对应的数据没有发生变化，则会跳过组件状态的更新
    this.tmpData = newData;
    this.subStore?.temporaryUpdateGlobalVars(globalData);
    topStore.addSyncGlobalVarStatePendingTask(
      callback => this.forceUpdate(callback),
      () => {
        delete this.tmpData;
        this.subStore?.unDoTemporaryUpdateGlobalVars();
      }
    );
  }

  resolveRenderer(props: SchemaRendererProps, force = false): any {
    let schema = props.schema;
    let path = props.$path;

    if (schema && schema.$ref) {
      schema = {
        ...props.resolveDefinitions(schema.$ref),
        ...schema
      };

      path = path.replace(/(?!.*\/).*/, schema.type);
    }

    if (
      schema?.type &&
      (force ||
        !this.renderer ||
        this.rendererKey !== `${schema.type}-${schema.$$id}`)
    ) {
      const rendererResolver = props.env.rendererResolver || resolveRenderer;
      this.renderer = rendererResolver(path, schema, props);
      this.rendererKey = `${schema.type}-${schema.$$id}`;
    } else {
      // 自定义组件如果在节点设置了 label name 什么的，就用 formItem 包一层
      // 至少自动支持了 valdiations, label, description 等逻辑。
      if (schema.children && !schema.component && schema.asFormItem) {
        schema.component = PlaceholderComponent;
        schema.renderChildren = schema.children;
        delete schema.children;
      }

      if (
        schema.component &&
        !schema.component.wrapedAsFormItem &&
        schema.asFormItem
      ) {
        const cache = componentCache.get(schema.component);

        if (cache) {
          schema.component = cache;
        } else {
          const cache = asFormItem({
            strictMode: false,
            ...schema.asFormItem
          })(schema.component);
          componentCache.set(schema.component, cache);
          cache.wrapedAsFormItem = true;
          schema.component = cache;
        }
      }
    }

    return {path, schema};
  }

  getWrappedInstance() {
    return this.cRef;
  }

  refFn(ref: any) {
    this.ref = ref;
  }

  @autobind
  childRef(ref: any) {
    // todo 这里有个问题，就是注意以下的这段注释
    // > // 原来表单项的 visible: false 和 hidden: true 表单项的值和验证是有效的
    // > 而 visibleOn 和 hiddenOn 是无效的，
    // > 这个本来就是个bug，但是已经被广泛使用了
    // > 我只能继续实现这个bug了
    // 这样会让子组件去根据是 hidden 的情况去渲染个 null，这样会导致这里 ref 有值，但是 ref.getWrappedInstance() 为 null
    // 这样会和直接渲染的组件时有些区别，至少 cRef 的指向是不一样的
    while (ref?.getWrappedInstance?.()) {
      ref = ref.getWrappedInstance();
    }

    if (ref && !ref.props) {
      Object.defineProperty(ref, 'props', {
        get: () => this.props
      });
    }

    if (ref) {
      // 这里无法区分监听的是不是广播，所以又bind一下，主要是为了绑广播
      this.unbindEvent?.();
      this.unbindGlobalEvent?.();

      this.unbindEvent = bindEvent(ref);
      this.unbindGlobalEvent = bindGlobalEvent(ref);
    }
    this.cRef = ref;
  }

  dispatchEvent(
    e: React.MouseEvent<any>,
    data: any,
    renderer?: React.Component<RendererProps>, // for didmount
    scoped?: IScopedContext
  ): Promise<RendererEvent<any> | void> {
    return this.props.dispatchEvent(
      e,
      data,
      renderer || this.cRef,
      scoped || (this.context as IScopedContext)
    );
  }

  renderChild(
    region: string,
    node?: SchemaNode,
    subProps: {
      data?: object;
      [propName: string]: any;
    } = {}
  ) {
    let {schema: _, $path: __, env, render, ...rest} = this.props;
    let {path: $path} = this.resolveRenderer(this.props);

    const omitList = RENDERER_TRANSMISSION_OMIT_PROPS.concat();
    if (this.renderer) {
      const Component = this.renderer.component;
      Component?.propsList &&
        omitList.push.apply(omitList, Component.propsList as Array<string>);
    }

    return render!(`${$path}${region ? `/${region}` : ''}`, node || '', {
      ...omit(rest, omitList),
      defaultStatic:
        (this.renderer?.type &&
        ['drawer', 'dialog'].includes(this.renderer.type)
          ? false
          : undefined) ??
        this.isStatic ??
        (_.staticOn
          ? evalExpression(_.staticOn, rest.data)
          : _.static ?? rest.defaultStatic),
      ...subProps,
      data:
        this.tmpData && subProps.data === this.props.data
          ? this.tmpData
          : subProps.data || rest.data,
      env: env
    });
  }

  reRender() {
    this.resolveRenderer(this.props, true);
    this.forceUpdate();
  }

  render(): JSX.Element | null {
    let {
      $path: _,
      schema: __,
      rootStore,
      statusStore,
      render,
      ...rest
    } = this.props;

    if (__ == null) {
      return null;
    }

    let {path: $path, schema} = this.resolveRenderer(this.props);
    const theme = this.props.env.theme;

    if (Array.isArray(schema)) {
      return render!($path, schema as any, rest) as JSX.Element;
    }

    // 用于全局变量刷新
    (rest as any).data = this.tmpData || rest.data;

    const detectData =
      schema &&
      (schema.detectField === '&' ? rest : rest[schema.detectField || 'data']);
    let exprProps: any = detectData
      ? getExprProperties(schema, detectData, undefined, rest)
      : {};

    // 控制显隐
    const id = filter(schema.id, rest.data);
    const name = filter(schema.name, rest.data);
    const visible = isAlive(statusStore)
      ? statusStore.visibleState[id] ?? statusStore.visibleState[name]
      : undefined;
    const disable = isAlive(statusStore)
      ? statusStore.disableState[id] ?? statusStore.disableState[name]
      : undefined;
    const isStatic = isAlive(statusStore)
      ? statusStore.staticState[id] ?? statusStore.staticState[name]
      : undefined;
    this.isStatic = isStatic;

    if (
      visible === false ||
      (visible !== true &&
        exprProps &&
        (exprProps.hidden ||
          exprProps.visible === false ||
          schema.hidden ||
          schema.visible === false ||
          rest.hidden ||
          rest.visible === false))
    ) {
      (rest as any).invisible = true;
    }

    if (schema.children) {
      return rest.invisible
        ? null
        : React.isValidElement(schema.children)
        ? schema.children
        : typeof schema.children !== 'function'
        ? null
        : (schema.children as Function)({
            ...rest,
            ...exprProps,
            $path: $path,
            $schema: schema,
            render: this.renderChild,
            forwardedRef: this.refFn,
            rootStore,
            statusStore,
            dispatchEvent: this.dispatchEvent
          });
    } else if (schema.component && isValidElementType(schema.component)) {
      const isSFC = !(schema.component.prototype instanceof React.Component);
      const {
        data: defaultData,
        value: defaultValue, // render时的value改放defaultValue中
        activeKey: defaultActiveKey,
        key: propKey,
        ...restSchema
      } = schema;
      return rest.invisible
        ? null
        : React.createElement(schema.component as any, {
            ...rest,
            ...restSchema,
            ...exprProps,
            // value: defaultValue, // 备注: 此处并没有将value传递给渲染器
            defaultData,
            defaultValue,
            defaultActiveKey,
            propKey,
            $path: $path,
            $schema: schema,
            ref: isSFC ? undefined : this.refFn,
            forwardedRef: isSFC ? this.refFn : undefined,
            render: this.renderChild,
            rootStore,
            statusStore,
            dispatchEvent: this.dispatchEvent
          });
    } else if (Object.keys(schema).length === 0) {
      return null;
    } else if (!this.renderer) {
      return rest.invisible ? null : (
        <LazyComponent
          defaultVisible={true}
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
            return () => loadRendererError(schema, $path);
          }}
        />
      );
    } else if (this.renderer.getComponent && !this.renderer.component) {
      // 处理异步渲染器
      return rest.invisible ? null : (
        <LazyComponent
          defaultVisible={true}
          getComponent={async () => {
            await loadAsyncRenderer(this.renderer as RendererConfig);
            this.reRender();
            return () => null;
          }}
        />
      );
    }

    const renderer = this.renderer as RendererConfig;
    schema = filterSchema(schema, renderer, rest);
    const {
      data: defaultData,
      value: defaultValue,
      activeKey: defaultActiveKey,
      key: propKey,
      ...restSchema
    } = schema;
    const Component = renderer.component!;

    let animationShow = true;

    // 原来表单项的 visible: false 和 hidden: true 表单项的值和验证是有效的
    // 而 visibleOn 和 hiddenOn 是无效的，
    // 这个本来就是个bug，但是已经被广泛使用了
    // 我只能继续实现这个bug了
    if (
      rest.invisible &&
      (exprProps.hidden ||
        exprProps.visible === false ||
        !renderer.isFormItem ||
        (schema.visible !== false && !schema.hidden))
    ) {
      if (schema.animations) {
        animationShow = false;
      } else {
        return null;
      }
    }

    // withStore 里面会处理，而且会实时处理
    // 这里处理反而导致了问题
    if (renderer.storeType) {
      exprProps = {};
    }

    const supportRef =
      Component.prototype?.isReactComponent ||
      (Component as any).$$typeof === Symbol.for('react.forward_ref');
    let props: any = {
      ...renderer.defaultProps?.(schema.type, schema),
      ...theme.getRendererConfig(renderer.name),
      ...restSchema,
      ...chainEvents(rest, restSchema),
      ...exprProps,
      // value: defaultValue, // 备注: 此处并没有将value传递给渲染器
      defaultData: restSchema.defaultData ?? defaultData,
      defaultValue: restSchema.defaultValue ?? defaultValue,
      defaultActiveKey: defaultActiveKey,
      propKey: propKey,
      $path: $path,
      $schema: schema,
      render: this.renderChild,
      rootStore,
      statusStore,
      dispatchEvent: this.dispatchEvent,
      mobileUI: schema.useMobileUI === false ? false : rest.mobileUI
    };

    // style 支持公式
    if (schema.style) {
      (props as any).style = mergeStyle(
        (props as any).style,
        buildStyle(schema.style, detectData)
      );
    }

    if (disable !== undefined) {
      (props as any).disabled = disable;
    }

    if (isStatic !== undefined) {
      (props as any).static = isStatic;
    }

    // 优先使用组件自己的testid或者id，这个解决不了table行内的一些子元素
    // 每一行都会出现这个testid的元素，只在测试工具中直接使用nth拿序号
    if (rest.env.enableTestid) {
      if (props.testid || props.id || props.testIdBuilder == null) {
        if (!(props.testIdBuilder instanceof TestIdBuilder)) {
          props.testIdBuilder = new TestIdBuilder(props.testid || props.id);
        }
      }
    }

    // 自动解析变量模式，主要是方便直接引入第三方组件库，无需为了支持变量封装一层
    if (renderer.autoVar) {
      for (const key of Object.keys(schema)) {
        if (typeof props[key] === 'string' && isExpression(props[key])) {
          props[key] = resolveVariableAndFilter(
            props[key],
            props.data,
            '| raw'
          );
        }
      }
    }

    let component = supportRef ? (
      <Component {...props} ref={this.childRef} storeRef={this.storeRef} />
    ) : (
      <Component
        {...props}
        forwardedRef={this.childRef}
        storeRef={this.storeRef}
      />
    );

    if (schema.animations) {
      component = (
        <Animations
          schema={schema}
          component={component}
          show={animationShow}
        />
      );
    }

    return this.props.env.enableAMISDebug ? (
      <DebugWrapper renderer={renderer}>{component}</DebugWrapper>
    ) : (
      component
    );
  }
}

class PlaceholderComponent extends React.Component {
  childRef = React.createRef<any>();

  getWrappedInstance() {
    return this.childRef.current;
  }

  render() {
    const {renderChildren, ...rest} = this.props as any;

    if (typeof renderChildren === 'function') {
      return renderChildren({
        ...rest,
        ref: this.childRef
      });
    }

    return null;
  }
}
