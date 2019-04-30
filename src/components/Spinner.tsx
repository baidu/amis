import * as React from 'react';
import {
    Renderer,
    RendererProps
} from '../factory';
import { ClassNamesFn, themeable } from '../theme';
import { classPrefix, classnames } from '../themes/default';

interface SpinnerProps extends RendererProps {
    overlay: boolean;
    spinnerClassName: string;
    mode: string;
    size: string;
    classPrefix: string;
    classnames: ClassNamesFn;
};

export class Spinner extends React.Component<SpinnerProps, object> {
    static defaultProps= {
        overlay: false,
        spinnerClassName: '',
        mode: '',
        size: ''
    };

    render() {
        const {
            mode,
            overlay,
            spinnerClassName,
            classPrefix: ns,
            classnames: cx,
            size
        } = this.props;

        const spinner = (
            <div className={cx(`${ns}Spinner`, spinnerClassName, {
                [`Spinner--${mode}`]: !!mode,
                [`Spinner--${size}`]: !!size
            })}>
            </div>
        );

        if (overlay) {
            return (
                <div className={cx(`Spinner-overlay`)}>
                    {spinner}
                </div>
            );
        }

        return spinner;
    }
}

export default themeable(Spinner);