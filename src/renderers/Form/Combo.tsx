import * as React from 'react';
import {
    findDOMNode
} from 'react-dom';
import {
    FormItem,
    FormControlProps
} from './Item';
import * as cx from 'classnames';
import { Schema, Action, Api } from '../../types';
import {ComboStore, IComboStore} from '../../store/combo';
import { observer } from "mobx-react";

import {
    guid,
    anyChanged,
    isObject,
    createObject} from '../../utils/helper';
import Sortable = require('sortablejs');
import { evalExpression, filter } from '../../utils/tpl';

export interface ComboProps extends FormControlProps {
    placeholder?: string;
    flat?: boolean; // 是否把值打平，即原来是对象现在只有对象中的值。
    draggable?: boolean; // 是否可拖拽
    controls: Array<Schema>;
    multiple?: boolean;
    multiLine?: boolean;
    minLength?: number;
    maxLength?: number;
    scaffold?: any;
    addButtonClassName?: string;
    formClassName?: string;
    addButtonText?: string;
    addable?: boolean;
    removable?: boolean;
    deleteApi?: Api,
    deleteConfirmText?: string;
    subFormMode?: 'normal' | 'inline' | 'horizontal';
    noBorder?: boolean;
    joinValues?: boolean;
    delimiter?: string;
    dragIcon: string,
    deleteIcon: string;
    store: IComboStore;
};

export default class ComboControl extends React.Component<ComboProps> {
    static defaultProps = {
        minLength: 0,
        maxLength: 0,
        multiple: false,
        multiLine: false,
        addButtonClassName: '',
        formClassName: '',
        subFormMode: 'normal',
        draggableTip: '可拖拽排序',
        addButtonText: '新增',
        canAccessSuperData: false,
        addIcon: 'fa fa-plus',
        dragIcon: 'glyphicon glyphicon-sort',
        deleteIcon: 'glyphicon glyphicon-remove'
    };
    static propsList: Array<string> = [
        "minLength",
        "maxLength",
        "multiple",
        "multiLine",
        "addButtonClassName",
        "subFormMode",
        "draggableTip",
        "addButtonText",
        "draggable",
        "scaffold",
        "canAccessSuperData",
        "addIcon",
        "dragIcon",
        "deleteIcon",
        "noBorder"
    ];

