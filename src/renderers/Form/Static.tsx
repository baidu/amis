import * as React from 'react';
import {
    FormItem,
    FormControlProps
} from './Item';
import * as cx from 'classnames';
import {TableCell} from '../Table';
import PopOver from '../PopOver';
import QuickEdit from '../QuickEdit';
import {Renderer} from '../../factory';
import Copyable from '../Copyable';
import {extendObject} from '../../utils/helper';

export interface StaticProps extends FormControlProps {
    placeholder?: string;
    tpl?: string;
    text?: string;
};

export default class StaticControl extends React.Component<StaticProps, any> {
    static defaultProps = {
        placeholder: '-'
    };

    constructor(props: StaticProps) {
        super(props);

        this.handleQuickChange = this.handleQuickChange.bind(this);
    }

    handleQuickChange(values: any, saveImmediately: boolean | any) {
        const {
            onBulkChange,
            onAction,
            data
        } = this.props;

        onBulkChange(values, saveImmediately === true);
        if (saveImmediately && saveImmediately.api) {
            onAction(null, {
                actionType: 'ajax',
                api: saveImmediately.api
            }, extendObject(data, values));
        }
    }

    render() {
        const {
            className,
            value,
            label,
            type,
            render,
            children,
            ...rest
        } = this.props;

        const subType = type.substring(7) || 'tpl';

        // if (subType === 'tpl') {
        //     return (
        //         <div className={cx('form-control-static', className)}>
        //             {text ? text : (tpl || value ? render('tpl', tpl || value && (typeof value === 'string' ? value : JSON.stringify(value))) : (<span className="text-muted">{placeholder}</span>))}
        //         </div>
        //     );
        // }

        const field = {
            label,
            name,
            ...rest,
            type: subType
        };

        return (
            <div className="form-control-static">
                {render('field', {
                    ...field,
                    type: 'static-field',
                    field
                }, {
                        value,
                        className,
                        onQuickChange: this.handleQuickChange,
                    })}
            </div>
        );;
    }
}

@FormItem({
    test: /(^|\/)form(?:\/.+)?\/control\/static(\-[^\/]+)?$/,
    strictMode: false,
    sizeMutable: false,
    name: "static-control"
})
export class StaticControlRenderer extends StaticControl {};


@Renderer({
    test: /(^|\/)static\-field$/,
})
@QuickEdit()
@PopOver()
@Copyable()
export class StaticFieldRenderer extends TableCell {
    static defaultProps = {
        ...TableCell.defaultProps,
        wrapperComponent: 'div'
    };

    render() {
        let {
            type,
            className,
            render,
            style,
            wrapperComponent: Component,
            labelClassName,
            value,
            data,
            children,
            width,
            inputClassName,
            label,
            tabIndex,
            onKeyUp,
            field,
            ...rest
        } = this.props;

        const schema = {
            ...field,
            className: inputClassName,
            type: field && field.type || 'plain',
        };

        let body = children ? children : render('field', schema, {
            ...rest,
            value,
            data
        });

        if (width) {
            style = style || {};
            style.width = style.width || width;
        }

        if (!Component) {
            return body as JSX.Element;
        }

        return (
            <Component
                style={style}
                className={className}
                tabIndex={tabIndex}
                onKeyUp={onKeyUp}
            >
                {body}
            </Component>
        )
    }
};