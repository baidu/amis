/**
 * 传给 amis 渲染器的默认 env
 */
import {RenderOptions} from 'amis-core';
import axios from 'axios';
import {alert, confirm, toast} from 'amis';

export const env: RenderOptions = {
  updateLocation: () => {},
  jumpTo: () => {
    toast.info('温馨提示：预览模式下禁止跳转');
  },
  fetcher: ({url, method, data, config}: any) => {
    config = config || {};
    config.withCredentials = true;

    if (config.cancelExecutor) {
      config.cancelToken = new (axios as any).CancelToken(
        config.cancelExecutor
      );
    }

    if (method !== 'post' && method !== 'put' && method !== 'patch') {
      if (data) {
        config.params = data;
      }

      return (axios as any)[method](url, config);
    } else if (data && data instanceof FormData) {
      // config.headers = config.headers || {};
      // config.headers['Content-Type'] = 'multipart/form-data';
    } else if (
      data &&
      typeof data !== 'string' &&
      !(data instanceof Blob) &&
      !(data instanceof ArrayBuffer)
    ) {
      data = JSON.stringify(data);
      config.headers = config.headers || {};
      config.headers['Content-Type'] = 'application/json';
    }

    return (axios as any)[method](url, data, config);
  },
  isCancel: (value: any) => (axios as any).isCancel(value),
  alert,
  confirm,
  notify: (type, msg) => {
    toast[type]
      ? toast[type](msg, type === 'error' ? '系统错误' : '系统消息')
      : console.warn('[Notify]', type, msg);
  }
};
