import * as React from 'react';
import {
    FormItem,
    FormControlProps,
} from './Item';
import * as cx from 'classnames';
import * as InputNumber from 'rc-input-number';
import { Action } from '../../types';

export interface NumberProps extends FormControlProps {
    placeholder?: string;
    max?: number;
    min?: number;
    step?: number;
    precision?: number;
};

export default class NumberControl extends React.Component<NumberProps, any> {
    static defaultProps: Partial<NumberProps> = {
        step: 1,
        resetValue: ''
    };

    constructor(props:NumberProps) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(inputValue: any) {
        const {
            classPrefix: ns,
            onChange,
            resetValue
        } = this.props;

        onChange(typeof inputValue === 'undefined' ? (resetValue || '') : inputValue);
    }

    render(): JSX.Element {
        const {
            className,
            classPrefix: ns,
            value,
            step,
            precision,
            max,
            min,
            disabled,
            placeholder,
        } = this.props;

        let precisionProps: any = {};

        if (typeof precision === 'number') {
            precisionProps.precision = precision;
        }

        return (
            <div className={cx(`${ns}NumberControl`, className)}>
                <InputNumber
                    prefixCls={`${ns}Number`}
                    value={value}
                    step={step}
                    max={max}
                    min={min}
                    onChange={this.handleChange}
                    disabled={disabled}
                    placeholder={placeholder}
                    {...precisionProps}
                />
            </div>
        );
    }
}

@FormItem({
    type: 'number'
})
export class NumberControlRenderer extends NumberControl {
    static defaultProps: Partial<FormControlProps> = {
        validations: 'isNumeric'
    }
};
