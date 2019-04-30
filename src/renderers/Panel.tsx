import * as React from 'react';
import {
    Renderer,
    RendererProps
} from '../factory';
import {
    SchemaNode,
    Action
} from '../types';
import { getScrollParent } from '../utils/helper';
import { findDOMNode } from 'react-dom';

export interface PanelProps extends RendererProps {
    title?: string; // 标题
    header?: SchemaNode;
    body?: SchemaNode;
    footer?: SchemaNode;
    actions?: Action[];
    className?: string;
    headerClassName?: string;
    footerClassName?: string;
    actionsClassName?: string;
    bodyClassName?: string;
    children?: React.ReactNode | ((props: any) => JSX.Element);
    affixFooter?: boolean;
}

export default class Panel extends React.Component<PanelProps> {
    static propsList: Array<string> = [
        "headerClassName",
        "footerClassName",
        "actionsClassName",
        "bodyClassName"
    ];
    static defaultProps = {
        // className: 'Panel--default',
        // headerClassName: 'Panel-heading',
        // footerClassName: 'Panel-footer bg-light lter Wrapper',
        // actionsClassName: 'Panel-footer',
        // bodyClassName: 'Panel-body'
    };

    parentNode?: any;
    affixDom: React.RefObject<HTMLDivElement> = React.createRef();
    footerDom: React.RefObject<HTMLDivElement> = React.createRef();

    componentDidMount() {
        const dom = findDOMNode(this) as HTMLElement;
        let parent:HTMLElement | Window | null = dom ? getScrollParent(dom) : null;
        if (!parent || parent === document.body) {
            parent = window;
        }
        this.parentNode = parent;
        this.affixDetect = this.affixDetect.bind(this);
        this.affixDetect();
        parent.addEventListener('scroll', this.affixDetect);
        window.addEventListener('resize', this.affixDetect);
    }

    componentWillUnmount() {
        const parent = this.parentNode;
        parent && parent.removeEventListener('scroll', this.affixDetect);
        window.removeEventListener('resize', this.affixDetect);
    }

    affixDetect() {
        if (!this.props.affixFooter || !this.affixDom.current || !this.footerDom.current) {
            return;
        }

        const affixDom = this.affixDom.current;
        const footerDom = this.footerDom.current;
        const clip = footerDom.getBoundingClientRect();
        const clientHeight = window.innerHeight;
        const affixed = clip.top > clientHeight;
        
        footerDom.offsetWidth && (affixDom.style.cssText = `width: ${footerDom.offsetWidth}px;`);
        affixed ? affixDom.classList.add('in') : affixDom.classList.remove('in');
    }
    
    renderBody(): JSX.Element | null {
        const {
            type,
            className,
            data,
            header,
            body,
            render,
            bodyClassName,
            headerClassName,
            actionsClassName,
            footerClassName,
            children,
            title,
            actions,
            footer,
            classPrefix: ns,
            ...rest
        } = this.props;

        const subProps = {
            data,
            ...rest
        };

        return children ? (
            <div className={bodyClassName || `${ns}Panel-body`}>{typeof children === 'function' ? children(this.props) : children}</div>
        ) : body ? (
            <div className={bodyClassName || `${ns}Panel-body`}>{render('body', body, subProps)}</div>
        ) : null;
    }

    renderActions() {
        const {
            actions,
            render,
        } = this.props;
        
        if (Array.isArray(actions) && actions.length) {
            return actions.map((action, key) => render('action', action, {
                type: action.type || 'button',
                key: key
            }));
        }

        return null;
    }

    render() {
        const {
            type,
            className,
            data,
            header,
            body,
            render,
            bodyClassName,
            headerClassName,
            actionsClassName,
            footerClassName,
            children,
            title,
            footer,
            affixFooter,
            classPrefix: ns,
            classnames: cx,
            ...rest
        } = this.props;

        const subProps = {
            data,
            ...rest
        };

        const footerDoms = [];
        const actions = this.renderActions();
        actions && footerDoms.push(
            <div key="actions" className={cx(`Panel-btnToolbar`, actionsClassName || `Panel-footer`)}>
                {actions}
            </div>
        );

        footer && footerDoms.push(
            <div key="footer" className={cx(footerClassName || `Panel-footer`)}>
                {render('footer', footer, subProps)}
            </div>
        );

        let footerDom = footerDoms.length ? (
            <div ref={this.footerDom}>
                {footerDoms}
            </div>
        ) : null;
        

        return (
            <div
                className={cx(`Panel`, className || `Panel--default`)}
            >
                {header ? (
                    <div className={cx(headerClassName || `Panel-heading`)}>{render('header', header, subProps)}</div>
                ) : title ? (
                    <div className={cx(headerClassName || `Panel-heading`)}><h3 className={cx(`Panel-title`)}>{render('title', title, subProps)}</h3></div>
                ) : null}

                {this.renderBody()}

                {footerDom}

                {affixFooter && footerDoms.length ? (
                    <div ref={this.affixDom} className={cx("Panel-fixedBottom")}>
                        {footerDoms}
                    </div>
                ) : null}
            </div>
        );
    }
}

@Renderer({
    test: /(^|\/)panel$/,
    name: 'panel'
})
export class PanelRenderer extends Panel {}
