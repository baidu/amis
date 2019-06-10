import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {ServiceStore, IServiceStore} from '../store/service';
import {filter} from '../utils/tpl';
import cx from 'classnames';

export interface DividerProps extends RendererProps {}

export default class Divider extends React.Component<DividerProps, object> {
    static defaultProps: Partial<DividerProps> = {
        className: '',
    };

    render() {
        const cx = this.props.classnames;
        const className = this.props.className;
        return <div className={cx('Divider', className)} />;
    }
}

@Renderer({
    test: /(^|\/)(?:divider|hr)$/,
    name: 'divider',
})
export class DividerRenderer extends Divider {}
