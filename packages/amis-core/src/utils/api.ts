import omit from 'lodash/omit';
import {Api, ApiObject, EventTrack, fetcherResult, Payload} from '../types';
import {FetcherConfig} from '../factory';
import {tokenize, dataMapping, escapeHtml} from './tpl-builtin';
import {evalExpression} from './tpl';
import {
  isObject,
  isObjectShallowModified,
  hasFile,
  object2formData,
  qsstringify,
  cloneObject,
  createObject,
  extendObject,
  qsparse,
  uuid,
  JSONTraverse,
  isEmpty
} from './helper';
import isPlainObject from 'lodash/isPlainObject';
import {debug, warning} from './debug';
import {evaluate} from 'amis-formula';
import {memoryParse} from './memoryParse';

const rSchema =
  /(?:^|raw\:)(get|post|put|delete|patch|options|head|jsonp|js):/i;

interface ApiCacheConfig extends ApiObject {
  cachedPromise: Promise<any>;
  requestTime: number;
}

const apiCaches: Array<ApiCacheConfig> = [];

const isIE = !!(document as any).documentMode;

export function normalizeApi(
  api: Api,
  defaultMethod: string = 'get'
): ApiObject {
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
  api.url = typeof api.url === 'string' ? api.url.trim() : api.url;
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
  api.method = (api.method || (options as any).method || 'get').toLowerCase();

  if (api.headers) {
    api.headers = dataMapping(api.headers, data, undefined, false);
  }

  if (api.requestAdaptor && typeof api.requestAdaptor === 'string') {
    api.requestAdaptor = str2AsyncFunction(
      api.requestAdaptor,
      'api',
      'context'
    ) as any;
  }

  if (api.adaptor && typeof api.adaptor === 'string') {
    api.adaptor = str2AsyncFunction(
      api.adaptor,
      'payload',
      'response',
      'api',
      'context'
    ) as any;
  }

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
  let ast: any = undefined;
  try {
    ast = memoryParse(api.url);
  } catch (e) {
    console.warn(`api 配置语法出错：${e}`);
    return api;
  }
  const url = ast.body
    .map((item: any, index: number) => {
      return item.type === 'raw' ? item.value : `__expression__${index}__`;
    })
    .join('');

  const idx = url.indexOf('?');
  let replaceExpression = (
    fragment: string,
    defaultFilter = 'url_encode',
    defVal: any = undefined
  ) => {
    return fragment.replace(
      /__expression__(\d+)__/g,
      (_: any, index: string) => {
        return (
          evaluate(ast.body[index], data, {
            defaultFilter: defaultFilter
          }) ?? defVal
        );
      }
    );
  };

  // 是否过滤空字符串 query
  const queryStringify = (query: any) =>
    qsstringify(
      query,
      (api as ApiObject)?.filterEmptyQuery
        ? {
            filter: (key: string, value: any) => {
              return value === '' ? undefined : value;
            }
          }
        : undefined
    );
  /** 追加data到请求的Query中 */
  const attachDataToQuery = (
    apiObject: ApiObject,
    ctx: Record<string, any>,
    merge: boolean
  ) => {
    const idx = apiObject.url.indexOf('?');
    if (~idx) {
      const params = (apiObject.query = {
        ...qsparse(apiObject.url.substring(idx + 1)),
        ...apiObject.query,
        ...ctx
      });
      apiObject.url =
        apiObject.url.substring(0, idx) + '?' + queryStringify(params);
    } else {
      apiObject.query = {...apiObject.query, ...ctx};
      const query = queryStringify(merge ? apiObject.query : ctx);
      if (query) {
        apiObject.url = `${apiObject.url}?${query}`;
      }
    }

    return apiObject;
  };

  if (~idx) {
    const hashIdx = url.indexOf('#');
    const params = qsparse(
      url.substring(idx + 1, ~hashIdx && hashIdx > idx ? hashIdx : undefined)
    );

    // 将里面的表达式运算完
    JSONTraverse(params, (value: any, key: string | number, host: any) => {
      if (typeof value === 'string' && /^__expression__(\d+)__$/.test(value)) {
        host[key] = evaluate(ast.body[RegExp.$1].body, data) ?? '';
      } else if (typeof value === 'string') {
        // 参数值里面的片段不能 url_encode 了，所以是不处理
        host[key] = replaceExpression(host[key], 'raw', '');
      }
    });

    const left = replaceExpression(url.substring(0, idx), 'raw', '');

    // 追加
    Object.assign(params, api.query);
    api.url =
      left +
      (~left.indexOf('?') ? '&' : '?') +
      queryStringify(
        (api.query = dataMapping(params, data, undefined, api.convertKeyToPath))
      ) +
      (~hashIdx && hashIdx > idx
        ? replaceExpression(url.substring(hashIdx))
        : '');
  } else {
    api.url = replaceExpression(url, 'raw', '');
  }

  if (ignoreData) {
    return api;
  }

  const hasCustomData = api.data;
  if (api.data) {
    api.body = api.data = dataMapping(
      api.data,
      data,
      undefined,
      api.convertKeyToPath
    );
  } else if (
    api.method === 'post' ||
    api.method === 'put' ||
    api.method === 'patch'
  ) {
    api.body = api.data = data;
  }

  // 给 query 做数据映射
  if (api.query) {
    api.query = dataMapping(api.query, data, undefined, api.convertKeyToPath);
  }

  // get 类请求，把 data 附带到 url 上。
  if (api.method === 'get' || api.method === 'jsonp' || api.method === 'js') {
    if (
      !api.data &&
      ((!~raw.indexOf('$') && autoAppend) || api.forceAppendDataToQuery)
    ) {
      api.data = data;
      api.query = {
        ...api.query,
        ...data
      };
    } else if (
      api.attachDataToQuery === false &&
      api.data &&
      ((!~raw.indexOf('$') && autoAppend) || api.forceAppendDataToQuery)
    ) {
      api = attachDataToQuery(api, data, false);
    }

    if (api.data && api.attachDataToQuery !== false) {
      api = attachDataToQuery(api, api.data, true);
      delete api.data;
    }
  }
  // 非 get 类请求也可以携带参数到 url，只要 query 有值
  else if (api.method) {
    const idx = api.url.indexOf('?');
    if (~idx) {
      let params = (api.query = {
        ...qsparse(api.url.substring(idx + 1)),
        ...api.query
      });
      api.url = api.url.substring(0, idx) + '?' + queryStringify(params);
    } else {
      const query = queryStringify(api.query);
      if (query) {
        api.url = `${api.url}?${query}`;
      }
    }
  }

  if (api.graphql) {
    if (api.method === 'get') {
      api.query = api.data = {...api.query, query: api.graphql};
    } else if (
      api.method === 'post' ||
      api.method === 'put' ||
      api.method === 'patch'
    ) {
      api.body = api.data = {
        query: api.graphql,
        operationName: api.operationName,
        variables: cloneObject(api.data)
      };
    }
  } else if (api.jsonql) {
    api.method = 'post';
    api.jsonql = dataMapping(
      api.jsonql,
      /** 需要上层数据域的内容 */
      extendObject(data, {...api.query, ...data}, false),
      undefined,
      false,
      true
    );
    /** 同时设置了JSONQL和data时走兼容场景 */
    api.body = api.data =
      hasCustomData && api.jsonql
        ? {
            data: api.data,
            jsonql: api.jsonql
          }
        : api.jsonql;

    /** JSONQL所有method需要追加data中的变量到query中 */
    if (api.forceAppendDataToQuery) {
      api = attachDataToQuery(api, data, true);
    }
  }

  return api;
}

