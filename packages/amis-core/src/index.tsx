/** @license amis v@version
 *
 * Copyright Baidu
 *
 * This source code is licensed under the Apache license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  Renderer,
  getRendererByName,
  getRenderers,
  loadAllAsyncRenderers,
  loadAsyncRenderersByType,
  loadAsyncRenderer,
  registerRenderer,
  unRegisterRenderer,
  resolveRenderer,
  filterSchema,
  clearStoresCache,
  updateEnv,
  stores,
  defaultOptions,
  addSchemaFilter,
  extendDefaultEnv,
  getGlobalOptions,
  setGlobalOptions
} from './factory';
import type {
  RenderOptions,
  RendererConfig,
  RendererProps,
  hasAsyncRenderers
} from './factory';
import './polyfills';
import './renderers/builtin';
import './renderers/register';
export * from './utils/index';
export * from './utils/animations';
export * from './types';
export * from './store';
export * from './globalVar';
import * as utils from './utils/helper';
import './globalVarClientHandler';
import './globalVarDefaultValueHandler';
import {getEnv} from 'mobx-state-tree';

import {RegisterStore, registerStore, RendererStore} from './store';
import type {IColumn, IColumn2, IRow, IRow2} from './store';
import {
  setDefaultLocale,
  getDefaultLocale,
  makeTranslator,
  register as registerLocale,
  extendLocale,
  removeLocaleData,
  localeable,
  format as localeFormatter
} from './locale';
import type {LocaleProps, TranslateFn} from './locale';

import Scoped, {ScopedContext, filterTarget, splitTarget} from './Scoped';
import type {ScopedComponentType, IScopedContext} from './Scoped';

import {
  classnames,
  getClassPrefix,
  setDefaultTheme,
  theme,
  getTheme,
  themeable,
  makeClassnames
} from './theme';
import type {ClassNamesFn, ThemeProps} from './theme';
const classPrefix = getClassPrefix();

export * from './actions';
import FormItem, {
  FormItemWrap,
  registerFormItem,
  getFormItemByName
} from './renderers/Item';
import type {
  FormBaseControl,
  FormControlProps,
  FormItemProps
} from './renderers/Item';
import {
  OptionsControl,
  registerOptionsControl,
  OptionsControlBase
} from './renderers/Options';
import type {OptionsControlProps} from './renderers/Options';
import type {FormOptionsControl} from './renderers/Options';
import {Schema} from './types';
import ScopedRootRenderer, {addRootWrapper, RootRenderProps} from './Root';
import {envOverwrite} from './envOverwrite';
import {EnvContext} from './env';
import type {RendererEnv} from './env';
import React from 'react';
import {
  evaluate,
  evaluateForAsync,
  Evaluator,
  AsyncEvaluator,
  extendsFilters,
  filters,
  getFilters,
  lexer,
  parse,
  registerFilter,
  registerFunction
} from 'amis-formula';
import type {FilterContext} from 'amis-formula';
import LazyComponent from './components/LazyComponent';
import Overlay from './components/Overlay';
import PopOver from './components/PopOver';
import ErrorBoundary from './components/ErrorBoundary';
import {FormRenderer} from './renderers/Form';
import type {FormHorizontal, FormSchemaBase} from './renderers/Form';
import {
  enableDebug,
  disableDebug,
  promisify,
  replaceText,
  wrapFetcher,
  resolveVariableAndFilter,
  resolveVariableAndFilterForAsync
} from './utils/index';
import type {OnEventProps} from './utils/index';
import {valueMap as styleMap} from './utils/style-helper';
import {
  RENDERER_TRANSMISSION_OMIT_PROPS,
  SchemaRenderer
} from './SchemaRenderer';
import type {IItem} from './store/list';
import CustomStyle from './components/CustomStyle';
import {StatusScoped} from './StatusScoped';

import styleManager from './StyleManager';

import {bindGlobalEvent, dispatchGlobalEvent} from './utils/renderer-event';

import {getCustomVendor, registerCustomVendor} from './utils/icon';

// @ts-ignore
export const version = '__buildVersion';
(window as any).amisVersionInfo = {
  version: '__buildVersion',
  buildTime: '__buildTime'
};

export {
  styleManager,
  clearStoresCache,
  updateEnv,
  Renderer,
  RendererProps,
  RenderOptions,
  RendererEnv,
  EnvContext,
  RegisterStore,
  registerStore,
  FormItem,
  FormItemWrap,
  FormItemProps,
  OptionsControl,
  FormRenderer,
  FormHorizontal,
  // 其他功能类方法
  utils,
  getRendererByName,
  registerRenderer,
  unRegisterRenderer,
  getRenderers,
  loadAllAsyncRenderers,
  loadAsyncRenderersByType,
  loadAsyncRenderer,
  hasAsyncRenderers,
  registerFormItem,
  getFormItemByName,
  registerOptionsControl,
  resolveRenderer,
  filterSchema,
  Scoped,
  ScopedContext,
  IScopedContext,
  StatusScoped,
  setDefaultTheme,
  theme,
  themeable,
  ThemeProps,
  getTheme,
  classPrefix,
  getClassPrefix,
  classnames,
  makeClassnames,
  // 全局广播事件
  bindGlobalEvent,
  dispatchGlobalEvent,
  // 多语言相关
  getDefaultLocale,
  setDefaultLocale,
  registerLocale,
  makeTranslator,
  extendLocale,
  removeLocaleData,
  localeable,
  localeFormatter,
  LocaleProps,
  TranslateFn,
  ClassNamesFn,
  // amis-formula 相关
  parse,
  lexer,
  Evaluator,
  AsyncEvaluator,
  FilterContext,
  filters,
  getFilters,
  registerFilter,
  extendsFilters,
  registerFunction,
  evaluate,
  evaluateForAsync,
  // 其他
  LazyComponent,
  Overlay,
  PopOver,
  ErrorBoundary,
  addSchemaFilter,
  OptionsControlProps,
  OptionsControlBase,
  FormOptionsControl,
  FormControlProps,
  FormBaseControl,
  extendDefaultEnv,
  addRootWrapper,
  RendererConfig,
  styleMap,
  RENDERER_TRANSMISSION_OMIT_PROPS,
  ScopedComponentType,
  IItem,
  IColumn,
  IRow,
  IColumn2,
  IRow2,
  OnEventProps,
  FormSchemaBase,
  filterTarget,
  splitTarget,
  CustomStyle,
  enableDebug,
  disableDebug,
  envOverwrite,
  getGlobalOptions,
  setGlobalOptions,
  wrapFetcher,
  SchemaRenderer,
  getCustomVendor,
  registerCustomVendor,
  resolveVariableAndFilter,
  resolveVariableAndFilterForAsync
};

export function render(
  schema: Schema,
  {key, ...props}: RootRenderProps = {},
  options: RenderOptions = {},
  pathPrefix: string = ''
): JSX.Element {
  return (
    <AMISRenderer
      {...props}
      key={key}
      schema={schema}
      pathPrefix={pathPrefix}
      options={options}
    />
  );
}

function AMISRenderer({
  schema,
  options,
  pathPrefix,
  ...props
}: RootRenderProps & {
  schema: Schema;
  options: RenderOptions;
  pathPrefix: string;
}) {
  let locale = props.locale || getDefaultLocale();
  // 兼容 locale 的不同写法
  locale =
    locale === 'en'
      ? 'en-US'
      : locale === 'zh' || locale === 'cn'
      ? 'zh-CN'
      : locale.replace('_', '-');

  const translate = React.useCallback(
    function () {
      const fn = props.translate || makeTranslator(locale);
      return fn.apply(null, arguments);
    },
    [locale, props.translate]
  );
  const store = React.useMemo(() => {
    let store = stores[options.session || 'global'];

    if (!store) {
      options = {
        ...defaultOptions,
        ...options,
        fetcher: options.fetcher
          ? wrapFetcher(options.fetcher, options.tracker)
          : defaultOptions.fetcher,
        confirm: promisify(
          options.confirm || defaultOptions.confirm || window.confirm
        ),
        locale,
        translate
      } as any;

      store = RendererStore.create({}, options);
      stores[options.session || 'global'] = store;
    } else {
      // 更新 env
      const env = getEnv(store);
      Object.assign(env, {
        ...options,
        fetcher: options.fetcher
          ? wrapFetcher(options.fetcher, options.tracker)
          : env.fetcher,
        confirm: options.confirm ? promisify(options.confirm) : env.confirm,
        locale,
        translate
      });
    }

    (window as any).amisStore = store; // 为了方便 debug.
    return store;
  }, Object.keys(options).concat(Object.values(options)).concat(locale));

  const env = getEnv(store);
  let theme = props.theme || options.theme || 'cxd';
  if (theme === 'default') {
    theme = 'cxd';
  }
  env.theme = getTheme(theme);

  React.useEffect(() => {
    env.enableAMISDebug ? enableDebug() : disableDebug();
    return () => env.enableAMISDebug || disableDebug();
  }, [env.enableAMISDebug]);

  if (props.locale !== undefined) {
    env.translate = translate;
    env.locale = locale;
  }

  // 默认将开启移动端原生 UI
  if (options.useMobileUI !== false) {
    props.mobileUI = env.isMobile();
  }

  // 根据环境覆盖 schema，这个要在最前面做，不然就无法覆盖 validations
  schema = React.useMemo(() => {
    schema = envOverwrite(schema, locale, env.isMobile() ? 'mobile' : 'pc');
    // todo 和 envOverwrite 一起处理，减少循环次数
    schema = replaceText(
      schema,
      options.replaceText,
      env.replaceTextIgnoreKeys
    );
    return schema;
  }, [schema, locale, options.replaceText]);

  return (
    <EnvContext.Provider value={env}>
      <ScopedRootRenderer
        {...props}
        schema={schema}
        pathPrefix={pathPrefix}
        rootStore={store}
        env={env}
        theme={theme}
        locale={locale}
        translate={translate}
      />
    </EnvContext.Provider>
  );
}
