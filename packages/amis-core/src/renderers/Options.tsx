/**
 * @file 所有列表选择类控件的父级，比如 Select、Radios、Checkboxes、
 * List、ButtonGroup 等等
 */
import {
  Api,
  PlainObject,
  ActionObject,
  OptionProps,
  BaseApiObject
} from '../types';
import {isEffectiveApi, isApiOutdated} from '../utils/api';
import {isAlive} from 'mobx-state-tree';
import {
  anyChanged,
  autobind,
  createObject,
  setVariable,
  spliceTree,
  findTreeIndex,
  getTree,
  isEmpty,
  getTreeAncestors,
  normalizeNodePath,
  mapTree,
  getTreeDepth,
  flattenTree,
  keyToPath,
  getVariable
} from '../utils/helper';
import {reaction} from 'mobx';
import {
  FormControlProps,
  registerFormItem,
  FormItemBasicConfig,
  detectProps as itemDetectProps,
  FormBaseControl
} from './Item';
import {IFormItemStore} from '../store/formItem';

export type OptionsControlComponent = React.ComponentType<FormControlProps>;

import React from 'react';
import {
  resolveVariableAndFilter,
  isPureVariable,
  dataMapping
} from '../utils/tpl-builtin';

import {filter} from '../utils/tpl';
import findIndex from 'lodash/findIndex';

import isPlainObject from 'lodash/isPlainObject';
import {normalizeOptions} from '../utils/normalizeOptions';
import {optionValueCompare} from '../utils/optionValueCompare';
import {Option} from '../types';

export {Option};

export interface FormOptionsControl extends FormBaseControl {
  /**
   * 选项集合
   */
  options?: Array<Option> | string[] | PlainObject;

  /**
   * 可用来通过 API 拉取 options。
   */
  source?: BaseApiObject | string;

  /**
   * 默认选择选项第一个值。
   */
  selectFirst?: boolean;

  /**
   * 用表达式来配置 source 接口初始要不要拉取
   *
   * @deprecated 建议用 source 接口的 sendOn
   */
  initFetchOn?: string;

  /**
   * 配置 source 接口初始拉不拉取。
   *
   * @deprecated 建议用 source 接口的 sendOn
   */
  initFetch?: boolean;

  /**
   * 是否为多选模式
   */
  multiple?: boolean;

  /**
   * 单选模式：当用户选中某个选项时，选项中的 value 将被作为该表单项的值提交，否则，整个选项对象都会作为该表单项的值提交。
   * 多选模式：选中的多个选项的 `value` 会通过 `delimiter` 连接起来，否则直接将以数组的形式提交值。
   */
  joinValues?: boolean;

  /**
   * 分割符
   */
  delimiter?: string;

  /**
   * 开启后将选中的选项 value 的值封装为数组，作为当前表单项的值。
   */
  extractValue?: boolean;

  /**
   * 是否可清除。
   */
  clearable?: boolean;

  /**
   * 点清除按钮时，将表单项设置成当前配置的值。
   *
   * @default ''
   */
  resetValue?: string;

  /**
   * 延时加载的 API，当选项中有 defer: true 的选项时，点开会通过此接口扩充。
   */
  deferApi?: BaseApiObject | string;

  /**
   * 添加时调用的接口
   */
  addApi?: BaseApiObject | string;

  /**
   * 新增时的表单项。
   */
  addControls?: Array<PlainObject>;

  /**
   * 是否可以新增
   */
  creatable?: boolean;

  /**
   * 新增文字
   */
  createBtnLabel?: string;

  /**
   * 是否可以编辑
   */
  editable?: boolean;

  /**
   * 编辑时调用的 API
   */
  editApi?: BaseApiObject | string;

  /**
   * 选项修改的表单项
   */
  editControls?: Array<PlainObject>;

  /**
   * 是否可删除
   */
  removable?: boolean;

  /**
   * 选项删除 API
   */
  deleteApi?: BaseApiObject | string;

