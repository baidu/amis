import {
  types,
  getParent,
  SnapshotIn,
  flow,
  getRoot,
  hasParent,
  isAlive,
  getEnv,
  Instance
} from 'mobx-state-tree';
import {IFormStore} from './form';
import {str2rules, validate as doValidate} from '../utils/validations';
import {Api, Payload, fetchOptions} from '../types';
import {ComboStore, IComboStore, IUniqueGroup} from './combo';
import {evalExpression} from '../utils/tpl';
import findIndex from 'lodash/findIndex';
import {
  isArrayChildrenModified,
  isObject,
  createObject,
  isObjectShallowModified,
  findTree,
  findTreeIndex,
  spliceTree,
  isEmpty
} from '../utils/helper';
import {flattenTree} from '../utils/helper';
import {IRendererStore} from '.';
import {normalizeOptions, optionValueCompare} from '../components/Select';
import find from 'lodash/find';
import {SimpleMap} from '../utils/SimpleMap';
import memoize from 'lodash/memoize';
import {TranslateFn} from '../locale';
import {StoreNode} from './node';
import {dataMapping} from '../utils/tpl-builtin';
import {getStoreById} from './manager';

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
});

export const FormItemStore = StoreNode.named('FormItemStore')
  .props({
    isFocused: false,
    type: '',
    unique: false,
    loading: false,
    required: false,
    tmpValue: types.frozen(),
    rules: types.optional(types.frozen(), {}),
    messages: types.optional(types.frozen(), {}),
    errorData: types.optional(types.array(ErrorDetail), []),
    name: types.string,
    itemId: '', // 因为 name 可能会重名，所以加个 id 进来，如果有需要用来定位具体某一个
    unsetValueOnInvisible: false,
    itemsRef: types.optional(types.array(types.string), []),
    validated: false,
    validating: false,
    multiple: false,
    delimiter: ',',
    valueField: 'value',
    labelField: 'label',
    joinValues: true,
    extractValue: false,
    options: types.optional(types.array(types.frozen()), []),
    expressionsInOptions: false,
    selectFirst: false,
    autoFill: types.frozen(),
    deleteOnHidden: false,
    selectedOptions: types.optional(types.frozen(), []),
    filteredOptions: types.optional(types.frozen(), []),
    dialogSchema: types.frozen(),
    dialogOpen: false,
    dialogData: types.frozen()
  })
  .views(self => {
    function getForm(): any {
      return self.parentStore;
    }

    function getValue(): any {
      return getForm()?.getValueByName(self.name);
    }

    function getLastOptionValue(): any {
      if (self.selectedOptions.length) {
        return self.selectedOptions[self.selectedOptions.length - 1].value;
      }

      return '';
    }

    function getErrors(): Array<string> {
      return self.errorData.map(item => item.msg);
    }

    return {
      get subFormItems(): any {
        return self.itemsRef.map(item => getStoreById(item));
      },

      get form(): any {
        return getForm();
      },

      get value(): any {
        return getValue();
      },

      get prinstine(): any {
        return (getForm() as IFormStore).getPristineValueByName(self.name);
      },

      get errors() {
        return getErrors();
      },

      get valid() {
        const errors = getErrors();
        return !!(!errors || !errors.length);
      },

      get lastSelectValue(): string {
        return getLastOptionValue();
      },

      getSelectedOptions: (value: any = getValue()) => {
        if (typeof value === 'undefined') {
          return [];
        }

        const valueArray = Array.isArray(value)
          ? value
          : typeof value === 'string'
          ? value.split(self.delimiter || ',')
          : [value];

        const selected = valueArray.map(item =>
          item && item.hasOwnProperty(self.valueField || 'value')
            ? item[self.valueField || 'value']
            : item
        );

        // Array.isArray(value)
        //   ? value.map(item =>
        //       item && item.hasOwnProperty(self.valueField || 'value')
        //         ? item[self.valueField || 'value']
        //         : item
        //     )
        //   : typeof value === 'string'
        //   ? value.split(self.delimiter || ',')
        //   : [
        //       value && value.hasOwnProperty(self.valueField || 'value')
        //         ? value[self.valueField || 'value']
        //         : value
        //     ];

        // // 保留原来的 label 信息，如果原始值中有 label。
        // if (
        //   value &&
        //   value.hasOwnProperty(self.labelField || 'label') &&
        //   !selected[0].hasOwnProperty(self.labelField || 'label')
        // ) {
        //   selected[0] = {
        //     [self.labelField || 'label']: value[self.labelField || 'label'],
        //     [self.valueField || 'value']: value[self.valueField || 'value']
        //   };
        // }

        const selectedOptions: Array<any> = [];

        selected.forEach((item, index) => {
          const matched = findTree(
            self.filteredOptions,
            optionValueCompare(item, self.valueField || 'value')
          );

          if (matched) {
            selectedOptions.push(matched);
          } else {
            let unMatched = (valueArray && valueArray[index]) || item;

            if (
              unMatched &&
              (typeof unMatched === 'string' || typeof unMatched === 'number')
            ) {
              unMatched = {
                [self.valueField || 'value']: item,
                [self.labelField || 'label']: item,
                __unmatched: true
              };
            } else if (unMatched && self.extractValue) {
              unMatched = {
                [self.valueField || 'value']: item,
                [self.labelField || 'label']: 'UnKnown',
                __unmatched: true
              };
            }

            unMatched && selectedOptions.push(unMatched);
          }
        });

        return selectedOptions;
      }
    };
  })

  .actions(self => {
    const form = self.form as IFormStore;
    const dialogCallbacks = new SimpleMap<(result?: any) => void>();

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
      selectFirst,
      autoFill,
      deleteOnHidden
    }: {
      required?: boolean;
      unique?: boolean;
      value?: any;
      rules?: string | {[propName: string]: any};
      messages?: {[propName: string]: string};
      multiple?: boolean;
      delimiter?: string;
      valueField?: string;
      labelField?: string;
      joinValues?: boolean;
      extractValue?: boolean;
      type?: string;
      id?: string;
      selectFirst?: boolean;
      autoFill?: any;
      deleteOnHidden?: boolean;
    }) {
      if (typeof rules === 'string') {
        rules = str2rules(rules);
      }

      typeof type !== 'undefined' && (self.type = type);
      typeof id !== 'undefined' && (self.itemId = id);
      typeof messages !== 'undefined' && (self.messages = messages);
      typeof required !== 'undefined' && (self.required = !!required);
      typeof unique !== 'undefined' && (self.unique = !!unique);
      typeof multiple !== 'undefined' && (self.multiple = !!multiple);
      typeof selectFirst !== 'undefined' && (self.selectFirst = !!selectFirst);
      typeof autoFill !== 'undefined' && (self.autoFill = autoFill);
      typeof joinValues !== 'undefined' && (self.joinValues = !!joinValues);
      typeof extractValue !== 'undefined' &&
        (self.extractValue = !!extractValue);
      typeof delimiter !== 'undefined' &&
        (self.delimiter = (delimiter as string) || ',');
      typeof valueField !== 'undefined' &&
        (self.valueField = (valueField as string) || 'value');
      typeof labelField !== 'undefined' &&
        (self.labelField = (labelField as string) || 'label');
      typeof deleteOnHidden !== 'undefined' &&
        (self.deleteOnHidden = !!deleteOnHidden);

      rules = rules || {};
      rules = {
        ...rules,
        isRequired: self.required
      };

      if (isObjectShallowModified(rules, self.rules)) {
        self.rules = rules;
        clearError('bultin');
        self.validated = false;
      }

      if (value !== void 0 && self.value === void 0) {
        form.setValueByName(self.name, value, true);
      }
    }

    function focus() {
      self.isFocused = true;
    }

    function blur() {
      self.isFocused = false;
    }

    function changeValue(value: any, isPrintine: boolean = false) {
      if (typeof value === 'undefined' || value === '__undefined') {
        self.form.deleteValueByName(self.name);
      } else {
        self.form.setValueByName(self.name, value, isPrintine);
      }

      syncAutoFill(value, isPrintine);
    }

    const validate: (hook?: any) => Promise<boolean> = flow(function* validate(
      hook?: any
    ) {
      if (self.validating) {
        return self.valid;
      }

      self.validating = true;
      clearError();
      if (hook) {
        yield hook();
      }

      addError(
        doValidate(
          self.value,
          self.form.data,
          self.rules,
          self.messages,
          self.__
        )
      );
      self.validated = true;

      if (
        self.unique &&
        self.form.parentStore &&
        self.form.parentStore.storeType === 'ComboStore'
      ) {
        const combo = self.form.parentStore as IComboStore;
        const group = combo.uniques.get(self.name) as IUniqueGroup;

        if (
          group.items.some(
            item => item !== self && self.value && item.value === self.value
          )
        ) {
          addError(self.__('`当前值不唯一`'));
        }
      }

      self.validating = false;
      return self.valid;
    });

    function setError(msg: string | Array<string>, tag: string = 'bultin') {
      clearError();
      addError(msg, tag);
    }

    function addError(msg: string | Array<string>, tag: string = 'bultin') {
      const msgs: Array<string> = Array.isArray(msg) ? msg : [msg];
      msgs.forEach(item =>
        self.errorData.push({
          msg: item,
          tag: tag
        })
      );
    }

    function clearError(tag?: string) {
      if (tag) {
        const filtered = self.errorData.filter(item => item.tag !== tag);
        self.errorData.replace(filtered);
      } else {
        self.errorData.clear();
      }
    }

    function getFirstAvaibleOption(options: Array<any>): any {
      if (!Array.isArray(options)) {
        return;
      }

      for (let option of options) {
        if (option[self.valueField || 'value'] && !option.disabled) {
          return option;
        } else if (Array.isArray(option.children)) {
          const childFirst = getFirstAvaibleOption(option.children);
          if (childFirst !== undefined) {
            return childFirst;
          }
        }
      }
    }

    function setOptions(
      options: Array<object>,
      onChange?: (value: any) => void
    ) {
      if (!Array.isArray(options)) {
        return;
      }
      options = options.filter(item => item);
      const originOptions = self.options.concat();
      options.length ? self.options.replace(options) : self.options.clear();
      syncOptions(originOptions);
      let selectedOptions;

      if (
        self.selectFirst &&
        self.filteredOptions.length &&
        (selectedOptions = self.getSelectedOptions(self.value)) &&
        !selectedOptions.filter(item => !item.__unmatched).length
      ) {
        const fistOption = getFirstAvaibleOption(self.filteredOptions);
        if (!fistOption) {
          return;
        }

        const list = [fistOption].map((item: any) => {
          if (self.extractValue || self.joinValues) {
            return item[self.valueField || 'value'];
          }

          return item;
        });

        const value = self.joinValues
          ? list.join(self.delimiter)
          : self.multiple
          ? list
          : list[0];

        if (form.inited && onChange) {
          onChange(value);
        } else {
          changeValue(value, !form.inited);
        }
      }
    }

    let loadCancel: Function | null = null;
    const fetchOptions: (
      api: Api,
      data?: object,
      config?: fetchOptions,
      setErrorFlag?: boolean
    ) => Promise<Payload | null> = flow(function* getInitData(
      api: string,
      data: object,
      config?: fetchOptions,
      setErrorFlag?: boolean
    ) {
      try {
        if (loadCancel) {
          loadCancel();
          loadCancel = null;
          self.loading = false;
        }

        self.loading = true;

        const json: Payload = yield getEnv(self).fetcher(api, data, {
          autoAppend: false,
          cancelExecutor: (executor: Function) => (loadCancel = executor),
          ...config
        });
        loadCancel = null;
        let result: any = null;

        if (!json.ok) {
          setErrorFlag !== false &&
            setError(
              self.__('Form.loadOptionsFailed', {
                reason: json.msg || (config && config.errorMessage)
              })
            );
          getEnv(self).notify(
            'error',
            self.errors.join(''),
            json.msgTimeout !== undefined
              ? {
                  closeButton: true,
                  timeout: json.msgTimeout
                }
              : undefined
          );
        } else {
          result = json;
        }

        self.loading = false;
        return result;
      } catch (e) {
        const env = getEnv(self);

        if (!isAlive(self) || self.disposed) {
          return;
        }

        self.loading = false;
        if (env.isCancel(e)) {
          return;
        }

        console.error(e.stack);
        env.notify('error', e.message);
        return;
      }
    } as any);

    const loadOptions: (
      api: Api,
      data?: object,
      config?: fetchOptions,
      clearValue?: boolean,
      onChange?: (value: any) => void,
      setErrorFlag?: boolean
    ) => Promise<Payload | null> = flow(function* getInitData(
      api: string,
      data: object,
      config?: fetchOptions,
      clearValue?: any,
      onChange?: (
        value: any,
        submitOnChange?: boolean,
        changeImmediately?: boolean
      ) => void,
      setErrorFlag?: boolean
    ) {
      let json = yield fetchOptions(api, data, config, setErrorFlag);
      if (!json) {
        return;
      }

      clearError();
      self.validated = false; // 拉完数据应该需要再校验一下

      let options: Array<IOption> =
        json.data?.options ||
        json.data.items ||
        json.data.rows ||
        json.data ||
        [];

      options = normalizeOptions(options as any);
      setOptions(options, onChange);

      if (json.data && typeof (json.data as any).value !== 'undefined') {
        onChange && onChange((json.data as any).value, false, true);
      } else if (clearValue && !self.selectFirst) {
        self.selectedOptions.some((item: any) => item.__unmatched) &&
          onChange &&
          onChange('', false, true);
      }

      return json;
    });

    const deferLoadOptions: (
      option: any,
      api: Api,
      data?: object,
      config?: fetchOptions
    ) => Promise<Payload | null> = flow(function* getInitData(
      option: any,
      api: string,
      data: object,
      config?: fetchOptions
    ) {
      const indexes = findTreeIndex(self.options, item => item === option);
      if (!indexes) {
        return;
      }

      setOptions(
        spliceTree(self.options, indexes, 1, {
          ...option,
          loading: true
        })
      );

      let json = yield fetchOptions(api, data, config, false);
      if (!json) {
        setOptions(
          spliceTree(self.options, indexes, 1, {
            ...option,
            loading: false,
            error: true
          })
        );
        return;
      }

      let options: Array<IOption> =
        json.data?.options ||
        json.data.items ||
        json.data.rows ||
        json.data ||
        [];

      setOptions(
        spliceTree(self.options, indexes, 1, {
          ...option,
          loading: false,
          loaded: true,
          children: options
        })
      );

      return json;
    });

    function syncOptions(originOptions?: Array<any>) {
      if (!self.options.length && typeof self.value === 'undefined') {
        self.selectedOptions = [];
        self.filteredOptions = [];
        return;
      }

      const form = self.form;
      const value = self.value;

      // 有可能销毁了
      if (!form) {
        return;
      }

      const selected = Array.isArray(value)
        ? value.map(item =>
            item && item.hasOwnProperty(self.valueField || 'value')
              ? item[self.valueField || 'value']
              : item
          )
        : typeof value === 'string'
        ? value.split(self.delimiter || ',')
        : value === void 0
        ? []
        : [
            value && value.hasOwnProperty(self.valueField || 'value')
              ? value[self.valueField || 'value']
              : value
          ];

      if (value && value.hasOwnProperty(self.labelField || 'label')) {
        selected[0] = {
          [self.labelField || 'label']: value[self.labelField || 'label'],
          [self.valueField || 'value']: value[self.valueField || 'value']
        };
      }

      let expressionsInOptions = false;
      let filteredOptions = self.options
        .filter((item: any) => {
          if (!expressionsInOptions && (item.visibleOn || item.hiddenOn)) {
            expressionsInOptions = true;
          }

          return item.visibleOn
            ? evalExpression(item.visibleOn, form.data) !== false
            : item.hiddenOn
            ? evalExpression(item.hiddenOn, form.data) !== true
            : item.visible !== false || item.hidden !== true;
        })
        .map((item: any, index) => {
          const disabled = evalExpression(item.disabledOn, form.data);
          const newItem = item.disabledOn
            ? self.filteredOptions.length > index &&
              self.filteredOptions[index].disabled === disabled
              ? self.filteredOptions[index]
              : {
                  ...item,
                  disabled: disabled
                }
            : item;

          return newItem;
        });

      self.expressionsInOptions = expressionsInOptions;
      const flattened: Array<any> = flattenTree(filteredOptions);
      const selectedOptions: Array<any> = [];

      selected.forEach((item, index) => {
        let idx = findIndex(
          flattened,
          optionValueCompare(item, self.valueField || 'value')
        );

        if (~idx) {
          selectedOptions.push(flattened[idx]);
        } else {
          let unMatched = (value && value[index]) || item;

          if (
            unMatched &&
            (typeof unMatched === 'string' || typeof unMatched === 'number')
          ) {
            unMatched = {
              [self.valueField || 'value']: item,
              [self.labelField || 'label']: item,
              __unmatched: true
            };

            const orgin: any =
              originOptions &&
              find(
                originOptions,
                optionValueCompare(item, self.valueField || 'value')
              );

            if (orgin) {
              unMatched[self.labelField || 'label'] =
                orgin[self.labelField || 'label'];
            }
          } else if (unMatched && self.extractValue) {
            unMatched = {
              [self.valueField || 'value']: item,
              [self.labelField || 'label']: 'UnKnown',
              __unmatched: true
            };
          }

          unMatched && selectedOptions.push(unMatched);
        }
      });

      let parentStore = form.parentStore;
      if (parentStore && parentStore.storeType === ComboStore.name) {
        let combo = parentStore as IComboStore;
        let group = combo.uniques.get(self.name) as IUniqueGroup;
        let options: Array<any> = [];
        group &&
          group.items.forEach(item => {
            if (self !== item) {
              options.push(
                ...item.selectedOptions.map((item: any) => item && item.value)
              );
            }
          });

        if (filteredOptions.length) {
          filteredOptions = filteredOptions.filter(
            option => !~options.indexOf(option.value)
          );
        }
      }
      isArrayChildrenModified(self.selectedOptions, selectedOptions) &&
        (self.selectedOptions = selectedOptions);
      isArrayChildrenModified(self.filteredOptions, filteredOptions) &&
        (self.filteredOptions = filteredOptions);
    }

    function setLoading(value: boolean) {
      self.loading = value;
    }

    let subStore: any;
    function getSubStore() {
      return subStore;
    }

    function setSubStore(store: any) {
      subStore = store;
    }

    function reset() {
      self.validated = false;

      if (subStore && subStore.storeType === 'ComboStore') {
        const combo = subStore as IComboStore;
        combo.forms.forEach(form => form.reset());
      }

      clearError();
    }

    function openDialog(
      schema: any,
      data: any = form.data,
      callback?: (ret?: any) => void
    ) {
      self.dialogSchema = schema;
      self.dialogData = data;
      self.dialogOpen = true;
      callback && dialogCallbacks.set(self.dialogData, callback);
    }

    function closeDialog(result?: any) {
      const callback = dialogCallbacks.get(self.dialogData);
      self.dialogOpen = false;

      if (callback) {
        dialogCallbacks.delete(self.dialogData);
        setTimeout(() => callback(result), 200);
      }
    }

    function syncAutoFill(
      value: any = self.value,
      isPrintine: boolean = false
    ) {
      if (
        !self.multiple &&
        self.autoFill &&
        !isEmpty(self.autoFill) &&
        self.options.length
      ) {
        const selectedOptions = self.getSelectedOptions(value);
        if (selectedOptions.length !== 1) {
          return;
        }

        const toSync = dataMapping(self.autoFill, selectedOptions[0]);
        Object.keys(toSync).forEach(key => {
          const value = toSync[key];

          if (typeof value === 'undefined' || value === '__undefined') {
            self.form.deleteValueByName(key);
          } else {
            self.form.setValueByName(key, value, isPrintine);
          }
        });
      }
    }

    function changeTmpValue(value: any) {
      self.tmpValue = value;
    }

    function addSubFormItem(item: IFormItemStore) {
      self.itemsRef.push(item.id);
    }

    function removeSubFormItem(item: IFormItemStore) {
      const idx = self.itemsRef.findIndex(a => a === item.id);
      if (~idx) {
        self.itemsRef.splice(idx, 1);
      }
    }

    return {
      focus,
      blur,
      config,
      changeValue,
      validate,
      setError,
      addError,
      clearError,
      setOptions,
      loadOptions,
      deferLoadOptions,
      syncOptions,
      setLoading,
      setSubStore,
      getSubStore,
      reset,
      openDialog,
      closeDialog,
      syncAutoFill,
      changeTmpValue,
      addSubFormItem,
      removeSubFormItem
    };
  });

export type IFormItemStore = Instance<typeof FormItemStore>;
export type SFormItemStore = SnapshotIn<typeof FormItemStore>;
