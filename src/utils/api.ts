import {Api, ApiObject, fetcherResult, Payload} from '../types';
import {fetcherConfig} from '../factory';
import {tokenize, dataMapping} from './tpl-builtin';
import qs from 'qs';
import {evalExpression} from './tpl';
import {
  isObject,
  isObjectShallowModified,
  hasFile,
  object2formData,
  qsstringify,
  cloneObject
} from './helper';

const rSchema = /(?:^|raw\:)(get|post|put|delete|patch|options|head):/i;

interface ApiCacheConfig extends ApiObject {
  cachedPromise: Promise<any>;
  requestTime: number;
}

const apiCaches: Array<ApiCacheConfig> = [];

export function normalizeApi(api: Api, defaultMethod?: string): ApiObject {
  if (typeof api === 'string') {
    let method = rSchema.test(api) ? RegExp.$1 : '';
    method && (api = api.replace(method + ':', ''));

    api = {
      method: (method || defaultMethod) as any,
      url: api
    };
  } else {
    api = {
      ...api
    };
  }
  return api;
}

export function buildApi(
  api: Api,
  data?: object,
  options: {
    autoAppend?: boolean;
    ignoreData?: boolean;
    [propName: string]: any;
  } = {}
): ApiObject {
  api = normalizeApi(api, options.method);
  const {autoAppend, ignoreData, ...rest} = options;

  api.config = {
    ...rest
  };
  api.method = api.method || (options as any).method || 'get';

  if (!data) {
    return api;
  } else if (
    data instanceof FormData ||
    data instanceof Blob ||
    data instanceof ArrayBuffer
  ) {
    api.data = data;
    return api;
  }

  const raw = (api.url = api.url || '');
  const idx = api.url.indexOf('?');

  if (~idx) {
    const hashIdx = api.url.indexOf('#');
    const params = qs.parse(
      api.url.substring(idx + 1, ~hashIdx ? hashIdx : undefined)
    );
    api.url =
      tokenize(api.url.substring(0, idx + 1), data, '| url_encode') +
      qsstringify(dataMapping(params, data)) +
      (~hashIdx ? api.url.substring(hashIdx) : '');
  } else {
    api.url = tokenize(api.url, data, '| url_encode');
  }

  if (ignoreData) {
    return api;
  }

  if (api.data) {
    api.data = dataMapping(api.data, data);
  } else if (api.method === 'post' || api.method === 'put') {
    api.data = cloneObject(data);
  }

  // get 类请求，把 data 附带到 url 上。
  if (api.method === 'get') {
    if (!~raw.indexOf('$') && !api.data && autoAppend) {
      api.data = data;
    } else if (
      api.attachDataToQuery === false &&
      api.data &&
      !~raw.indexOf('$') &&
      autoAppend
    ) {
      const idx = api.url.indexOf('?');
      if (~idx) {
        let params = {
          ...qs.parse(api.url.substring(idx + 1)),
          ...data
        };
        api.url = api.url.substring(0, idx) + '?' + qsstringify(params);
      } else {
        api.url += '?' + qsstringify(data);
      }
    }

    if (api.data && api.attachDataToQuery !== false) {
      const idx = api.url.indexOf('?');
      if (~idx) {
        let params = {
          ...qs.parse(api.url.substring(idx + 1)),
          ...api.data
        };
        api.url = api.url.substring(0, idx) + '?' + qsstringify(params);
      } else {
        api.url += '?' + qsstringify(api.data);
      }
      delete api.data;
    }
  }

  if (api.headers) {
    api.headers = dataMapping(api.headers, data);
  }

  if (api.requestAdaptor && typeof api.requestAdaptor === 'string') {
    api.requestAdaptor = str2function(api.requestAdaptor, 'api') as any;
  }

  if (api.adaptor && typeof api.adaptor === 'string') {
    api.adaptor = str2function(
      api.adaptor,
      'payload',
      'response',
      'api'
    ) as any;
  }

  return api;
}

function str2function(
  contents: string,
  ...args: Array<string>
): Function | null {
  try {
    let fn = new Function(...args, contents);
    return fn;
  } catch (e) {
    console.warn(e);
    return null;
  }
}

function responseAdaptor(ret: fetcherResult) {
  const data = ret.data;

  if (!data) {
    throw new Error('Response is empty!');
  } else if (!data.hasOwnProperty('status')) {
    throw new Error(
      '接口返回格式不符合，请参考 http://amis.baidu.com/v2/docs/api'
    );
  }

  const payload: Payload = {
    ok: data.status == 0,
    status: data.status,
    msg: data.msg,
    msgTimeout: data.msgTimeout,
    data: data.data
  };

  if (payload.status == 422) {
    payload.errors = data.errors;
  }

  return payload;
}

