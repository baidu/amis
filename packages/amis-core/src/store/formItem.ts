import {
  types,
  SnapshotIn,
  flow,
  isAlive,
  getEnv,
  Instance
} from 'mobx-state-tree';
import isEqualWith from 'lodash/isEqualWith';
import {FormStore, IFormStore} from './form';
import {str2rules, validate as doValidate} from '../utils/validations';
import {Api, Payload, fetchOptions} from '../types';
import {ComboStore, IComboStore, IUniqueGroup} from './combo';
import {evalExpression} from '../utils/tpl';
import {buildApi, isEffectiveApi} from '../utils/api';
import findIndex from 'lodash/findIndex';
import {
  isArrayChildrenModified,
  createObject,
  isObjectShallowModified,
  findTree,
  findTreeIndex,
  spliceTree,
  filterTree
} from '../utils/helper';
import {flattenTree} from '../utils/helper';
import find from 'lodash/find';
import isPlainObject from 'lodash/isPlainObject';
import {SimpleMap} from '../utils/SimpleMap';
import {StoreNode} from './node';
import {getStoreById} from './manager';
import {normalizeOptions} from '../utils/normalizeOptions';
import {optionValueCompare} from '../utils/optionValueCompare';

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
  tag: '',
  rule: ''
});

export const FormItemStore = StoreNode.named('FormItemStore')
  .props({
    isFocused: false,
    type: '',
    label: '',
    unique: false,
    loading: false,
    required: false,
    tmpValue: types.frozen(),
    emitedValue: types.frozen(),
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
    options: types.optional(types.frozen<Array<any>>(), []),
    expressionsInOptions: false,
    selectFirst: false,
    autoFill: types.frozen(),
    clearValueOnHidden: false,
    validateApi: types.optional(types.frozen(), ''),
    selectedOptions: types.optional(types.frozen(), []),
    filteredOptions: types.optional(types.frozen(), []),
    dialogSchema: types.frozen(),
    dialogOpen: false,
    dialogData: types.frozen(),
    resetValue: types.optional(types.frozen(), ''),
    validateOnChange: false
  })
  .views(self => {
    function getForm(): any {
      const form = self.parentStore;
      return form?.storeType === FormStore.name ? form : undefined;
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
        return (getForm() as IFormStore)?.getPristineValueByName(self.name);
      },

      get errors() {
        return getErrors();
      },

      get valid() {
        const errors = getErrors();
        return !!(!errors || !errors.length);
      },

      get errClassNames() {
        return self.errorData
          .map(item => item.rule)
          .filter((item, index, arr) => item && arr.indexOf(item) === index)
          .map(item => `has-error--${item}`)
          .join(' ');
      },

      get lastSelectValue(): string {
        return getLastOptionValue();
      },

      getSelectedOptions: (
        value: any = self.tmpValue,
        nodeValueArray?: any[] | undefined
      ) => {
        if (typeof value === 'undefined') {
          return [];
        }

        const valueArray = nodeValueArray
          ? nodeValueArray
          : Array.isArray(value)
          ? value
          : typeof value === 'string'
          ? value.split(self.delimiter || ',')
          : [value];
        const selected = valueArray.map(item =>
          item && item.hasOwnProperty(self.valueField || 'value')
            ? item[self.valueField || 'value']
            : item
        );

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
    let loadAutoUpdateCancel: Function | null = null;

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
      clearValueOnHidden,
      validateApi,
      maxLength,
      minLength,
      validateOnChange,
      label
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
      clearValueOnHidden?: boolean;
      validateApi?: boolean;
      minLength?: number;
      maxLength?: number;
      validateOnChange?: boolean;
      label?: string;
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
      typeof clearValueOnHidden !== 'undefined' &&
        (self.clearValueOnHidden = !!clearValueOnHidden);
      typeof validateApi !== 'undefined' && (self.validateApi = validateApi);
      typeof validateOnChange !== 'undefined' &&
        (self.validateOnChange = !!validateOnChange);
      typeof label === 'string' && (self.label = label);

      rules = {
        ...rules,
        isRequired: self.required || rules?.isRequired
      };

      // todo 这个弄个配置由渲染器自己来决定
      // 暂时先这样
      if (~['input-text', 'textarea'].indexOf(self.type)) {
        if (typeof minLength === 'number') {
          rules.minLength = minLength;
        }

        if (typeof maxLength === 'number') {
          rules.maxLength = maxLength;
        }
      }

      if (isObjectShallowModified(rules, self.rules)) {
        self.rules = rules;
        clearError('builtin');
        self.validated = false;
      }
    }

    function focus() {
      self.isFocused = true;
    }

    function blur() {
      self.isFocused = false;
    }

    let validateCancel: Function | null = null;
    const validate: (
      data: Object,
      hook?: any,
      /**
       * customRules主要是为了支持action.require的验证方式
       * 这样可以基于不同的action实现不同的校验规则
       */
      customRules?: {[propName: string]: any}
    ) => Promise<boolean> = flow(function* validate(
      data: Object,
      hook?: any,
      customRules?: {[propName: string]: any}
    ) {
      if (self.validating && !isEffectiveApi(self.validateApi, data)) {
        return self.valid;
      }

      self.validating = true;
      clearError();
      if (hook) {
        yield hook();
      }

      addError(
        doValidate(
          self.tmpValue,
          data,
          customRules ? str2rules(customRules) : self.rules,
          self.messages,
          self.__
        )
      );

      if (!self.errors.length && isEffectiveApi(self.validateApi, data)) {
        if (validateCancel) {
          validateCancel();
          validateCancel = null;
        }

        const json: Payload = yield getEnv(self).fetcher(
          self.validateApi,
          /** 如果配置validateApi，需要将用户最新输入同步到数据域内 */
          createObject(data, {[self.name]: self.tmpValue}),
          {
            cancelExecutor: (executor: Function) => (validateCancel = executor)
          }
        );
        validateCancel = null;

        if (!json.ok && json.status === 422 && json.errors) {
          addError(
            String(json.errors || json.msg || `表单项「${self.name}」校验失败`)
          );
        }
      }

      self.validated = true;

      if (self.unique && self.form?.parentStore?.storeType === 'ComboStore') {
        const combo = self.form.parentStore as IComboStore;
        const group = combo.uniques.get(self.name) as IUniqueGroup;

        if (
          group.items.some(
            item =>
              item !== self &&
              self.tmpValue !== undefined &&
              self.tmpValue !== '' &&
              item.value === self.tmpValue
          )
        ) {
          addError(self.__('Form.unique'));
        }
      }

      self.validating = false;
      return self.valid;
    });

    function setError(msg: string | Array<string>, tag: string = 'builtin') {
      clearError();
      addError(msg, tag);
    }

    function addError(
      msg:
        | string
        | Array<
            | string
            | {
                msg: string;
                rule: string;
              }
          >,
      tag: string = 'builtin'
    ) {
      const msgs: Array<
        | string
        | {
            msg: string;
            rule: string;
          }
      > = Array.isArray(msg) ? msg : [msg];
      msgs.forEach(item =>
        self.errorData.push({
          msg: typeof item === 'string' ? item : item.msg,
          rule: typeof item !== 'string' ? item.rule : undefined,
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
        if (Array.isArray(option.children)) {
          const childFirst = getFirstAvaibleOption(option.children);
          if (childFirst !== undefined) {
            return childFirst;
          }
        } else if (
          option[self.valueField || 'value'] != null &&
          !option.disabled
        ) {
          return option;
        }
      }
    }

    function setOptions(
      options: Array<object>,
      onChange?: (value: any) => void,
      data?: Object
    ) {
      if (!Array.isArray(options)) {
        return;
      }
      options = filterTree(options, item => item);
      const originOptions = self.options.concat();
      self.options = options;
      syncOptions(originOptions, data);
      let selectedOptions;

      if (
        onChange &&
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

        const value =
          self.joinValues && self.multiple
            ? list.join(self.delimiter)
            : self.multiple
            ? list
            : list[0];

        onChange(value);
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

        if (!config?.silent) {
          self.loading = true;
        }

        const json: Payload = yield getEnv(self).fetcher(api, data, {
          autoAppend: false,
          cancelExecutor: (executor: Function) => (loadCancel = executor),
          ...config
        });
        loadCancel = null;
        let result: any = null;

        if (!json.ok) {
          const apiObject = buildApi(api, data);
          setErrorFlag !== false &&
            setError(
              self.__('Form.loadOptionsFailed', {
                reason: json.msg ?? (config && config.errorMessage)
              })
            );
          getEnv(self).notify(
            'error',
            self.errors.join('') || `${apiObject.url}：${json.msg}`,
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
      config?: fetchOptions & {
        extendsOptions?: boolean;
      },
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
        json.data?.items ||
        json.data?.rows ||
        json.data ||
        [];

      options = normalizeOptions(options as any, undefined, self.valueField);

      if (config?.extendsOptions && self.selectedOptions.length > 0) {
        self.selectedOptions.forEach((item: any) => {
          const exited = findTree(
            options as any,
            optionValueCompare(item, self.valueField || 'value')
          );

          if (!exited) {
            options.push(item);
          }
        });
      }

      setOptions(options, onChange, data);

      if (json.data && typeof (json.data as any).value !== 'undefined') {
        onChange && onChange((json.data as any).value, false, true);
      } else if (clearValue && !self.selectFirst) {
        self.selectedOptions.some((item: any) => item.__unmatched) &&
          onChange &&
          onChange('', false, true);
      }

      return json;
    });

    const loadAutoUpdateData: (
      api: Api,
      data?: object,
      silent?: boolean
    ) => Promise<Payload> = flow(function* getAutoUpdateData(
      api: string,
      data: object,
      silent: boolean = true
    ) {
      if (loadAutoUpdateCancel) {
        loadAutoUpdateCancel();
        loadAutoUpdateCancel = null;
      }

      const json: Payload = yield getEnv(self).fetcher(api, data, {
        cancelExecutor: (executor: Function) =>
          (loadAutoUpdateCancel = executor)
      });
      loadAutoUpdateCancel = null;

      if (!json) {
        return;
      }

      const result = json.data?.items || json.data?.rows;
      // 只处理仅有一个结果的数据
      if (result?.length === 1) {
        return result[0];
      } else if (isPlainObject(json.data)) {
        return json.data;
      }

      !silent &&
        getEnv(self).notify('info', self.__('FormItem.autoFillLoadFailed'));

      return;
    });

    const tryDeferLoadLeftOptions: (
      option: any,
      leftOptions: any,
      api: Api,
      data?: object,
      config?: fetchOptions
    ) => Promise<Payload | null> = flow(function* (
      option: any,
      leftOptions: any,
      api: string,
      data: object,
      config?: fetchOptions
    ) {
      if (!Array.isArray(leftOptions)) {
        return;
      }

      const indexes = findTreeIndex(
        self.options,
        item => item.leftOptions === leftOptions
      );
      const leftIndexes = findTreeIndex(leftOptions, item => item === option);
      const topOption = findTree(
        self.options,
        item => item.leftOptions === leftOptions
      );

      if (!indexes || !leftIndexes || !topOption) {
        return;
      }

      setOptions(
        spliceTree(self.options, indexes, 1, {
          ...topOption,
          loading: true,
          leftOptions: spliceTree(topOption.leftOptions, leftIndexes, 1, {
            ...option,
            loading: true
          })
        }),
        undefined,
        data
      );

      let json = yield fetchOptions(
        api,
        data,
        {
          ...config,
          silent: true
        },
        false
      );

      if (!json) {
        setOptions(
          spliceTree(self.options, indexes, 1, {
            ...topOption,
            loading: false,
            error: true,
            leftOptions: spliceTree(topOption.leftOptions, leftIndexes, 1, {
              ...option,
              loading: false,
              error: true
            })
          }),
          undefined,
          data
        );
        return;
      }

      const options: Array<IOption> =
        json.data?.options ||
        json.data.items ||
        json.data.rows ||
        json.data ||
        [];
      const newLeftOptions = spliceTree(topOption.leftOptions, leftIndexes, 1, {
        ...option,
        loading: false,
        loaded: true,
        children: options
      });

      setOptions(
        spliceTree(self.options, indexes, 1, {
          ...topOption,
          loading: false,
          loaded: true,
          children: options,
          leftOptions: newLeftOptions
        }),
        undefined,
        data
      );

      // 插入新的子节点，用于之后BaseSelection.resolveSelected查找
      if (Array.isArray(topOption.children)) {
        const children = topOption.children.concat();
        flattenTree(newLeftOptions).forEach(item => {
          if (!findTree(topOption.children, node => node.ref === item.value)) {
            children.push({ref: item.value, defer: true});
          }
        });

        setOptions(
          spliceTree(self.options, indexes, 1, {
            ...topOption,
            leftOptions: newLeftOptions,
            children
          }),
          undefined,
          data
        );
      }

      return json;
    });

    const deferLoadLeftOptions: (
      option: any,
      leftOptions: any,
      api: Api,
      data?: object,
      config?: fetchOptions
    ) => Promise<Payload | null> = flow(function* (
      option: any,
      leftOptions: any,
      api: string,
      data: object,
      config?: fetchOptions
    ) {
      return yield tryDeferLoadLeftOptions(
        option,
        leftOptions,
        api,
        data,
        config
      );
    });

    const deferLoadOptions: (
      option: any,
      api: Api,
      data?: object,
      config?: fetchOptions
    ) => Promise<Payload | null> = flow(function* (
      option: any,
      api: string,
      data: object,
      config?: fetchOptions
    ) {
      const labelField = self.labelField || 'label';
      const valueField = self.valueField || 'value';
      const indexes = findTreeIndex(
        self.options,
        item =>
          item === option ||
          /** tree-select中会对option添加collapsed, visible属性，导致item === option不通过 */
          isEqualWith(
            item,
            option,
            (source, target) =>
              source?.[valueField] != null &&
              target?.[valueField] != null &&
              source?.[labelField] === target?.[labelField] &&
              source?.[valueField] === target?.[valueField]
          )
      );
      if (!indexes) {
        const leftOptions = self.options[0]?.leftOptions;
        return yield tryDeferLoadLeftOptions(
          option,
          leftOptions,
          api,
          data,
          config
        );
      }

      setOptions(
        spliceTree(self.options, indexes, 1, {
          ...option,
          loading: true
        }),
        undefined,
        data
      );

      let json = yield fetchOptions(
        api,
        data,
        {
          ...config,
          silent: true
        },
        false
      );
      if (!json) {
        setOptions(
          spliceTree(self.options, indexes, 1, {
            ...option,
            loading: false,
            error: true
          }),
          undefined,
          data
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
        }),
        undefined,
        data
      );

      return json;
    });

    /**
     * 根据当前节点路径展开树形组件父节点
     */
    const expandTreeOptions: (
      nodePathArr: any[],
      api: Api,
      data?: object,
      config?: fetchOptions
    ) => Promise<Payload | null | void> = flow(function* getInitData(
      nodePathArr: any[],
      api: string,
      data: object,
      config?: fetchOptions
    ) {
      // 多选模式下需要记录遍历过的Node，避免发送相同的请求
      const traversedNode = new Map();

      for (let nodePath of nodePathArr) {
        // 根节点已经展开了，不需要加载
        if (nodePath.length <= 1) {
          continue;
        }

        // 叶节点不需要展开
        for (let level = 0; level < nodePath.length - 1; level++) {
          let tree = self.options.concat();
          let nodeValue = nodePath[level];

          if (traversedNode.has(nodeValue)) {
            continue;
          }
          // 节点value认为是唯一的
          let node = findTree(tree, (item, key, treeLevel: number) => {
            return (
              treeLevel === level + 1 &&
              optionValueCompare(nodeValue, self.valueField || 'value')(item)
            );
          });

          // 只处理懒加载节点
          if (!node || !node.defer) {
            continue;
          }
          const indexes = findTreeIndex(
            tree,
            item => item === node
          ) as number[];

          setOptions(
            spliceTree(tree, indexes, 1, {
              ...node,
              loading: true
            }),
            undefined,
            node
          );

          let json = yield fetchOptions(
            api,
            node,
            {...config, silent: true},
            false
          );

          if (!json) {
            setOptions(
              spliceTree(tree, indexes, 1, {
                ...node,
                loading: false,
                error: true
              }),
              undefined,
              node
            );
          }

          traversedNode.set(nodeValue, true);

          let childrenOptions: Array<IOption> =
            json.data?.options ||
            json.data.items ||
            json.data.rows ||
            json.data ||
            [];

          setOptions(
            spliceTree(tree, indexes, 1, {
              ...node,
              loading: false,
              loaded: true,
              children: childrenOptions
            }),
            undefined,
            node
          );
        }
      }
    });

    // @issue 强依赖form，需要改造暂且放过。
    function syncOptions(originOptions?: Array<any>, data?: Object) {
      if (!self.options.length && typeof self.value === 'undefined') {
        self.selectedOptions = [];
        self.filteredOptions = [];
        return;
      }

      const value = self.tmpValue;

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
          if (
            !expressionsInOptions &&
            (item.visibleOn || item.hiddenOn || item.disabledOn)
          ) {
            expressionsInOptions = true;
          }

          return item.visibleOn
            ? evalExpression(item.visibleOn, data) !== false
            : item.hiddenOn
            ? evalExpression(item.hiddenOn, data) !== true
            : item.visible !== false || item.hidden !== true;
        })
        .map((item: any, index) => {
          const disabled = evalExpression(item.disabledOn, data);
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

      const form = self.form;

      let parentStore = form?.parentStore;
      if (parentStore?.storeType === ComboStore.name) {
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

    function reset(keepErrors: boolean = false) {
      self.validated = false;

      if (subStore && subStore.storeType === 'ComboStore') {
        const combo = subStore as IComboStore;
        combo.forms.forEach(form => form.reset());
      }

      !keepErrors && clearError();
    }

    function resetValidationStatus(tag?: string) {
      self.validated = false;
      clearError();
    }

    function openDialog(
      schema: any,
      data: any,
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

    function changeTmpValue(value: any) {
      self.tmpValue = value;
    }

    function changeEmitedValue(value: any) {
      self.emitedValue = value;
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
      validate,
      setError,
      addError,
      clearError,
      setOptions,
      loadOptions,
      deferLoadOptions,
      deferLoadLeftOptions,
      expandTreeOptions,
      syncOptions,
      setLoading,
      setSubStore,
      getSubStore,
      reset,
      resetValidationStatus,
      openDialog,
      closeDialog,
      changeTmpValue,
      changeEmitedValue,
      addSubFormItem,
      removeSubFormItem,
      loadAutoUpdateData
    };
  });

export type IFormItemStore = Instance<typeof FormItemStore>;
export type SFormItemStore = SnapshotIn<typeof FormItemStore>;
