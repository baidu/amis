import {
    Api,
    ApiObject,
    fetcherResult,
    Payload
} from '../types';
import {
    fetcherConfig
} from '../factory';
import {
    tokenize,
    dataMapping
} from './tpl-builtin';
const rSchema = /(?:^|raw\:)(get|post|put|delete|patch):/i;
import * as qs from 'qs';
import { evalExpression } from './tpl';
import {
    isObjectShallowModified
} from './helper';

interface ApiCacheConfig extends ApiObject {
    cachedPromise: Promise<any>;
    requestTime: number;
}

const apiCaches: Array<ApiCacheConfig> = [];

export function buildApi(api: Api, data?: object, options: {
    autoAppend?: boolean;
    ignoreData?: boolean;
    [propName: string]: any;
} = {}): ApiObject {
    if (typeof api === 'string') {
        let method = rSchema.test(api) ? RegExp.$1 : '';
        method && (api = api.replace(method + ':', ''));

        api = {
            method: method as any,
            url: api
        };
    } else {
        api = {
            ...api
        };
    }
    const {
        autoAppend,
        ignoreData,
        ...rest
    } = options;

    api.config = {
        ...rest
    };
    api.method = api.method || (options as any).method || 'get';

    if (!data) {
        return api;
    } else if (data instanceof FormData || data instanceof Blob || data instanceof ArrayBuffer) {
        api.data = data;
        return api;
    }

    const raw = api.url = api.url || '';
    api.url = tokenize(api.url, data, '| url_encode');
    if (api.data) {
        api.data = dataMapping(api.data, data);
    } else if (api.method === 'post' || api.method === 'put') {
        api.data = data;
    }

    // get 类请求，把 data 附带到 url 上。
    if (api.method === 'get') {
        if (!~raw.indexOf('$') && !api.data && autoAppend) {
            api.data = data;
        }

        if (api.data && !ignoreData) {
            const idx = api.url.indexOf('?');
            if (~idx) {
                let params = {
                    ...qs.parse(api.url.substring(idx + 1)),
                    ...api.data
                };
                api.url = api.url.substring(0, idx) + '?' + qs.stringify(params);
            } else {
                api.url += '?' + qs.stringify(api.data);
            }
            delete api.data;
        }
    }

    if (api.headers) {
        api.headers = dataMapping(api.headers, data);
    }

    return api;
}

function responseAdaptor(ret: fetcherResult) {
    const data = ret.data;

    if (!data) {
        throw new Error('Response is empty!');
    }
    const payload: Payload = {
        ok: data.status == 0,
        status: data.status,
        msg: data.msg,
        data: data.data
    };

    if (payload.status == 422) {
        payload.errors = data.errors;
    }

    return payload;
}

export function wrapFetcher(fn: (config: fetcherConfig) => Promise<fetcherResult>): (api: Api, data: object, options?: object) => Promise<Payload | void> {
    return function (api, data, options) {
        api = buildApi(api, data, options) as ApiObject;
        api.requestAdaptor && (api = api.requestAdaptor(api) || api);

        if (typeof api.cache === 'number' && api.cache > 0) {
            const apiCache = getApiCache(api);
            return wrapAdaptor(apiCache ? (apiCache as ApiCacheConfig).cachedPromise : setApiCache(api, fn(api)), api);
        }
        return wrapAdaptor(fn(api), api);
    }
}

export function wrapAdaptor(promise: Promise<fetcherResult>, api: ApiObject) {
    const adaptor = api.adaptor;
    return adaptor ? promise.then(response => ({ ...response, data: adaptor((response as any).data, response, api) })).then(responseAdaptor)
        : promise.then(responseAdaptor);
}

export function isApiOutdated(prevApi: Api | undefined, nextApi: Api | undefined, prevData: any, nextData: any): boolean {
    const url: string = nextApi && (nextApi as ApiObject).url || nextApi as string;

    if (url && typeof url === "string" && ~url.indexOf('$')) {
        prevApi = buildApi(prevApi as Api, prevData as object, { ignoreData: true });
        nextApi = buildApi(nextApi as Api, nextData as object, { ignoreData: true });

        return !!(
            prevApi.url !== nextApi.url && isValidApi(nextApi.url)
            && (!nextApi.sendOn || evalExpression(nextApi.sendOn, nextData))
        );
    }

    return false;
}

export function isValidApi(api: string) {
    return api && /^(?:https?:\/\/[^\/]+)?(\/[^\s\/\?]*){1,}(\?.*)?$/.test(api);
}

export function isSameApi(apiA: ApiObject | ApiCacheConfig, apiB: ApiObject | ApiCacheConfig): boolean {
    return apiA.method === apiB.method && apiA.url === apiB.url && !isObjectShallowModified(apiA.data, apiB.data, false);
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

export function setApiCache(api: ApiObject, promise: Promise<any>): Promise<any> {
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