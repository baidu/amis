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
  registerRenderer,
  unRegisterRenderer,
  resolveRenderer,
  filterSchema,
  clearStoresCache,
  updateEnv,
  RenderOptions,
  stores,
  defaultOptions,
  addSchemaFilter,
  RendererProps,
  extendDefaultEnv,
  RendererConfig
} from './factory';
import './renderers/builtin';
export * from './utils/index';
export * from './types';
export * from './store';
import * as utils from './utils/helper';
import {getEnv} from 'mobx-state-tree';

import {RegisterStore, RendererStore} from './store';
import {
  setDefaultLocale,
  getDefaultLocale,
  makeTranslator,
  register as registerLocale,
  extendLocale,
  localeable,
  LocaleProps,
  TranslateFn
} from './locale';

import Scoped, {IScopedContext, ScopedContext} from './Scoped';

import {
  classnames,
  getClassPrefix,
  setDefaultTheme,
  theme,
  getTheme,
  ThemeProps,
  themeable,
  ClassNamesFn,
  makeClassnames
} from './theme';
const classPrefix = getClassPrefix();

export * from './actions';
import FormItem, {
  FormBaseControl,
  FormControlProps,
  FormItemWrap,
  FormItemProps,
  registerFormItem
} from './renderers/Item';
import {
  FormOptionsControl,
  OptionsControl,
  OptionsControlProps,
  registerOptionsControl
} from './renderers/Options';
import {Schema} from './types';
import ScopedRootRenderer, {addRootWrapper, RootRenderProps} from './Root';
import {envOverwrite} from './envOverwrite';
import {EnvContext, RendererEnv} from './env';
import React from 'react';
import {
  evaluate,
  Evaluator,
  extendsFilters,
  FilterContext,
  filters,
  getFilters,
  lexer,
  parse,
  registerFilter
} from 'amis-formula';
import LazyComponent from './components/LazyComponent';
import {FormHorizontal, FormRenderer} from './renderers/Form';
import {enableDebug, promisify, replaceText, wrapFetcher} from './utils/index';

export {
  clearStoresCache,
  updateEnv,
  Renderer,
  RendererProps,
  RenderOptions,
  RendererEnv,
  EnvContext,
  RegisterStore,
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
  registerFormItem,
  registerOptionsControl,
  resolveRenderer,
  filterSchema,
  Scoped,
  ScopedContext,
  IScopedContext,
  setDefaultTheme,
  theme,
  themeable,
  ThemeProps,
  getTheme,
  classPrefix,
  getClassPrefix,
  classnames,
  makeClassnames,
  // 多语言相关
  getDefaultLocale,
  setDefaultLocale,
  registerLocale,
  makeTranslator,
  extendLocale,
  localeable,
  LocaleProps,
  TranslateFn,
  ClassNamesFn,
  // amis-formula 相关
  parse,
  lexer,
  Evaluator,
  FilterContext,
  filters,
  getFilters,
  registerFilter,
  extendsFilters,
  evaluate,
  // 其他
  LazyComponent,
  addSchemaFilter,
  OptionsControlProps,
  FormOptionsControl,
  FormControlProps,
  FormBaseControl,
  extendDefaultEnv,
  addRootWrapper,
  RendererConfig
};

export function render(
  schema: Schema,
  props: RootRenderProps = {},
  options: RenderOptions = {},
  pathPrefix: string = ''
): JSX.Element {
  let locale = props.locale || getDefaultLocale();
  // 兼容 locale 的不同写法
  locale = locale.replace('_', '-');
  locale = locale === 'en' ? 'en-US' : locale;
  locale = locale === 'zh' ? 'zh-CN' : locale;
  locale = locale === 'cn' ? 'zh-CN' : locale;
  const translate = props.translate || makeTranslator(locale);
  let store = stores[options.session || 'global'];

  // 根据环境覆盖 schema，这个要在最前面做，不然就无法覆盖 validations
  envOverwrite(schema, locale);

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

    if (options.enableAMISDebug) {
      // 因为里面还有 render
      setTimeout(() => {
        enableDebug();
      }, 10);
    }

    store = RendererStore.create({}, options);
    stores[options.session || 'global'] = store;
  }

  (window as any).amisStore = store; // 为了方便 debug.
  const env = getEnv(store);

  let theme = props.theme || options.theme || 'cxd';
  if (theme === 'default') {
    theme = 'cxd';
  }
  env.theme = getTheme(theme);

  if (props.locale !== undefined) {
    env.translate = translate;
    env.locale = locale;
  }

  // 默认将开启移动端原生 UI
  if (typeof options.useMobileUI) {
    props.useMobileUI = true;
  }

  replaceText(schema, env.replaceText, env.replaceTextIgnoreKeys);

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
