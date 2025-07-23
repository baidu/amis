import {
  types,
  SnapshotIn,
  flow,
  isAlive,
  getEnv,
  Instance
} from 'mobx-state-tree';
import isEqualWith from 'lodash/isEqualWith';
import uniqWith from 'lodash/uniqWith';
import {FormStore, IFormStore} from './form';
import {str2rules, validate as doValidate} from '../utils/validations';
import {Api, Payload, fetchOptions, ApiObject} from '../types';
import {ComboStore, IComboStore, IUniqueGroup} from './combo';
import {evalExpression} from '../utils/tpl';
import {resolveVariableAndFilter} from '../utils/tpl-builtin';
import {buildApi, isEffectiveApi} from '../utils/api';
import findIndex from 'lodash/findIndex';
import {
  isObject,
  isArrayChildrenModified,
  createObject,
  isObjectShallowModified,
  findTree,
  findTreeIndex,
  spliceTree,
  filterTree,
  eachTree,
  mapTree,
  setVariable,
  cloneObject,
  promisify
} from '../utils/helper';
import {flattenTree} from '../utils/helper';
import find from 'lodash/find';
import isEqual from 'lodash/isEqual';
import isPlainObject from 'lodash/isPlainObject';
import {SimpleMap} from '../utils/SimpleMap';
import {StoreNode} from './node';
import {getStoreById} from './manager';
import {normalizeOptions} from '../utils/normalizeOptions';
import {
  getOptionValue,
  getOptionValueBindField,
  optionValueCompare
} from '../utils/optionValueCompare';
import {dataMapping} from '../utils/dataMapping';

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

// 用于缓存 getSelectedOptions 的计算结果
// onChange 时很容易连续重复触发 getSelectedOptions （约4次）
// 在大数据量时，可有效提高效率
const getSelectedOptionsCache: any = {
  value: null,
  nodeValueArray: null,
  res: null
};

