/**
 * @file 所有列表选择类控件的父级，比如 Select、Radios、Checkboxes、
 * List、ButtonGroup 等等
 */
import {Api, PlainObject, Schema} from '../../types';
import {isEffectiveApi, isApiOutdated, isValidApi} from '../../utils/api';
import {isAlive} from 'mobx-state-tree';
import {
  anyChanged,
  autobind,
  createObject,
  setVariable,
  spliceTree,
  findTreeIndex,
  getTree
} from '../../utils/helper';
import {reaction} from 'mobx';
import {
  FormControlProps,
  registerFormItem,
  FormItemBasicConfig,
  detectProps as itemDetectProps,
  FormBaseControl,
  FormControlSchema
} from './Item';
import {IFormItemStore} from '../../store/formItem';
export type OptionsControlComponent = React.ComponentType<FormControlProps>;

import React from 'react';
import {
  resolveVariableAndFilter,
  isPureVariable
} from '../../utils/tpl-builtin';
import {
  Option,
  OptionProps,
  normalizeOptions,
  optionValueCompare
} from '../../components/Select';
import {filter} from '../../utils/tpl';
import findIndex from 'lodash/findIndex';
import {
  SchemaApi,
  SchemaExpression,
  SchemaTokenizeableString
} from '../../Schema';

export {Option};

export interface FormOptionsControl extends FormBaseControl {
  /**
   * 选项集合
   */
  options?: Array<Option> | string[] | PlainObject;

  /**
   * 可用来通过 API 拉取 options。
   */
  source?: SchemaApi | SchemaTokenizeableString;

  /**
   * 用表达式来配置 source 接口初始要不要拉取
   *
   * @deprecated 建议用 source 接口的 sendOn
   */
  initFetchOn?: SchemaExpression;

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
  deferApi?: SchemaApi;

  /**
   * 添加时调用的接口
   */
  addApi?: SchemaApi;

  /**
   * 新增时的表单项。
   */
  addControls?: Array<FormControlSchema>;

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
  editApi?: SchemaApi;

  /**
   * 选项修改的表单项
   */
  editControls?: Array<FormControlSchema>;

  /**
   * 是否可删除
   */
  removable?: boolean;

  /**
   * 选项删除 API
   */
  deleteApi?: SchemaApi;

  /**
   * 选项删除提示文字。
   */
  deleteConfirmText?: string;

  /**
   * 自动填充，当选项被选择的时候，将选项中的其他值同步设置到表单内。
   */
  autoFill?: {
    [propName: string]: SchemaTokenizeableString;
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
    Omit<FormOptionsControl, 'type'> {
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
  onAdd?: (
    idx?: number | Array<number>,
    value?: any,
    skipForm?: boolean
  ) => void;
  onEdit?: (value: Option, origin?: Option, skipForm?: boolean) => void;
  onDelete?: (value: Option) => void;
}

// 自己接收的属性。
export interface OptionsProps extends FormControlProps, OptionProps {
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
  'options',
  'size',
  'buttons',
  'columnsCount',
  'multiple',
  'hideRoot',
  'checkAll',
  'showIcon',
  'showRadio',
  'btnDisabled',
  'joinValues',
  'extractValue'
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
      placeholder: '请选择',
      resetValue: '',
      deleteConfirmText: '确定要删除？',
      ...Control.defaultProps
    };
    static propsList: any = (Control as any).propsList
      ? [...(Control as any).propsList]
      : [];
    static ComposedComponent = Control;

    reaction?: () => void;
    input: any;

    componentWillMount() {
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
        value
      } = this.props;

      if (formItem) {
        formItem.setOptions(normalizeOptions(options));

        this.reaction = reaction(
          () => JSON.stringify([formItem.loading, formItem.filteredOptions]),
          () => this.forceUpdate()
        );
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
        (formInited
          ? this.reload()
          : addHook && addHook(this.initOptions, 'init'));
    }

    componentDidMount() {
      this.normalizeValue();
    }

    shouldComponentUpdate(nextProps: OptionsProps) {
      if (config.strictMode === false || nextProps.strictMode === false) {
        return true;
      } else if (nextProps.source || nextProps.autoComplete) {
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

      if (!formItem || !props.formInited) {
        return;
      } else if (!prevProps.formItem) {
        // todo 优化 name 变化情况。
      }

      if (prevProps.value !== props.value || formItem.expressionsInOptions) {
        formItem.syncOptions();
      }

      if (prevProps.options !== props.options && formItem) {
        formItem.setOptions(normalizeOptions(props.options || []));
        this.normalizeValue();
      } else if (
        config.autoLoadOptionsFromSource !== false &&
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
          prevOptions !== options &&
            formItem.setOptions(normalizeOptions(options || []));

          this.normalizeValue();
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
              props.onChange
            )
            .then(() => this.normalizeValue());
        }
      }
    }

