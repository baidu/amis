/**
 * 传给 amis 渲染器的默认 env
 */
import {attachmentAdpator, RenderOptions} from 'amis-core';
import axios from 'axios';
import {alert, confirm, toast} from 'amis';

export const env: RenderOptions = {
  updateLocation: () => {},
  jumpTo: () => {
    toast.info('温馨提示：预览模式下禁止跳转');
  },
  fetcher: async (api: any) => {
    let {url, method, data, config, headers} = api;
    config = config || {};
    config.url = url;
    config.withCredentials = true;

    if (config.cancelExecutor) {
      config.cancelToken = new axios.CancelToken(config.cancelExecutor);
    }

    config.headers = headers
      ? {...config.headers, ...headers}
      : config.headers ?? {};
    config.method = method;
    config.data = data;

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

    let response = await axios(config);
    response = await attachmentAdpator(response, (msg: string) => msg, api);
    return response;
  },
  isCancel: (value: any) => (axios as any).isCancel(value),
  alert,
  confirm,
  notify: (type, msg) => {
    toast[type]
      ? toast[type](msg, type === 'error' ? '系统错误' : '系统消息')
      : console.warn('[Notify]', type, msg);
  },
  /* 强制隐藏组件内部的报错信息，会覆盖组件内部属性 */
  forceSilenceInsideError: false
};
