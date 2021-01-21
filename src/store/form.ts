import {
  types,
  getEnv,
  flow,
  getRoot,
  detach,
  destroy,
  isAlive,
  Instance
} from 'mobx-state-tree';
import debounce from 'lodash/debounce';
import {ServiceStore} from './service';
import {FormItemStore, IFormItemStore, SFormItemStore} from './formItem';
import {Api, ApiObject, fetchOptions, Payload} from '../types';
import {ServerError} from '../utils/errors';
import {
  getVariable,
  setVariable,
  deleteVariable,
  cloneObject,
  createObject,
  difference,
  guid,
  isEmpty,
  mapObject,
  keyToPath
} from '../utils/helper';
import isEqual from 'lodash/isEqual';
import flatten from 'lodash/flatten';
import {getStoreById, removeStore} from './manager';

export const FormStore = ServiceStore.named('FormStore')
  .props({
    inited: false,
    validated: false,
    submited: false,
    submiting: false,
    validating: false,
    savedData: types.frozen(),
    // items: types.optional(types.array(types.late(() => FormItemStore)), []),
    itemsRef: types.optional(types.array(types.string), []),
    canAccessSuperData: true,
    persistData: false
  })
  .views(self => {
    function getItems() {
      return self.itemsRef.map(item => getStoreById(item) as IFormItemStore);
    }

    return {
      get loading() {
        return self.saving || self.fetching;
      },

      get items() {
        return getItems();
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

      getValueByName(name: string) {
        return getVariable(self.data, name, self.canAccessSuperData);
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
        return getItems().every(item => item.valid);
      },

      get isPristine() {
        return isEqual(self.pristine, self.data);
      },

      get modified() {
        if (self.savedData) {
          return self.savedData !== self.data;
        }

        return !this.isPristine;
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

      if (self.persistData) {
        setPersistData();
      }

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
      () => self.items.forEach(item => item.syncOptions()),
      250,
      {
        trailing: true,
        leading: false
      }
    );

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
            json.data,
            json.ok
              ? {
                  __saved: Date.now()
                }
              : undefined,
            !!(api as ApiObject).replaceData
          );
        }

        if (!json.ok) {
          // 验证错误
          if (json.status === 422 && json.errors) {
            const errors = json.errors;
            Object.keys(errors).forEach((key: string) => {
              const item = self.getItemById(key);
              const items = self.getItemsByName(key);

              if (item) {
                item.setError(errors[key]);
                delete errors[key];
              } else if (items.length) {
                // 通过 name 直接找到的
                items.forEach(item => item.setError(errors[key]));
                delete errors[key];
              } else {
                // 尝试通过path寻找
                const items = getItemsByPath(key);

                if (Array.isArray(items) && items.length) {
                  items.forEach(item => item.setError(errors[key]));
                  delete errors[key];
                }
              }
            });

            // 没有映射上的error信息加在msg后显示出来
            const msgs = Object.keys(errors).map(key => errors[key]);

            if (options && options.errorMessage) {
              msgs.unshift(options.errorMessage);
            }

            self.updateMessage(
              json.msg ||
                `${msgs.join('\n')}` ||
                self.__('Form.validateFailed'),
              true
            );
          } else {
            self.updateMessage(
              json.msg || (options && options.errorMessage),
              true
            );
          }

          throw new ServerError(self.msg, json);
        } else {
          updateSavedData();
          if (options && options.onSuccess) {
            const ret = options.onSuccess(json);

            if (ret && ret.then) {
              yield ret;
            }
          }
          self.markSaving(false);
          self.updateMessage(json.msg || (options && options.successMessage));
          self.msg && getEnv(self).notify('success', self.msg);
          return json.data;
        }
      } catch (e) {
        self.markSaving(false);

        if (!isAlive(self) || self.disposed) {
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

    const getItemsByPath = (key: string) => {
      const paths = keyToPath(key);
      const len = paths.length;

      return paths.reduce(
        (stores: any[], path, idx) => {
          if (Array.isArray(stores) && stores.every(s => s.getItemsByName)) {
            const items = flatten(stores.map(s => s.getItemsByName(path)));
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
      failedMessage?: string
    ) => Promise<any> = flow(function* submit(
      fn: any,
      hooks?: Array<() => Promise<any>>,
      failedMessage?: string
    ) {
      self.submited = true;
      self.submiting = true;

      try {
        let valid = yield validate(hooks);

        if (!valid) {
          const msg = failedMessage ?? self.__('Form.validateFailed');
          msg && getEnv(self).notify('error', msg);
          throw new Error(self.__('Form.validateFailed'));
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
      self.validating = true;
      self.validated = true;
      const items = self.items.concat();
      for (let i = 0, len = items.length; i < len; i++) {
        let item = items[i] as IFormItemStore;

        // 验证过，或者是 unique 的表单项，或者强制验证
        if (!item.validated || item.unique || forceValidate) {
          yield item.validate();
        }
      }

      if (hooks && hooks.length) {
        for (let i = 0, len = hooks.length; i < len; i++) {
          yield hooks[i]();
        }
      }

      self.validating = false;
      return self.valid;
    });

    const validateFields: (fields: Array<string>) => Promise<boolean> = flow(
      function* validateFields(fields: Array<string>) {
        self.validating = true;
        const items = self.items.concat();
        let result: Array<boolean> = [];
        for (let i = 0, len = items.length; i < len; i++) {
          let item = items[i] as IFormItemStore;

          if (~fields.indexOf(item.name)) {
            result.push(yield item.validate());
          }
        }
        self.validating = false;
        return result.every(item => item);
      }
    );

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

    function addFormItem(item: IFormItemStore) {
      self.itemsRef.push(item.id);
      // 默认值可能在原型上，把他挪到当前对象上。
      setValueByName(item.name, item.value, false, false);
    }

    function removeFormItem(item: IFormItemStore) {
      removeStore(item);
    }

    function setCanAccessSuperData(value: boolean = true) {
      self.canAccessSuperData = value;
    }

    function setInited(value: boolean) {
      self.inited = value;
    }

    const setPersistData = debounce(
      () =>
        localStorage.setItem(
          location.pathname + self.path,
          JSON.stringify(self.data)
        ),
      250,
      {
        trailing: true,
        leading: false
      }
    );

    function getPersistData() {
      self.persistData = true;
      let data = localStorage.getItem(location.pathname + self.path);
      if (data) {
        self.updateData(JSON.parse(data));
      }
    }

    function clearPersistData() {
      localStorage.removeItem(location.pathname + self.path);
    }

    function onChildStoreDispose(child: IFormItemStore) {
      if (child.storeType === FormItemStore.name) {
        const itemsRef = self.itemsRef.filter(id => id !== child.id);
        self.itemsRef.replace(itemsRef);
      }
      self.removeChildId(child.id);
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
      addFormItem,
      removeFormItem,
      syncOptions,
      setCanAccessSuperData,
      deleteValueByName,
      getPersistData,
      setPersistData,
      clearPersistData,
      onChildStoreDispose,
      updateSavedData,
      getItemsByPath,
      beforeDestroy() {
        syncOptions.cancel();
        setPersistData.cancel();
      }
    };
  });

export type IFormStore = Instance<typeof FormStore>;
export {IFormItemStore};