export const FormItemStore = StoreNode.named('FormItemStore')
  .props({
    isFocused: false,
    isControlled: false, // 是否是受控表单项，通常是用在别的组件里面
    type: '',
    label: '',
    unique: false,
    loading: false,
    required: false,
    /** Schema默认值是否为表达式格式 */
    isValueSchemaExp: types.optional(types.boolean, false),
    tmpValue: types.frozen(),
    emitedValue: types.frozen(),
    changeMotivation: 'input',
    rules: types.optional(types.frozen(), {}),
    messages: types.optional(types.frozen(), {}),
    errorData: types.optional(types.array(ErrorDetail), []),
    name: types.string,
    extraName: '',
    itemId: '', // 因为 name 可能会重名，所以加个 id 进来，如果有需要用来定位具体某一个
    unsetValueOnInvisible: false,
    itemsRef: types.optional(types.array(types.string), []),
    inited: false,
    validated: false,
    validatedAt: 0,
    validating: false,
    multiple: false,
    delimiter: ',',
    valueField: 'value',
    labelField: 'label',
    joinValues: true,
    extractValue: false,
    options: types.optional(types.frozen<Array<any>>(), []),
    optionsRaw: types.optional(types.frozen<Array<any>>(), []),
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
    validateOnChange: false,
    /** 当前表单项所属的InputGroup父元素, 用于收集InputGroup的子元素 */
    inputGroupControl: types.optional(types.frozen(), {}),
    colIndex: types.frozen(),
    rowIndex: types.frozen(),
    /** Transfer组件分页模式 */
    pagination: types.optional(types.frozen(), {
      enable: false,
      /** 当前页数 */
      page: 1,
      /** 每页显示条数 */
      perPage: 10,
      /** 总条数 */
      total: 0
    }),
    accumulatedOptions: types.optional(types.frozen<Array<any>>(), []),
    popOverOpen: false,
    popOverData: types.frozen(),
    popOverSchema: types.frozen()
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

      /** 数据源接口数据是否开启分页 */
      get enableSourcePagination(): boolean {
        return !!self.pagination.enable;
      },

      /** 数据源接口开启分页时当前页码 */
      get sourcePageNum(): number {
        return self.pagination.page ?? 1;
      },

      /** 数据源接口开启分页时每页显示条数 */
      get sourcePerPageNum(): number {
        return self.pagination.perPage ?? 10;
      },

      /** 数据源接口开启分页时数据总条数 */
      get sourceTotalNum(): number {
        return self.pagination.total ?? 0;
      },

      getSelectedOptions: (
        value: any = self.tmpValue,
        nodeValueArray?: any[] | undefined
      ) => {
        // 查看是否命中缓存
        if (
          value != null &&
          nodeValueArray != null &&
          isEqual(value, getSelectedOptionsCache.value) &&
          isEqual(nodeValueArray, getSelectedOptionsCache.nodeValueArray) &&
          getSelectedOptionsCache.res
        ) {
          return getSelectedOptionsCache.res;
        }

        if (typeof value === 'undefined') {
          return [];
        }

        const filteredOptions = self.filteredOptions;
        const {labelField, extractValue, multiple, delimiter} = self;
        const valueField = self.valueField || 'value';

        const valueArray = nodeValueArray
          ? nodeValueArray
          : Array.isArray(value)
          ? value
          : // 单选时不应该分割
          typeof value === 'string' && multiple
          ? // picker的value有可能value: "1, 2"，所以需要去掉一下空格
            value.split(delimiter || ',').map((v: string) => v.trim())
          : [value];

        const selected = valueArray.map(item =>
          item && item.hasOwnProperty(valueField) ? item[valueField] : item
        );

        const selectedOptions: Array<any> = [];

        selected.forEach((item, index) => {
          const matched = findTree(
            filteredOptions,
            optionValueCompare(item, valueField),
            {
              resolve: getOptionValueBindField(valueField),
              value: getOptionValue(item, valueField)
            }
          );

          if (matched) {
            selectedOptions.push(matched);
            return;
          }

          let unMatched = (valueArray && valueArray[index]) || item;
          let hasValue = unMatched || unMatched === 0;

          if (
            hasValue &&
            (typeof unMatched === 'string' || typeof unMatched === 'number')
          ) {
            unMatched = {
              [valueField || 'value']: item,
              [labelField || 'label']: item,
              __unmatched: true
            };

            // 某些特殊情况，如select的autocomplete时
            // 关键字没匹配到的项会被隐藏，不在filteredOptions中，导致匹配不到
            // 此时需要从原始数据中查找，避免label丢失
            const origin: any = self.selectedOptions
              ? find(self.selectedOptions, optionValueCompare(item, valueField))
              : null;

            if (origin) {
              unMatched[labelField] = origin[labelField];
            }
          } else if (hasValue && extractValue) {
            unMatched = {
              [valueField || 'value']: item,
              [labelField || 'label']: 'UnKnown',
              __unmatched: true
            };
          }

          hasValue && selectedOptions.push(unMatched);
        });

        if (selectedOptions.length) {
          getSelectedOptionsCache.value = value;
          getSelectedOptionsCache.nodeValueArray = nodeValueArray;
          getSelectedOptionsCache.res = selectedOptions;
        }

        return selectedOptions;
      },
      splitExtraValue(value: any) {
        const delimiter = self.delimiter || ',';
        const values =
          value === ''
            ? ['', '']
            : Array.isArray(value)
            ? value
            : typeof value === 'string'
            ? value.split(delimiter || ',').map((v: string) => v.trim())
            : [];
        return values;
      },

      getMergedData(data: any) {
        const result = cloneObject(data);
        setVariable(result, self.name, self.tmpValue);
        setVariable(result, '__value', self.tmpValue);
        setVariable(result, '__name', self.name);
        return result;
      }
    };
  })

  .actions(self => {
    const form = self.form as IFormStore;
    const dialogCallbacks = new SimpleMap<
      (confirmed?: any, result?: any) => void
    >();
    let loadAutoUpdateCancel: Function | null = null;

    const initHooks: Array<(store: any) => any> = [];

    function config({
      name,
      extraName,
      required,
      unique,
      value,
      isValueSchemaExp,
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
      label,
      inputGroupControl,
      pagination
    }: {
      name?: string;
      extraName?: string;
      required?: boolean;
      unique?: boolean;
      value?: any;
      isValueSchemaExp?: boolean;
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
      inputGroupControl?: {
        name: string;
        path: string;
        [propsName: string]: any;
      };
      pagination?: {
        enable?: boolean;
        page?: number;
        perPage?: number;
      };
    }) {
      if (typeof rules === 'string') {
        rules = str2rules(rules);
      }

      typeof name !== 'undefined' && (self.name = name);
      typeof extraName !== 'undefined' && (self.extraName = extraName);
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
      self.isValueSchemaExp = !!isValueSchemaExp;
      isObject(inputGroupControl) &&
        inputGroupControl?.name != null &&
        (self.inputGroupControl = inputGroupControl);

      if (pagination && isObject(pagination) && !!pagination.enable) {
        self.pagination = {
          enable: true,
          page: pagination.page ? pagination.page || 1 : 1,
          perPage: pagination.perPage ? pagination.perPage || 10 : 10,
          total: 0
        };
      }

      if (
        typeof rules !== 'undefined' ||
        typeof required !== 'undefined' ||
        typeof minLength === 'number' ||
        typeof maxLength === 'number'
      ) {
        rules = {
          ...(rules ?? self.rules),
          isRequired: self.required || rules?.isRequired
        };

        // todo 这个弄个配置由渲染器自己来决定
        // 暂时先这样
        if (~['input-text', 'textarea'].indexOf(self.type)) {
          if (typeof minLength === 'number') {
            (rules as any).minLength = minLength;
          }

          if (typeof maxLength === 'number') {
            (rules as any).maxLength = maxLength;
          }
        }

        if (isObjectShallowModified(rules, self.rules)) {
          self.rules = rules;
          clearError('builtin');
          self.validated = false;
        }
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

        try {
          const json: Payload = yield getEnv(self).fetcher(
            self.validateApi,
            /** 如果配置validateApi，需要将用户最新输入同步到数据域内 */
            createObject(data, {[self.name]: self.tmpValue}),
            {
              cancelExecutor: (executor: Function) =>
                (validateCancel = executor)
            }
          );
          validateCancel = null;

          if (!json.ok && json.status === 422 && json.errors) {
            addError(
              String(
                (self.validateApi as ApiObject)?.messages?.failed ??
                  (json.errors || json.msg || `表单项「${self.name}」校验失败`)
              )
            );
          }
        } catch (err) {
          addError(String(err));
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
      self.validatedAt = Date.now();
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
        if (Array.isArray(option.children) && option.children.length) {
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

    function setPagination(params: {
      page?: number;
      perPage?: number;
      total?: number;
    }) {
      const {page, perPage, total} = params || {};

      if (self.enableSourcePagination) {
        self.pagination = {
          ...self.pagination,
          ...(page != null && typeof page === 'number' ? {page} : {}),
          ...(perPage != null && typeof perPage === 'number' ? {perPage} : {}),
          ...(total != null && typeof total === 'number' ? {total} : {})
        };
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
      /** 开启分页后当前选项内容需要累加 */
      self.accumulatedOptions = self.enableSourcePagination
        ? uniqWith(
            [...originOptions, ...options],
            (lhs, rhs) =>
              lhs[self.valueField ?? 'value'] ===
              rhs[self.valueField ?? 'value']
          )
        : options;
      syncOptions(originOptions, data);
      let selectedOptions;

      if (
        onChange &&
        self.selectFirst &&
        self.filteredOptions.length &&
        (selectedOptions = self.getSelectedOptions(self.value)) &&
        !selectedOptions.filter((item: any) => !item.__unmatched).length
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
                reason:
                  apiObject.messages?.failed ??
                  json.msg ??
                  (config && config.errorMessage)
              })
            );
          let msg = json.msg;
          // 如果没有 msg，就提示 status 信息
          if (!msg) {
            msg = `status: ${json.status}`;
          }
          !(api as any)?.silent &&
            getEnv(self).notify(
              'error',
              apiObject.messages?.failed ??
                (self.errors.join('') || `${apiObject.url}: ${msg}`),
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

        console.error(e);
        !(api as any)?.silent && env.notify('error', e.message);
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
      let json: Payload = yield fetchOptions(api, data, config, setErrorFlag);
      if (!json) {
        return null;
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

      if (self.enableSourcePagination) {
        self.pagination = {
          ...self.pagination,
          page: parseInt(json.data?.page, 10) || 1,
          total: parseInt(json.data?.total ?? json.data?.count, 10) || 0
        };
      }

      if (config?.extendsOptions && self.selectedOptions.length > 0) {
        self.selectedOptions.forEach((item: any) => {
          const exited = findTree(
            options as any,
            optionValueCompare(item, self.valueField || 'value'),
            {
              resolve: getOptionValueBindField(self.valueField),
              value: getOptionValue(item, self.valueField)
            }
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
          onChange(
            self.joinValues === false && self.multiple ? [] : '',
            false,
            true
          );
      }

      return json;
    });

    /**
     * 从数据域加载选项数据源，注意这里默认source变量解析后是全量的数据源
     */
    function loadOptionsFromDataScope(
      source: string,
      ctx: Record<string, any>,
      onChange?: (
        value: any,
        submitOnChange?: boolean,
        changeImmediately?: boolean
      ) => void,
      clearValue?: boolean
    ) {
      let options: any[] = resolveVariableAndFilter(source, ctx, '| raw');

      if (!Array.isArray(options)) {
        return [];
      }

      options = normalizeOptions(options, undefined, self.valueField);

      if (self.enableSourcePagination) {
        self.pagination = {
          ...self.pagination,
          ...(ctx?.page ? {page: ctx?.page} : {}),
          ...(ctx?.perPage ? {perPage: ctx?.perPage} : {}),
          total: options.length
        };

        options = options.slice(
          (self.pagination.page - 1) * self.pagination.perPage,
          self.pagination.page * self.pagination.perPage
        );
      }

      setOptions(options, onChange, ctx);

      // source从数据域获取，同时发生变化时，需要清空当前表单项
      if (clearValue && !self.selectFirst) {
        self.selectedOptions.some((item: any) => item.__unmatched) &&
          onChange &&
          onChange('', false, true);
      }

      return options;
    }

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
        !(api as any)?.silent &&
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
          if (
            !findTree(topOption.children, node => node.ref === item.value, {
              resolve: node => node.ref,
              value: item.value
            })
          ) {
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
        isArrayChildrenModified(self.filteredOptions, []) &&
          (self.filteredOptions = []);
        isArrayChildrenModified(self.selectedOptions, []) &&
          (self.selectedOptions = []);
        return;
      }

      const value = self.tmpValue;
      const valueField = self.valueField || 'value';
      const labelField = self.labelField || 'label';

      const selected = Array.isArray(value)
        ? value.map(item =>
            item && item.hasOwnProperty(valueField) ? item[valueField] : item
          )
        : typeof value === 'string'
        ? value.split(self.delimiter || ',').map((v: string) => v.trim())
        : value === void 0
        ? []
        : [
            value && value.hasOwnProperty(valueField)
              ? value[valueField]
              : value
          ];

      if (value && value.hasOwnProperty(labelField)) {
        selected[0] = {
          [labelField]: value[labelField],
          [valueField]: value[valueField]
        };
      }

      let expressionsInOptions = false;
      const oldFilteredOptions = self.filteredOptions;
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
            : item.visible !== false && item.hidden !== true;
        })
        .map((item: any, index) => {
          const disabled = evalExpression(item.disabledOn, data);
          const newItem = item.disabledOn
            ? oldFilteredOptions.length > index &&
              oldFilteredOptions[index].disabled === disabled
              ? oldFilteredOptions[index]
              : {
                  ...item,
                  disabled: disabled
                }
            : item;

          return newItem;
        });

      self.expressionsInOptions = expressionsInOptions;
      const flattenedMap: Map<any, any> = new Map();
      const flattened: Array<any> = [];
      eachTree(filteredOptions, item => {
        const value = getOptionValue(item, valueField);
        value != null && flattenedMap.set(value, item);
        value != null && flattened.push(item);
      });
      const selectedOptions: Array<any> = [];
      selected.forEach((item, index) => {
        const value = getOptionValue(item, valueField);
        if (flattenedMap.get(value)) {
          selectedOptions.push(flattenedMap.get(value));
          return;
        }

        let idx = findIndex(flattened, optionValueCompare(item, valueField));

        if (~idx) {
          selectedOptions.push(flattened[idx]);
        } else {
          let unMatched = (value && value[index]) || item;
          let hasValue = unMatched || unMatched === 0;

          if (
            hasValue &&
            (typeof unMatched === 'string' || typeof unMatched === 'number')
          ) {
            unMatched = {
              [valueField]: item,
              [labelField]: item,
              __unmatched: true
            };

            const orgin: any =
              originOptions &&
              find(originOptions, optionValueCompare(item, valueField));

            if (orgin) {
              unMatched[labelField] = orgin[labelField];
            }
          } else if (hasValue && self.extractValue) {
            unMatched = {
              [valueField]: item,
              [labelField]: 'UnKnown',
              __unmatched: true
            };
          }

          hasValue && selectedOptions.push(unMatched);
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
                ...item.selectedOptions.map(
                  (item: any) => item && item[valueField]
                )
              );
            }
          });

        if (filteredOptions.length && options.length) {
          filteredOptions = mapTree(filteredOptions, item => {
            if (~options.indexOf(item[valueField])) {
              return {
                ...item,
                disabled: true
              };
            }
            return item;
          });
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
        combo.forms.forEach(form => form.reset(undefined, false)); // 仅重置校验状态，不要重置数据
      }

      !keepErrors && clearError();
    }

    function resetValidationStatus(tag?: string) {
      self.validated = false;
      clearError();
    }

    function openDialog(
      schema: any,
      ctx: any,
      callback?: (confirmed?: any, value?: any) => void
    ) {
      if (schema.data) {
        self.dialogData = dataMapping(schema.data, ctx);
      } else {
        self.dialogData = ctx;
      }

      self.dialogSchema = schema;
      self.dialogOpen = true;
      callback && dialogCallbacks.set(self.dialogData, callback);
    }

    function closeDialog(confirmed?: any, result?: any) {
      const callback = dialogCallbacks.get(self.dialogData);
      self.dialogOpen = false;

      if (callback) {
        dialogCallbacks.delete(self.dialogData);
        setTimeout(() => callback(confirmed, result), 200);
      }
    }

    function openPopOver(
      schema: any,
      ctx: any,
      callback?: (confirmed?: any, value?: any) => void
    ) {
      self.popOverData = ctx || {};
      self.popOverOpen = true;
      self.popOverSchema = schema;
      callback && dialogCallbacks.set(self.popOverData, callback);
    }

    function closePopOver(confirmed?: any, result?: any) {
      const callback = dialogCallbacks.get(self.popOverData);
      self.popOverOpen = false;

      if (callback) {
        dialogCallbacks.delete(self.popOverData);
        setTimeout(() => callback(confirmed, result), 200);
      }
    }

    function changeTmpValue(
      value: any,
      changeReason?:
        | 'initialValue' // 初始值，读取与当前数据域，或者上层数据域
        | 'formInited' // 表单初始化
        | 'dataChanged' // 表单数据变化
        | 'formulaChanged' // 公式运算结果变化
        | 'controlled' // 受控
        | 'input' // 用户交互改变
        | 'defaultValue' // 默认值
    ) {
      // 清除因extraName导致清空时value为空值数组，进而导致必填校验不生效的异常情况
      if (self.extraName && Array.isArray(value)) {
        self.tmpValue = value.filter(item => item).length ? value : '';
      } else {
        self.tmpValue = value;
      }

      if (changeReason) {
        self.changeMotivation = changeReason;
      }
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

    function setIsControlled(value: any) {
      self.isControlled = !!value;
    }

    const init: () => Promise<void> = flow(function* init() {
      const hooks = initHooks.sort(
        (a: any, b: any) => (a.__weight || 0) - (b.__weight || 0)
      );
      try {
        for (let hook of hooks) {
          yield hook(self);
        }
      } finally {
        if (isAlive(self)) {
          self.inited = true;
        }
      }
    });

    return {
      focus,
      blur,
      config,
      validate,
      setError,
      addError,
      clearError,
      setPagination,
      setOptions,
      loadOptions,
      loadOptionsFromDataScope,
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
      openPopOver,
      closePopOver,
      changeTmpValue,
      changeEmitedValue,
      addSubFormItem,
      removeSubFormItem,
      loadAutoUpdateData,
      setIsControlled,

      init,

      addInitHook(fn: (store: any) => any, weight = 0) {
        fn = promisify(fn);
        initHooks.push(fn);
        (fn as any).__weight = weight;
        return () => {
          const idx = initHooks.indexOf(fn);
          ~idx && initHooks.splice(idx, 1);
        };
      },

      beforeDestroy: () => {
        // 销毁
        initHooks.splice(0, initHooks.length);
      }
    };
  });

export type IFormItemStore = Instance<typeof FormItemStore>;
export type SFormItemStore = SnapshotIn<typeof FormItemStore>;
