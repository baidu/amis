import difference from 'lodash/difference';
import omit from 'lodash/omit';
import React from 'react';
import LazyComponent from './components/LazyComponent';
import {
  filterSchema,
  loadRenderer,
  RendererConfig,
  RendererEnv,
  RendererProps,
  resolveRenderer
} from './factory';
import {asFormItem} from './renderers/Form/Item';
import {renderChild, renderChildren} from './Root';
import {Schema, SchemaNode} from './types';
import getExprProperties from './utils/filter-schema';
import {anyChanged, chainEvents} from './utils/helper';
import {SimpleMap} from './utils/SimpleMap';

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

  rendererKey = '';
  renderer: RendererConfig | null;
  ref: any;

  schema: any;
  path: string;

  constructor(props: SchemaRendererProps) {
    super(props);
    this.refFn = this.refFn.bind(this);
    this.renderChild = this.renderChild.bind(this);
    this.reRender = this.reRender.bind(this);
    this.resolveRenderer(this.props);
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
    let {$path: _, schema: __, ...rest} = this.props;

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

    if (
      exprProps &&
      (exprProps.hidden ||
        exprProps.visible === false ||
        schema.hidden ||
        schema.visible === false ||
        rest.hidden ||
        rest.visible === false)
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

    return (
      <Component
        {...theme.getRendererConfig(renderer.name)}
        {...restSchema}
        {...chainEvents(rest, restSchema)}
        {...exprProps}
        defaultData={restSchema.defaultData ?? defaultData}
        defaultValue={restSchema.defaultValue ?? defaultValue}
        defaultActiveKey={defaultActiveKey}
        $path={$path}
        $schema={{...schema, ...exprProps}}
        ref={this.refFn}
        render={this.renderChild}
      />
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
