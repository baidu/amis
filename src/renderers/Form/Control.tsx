import * as React from 'react';
import * as PropTypes from 'prop-types';
import {IFormStore, IFormItemStore} from '../../store/form';
import debouce = require('lodash/debounce');

import {
    RendererProps,
    Renderer
} from '../../factory';
import {
    ComboStore,
    IComboStore,
    IUniqueGroup
} from '../../store/combo';
import {
    anyChanged,
    promisify,
    isObject,
    getVariable
} from '../../utils/helper';
import { Schema } from '../../types';
import { IIRendererStore } from '../../store';
import { ScopedContext, IScopedContext } from '../../Scoped';



export interface FormControlProps extends RendererProps {
    control: {
        id?: string;
        name?: string;
        value?: any;
        required?: boolean;
        validations: string | {[propsName:string]: any};
        validationErrors: {[propsName:string]: any};
        validateOnChange: boolean;
        multiple?: boolean;
        delimiter?: string;
        joinValues?: boolean;
        extractValue?: boolean;
        valueField?: string;
        labelField?: string;
        unique?: boolean;
        pipeIn?: (value:any, data:any) => any;
        pipeOut?: (value:any, originValue:any, data:any) => any;
        validate?: (value:any, values:any) => any;
    } & Schema;
    formStore: IFormStore;
    store: IIRendererStore;
    addHook: (fn: () => any) => void;
    removeHook: (fn: () => any) => void;
}

export default class FormControl extends React.Component<FormControlProps, any> {
    public model:IFormItemStore | undefined;
    control:any;
    hook?: () => any;
    hook2?: () => any;

    static defaultProps:Partial<FormControlProps> = {
    };

    lazyValidate:Function;
    componentWillMount() {
        const {
            formStore: form,
            control: {
                name,
                id,
                type,
                required,
                validations,
                validationErrors,
                unique,
                value,
                multiple,
                delimiter,
                valueField,
                labelField,
                joinValues,
                extractValue,
            }
        } = this.props;

        this.getValue = this.getValue.bind(this);
        this.setValue = this.setValue.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleBulkChange = this.handleBulkChange.bind(this);
        this.setPrinstineValue = this.setPrinstineValue.bind(this);
        this.controlRef = this.controlRef.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.lazyValidate = debouce(this.validate.bind(this), 250, {
            trailing: true,
            leading: false
        });

        if (!name) {
            return;
        }

        this.model = form.registryItem(name, {
            id,
            type,
            required,
            unique,
            value,
            rules: validations,
            messages: validationErrors,
            multiple,
            delimiter,
            valueField,
            labelField,
            joinValues,
            extractValue,
        });

        if (this.model.unique && form.parentStore && form.parentStore.storeType === ComboStore.name) {
            const combo = form.parentStore as IComboStore;
            combo.bindUniuqueItem(this.model);
        }
    }

    componentDidMount() {
        const {
            store,
            formStore: form,
            control: {
                name,
                validate,
            },
            addHook
        } = this.props;

        if (name && form !== store) {
            const value = getVariable(store.data, name);
            if (typeof value !== 'undefined' && value !== this.getValue()) {
                this.handleChange(value)
            }
        }

        const formItem = this.model as IFormItemStore;
        if (formItem && validate) {
            let finalValidate = promisify(validate.bind(formItem));
            this.hook2 = function() {
                formItem.clearError('control:valdiate');
                return finalValidate(form.data, formItem.value)
                    .then((ret:any) => {
                        if ((typeof ret === 'string' || Array.isArray(ret)) && ret) {
                            formItem.addError(ret, 'control:valdiate');
                        }
                    });
            }
            addHook(this.hook2);
        }
    }

