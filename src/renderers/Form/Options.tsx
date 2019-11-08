import {Api, Schema} from '../../types';
import {isEffectiveApi, isApiOutdated} from '../../utils/api';
import {anyChanged, autobind, createObject} from '../../utils/helper';
import {reaction} from 'mobx';
import {FormControlProps, registerFormItem, FormItemBasicConfig} from './Item';
import {IFormItemStore} from '../../store/formItem';
export type OptionsControlComponent = React.ComponentType<FormControlProps>;

import React from 'react';
import {resolveVariableAndFilter} from '../../utils/tpl-builtin';
import {Option, OptionProps, normalizeOptions} from '../../components/Select';
import {filter} from '../../utils/tpl';
import findIndex from 'lodash/findIndex';

export {Option};

export interface OptionsBasicConfig extends FormItemBasicConfig {
  autoLoadOptionsFromSource?: boolean;
}

export interface OptionsConfig extends OptionsBasicConfig {
  component: React.ComponentType<OptionsControlProps>;
}

// 下发给注册进来的组件的属性。
export interface OptionsControlProps extends FormControlProps, OptionProps {
  source?: Api;
  name?: string;
  onToggle: (option: Option, submitOnChange?: boolean) => void;
  onToggleAll: () => void;
  selectedOptions: Array<Option>;
  setOptions: (value: Array<any>) => void;
  setLoading: (value: boolean) => void;
  reloadOptions: () => void;
  creatable?: boolean;
  onAdd?: () => void;
  addControls?: Array<any>;
  editable?: boolean;
  editControls?: Array<any>;
  onEdit?: (value: Option) => void;
  removable?: boolean;
  onDelete?: (value: Option) => void;
}

