import * as React from 'react';
import hoistNonReactStatic = require('hoist-non-react-statics');
import { IFormStore, IFormItemStore } from '../../store/form';
import * as cx from 'classnames';
import { observer } from "mobx-react";
import debouce = require('lodash/debounce');
import { onPatch } from 'mobx-state-tree';
import { reaction } from 'mobx';

import {
    RendererProps,
    RendererComponent,
    registerRenderer,
    TestFunc,
    RendererConfig,
    RendererBasicConfig,
    HocStoreFactory
} from '../../factory';
import {
    ComboStore,
    IComboStore
} from '../../store/combo';
import {
    noop,
    anyChanged,
    promisify,
    ucFirst,
    getWidthRate,
    camel
} from '../../utils/helper';


export interface FormItemBasicConfig extends Partial<RendererConfig> {
    type?: string;
    wrap?: boolean;
    renderLabel?: boolean;
    test?: RegExp | TestFunc;
    storeType?: string;
    validations?: string;
    strictMode?: boolean;
    descriptionClassName?: string;
    storeExtendsData?: boolean;
    sizeMutable?: boolean;
    weight?: number;

    // 兼容老用法，新用法直接在 Component 里面定义 validate 方法即可。
    validate?: (values: any, value: any) => string | boolean;
};


export interface FormControlProps extends RendererProps {
    // error string
    error?: string;
    inputOnly?: boolean;

    // error 详情
    errors?: {
        [propName: string]: string
    };

    defaultValue: any;
    value: any;
    onChange: (value: any, submitOnChange?: boolean) => void;
    onBulkChange: (values: any, submitOnChange?: boolean) => void;

    prinstine: any;
    setPrinstineValue: (value: any) => void;
    formMode?: 'default' | 'inline' | 'horizontal' | 'row';
    formItem?: IFormItemStore;
    strictMode?: boolean;

    renderControl?: (props:RendererProps) => JSX.Element;
    renderLabel?: boolean;
    sizeMutable?: boolean;
    wrap?: boolean;
    hint?: string;
    description?: string;
    descriptionClassName?: string;
};

export interface FormControlState {
    isFocused: boolean;
};

export type FormItemComponent = React.ComponentType<FormControlProps>;
export type FormControlComponent = React.ComponentType<FormControlProps>;

export interface FormItemConfig extends FormItemBasicConfig {
    component: FormControlComponent;
}

export class FormItemWrap extends React.Component<FormControlProps, FormControlState> {
    reaction: any;
    
    constructor(props:FormControlProps) {
        super(props);

        this.state = {
            isFocused: false
        };

        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }

    componentWillMount() {
        const {
            formItem: model
        } = this.props;

        if (model) {
            this.reaction = reaction(() => model.errors.join(''), () => this.forceUpdate());
        }
    }

    componentWillUnmount() {
        this.reaction && this.reaction();
    }

    handleFocus(e:any) {
        this.setState({
            isFocused: true
        });
        this.props.onFocus && this.props.onFocus(e);
    }

    handleBlur(e:any) {
        this.setState({
            isFocused: false
        });
        this.props.onBlur && this.props.onBlur(e);
    }

    renderControl() {
        const {
            inputClassName,
            formItem: model,
            classPrefix: ns,
            children,
            type,
            renderControl,
            formItemConfig,
            sizeMutable,
            size,
            defaultSize,
            ...rest
        } = this.props;

        if (renderControl) {
            const controlSize = size || defaultSize;
            return renderControl({
                ...rest,
                type,
                classPrefix: ns,
                formItem: model,
                className: cx(`${ns}Form-control`, {
                    'is-inline': !!rest.inline,
                    'is-error': model && !model.valid,
                    [`${ns}Form-control--size${ucFirst(controlSize)}`]: sizeMutable !== false
                        && typeof controlSize === 'string'
                        && !!controlSize
                        && controlSize !== 'full'
                }, inputClassName)
            });
        }

        return null;
    }

