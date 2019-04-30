import * as React from 'react';
import {
    OptionsControl,
    OptionsControlProps
} from './Options';
import * as cx from 'classnames';
import Checkbox from '../../components/Checkbox';
import chunk = require('lodash/chunk');

export interface CheckboxesProps extends OptionsControlProps {
    placeholder?: any;
    disabled?: boolean;
    columnsCount?: number;
};

export default class CheckboxesControl extends React.Component<CheckboxesProps, any> {
    static defaultProps:Partial<CheckboxesProps> = {
        columnsCount: 1,
        multiple: true,
        placeholder: '暂无选项'
    }

    componentDidMount() {
        const {
            defaultCheckAll,
            onToggleAll
        } = this.props;

        defaultCheckAll && onToggleAll();
    }

    render() {
        const {
            className,
            disabled,
            placeholder,
            options,
            inline,
            columnsCount,
            selectedOptions,
            onToggle,
            onToggleAll,
            checkAll,
            classPrefix: ns
        } = this.props;

        let body:Array<React.ReactNode> = [];

        if (options) {
            body = options.map((option, key) => (
                <Checkbox
                    classPrefix={ns}
                    key={key}
                    onChange={() => onToggle(option)}
                    checked={!!~selectedOptions.indexOf(option)}
                    disabled={disabled || option.disabled}
                    inline={inline}
                >
                    {option.label}
                </Checkbox>
            ));
        }

        if (checkAll && body.length) {
            body.unshift(
                <Checkbox
                    key="checkall"
                    classPrefix={ns}
                    onChange={onToggleAll}
                    checked={!!selectedOptions.length}
                    partial={!!(selectedOptions.length && selectedOptions.length !== options.length)}
                    disabled={disabled}
                    inline={inline}
                >
                    全选/不选
                </Checkbox>
            );
        }

        if (!inline && (columnsCount as number) > 1) {
            let weight = 12/(columnsCount as number);
            let cellClassName = `${ns}Grid-col--sm${weight === Math.round(weight) ? weight : ''}`;
            body = chunk(body, columnsCount).map((group, groupIndex) => (
                <div className={`${ns}Grid`} key={groupIndex}>
                    {group.map((item, index) => (
                        <div key={index} className={cellClassName}>{item}</div>
                    ))}
                </div>
            ));
        }

        return (
            <div className={cx(`${ns}CheckboxesControl`, className)}>
                {body && body.length ? body : (
                    <span className={`${ns}Form-placeholder`}>{placeholder}</span>
                )}
            </div>
        );
    }
}

@OptionsControl({
    type: 'checkboxes',
    sizeMutable: false
})
export class CheckboxesControlRenderer extends CheckboxesControl {};