export function str2function(
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

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

export function str2AsyncFunction(
  contents: string,
  ...args: Array<string>
): Function | null {
  try {
    let fn = new AsyncFunction(...args, contents);
    return fn;
  } catch (e) {
    console.warn(e);
    return null;
  }
}

export function callStrFunction(
  this: any,
  fn: string | Function,
  argNames: Array<string>,
  ...args: Array<any>
) {
  if (typeof fn === 'function') {
    return fn.apply(this, args);
  } else if (typeof fn === 'string' && fn) {
    const func = str2function(fn, ...argNames)!;
    return func?.apply(this, args);
  }
}

export function responseAdaptor(ret: fetcherResult, api: ApiObject) {
  let data = ret.data;
  let hasStatusField = true;

  if (!data) {
    throw new Error('Response is empty');
  }

  // 返回内容是 string，说明 content-type 不是 json，这时可能是返回了纯文本或 html
  if (typeof data === 'string') {
    const contentType = (ret.headers as any)['content-type'] || '';
    // 如果是文本类型就尝试解析一下
    if (
      ret.headers &&
      contentType.startsWith('text/') &&
      !contentType.includes('markdown') &&
      api.responseType !== 'blob'
    ) {
      try {
        data = JSON.parse(data);
        if (typeof data === 'undefined') {
          throw new Error('Response should be JSON');
        }
      } catch (e) {
        const responseBrief =
          typeof data === 'string'
            ? escapeHtml((data as string).substring(0, 100))
            : '';
        throw new Error(`Response should be JSON\n ${responseBrief}`);
      }
    } else {
      if (api.responseType === 'blob') {
        throw new Error('Should have "Content-Disposition" in Header');
      } else if (!contentType.includes('markdown')) {
        throw new Error(
          `Content is wrong content-type:"${contentType}" content: ${escapeHtml(
            (data as string).substring(0, 100)
          )}`
        );
      }
    }
  }

  // 兼容几种常见写法
  if (data.hasOwnProperty('errorCode')) {
    // 阿里 Java 规范
    data.status = data.errorCode;
    data.msg = data.errorMessage || data.errorMsg;
  } else if (data.hasOwnProperty('errno')) {
    data.status = data.errno;
    data.msg = data.errmsg || data.errstr || data.msg;
  } else if (data.hasOwnProperty('no')) {
    data.status = data.no;
    data.msg = data.error || data.msg;
  } else if (data.hasOwnProperty('error')) {
    // Google JSON guide
    // https://google.github.io/styleguide/jsoncstyleguide.xml#error
    if (typeof data.error === 'object' && data.error.hasOwnProperty('code')) {
      data.status = data.error.code;
      data.msg = data.error.message;
    } else {
      data.status = data.error;
      data.msg = data.errmsg || data.msg;
    }
  }

  if (!data.hasOwnProperty('status')) {
    hasStatusField = false;
  }

  const payload: Payload = {
    ok: hasStatusField === false || data.status == 0,
    status: hasStatusField === false ? 0 : data.status,
    msg: data.msg || data.message,
    defaultMsg: data.defaultMsg,
    msgTimeout: data.msgTimeout,
    data: !data.data && !hasStatusField ? data : data.data // 兼容直接返回数据的情况
  };

  // 兼容返回 schema 的情况，用于 app 模式
  if (data && data.type) {
    payload.data = data;
  }

  if (payload.status == 422) {
    payload.errors = data.errors;
  }

  debug('api', 'response', payload);

  if (api.responseData && (payload.ok || !isEmpty(payload.data))) {
    debug('api', 'before dataMapping', payload.data);
    const responseData = dataMapping(
      api.responseData,
      createObject({api}, normalizeApiResponseData(payload.data)),
      undefined,
      api.convertKeyToPath
    );
    debug('api', 'after dataMapping', responseData);
    payload.data = responseData;
  }

  return payload;
}

export function wrapFetcher(
  fn: (config: FetcherConfig) => Promise<fetcherResult>,
  tracker?: (eventTrack: EventTrack, data: any) => void
) {
  // 避免重复处理
  if ((fn as any)._wrappedFetcher) {
    return fn as any;
  }

  const wrappedFetcher = async function (
    api: Api,
    data: object,
    options?: object
  ) {
    api = buildApi(api, data, options) as ApiObject;
    (api as ApiObject).context = data;

    if (api.requestAdaptor) {
      debug('api', 'before requestAdaptor', api);
      api = (await api.requestAdaptor(api, data)) || api;
      debug('api', 'after requestAdaptor', api);
    }

    if (
      api.data &&
      (api.data instanceof FormData ||
        hasFile(api.data) ||
        api.dataType === 'form-data')
    ) {
      api.data =
        api.data instanceof FormData
          ? api.data
          : object2formData(api.data, api.qsOptions);
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

    // 如果发送适配器中设置了 mockResponse
    // 则直接跳过请求发送
    if (api.mockResponse) {
      return wrapAdaptor(Promise.resolve(api.mockResponse) as any, api, data);
    }

    if (!isValidApi(api.url)) {
      throw new Error(`invalid api url:${api.url}`);
    }

    debug('api', 'request api', api);

    tracker?.(
      {eventType: 'api', eventData: omit(api, ['config', 'data', 'body'])},
      api.data
    );

    if (api.method?.toLocaleLowerCase() === 'jsonp') {
      return wrapAdaptor(jsonpFetcher(api), api, data);
    }

    if (api.method?.toLocaleLowerCase() === 'js') {
      return wrapAdaptor(jsFetcher(fn, api), api, data);
    }

    if (typeof api.cache === 'number' && api.cache > 0) {
      const apiCache = getApiCache(api);
      return wrapAdaptor(
        apiCache
          ? (apiCache as ApiCacheConfig).cachedPromise
          : setApiCache(api, fn(api)),
        api,
        data
      );
    }
    // IE 下 get 请求会被缓存，所以自动加个时间戳
    if (isIE && api && api.method?.toLocaleLowerCase() === 'get') {
      const timeStamp = `_t=${Date.now()}`;
      if (api.url.indexOf('?') === -1) {
        api.url = api.url + `?${timeStamp}`;
      } else {
        api.url = api.url + `&${timeStamp}`;
      }
    }
    return wrapAdaptor(fn(api), api, data);
  };

  (wrappedFetcher as any)._wrappedFetcher = true;

  return wrappedFetcher;
}

export function wrapAdaptor(
  promise: Promise<fetcherResult>,
  api: ApiObject,
  context: any
) {
  const adaptor = api.adaptor;
  return adaptor
    ? promise
        .then(async response => {
          debug('api', 'before adaptor data', (response as any).data);
          let result = adaptor((response as any).data, response, api, context);

          if (result?.then) {
            result = await result;
          }

          debug('api', 'after adaptor data', result);

          return {
            ...response,
            data: result
          };
        })
        .then(ret => responseAdaptor(ret, api))
    : promise.then(ret => responseAdaptor(ret, api));
}

/**
 * 请求远程 js 文件然后 new Function 执行，用于 schemaApi 支持 JavaScript
 * @param api
 * @returns
 */
export function jsFetcher(
  fetcher: (config: FetcherConfig) => Promise<fetcherResult>,
  api: ApiObject
): Promise<fetcherResult> {
  return new Promise((resolve, reject) => {
    // 大概也不会有人用 post
    api.method = 'get';
    fetcher(api).then((response: fetcherResult) => {
      if (typeof response.data === 'string') {
        const result = new Function('api', response.data)(api);
        resolve({
          status: 200,
          headers: {},
          data: {
            status: 0,
            msg: '',
            data: result
          }
        });
      } else {
        reject('must return string: ' + response.data);
      }
    });
  });
}

export function jsonpFetcher(api: ApiObject): Promise<fetcherResult> {
  return new Promise((resolve, reject) => {
    let script: HTMLScriptElement | null = document.createElement('script');
    let src = api.url;

    script.async = true;

    function remove() {
      if (script) {
        // @ts-ignore
        script.onload = script.onreadystatechange = script.onerror = null;

        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }

        script = null;
      }
    }

    const jsonp = api.query?.callback || 'axiosJsonpCallback' + uuid();
    const old = (window as any)[jsonp];

    (window as any)[jsonp] = function (responseData: any) {
      (window as any)[jsonp] = old;

      const response = {
        data: responseData,
        status: 200,
        headers: {}
      };

      resolve(response);
    };

    const additionalParams: any = {
      _: new Date().getTime(),
      _callback: jsonp
    };

    src += (src.indexOf('?') >= 0 ? '&' : '?') + qsstringify(additionalParams);

    // @ts-ignore IE 为script.onreadystatechange
    script.onload = script.onreadystatechange = function () {
      // @ts-ignore
      if (!script.readyState || /loaded|complete/.test(script.readyState)) {
        remove();
      }
    };

    script.onerror = function () {
      remove();
      const errResponse = {
        status: 0,
        headers: {}
      };

      reject(errResponse);
    };

    script.src = src;
    document.head.appendChild(script);
  });
}

// 避免在 isApiOutdated 中修改，减少影响
export function isApiOutdatedWithData(
  prevApi: Api | undefined,
  nextApi: Api | undefined,
  prevData: any,
  nextData: any
): nextApi is Api {
  if (!nextApi) {
    return false;
  } else if (!prevApi) {
    return true;
  }

  return isObjectShallowModified(
    buildApi(normalizeApi(prevApi) as Api, prevData as object),
    buildApi(normalizeApi(nextApi) as Api, nextData as object)
  );
}

export function isApiOutdated(
  prevApi: Api | undefined,
  nextApi: Api | undefined,
  prevData: any,
  nextData: any
): nextApi is Api {
  if (!nextApi) {
    return false;
  }

  // 通常是编辑器里加了属性，一开始没值，后来有了
  if (prevApi === undefined && !nextApi !== undefined) {
    return true;
  }

  nextApi = normalizeApi(nextApi);
  prevApi = (prevApi ? normalizeApi(prevApi) : prevApi) as ApiObject;

  if (nextApi.autoRefresh === false) {
    return false;
  }

  // api 本身有变化
  if ((prevApi && prevApi.url !== nextApi.url) || !prevApi) {
    return !!(
      isValidApi(nextApi.url) &&
      (!nextApi.sendOn || evalExpression(nextApi.sendOn, nextData))
    );
  }

  const trackExpression = nextApi.trackExpression ?? nextApi.url;
  if (typeof trackExpression !== 'string' || !~trackExpression.indexOf('$')) {
    return false;
  }

  let isModified = false;

  if (nextApi.trackExpression || prevApi.trackExpression) {
    isModified =
      tokenize(prevApi.trackExpression || '', prevData) !==
      tokenize(nextApi.trackExpression || '', nextData);
  } else {
    prevApi = buildApi(prevApi as Api, prevData as object, {
      ignoreData: true
    });
    nextApi = buildApi(nextApi as Api, nextData as object, {
      ignoreData: true
    });
    isModified = prevApi.url !== nextApi.url;
  }

  return !!(
    isModified &&
    isValidApi(nextApi.url) &&
    (!nextApi.sendOn || evalExpression(nextApi.sendOn, nextData))
  );
}

export function isValidApi(api: string) {
  if (!api || typeof api !== 'string') {
    return false;
  }
  const idx = api.indexOf('://');

  // 不允许 :// 结尾
  if (~idx && idx + 3 === api.length) {
    return false;
  }

  try {
    // 不补一个协议，URL 判断为 false
    api = (~idx ? '' : `schema://domain${api[0] === '/' ? '' : '/'}`) + api;
    new URL(api);
  } catch (error) {
    return false;
  }
  return true;
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

export function normalizeApiResponseData(data: any) {
  if (typeof data === 'undefined') {
    data = {};
  } else if (!isPlainObject(data)) {
    data = {
      [Array.isArray(data) ? 'items' : 'result']: data
    };
  }

  return data;
}

// window.apiCaches = apiCaches;