    renderHorizontal() {
        let {
            className,
            classPrefix: ns,
            description,
            descriptionClassName,
            captionClassName,
            desc,
            label,
            labelClassName,
            render,
            required,
            caption,
            type,
            remark,
            labelRemark,
            env,
            formItem: model,
            renderLabel,
            hint
        } = this.props;

        // 强制不渲染 label 的话
        if (renderLabel === false) {
            label = label === false ? false : '';
        }

        description = description || desc;
        const horizontal = this.props.horizontal || this.props.formHorizontal;
        const left = getWidthRate(horizontal.left);
        const right = getWidthRate(horizontal.right);

        return (
            <div className={cx(`${ns}Form-item ${ns}Form-item--horizontal`, className, {
                [`is-error`]: model && !model.valid,
                [`is-required`]: required
            })}>
                {label !== false ? (
                    <label 
                        className={cx(`${ns}Form-label`, {
                            [`${ns}Form-itemColumn--${typeof horizontal.leftFixed === 'string' ? horizontal.leftFixed : 'normal'}`]: horizontal.leftFixed,
                            [`${ns}Form-itemColumn--${left}`]: !horizontal.leftFixed
                        }, labelClassName)}
                    >
                        <span>
                            {label}
                            {required ? (<span className={`${ns}Form-star`}>*</span>) : null}
                            {labelRemark ? render('label-remark', {
                                type: 'remark',
                                tooltip: labelRemark,
                                className: cx(`${ns}Form-labelRemark`),
                                container: env && env.getModalContainer ? env.getModalContainer() : undefined
                            }) : null}
                        </span>
                    </label>
                ) : null}

                <div 
                    className={cx(`${ns}Form-value`, {
                        // [`${ns}Form-itemColumn--offset${getWidthRate(horizontal.offset)}`]: !label && label !== false,
                        [`${ns}Form-itemColumn--${right}`]: !!right && right !== (12 - left)
                    })}
                >
                    {this.renderControl()}

                    {caption ? render('caption', caption, {
                        className: cx(`${ns}Form-caption`, captionClassName) 
                    }) : null}

                    {remark ? render('remark', {
                        type: 'remark',
                        tooltip: remark,
                        className: cx(`${ns}Form-remark`),
                        container: env && env.getModalContainer ? env.getModalContainer() : undefined
                    }) : null}

                    {hint && this.state.isFocused ? (render('hint', hint, {
                        className: cx(`${ns}Form-hint`)
                    })) : null}
                    
                    {model && !model.valid ? (
                        <ul className={`${ns}Form-feedback`}>
                            {model.errors.map((msg: string, key: number) => (<li key={key}>{msg}</li>))}
                        </ul>
                    ) : null}

                    {description ? render('description', description, {
                        className: cx(`${ns}Form-description`, descriptionClassName)
                    }) : null}
                </div>
            </div>
        );
    }

    renderNormal() {
        let {
            className,
            classPrefix: ns,
            desc,
            description,
            label,
            labelClassName,
            render,
            required,
            type,
            caption,
            remark,
            labelRemark,
            env,
            descriptionClassName,
            captionClassName,
            formItem: model,
            renderLabel,
            hint,
            formMode
        } = this.props;

        description = description || desc;

        return (
            <div className={cx(`${ns}Form-item ${ns}Form-item--${formMode}`, className, {
                'is-error': model && !model.valid,
                [`is-required`]: required,
            })}>
                {label && renderLabel !== false ? (
                    <label className={cx(`${ns}Form-label`, labelClassName)}>
                        <span>
                            {label}
                            {required ? (<span className={`${ns}Form-star`}>*</span>) : null}
                            {labelRemark ? render('label-remark', {
                                type: 'remark',
                                tooltip: labelRemark,
                                className: cx(`${ns}Form-lableRemark`),
                                container: env && env.getModalContainer ? env.getModalContainer() : undefined
                            }) : null}
                        </span>
                    </label>
                ) : null}
                
                {this.renderControl()}

                {caption ? render('caption', caption, {
                    className: cx(`${ns}Form-caption`, captionClassName) 
                }) : null}

                {remark ? render('remark', {
                    type: 'remark',
                    className: cx(`${ns}Form-remark`),
                    tooltip: remark,
                    container: env && env.getModalContainer ? env.getModalContainer() : undefined
                }) : null}

                {hint && this.state.isFocused ? (render('hint', hint, {
                    className: cx(`${ns}Form-hint`)
                })) : null}

                {model && !model.valid ? (
                    <ul className={`${ns}Form-feedback`}>
                        {model.errors.map((msg: string, key: number) => (<li key={key}>{msg}</li>))}
                    </ul>
                ) : null}

                {description ? render('description', description, {
                    className: cx(`${ns}Form-description`, descriptionClassName)
                }) : null}
            </div>
        );
    }

