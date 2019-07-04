import React from 'react';
import {
    OptionsControl,
    OptionsControlProps,
    Option
} from './Options';
import cx from 'classnames';
import Button from '../../components/Button';
import {
    SchemaNode,
    Schema,
    Action
} from '../../types';
import find = require('lodash/find');
import {anyChanged, autobind, getVariable} from '../../utils/helper';
import findIndex = require('lodash/findIndex');
import Html from '../../components/Html';
import { filter } from '../../utils/tpl';

export interface PickerProps extends OptionsControlProps {
    modalMode: 'dialog' | 'drawer';
    pickerSchema: object;
    labelField: string;
};

export interface PickerState {
    isOpened: boolean;
    schema: SchemaNode;
};

export default class PickerControl extends React.PureComponent<PickerProps, any> {
    static propsList: Array<string> = [
        "modalMode",
        "pickerSchema",
        "labelField",
        "onChange",
        "options",
        "value",
        "inline",
        "multiple",
        "embed",
    ];
    static defaultProps: Partial<PickerProps> = {
        modalMode: 'dialog',
        multiple: false,
        pickerSchema: {
            mode: 'list',
            listItem: {
                title: '${label}'
            }
        },
        embed: false
    }

    state: PickerState = {
        isOpened: false,
        schema: this.buildSchema(this.props)
    };

    componentWillReceiveProps(nextProps: PickerProps) {
        const props = this.props;

        if (anyChanged([
            'pickerSchema',
            'multiple',
            'source'
        ], props, nextProps)) {
            this.setState({
                schema: this.buildSchema(nextProps)
            });
        }
    }

    buildSchema(props: PickerProps) {
        return {
            ...props.pickerSchema,
            type: 'crud',
            pickerMode: true,
            syncLocation: false,
            api: props.source,
            keepItemSelectionOnPageChange: true,
            valueField: props.valueField,
            labelField: props.labelField,
            checkOnItemClick: true,

            // 不支持批量操作，会乱套
            bulkActions: props.multiple ? (props.pickerSchema as Schema).bulkActions : [],
        }
    }

    @autobind
    open() {
        this.setState({
            isOpened: true
        });
    }

    @autobind
    close() {
        this.setState({
            isOpened: false
        });
    }

    @autobind
    handleModalConfirm(values: Array<any>, action: Action, ctx: any, components: Array<any>) {
        const idx = findIndex(components, (item: any) => item.props.type === "crud");
        this.handleChange(values[idx].items);
        this.close();
    }

    @autobind
    handleChange(items: Array<any>) {
        const {
            joinValues,
            valueField,
            delimiter,
            extractValue,
            multiple,
            options,
            setOptions,
            onChange
        } = this.props;

        let value: any = items;

        if (joinValues) {
            value = items.map((item: any) => item[valueField || 'value']).join(delimiter || ',');
        } else if (extractValue) {
            value = multiple ? items.map((item: any) => item[valueField || 'value']) : (items[0] && items[0][valueField || 'value'] || '');
        } else {
            value = multiple ? items : items[0];
        }

        let additionalOptions: Array<any> = [];
        items.forEach(item => {
            if (!find(options, option => item[valueField || 'value'] == option[valueField || 'value'])) {
                additionalOptions.push(item);
            }
        });

        additionalOptions.length && setOptions(options.concat(additionalOptions));
        onChange(value);
    }

    removeItem(index: number) {
        const {
            selectedOptions,
            joinValues,
            extractValue,
            delimiter,
            valueField,
            onChange,
            multiple
        } = this.props;
        const items = selectedOptions.concat();
        items.splice(index, 1);

        let value: any = items;

        if (joinValues) {
            value = items.map((item: any) => item[valueField || 'value']).join(delimiter || ',');
        } else if (extractValue) {
            value = multiple ? items.map((item: any) => item[valueField || 'value']) : (items[0] && items[0][valueField || 'value'] || '');
        } else {
            value = multiple ? items : items[0];
        }

        onChange(value);
    }

    renderValues() {
        const {
            classPrefix: ns,
            selectedOptions,
            labelField,
            labelTpl,
            disabled
        } = this.props;
        return (
            <div className={`${ns}Picker-values`}>
                {selectedOptions.map((item, index) => (
                    <div key={index} className={cx(`${ns}Picker-value`, {
                        'is-disabled': disabled
                    })}>
                        <span data-tooltip="删除" data-position="bottom" className={`${ns}Picker-valueIcon`} onClick={this.removeItem.bind(this, index)}>×</span>
                        <span className={`${ns}Picker-valueLabel`}>
                        {labelTpl
                            ? (<Html html={filter(labelTpl, item)} />)
                            : getVariable(item, labelField || 'label') || getVariable(item, 'id')}
                        </span>
                    </div>
                ))}
            </div>
        );
    }

    @autobind
    renderBody() {
        const {
            render,
            selectedOptions,
            options,
            multiple,
            valueField,
            embed
        } = this.props;

        return render('modal-body', this.state.schema, {
            value: selectedOptions,
            valueField,
            options: options,
            multiple,
            onSelect: embed ? this.handleChange : undefined
        }) as JSX.Element;
    }

    render() {
        const {
            className,
            classPrefix: ns,
            disabled,
            render,
            modalMode,
            source,
            size,
            env,
            embed
        } = this.props;
        return (
            <div className={cx(`${ns}PickerControl`, className)}>
                {embed ? (
                    <div className={`${ns}Picker`}>
                        {this.renderBody()}
                    </div>
                ) : (
                    <div className={`${ns}Picker`}>
                        {this.renderValues()}

                        <Button
                            classPrefix={ns}
                            className={`${ns}Picker-pickBtn`}
                            tooltip="点击选择"
                            tooltipContainer={env && env.getModalContainer ? env.getModalContainer() : undefined}
                            level="info"
                            size="sm"
                            disabled={disabled}
                            onClick={this.open}
                            iconOnly
                        >
                        选定
                        </Button>

                        {render('modal', {
                            title: '请选择',
                            size: size,
                            type: modalMode,
                            body: {
                                children: this.renderBody
                            }
                        }, {
                            key: 'modal',
                            lazyRender: !!source,
                            onConfirm: this.handleModalConfirm,
                            onClose: this.close,
                            show: this.state.isOpened
                        })}
                    </div>
                    )}
            </div>
        );
    }
}


@OptionsControl({
    type: 'picker',
    autoLoadOptionsFromSource: false,
    sizeMutable: false
})
export class PickerControlRenderer extends PickerControl {};

