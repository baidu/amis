import {Api} from '../../types';
import {buildApi, isValidApi} from '../../utils/api';
import {
    anyChanged
} from '../../utils/helper';
import {reaction} from 'mobx';
import {
    FormControlProps,
    registerFormItem,
    FormItemBasicConfig
} from './Item';
import {
    IFormItemStore
} from '../../store/formItem';
export type OptionsControlComponent = React.ComponentType<FormControlProps>;

import * as React from 'react';
import { resolveVariableAndFilter } from '../../utils/tpl-builtin';
import { evalExpression } from '../../utils/tpl';
import { Option, OptionProps, normalizeOptions } from '../../components/Select';

export {
    Option
};

export interface OptionsBasicConfig extends FormItemBasicConfig {
    autoLoadOptionsFromSource?: boolean;
}

export interface OptionsConfig extends OptionsBasicConfig {
    component: React.ComponentType<OptionsControlProps>
}

export interface OptionsControlProps extends FormControlProps, OptionProps {
    source?: Api;
    name?: string;
    onToggle: (option:Option, submitOnChange?: boolean) => void;
    onToggleAll: () => void;
    selectedOptions: Array<Option>;
    setOptions: (value:Array<any>) => void;
    setLoading: (value:boolean) => void;
}

export function registerOptionsControl(config: OptionsConfig) {
    const Control = config.component;

    // @observer
    class FormOptionsItem extends React.Component<FormControlProps, any> {
        static displayName = `OptionsControl(${config.type})`;
        static defaultProps:Partial<FormControlProps> = {
            delimiter: ',',
            labelField: 'label',
            valueField: 'value',
            joinValues: true,
            extractValue: false,
            multiple: false,
            placeholder: '请选择',
            resetValue: '',
            ...Control.defaultProps
        };
        static propsList:any = (Control as any).propsList ? [...(Control as any).propsList] : [];
        static ComposedComponent = Control;
        
        reaction:any;
        input:any;

        constructor(props:FormControlProps) {
            super(props);

            const formItem = props.formItem as IFormItemStore;
            formItem && props.options && formItem.setOptions(normalizeOptions(props.options));

            this.handleToggle = this.handleToggle.bind(this);
            this.handleToggleAll = this.handleToggleAll.bind(this);
            this.setOptions = this.setOptions.bind(this);
            this.setLoading = this.setLoading.bind(this);
            this.inputRef = this.inputRef.bind(this);
            this.reload = this.reload.bind(this);
        }

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
                valueField
            } = this.props;

            if (formItem) {
                this.reaction = reaction(() => JSON.stringify([
                    formItem.loading,
                    formItem.selectedOptions,
                    formItem.filteredOptions
                ]), () => this.forceUpdate());
            }

            let loadOptions:boolean = initFetch !== false;

            if (/^\$(?:([a-z0-9_.]+)|{.+})$/.test(source) && formItem) {
                formItem.setOptions(normalizeOptions(resolveVariableAndFilter(source, data, '| raw') || []));
                loadOptions = false;
            }

            if (formItem && joinValues === false && defaultValue) {
                const selectedOptions = extractValue ? formItem.selectedOptions.map((selectedOption: Option) => selectedOption[valueField || 'value']) : formItem.selectedOptions;
                setPrinstineValue(multiple ? selectedOptions.concat() : formItem.selectedOptions[0]);
            }

            loadOptions && (formInited ? this.reload() : addHook && addHook(this.reload, 'init'));
        }

        componentDidMount() {
            this.normalizeValue();
        }

        shouldComponentUpdate(nextProps:FormControlProps) {
            if (config.strictMode === false || nextProps.strictMode === false) {
                return true;
            }

            if (anyChanged([
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
            ], this.props, nextProps)) {
                return true;
            }

            return false;
        }

        componentWillReceiveProps(nextProps:OptionsControlProps) {
            const props = this.props;
            const formItem = nextProps.formItem as IFormItemStore;

            if (!formItem) {
                return;
            } else if (!props.formItem) {
                // todo 优化 name 变化情况。
            }

            if (props.value !== nextProps.value) {
                formItem.syncOptions();
            }

            if (props.options !== nextProps.options && formItem) {
                formItem.setOptions(normalizeOptions(nextProps.options || []));
            } else if (config.autoLoadOptionsFromSource !== false && nextProps.source && formItem && (props.source !== nextProps.source || props.data !== nextProps.data)) {
                if (/^\$(?:([a-z0-9_.]+)|{.+})$/.test(nextProps.source as string)) {
                    const options = resolveVariableAndFilter(props.source, props.data, '| raw');
                    const nextOptions = resolveVariableAndFilter(nextProps.source as string, nextProps.data, '| raw');
                    options !== nextOptions && formItem.setOptions(normalizeOptions(nextOptions || []));
                } else {
                    let prevApi = buildApi(props.source, props.data as object, {ignoreData: true});
                    let nextApi = buildApi(nextProps.source, nextProps.data as object, {ignoreData: true});

                    if (prevApi.url !== nextApi.url && isValidApi(nextApi.url) && (!nextApi.sendOn || evalExpression(nextApi.sendOn, nextProps.data))) {
                        formItem.loadOptions(nextProps.source, nextProps.data, undefined, true, nextProps.onChange);
                    }
                }
            }
        }

        componentDidUpdate() {
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

            if (
                formItem 
                && joinValues === false 
                && extractValue === false
                && (typeof value === 'string' || typeof value === 'number') 
                && formItem.options.length
            ) {
                formItem.changeValue(multiple ? formItem.selectedOptions.concat() : formItem.selectedOptions[0]);
            }

            if (
                formItem
                && joinValues === false
                && extractValue === true
                && value && !((Array.isArray(value) && value.every(val => typeof val === 'string' || typeof val === 'number')) || typeof value === 'string' || typeof value === 'number')
                && formItem.options.length
            ) {
                const selectedOptions = formItem.selectedOptions.map((selectedOption: Option) => selectedOption[valueField || 'value']);
                formItem.changeValue(multiple ? selectedOptions.concat() : selectedOptions[0]);
            }
        }

        inputRef(ref:any) {
            this.input = ref;
        }

        handleToggle(option:Option, submitOnChange?: boolean) {
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
            let newValue:string|Array<Option>|Option = '';

            if (multiple) {
                if (~idx) {
                    valueArray.splice(idx, 1);
                } else {
                    valueArray.push(option);
                }

                newValue = valueArray;

                if (joinValues) {
                    newValue = (newValue as Array<any>).map(item => item[valueField || 'value']).join(delimiter);
                } else if (extractValue) {
                    newValue = (newValue as Array<any>).map(item => item[valueField || 'value']);
                }
            } else {
                if (~idx && clearable) {
                    valueArray.splice(idx, 1)
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

            let valueArray = formItem.selectedOptions.length === formItem.filteredOptions.length ? 
            [] : formItem.filteredOptions.concat();
            
            let newValue:string|Array<Option>|Option = '';

            if (multiple) {
                newValue = valueArray;

                if (joinValues) {
                    newValue = (newValue as Array<any>).map(item => item[valueField || 'value']).join(delimiter);
                } else if (extractValue) {
                    newValue = (newValue as Array<any>).map(item => item[valueField || 'value']);
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
        reload() {
            const {
                source,
                formItem,
                data,
                onChange
            } = this.props;

            if (config.autoLoadOptionsFromSource === false || !formItem || !source || source.sendOn && !evalExpression(source.sendOn, data)) {
                return;
            }

            return formItem
                .loadOptions(source, data, undefined, false, onChange)
        }

        focus() {
            this.input && this.input.focus && this.input.focus();
        }

        setOptions(options:Array<any>) {
            const formItem = this.props.formItem as IFormItemStore;
            formItem && formItem.setOptions(normalizeOptions(options || []));
        }

        setLoading(value:boolean) {
            const formItem = this.props.formItem as IFormItemStore;
            formItem && formItem.setLoading(value);
        }

        render() {
            const {
                value,
                formItem            
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
                />
            )
        }
    }

    return registerFormItem({
        ...(config as FormItemBasicConfig),
        strictMode: false,
        component: FormOptionsItem
    });
}


export function OptionsControl(config:OptionsBasicConfig) {
    return function <T extends React.ComponentType<OptionsControlProps>>(component:T):T {
        const renderer = registerOptionsControl({
            ...config,
            component: component
        });
        return renderer.component as any;
    }
}

export function highlight(text:string, input?:string, hlClassName:string = 'is-matched') {
    if (!input) {
        return text;
    }

    text = String(text);
    const reg = new RegExp(input.replace(/([\$\^\*\+\-\?\.\(\)\|\[\]\\])/, '\\$1'), 'i');
    if (!reg.test(text)) {
        return text;
    }

    const parts = text.split(reg);
    const dom:Array<any> = [];

    parts.forEach((text:string, index) => {
        text && dom.push(<span key={index}>{text}</span>);
        dom.push(<span className={hlClassName} key={`${index}-hl`}>{input}</span>);
    });

    dom.pop();

    return dom;
}