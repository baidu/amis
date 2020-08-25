import {
  types,
  getParent,
  flow,
  getEnv,
  getRoot,
  isAlive
} from 'mobx-state-tree';
import {iRendererStore} from './iRenderer';
import {IRendererStore} from './index';
import {Api, ApiObject, Payload, fetchOptions} from '../types';
import {extendObject, isEmpty, isObject} from '../utils/helper';
import {ServerError} from '../utils/errors';

export const ServiceStore = iRendererStore
  .named('ServiceStore')
  .props({
    msg: '',
    error: false,
    fetching: false,
    saving: false,
    busying: false,
    checking: false,
    initializing: false,
    schema: types.optional(types.frozen(), null),
    schemaKey: ''
  })
  .views(self => ({
    get loading() {
      return self.fetching || self.saving || self.busying || self.initializing;
    }
  }))
  .actions(self => {
    let fetchCancel: Function | null;
    let fetchSchemaCancel: Function | null;

    function markFetching(fetching = true) {
      self.fetching = fetching;
    }

    function markSaving(saving = true) {
      self.saving = saving;
    }

    function markBusying(busying = true) {
      self.busying = busying;
    }

    function reInitData(data: object | undefined, replace: boolean = false) {
      const newData = extendObject(self.pristine, data, !replace);
      self.data = self.pristine = newData;
    }

    function updateMessage(msg?: string, error: boolean = false) {
      self.msg = (msg && String(msg)) || '';
      self.error = error;
    }

    function clearMessage() {
      updateMessage('');
    }

    const fetchInitData: (
      api: Api,
      data?: object,
      options?: fetchOptions
    ) => Promise<any> = flow(function* getInitData(
      api: Api,
      data: object,
      options?: fetchOptions
    ) {
      try {
        if (fetchCancel) {
          fetchCancel();
          fetchCancel = null;
          self.fetching = false;
        }

        if (self.fetching) {
          return;
        }

        (options && options.silent) || markFetching(true);
        const json: Payload = yield (getRoot(self) as IRendererStore).fetcher(
          api,
          data,
          {
            ...options,
            cancelExecutor: (executor: Function) => (fetchCancel = executor)
          }
        );
        fetchCancel = null;

        if (!json.ok) {
          updateMessage(json.msg || (options && options.errorMessage), true);
          (getRoot(self) as IRendererStore).notify(
            'error',
            json.msg,
            json.msgTimeout !== undefined
              ? {
                  closeButton: true,
                  timeout: json.msgTimeout
                }
              : undefined
          );
        } else {
          self.updatedAt = Date.now();
          let replace = !!(api as ApiObject).replaceData;
          let data = {
            ...(replace ? {} : self.data),
            ...json.data
          };
          reInitData(data, replace);
          self.hasRemoteData = true;
          if (options && options.onSuccess) {
            const ret = options.onSuccess(json);

            if (ret && ret.then) {
              yield ret;
            }
          }

          updateMessage(json.msg || (options && options.successMessage));

          // 配置了获取成功提示后提示，默认是空不会提示。
          options &&
            options.successMessage &&
            (getRoot(self) as IRendererStore).notify('success', self.msg);
        }

        markFetching(false);
        return json;
      } catch (e) {
        const root = getRoot(self) as IRendererStore;
        if (!isAlive(root) || root.storeType !== 'RendererStore') {
          // 已经销毁了，不管这些数据了。
          return;
        }

        if (root.isCancel(e)) {
          return;
        }

        markFetching(false);
        e.stack && console.error(e.stack);
        root.notify('error', e.message || e);
        return;
      }
    });

    const fetchData: (
      api: Api,
      data?: object,
      options?: fetchOptions
    ) => Promise<any> = flow(function* getInitData(
      api: Api,
      data: object,
      options?: fetchOptions
    ) {
      try {
        if (fetchCancel) {
          fetchCancel();
          fetchCancel = null;
          self.fetching = false;
        }

        if (self.fetching) {
          return;
        }

        (options && options.silent) || markFetching(true);
        const json: Payload = yield ((getRoot(
          self
        ) as IRendererStore) as IRendererStore).fetcher(api, data, {
          ...options,
          cancelExecutor: (executor: Function) => (fetchCancel = executor)
        });
        fetchCancel = null;

        if (!isEmpty(json.data) || json.ok) {
          self.updatedAt = Date.now();

          json.data &&
            self.updateData(
              json.data,
              undefined,
              !!(api as ApiObject).replaceData
            );

          self.hasRemoteData = true;
        }

        if (!json.ok) {
          updateMessage(json.msg || (options && options.errorMessage), true);
          (getRoot(self) as IRendererStore).notify(
            'error',
            self.msg,
            json.msgTimeout !== undefined
              ? {
                  closeButton: true,
                  timeout: json.msgTimeout
                }
              : undefined
          );
        } else {
          if (options && options.onSuccess) {
            const ret = options.onSuccess(json);

            if (ret && ret.then) {
              yield ret;
            }
          }

          updateMessage(json.msg || (options && options.successMessage));

          // 配置了获取成功提示后提示，默认是空不会提示。
          options &&
            options.successMessage &&
            (getRoot(self) as IRendererStore).notify('success', self.msg);
        }

        markFetching(false);
        return json;
      } catch (e) {
        const root = getRoot(self) as IRendererStore;
        if (!isAlive(root) || root.storeType !== 'RendererStore') {
          // 已经销毁了，不管这些数据了。
          return;
        }

        if (root.isCancel(e)) {
          return;
        }

        markFetching(false);
        e.stack && console.error(e.stack);
        root.notify('error', e.message || e);
        return;
      }
    });

    const saveRemote: (
      api: Api,
      data?: object,
      options?: fetchOptions
    ) => Promise<any> = flow(function* saveRemote(
      api: Api,
      data: object,
      options: fetchOptions = {}
    ) {
      try {
        options = {
          method: 'post', // 默认走 post
          ...options
        };

        if (self.saving) {
          return;
        }
        markSaving(true);

        const json: Payload = yield (getRoot(self) as IRendererStore).fetcher(
          api,
          data,
          options
        );

        if (!isEmpty(json.data) || json.ok) {
          self.updatedAt = Date.now();

          json.data &&
            self.updateData(
              json.data,
              undefined,
              !!(api as ApiObject).replaceData
            );
        }

        if (!json.ok) {
          updateMessage(
            json.msg ||
              (options && options.errorMessage) ||
              self.__('保存失败'),
            true
          );
          throw new ServerError(self.msg, json);
        } else {
          if (options && options.onSuccess) {
            const ret = options.onSuccess(json);

            if (ret && ret.then) {
              yield ret;
            }
          }

          updateMessage(json.msg || (options && options.successMessage));
          self.msg &&
            (getRoot(self) as IRendererStore).notify('success', self.msg);
        }

        markSaving(false);
        return json.data;
      } catch (e) {
        self.saving = false;
        // console.log(e.stack);
        if (e.type === 'ServerError') {
          const result = (e as ServerError).response;
          (getRoot(self) as IRendererStore).notify(
            'error',
            e.message,
            result.msgTimeout !== undefined
              ? {
                  closeButton: true,
                  timeout: result.msgTimeout
                }
              : undefined
          );
        } else {
          (getRoot(self) as IRendererStore).notify('error', e.message);
        }

        throw e;
      }
    });

    const fetchSchema: (
      api: Api,
      data?: object,
      options?: fetchOptions
    ) => Promise<any> = flow(function* fetchSchema(
      api: Api,
      data: object,
      options: fetchOptions = {}
    ) {
      try {
        options = {
          method: 'post', // 默认走 post
          ...options,
          cancelExecutor: (executor: Function) => (fetchSchemaCancel = executor)
        };

        if (fetchSchemaCancel) {
          fetchSchemaCancel();
          fetchSchemaCancel = null;
          self.initializing = false;
        }

        if (self.initializing) {
          return;
        }

        self.initializing = true;

        if (typeof api === 'string') {
          api += (~api.indexOf('?') ? '&' : '?') + '_replace=1';
        } else {
          api = {
            ...(api as any),
            url:
              (api as ApiObject).url +
              (~(api as ApiObject).url.indexOf('?') ? '&' : '?') +
              '_replace=1'
          };
        }

        const json: Payload = yield (getRoot(self) as IRendererStore).fetcher(
          api,
          data,
          options
        );
        fetchSchemaCancel = null;

        if (!json.ok) {
          updateMessage(
            json.msg ||
              (options && options.errorMessage) ||
              self.__('获取失败，请重试'),
            true
          );
          (getRoot(self) as IRendererStore).notify(
            'error',
            self.msg,
            json.msgTimeout !== undefined
              ? {
                  closeButton: true,
                  timeout: json.msgTimeout
                }
              : undefined
          );
        } else {
          if (json.data) {
            self.schema = json.data;
            self.schemaKey = '' + Date.now();
            isObject(json.data.data) &&
              self.updateData(
                json.data.data,
                undefined,
                !!(api as ApiObject).replaceData
              );
          }
          updateMessage(json.msg || (options && options.successMessage));

          // 配置了获取成功提示后提示，默认是空不会提示。
          options &&
            options.successMessage &&
            (getRoot(self) as IRendererStore).notify('success', self.msg);
        }

        self.initializing = false;
        return json.data;
      } catch (e) {
        const root = getRoot(self) as IRendererStore;
        if (!isAlive(root) || root.storeType !== 'RendererStore') {
          // 已经销毁了，不管这些数据了。
          return;
        }

        self.initializing = false;

        if (root.isCancel(e)) {
          return;
        }

        e.stack && console.error(e.stack);
        root.notify('error', e.message || e);
      }
    });

    const checkRemote: (
      api: Api,
      data?: object,
      options?: fetchOptions
    ) => Promise<any> = flow(function* checkRemote(
      api: Api,
      data: object,
      options?: fetchOptions
    ) {
      if (self.checking) {
        return;
      }

      try {
        self.checking = true;
        const json: Payload = yield (getRoot(self) as IRendererStore).fetcher(
          api,
          data,
          options
        );
        json.ok &&
          self.updateData(
            json.data,
            undefined,
            !!(api as ApiObject).replaceData
          );

        if (!json.ok) {
          throw new Error(json.msg);
        }

        return json.data;
      } finally {
        self.checking = false;
      }
    });

    return {
      markFetching,
      markSaving,
      markBusying,
      fetchInitData,
      fetchData,
      reInitData,
      updateMessage,
      clearMessage,
      saveRemote,
      fetchSchema,
      checkRemote
    };
  });

export type IServiceStore = typeof ServiceStore.Type;