    renderInline() {
        let {
            className,
            classPrefix: ns,
            desc,
            description,
            label,
            labelClassName,
            render,
            required,
            caption,
            descriptionClassName,
            captionClassName,
            formItem: model,
            remark,
            labelRemark,
            env,
            hint,
            renderLabel
        } = this.props;

        description = description || desc;

        return (
            <div className={cx(`${ns}Form-item ${ns}Form-item--inline`, className, {
                'is-error': model && !model.valid,
                [`is-required`]: required,
            })}>
                {label && renderLabel !== false? (
                    <label className={cx(`${ns}Form-label`, labelClassName)}>
                        <span>
                            {label}
                            {required ? (<span className={`${ns}Form-star`}>*</span>) : null}
                            {labelRemark ? render('label-remark', {
                                type: 'remark',
                                tooltip: labelRemark,
                                className: cx(`${ns}Form-lableRemark`),
                                container: env && env.getModalContainer ? env.getModalContainer() : undefined
                            }) : null}
                        </span>
                    </label>
                ) : null}

                <div className={`${ns}Form-value`}>
                    {this.renderControl()}

                    {caption ? render('caption', caption, {
                        className: cx(`${ns}Form-caption`, captionClassName) 
                    }) : null}

                    {remark ? render('remark', {
                        type: 'remark',
                        className: cx(`${ns}Form-remark`),
                        tooltip: remark,
                        container: env && env.getModalContainer ? env.getModalContainer() : undefined
                    }) : null}

                    {hint && this.state.isFocused ? (render('hint', hint, {
                        className: cx(`${ns}Form-hint`)
                    })) : null}

                    {model && !model.valid ? (
                        <ul className={`${ns}Form-feedback`}>
                            {model.errors.map((msg: string, key: number) => (<li key={key}>{msg}</li>))}
                        </ul>
                    ) : null}

                    {description ? render('description', description, {
                        className: cx(`${ns}Form-description`, descriptionClassName)
                    }) : null}
                </div>

            </div>
        );
    }

    renderRow() {
        let {
            className,
            classnames: cx,
            classPrefix: ns,
            desc,
            description,
            label,
            labelClassName,
            render,
            required,
            type,
            caption,
            remark,
            labelRemark,
            env,
            descriptionClassName,
            captionClassName,
            formItem: model,
            renderLabel,
            hint,
            formMode
        } = this.props;

        description = description || desc;

        return (
            <div className={cx(`Form-item Form-item--${formMode}`, className, {
                'is-error': model && !model.valid,
                [`is-required`]: required,
            })}>
                <div className={cx('Form-rowInner')}>
                    {label && renderLabel !== false ? (
                        <label className={cx(`Form-label`, labelClassName)}>
                            <span>
                                {label}
                                {required ? (<span className={cx(`Form-star`)}>*</span>) : null}
                                {labelRemark ? render('label-remark', {
                                    type: 'remark',
                                    tooltip: labelRemark,
                                    className: cx(`Form-lableRemark`),
                                    container: env && env.getModalContainer ? env.getModalContainer() : undefined
                                }) : null}
                            </span>
                        </label>
                    ) : null}
                    
                    {this.renderControl()}

                    {caption ? render('caption', caption, {
                        className: cx(`Form-caption`, captionClassName) 
                    }) : null}

                    {remark ? render('remark', {
                        type: 'remark',
                        className: cx(`Form-remark`),
                        tooltip: remark,
                        container: env && env.getModalContainer ? env.getModalContainer() : undefined
                    }) : null}
                </div>

                {hint && this.state.isFocused ? (render('hint', hint, {
                    className: cx(`Form-hint`)
                })) : null}

                {model && !model.valid ? (
                    <ul className={cx('Form-feedback')}>
                        {model.errors.map((msg: string, key: number) => (<li key={key}>{msg}</li>))}
                    </ul>
                ) : null}

                {description ? render('description', description, {
                    className: cx(`Form-description`, descriptionClassName)
                }) : null}
            </div>
        );
    }

    render() {
        const {
            formMode,
            inputOnly,
            wrap
        } = this.props;

        if (wrap === false || inputOnly) {
            return this.renderControl();
        }

        return formMode === 'inline'
            ? this.renderInline() : formMode === 'horizontal'
            ? this.renderHorizontal() : formMode === 'row'
            ? this.renderRow() : this.renderNormal();
    }
}

