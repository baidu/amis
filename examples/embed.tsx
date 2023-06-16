import './polyfills/index';
import React from 'react';
import {createRoot} from 'react-dom/client';
import axios from 'axios';
import {match} from 'path-to-regexp';
import copy from 'copy-to-clipboard';
import {normalizeLink} from 'amis-core';

import qs from 'qs';
import {
  toast,
  alert,
  confirm,
  ToastComponent,
  AlertComponent,
  render as renderAmis,
  makeTranslator,
  quickBuildFetcher
} from 'amis';

import 'amis-ui/lib/locale/en-US';
import 'history';

import type {ToastLevel, ToastConf} from 'amis-ui/lib/components/Toast';

export function embed(
  container: string | HTMLElement,
  schema: any,
  props: any = {},
  env?: any,
  callback?: () => void
) {
  const __ = makeTranslator(env?.locale || props?.locale);

  // app 模式自动加 affixOffsetTop
  if (!('affixOffsetTop' in props) && schema.type === 'app') {
    props.affixOffsetTop = 50;
  }

  if (typeof container === 'string') {
    container = document.querySelector(container) as HTMLElement;
  }
  if (!container) {
    console.error(__('Embed.invalidRoot'));
    return;
  } else if (container.tagName === 'BODY') {
    let div = document.createElement('div');
    container.appendChild(div);
    container = div;
  }
  container.classList.add('amis-scope');
  let scoped = {};

  const amisEnv = {
    getModalContainer: () =>
      env?.getModalContainer?.() || document.querySelector('.amis-scope'),
    notify: (type: ToastLevel, msg: string, conf?: ToastConf) =>
      toast[type]
        ? toast[type](msg, conf)
        : console.warn('[Notify]', type, msg),
    alert,
    confirm,
    updateLocation: (to: any, replace: boolean) => {
      if (to === 'goBack') {
        return window.history.back();
      }

      if (replace && window.history.replaceState) {
        window.history.replaceState('', document.title, to);
        return;
      }

      location.href = normalizeLink(to);
    },
    isCurrentUrl: (to: string, ctx?: any) => {
      const link = normalizeLink(to);
      const location = window.location;
      let pathname = link;
      let search = '';
      const idx = link.indexOf('?');
      if (~idx) {
        pathname = link.substring(0, idx);
        search = link.substring(idx);
      }

      if (search) {
        if (pathname !== location.pathname || !location.search) {
          return false;
        }

        const query = qs.parse(search.substring(1));
        const currentQuery = qs.parse(location.search.substring(1));

        return Object.keys(query).every(
          key => query[key] === currentQuery[key]
        );
      } else if (pathname === location.pathname) {
        return true;
      } else if (!~pathname.indexOf('http') && ~pathname.indexOf(':')) {
        return match(link, {
          decode: decodeURIComponent,
          strict: ctx?.strict ?? true
        })(location.pathname);
      }

      return false;
    },
    jumpTo: (to: string, action?: any) => {
      if (to === 'goBack') {
        return window.history.back();
      }

      to = normalizeLink(to);

      if (action && action.actionType === 'url') {
        action.blank === false ? (window.location.href = to) : window.open(to);
        return;
      }

      // 主要是支持 nav 中的跳转
      if (action && to && action.target) {
        window.open(to, action.target);
        return;
      }

      if (/^https?:\/\//.test(to)) {
        window.location.replace(to);
      } else {
        location.href = to;
      }
    },
    fetcher: quickBuildFetcher({env}),
    isCancel: (value: any) => (axios as any).isCancel(value),
    copy: (contents: string, options: any = {}) => {
      const ret = copy(contents);
      ret && options.silent !== true && toast.info(__('System.copy'));
      return ret;
    },
    richTextToken: '',
    affixOffsetBottom: 0,
    customStyleClassPrefix: '.amis-scope',
    ...env
  };

  let amisProps: any = {};
  function createElements(props: any): any {
    amisProps = {
      ...amisProps,
      ...props,
      scopeRef: (ref: any) => {
        if (ref) {
          Object.assign(scoped, ref);
          callback?.();
        }
      }
    };

    return (
      <div className="amis-routes-wrapper">
        <ToastComponent
          position={(env && env.toastPosition) || 'top-center'}
          closeButton={false}
          timeout={5000}
          locale={props?.locale}
          theme={env?.theme}
        />
        <AlertComponent
          locale={props?.locale}
          theme={env?.theme}
          container={() => env?.getModalContainer?.() || container}
        />

        {renderAmis(schema, amisProps, amisEnv)}
      </div>
    );
  }

  const root = createRoot(container);
  root.render(createElements(props));

  return Object.assign(scoped, {
    updateProps: (props: any, callback?: () => void) => {
      root.render(createElements(props));
    },
    updateSchema: (newSchema: any, props = {}) => {
      schema = newSchema;
      root.render(createElements(props));
    },
    unmount: () => {
      root.unmount();
    }
  });
}