  /**
   * 选项删除提示文字。
   */
  deleteConfirmText?: string;

  /**
   * 自动填充，当选项被选择的时候，将选项中的其他值同步设置到表单内。
   */
  autoFill?: {
    [propName: string]: string;
  };
}

export interface OptionsBasicConfig extends FormItemBasicConfig {
  autoLoadOptionsFromSource?: boolean;
}

export interface OptionsConfig extends OptionsBasicConfig {
  component: React.ComponentType<OptionsControlProps>;
}

// 下发给注册进来的组件的属性。
export interface OptionsControlProps
  extends FormControlProps,
    Omit<
      FormOptionsControl,
      | 'type'
      | 'className'
      | 'descriptionClassName'
      | 'inputClassName'
      | 'remark'
      | 'labelRemark'
    > {
  options: Array<Option>;
  onToggle: (
    option: Option,
    submitOnChange?: boolean,
    changeImmediately?: boolean
  ) => void;
  onToggleAll: () => void;
  selectedOptions: Array<Option>;
  setOptions: (value: Array<any>, skipNormalize?: boolean) => void;
  setLoading: (value: boolean) => void;
  reloadOptions: (setError?: boolean) => void;
  deferLoad: (option: Option) => void;
  leftDeferLoad: (option: Option, leftOptions: Option) => void;
  expandTreeOptions: (nodePathArr: any[]) => void;
  onAdd?: (
    idx?: number | Array<number>,
    value?: any,
    skipForm?: boolean
  ) => void;
  onEdit?: (value: Option, origin?: Option, skipForm?: boolean) => void;
  onDelete?: (value: Option) => void;
}

// 自己接收的属性。
export interface OptionsProps
  extends FormControlProps,
    Omit<OptionProps, 'className'> {
  source?: Api;
  deferApi?: Api;
  creatable?: boolean;
  addApi?: Api;
  addControls?: Array<any>;
  editApi?: Api;
  editControls?: Array<any>;
  deleteApi?: Api;
  deleteConfirmText?: string;
  optionLabel?: string;
}

export const detectProps = itemDetectProps.concat([
  'value',
  'options',
  'size',
  'buttons',
  'columnsCount',
  'multiple',
  'hideRoot',
  'checkAll',
  'defaultCheckAll',
  'showIcon',
  'showRadio',
  'btnDisabled',
  'joinValues',
  'extractValue',
  'borderMode',
  'hideSelected'
]);

