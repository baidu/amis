import * as React from 'react';
import {
    Renderer,
    RendererProps
} from '../factory';
import {RootCloseWrapper} from 'react-overlays';
import Overlay from '../components/Overlay';
import PopOver from '../components/PopOver';
import * as cx from 'classnames';
import { isVisible } from '../utils/helper';
import { filter } from '../utils/tpl';


export interface DropDownButtonProps extends RendererProps {
    block?: boolean;
    size?: 'xs' | 'sm' | 'md' | 'lg';
    align?: 'left' | 'right';
    buttons?: Array<any>;
    caretIcon?: string;
    iconOnly?: boolean;
};

export interface DropDownButtonState {
    isOpened: boolean;
};

export default class DropDownButton extends React.Component<DropDownButtonProps, DropDownButtonState> {

    state:DropDownButtonState = {
        isOpened: false
    };

    static defaultProps = {
        caretIcon: 'fa fa-angle-down'
    };

    target:any;
    constructor(props:DropDownButtonProps) {
        super(props);

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.toogle = this.toogle.bind(this);
        this.domRef = this.domRef.bind(this);
    }

    domRef(ref:any) {
        this.target = ref;
    }

    toogle(e:React.MouseEvent<any>) {
        e.preventDefault();

        this.setState({
            isOpened: !this.state.isOpened
        });
    }

    open() {
        this.setState({
            isOpened: true
        });
    }

    close() {
        this.setState({
            isOpened: false
        });
    }

    renderOuter() {
        const {
            render,
            buttons,
            data,
            popOverContainer,
            classnames: cx,
            classPrefix: ns,
            children,
            align
        } = this.props;

        let body = (
            <RootCloseWrapper
                disabled={!this.state.isOpened}
                onRootClose={this.close}
            >
                <ul
                    className={cx("DropDown-menu")}
                >
                    {children ? children : Array.isArray(buttons) ? buttons.map((button, index) => {
                        if (!isVisible(button, data)) {
                            return null;
                        } else if (button === 'divider' || button.type === 'divider') {
                            return (
                                <li key={index} className={cx("DropDown-divider")} />
                            );
                        }

                        return (
                            <li key={index}>
                                {render(`button/${index}`, {
                                    type: 'button',
                                    ...button,
                                    isMenuItem: true
                                })}
                            </li>
                        );
                    }) : null}
                </ul>
            </RootCloseWrapper>
        );

        if (popOverContainer) {
            return (
                <Overlay
                    container={popOverContainer}
                    placement={align === 'right' ? 'right-bottom-right-top' : 'left-bottom-left-top'}
                    target={() => this.target}
                    show
                >
                    <PopOver 
                        overlay
                        onHide={this.close}
                        classPrefix={ns}
                        className={cx("DropDown-popover")} 
                        style={{minWidth: this.target.offsetWidth}}
                    >
                        {body}
                    </PopOver>
                </Overlay>
            );
        }

        return body;
    }

    render() {
        const {
            block,
            disabled,
            btnDisabled,
            size,
            label,
            level,
            primary,
            className,
            classnames: cx,
            caretIcon,
            align,
            iconOnly,
            data
        } = this.props;

        return (
            <div
                className={cx('DropDown ', {
                    'DropDown--block': block,
                    'DropDown--alignRight': align === 'right',
                    'is-opened': this.state.isOpened
                })}
                ref={this.domRef}
            >
                <button
                    onClick={this.toogle}
                    disabled={disabled || btnDisabled}
                    className={cx('Button', className, (typeof level === 'undefined' ? 'Button--default' : level ? `Button--${level}` : ''), {
                        'Button--block': block,
                        'Button--primary': primary,
                        'Button--iconOnly': iconOnly
                    }, size ? `Button--${size}` : '')}
                >
                    {typeof label === 'string' ? filter(label, data) : label}
                    <i className={cx('DropDown-caret', caretIcon)} />
                </button>

                {this.state.isOpened ? this.renderOuter() : null}
            </div>
        );
    }
}

@Renderer({
    test: /(^|\/)dropdown-button$/,
    name: 'dropdown-button'
})
export class DropDownButtonRenderer extends DropDownButton {

}