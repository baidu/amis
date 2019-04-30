/**
 * @file checkbox组件
 * @author fex
 */

import * as React from 'react';
import * as cx from 'classnames';
import { ClassNamesFn, themeable } from '../theme';

const sizeMap = {
    sm: 'i-checks-sm',
    lg: 'i-checks-lg',
    small: 'i-checks-sm',
    large: 'i-checks-lg'
};

interface CheckboxProps {
    id?: string;
    key?: string | number;
    style?: React.CSSProperties;
    type?: string;
    size?: 'sm' | 'lg' | 'small' | 'large';
    label?: string;
    className?: string;
    onChange?: (value:any) => void;
    value?: any;
    containerClass?: string;
    inline?: boolean;
    trueValue?: boolean;
    falseValue?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    checked?: boolean;
    name?: string;
    classPrefix: string;
    classnames: ClassNamesFn;
    partial?: boolean;
}

export class Checkbox extends React.Component<CheckboxProps, any> {
    static defaultProps = {
        trueValue: true,
        falseValue: false,
        type: 'checkbox'
    };

    constructor(props:CheckboxProps) {
        super(props);

        this.hanldeCheck = this.hanldeCheck.bind(this);
    }

    hanldeCheck(e:React.ChangeEvent<any>) {
        const {
            trueValue,
            falseValue,
            onChange
        } = this.props;

        if (!onChange) {
            return;
        }

        onChange(e.currentTarget.checked ? trueValue : falseValue);
    }

    render() {
        let {
            size,
            className,
            classPrefix: ns,
            value,
            label,
            partial,
            trueValue,
            children,
            disabled,
            readOnly,
            checked,
            type,
            name
        } = this.props;

        className = (className ? className : '') + (size && sizeMap[size] ? ` ${sizeMap[size]}` : '');

        return (
            <label 
                className={cx(`${ns}Checkbox ${ns}Checkbox--${type}`, {
                    [`${ns}Checkbox--full`]: !partial
                }, className)}
            >
                <input
                    type={type}
                    checked={typeof checked !== 'undefined' ? checked : typeof value === 'undefined' ? value : value == trueValue}
                    onChange={this.hanldeCheck}
                    disabled={disabled}
                    readOnly={readOnly}
                    name={name}
                />
                <i />
                <span>{children || label}</span>
            </label>
        );
    }
}

export default themeable(Checkbox);
