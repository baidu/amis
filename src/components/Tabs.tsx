/**
 * @file Tabs
 * @description 选项卡
 * @author fex
 */

import React from 'react';
import { Schema } from '../types';
import Transition, { ENTERED, ENTERING } from 'react-transition-group/Transition';
import { ClassNamesFn, themeable } from '../theme';
import { RendererProps } from '../factory';

const transitionStyles: {
    [propName: string]: string;
} = {
    [ENTERING]: 'in',
    [ENTERED]: 'in'
};

export interface TabProps extends Schema {
    title?: string; // 标题
    icon?: string;
    hash?: string; // 通过 hash 来控制当前选择
    tabsMode?: '' | 'line' | 'card' | 'radio';
    tab?: Schema;
    className?: string;
    location?: any;
    classnames: ClassNamesFn;
    activeKey?: string|number;
    reload?: boolean;
    mountOnEnter?: boolean;
    unmountOnExit?: boolean;
    index: string|number;
};

export interface TabsProps extends RendererProps {
    tabs?: Array<TabProps>;
    tabRender?: (tab: TabProps, props?: TabsProps) => JSX.Element;
}

export class Tabs extends React.Component<TabsProps> {
    static defaultProps: Pick<TabsProps, 'mode'> = {
        mode: ''
    };

    handleSelect(key: any) {
        const { handleSelect } = this.props;
        handleSelect && handleSelect(key);
    }

    renderNav(child: any, index: number) {
        if (!child) {
            return;
        }

        const { classnames: cx, activeKey } = this.props;
        const { hash, disabled, icon, title, visible } = child.props;

        return visible !== false ? (
            <li
                className={cx(
                    'Tabs-link',
                    activeKey === hash || activeKey === index ? 'active' : '',
                    disabled  ? 'disabled' : ''
                )}
                key={index}
                onClick={() => disabled ? '' : this.handleSelect(hash || index)}
            >
                {icon ? (
                    <div>
                        <i className={icon} /><a>{title}</a>
                    </div>
                ) : (
                    <a>{title}</a>
                )}
            </li>
        ) : null;
    }

    renderTab(child:any, index:number) {
        if (!child) {
            return;
        }

        const { activeKey, classnames } = this.props;

        return React.cloneElement(child, {
            ...child.props,
            index: index,
            key: index,
            classnames: classnames,
            activeKey: activeKey
        });
    }

    render() {
        const {
            classnames: cx,
            contentClassName,
            className,
            mode: dMode,
            tabsMode,
            children
        } = this.props;

        if (!Array.isArray(children)) {
            return null;
        }

        const mode = tabsMode || dMode;

        return (
            <div
                className={cx(
                    `Tabs`,
                    {
                        [`Tabs--${mode}`]: mode,
                    },
                    className
                )}
            >
                <ul className={cx('Tabs-links')}>
                    {children.map((tab, index) => (
                        this.renderNav(tab, index)
                    ))}
                </ul>

                <div
                    className={cx('Tabs-content', contentClassName, 'tab-content')}
                >
                    {children.map((child, index) => {
                        return this.renderTab(child, index);
                    })}
                </div>
            </div>
        );
    }
}

export class Tab extends React.PureComponent<TabProps> {
    contentDom: any;
    contentRef = (ref: any) => (this.contentDom = ref);

    render() {
        const {
            classnames: cx,
            mountOnEnter,
            reload,
            unmountOnExit,
            index,
            hash,
            activeKey,
            children,
            className
        } = this.props;

        return (
            <Transition
                in={activeKey === hash || activeKey == index}
                mountOnEnter={mountOnEnter}
                unmountOnExit={typeof reload === 'boolean' ? reload : unmountOnExit}
                timeout={500}
            >
                {(status:string) => {
                    if (status === ENTERING) {
                        this.contentDom.offsetWidth;
                    }
                    return (
                        <div
                            ref={this.contentRef}
                            className={cx && cx(
                                transitionStyles[status],
                                activeKey === hash || activeKey == index ? 'active' : '',
                                'tab-pane',
                                'fade',
                                className
                            )}
                        >
                            {children}
                        </div>
                    )
                }}
            </Transition>
        )
    }
}

export default themeable(Tabs);