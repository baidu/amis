import difference from 'lodash/difference';
import omit from 'lodash/omit';
import React from 'react';
import LazyComponent from './components/LazyComponent';
import {
  filterSchema,
  loadRenderer,
  RendererComponent,
  RendererConfig,
  RendererEnv,
  RendererProps,
  resolveRenderer
} from './factory';
import {asFormItem} from './renderers/Form/Item';
import {renderChild, renderChildren} from './Root';
import {ScopedContext} from './Scoped';
import {Schema, SchemaNode} from './types';
import {DebugWrapper} from './utils/debug';
import getExprProperties from './utils/filter-schema';
import {anyChanged, chainEvents, autobind} from './utils/helper';
import {SimpleMap} from './utils/SimpleMap';

import {bindEvent, dispatchEvent, RendererEvent} from './utils/renderer-event';
import {isAlive} from 'mobx-state-tree';
import {reaction} from 'mobx';
import {resolveVariableAndFilter} from './utils/tpl-builtin';

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
  'detectField',
  'defaultValue',
  'defaultData',
  'required',
  'requiredOn',
  'syncSuperStore',
  'mode',
  'body'
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

  reaction: any;
  unbindEvent: (() => void) | undefined = undefined;

  constructor(props: SchemaRendererProps) {
    super(props);
    this.refFn = this.refFn.bind(this);
    this.renderChild = this.renderChild.bind(this);
    this.reRender = this.reRender.bind(this);
    this.resolveRenderer(this.props);

    this.dispatchEvent = this.dispatchEvent.bind(this);

    // 监听rootStore更新
    this.reaction = reaction(
      () =>
        `${props.rootStore.visibleState[props.schema.id || props.$path]}${
          props.rootStore.disableState[props.schema.id || props.$path]
        }`,
      () => this.forceUpdate()
    );
  }

  componentDidMount() {
    // 这里无法区分监听的是不是广播，所以又bind一下，主要是为了绑广播
    this.unbindEvent = bindEvent(this.cRef);
  }

  componentWillUnmount() {
    this.reaction?.();
    this.unbindEvent?.();
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
    while (ref && ref.getWrappedInstance) {
      ref = ref.getWrappedInstance();
    }

    this.cRef = ref;
  }

  async dispatchEvent(
    e: React.MouseEvent<any>,
    data: any
  ): Promise<RendererEvent<any> | void> {
    return await dispatchEvent(e, this.cRef, this.context, data);
  }

  renderChild(
    region: string,
    node?: SchemaNode,
    subProps: {
      data?: object;
      [propName: string]: any;
    } = {}
  ) {
    let {schema: _, $path: __, env, ...rest} = this.props;
    let {path: $path} = this.resolveRenderer(this.props);

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
    this.resolveRenderer(this.props, true);
    this.forceUpdate();
  }

  render(): JSX.Element | null {
    let {$path: _, schema: __, rootStore, ...rest} = this.props;

    if (__ == null) {
      return null;
    }

    let {path: $path, schema} = this.resolveRenderer(this.props);
    const theme = this.props.env.theme;

    if (Array.isArray(schema)) {
      return renderChildren($path, schema as any, rest) as JSX.Element;
    }

    const detectData =
      schema &&
      (schema.detectField === '&' ? rest : rest[schema.detectField || 'data']);
    const exprProps: any = detectData
      ? getExprProperties(schema, detectData, undefined, rest)
      : {};

    // 控制显隐
    const visible = isAlive(rootStore)
      ? rootStore.visibleState[schema.id || $path]
      : undefined;
    const disable = isAlive(rootStore)
      ? rootStore.disableState[schema.id || $path]
      : undefined;

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
        : (schema.children as Function)({
            ...rest,
            ...exprProps,
            $path: $path,
            $schema: schema,
            render: this.renderChild,
            forwardedRef: this.refFn
          });
    } else if (typeof schema.component === 'function') {
      const isSFC = !(schema.component.prototype instanceof React.Component);
      const {
        data: defaultData,
        value: defaultValue,
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
            defaultData,
            defaultValue,
            defaultActiveKey,
            propKey,
            $path: $path,
            $schema: schema,
            ref: isSFC ? undefined : this.refFn,
            forwardedRef: isSFC ? this.refFn : undefined,
            render: this.renderChild
          });
    } else if (Object.keys(schema).length === 0) {
      return null;
    } else if (!this.renderer) {
      return rest.invisible ? null : (
        <LazyComponent
          {...rest}
          {...exprProps}
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
          $schema={schema}
          retry={this.reRender}
        />
      );
    }

    const renderer = this.renderer as RendererConfig;
    schema = filterSchema(schema, renderer, rest);
    const {
      data: defaultData,
      value: defaultValue,
      key: propKey,
      activeKey: defaultActiveKey,
      ...restSchema
    } = schema;
    const Component = renderer.component;

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
      return null;
    }

    const isClassComponent = Component.prototype?.isReactComponent;
    const $schema = {...schema, ...exprProps};
    let props = {
      ...theme.getRendererConfig(renderer.name),
      ...restSchema,
      ...chainEvents(rest, restSchema),
      ...exprProps,
      defaultData: restSchema.defaultData ?? defaultData,
      defaultValue: restSchema.defaultValue ?? defaultValue,
      defaultActiveKey: defaultActiveKey,
      propKey: propKey,
      $path: $path,
      $schema: $schema,
      ref: this.refFn,
      render: this.renderChild,
      rootStore: rootStore,
      dispatchEvent: this.dispatchEvent
    };

    if (disable !== undefined) {
      props.disabled = disable;
    }

    // 自动解析变量模式，主要是方便直接引入第三方组件库，无需为了支持变量封装一层
    if (renderer.autoVar) {
      for (const key of Object.keys($schema)) {
        if (typeof props[key] === 'string') {
          props[key] = resolveVariableAndFilter(
            props[key],
            props.data,
            '| raw'
          );
        }
      }
    }

    const component = isClassComponent ? (
      <Component {...props} ref={this.childRef} />
    ) : (
      <Component {...props} />
    );

    return this.props.env.enableAMISDebug ? (
      <DebugWrapper renderer={renderer}>{component}</DebugWrapper>
    ) : (
      component
    );
  }
}

class PlaceholderComponent extends React.Component {
  render() {
    const {renderChildren, ...rest} = this.props as any;

    if (typeof renderChildren === 'function') {
      return renderChildren(rest);
    }

    return null;
  }
}
