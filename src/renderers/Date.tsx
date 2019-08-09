import React from 'react';
import {Renderer, RendererProps} from '../factory';
import moment from 'moment';

export interface DateProps extends RendererProps {
    className?: string;
    placeholder?: string;
    format?: string;
    valueFormat?: string;
    fromNow?: boolean;
    updateFrequency?: number;
}

export interface DateState {
    random?: number;
}

export class DateField extends React.Component<DateProps, DateState> {
    static defaultProps: Partial<DateProps> = {
        placeholder: '-',
        format: 'YYYY-MM-DD',
        valueFormat: 'X',
        fromNow: false,
        updateFrequency: 0
    };

    // 动态显示相对时间时，用来触发视图更新
    state = {
        random: 0
    }

    render() {
        const {className, value, valueFormat, format, placeholder, classnames: cx, fromNow, updateFrequency} = this.props;

        let viewValue: React.ReactNode = <span className="text-muted">{placeholder}</span>;

        if (value) {
            let ISODate = moment(value, moment.ISO_8601);
            let NormalDate = moment(value, valueFormat);

            // ISO_8601 格式数据（如 2014-09-08T08:02:17-05:00）使用正常格式解析会解析成1970年但是isValid=true，所以需要提前检测
            viewValue = !ISODate.isValid() ? (
                NormalDate.isValid() ?
                    NormalDate.format(format) : false
            ) : ISODate.format(format);
        }

        if (fromNow && viewValue) {
            if (updateFrequency) {
                setTimeout(() => {
                    this.setState({
                        random: Math.random()
                    });
                }, updateFrequency);
            }
            viewValue = moment(viewValue as string).fromNow();
        }

        viewValue = !viewValue ? <span className="text-danger">日期无效</span> : viewValue;

        return <span className={cx('DateField', className)}>{viewValue}</span>;
    }
}

@Renderer({
    test: /(^|\/)date$/,
    name: 'date-field',
})
export class DateFieldRenderer extends DateField {
    static defaultProps: Partial<DateProps> = {
        ...DateField.defaultProps,
        format: 'YYYY-MM-DD',
    };
}

@Renderer({
    test: /(^|\/)datetime$/,
    name: 'datetime-field',
})
export class DateTimeFieldRenderer extends DateField {
    static defaultProps: Partial<DateProps> = {
        ...DateField.defaultProps,
        format: 'YYYY-MM-DD HH:mm:ss',
    };
}

@Renderer({
    test: /(^|\/)time$/,
    name: 'time-field',
})
export class TimeFieldRenderer extends DateField {
    static defaultProps: Partial<DateProps> = {
        ...DateField.defaultProps,
        format: 'HH:mm',
    };
}