    subForms:Array<any> = [];
    keys: Array<string> = [];
    dragTip?: HTMLElement;
    sortable?: Sortable;
    defaultValue?: any;
    constructor(props:ComboProps) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleSingleFormChange = this.handleSingleFormChange.bind(this);
        this.handleSingleFormInit = this.handleSingleFormInit.bind(this);
        this.handleAction = this.handleAction.bind(this);
        this.addItem = this.addItem.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.dragTipRef = this.dragTipRef.bind(this);
        this.defaultValue = {
            ...props.scaffold
        };
    }

    componentWillMount() {
        const {
            store,
            value,
            minLength,
            maxLength
        } = this.props;

        store.config({
            minLength,
            maxLength,
            length: this.getValueAsArray().length
        });
    }

    componentWillReceiveProps(nextProps:ComboProps) {
        const props = this.props;

        if (anyChanged(['minLength', 'maxLength', 'value'], props, nextProps)) {
            const {
                store,
                minLength,
                maxLength
            } = nextProps;
    
            store.config({
                minLength,
                maxLength,
                length: this.getValueAsArray(nextProps).length
            });
        }
    }

    getValueAsArray(props = this.props) {
        const {
            flat,
            joinValues,
            delimiter,
        } = props;
        let value = props.value;

        if (joinValues && flat && typeof value === 'string') {
            value = value.split(delimiter || ',');
        } else if (!Array.isArray(value)) {
            value = [];
        } else {
            value = value.concat();
        }
        return value;
    }

    addItem() {
        const {
            flat,
            joinValues,
            delimiter,
            scaffold,
            disabled
        } = this.props;

        if (disabled) {
            return;
        }

        let value = this.getValueAsArray();

        value.push(flat ? scaffold || '' : {
            ...scaffold
        });
        this.keys.push(guid());

        if (flat && joinValues) {
            value = value.join(delimiter || ',');
        }

        this.props.onChange(value);
    }

    async removeItem(key:number) {
        const {
            flat,
            joinValues,
            delimiter,
            disabled,
            deleteApi,
            deleteConfirmText,
            data,
            env
        } = this.props;

        if (disabled) {
            return;
        }

        let value = this.getValueAsArray();
        
        if (deleteApi) {
            const ctx = createObject(data, value[key]);
            const confirmed = await env.confirm(deleteConfirmText ? filter(deleteConfirmText, ctx): '确认要删除？')
            if (!confirmed) { // 如果不确认，则跳过！
                return;
            }

            const result = await env.fetcher(deleteApi, ctx);

            if (!result.ok) {
                env.notify('error', '删除失败');
                return;
            }
        }

        value.splice(key, 1);
        this.keys.splice(key, 1);

        if (flat && joinValues) {
            value = value.join(delimiter || ',');
        }

        this.props.onChange(value);
    }

    handleChange(index:number, values: any) {
        const {
            formItem,
            flat,
            store,
            joinValues,
            delimiter,
            disabled
        } = this.props;

        if (disabled) {
            return;
        }

        let value = this.getValueAsArray();
        value[index] = flat ? values.flat : {...values};

        if (flat && joinValues) {
            value = value.join(delimiter || ',');
        }

        this.props.onChange(value);

        if (formItem && formItem.validated) {
            this.subForms.forEach(item => item.validate());
        }

        store.forms.forEach(item => item.items.forEach(item => item.unique && item.syncOptions()));
    }

    handleSingleFormChange(values:object) {
        this.props.onChange({
            ...values
        });
    }

    handleSingleFormInit(values:any) {
        this.props.syncDefaultValue !== false && this.props.setPrinstineValue && this.props.setPrinstineValue({
            ...values
        });
    }

    handleAction(action: Action):any {
        const {
            onAction
        } = this.props;

        if (action.actionType === 'delete') {
            action.index !== void 0 && this.removeItem(action.index);
            return;
        }

        onAction && onAction.apply(null, arguments);
    }

    validate():any {
        
        const {
            value,
            minLength,
            maxLength
        } = this.props;

        if (minLength && (!Array.isArray(value) || value.length < minLength)) {
            return `组合表单成员数量不够，低于最小的设定${minLength}个，请添加更多的成员。`;
        } else if (maxLength && Array.isArray(value) && value.length > maxLength) {
            return `组合表单成员数量超出，超出最大的设定${maxLength}个，请删除多余的成员。`;
        } else if (this.subForms.length) {
            return Promise
                .all(this.subForms.map(item => item.validate()))
                .then((values) => {
                    if (~values.indexOf(false)) {
                        return '子表单验证失败，请仔细检查';
                    }

                    return;
                })
        }
    }

    dragTipRef(ref:any) {
        if (!this.dragTip && ref) {
            this.initDragging();
        } else if (this.dragTip && !ref) {
            this.destroyDragging()
        }

        this.dragTip = ref;
    }

    initDragging() {
        const ns = this.props.classPrefix;
        const dom = findDOMNode(this) as HTMLElement;
        this.sortable = new Sortable(dom.querySelector(`.${ns}Combo-items`) as HTMLElement, {
            group: 'combo',
            handle: `.${ns}Combo-itemDrager`,
            ghostClass: `${ns}Combo-item--dragging`,
            onEnd: (e:any) => {
                // 没有移动
                if (e.newIndex === e.oldIndex) {
                    return;
                }

                // 换回来
                const parent = e.to as HTMLElement;
                if (e.oldIndex < parent.childNodes.length -1) {
                    parent.insertBefore(e.item, parent.childNodes[e.oldIndex]);
                } else {
                    parent.appendChild(e.item);
                }

                const value = this.props.value;
                if (!Array.isArray(value)) {
                    return;
                }
                const newValue = value.concat();
                newValue.splice(e.newIndex, 0, newValue.splice(e.oldIndex, 1)[0]);
                this.keys.splice(e.newIndex, 0, this.keys.splice(e.oldIndex, 1)[0]);
                this.props.onChange(newValue);
            }
        });
    }

    destroyDragging() {
        this.sortable && this.sortable.destroy();
    }

    formRef(ref:any, index:number = 0) {
        if (ref) {
            while (ref && ref.getWrappedInstance) {
                ref = ref.getWrappedInstance();
            }
            this.subForms[index] = ref;
        } else {
            this.subForms.splice(index, 1);
        }
    }

    formatValue(value:any) {
        const {
            flat
        } = this.props;

        if (flat) {
            return {
                flat: value
            }
        }

        return value;
    }

    renderMultipe() {
        const {
            classPrefix: ns,
            classnames: cx,
            formClassName,
            render,
            controls,
            multiLine,
            addButtonClassName,
            disabled,
            store,
            flat,
            subFormMode,
            draggable,
            draggableTip,
            addButtonText,
            addable,
            removable,
            itemRemovableOn,
            delimiter,
            canAccessSuperData,
            addIcon,
            dragIcon,
            deleteIcon,
            noBorder,
        } = this.props;

        let value = this.props.value;

        if (flat && typeof value === 'string') {
            value = value.split(delimiter || ',');
        }

        const finnalRemovable = store.removable !== false // minLength ?
            && !disabled // 控件自身是否禁用
            && removable !== false; // 是否可以删除

        return (
            <div 
                className={cx(`Combo Combo--multi`, multiLine ? `Combo--ver` : `Combo--hor`, noBorder ? `Combo--noBorder` : '')}
            >
                <div className={cx(`Combo-items`)}>
                    {Array.isArray(value) ? value.map((value, index, thelist) => {
                        const toolbar:Array<any> = [];

                        if (!disabled && draggable && thelist.length > 1) {
                            toolbar.push(
                                <a
                                    key="drag"
                                    className={cx(`Combo-toolbarBtn Combo-itemDrager`)}
                                    data-tooltip="拖拽排序"
                                    data-position="bottom"
                                >
                                    <i className={dragIcon} />
                                </a>
                            );
                        }

                        if (
                            finnalRemovable
                            && ( // 表达式判断单条是否可删除
                                !itemRemovableOn 
                                || evalExpression(itemRemovableOn, value) !== false
                            )
                        ) {
                            toolbar.push(
                                <a
                                    onClick={this.removeItem.bind(this, index)}
                                    key="remove"
                                    className={cx(`Combo-toolbarBtn ${!store.removable ? 'is-disabled' : ''}`)}
                                    data-tooltip="删除"
                                    data-position="bottom"
                                >
                                    <i className={deleteIcon} />
                                </a>
                            );
                        }

                        let finnalControls = flat ? [{
                            ...controls[0],
                            name: 'flat'
                        }] : controls;

                        return (
                            <div 
                                className={cx(`Combo-item`)}
                                key={this.keys[index] || (this.keys[index] = guid())}>
                                <div className={cx(`Combo-itemInner`)}>
                                    {render('multiple', {
                                        type: 'form',
                                        controls: finnalControls,
                                        wrapperComponent: 'div',
                                        wrapWithPanel: false,
                                        mode: multiLine ? subFormMode : 'row',
                                        className: cx(`Combo-form`, formClassName)
                                    }, {
                                        index,
                                        disabled,
                                        data: this.formatValue(value) || this.defaultValue,
                                        onChange: this.handleChange.bind(this, index),
                                        onAction: this.handleAction,
                                        ref: (ref:any) => this.formRef(ref, index),
                                        canAccessSuperData
                                    })}
                                </div>
                                {toolbar.length ? (
                                    <div className={cx(`Combo-itemToolbar`)}>{toolbar}</div>
                                ) : null}
                            </div>
                        );
                    }) : null}
                </div>
                {!disabled ? (
                    <div className={cx(`Combo-toolbar`)}>
                        {store.addable && addable !== false ? (
                            <button
                                type="button"
                                onClick={this.addItem}
                                className={cx(`Button Combo-addBtn`, addButtonClassName)}
                                data-tooltip="新增一条数据"
                            >
                                {addIcon ? (<i className={cx("Button-icon", addIcon)} />) : null}
                                <span>{addButtonText || '新增'}</span>
                            </button>
                        ) : null}
                        {
                            draggable ? (<span className={cx(`Combo-dragableTip`)} ref={this.dragTipRef} >{Array.isArray(value) && value.length > 1 ? draggableTip : ''}</span>) : null
                        }
                    </div>
                ) : null}
            </div>
        );
    }

    renderSingle() {
        const {
            controls,
            classnames: cx,
            render,
            value,
            multiLine,
            formClassName,
            canAccessSuperData,
            noBorder,
            disabled
        } = this.props;


        return (
            <div 
                className={cx(`Combo Combo--single`, multiLine ? `Combo--ver` : `Combo--hor`, noBorder ? `Combo--noBorder` : '')}
            >
                <div className={cx(`Combo-item`)}>
                    <div className={cx(`Combo-itemInner`)}>
                        {render('single', {
                            type: 'form',
                            controls,
                            wrapperComponent: 'div',
                            wrapWithPanel: false,
                            mode: multiLine ? 'normal' : 'row',
                            className: cx(`Combo-form`, formClassName)
                        }, {
                            disabled: disabled,
                            data: isObject(value) ? value : this.defaultValue,
                            onChange: this.handleSingleFormChange,
                            ref: (ref:any) => this.formRef(ref),
                            onInit: this.handleSingleFormInit,
                            canAccessSuperData
                        })}
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const {
            multiple,
            className,
            classPrefix: ns,
            classnames: cx,
        } = this.props;

        return (
            <div className={cx(`ComboControl`, className)}>
                {multiple ? this.renderMultipe() : this.renderSingle()}
            </div>
        );
    }
}


@FormItem({
    type: 'combo',
    storeType: ComboStore.name
})
export class ComboControlRenderer extends ComboControl {};

