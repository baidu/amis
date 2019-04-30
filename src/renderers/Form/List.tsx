import * as React from 'react';
import {
    OptionsControl,
    OptionsControlProps,
    Option
} from './Options';
import { Item } from 'react-bootstrap/lib/Breadcrumb';
import { Schema } from '../../types';
import { createObject } from '../../utils/helper';

export interface ListProps extends OptionsControlProps {
    imageClassName: string;
    submitOnDBClick?: boolean;
    itemSchema?: Schema;
};

export default class ListControl extends React.Component<ListProps, any> {
    static defaultProps = {
        clearable: false,
        imageClassName: '',
        submitOnDBClick: false
    }

    handleDBClick(option:Option, e:React.MouseEvent<HTMLElement>) {
        this.props.onToggle(option);
        this.props.onAction(e, {
            type: 'submit'
        });
    }

    handleClick(option:Option, e:React.MouseEvent<HTMLElement>) {
        if (e.target && (e.target as HTMLElement).closest('a,button')) {
            return;
        }

        this.props.onToggle(option);
    }

    render() {
        const {
            render,
            classPrefix: ns,
            classnames: cx,
            className,
            disabled,
            options,
            placeholder,
            selectedOptions,
            imageClassName,
            submitOnDBClick,
            itemSchema,
            data
        } = this.props;

        let body:JSX.Element | null = null;

        if (options) {
            body = (
                <div className={cx('ListControl-items')}>
                    {options.map((option, key) => (
                        <div
                            key={key}
                            className={cx(`ListControl-item`, {
                                'is-active': ~selectedOptions.indexOf(option),
                                'is-disabled': option.disabled || disabled
                            })}
                            onClick={this.handleClick.bind(this, option)}
                            onDoubleClick={submitOnDBClick ? this.handleDBClick.bind(this, option) : undefined}
                        >
                            {itemSchema ? render(`${key}/body`, itemSchema, {
                                data: createObject(data, option)
                            }) : option.body ? render(`${key}/body`, option.body) : [
                                option.image ? (<div key="image" className={cx('ListControl-itemImage', imageClassName)}><img src={option.image} alt={option.label} /></div>) : null,
                                option.label ? (<div key="label" className={cx('ListControl-itemLabel')}>{option.label}</div>) : null,
                                // {/* {option.tip ? (<div className={`${ns}ListControl-tip`}>{option.tip}</div>) : null} */}
                            ]}
                        </div>
                    ))}
                </div>
            );
        }

        return (
            <div className={cx('ListControl', className)}>
                {body ? body : <span className={cx('ListControl-placeholder')}>{placeholder}</span>}
            </div>
        );
    }
}

@OptionsControl({
    type: 'list',
    sizeMutable: false
})
export class ListControlRenderer extends ListControl {};