export function wrapFetcher(
  fn: (config: fetcherConfig) => Promise<fetcherResult>
): (api: Api, data: object, options?: object) => Promise<Payload | void> {
  return function (api, data, options) {
    api = buildApi(api, data, options) as ApiObject;

    api.requestAdaptor && (api = api.requestAdaptor(api) || api);

    if (api.data && (hasFile(api.data) || api.dataType === 'form-data')) {
      api.data = object2formData(api.data, api.qsOptions);
    } else if (
      api.data &&
      typeof api.data !== 'string' &&
      api.dataType === 'form'
    ) {
      api.data = qsstringify(api.data, api.qsOptions) as any;
      api.headers = api.headers || (api.headers = {});
      api.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    } else if (
      api.data &&
      typeof api.data !== 'string' &&
      api.dataType === 'json'
    ) {
      api.data = JSON.stringify(api.data) as any;
      api.headers = api.headers || (api.headers = {});
      api.headers['Content-Type'] = 'application/json';
    }

    if (typeof api.cache === 'number' && api.cache > 0) {
      const apiCache = getApiCache(api);
      return wrapAdaptor(
        apiCache
          ? (apiCache as ApiCacheConfig).cachedPromise
          : setApiCache(api, fn(api)),
        api
      );
    }
    return wrapAdaptor(fn(api), api);
  };
}

export function wrapAdaptor(promise: Promise<fetcherResult>, api: ApiObject) {
  const adaptor = api.adaptor;
  return adaptor
    ? promise
        .then(response => ({
          ...response,
          data: adaptor((response as any).data, response, api)
        }))
        .then(responseAdaptor)
    : promise.then(responseAdaptor);
}

export function isApiOutdated(
  prevApi: Api | undefined,
  nextApi: Api | undefined,
  prevData: any,
  nextData: any
): nextApi is Api {
  const url: string =
    (nextApi && (nextApi as ApiObject).url) || (nextApi as string);

  if (nextApi && (nextApi as ApiObject).autoRefresh === false) {
    return false;
  }

  if (url && typeof url === 'string' && ~url.indexOf('$')) {
    prevApi = buildApi(prevApi as Api, prevData as object, {ignoreData: true});
    nextApi = buildApi(nextApi as Api, nextData as object, {ignoreData: true});

    return !!(
      prevApi.url !== nextApi.url &&
      isValidApi(nextApi.url) &&
      (!nextApi.sendOn || evalExpression(nextApi.sendOn, nextData))
    );
  }

  return false;
}

export function isValidApi(api: string) {
  return (
    api &&
    /^(?:(https?|wss?|taf):\/\/[^\/]+)?(\/[^\s\/\?]*){1,}(\?.*)?$/.test(api)
  );
}

export function isEffectiveApi(
  api?: Api,
  data?: any,
  initFetch?: boolean,
  initFetchOn?: string
): api is Api {
  if (!api) {
    return false;
  }
  if (initFetch === false) {
    return false;
  }
  if (initFetchOn && data && !evalExpression(initFetchOn, data)) {
    return false;
  }
  if (typeof api === 'string' && api.length) {
    return true;
  } else if (isObject(api) && (api as ApiObject).url) {
    if (
      (api as ApiObject).sendOn &&
      data &&
      !evalExpression((api as ApiObject).sendOn as string, data)
    ) {
      return false;
    }
    return true;
  }
  return false;
}

export function isSameApi(
  apiA: ApiObject | ApiCacheConfig,
  apiB: ApiObject | ApiCacheConfig
): boolean {
  return (
    apiA.method === apiB.method &&
    apiA.url === apiB.url &&
    !isObjectShallowModified(apiA.data, apiB.data, false)
  );
}

export function getApiCache(api: ApiObject): ApiCacheConfig | undefined {
  // 清理过期cache
  const now = Date.now();
  let result: ApiCacheConfig | undefined;

  for (let idx = 0, len = apiCaches.length; idx < len; idx++) {
    const apiCache = apiCaches[idx];

    if (now - apiCache.requestTime > (apiCache.cache as number)) {
      apiCaches.splice(idx, 1);
      len--;
      idx--;
      continue;
    }

    if (isSameApi(api, apiCache)) {
      result = apiCache;
      break;
    }
  }

  return result;
}

export function setApiCache(
  api: ApiObject,
  promise: Promise<any>
): Promise<any> {
  apiCaches.push({
    ...api,
    cachedPromise: promise,
    requestTime: Date.now()
  });
  return promise;
}

export function clearApiCache() {
  apiCaches.splice(0, apiCaches.length);
}

// window.apiCaches = apiCaches;
