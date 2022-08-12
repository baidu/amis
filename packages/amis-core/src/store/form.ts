import {types, getEnv, flow, isAlive, Instance} from 'mobx-state-tree';
import debounce from 'lodash/debounce';
import {ServiceStore} from './service';
import type {IFormItemStore} from './formItem';
import {Api, ApiObject, fetchOptions, Payload} from '../types';
import {ServerError} from '../utils/errors';
import {
  getVariable,
  setVariable,
  deleteVariable,
  cloneObject,
  createObject,
  difference,
  isEmpty,
  mapObject,
  keyToPath
} from '../utils/helper';
import isEqual from 'lodash/isEqual';
import flatten from 'lodash/flatten';
import find from 'lodash/find';
import {filter} from '../utils/tpl';
import {normalizeApiResponseData} from '../utils/api';

export const FormStore = ServiceStore.named('FormStore')
  .props({
    inited: false,
    validated: false,
    submited: false,
    submiting: false,
    savedData: types.frozen(),
    // items: types.optional(types.array(types.late(() => FormItemStore)), []),
    canAccessSuperData: true,
    persistData: types.optional(types.union(types.string, types.boolean), ''),
    restError: types.optional(types.array(types.string), []) // 没有映射到表达项上的 errors
  })
  .views(self => {
    function getItems() {
      const formItems: Array<IFormItemStore> = [];

      // 查找孩子节点中是 formItem 的表单项
      const pool = self.children.concat();
      while (pool.length) {
        const current = pool.shift()!;

        if (current.storeType === 'FormItemStore') {
          formItems.push(current);
        } else {
          pool.push(...current.children);
        }
      }

      return formItems;
    }

    return {
      get loading() {
        return self.saving || self.fetching;
      },

      get items() {
        return getItems();
      },

      /**
       * 相对于 items(), 只收集直接子formItem
       * 避免 子form 表单项的重复验证
       */
      get directItems() {
        const formItems: Array<IFormItemStore> = [];

        // 查找孩子节点中是 formItem 的表单项
        const pool = self.children.concat();
        while (pool.length) {
          const current = pool.shift()!;
          if (current.storeType === 'FormItemStore') {
            formItems.push(current);
          } else if (current.storeType !== 'ComboStore') {
            pool.push(...current.children);
          }
        }

        return formItems;
      },

      get errors() {
        let errors: {
          [propName: string]: Array<string>;
        } = {};

        getItems().forEach(item => {
          if (!item.valid) {
            errors[item.name] = Array.isArray(errors[item.name])
              ? errors[item.name].concat(item.errors)
              : item.errors.concat();
          }
        });

        return errors;
      },

      getValueByName(
        name: string,
        canAccessSuperData = self.canAccessSuperData
      ) {
        return getVariable(self.data, name, canAccessSuperData);
      },

      getPristineValueByName(name: string) {
        return getVariable(self.pristine, name);
      },

      getItemById(id: string) {
        return getItems().find(item => item.itemId === id);
      },

      getItemByName(name: string) {
        return getItems().find(item => item.name === name);
      },

      getItemsByName(name: string) {
        return getItems().filter(item => item.name === name);
      },

      get valid() {
        return (
          getItems().every(item => item.valid) &&
          (!self.restError || !self.restError.length)
        );
      },

      get validating() {
        return getItems().some(item => item.validating);
      },

      get isPristine() {
        return isEqual(self.pristine, self.data);
      },

      get modified() {
        if (self.savedData) {
          return self.savedData !== self.data;
        }

        return !this.isPristine;
      },

      get persistKey() {
        return `${location.pathname}/${self.path}/${
          typeof self.persistData === 'string'
            ? filter(self.persistData, self.data)
            : self.persistData
        }`;
      }
    };
  })
  .actions(self => {
    function setValues(values: object, tag?: object, replace?: boolean) {
      self.updateData(values, tag, replace);

      // 如果数据域中有数据变化，就都reset一下，去掉之前残留的验证消息
      self.items.forEach(item => item.reset());

      // 同步 options
      syncOptions();
    }

    function setValueByName(
      name: string,
      value: any,
      isPristine: boolean = false,
      force: boolean = false
    ) {
      // 没有变化就不跑了。
      const origin = getVariable(self.data, name, false);

      const prev = self.data;
      const data = cloneObject(self.data);

      if (value !== origin) {
        if (prev.__prev) {
          // 基于之前的 __prev 改
          const prevData = cloneObject(prev.__prev);
          setVariable(prevData, name, origin);
          Object.defineProperty(data, '__prev', {
            value: prevData,
            enumerable: false,
            configurable: false,
            writable: false
          });
        } else {
          Object.defineProperty(data, '__prev', {
            value: {...prev},
            enumerable: false,
            configurable: false,
            writable: false
          });
        }
      } else if (!force) {
        return;
      }

      setVariable(data, name, value);

      if (isPristine) {
        const pristine = cloneObject(self.pristine);
        setVariable(pristine, name, value);
        self.pristine = pristine;
      }

      if (!data.__pristine) {
        Object.defineProperty(data, '__pristine', {
          value: self.pristine,
          enumerable: false,
          configurable: false,
          writable: false
        });
      }

      self.data = data;

      // 同步 options
      syncOptions();
    }

    function deleteValueByName(name: string) {
      const prev = self.data;
      const data = cloneObject(self.data);

      if (prev.__prev) {
        // 基于之前的 __prev 改
        const prevData = cloneObject(prev.__prev);
        setVariable(prevData, name, getVariable(prev, name));
        Object.defineProperty(data, '__prev', {
          value: prevData,
          enumerable: false,
          configurable: false,
          writable: false
        });
      } else {
        Object.defineProperty(data, '__prev', {
          value: {...prev},
          enumerable: false,
          configurable: false,
          writable: false
        });
      }

      deleteVariable(data, name);
      self.data = data;
    }

    function trimValues() {
      let data = mapObject(self.data, (item: any) =>
        typeof item === 'string' ? item.trim() : item
      );
      self.updateData(data);
    }

    const syncOptions = debounce(
      () => self.items.forEach(item => item.syncOptions(undefined, self.data)),
      250,
      {
        trailing: true,
        leading: false
      }
    );

    function setRestError(errors: string[]) {
      self.restError.replace(errors);
    }

    function addRestError(msg: string, name?: string | Array<string>) {
      const names = name
        ? Array.isArray(name)
          ? name.concat()
          : [name]
        : null;

      if (Array.isArray(names)) {
        const errors: any = {};
        names.forEach(name => (errors[name] = msg));
        setFormItemErrors(errors, 'rules');
      } else {
        self.restError.push(msg);
      }
    }

    function clearRestError() {
      setRestError([]);
    }

    const saveRemote: (
      api: Api,
      data?: object,
      options?: fetchOptions
    ) => Promise<any> = flow(function* saveRemote(
      api: Api,
      data: object,
      options: fetchOptions = {}
    ) {
      clearRestError();

      try {
        options = {
          method: 'post', // 默认走 post
          ...options
        };

        if (options && options.beforeSend) {
          let ret = options.beforeSend(data);

          if (ret && ret.then) {
            ret = yield ret;
          }

          if (ret === false) {
            return;
          }
        }

        self.markSaving(true);
        const json: Payload = yield getEnv(self).fetcher(api, data, options);

        // 失败也同样修改数据，如果有数据的话。
        if (!isEmpty(json.data) || json.ok) {
          self.updatedAt = Date.now();

          setValues(
            normalizeApiResponseData(json.data),
            json.ok
              ? {
                  __saved: Date.now()
                }
              : undefined,
            !!(api as ApiObject).replaceData
          );
        }

        if (!json.ok) {
          if (json.status === 422 && json.errors) {
            setFormItemErrors(json.errors);

            self.updateMessage(
              json.msg ??
                self.__(options && options.errorMessage) ??
                self.__('Form.validateFailed'),
              true
            );
          } else {
            self.updateMessage(
              json.msg ?? self.__(options && options.errorMessage),
              true
            );
          }

          throw new ServerError(self.msg, json);
        } else {
          updateSavedData();
          let ret = options && options.onSuccess && options.onSuccess(json);
          if (ret?.then) {
            ret = yield ret;
          }
          if (ret?.cbResult?.then) {
            yield ret.cbResult;
          }
          self.markSaving(false);
          self.updateMessage(
            json.msg ?? options.successMessage === 'saveSuccess'
              ? json.defaultMsg
              : self.__(options && options.successMessage) ?? json.defaultMsg
          );
          if (!ret?.dispatcher?.prevented) {
            self.msg &&
              getEnv(self).notify(
                'success',
                self.msg,
                json.msgTimeout !== undefined
                  ? {
                      closeButton: true,
                      timeout: json.msgTimeout
                    }
                  : undefined
              );
          }
          return json.data;
        }
      } catch (e) {
        self.markSaving(false);
        let ret =
          options && options.onFailed && options.onFailed(e.response || {});
        if (ret?.then) {
          ret = yield ret;
        }
        if (!isAlive(self) || self.disposed) {
          return;
        }
        if (ret?.dispatcher?.prevented) {
          return;
        }
        if (e.type === 'ServerError') {
          const result = (e as ServerError).response;
          getEnv(self).notify(
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
          getEnv(self).notify('error', e.message);
        }
        throw e;
      }
    });

    function setFormItemErrors(
      errors: {[propName: string]: string},
      tag = 'remote'
    ) {
      Object.keys(errors).forEach((key: string) => {
        const item = self.getItemById(key);
        const items = self.getItemsByName(key);

        if (item) {
          item.setError(errors[key], tag);
          delete errors[key];
        } else if (items.length) {
          // 通过 name 直接找到的
          items.forEach(item => item.setError(errors[key], tag));
          delete errors[key];
        } else {
          // 尝试通过path寻找
          const items = getItemsByPath(key);

          if (Array.isArray(items) && items.length) {
            items.forEach(item => item.setError(`${errors[key]}`, tag));
            delete errors[key];
          }
        }
      });

      // 没有映射上的error信息加在msg后显示出来
      !isEmpty(errors) &&
        setRestError(Object.keys(errors).map(key => String(errors[key])));
    }

    const getItemsByPath = (key: string) => {
      const paths: Array<string> = keyToPath(key);
      const len = paths.length;

      return paths.reduce(
        (stores: any[], path, idx) => {
          if (Array.isArray(stores) && stores.every(s => s.getItemsByName)) {
            const items = flatten(
              stores.map(s => s.getItemsByName(path))
            ).filter(i => i);
            const subStores = items
              .map(item => item?.getSubStore?.())
              .filter(i => i);
            return subStores.length && idx < len - 1 ? subStores : items;
          }
          return null;
        },
        [self]
      );
    };

    const submit: (
      fn?: (values: object) => Promise<any>,
      hooks?: Array<() => Promise<any>>,
      failedMessage?: string,
      validateErrCb?: () => void
    ) => Promise<any> = flow(function* submit(
      fn: any,
      hooks?: Array<() => Promise<any>>,
      failedMessage?: string,
      validateErrCb?: () => void
    ) {
      self.submited = true;
      self.submiting = true;

      try {
        let valid = yield validate(hooks);

        // 如果不是valid，而且有包含不是remote的报错的表单项时，不可提交
        if (
          (!valid &&
            self.items.some(item =>
              item.errorData.some(e => e.tag !== 'remote')
            )) ||
          self.restError.length
        ) {
          let msg = failedMessage ?? self.__('Form.validateFailed');
          const env = getEnv(self);
          let dispatcher: any = validateErrCb && validateErrCb();
          if (dispatcher?.then) {
            dispatcher = yield dispatcher;
          }
          if (!dispatcher?.prevented) {
            msg && env.notify('error', msg);
          }
          throw new Error(msg);
        }

        if (fn) {
          const diff = difference(self.data, self.pristine);
          const result = yield fn(
            createObject(
              createObject(self.data.__super, {
                diff: diff,
                __diff: diff,
                pristine: self.pristine
              }),
              self.data
            )
          );
          return result ?? self.data;
        }

        return self.data;
      } finally {
        self.submiting = false;
      }
    });

    const validate: (
      hooks?: Array<() => Promise<any>>,
      forceValidate?: boolean
    ) => Promise<boolean> = flow(function* validate(
      hooks?: Array<() => Promise<any>>,
      forceValidate?: boolean
    ) {
      self.validated = true;
      const items = self.directItems.concat();
      for (let i = 0, len = items.length; i < len; i++) {
        let item = items[i] as IFormItemStore;

        // 先清除组合校验的错误
        item.clearError('rules');

        // 验证过，或者是 unique 的表单项，或者强制验证，或者有远端校验api
        if (
          !item.validated ||
          item.rules.equals ||
          item.rules.equalsField ||
          item.unique ||
          forceValidate ||
          !!item.validateApi
        ) {
          yield item.validate(self.data);
        }
      }

      if (hooks && hooks.length) {
        for (let i = 0, len = hooks.length; i < len; i++) {
          yield hooks[i]();
        }
      }

      return self.valid;
    });

    const validateFields: (
      fields: Array<string | {name: string; rules: {[propName: string]: any}}>
    ) => Promise<boolean> = flow(function* validateFields(
      fields: Array<string | {name: string; rules: {[propName: string]: any}}>
    ) {
      const items = self.items.concat();
      const normalizedfields = fields.map(field =>
        typeof field === 'string' ? {name: field, rules: {}} : field
      );
      let result: Array<boolean> = [];

      for (let i = 0, len = items.length; i < len; i++) {
        let item = items[i] as IFormItemStore;
        const field = find(normalizedfields, field => field.name === item.name);

        if (field) {
          result.push(yield item.validate(self.data, undefined, field.rules));
        }
      }
      return result.every(item => item);
    });

    function clearErrors() {
      const items = self.items.concat();
      items.forEach(item => item.reset());
    }

    function reset(cb?: (data: any) => void, resetData: boolean = true) {
      if (resetData) {
        self.data = self.pristine;
      }

      // 值可能变了，重新验证一次。
      self.validated = false;
      self.submited = false;
      self.items.forEach(item => item.reset());
      cb && cb(self.data);
    }

    function clear(cb?: (data: any) => void) {
      const toClear: any = {};
      self.items.forEach(item => {
        if (item.name && item.type !== 'hidden') {
          setVariable(toClear, item.name, item.resetValue);
        }
      });
      setValues(toClear);
      self.validated = false;
      self.submited = false;
      self.items.forEach(item => item.reset());
      cb && cb(self.data);
    }

    function setCanAccessSuperData(value: boolean = true) {
      self.canAccessSuperData = value;
    }

    function setInited(value: boolean) {
      self.inited = value;
    }

    function setPersistData(value = '') {
      self.persistData = value;
    }

    const setLocalPersistData = () => {
      localStorage.setItem(self.persistKey, JSON.stringify(self.data));
    };

    function getLocalPersistData() {
      let data = localStorage.getItem(self.persistKey);
      if (data) {
        self.updateData(JSON.parse(data));
      }
    }

    function clearLocalPersistData() {
      localStorage.removeItem(self.persistKey);
    }

    function updateSavedData() {
      self.savedData = self.data;
    }

    return {
      setInited,
      setValues,
      setValueByName,
      trimValues,
      submit,
      validate,
      validateFields,
      clearErrors,
      saveRemote,
      reset,
      syncOptions,
      setCanAccessSuperData,
      deleteValueByName,
      getLocalPersistData,
      setLocalPersistData,
      clearLocalPersistData,
      setPersistData,
      clear,
      updateSavedData,
      setFormItemErrors,
      getItemsByPath,
      setRestError,
      addRestError,
      clearRestError,
      beforeDestroy() {
        syncOptions.cancel();
      }
    };
  });

export type IFormStore = Instance<typeof FormStore>;
export {IFormItemStore};
