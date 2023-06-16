import {attachmentAdpator, makeTranslator} from 'amis-core';
import axios from 'axios';
import qs from 'qs';
import omit from 'lodash/omit';

type RequestAdaptor = (config: any, env?: any) => any;
type ResponseAdaptor = (api: any, env?: any) => (response: any) => any;

type BuildConfig = (
  api: any,
  options?: {
    requestAdaptor?: RequestAdaptor;
    env?: any;
  }
) => any;

interface BuildRequestOptions {
  requestAdaptor?: RequestAdaptor;
  responseAdaptor?: ResponseAdaptor;
  buildConfig?: BuildConfig;
  updateConfig?: (config: any) => any;
  env?: any;
}

type BuildRequest = (
  options?: BuildRequestOptions
) => (api: any) => Promise<any>;

interface BuildFetcherOptions extends BuildRequestOptions {
  buildRequest?: BuildRequest;
}

interface BuildFetcherOptionsWithFn extends BuildFetcherOptions {
  fn?: (options: BuildFetcherOptions) => (api: any) => Promise<any>;
}

const defaultRequestAdaptor: RequestAdaptor = (config, env) => {
  const fn =
    env && typeof env.requestAdaptor === 'function'
      ? env.requestAdaptor.bind()
      : (config: any) => config;
  const request = fn(config) || config;

  return request;
};

const defaultResponseAdaptor: ResponseAdaptor = (api, env) => response => {
  let payload = response.data || {}; // blob 下可能会返回内容为空？
  // 之前拼写错了，需要兼容
  if (env && env.responseAdpater) {
    env.responseAdaptor = env.responseAdpater;
  }
  if (env && env.responseAdaptor) {
    const url = api.url;
    const idx = url.indexOf('?');
    const query = ~idx ? qs.parse(url.substring(idx)) : {};
    const request = {
      ...api,
      query: query,
      body: api.data
    };
    payload = env.responseAdaptor(api, payload, query, request, response);
  } else {
    if (payload.hasOwnProperty('errno')) {
      payload.status = payload.errno;
      payload.msg = payload.errmsg;
    } else if (payload.hasOwnProperty('no')) {
      payload.status = payload.no;
      payload.msg = payload.error;
    }
  }

  const result = {
    ...response,
    data: payload
  };
  return result;
};

// 构建 axios config
const defaultBuildConfig: BuildConfig = (api, _options) => {
  const {requestAdaptor, env} = Object.assign(
    {
      requestAdaptor: defaultRequestAdaptor
    },
    _options
  );
  let {url, method, data, responseType, config = {}, headers} = api;
  config = Object.assign({}, config);
  config.url = url;
  config.withCredentials = true;
  responseType && (config.responseType = responseType);

  if (config.cancelExecutor) {
    config.cancelToken = new (axios as any).CancelToken(config.cancelExecutor);
  }

  config.headers = headers || {};
  config.method = method;
  config.data = data;
  config = requestAdaptor(config, env);

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
    config.data = JSON.stringify(data);
    config.headers['Content-Type'] = 'application/json';
  }

  // 支持返回各种报错信息
  config.validateStatus = function () {
    return true;
  };
  return config;
};

const defaultBuildRequest: BuildRequest = _options => {
  const {requestAdaptor, responseAdaptor, buildConfig, env, updateConfig} =
    Object.assign(
      {
        requestAdaptor: defaultRequestAdaptor,
        responseAdaptor: defaultResponseAdaptor,
        buildConfig: defaultBuildConfig,
        updateConfig: (config: any) => config
      },
      _options
    );
  return (api: any) => {
    const __ = makeTranslator(env?.locale);
    const config = updateConfig(buildConfig({requestAdaptor, api, env}));
    return axios(config)
      .then(function (response: any) {
        return attachmentAdpator(response, __);
      })
      .then(function (response: any) {
        return responseAdaptor(api, env)(response);
      })
      .then(function (response: any) {
        if (response.status >= 400) {
          if (response.data) {
            // 主要用于 raw: 模式下，后端自己校验登录，
            if (
              response.status === 401 &&
              response.data.location &&
              response.data.location.startsWith('http')
            ) {
              location.href = response.data.location.replace(
                '{{redirect}}',
                encodeURIComponent(location.href)
              );
              return new Promise(() => {});
            } else if (response.data.msg) {
              throw new Error(response.data.msg);
            } else {
              throw new Error(
                __('System.requestError') +
                  JSON.stringify(response.data, null, 2)
              );
            }
          } else {
            throw new Error(
              `${__('System.requestErrorStatus')} ${response.status}`
            );
          }
        }
      });
  };
};

export const buildFetcher = (_options?: BuildFetcherOptionsWithFn) => {
  const options = Object.assign(
    {
      requestAdaptor: defaultRequestAdaptor,
      responseAdaptor: defaultResponseAdaptor,
      buildConfig: defaultBuildConfig,
      buildRequest: defaultBuildRequest,
      updateConfig: (config: any) => config
    },
    _options
  );
  if (options.fn) {
    return options.fn(omit(options, ['fn']));
  }
  return options.buildRequest(options);
};

/**
 * 使用 buildFetcher 可以 快速构建一个 初始化时需要的 fetcher
 *
 * 1. 最简单的使用方式，构建一个默认fetcher
 * buildFetcher();
 *
 * 2. 可单独更换fetcher中某个阶段的处理函数
 * buildFetcher({
 *     buildConfig: (api, {requestAdaptor, env}) {
 *          const config = api.config || {};
 *          return requestAdaptor(config, env);
 *     }
 * });
 * 支持以下阶段的函数
 * - buildConfig
 * - requestAdaptor
 * - buildRequest
 * - responseAdaptor
 *
 * 3. 修改默认生成的 config
 * buildFetcher({
 *     updateConfig: (config) {
 *          config.headers = {};
 *          return config;
 *     }
 * });
 *
 * 4. 修改 axios 为 ajax
 * buildFetcher({
 *     buildRequest: ({requestAdaptor, env}) {
 *          return (api) => {
 *              const config = updateConfig(buildConfig({requestAdaptor, api, env}));
 *              return $.ajax(config)}
 *          }
 *     }
 * });
 *
 * 5. 利用提供的默认处理函数，构建全新的fetcher
 * buildFetcher({
 *     fn: ({requestAdaptor, responseAdaptor, buildConfig, buildRequest, env}) => {
 *          const defaultFetcher = buildFetcher({env});
 *          const myFetcher = buildRequest({requestAdaptor, responseAdaptor, buildConfig, env});
 *          return (api) => {
 *              if (api.url.includes('api/v1')) {
 *                  return defaultFetcher(api);
 *              } else {
 *                  return buildRequest(api);
 *              }
 *          }
 *     }
 * });
 */
