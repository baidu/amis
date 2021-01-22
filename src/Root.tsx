import isPlainObject from 'lodash/isPlainObject';
import qs from 'qs';
import React from 'react';
import Alert from './components/Alert2';
import ImageGallery from './components/ImageGallery';
import {envOverwrite} from './envOverwrite';
import {RendererEnv, RendererProps} from './factory';
import {LocaleContext, TranslateFn} from './locale';
import {SchemaRenderer} from './SchemaRenderer';
import Scoped from './Scoped';
import {IRendererStore} from './store';
import {ThemeContext} from './theme';
import {Schema, SchemaNode} from './types';
import getExprProperties from './utils/filter-schema';
import {autobind, createObject, isEmpty} from './utils/helper';
import {RootStoreContext} from './WithRootStore';

export interface RootRenderProps {
  location?: Location;
  theme?: string;
  [propName: string]: any;
}

export interface RootRendererProps {
  schema: SchemaNode;
  rootStore: IRendererStore;
  env: RendererEnv;
  theme: string;
  pathPrefix?: string;
  locale?: string;
  translate?: TranslateFn;
  [propName: string]: any;
}

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
      locale,
      translate,
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
            __query: query
          },
          data
        )
      : data;

    // 根据环境覆盖 schema，这个要在最前面做，不然就无法覆盖 validations
    envOverwrite(schema, locale);

    return (
      <RootStoreContext.Provider value={rootStore}>
        <ThemeContext.Provider value={this.props.theme || 'default'}>
          <LocaleContext.Provider value={this.props.locale!}>
            <ImageGallery modalContainer={env.getModalContainer}>
              {
                renderChild(
                  pathPrefix || '',
                  isPlainObject(schema)
                    ? {
                        type: 'page',
                        ...(schema as any)
                      }
                    : schema,
                  {
                    ...rest,
                    resolveDefinitions: this.resolveDefinitions,
                    location: location,
                    data: finalData,
                    env,
                    classnames: theme.classnames,
                    classPrefix: theme.classPrefix,
                    locale,
                    translate
                  }
                ) as JSX.Element
              }
            </ImageGallery>
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
  let schema: Schema =
    typeofnode === 'string' || typeofnode === 'number'
      ? {type: 'tpl', tpl: String(node)}
      : (node as Schema);
  const detectData =
    schema &&
    (schema.detectField === '&' ? props : props[schema.detectField || 'data']);
  const exprProps = detectData
    ? getExprProperties(schema, detectData, undefined, props)
    : null;

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
    // @ts-ignore
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
export default Scoped(RootRenderer);
