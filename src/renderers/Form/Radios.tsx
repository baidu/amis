import React from 'react';
import {
    FormItem,
    FormControlProps
} from './Item';
import cx from 'classnames';
import Radios from '../../components/Radios';
import {
    OptionsControl,
    OptionsControlProps,
    Option
} from './Options';

export interface RadiosProps extends OptionsControlProps {
    placeholder?: any;
    columnsCount?: number;
};

export default class RadiosControl extends React.Component<RadiosProps, any> {
    static defaultProps:Partial<RadiosProps> = {
        columnsCount: 1
    }

    render() {
        const {
            className,
            classPrefix: ns,
            value,
            onChange,
            disabled,
            joinValues,
            extractValue,
            delimiter,
            placeholder,
            options,
            inline,
            formMode,
            columnsCount,
            classPrefix,
            itemClassName
        } = this.props;

        return (
            <Radios
                inline={inline || formMode === 'inline'}
                className={cx(`${ns}RadiosControl`, className)}
                value={typeof value === 'undefined' ? '' : value}
                disabled={disabled}
                onChange={onChange}
                joinValues={joinValues}
                extractValue={extractValue}
                delimiter={delimiter}
                placeholder={placeholder}
                options={options}
                columnsCount={columnsCount}
                classPrefix={classPrefix}
                itemClassName={itemClassName}
            />
        );
    }
}

@OptionsControl({
    type: 'radios',
    sizeMutable: false
})
export class RadiosControlRenderer extends RadiosControl {
    static defaultProps = {
        multiple: false
    };
};