export function registerOptionsControl(config: OptionsConfig) {
  const Control = config.component;

  class FormOptionsItem extends React.Component<OptionsProps, any> {
    static displayName = `OptionsControl(${config.type})`;
    static defaultProps = {
      delimiter: ',',
      labelField: 'label',
      valueField: 'value',
      joinValues: true,
      extractValue: false,
      multiple: false,
      placeholder: 'Select.placeholder',
      resetValue: '',
      deleteConfirmText: 'deleteConfirm',
      ...Control.defaultProps
    };
    static propsList: any = (Control as any).propsList
      ? [...(Control as any).propsList]
      : [];
    static ComposedComponent = Control;

    toDispose: Array<() => void> = [];

    input: any;
    mounted = false;

    constructor(props: OptionsProps) {
      super(props);

      const {
        initFetch,
        formItem,
        source,
        data,
        setPrinstineValue,
        defaultValue,
        multiple,
        joinValues,
        extractValue,
        addHook,
        formInited,
        valueField,
        options,
        value,
        defaultCheckAll
      } = props;

      if (formItem) {
        formItem.setOptions(
          normalizeOptions(options, undefined, valueField),
          this.changeOptionValue,
          data
        );

        this.toDispose.push(
          reaction(
            () => JSON.stringify([formItem.loading, formItem.filteredOptions]),
            () => this.mounted && this.forceUpdate()
          )
        );

        this.toDispose.push(
          reaction(
            () =>
              JSON.stringify(formItem.getSelectedOptions(formItem.tmpValue)),
            () =>
              this.mounted &&
              this.syncAutoFill(formItem.getSelectedOptions(formItem.tmpValue))
          )
        );
        // 默认全选。这里会和默认值\回填值逻辑冲突，所以如果有配置source则不执行默认全选
        if (
          multiple &&
          defaultCheckAll &&
          formItem.filteredOptions?.length &&
          !source
        ) {
          this.defaultCheckAll();
        }
      }

      let loadOptions: boolean = initFetch !== false;

      if (formItem && joinValues === false && defaultValue) {
        const selectedOptions = extractValue
          ? formItem
              .getSelectedOptions(value)
              .map(
                (selectedOption: Option) =>
                  selectedOption[valueField || 'value']
              )
          : formItem.getSelectedOptions(value);
        setPrinstineValue(
          multiple ? selectedOptions.concat() : selectedOptions[0]
        );
      }

      loadOptions &&
        config.autoLoadOptionsFromSource !== false &&
        (formInited || !addHook
          ? this.reload()
          : addHook && addHook(this.initOptions, 'init'));
    }

    componentDidMount() {
      this.mounted = true;
      this.normalizeValue();
    }

    shouldComponentUpdate(nextProps: OptionsProps) {
      if (config.strictMode === false || nextProps.strictMode === false) {
        return true;
      } else if (nextProps.source || nextProps.autoComplete) {
        return true;
      } else if (nextProps.formItem?.expressionsInOptions) {
        return true;
      }

      if (anyChanged(detectProps, this.props, nextProps)) {
        return true;
      }

      return false;
    }

    componentDidUpdate(prevProps: OptionsProps) {
      const props = this.props;
      const formItem = props.formItem as IFormItemStore;

      if (prevProps.options !== props.options && formItem) {
        formItem.setOptions(
          normalizeOptions(props.options || [], undefined, props.valueField),
          this.changeOptionValue,
          props.data
        );
        this.normalizeValue();
      } else if (
        config.autoLoadOptionsFromSource !== false &&
        (props.formInited || typeof props.formInited === 'undefined') &&
        props.source &&
        formItem &&
        (prevProps.source !== props.source || prevProps.data !== props.data)
      ) {
        if (isPureVariable(props.source as string)) {
          const prevOptions = resolveVariableAndFilter(
            prevProps.source as string,
            prevProps.data,
            '| raw'
          );
          const options = resolveVariableAndFilter(
            props.source as string,
            props.data,
            '| raw'
          );

          if (prevOptions !== options) {
            formItem.setOptions(
              normalizeOptions(
                options || [],
                undefined,
                props.valueField || 'value'
              ),
              this.changeOptionValue,
              props.data
            );
            this.normalizeValue();
          }
        } else if (
          isEffectiveApi(props.source, props.data) &&
          isApiOutdated(
            prevProps.source,
            props.source,
            prevProps.data,
            props.data
          )
        ) {
          formItem
            .loadOptions(
              props.source,
              props.data,
              undefined,
              true,
              this.changeOptionValue
            )
            .then(() => this.normalizeValue());
        }
      }

      if (prevProps.value !== props.value || formItem?.expressionsInOptions) {
        formItem?.syncOptions(undefined, props.data);
      }
    }

    componentWillUnmount() {
      this.props.removeHook?.(this.reload, 'init');
      this.toDispose.forEach(fn => fn());
      this.toDispose = [];
    }

    async dispatchOptionEvent(eventName: string, eventData: any = '') {
      const {dispatchEvent, options, data} = this.props;
      const rendererEvent = await dispatchEvent(
        eventName,
        createObject(data, {
          value: eventData,
          options
        })
      );
      // 返回阻塞标识
      return !!rendererEvent?.prevented;
    }

    doAction(action: ActionObject, data: object, throwErrors: boolean) {
      const {resetValue, onChange} = this.props;
      const actionType = action?.actionType as string;

      if (actionType === 'clear') {
        onChange?.('');
      } else if (actionType === 'reset') {
        onChange?.(resetValue ?? '');
      }
    }

    syncAutoFill(selectedOptions: Array<any>) {
      const {autoFill, multiple, onBulkChange, data} = this.props;
      const formItem = this.props.formItem as IFormItemStore;
      // 参照录入｜自动填充
      if (autoFill?.hasOwnProperty('api')) {
        return;
      }

      if (
        onBulkChange &&
        autoFill &&
        !isEmpty(autoFill) &&
        formItem.filteredOptions.length
      ) {
        const toSync = dataMapping(
          autoFill,
          multiple
            ? {
                items: selectedOptions.map(item =>
                  createObject(
                    {
                      ...data,
                      ancestors: getTreeAncestors(
                        formItem.filteredOptions,
                        item,
                        true
                      )
                    },
                    item
                  )
                )
              }
            : createObject(
                {
                  ...data,
                  ancestors: getTreeAncestors(
                    formItem.filteredOptions,
                    selectedOptions[0],
                    true
                  )
                },
                selectedOptions[0]
              )
        );

        Object.keys(autoFill).forEach(key => {
          const keys = keyToPath(key);

          // 如果左边的 key 是一个路径
          // 这里不希望直接把原始对象都给覆盖没了
          // 而是保留原始的对象，只修改指定的属性
          if (keys.length > 1 && isPlainObject(data[keys[0]])) {
            const obj = {...data[keys[0]]};
            const value = getVariable(toSync, key);
            toSync[keys[0]] = obj;
            setVariable(toSync, key, value);
          }
        });

        onBulkChange(toSync);
      }
    }

    // 当前值，跟设置预期的值格式不一致时自动转换。
    normalizeValue() {
      const {
        joinValues,
        extractValue,
        value,
        multiple,
        formItem,
        valueField,
        enableNodePath,
        pathSeparator,
        onChange
      } = this.props;

      if (!formItem || joinValues !== false || !formItem.options.length) {
        return;
      }

      if (
        extractValue === false &&
        (typeof value === 'string' || typeof value === 'number')
      ) {
        const selectedOptions = formItem.getSelectedOptions(value);
        onChange?.(multiple ? selectedOptions.concat() : selectedOptions[0]);
      } else if (
        extractValue === true &&
        value &&
        !(
          (Array.isArray(value) &&
            value.every(
              val => typeof val === 'string' || typeof val === 'number'
            )) ||
          typeof value === 'string' ||
          typeof value === 'number'
        )
      ) {
        const selectedOptions = formItem
          .getSelectedOptions(value)
          .map(
            (selectedOption: Option) => selectedOption[valueField || 'value']
          );
        onChange?.(multiple ? selectedOptions.concat() : selectedOptions[0]);
      }
    }

    getWrappedInstance() {
      return this.input;
    }

    @autobind
    inputRef(ref: any) {
      this.input = ref;
    }

    @autobind
    async handleToggle(
      option: Option,
      submitOnChange?: boolean,
      changeImmediately?: boolean
    ) {
      const {onChange, formItem, value} = this.props;

      if (!formItem) {
        return;
      }

      let newValue: string | Array<Option> | Option = this.toggleValue(
        option,
        value
      );

      const isPrevented = await this.dispatchOptionEvent('change', newValue);
      isPrevented ||
        (onChange && onChange(newValue, submitOnChange, changeImmediately));
    }

    /**
     * 初始化时处理默认全选逻辑
     */
    defaultCheckAll() {
      const {value, formItem, setPrinstineValue} = this.props;
      // 如果有默认值\回填值直接返回
      if (!formItem || formItem.getSelectedOptions(value).length) {
        return;
      }
      let valueArray = formItem.filteredOptions.concat();
      const newValue = this.formatValueArray(valueArray);
      setPrinstineValue?.(newValue);
    }

    /**
     * 选中的值经过joinValues和delimiter等规则处理输出规定格式的值
     * @param valueArray 选中值的数组
     * @returns 通过joinValues和delimiter等规则输出规定格式的值
     */
    formatValueArray(valueArray: Array<Option>) {
      const {
        joinValues,
        extractValue,
        valueField,
        delimiter,
        resetValue,
        multiple
      } = this.props;
      let newValue: string | Array<Option> | Option = '';
      if (multiple) {
        /** 兼容tree数据结构 */
        newValue =
          getTreeDepth(valueArray) > 1 ? flattenTree(valueArray) : valueArray;

        if (joinValues) {
          newValue = (newValue as Array<any>)
            .map(item => item[valueField || 'value'])
            .filter(item => item != null) /** tree的父节点可能没有value值 */
            .join(delimiter);
        } else if (extractValue) {
          newValue = (newValue as Array<any>)
            .map(item => item[valueField || 'value'])
            .filter(item => item != null);
        }
      } else {
        newValue = valueArray[0] || resetValue;

        if (joinValues && newValue) {
          newValue = (newValue as any)[valueField || 'value'];
        }
      }
      return newValue;
    }

    @autobind
    async handleToggleAll() {
      const {value, onChange, formItem, valueField} = this.props;

      if (!formItem) {
        return;
      }
      const selectedOptions = formItem.getSelectedOptions(value);
      /** 打平并过滤掉valueField不存在的case，保证全选时对比length一致 */
      const filteredOptions = flattenTree(
        formItem.filteredOptions.concat()
      ).filter(item => item != null && item[valueField || 'value'] != null);
      let valueArray =
        selectedOptions.length === filteredOptions.length
          ? []
          : formItem.filteredOptions.concat();
      const newValue = this.formatValueArray(valueArray);
      const isPrevented = await this.dispatchOptionEvent('change', newValue);
      isPrevented || (onChange && onChange(newValue));
    }

    toggleValue(option: Option, originValue?: any) {
      const {
        joinValues,
        extractValue,
        valueField,
        delimiter,
        clearable,
        resetValue,
        multiple,
        formItem
      } = this.props;

      let valueArray =
        originValue !== undefined
          ? formItem!.getSelectedOptions(originValue).concat()
          : [];

      const idx = findIndex(
        valueArray,
        optionValueCompare(option[valueField || 'value'], valueField || 'value')
      );
      let newValue: string | Array<Option> | Option = '';

      if (multiple) {
        if (~idx) {
          valueArray.splice(idx, 1);
        } else {
          valueArray.push(option);
        }

        newValue = valueArray;

        if (joinValues) {
          newValue = (newValue as Array<any>)
            .map(item => item[valueField || 'value'])
            .join(delimiter);
        } else if (extractValue) {
          newValue = (newValue as Array<any>).map(
            item => item[valueField || 'value']
          );
        }
      } else {
        if (~idx && clearable) {
          valueArray.splice(idx, 1);
        } else {
          valueArray = [option];
        }

        newValue = valueArray[0] || resetValue;

        if ((joinValues || extractValue) && newValue) {
          newValue = (newValue as any)[valueField || 'value'];
        }
      }

      return newValue;
    }

    // 当有 action 触发，如果指定了 reload 目标组件，有可能会来到这里面来
    @autobind
    reload() {
      return this.reloadOptions();
    }

    @autobind
    reloadOptions(setError?: boolean, isInit = false) {
      const {source, formItem, data, onChange, setPrinstineValue, valueField} =
        this.props;

      if (formItem && isPureVariable(source as string)) {
        isAlive(formItem) &&
          formItem.setOptions(
            normalizeOptions(
              resolveVariableAndFilter(source as string, data, '| raw') || [],
              undefined,
              valueField
            ),
            this.changeOptionValue,
            data
          );
        return;
      } else if (!formItem || !isEffectiveApi(source, data)) {
        return;
      }

      return formItem.loadOptions(
        source,
        data,
        undefined,
        false,
        isInit ? setPrinstineValue : onChange,
        setError
      );
    }

    @autobind
    async deferLoad(option: Option) {
      const {deferApi, source, env, formItem, data} = this.props;
      const api = option.deferApi || deferApi || source;

      if (!api) {
        env.notify(
          'error',
          '请在选项中设置 `deferApi` 或者表单项中设置 `deferApi`，用来加载子选项。'
        );
        return;
      }

      const json = await formItem?.deferLoadOptions(
        option,
        api,
        createObject(data, option)
      );
      // 触发事件通知,加载完成
      this.dispatchOptionEvent('loadFinished', json);
    }

    @autobind
    leftDeferLoad(option: Option, leftOptions: Option) {
      const {deferApi, source, env, formItem, data} = this.props;
      const api = option.deferApi || deferApi || source;

      if (!api) {
        env.notify(
          'error',
          '请在选项中设置 `deferApi` 或者表单项中设置 `deferApi`，用来加载子选项。'
        );
        return;
      }

      formItem?.deferLoadLeftOptions(
        option,
        leftOptions,
        api,
        createObject(data, option)
      );
    }

    @autobind
    expandTreeOptions(nodePathArr: any[]) {
      const {deferApi, source, env, formItem, data} = this.props;
      const api = deferApi || source;

      if (!api) {
        env.notify(
          'error',
          '请在选项中设置 `deferApi` 或者表单项中设置 `deferApi`，用来加载子选项。'
        );
        return;
      }

      formItem?.expandTreeOptions(nodePathArr, api, createObject(data));
    }

    @autobind
    async initOptions(data: any) {
      await this.reloadOptions(false, true);
      const {formItem, name, multiple, defaultCheckAll} = this.props;
      if (!formItem) {
        return;
      }
      if (isAlive(formItem) && formItem.value) {
        setVariable(data, name!, formItem.value);
      }

      // 默认全选
      if (multiple && defaultCheckAll && formItem.filteredOptions?.length) {
        this.defaultCheckAll();
      }
    }

    focus() {
      this.input && this.input.focus && this.input.focus();
    }

    @autobind
    changeOptionValue(value: any) {
      const {
        onChange,
        formInited,
        setPrinstineValue,
        value: originValue
      } = this.props;

      if (formInited === false) {
        originValue === undefined && setPrinstineValue?.(value);
      } else {
        onChange?.(value);
      }
    }

    @autobind
    setOptions(options: Array<any>, skipNormalize = false) {
      const formItem = this.props.formItem as IFormItemStore;
      formItem &&
        formItem.setOptions(
          skipNormalize
            ? options
            : normalizeOptions(options || [], undefined, this.props.valueField),
          this.changeOptionValue,
          this.props.data
        );
    }

    @autobind
    syncOptions() {
      const formItem = this.props.formItem as IFormItemStore;
      formItem && formItem.syncOptions(undefined, this.props.data);
    }

    @autobind
    setLoading(value: boolean) {
      const formItem = this.props.formItem as IFormItemStore;
      formItem && formItem.setLoading(value);
    }

    @autobind
    async handleOptionAdd(
      idx: number | Array<number> = -1,
      value?: any,
      skipForm: boolean = false
    ) {
      let {
        addControls,
        disabled,
        labelField,
        onOpenDialog,
        optionLabel,
        addApi,
        source,
        data,
        valueField,
        formItem: model,
        createBtnLabel,
        env,
        translate: __
      } = this.props;

      // 禁用或者没有配置 name
      if (disabled || !model) {
        return;
      }

      // 用户没有配置表单项，则自动创建一个 label 输入
      if (!skipForm && (!Array.isArray(addControls) || !addControls.length)) {
        addControls = [
          {
            type: 'text',
            name: labelField || 'label',
            label: false,
            required: true,
            placeholder: __('Options.addPlaceholder')
          }
        ];
      }
      const parent = Array.isArray(idx)
        ? getTree(model.options, idx.slice(0, -1))
        : undefined;

      const ctx: any = createObject(
        data,
        Array.isArray(idx)
          ? {
              parent: parent,
              ...value
            }
          : value
      );

      let result: any = skipForm
        ? ctx
        : await onOpenDialog(
            {
              type: 'dialog',
              title: createBtnLabel || `新增${optionLabel || '选项'}`,
              body: {
                type: 'form',
                api: addApi,
                controls: [
                  {
                    type: 'hidden',
                    name: 'idx',
                    value: idx
                  },
                  {
                    type: 'hidden',
                    name: 'parent',
                    value: parent
                  },
                  ...(addControls || [])
                ]
              }
            },
            ctx
          );

      // 单独发请求
      if (skipForm && addApi) {
        try {
          const payload = await env.fetcher(addApi!, result, {
            method: 'post'
          });

          if (!payload.ok) {
            env.notify('error', payload.msg || __('Options.createFailed'));
            result = null;
          } else {
            result = payload.data || result;
          }
        } catch (e) {
          result = null;
          console.error(e);
          env.notify('error', e.message);
        }
      }

      // 有 result 说明弹框点了确认。否则就是取消了。
      if (!result) {
        return;
      }

      // 没走服务端的。
      if (!result.hasOwnProperty(valueField || 'value')) {
        result = {
          ...result,
          [valueField || 'value']: result[labelField || 'label']
        };
      }
      // 触发事件通知
      const isPrevented = await this.dispatchOptionEvent('add', {
        ...result,
        idx
      });
      if (isPrevented) {
        return;
      }

      // 如果是懒加载的，只懒加载当前节点。
      if (parent?.defer) {
        await this.deferLoad(parent);
      } else if (source && addApi) {
        // 如果配置了 source 且配置了 addApi 直接重新拉取接口就够了
        // 不能不判断 addApi 就刷新，因为有些场景就是临时添加的。
        this.reload();
      } else {
        // 否则直接前端变更 options
        let options = model.options.concat();
        if (Array.isArray(idx)) {
          options = spliceTree(options, idx, 0, {...result});
        } else {
          ~idx
            ? options.splice(idx, 0, {...result})
            : options.push({...result});
        }
        model.setOptions(options, this.changeOptionValue, data);
      }
    }

    @autobind
    async handleOptionEdit(
      value: any,
      origin: any = value,
      skipForm: boolean = false
    ) {
      let {
        editControls,
        disabled,
        labelField,
        onOpenDialog,
        editApi,
        env,
        source,
        data,
        formItem: model,
        optionLabel,
        translate: __
      } = this.props;

      if (disabled || !model) {
        return;
      }

      if (!skipForm && (!Array.isArray(editControls) || !editControls.length)) {
        editControls = [
          {
            type: 'text',
            name: labelField || 'label',
            label: false,
            placeholder: __('Options.addPlaceholder')
          }
        ];
      }

      let result = skipForm
        ? value
        : await onOpenDialog(
            {
              type: 'dialog',
              title: __('Options.editLabel', {
                label: optionLabel || __('Options.label')
              }),
              body: {
                type: 'form',
                api: editApi,
                controls: editControls
              }
            },
            createObject(data, value)
          );

      // 单独发请求
      if (skipForm && editApi) {
        try {
          const payload = await env.fetcher(
            editApi!,
            createObject(data, result),
            {
              method: 'post'
            }
          );

          if (!payload.ok) {
            env.notify('error', payload.msg || __('saveFailed'));
            result = null;
          } else {
            result = payload.data || result;
          }
        } catch (e) {
          result = null;
          console.error(e);
          env.notify('error', e.message);
        }
      }

      // 没有结果，说明取消了。
      if (!result) {
        return;
      }

      // 触发事件通知
      const isPrevented = await this.dispatchOptionEvent('edit', result);
      if (isPrevented) {
        return;
      }

      if (source && editApi) {
        this.reload();
      } else {
        const indexes = findTreeIndex(model.options, item => item === origin);

        if (indexes) {
          model.setOptions(
            spliceTree(model.options, indexes, 1, {
              ...origin,
              ...result
            }),
            this.changeOptionValue,
            data
          );
        }
      }
    }

    @autobind
    async handleOptionDelete(value: any) {
      let {
        deleteConfirmText,
        disabled,
        data,
        deleteApi,
        env,
        formItem: model,
        source,
        valueField,
        translate: __
      } = this.props;

      if (disabled || !model) {
        return;
      }

      const ctx = createObject(data, value);

      // 如果配置了 deleteConfirmText 让用户先确认。
      const confirmed = deleteConfirmText
        ? await env.confirm(filter(__(deleteConfirmText), ctx))
        : true;
      if (!confirmed) {
        return;
      }

      // 触发事件通知
      const isPrevented = await this.dispatchOptionEvent('delete', ctx);
      if (isPrevented) {
        return;
      }

      // 通过 deleteApi 删除。
      try {
        if (!deleteApi) {
          throw new Error(__('Options.deleteAPI'));
        }

        const result = await env.fetcher(deleteApi!, ctx, {
          method: 'delete'
        });

        if (!result.ok) {
          env.notify('error', result.msg || __('deleteFailed'));
        } else if (source) {
          this.reload();
        } else {
          const options = model.options.concat();
          const indexes = findTreeIndex(
            options,
            item => item[valueField || 'value'] == value[valueField || 'value']
          );

          if (indexes) {
            model.setOptions(
              spliceTree(options, indexes, 1),
              this.changeOptionValue,
              data
            );
          }
        }
      } catch (e) {
        console.error(e);
        env.notify('error', e.message);
      }
    }

    render() {
      const {
        value,
        formItem,
        addApi,
        editApi,
        deleteApi,
        creatable,
        editable,
        removable,
        enableNodePath,
        pathSeparator,
        delimiter = ',',
        labelField = 'label',
        valueField = 'value'
      } = this.props;

      const {nodePathArray, nodeValueArray} = normalizeNodePath(
        value,
        enableNodePath,
        labelField,
        valueField,
        pathSeparator,
        delimiter
      );

      return (
        <Control
          {...this.props}
          ref={this.inputRef}
          options={formItem ? formItem.filteredOptions : []}
          onToggle={this.handleToggle}
          onToggleAll={this.handleToggleAll}
          selectedOptions={
            formItem
              ? formItem.getSelectedOptions(
                  value,
                  enableNodePath ? nodeValueArray : undefined
                )
              : []
          }
          nodePath={nodePathArray}
          loading={formItem ? formItem.loading : false}
          setLoading={this.setLoading}
          setOptions={this.setOptions}
          syncOptions={this.syncOptions}
          reloadOptions={this.reload}
          deferLoad={this.deferLoad}
          leftDeferLoad={this.leftDeferLoad}
          expandTreeOptions={this.expandTreeOptions}
          creatable={
            creatable !== false && isEffectiveApi(addApi) ? true : creatable
          }
          editable={editable || (editable !== false && isEffectiveApi(editApi))}
          removable={
            removable || (removable !== false && isEffectiveApi(deleteApi))
          }
          onAdd={this.handleOptionAdd}
          onEdit={this.handleOptionEdit}
          onDelete={this.handleOptionDelete}
        />
      );
    }
  }

  return registerFormItem({
    ...(config as FormItemBasicConfig),
    strictMode: false,
    component: FormOptionsItem
  });
}

export function OptionsControl(config: OptionsBasicConfig) {
  return function <T extends React.ComponentType<OptionsControlProps>>(
    component: T
  ): T {
    const renderer = registerOptionsControl({
      ...config,
      component: component
    });
    return renderer.component as any;
  };
}