    componentWillUnmount() {
      this.props.removeHook && this.props.removeHook(this.reload, 'init');
      this.reaction && this.reaction();
    }

    normalizeValue() {
      const {
        joinValues,
        extractValue,
        value,
        multiple,
        formItem,
        valueField
      } = this.props;

      if (!formItem || joinValues !== false || !formItem.options.length) {
        return;
      }

      if (
        extractValue === false &&
        (typeof value === 'string' || typeof value === 'number')
      ) {
        const selectedOptions = formItem.getSelectedOptions(value);
        formItem.changeValue(
          multiple ? selectedOptions.concat() : selectedOptions[0]
        );
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
        formItem.changeValue(
          multiple ? selectedOptions.concat() : selectedOptions[0]
        );
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
    handleToggle(
      option: Option,
      submitOnChange?: boolean,
      changeImmediately?: boolean
    ) {
      const {
        onChange,
        joinValues,
        extractValue,
        valueField,
        delimiter,
        clearable,
        resetValue,
        multiple,
        formItem,
        value
      } = this.props;

      if (!formItem) {
        return;
      }

      let valueArray = formItem.getSelectedOptions(value).concat();
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

      onChange && onChange(newValue, submitOnChange, changeImmediately);
    }

    @autobind
    handleToggleAll() {
      const {
        value,
        onChange,
        joinValues,
        extractValue,
        valueField,
        delimiter,
        resetValue,
        multiple,
        formItem
      } = this.props;

      if (!formItem) {
        return;
      }

      const selectedOptions = formItem.getSelectedOptions(value);
      let valueArray =
        selectedOptions.length === formItem.filteredOptions.length
          ? []
          : formItem.filteredOptions.concat();

      let newValue: string | Array<Option> | Option = '';

      if (multiple) {
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
        newValue = valueArray[0] || resetValue;

        if (joinValues && newValue) {
          newValue = (newValue as any)[valueField || 'value'];
        }
      }

      onChange && onChange(newValue);
    }

    // 当有 action 触发，如果指定了 reload 目标组件，有可能会来到这里面来
    @autobind
    reload() {
      return this.reloadOptions();
    }

    @autobind
    reloadOptions(setError?: boolean) {
      const {source, formItem, data, onChange} = this.props;

      if (formItem && isPureVariable(source as string)) {
        formItem.setOptions(
          normalizeOptions(
            resolveVariableAndFilter(source as string, data, '| raw') || []
          )
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
        onChange,
        setError
      );
    }

    @autobind
    deferLoad(option: Option) {
      const {deferApi, source, env, formItem, data} = this.props;

      if (option.loaded) {
        return;
      }

      const api = option.deferApi || deferApi || source;

      if (!api) {
        env.notify(
          'error',
          '请在选项中设置 `deferApi` 或者表单项中设置 `deferApi`，用来加载子选项。'
        );
        return;
      }

      formItem?.deferLoadOptions(option, api, createObject(data, option));
    }

    @autobind
    async initOptions(data: any) {
      await this.reload();
      const {formItem, name} = this.props;
      if (!formItem) {
        return;
      }
      if (isAlive(formItem) && formItem.value) {
        setVariable(data, name!, formItem.value);
      }
    }

    focus() {
      this.input && this.input.focus && this.input.focus();
    }

    @autobind
    setOptions(options: Array<any>, skipNormalize = false) {
      const formItem = this.props.formItem as IFormItemStore;
      formItem &&
        formItem.setOptions(
          skipNormalize ? options : normalizeOptions(options || [])
        );
    }

    @autobind
    syncOptions() {
      const formItem = this.props.formItem as IFormItemStore;
      formItem && formItem.syncOptions();
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
            placeholder: __('请输入名称')
          }
        ];
      }

      const ctx = createObject(
        data,
        Array.isArray(idx)
          ? {
              parent: getTree(model.options, idx.slice(0, -1)),
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
                controls: addControls
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
            env.notify('error', payload.msg || '新增失败，请仔细检查');
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

      // 如果配置了 source 且配置了 addApi 直接重新拉取接口就够了
      // 不能不判断 addApi 就刷新，因为有些场景就是临时添加的。
      if (source && addApi) {
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
        model.setOptions(options);
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
            placeholder: __('请输入名称')
          }
        ];
      }

      let result = skipForm
        ? value
        : await onOpenDialog(
            {
              type: 'dialog',
              title: __('编辑{{label}}', {
                label: optionLabel || '选项'
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
            env.notify('error', payload.msg || __('保存失败，请仔细检查'));
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

      if (source && !editApi) {
        this.reload();
      } else {
        const indexes = findTreeIndex(model.options, item => item === origin);

        if (indexes) {
          model.setOptions(
            spliceTree(model.options, indexes, 1, {
              ...origin,
              ...result
            })
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
        ? await env.confirm(filter(deleteConfirmText, ctx))
        : true;
      if (!confirmed) {
        return;
      }

      // 通过 deleteApi 删除。
      try {
        if (!deleteApi) {
          throw new Error(__('请配置 deleteApi'));
        }

        const result = await env.fetcher(deleteApi!, ctx, {
          method: 'delete'
        });

        if (!result.ok) {
          env.notify('error', result.msg || __('删除失败，请重试'));
        } else if (source) {
          this.reload();
        } else {
          const options = model.options.concat();
          const idx = findIndex(
            options,
            item => item[valueField || 'value'] == value[valueField || 'value']
          );

          if (~idx) {
            options.splice(idx, 1);
            model.setOptions(options);
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
        removable
      } = this.props;

      return (
        <Control
          {...this.props}
          ref={this.inputRef}
          options={formItem ? formItem.filteredOptions : []}
          onToggle={this.handleToggle}
          onToggleAll={this.handleToggleAll}
          selectedOptions={formItem ? formItem.getSelectedOptions(value) : []}
          loading={formItem ? formItem.loading : false}
          setLoading={this.setLoading}
          setOptions={this.setOptions}
          syncOptions={this.syncOptions}
          reloadOptions={this.reload}
          deferLoad={this.deferLoad}
          creatable={
            creatable || (creatable !== false && isEffectiveApi(addApi))
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

export function highlight(
  text: string,
  input?: string,
  hlClassName: string = 'is-matched'
) {
  if (!input) {
    return text;
  }

  text = String(text);
  const reg = new RegExp(
    input.replace(/([\$\^\*\+\-\?\.\(\)\|\[\]\\])/g, '\\$1'),
    'i'
  );
  if (!reg.test(text)) {
    return text;
  }

  const parts = text.split(reg);
  const dom: Array<any> = [];

  parts.forEach((text: string, index) => {
    text && dom.push(<span key={index}>{text}</span>);
    dom.push(
      <span className={hlClassName} key={`${index}-hl`}>
        {input}
      </span>
    );
  });

  dom.pop();

  return dom;
}
