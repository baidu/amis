/**
 * @file checkboxes 多选输入框
 *
 * @author fex
 */

import * as React from 'react';
import uncontrollable = require('uncontrollable');
import Checkbox from './Checkbox';
import {value2array, OptionProps, Option} from './Checkboxes';
import chunk = require('lodash/chunk');
import { ClassNamesFn, themeable } from '../theme';

/**
 * 参数说明：
 *
 * options: [
 *   {
 *      label: '显示的名字',
 *      value: '值',
 *      disabled: false
 *   }
 * ]
 */

 interface RadioProps extends OptionProps {
     id?: string;
     type: string;
     value?: string;
     className?: string;
     style?: React.CSSProperties;
     inline?: boolean;
     disabled?: boolean;
     onChange?: Function;
     columnsCount: number;
     classPrefix: string;
     classnames: ClassNamesFn;
 }

export class Radios extends React.Component<RadioProps, any> {

    static defaultProps = {
        joinValues: true,
        clearable: false,
        columnsCount: 1 // 一行显示一个
    };

    toggleOption(option: Option) {
        const {
            value,
            onChange,
            joinValues,
            extractValue,
            valueField,
            clearable,
            delimiter,
            options
        } = this.props;

        let valueArray = value2array(value, {
            multiple: false,
            delimiter,
            valueField,
            options
        });
        const idx = valueArray.indexOf(option);

        if (~idx) {
            clearable && valueArray.splice(idx, 1);
        } else {
            valueArray = [option];
        }

        let newValue = valueArray[0];

        if (newValue && (joinValues || extractValue)) {
            newValue = newValue[valueField || 'value'];
        }

        // if (joinValues && newValue) {
        //     newValue = newValue[valueField || 'value'];
        // }

        onChange && onChange(newValue);
    }

    render() {
        const {
            value,
            options,
            className,
            classnames: cx,
            placeholder,
            columnsCount,
            disabled,
            inline,
            delimiter,
            valueField,
            classPrefix
        } = this.props;

        let valueArray = value2array(value, {
            multiple: false,
            delimiter,
            valueField,
            options
        });
        let body: Array<React.ReactNode> = [];

        if (options) {
            body = options.map((option, key) => (
                <Checkbox
                    type="radio"
                    classPrefix={classPrefix}
                    key={key}
                    onChange={() => this.toggleOption(option)}
                    checked={!!~valueArray.indexOf(option)}
                    className={option.className}
                    disabled={disabled || option.disabled}
                    inline={inline}
                >
                    {option.label}
                </Checkbox>
            ));
        }

        if (!inline && columnsCount > 1) {
            let weight = 12/(columnsCount as number);
            let cellClassName = `Grid-col--sm${weight === Math.round(weight) ? weight : ''}`;
            body = chunk(body, columnsCount).map((group, groupIndex) => (
                <div className={cx('Grid')} key={groupIndex}>
                    {group.map((item, index) => (
                        <div key={index} className={cx(cellClassName)}>{item}</div>
                    ))}
                </div>
            ));
        }

        return (
            <div className={className}>
                {body && body.length ? body : placeholder}
            </div>
        );
    }
}

export default themeable(uncontrollable(Radios, {
    value: 'onChange'
}));
