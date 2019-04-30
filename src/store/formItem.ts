import {
    types,
    getParent,
    SnapshotIn,
    flow,
    getRoot
} from "mobx-state-tree";
import {
    FormStore,
    IFormStore
} from './form';
import {
    str2rules,
    validate as doValidate
} from '../utils/validations';
import {
    Api,
    Payload,
    fetchOptions
} from '../types';
import { ComboStore, IComboStore, IUniqueGroup } from './combo';
import { evalExpression } from "../utils/tpl";
import findIndex = require('lodash/findIndex');
import {
    isArrayChilrenModified,
    hasOwnProperty,
    isObject
} from '../utils/helper';
import {
    flattenTree
} from '../utils/helper';
import { IRendererStore } from ".";
import { normalizeOptions } from "../components/Select";

interface IOption {
    value?: string | number | null;
    label?: string | null;
    children?: IOption[] | null;
    disabled?: boolean | null;
    visible?: boolean | null;
    hidden?: boolean | null;
}

const ErrorDetail = types.model('ErrorDetail', {
    msg: '',
    tag: ''
})


export const FormItemStore = types
    .model('FormItemStore', {
        identifier: types.identifier,
        type: '',
        unique: false,
        loading: false,
        required: false,
        rules: types.optional(types.frozen(), {}),
        messages: types.optional(types.frozen(), {}),
        errorData: types.optional(types.array(ErrorDetail), []),
        name: types.string,
        id: '', // 因为 name 可能会重名，所以加个 id 进来，如果有需要用来定位具体某一个
        unsetValueOnInvisible: false,
        validated: false,
        validating: false,
        multiple: false,
        delimiter: ',',
        valueField: 'value',
        labelField: 'label',
        joinValues: true,
        extractValue: false,
        options: types.optional(types.array(types.frozen()), []),
        selectedOptions: types.optional(types.frozen(), []),
        filteredOptions: types.optional(types.frozen(), []),
    })
    .views(self => {
        function getForm():IFormStore {
            return getParent(self, 2) as IFormStore;
        }

        function getValue():any {
            return getForm().getValueByName(self.name);
        }

        function getLastOptionValue():any {
            if (self.selectedOptions.length) {
                return self.selectedOptions[self.selectedOptions.length-1].value;
            }

            return '';
        }

        function getErrors():Array<string> {
            return self.errorData.map(item => item.msg);
        }

        // function selectedOptions(options:Array<Option>=(self.options as any).toJS()) {
        //     return value2array(getValue(), {
        //         multiple: self.multiple,
        //         delimiter: self.delimiter,
        //         valueField: self.valueField,
        //         options: options
        //     })
        // }

        // function filteredOptions(data:object):Array<IOption> {
        //     let options:Array<IOption> = self.options;
        //     options = options.filter(item => {
        //         let filtered = getExprProperties(item, data);
        //         return filtered.visible !== false && !filtered.hidden;
        //     });

        //     let parentStore = getForm().parentStore;
        //     if (parentStore && parentStore.storeType === ComboStore.name) {
        //         let combo = parentStore as IComboStore;
        //         let group = combo.uniques.get(self.name) as IUniqueGroup;
        //         let selectedOptions:Array<any> = [];
        //         group && group.items.forEach(item => {
        //             if (self !== item) {
        //                 selectedOptions.push(...item.selectedOptions().map(item => item.value))
        //             }
        //         });

        //         if (selectedOptions.length) {
        //             options = options.filter(option => !~selectedOptions.indexOf(option.value))
        //         }
        //     }

        //     return options;
        // }


        return {
            get form():IFormStore {
                return getForm();
            },

            get value():any {
                return getValue();
            },

            get prinstine():any {
                return (getParent(self, 2) as IFormStore).getPristineValueByName(self.name);
            },

            get errors() {
                return getErrors();
            },

            get valid() {
                const errors = getErrors();
                return !!(!errors || !errors.length);
            },

            get lastSelectValue():string {
                return getLastOptionValue();
            },

            // selectedOptions,
            // filteredOptions,

            getSelectedOptions(value:any = getValue()) {
                if (value === getValue()) {
                    return self.selectedOptions;
                } else if (typeof value === 'undefined') {
                    return [];
                }

                const selected = Array.isArray(value) ? value.map(item=>item && item.hasOwnProperty(self.valueField || 'value') ? item[self.valueField || 'value'] : item) 
                : typeof value === 'string' ? value.split(self.delimiter || ',') : [value && value.hasOwnProperty(self.valueField || 'value') ? value[self.valueField || 'value'] : value];
                const selectedOptions:Array<any> = [];
                
                self.filteredOptions.forEach((item:any) => {
                    let idx = findIndex(selected, seleced => {
                        return isObject(seleced) ? seleced === item[self.valueField || 'value'] :String(item[self.valueField || 'value']) === String(seleced)
                    });

                    if (~idx) {
                        selected.splice(idx, 1);
                        selectedOptions.push(item);
                    }
                });
                
                selected.forEach((item, index) => {
                    let unMatched = value && value[index] || item;

                    if (unMatched && (typeof unMatched === 'string' || typeof unMatched === 'number')) {
                        unMatched = {
                            [self.valueField || 'value']: item,
                            [self.labelField || 'label']: item,
                        }
                    }
                    
                    unMatched && selectedOptions.push(unMatched);
                });

                return selectedOptions;
            }
        };
    })

    .actions(self => {
        function config({
            required,
            unique,
            value,
            rules,
            messages,
            delimiter,
            multiple,
            valueField,
            labelField,
            joinValues,
            extractValue,
            type,
            id,
        }: {
            required?: any;
            unique?: any;
            value?: any;
            rules?: string | {[propName:string]: any};
            messages?: {[propName:string]: string};
            multiple?: boolean;
            delimiter?: string;
            valueField?: string;
            labelField?: string;
            joinValues?: boolean;
            extractValue?: boolean;
            type?: string;
            id?: string;
        }) {
            const form = self.form;

            if (typeof rules === 'string') {
                rules = str2rules(rules);
            }

            typeof type !== 'undefined' && (self.type = type);
            typeof id !== 'undefined' && (self.id = id);
            typeof messages !== 'undefined' && (self.messages = messages);
            typeof required !== 'undefined' && (self.required = !!required);
            typeof unique !== 'undefined' && (self.unique = !!unique);
            typeof multiple !== 'undefined' && (self.multiple = !!multiple);
            typeof joinValues !== 'undefined' && (self.joinValues = !!joinValues);
            typeof extractValue !== 'undefined' && (self.extractValue = !!extractValue);
            typeof delimiter !== 'undefined' && (self.delimiter = delimiter as string || ',');
            typeof valueField !== 'undefined' && (self.valueField = valueField as string || 'value');
            typeof labelField !== 'undefined' && (self.labelField = labelField as string || 'label');

            if (self.required) {
                rules = rules || {};
                rules = {
                    ...rules,
                    isRequired: true
                };
            }

            rules && (self.rules = rules);

            if (
                typeof value !== 'undefined' && !hasOwnProperty(form.data, self.name)
            ) {
                form.setValueByName(self.name, value, true);
            }
        }

        function changeValue(value:any, isPrintine:boolean = false) {
            if(typeof value === 'undefined' || value === '__undefined'){
                self.form.deleteValueByName(self.name)
            } else {
                self.form.setValueByName(self.name, value, isPrintine);
            }
        }

        const validate:(hook?:any) => Promise<boolean> = flow(function *validate(hook?:any) {
            if (self.validating) {
                return self.valid;
            }

            self.validating = true;
            clearError();
            if (hook) {
                yield hook();
            }

            addError(doValidate(self.value, self.form.data, self.rules, self.messages));
            self.validated = true;

            if (self.unique && self.form.parentStore && self.form.parentStore.storeType === 'ComboStore') {
                const combo = self.form.parentStore as IComboStore;
                const group =combo.uniques.get(self.name) as IUniqueGroup;

                if (group.items.some(item => item !== self && self.value && item.value === self.value)) {
                    addError(`当前值不唯一`);
                }
            }

            self.validating = false;
            return self.valid;
        });

        function setError(msg:string|Array<string>, tag:string = "bultin") {
            clearError();
            addError(msg, tag);
        }

        function addError(msg:string | Array<string>, tag: string = "bultin") {
            const msgs:Array<string> = Array.isArray(msg) ? msg : [msg];
            msgs.forEach(item => self.errorData.push({
                msg: item,
                tag: tag
            }));
        }

        function clearError(tag?:string) {
            if (tag) {
                const filtered = self.errorData.filter(item => item.tag !== tag);
                self.errorData.replace(filtered);
            } else {
                self.errorData.clear();
            }
        }

        function setOptions(options:Array<object>) {
            if (!Array.isArray(options)) {
                return;
            }
            options = options.filter(item => item);
            options.length ? self.options.replace(options) : self.options.clear();
            syncOptions();
        }

        let loadCancel:Function | null = null;
        const loadOptions:(api:Api, data?:object, options?:fetchOptions, clearValue?:boolean, onChange?: (value:any) => void) => Promise<any> = flow(function *getInitData(api:string, data:object, options?:fetchOptions, clearValue?:any, onChange?: (value:any) => void) {
            try {
                if (loadCancel) {
                    loadCancel();
                    loadCancel = null;
                    self.loading = false;
                }

                self.loading = true;

                const json:Payload = yield (getRoot(self) as IRendererStore).fetcher(api, data, {
                    autoAppend: false,
                    cancelExecutor: (executor:Function) => loadCancel = executor,
                    ...options
                });
                loadCancel = null;

                if (!json.ok) {
                    setError(`加载选项失败，原因：${json.msg || options && options.errorMessage}`);
                    (getRoot(self) as IRendererStore).notify('error', self.errors.join(''));
                } else {
                    clearError();
                    let options:Array<IOption> = json.data.options || json.data.items || json.data.rows || json.data || [];
                    options = normalizeOptions(options as any);
                    setOptions(options);
                    
                    if (json.data && typeof (json.data as any).value !== "undefined") {
                        onChange && onChange((json.data as any).value);
                    } else if (clearValue) {
                        self.selectedOptions.some((item:any) => item.__unmatched) && onChange && onChange('');
                    }
                }

                self.loading = false;
                return json;
            } catch(e) {
                const root = getRoot(self) as IRendererStore;
                if (root.storeType !== 'RendererStore') {
                    // 已经销毁了，不管这些数据了。
                    return;
                }

                self.loading = false;

                if (root.isCancel(e)) {
                    return;
                }

                console.error(e.stack);
                getRoot(self) && (getRoot(self) as IRendererStore).notify('error', e.message);
            }
        });

        function syncOptions() {
            if (!self.options.length && typeof self.value === 'undefined') {
                self.selectedOptions = [];
                self.filteredOptions = [];
                return;
            }

            const form = self.form;
            const value = self.value;
            const selected = Array.isArray(value) ? value.map(item=>item && item.hasOwnProperty(self.valueField || 'value') ? item[self.valueField || 'value'] : item) 
                : typeof value === 'string' ? value.split(self.delimiter || ',') : [value && value.hasOwnProperty(self.valueField || 'value') ? value[self.valueField || 'value'] : value];
            let filteredOptions = self.options
                .filter((item:any) => 
                    item.visibleOn ? evalExpression(item.visibleOn, form.data) !== false
                    : item.hiddenOn ? evalExpression(item.hiddenOn, form.data) !== true
                    : (item.visible !== false || item.hidden !== true)
                )
                .map((item:any, index) => {
                    
                    const disabled = evalExpression(item.disabledOn, form.data);
                    const newItem = item.disabledOn
                    ? (
                        self.filteredOptions.length > index && self.filteredOptions[index].disabled === disabled 
                        ? self.filteredOptions[index]
                        : {
                            ...item,
                            disabled: disabled
                        }
                    ) 
                    : item;

                    return newItem;
                });

            const flattened:Array<any> = flattenTree(filteredOptions);
            const selectedOptions:Array<any> = [];
            
            selected.forEach((item, index) => {
                let idx = findIndex(flattened, target => {
                    return isObject(item) ? item === target[self.valueField || 'value'] : String(target[self.valueField || 'value']) === String(item)
                });

                if (~idx) {
                    selectedOptions.push(flattened[idx]);
                } else {
                    let unMatched = value && value[index] || item;

                    if (unMatched && (typeof unMatched === 'string' || typeof unMatched === 'number')) {
                        unMatched = {
                            [self.valueField || 'value']: item,
                            [self.labelField || 'label']: item,
                            __unmatched: true
                        }
                    }
                    
                    unMatched && selectedOptions.push(unMatched);
                }
            });

            let parentStore = form.parentStore;
            if (parentStore && parentStore.storeType === ComboStore.name) {
                let combo = parentStore as IComboStore;
                let group = combo.uniques.get(self.name) as IUniqueGroup;
                let options:Array<any> = [];
                group && group.items.forEach(item => {
                    if (self !== item) {
                        options.push(...item.selectedOptions.map((item:any) => item && item.value))
                    }
                });

                if (filteredOptions.length) {
                    filteredOptions = filteredOptions.filter(option => !~options.indexOf(option.value))
                }
            }
            isArrayChilrenModified(self.selectedOptions, selectedOptions) && (self.selectedOptions = selectedOptions);
            isArrayChilrenModified(self.filteredOptions, filteredOptions) && (self.filteredOptions = filteredOptions);
        }

        function setLoading(value:boolean) {
            self.loading = value;
        }

        function reset() {
            self.validated = false;
            clearError();
        }

        return {
            config,
            changeValue,
            validate,
            setError,
            addError,
            clearError,
            setOptions,
            loadOptions,
            syncOptions,
            setLoading,
            reset
        }
    });


export type IFormItemStore = typeof FormItemStore.Type;
export type SFormItemStore = SnapshotIn<typeof FormItemStore>;