    componentWillReceiveProps(nextProps:FormControlProps) {
        const props = this.props;
        const form = nextProps.formStore;

        if (!nextProps.control.name) {

            // 把 name 删了, 对 model 做清理
            this.model && this.disposeModel();
            this.model = undefined;
            return;
        } else if (nextProps.control.name !== props.control.name || !this.model) {
            // 对 model 做清理
            this.model && this.disposeModel();

            // name 是后面才有的，比如编辑模式下就会出现。
            this.model = form.registryItem(nextProps.control.name, {
                id: nextProps.control.id,
                type: nextProps.control.type,
                required: nextProps.control.required,
                unique: nextProps.control.unique,
                value: nextProps.control.value,
                rules: nextProps.control.validations,
                multiple: nextProps.control.multiple,
                delimiter: nextProps.control.delimiter,
                valueField: nextProps.control.valueField,
                labelField: nextProps.control.labelField,
                joinValues: nextProps.control.joinValues,
                extractValue: nextProps.control.extractValue,
                messages: nextProps.control.validationErrors
            });
            // this.forceUpdate();
        }

        if (
            this.model 
            && anyChanged([
                'id',
                'validations',
                'validationErrors',
                'value',
                'required',
                'unique',
                'multiple',
                'delimiter',
                'valueField',
                'labelField',
                'joinValues',
                'extractValue',
            ], props.control, nextProps.control)
        ) {
            this.model.config({
                required: nextProps.control.required,
                id: nextProps.control.id,
                unique: nextProps.control.unique,
                value: nextProps.control.value,
                rules: nextProps.control.validations,
                multiple: nextProps.control.multiple,
                delimiter: nextProps.control.delimiter,
                valueField: nextProps.control.valueField,
                labelField: nextProps.control.labelField,
                joinValues: nextProps.control.joinValues,
                extractValue: nextProps.control.extractValue,
                messages: nextProps.control.validationErrors
            });
        }
    }

    componentDidUpdate(prevProps:FormControlProps) {
        const {
            store,
            formStore: form,
            data,
            control: {
                name
            }
        } = this.props;

        if (!name) {
            return;
        }

        // form 里面部分塞 service 的用法
        if (form !== store && data !== prevProps.data) {
            const value = getVariable(data as any, name);

            if (typeof value !== 'undefined' && value !== this.getValue()) {
                this.handleChange(value)
            }
        }
    }

    componentWillUnmount() {
        this.hook && this.props.removeHook(this.hook);
        this.hook2 && this.props.removeHook(this.hook2);
        this.disposeModel();
    }

    disposeModel() {
        const {
            formStore: form
        } = this.props;

        if (this.model && this.model.unique && form.parentStore && form.parentStore.storeType === ComboStore.name) {
            const combo = form.parentStore as IComboStore;
            combo.unBindUniuqueItem(this.model);
        }
        
        this.model && form.unRegistryItem(this.model);
    }

    controlRef(control:any) {
        const {
            addHook,
            removeHook,
            formStore: form
        } = this.props;

        // 因为 control 有可能被 n 层 hoc 包裹。
        while (control && control.getWrappedInstance) {
            control = control.getWrappedInstance();
        }

        if (control && control.validate && this.model) {
            const formItem = this.model as IFormItemStore;
            let validate = promisify(control.validate.bind(control));
            this.hook = function() {
                formItem.clearError('component:valdiate');

                return validate(form.data, formItem.value)
                    .then(ret => {
                        if ((typeof ret === 'string' || Array.isArray(ret)) && ret) {
                            formItem.setError(ret, 'component:valdiate');
                        }
                    });
            }
            addHook(this.hook);
        } else if (!control && this.hook) {
            removeHook(this.hook);
            this.hook = undefined;
        }

        this.control = control;
    }

    validate() {
        const {
            formStore: form,
        } = this.props;

        if (this.model) {
            if (this.model.unique && form.parentStore && form.parentStore.storeType === ComboStore.name) {
                const combo = form.parentStore as IComboStore;
                const group = combo.uniques.get(this.model.name) as IUniqueGroup;
                group.items.forEach(item => item.validate());
            } else {
                this.model.validate(this.hook);
                form.getItemsByName(this.model.name)
                    .forEach(item => item !== this.model && item.validate())
            }
        }
    }

