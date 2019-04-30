import * as React from 'react';
import {
    Renderer,
    RendererProps
} from '../factory';
import * as cx from 'classnames';
import {
    Collapse as BasicCollapse
} from 'react-bootstrap';

export interface CollapseProps extends RendererProps {
    title?: string; // 标题
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'base';
    wrapperComponent?: any;
    headingComponent?: any;
    collapsed?: boolean;
    bodyClassName?: string;
    headingClassName?: string;
    // 内容口子
    children?: JSX.Element | ((props?:any) => JSX.Element);
}

export interface CollapseState {
    collapsed: boolean;
}

export default class Collapse extends React.Component<CollapseProps, CollapseState> {
    static propsList: Array<string> = [
        "wrapperComponent",
        "headingComponent",
        "bodyClassName",
        "collapsed",
        "headingClassName"
    ];

    static defaultProps:Partial<CollapseProps>= {
        wrapperComponent: 'div',
        headingComponent: 'h4',
        className: '',
        headingClassName: '',
        bodyClassName: '',
        collapsable: true
    };

    state = {
        collapsed: false
    };

    constructor(props: CollapseProps) {
        super(props);

        this.toggleCollapsed = this.toggleCollapsed.bind(this);
        this.state.collapsed = !!props.collapsed;
    }

    componentWillReceiveProps(nextProps:CollapseProps) {
        const props = this.props;

        if (props.collapsed !== nextProps.collapsed) {
            this.setState({
                collapsed: !!nextProps.collapsed
            });
        }
    }

    toggleCollapsed() {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    render() {
        const {
            classPrefix: ns,
            classnames: cx,
            size,
            wrapperComponent: WrapperComponent,
            headingComponent: HeadingComponent,
            className,
            title,
            headingClassName,
            children,
            body,
            bodyClassName,
            render,
            collapsable
        } = this.props;

        // todo 换掉 bootstrap 的 collapse

        return (
            <WrapperComponent className={cx(`Collapse`, {
                'is-collapsed': this.state.collapsed,
                [`Collapse--${size}`]: size,
                'Collapse--collapsable': collapsable
            }, className)}>
                {title ? (
                    <HeadingComponent className={cx(`Collapse-header`, headingClassName)}>
                        {render('heading', title)}
                        {collapsable && (
                            <span
                                onClick={this.toggleCollapsed}
                                className={cx('Collapse-arrow')}
                            ></span>
                        )}
                    </HeadingComponent>
                ) : null}

                <BasicCollapse in={collapsable ? !this.state.collapsed : true}>
                    <div className={cx(`Collapse-body`, bodyClassName)}>
                        {children ? (
                            typeof children === 'function' ? children(this.props) : children
                        ) : body ? (
                            render('body', body)
                        ) : null}
                    </div>
                </BasicCollapse>
            </WrapperComponent>
        );
    }
}

@Renderer({
    test: /(^|\/)collapse$/,
    name: 'collapse'
})
export class CollapseRenderer extends Collapse {};
