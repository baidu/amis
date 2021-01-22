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
import {renderChild, renderChildren} from './Root';
import {Schema, SchemaNode} from './types';
import {anyChanged, chainEvents} from './utils/helper';

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
  'required',
  'requiredOn',
  'syncSuperStore'
];

export class SchemaRenderer extends React.Component<SchemaRendererProps, any> {
  static displayName: string = 'Renderer';

  renderer: RendererConfig | null;
  ref: any;
  schema: any;
  path: string;

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
      props.schema &&
      nextProps.schema &&
      (props.schema.type !== nextProps.schema.type ||
        props.schema.$$id !== nextProps.schema.$$id)
    ) {
      this.resolveRenderer(nextProps);
    }
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

  resolveRenderer(props: SchemaRendererProps, skipResolve = false): any {
    let schema = props.schema;
    let path = props.$path;

    if (schema && schema.$ref) {
      schema = {
        ...props.resolveDefinitions(schema.$ref),
        ...schema
      };

      path = path.replace(/(?!.*\/).*/, schema.type);
    }

    if (!skipResolve) {
      const rendererResolver = props.env.rendererResolver || resolveRenderer;
      this.renderer = rendererResolver(path, schema, props);
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
    let {schema, $path, env, ...rest} = this.props;

    if (schema && schema.$ref) {
      const result = this.resolveRenderer(this.props, true);
      schema = result.schema;
      $path = result.path;
    }

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

    if (schema === null) {
      return null;
    }

    if (schema.$ref) {
      const result = this.resolveRenderer(this.props, true);
      schema = result.schema;
      $path = result.path;
    }

    const theme = this.props.env.theme;

    if (Array.isArray(schema)) {
      return renderChildren($path, schema as any, rest) as JSX.Element;
    } else if (schema.children) {
      return React.isValidElement(schema.children)
        ? schema.children
        : (schema.children as Function)({
            ...rest,
            $path: $path,
            render: this.renderChild,
            forwardedRef: this.refFn
          });
    } else if (typeof schema.component === 'function') {
      const isSFC = !(schema.component.prototype instanceof React.Component);
      return React.createElement(schema.component as any, {
        ...rest,
        ...schema,
        $path: $path,
        ref: isSFC ? undefined : this.refFn,
        forwardedRef: isSFC ? this.refFn : undefined,
        render: this.renderChild
      });
    } else if (Object.keys(schema).length === 0) {
      return null;
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
        {...chainEvents(rest, restSchema)}
        defaultData={defaultData}
        $path={$path}
        ref={this.refFn}
        render={this.renderChild}
      />
    );
  }
}
