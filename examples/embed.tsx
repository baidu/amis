import './polyfills/index';
import React from 'react';
import {render as renderReact} from 'react-dom';
import axios from 'axios';
import {match} from 'path-to-regexp';
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

import '../src/locale/en-US';

export function embed(
  container: string | HTMLElement,
  schema: any,
  props: any,
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

  const attachmentAdpator = (response: any) => {
    if (
      response &&
      response.headers &&
      response.headers['content-disposition']
    ) {
      const disposition = response.headers['content-disposition'];
      let filename = '';

      if (disposition && disposition.indexOf('attachment') !== -1) {
        // disposition 有可能是 attachment; filename="??.xlsx"; filename*=UTF-8''%E4%B8%AD%E6%96%87.xlsx
        // 这种情况下最后一个才是正确的文件名
        let filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)$/;

        let matches = disposition.match(filenameRegex);
        if (matches && matches.length) {
          filename = matches[1].replace(`UTF-8''`, '').replace(/['"]/g, '');
        }

        // 很可能是中文被 url-encode 了
        if (filename && filename.replace(/[^%]/g, '').length > 2) {
          filename = decodeURIComponent(filename);
        }

        let type = response.headers['content-type'];
        let blob =
          response.data.toString() === '[object Blob]'
            ? response.data
            : new Blob([response.data], {type: type});
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
          window.navigator.msSaveBlob(blob, filename);
        } else {
          let URL = window.URL || (window as any).webkitURL;
          let downloadUrl = URL.createObjectURL(blob);
          if (filename) {
            // use HTML5 a[download] attribute to specify filename
            let a = document.createElement('a');
            // safari doesn't support this yet
            if (typeof a.download === 'undefined') {
              (window as any).location = downloadUrl;
            } else {
              a.href = downloadUrl;
              a.download = filename;
              document.body.appendChild(a);
              a.click();
            }
          } else {
            (window as any).location = downloadUrl;
          }
          setTimeout(function () {
            URL.revokeObjectURL(downloadUrl);
          }, 100); // cleanup
        }

        return {
          ...response,
          data: {
            status: 0,
            msg: '文件即将开始下载。。'
          }
        };
      }
    } else if (response.data.toString() === '[object Blob]') {
      return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.addEventListener('loadend', e => {
          const text = reader.result as string;

          try {
            resolve({
              ...response,
              data: {
                ...JSON.parse(text)
              }
            });
          } catch (e) {
            reject(e);
          }
        });

        reader.readAsText(response.data);
      });
    }

    return response;
  };

  const responseAdaptor = (api: any) => (value: any) => {
    let response = value.data || {}; // blob 下可能会返回内容为空？
    // 之前拼写错了，需要兼容
    if (env && env.responseAdpater) {
      env.responseAdaptor = env.responseAdpater;
    }
    if (env && env.responseAdaptor) {
      const url = api.url;
      const idx = api.url.indexOf('?');
      const query = ~idx ? qs.parse(api.url.substring(idx)) : {};
      const request = {
        ...api,
        query: query,
        body: api.data
      };
      response = env.responseAdaptor(api, response, query, request);
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
        timeout={5000}
        theme={env?.theme}
      />
      <AlertComponent
        theme={env?.theme}
        container={() => env?.getModalContainer?.() || container}
      />

      {renderAmis(
        schema,
        {
          ...props,
          scopeRef: (ref: any) => (scoped = ref)
        },
        {
          getModalContainer: () =>
            env?.getModalContainer?.() || document.querySelector('.amis-scope'),
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
          fetcher: async (api: any) => {
            let {url, method, data, responseType, config, headers} = api;
            config = config || {};
            // config.withCredentials = true;
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

            // 支持返回各种报错信息
            config.validateStatus = function (status) {
              return true;
            };

            data && (config.data = data);
            let response = await axios(url, config);
            response = attachmentAdpator(response);
            response = responseAdaptor(api)(response);

            if (response.status >= 400) {
              if (response.data) {
                if (response.data.msg) {
                  throw new Error(response.data.msg);
                } else {
                  throw new Error(
                    '接口报错：' + JSON.stringify(response.data, null, 2)
                  );
                }
              } else {
                throw new Error(`接口出错，状态码是 ${response.status}`);
              }
            }

            return response;
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
