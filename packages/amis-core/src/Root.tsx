import isPlainObject from 'lodash/isPlainObject';
import React from 'react';
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

export interface RootRenderProps {
  location?: Location;
  theme?: string;
  [propName: string]: any;
}

export interface RootProps {
  schema: SchemaNode;
  rootStore: IRendererStore;
  env: RendererEnv;
  theme: string;
  pathPrefix?: string;
  locale?: string;
  translate?: TranslateFn;
  [propName: string]: any;
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
              env={env}
              classnames={theme.classnames}
              classPrefix={theme.classPrefix}
              locale={locale}
              translate={translate}
            />
          </LocaleContext.Provider>
        </ThemeContext.Provider>
      </RootStoreContext.Provider>
    );
  }
}

export interface renderChildProps extends Partial<RendererProps> {
  env: RendererEnv;
}
export type ReactElement = React.ReactNode[] | JSX.Element | null | false;

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

  return (
    <SchemaRenderer
      render={renderChild as any}
      {...props}
      schema={schema}
      propKey={schema.key}
      $path={`${prefix ? `${prefix}/` : ''}${(schema && schema.type) || ''}`}
    />
  );
}

export default Scoped(Root);