export function registerFormItem(config: FormItemConfig): RendererConfig {
    let Control = config.component;

    // 兼容老的 FormItem 用法。
    if (config.validate && !Control.prototype.validate) {
        const fn = config.validate;
        Control.prototype.validate = function () {
            // console.warn('推荐直接在类中定义，而不是 FormItem HOC 的参数中传入。');
            const host = {
                input: this
            };

            return fn.apply(host, arguments);
        };
    } else if (config.validate) {
        console.error('FormItem配置中的 validate 将不起作用，因为类的成员函数中已经定义了 validate 方法，将优先使用类里面的实现。');
    }

    if (config.storeType) {
        Control = HocStoreFactory({
            storeType: config.storeType
        })(Control);
        delete config.storeType;
    }

    // @observer
    class FormItemRenderer extends FormItemWrap {
        static defaultProps = {
            className: '',
            renderLabel: config.renderLabel,
            sizeMutable: config.sizeMutable,
            wrap: config.wrap,
            strictMode: config.strictMode,
            ...Control.defaultProps
        };
        static propsList: any = [
            'value',
            'defaultValue',
            'onChange',
            'setPrinstineValue',
            'readOnly',
            ...(Control as any).propsList
        ];

        static displayName = `FormItem${config.type ? `(${config.type})` : ''}`;
        static ComposedComponent = Control;

        ref: any;

        constructor(props: FormControlProps) {
            super(props);
            this.refFn = this.refFn.bind(this);
        }

        componentWillMount() {
            const {
                validations,
                formItem: model
            } = this.props;
    
            // 组件注册的时候可能默认指定验证器类型
            if (model && !validations && config.validations) {
                model.config({
                    rules: config.validations
                });
            }

            super.componentWillMount();
        }

        shouldComponentUpdate(nextProps: FormControlProps) {
            if (nextProps.strictMode === false) {
                return true;
            }
    
            // 把可能会影响视图的白名单弄出来，减少重新渲染次数。
            if (anyChanged([
                'formPristine',
                'addable',
                'addButtonClassName',
                'addButtonText',
                'addOn',
                'btnClassName',
                'btnLabel',
                'btnDisabled',
                'className',
                'clearable',
                'columns',
                'columnsCount',
                'controls',
                'desc',
                'description',
                'disabled',
                'draggable',
                'editable',
                'editButtonClassName',
                'formHorizontal',
                'formMode',
                'hideRoot',
                'horizontal',
                'icon',
                'inline',
                'inputClassName',
                'label',
                'labelClassName',
                'labelField',
                'language',
                'level',
                'max',
                'maxRows',
                'min',
                'minRows',
                'multiLine',
                'multiple',
                'option',
                'placeholder',
                'removable',
                'required',
                'remark',
                'hint',
                'rows',
                'searchable',
                'showCompressOptions',
                'size',
                'step',
                'showInput',
                'unit',
                'value',
                'diffValue'
            ], this.props, nextProps)) {
                return true;
            }
    
            return false;
        }
        
        getWrappedInstance() {
            return this.ref;
        }

        refFn(ref: any) {
            this.ref = ref;
        }

        renderControl() {
            const {
                inputClassName,
                formItem: model,
                classPrefix: ns,
                children,
                type,
                size,
                defaultSize,
                ...rest
            } = this.props;

            const controlSize = size || defaultSize;
    
            return (
                <Control
                    {...rest}
                    size={config.sizeMutable !== false ? undefined : size}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                    type={type}
                    classPrefix={ns}
                    ref={this.refFn}
                    formItem={model}
                    className={cx(`${ns}Form-control`, {
                        'is-inline': !!rest.inline,
                        'is-error': model && !model.valid,
                        [`${ns}Form-control--size${ucFirst(controlSize)}`]: config.sizeMutable !== false
                            && typeof controlSize === 'string'
                            && !!controlSize
                            && controlSize !== 'full'
                    }, inputClassName)}
                />
            );
        }
    }

    hoistNonReactStatic(FormItemRenderer, Control);

    return registerRenderer({
        ...config,
        name: config.name || `${config.type}-control`,
        weight: typeof config.weight !== 'undefined' ? config.weight : -100, // 优先级高点
        test: config.test || new RegExp(`(^|\/)form(?:\/.+)?\/control\/(?:\d+\/)?${config.type}$`, 'i'),
        component: FormItemRenderer,
        isFormItem: true
    });
}

export function FormItem(config: FormItemBasicConfig) {
    return function (component: FormControlComponent): any {
        const renderer = registerFormItem({
            ...config,
            component
        });

        return renderer.component as any;
    }
}

export default FormItem;
