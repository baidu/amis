import React from 'react';
import isPlainObject from 'lodash/isPlainObject';
import {RendererEnv} from './env';
import {RendererProps} from './factory';
import {LocaleContext, TranslateFn} from './locale';
import {RootRenderer} from './RootRenderer';
import {SchemaRenderer} from './SchemaRenderer';
import Scoped from './Scoped';
import {IRendererStore} from './store';
import {ThemeContext} from './theme';
import {Schema, SchemaNode} from './types';
import {autobind, isEmpty} from './utils/helper';
import {RootStoreContext} from './WithRootStore';
import {
  StatusScoped,
  StatusScopedWrapper,
  StatusScopedProps
} from './StatusScoped';
import {GlobalVariableItem} from './globalVar';

export interface RootRenderProps {
  globalVars?: Array<GlobalVariableItem>;
  location?: Location;
  theme?: string;
  data?: Record<string, any>;
  context?: Record<string, any>;
  locale?: string;
  [propName: string]: any;
}

export interface RootProps extends StatusScopedProps {
  schema: SchemaNode;
  rootStore: IRendererStore;
  env: RendererEnv;
  theme: string;
  pathPrefix?: string;
  locale?: string;
  translate?: TranslateFn;
  [propName: string]: any;
}

export interface RootWrapperProps {
  env: RendererEnv;
  children: React.ReactNode | Array<React.ReactNode>;
  schema: SchemaNode;
  rootStore: IRendererStore;
  theme: string;
  data?: Record<string, any>;
  context?: Record<string, any>;
  [propName: string]: any;
}

const rootWrappers: Array<(props: RootWrapperProps) => React.ReactNode> = [];

export function addRootWrapper(
  fn: (props: RootWrapperProps) => React.ReactNode
) {
  rootWrappers.push(fn);
}

export class Root extends React.Component<RootProps> {
  @autobind
  resolveDefinitions(name: string) {
    const definitions = (this.props.schema as Schema).definitions;
    if (!name || isEmpty(definitions)) {
      return {};
    }
    return definitions && definitions[name];
  }

  render() {
    const {
      schema,
      rootStore,
      env,
      pathPrefix,
      location,
      data,
      context,
      locale,
      translate,
      ...rest
    } = this.props;
    const theme = env.theme;
    let themeName = this.props.theme || 'cxd';

    if (themeName === 'default') {
      themeName = 'cxd';
    }

    return (
      <RootStoreContext.Provider value={rootStore}>
        <ThemeContext.Provider value={themeName}>
          <LocaleContext.Provider value={this.props.locale!}>
            {
              rootWrappers.reduce(
                (props: RootWrapperProps, wrapper) => {
                  return {
                    ...props,
                    children: wrapper(props)
                  };
                },
                {
                  pathPrefix: pathPrefix || '',
                  schema: isPlainObject(schema)
                    ? {
                        type: 'page',
                        ...(schema as any)
                      }
                    : schema,
                  ...rest,
                  render: renderChild,
                  rootStore: rootStore,
                  resolveDefinitions: this.resolveDefinitions,
                  location: location,
                  data,
                  env: env,
                  classnames: theme.classnames,
                  classPrefix: theme.classPrefix,
                  locale: locale,
                  translate: translate,
                  children: (
                    <RootRenderer
                      pathPrefix={pathPrefix || ''}
                      schema={
                        isPlainObject(schema)
                          ? {
                              type: 'page',
                              ...(schema as any)
                            }
                          : schema
                      }
                      {...rest}
                      render={renderChild}
                      rootStore={rootStore}
                      resolveDefinitions={this.resolveDefinitions}
                      location={location}
                      data={data}
                      context={context}
                      env={env}
                      classnames={theme.classnames}
                      classPrefix={theme.classPrefix}
                      locale={locale}
                      translate={translate}
                    />
                  )
                } as RootWrapperProps
              ).children
            }
          </LocaleContext.Provider>
        </ThemeContext.Provider>
      </RootStoreContext.Provider>
    );
  }
}

export interface renderChildProps
  extends Partial<Omit<RendererProps, 'statusStore'>>,
    StatusScopedProps {
  env: RendererEnv;
}
export type ReactElement = React.ReactNode[] | JSX.Element | null | false;

export function renderChildren(
  prefix: string,
  node: SchemaNode,
  props: renderChildProps
): ReactElement {
  if (Array.isArray(node)) {
    var elemKey = props.key || props.propKey || props.id || '';

    return node.map((node, index) =>
      renderChild(`${prefix}/${index}`, node, {
        ...props,
        key: `${elemKey ? `${elemKey}-` : ''}${index}`
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

  if (typeofnode === 'undefined' || node === null) {
    return null;
  } else if (React.isValidElement(node)) {
    return node;
  }

  let schema: Schema =
    typeofnode === 'string' || typeofnode === 'number'
      ? {type: 'tpl', tpl: String(node)}
      : (node as Schema);

  const transform = props.propsTransform;

  if (transform) {
    props = {...props};
    delete props.propsTransform;

    props = transform(props);
  }

  const Comp = props.env.SchemaRenderer || SchemaRenderer;

  if (
    ['dialog', 'drawer'].includes(schema?.type) &&
    !schema?.component &&
    !schema?.children
  ) {
    // 因为状态判断实在 SchemaRenderer 里面判断的
    // 找渲染器也是在那，所以没办法在之前根据渲染器信息来包裹个组件下发 statusStore
    // 所以这里先根据 type 来处理一下
    // 等后续把状态处理再抽一层，可以把此处放到 SchemaRenderer 里面去
    return (
      <StatusScopedWrapper>
        {({statusStore}) => (
          <Comp
            render={renderChild as any}
            {...props}
            key={props.key ?? schema.key}
            schema={schema}
            propKey={schema.key}
            $path={`${prefix ? `${prefix}/` : ''}${
              (schema && schema.type) || ''
            }`}
            statusStore={statusStore}
          />
        )}
      </StatusScopedWrapper>
    );
  }

  return (
    <Comp
      render={renderChild as any}
      {...props}
      key={props.key ?? schema.key}
      schema={schema}
      propKey={schema.key}
      $path={`${prefix ? `${prefix}/` : ''}${(schema && schema.type) || ''}`}
    />
  );
}

export default StatusScoped(Scoped(Root));