// 自己接收的属性。
export interface OptionsProps extends FormControlProps, OptionProps {
  source?: Api;
  creatable?: boolean;
  addApi?: Api;
  addControls?: Array<any>;
  editApi?: Api;
  editControls?: Array<any>;
  deleteApi?: Api;
  deleteConfirmText?: string;
}

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

    reaction: any;
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
        options
      } = this.props;

      if (formItem) {
        formItem.setOptions(normalizeOptions(options));

        this.reaction = reaction(
          () =>
            JSON.stringify([
              formItem.loading,
              formItem.selectedOptions,
              formItem.filteredOptions
            ]),
          () => this.forceUpdate()
        );
      }

      let loadOptions: boolean = initFetch !== false;

      if (/^\$(?:([a-z0-9_.]+)|{.+})$/.test(source as string) && formItem) {
        formItem.setOptions(
          normalizeOptions(
            resolveVariableAndFilter(source as string, data, '| raw') || []
          )
        );
        loadOptions = false;
      }

      if (formItem && joinValues === false && defaultValue) {
        const selectedOptions = extractValue
          ? formItem.selectedOptions.map(
              (selectedOption: Option) => selectedOption[valueField || 'value']
            )
          : formItem.selectedOptions;
        setPrinstineValue(
          multiple ? selectedOptions.concat() : formItem.selectedOptions[0]
        );
      }

      loadOptions &&
        (formInited ? this.reload() : addHook && addHook(this.reload, 'init'));
    }

    componentDidMount() {
      this.normalizeValue();
    }

    shouldComponentUpdate(nextProps: OptionsProps) {
      if (config.strictMode === false || nextProps.strictMode === false) {
        return true;
      }

      if (
        anyChanged(
          [
            'formPristine',
            'addOn',
            'disabled',
            'placeholder',
            'required',
            'formMode',
            'className',
            'inputClassName',
            'labelClassName',
            'label',
            'inline',
            'options',
            'size',
            'btnClassName',
            'btnActiveClassName',
            'buttons',
            'columnsCount',
            'multiple',
            'hideRoot',
            'checkAll',
            'showIcon',
            'showRadio',
            'btnDisabled'
          ],
          this.props,
          nextProps
        )
      ) {
        return true;
      }

      return false;
    }

    componentDidUpdate(prevProps: OptionsProps) {
      const props = this.props;
      const formItem = props.formItem as IFormItemStore;

      if (!formItem) {
        return;
      } else if (!prevProps.formItem) {
        // todo 优化 name 变化情况。
      }

      if (prevProps.value !== props.value || formItem.expressionsInOptions) {
        formItem.syncOptions();
      }

      if (prevProps.options !== props.options && formItem) {
        formItem.setOptions(normalizeOptions(props.options || []));
      } else if (
        config.autoLoadOptionsFromSource !== false &&
        props.source &&
        formItem &&
        (prevProps.source !== props.source || prevProps.data !== props.data)
      ) {
        if (/^\$(?:([a-z0-9_.]+)|{.+})$/.test(props.source as string)) {
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
        } else if (
          isApiOutdated(
            prevProps.source,
            props.source,
            prevProps.data,
            props.data
          )
        ) {
          formItem.loadOptions(
            props.source,
            props.data,
            undefined,
            true,
            props.onChange
          );
        }
      }

      this.normalizeValue();
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
        formItem.changeValue(
          multiple
            ? formItem.selectedOptions.concat()
            : formItem.selectedOptions[0]
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
        const selectedOptions = formItem.selectedOptions.map(
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
    handleToggle(option: Option, submitOnChange?: boolean) {
      const {
        onChange,
        joinValues,
        extractValue,
        valueField,
        delimiter,
        clearable,
        resetValue,
        multiple,
        formItem
      } = this.props;

      if (!formItem) {
        return;
      }

      let valueArray = formItem.selectedOptions.concat();
      const idx = valueArray.indexOf(option);
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

        if (joinValues && newValue) {
          newValue = (newValue as any)[valueField || 'value'];
        }
      }

      onChange && onChange(newValue, submitOnChange);
    }

    @autobind
    handleToggleAll() {
      const {
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

      let valueArray =
        formItem.selectedOptions.length === formItem.filteredOptions.length
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
      const {source, formItem, data, onChange} = this.props;

      if (
        config.autoLoadOptionsFromSource === false ||
        !formItem ||
        !isEffectiveApi(source, data)
      ) {
        return;
      }

      return formItem.loadOptions(source, data, undefined, false, onChange);
    }

    focus() {
      this.input && this.input.focus && this.input.focus();
    }

    @autobind
    setOptions(options: Array<any>) {
      const formItem = this.props.formItem as IFormItemStore;
      formItem && formItem.setOptions(normalizeOptions(options || []));
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
    async handleOptionAdd() {
      let {
        addControls,
        disabled,
        labelField,
        onOpenDialog,
        addApi,
        source,
        data,
        valueField,
        formItem: model,
        createBtnLabel
      } = this.props;

      if (disabled || !model) {
        return;
      }

      if (!Array.isArray(addControls) || !addControls.length) {
        addControls = [
          {
            type: 'text',
            name: labelField || 'label',
            label: false,
            placeholder: '请输入名称'
          }
        ];
      }

      let result: any = await onOpenDialog(
        {
          type: 'dialog',
          title: createBtnLabel || '新增选项',
          body: {
            type: 'form',
            api: addApi,
            controls: addControls
          }
        },
        data
      );

      if (result) {
        // 没走服务端的。
        if (!result.__saved) {
          result = {
            ...result,
            [valueField || 'value']: result[labelField || 'label']
          };
        }

        source
          ? this.reload()
          : model.setOptions(model.options.concat({...result}));
      }
    }

    @autobind
    async handleOptionEdit(value: any) {
      let {
        editControls,
        disabled,
        labelField,
        onOpenDialog,
        editApi,
        source,
        data,
        formItem: model,
        valueField
      } = this.props;

      if (disabled || !model) {
        return;
      }

      if (!Array.isArray(editControls) || !editControls.length) {
        editControls = [
          {
            type: 'text',
            name: labelField || 'label',
            label: false,
            placeholder: '请输入名称'
          }
        ];
      }

      let result = await onOpenDialog(
        {
          type: 'dialog',
          title: '编辑选项',
          body: {
            type: 'form',
            api: editApi,
            controls: editControls
          }
        },
        createObject(data, value)
      );

      if (!result) {
        return;
      }

      if (source) {
        this.reload();
      } else {
        const options = model.options.concat();
        const idx = findIndex(
          options,
          item => item[valueField || 'value'] == result[valueField || 'value']
        );

        if (~idx) {
          options.splice(idx, 1, {
            ...options[idx],
            ...result
          });
          model.setOptions(options);
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
        valueField
      } = this.props;

      if (disabled || !model) {
        return;
      }

      const ctx = createObject(data, value);
      const confirmed = deleteConfirmText
        ? await env.confirm(filter(deleteConfirmText, ctx))
        : true;
      if (!confirmed) {
        return;
      }

      try {
        const result = await env.fetcher(deleteApi!, ctx);

        if (!result.ok) {
          env.notify('error', result.msg || '删除失败，请重试');
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
        editable
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
          creatable={creatable || isEffectiveApi(addApi)}
          editable={editable || isEffectiveApi(editApi)}
          removable={isEffectiveApi(deleteApi)}
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
  return function<T extends React.ComponentType<OptionsControlProps>>(
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
    input.replace(/([\$\^\*\+\-\?\.\(\)\|\[\]\\])/, '\\$1'),
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
