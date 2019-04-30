import * as React from 'react';
import {
    Renderer,
    RendererProps
} from '../factory';
import {ServiceStore, IServiceStore} from '../store/service';
import {
    Api,
    SchemaNode
} from '../types';
import {
    filter
} from '../utils/tpl';
import * as cx from 'classnames';
import * as moment from 'moment';

export interface DateProps extends RendererProps {
    className?: string;
    placeholder?: string;
    format?: string;
    valueFormat?: string;
}

export class DateField extends React.Component<DateProps, object> {
    static defaultProps:Partial<DateProps> = {
        placeholder: '-',
        format: 'YYYY-MM-DD',
        valueFormat: 'X'
    };

    render() {
        const {
            className,
            value,
            valueFormat,
            format,
            placeholder,
            classnames: cx
        } = this.props;

        let viewValue:React.ReactNode = <span className="text-muted">{placeholder}</span>;

        if (value) {
            let date = moment(value, valueFormat);
            viewValue = date.isValid() ? date.format(format) : <span className="text-danger">日期无效</span>;
        }

        return (
            <span className={cx('DateField', className)}>
                {viewValue}
            </span>
        );
    }
}

@Renderer({
    test: /(^|\/)date$/,
    name: 'date-field'
})
export class DateFieldRenderer extends DateField {
    static defaultProps:Partial<DateProps> = {
        ...DateField.defaultProps,
        format: 'YYYY-MM-DD'
    };
};

@Renderer({
    test: /(^|\/)datetime$/,
    name: 'datetime-field'
})
export class DateTimeFieldRenderer extends DateField {
    static defaultProps:Partial<DateProps> = {
        ...DateField.defaultProps,
        format: 'YYYY-MM-DD HH:mm:ss'
    };
};

@Renderer({
    test: /(^|\/)time$/,
    name: 'time-field'
})
export class TimeFieldRenderer extends DateField {
    static defaultProps:Partial<DateProps> = {
        ...DateField.defaultProps,
        format: 'HH:mm'
    };
};