    handleChange(value:any, submitOnChange:boolean = this.props.control.submitOnChange) {
        const {
            formStore: form,
            onChange,
            control: {
                validateOnChange,
                name,
                pipeOut,
                onChange: onFormItemChange,
                type
            }
        } = this.props;

        // todo 以后想办法不要強耦合类型。
        if (!this.model || ~['service'].indexOf(type)) {
            onChange && onChange(...(arguments as any));
            return;
        }
        const oldValue = this.model.value;

        if (pipeOut) {
            value = pipeOut(value, oldValue, form.data);
        }
        
        if (oldValue === value) {
            return;
        }

        this.model.changeValue(value);

        if (validateOnChange === true || validateOnChange !== false && (form.submited || this.model.validated)) {
            this.lazyValidate();
        }

        onFormItemChange && onFormItemChange(value, oldValue, this.model, form);
        onChange && onChange(value, name, submitOnChange === true);
    }

    handleBlur(e:any) {
        const {
            onBlur,
            control: {
                validateOnBlur
            }
        } = this.props;

        if (validateOnBlur && this.model) {
            this.validate();
        }

        onBlur && onBlur(e);
    }

    handleBulkChange(values:any, submitOnChange:boolean = this.props.control.submitOnChange) {
        if (!isObject(values) || !this.model) {
            return;
        }
        
        const {
            formStore: form,
            onChange,
            control: {
                validateOnChange
            }
        } = this.props;

        let lastKey:string = '', lastValue:any;
        Object.keys(values).forEach(key => {
            const value = values[key];
            lastKey = key;
            lastValue = value;
        });

        // is empty
        if (!lastKey) {
            return;
        }
        
        form.setValues(values);

        if (validateOnChange !== false && (form.submited || this.model.validated)) {
            this.lazyValidate();
        }

        onChange && onChange(lastValue, lastKey, submitOnChange === true);
    }

    setPrinstineValue(value:any) {
        if (!this.model) {
            return;
        }

        this.model.changeValue(value, true);
    }

    getValue() {
        const {
            control,
            formStore: form
        } = this.props;

        const model = this.model;
        // let value:any = model ? (typeof model.value === 'undefined' ? '' : model.value) : (control.value || '');
        let value:any = model ? model.value : control.value;

        if (control.pipeIn) {
            value = control.pipeIn(value, form.data);
        }

        return value;
    }

    // 兼容老版本用法，新版本直接用 onChange 就可以。
    setValue(value:any, key?:string) {
        const {
            control: {
                name            
            }
        } = this.props;

        if (!key || key === name) {
            this.handleChange(value);
        } else {
            this.handleBulkChange({
                [key]: value
            });
        }
    }

    render() {
        const {
            render,
            control: {
                pipeIn,
                pipeOut,
                ...control
            },
            formMode,
            controlWidth,
            type,
            store,
            data,
            disabled,
            ...rest
        } = this.props;

        const model = this.model;
        const value = this.getValue();

        return render('', control, {
            ...rest,
            defaultSize: controlWidth,
            disabled: disabled || control.disabled,
            formItem: model,
            formMode: control.mode || formMode,
            ref: this.controlRef,
            defaultValue: control.value,
            data: store ? store.data : data,
            value,
            formItemValue: value, // 为了兼容老版本的自定义组件
            onChange: this.handleChange,
            onBlur: this.handleBlur,
            setValue: this.setValue,
            getValue: this.getValue,
            onBulkChange: this.handleBulkChange,
            prinstine: model ? model.prinstine : undefined,
            setPrinstineValue: this.setPrinstineValue
        }) as JSX.Element;
    }
}

@Renderer({
    test: (path:string) => /(^|\/)form(?:\/.*)?\/control$/i.test(path) && !/\/control\/control$/i.test(path),
    name: "control"
})
export class FormControlRenderer extends FormControl {
    static displayName = 'Control';
    static contextType = ScopedContext;

    controlRef(ref:any) {
        const originRef = this.control;
        super.controlRef(ref);
        const scoped = this.context as IScopedContext;

        if (!this.control) {
            return;
        }

        if (ref) {
            scoped.registerComponent(this.control);
        } else {
            scoped.unRegisterComponent(originRef);
        }
    }
}

