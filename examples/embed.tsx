import './polyfills/index';
import React from 'react';
import {render as renderReact} from 'react-dom';
import axios from 'axios';
import copy from 'copy-to-clipboard';
import {normalizeLink} from '../src/utils/normalizeLink';

import qs from 'qs';
import {
  toast,
  alert,
  confirm,
  ToastComponent,
  AlertComponent,
  render as renderAmis
} from '../src/index';

export function embed(
  container: string | HTMLElement,
  schema: any,
  data: any,
  env: any
) {
  if (typeof container === 'string') {
    container = document.querySelector(container) as HTMLElement;
  }
  if (!container) {
    console.error('选择器不对，页面上没有此元素');
    return;
  } else if (container.tagName === 'BODY') {
    let div = document.createElement('div');
    container.appendChild(div);
    container = div;
  }
  container.classList.add('amis-scope');
  let scoped: any;

  const responseAdpater = (api: any) => (value: any) => {
    let response = value.data;
    if (env && env.responseAdpater) {
      const url = api.url;
      const idx = api.url.indexOf('?');
      const query = ~idx ? qs.parse(api.url.substring(idx)) : {};
      const request = {
        ...api,
        query: query,
        body: api.data
      };
      response = env.responseAdpater(api, response, query, request);
    } else {
      if (response.hasOwnProperty('errno')) {
        response.status = response.errno;
        response.msg = response.errmsg;
      } else if (response.hasOwnProperty('no')) {
        response.status = response.no;
        response.msg = response.error;
      }
    }

    const result = {
      ...value,
      data: response
    };
    return result;
  };

  renderReact(
    <div className="amis-routes-wrapper">
      <ToastComponent
        position={(env && env.toastPosition) || 'top-right'}
        closeButton={false}
        timeOut={5000}
        extendedTimeOut={3000}
      />
      <AlertComponent container={container} />

      {renderAmis(
        schema,
        {
          ...data,
          scopeRef: (ref: any) => (scoped = ref)
        },
        {
          getModalContainer: () => document.querySelector('.amis-scope'),
          notify: (type: string, msg: string) =>
            toast[type]
              ? toast[type](msg, type === 'error' ? '系统错误' : '系统消息')
              : console.warn('[Notify]', type, msg),
          alert,
          confirm,
          updateLocation: (to: any, replace: boolean) => {
            if (to === 'goBack') {
              return window.history.back();
            }

            replace || (location.href = normalizeLink(to));
          },
          isCurrentUrl: (to: string) => {
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
            }

            return false;
          },
          jumpTo: (to: string, action?: any) => {
            if (to === 'goBack') {
              return window.history.back();
            }

            to = normalizeLink(to);

            if (action && action.actionType === 'url') {
              action.blank === false
                ? (window.location.href = to)
                : window.open(to);
              return;
            }

            if (/^https?:\/\//.test(to)) {
              window.location.replace(to);
            } else {
              location.href = to;
            }
          },
          fetcher: (api: any) => {
            let {url, method, data, responseType, config, headers} = api;
            config = config || {};
            config.withCredentials = true;
            responseType && (config.responseType = responseType);

            if (config.cancelExecutor) {
              config.cancelToken = new (axios as any).CancelToken(
                config.cancelExecutor
              );
            }

            config.headers = headers || {};
            config.method = method;

            if (method === 'get' && data) {
              config.params = data;
            } else if (data && data instanceof FormData) {
              // config.headers['Content-Type'] = 'multipart/form-data';
            } else if (
              data &&
              typeof data !== 'string' &&
              !(data instanceof Blob) &&
              !(data instanceof ArrayBuffer)
            ) {
              data = JSON.stringify(data);
              config.headers['Content-Type'] = 'application/json';
            }

            data && (config.data = data);
            return axios(url, config).then(responseAdpater(api));
          },
          isCancel: (value: any) => (axios as any).isCancel(value),
          copy: (contents: string, options: any = {}) => {
            const ret = copy(contents, options);
            ret && options.shutup !== true && toast.info('内容已拷贝到剪切板');
            return ret;
          },
          richTextToken: '',
          affixOffsetBottom: 0,
          ...env
        }
      )}
    </div>,
    container
  );
  return scoped;
}
