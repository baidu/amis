import {
    types,
    getEnv,
    flow,
    getRoot,
    detach
} from "mobx-state-tree";
import {
    ServiceStore,
} from './service';
import {
    FormItemStore,
    IFormItemStore,
    SFormItemStore
} from './formItem';
import {
    Api,
    fetchOptions,
    Payload
} from '../types';
import {
    getVariable,
    setVariable,
    deleteVariable,
    cloneObject,
    extendObject,
    createObject,
    difference,
    guid
} from '../utils/helper';
import { IComboStore } from "./combo";
import isEqual = require('lodash/isEqual');
import { IRendererStore } from ".";

class ServerError extends Error {
    type = 'ServerError';
}

export const FormStore = ServiceStore
    .named('FormStore')
    .props({
        inited: false,
        validated: false,
        submited: false,
        submiting: false,
        validating: false,
        items: types.optional(types.array(types.late(() => FormItemStore)), []),
        canAccessSuperData: true
    })
    .views(self => ({
        get loading() {
            return self.saving || self.fetching;
        },

        get errors() {
            let errors:{
                [propName:string]: Array<string>;
            } = {};

            self.items.forEach(item => {
                if (!item.valid) {
                    errors[item.name] = Array.isArray(errors[item.name]) ? errors[item.name].concat(item.errors) : item.errors.concat();
                }
            })

            return errors;
        },

        getValueByName(name:string) {
            return getVariable(self.data, name, self.canAccessSuperData);
        },

        getPristineValueByName(name:string) {
            return getVariable(self.pristine, name);
        },

        getItemById(id:string) {
            return self.items.find(item => item.id === id);
        },

        getItemByName(name:string) {
            return self.items.find(item => item.name === name);
        },

        getItemsByName(name:string) {
            return self.items.filter(item => item.name === name);
        },

        get valid() {
            return self.items.every(item => item.valid);
        },

        get isPristine() {
            return isEqual(self.pristine, self.data);
        }
    }))
    .actions(self => {

        function setValues(values:object, tag?:object) {
            self.updateData(values, tag);
            
            // 同步 options
            syncOptions();
        }

        function setValueByName(name:string, value:any, isPristine:boolean = false) {

            // 没有变化就不跑了。
            const origin = getVariable(self.data, name, false);
            if (value === origin) {
                return;
            }

            const prev = self.data;
            const data = cloneObject(self.data);

            if (prev.__prev) {
                // 基于之前的 __prev 改
                const prevData = cloneObject(prev.__prev);
                setVariable(prevData, name, origin);
                Object.defineProperty(data, '__prev', {
                    value: prevData,
                    enumerable: false,
                    configurable: false,
                    writable: false,
                });
            } else {
                Object.defineProperty(data, '__prev', {
                    value: {...prev},
                    enumerable: false,
                    configurable: false,
                    writable: false,
                });
            }
            
            setVariable(data, name, value);
            self.data = data;

            if (isPristine) {
                const pristine = cloneObject(self.pristine);
                setVariable(pristine, name, value);
                self.pristine = pristine;
            }

            // 同步 options
            syncOptions();
        }

        function deleteValueByName(name:string) {
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
                    writable: false,
                });
            } else {
                Object.defineProperty(data, '__prev', {
                    value: {...prev},
                    enumerable: false,
                    configurable: false,
                    writable: false,
                });
            }
            
            deleteVariable(data, name);
            self.data = data;
        }

        function syncOptions() {
            self.items.forEach(item => item.syncOptions());
        }

        const saveRemote:(api:Api, data?:object, options?:fetchOptions) => Promise<any> = flow(function *saveRemote(api:string, data:object, options:fetchOptions = {}) {
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
                const json:Payload = yield (getRoot(self) as IRendererStore).fetcher(api, data, options);
                

                if (!json.ok) {
                    // 验证错误
                    if (json.status === 422 && json.errors) {
                        const errors = json.errors;
                        Object.keys(errors).forEach((key:string) => {
                            const item = self.getItemById(key);

                            if (item) {
                                item.setError(errors[key]);
                            } else {
                                self.getItemsByName(key).forEach(item => item.setError(errors[key]));
                            }
                        });

                        self.updateMessage(json.msg || options && options.errorMessage  || '验证错误', true);
                    } else {
                        self.updateMessage(json.msg || options && options.errorMessage, true);
                    }

                    throw new ServerError(self.msg);
                } else {
                    setValues(json.data, {
                        __saved: Date.now()
                    });
                    self.updatedAt = Date.now();

                    if (options && options.onSuccess) {
                        const ret = options.onSuccess(json);

                        if (ret && ret.then) {
                            yield ret;
                        }
                    }
                    self.markSaving(false);
                    self.updateMessage(json.msg || options && options.successMessage);
                    (getRoot(self) as IRendererStore).notify('success', self.msg);
                    return json.data;
                }
            } catch(e) {
                if ((getRoot(self) as IRendererStore).storeType !== 'RendererStore') {
                    // 已经销毁了，不管这些数据了。
                    return;
                }
                
                self.markSaving(false);
                // console.error(e.stack);`
                (getRoot(self) as IRendererStore).notify('error', e.message);
                throw e;
            }
        });

        const submit:(fn?:(values:object) => Promise<any>, hooks?: Array<() => Promise<any>>) => Promise<any> = flow(function *submit(fn:any, hooks?: Array<() => Promise<any>>) {
            self.submited = true;
            self.submiting = true;
            
            try {
                let valid = yield validate(hooks);

                if (!valid) {
                    (getRoot(self) as IRendererStore).notify('error', '表单验证失败，请仔细检查');
                    throw new Error('验证失败');
                }

                if (fn) {
                    const diff = difference(self.data, self.pristine);
                    yield fn(createObject(createObject(self.data.__super, {
                        diff: diff,
                        __diff: diff
                    }), self.data));
                }
            } finally {
                self.submiting = false;
            }

            return self.data;
        });

        const validate: (hooks?: Array<() => Promise<any>>, forceValidate?: boolean) => Promise<boolean> = flow(function *validate(hooks?: Array<() => Promise<any>>, forceValidate?: boolean) {
            self.validating = true;
            self.validated = true;
            const items = self.items.concat();
            for (let i = 0, len = items.length; i < len; i++) {
                let item = items[i] as IFormItemStore;

                if (!item.validated || forceValidate) {
                    yield item.validate();
                }
            }

            if (hooks && hooks.length) {
                for (let i = 0, len = hooks.length; i < len; i++ ) {
                    yield hooks[i]();
                }
            }

            self.validating = false;
            return self.valid;
        });

        const validateFields: (fields:Array<string>) => Promise<boolean> = flow(function *validateFields(fields:Array<string>) {
            self.validating = true;
            const items = self.items.concat();
            let result:Array<boolean> = [];
            for (let i = 0, len = items.length; i < len; i++) {
                let item = items[i] as IFormItemStore;

                if (~fields.indexOf(item.name)) {
                    result.push(yield item.validate());
                }
            }
            self.validating = false;
            return result.every(item => item);
        });

        function reset(cb?: (data:any) => void) {
            self.data = self.pristine;

            // 值可能变了，重新验证一次。
            self.validated = false;
            self.items.forEach(item => item.reset());
            cb && cb(self.data);
        }

        function registryItem(name:string, options?: Partial<SFormItemStore> & {
            value?: any;
        }):IFormItemStore {
            let item: IFormItemStore;

            self.items.push({
                identifier: guid(),
                name
            } as any);

            item = self.items[self.items.length - 1] as IFormItemStore;

            // 默认值可能在原型上，把他挪到当前对象上。
            setValueByName(item.name, item.value);

            options && item.config(options);

            return item;
        }

        function unRegistryItem(item:IFormItemStore) {
            detach(item);
        }

        function beforeDetach() {
            // 本来是想在组件销毁的时候处理，
            // 但是 componentWillUnmout 是父级先执行，form 都销毁了 formItem 就取不到 父级就不是 combo 了。
            if (self.parentStore && self.parentStore.storeType === 'ComboStore') {
                const combo = self.parentStore as IComboStore;
                self.items.forEach(item => {
                    if (item.unique) {
                        combo.unBindUniuqueItem(item);
                    }
                })

                combo.removeForm(self as IFormStore);
                combo.forms.forEach(item => item.items.forEach(item => item.unique && item.syncOptions()));
            }

            self.items.forEach(item => detach(item))
        }

        function setCanAccessSuperData(value:boolean = true) {
            self.canAccessSuperData = value;
        }

        function setInited(value:boolean) {
            self.inited = value;
        }


        return ({
            setInited,
            setValues,
            setValueByName,
            submit,
            validate,
            validateFields,
            saveRemote,
            reset,
            registryItem,
            unRegistryItem,
            beforeDetach,
            syncOptions,
            setCanAccessSuperData,
            deleteValueByName
        });
    });

export type IFormStore = typeof FormStore.Type;
export {
    IFormItemStore
};
