import React from 'react';
import {Renderer, RendererProps} from '../factory';
import { Schema } from '../types';
import { evalExpression } from '../utils/tpl';
import Transition, {ENTERED, ENTERING} from 'react-transition-group/Transition';
import find = require('lodash/find');
import { isVisible } from '../utils/helper';
import findIndex = require('lodash/findIndex');

const transitionStyles: {
    [propName: string]: string;
} = {
    [ENTERING]: 'in',
    [ENTERED]: 'in'
};

export type TabProps = Schema & {
    title?: string; // 标题
    icon?: string;
    hash?: string; // 通过 hash 来控制当前选择
    tabsMode?: '' | 'line' | 'card' | 'radio';
    tab: Schema;
    className: string;
    contentClassName: string;
    location?: any;
};

export interface TabsProps extends RendererProps {
    tabs?: Array<TabProps>;
    tabRender?: (tab: TabProps, props?: TabsProps) => React.ReactNode;
}

export interface TabsState {
    activeKey: any;
    prevKey: any;
}

export default class Tabs extends React.Component<TabsProps, TabsState> {
    wrapperRef: React.RefObject<HTMLDivElement> = React.createRef();

    static defaultProps: Partial<TabsProps> = {
        className: '',
        mode: '',
        mountOnEnter: true,
        unmountOnExit: false,
    };

    constructor(props: TabsProps) {
        super(props);

        const location = props.location || window.location;
        const tabs = props.tabs;
        let activeKey: any = 0;

        if (typeof props.activeKey !== 'undefined') {
            activeKey = props.activeKey;
        } else if (location && Array.isArray(tabs)) {
            const hash = location.hash.substring(1);
            const tab: TabProps = find(tabs, tab => tab.hash === hash) as TabProps;
            activeKey = tab && tab.hash ? tab.hash : (tabs[0] && tabs[0].hash) || 0;
        }

        this.state = {
            prevKey: undefined,
            activeKey: activeKey,
        };

        this.handleSelect = this.handleSelect.bind(this);
        this.currentIndex = this.currentIndex.bind(this);
        this.switchTo = this.switchTo.bind(this);
    }

    componentDidMount() {
        this.autoJumpToNeighbour();
    }

    componentWillReceiveProps(nextProps: TabsProps) {
        const props = this.props;

        if (nextProps.location && nextProps.location.hash !== props.location.hash) {
            const hash = nextProps.location.hash.substring(1);
            if (!hash) {
                return;
            }

            const tab: TabProps = find(nextProps.tabs, tab => tab.hash === hash) as TabProps;
            if (tab && tab.hash && tab.hash !== this.state.activeKey) {
                this.setState({
                    activeKey: tab.hash,
                    prevKey: this.state.activeKey,
                });
            }
        } else if (props.tabs !== nextProps.tabs) {
            let activeKey: any = this.state.activeKey;
            const location = nextProps.location;
            let tab: TabProps | null = null;

            if (location && Array.isArray(nextProps.tabs)) {
                const hash = location.hash.substring(1);
                tab = find(nextProps.tabs, tab => tab.hash === hash) as TabProps;
            }

            if (tab) {
                activeKey = tab.hash;
            } else if (
                !nextProps.tabs ||
                !nextProps.tabs.some((item, index) => (item.hash ? item.hash === activeKey : index === activeKey))
            ) {
                activeKey = (nextProps.tabs && nextProps.tabs[0] && nextProps.tabs[0].hash) || 0;
            }

            this.setState({
                prevKey: undefined,
                activeKey: activeKey,
            });
        }
    }

    componentDidUpdate() {
        this.autoJumpToNeighbour();
    }

    autoJumpToNeighbour() {
        const {
            tabs,
            data
        } = this.props;

        if (!Array.isArray(tabs)) {
            return;
        }

        // 当前 tab 可能不可见，所以需要自动切到一个可见的 tab, 向前找，找一圈
        const tabIndex = findIndex(tabs, (tab: TabProps, index) =>
            tab.hash ? tab.hash === this.state.activeKey : index === this.state.activeKey
        );

        if (tabs[tabIndex] && !isVisible(tabs[tabIndex], this.props.data)) {
            let len = tabs.length;
            let i = (tabIndex - 1) + len;
            let tries = len - 1;

            while (tries--) {
                const index = (i--) % len;
                if (isVisible(tabs[index], data)) {
                    let activeKey = tabs[index].hash || index;
                    this.setState({
                        activeKey
                    })
                    break;
                }
            }
        }
    }

    handleSelect(key: any) {
        const {env} = this.props;

        // 是 hash，需要更新到地址栏
        if (typeof key === 'string' && env) {
            env.updateLocation(`#${key}`);
        } else if (typeof this.state.activeKey === 'string' && env) {
            env.updateLocation(`#`);
        }

        this.setState({
            activeKey: key,
            prevKey: this.state.activeKey,
        });
    }

    switchTo(index: number) {
        const {tabs} = this.props;

        Array.isArray(tabs) &&
            tabs[index] &&
            this.setState({
                activeKey: tabs[index].hash || index,
            });
    }

    currentIndex(): number {
        const {tabs} = this.props;

        return Array.isArray(tabs)
            ? findIndex(tabs, (tab: TabProps, index) =>
                  tab.hash ? tab.hash === this.state.activeKey : index === this.state.activeKey
              )
            : -1;
    }

    render() {
        const {
            classnames: cx,
            contentClassName,
            tabs,
            tabRender,
            className,
            mountOnEnter,
            unmountOnExit,
            render,
            data,
            mode: dMode,
            tabsMode,
        } = this.props;

        if (!Array.isArray(tabs)) {
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
                <ul className={cx('Tabs-links')} role="tablist">
                    {tabs.map((tab, index) => isVisible(tab, data) ? (
                        <li
                            className={cx(
                                'Tabs-link',
                                this.state.activeKey === tab.hash || this.state.activeKey === index ? 'active' : '',
                                tab.disabled || (tab.disabledOn && evalExpression(tab.disabledOn, data)) ? 'disabled' : ''
                            )}
                            key={index}
                            onClick={() => tab.disabled || (tab.disabledOn && evalExpression(tab.disabledOn, data)) ? '' : this.handleSelect(tab.hash || index)}
                        >
                            {tab.icon ? (
                                <div>
                                    <i className={tab.icon} /><a>{tab.title}</a>
                                </div>
                            ) : (
                                <a>{tab.title}</a>
                            )}
                        </li>
                    ) : null)}
                </ul>

                <div
                    ref={this.wrapperRef}
                    className={cx('Tabs-content', contentClassName, 'tab-content')}
                >
                    {tabs.map((tab, index) => isVisible(tab, data) ? (
                        <Transition
                            in={this.state.activeKey === tab.hash || this.state.activeKey === index ? true : false}
                            mountOnEnter={mountOnEnter}
                            unmountOnExit={unmountOnExit}
                            timeout={500}
                            key={index}
                        >
                            {(status:string) => {
                                if (status === ENTERING) {
                                    this.wrapperRef.current && this.wrapperRef.current.childNodes.forEach((item:HTMLElement) => item.offsetHeight);
                                }
                                return (
                                    <div className={cx(
                                        transitionStyles[status],
                                        this.state.activeKey === tab.hash || this.state.activeKey === index ? 'active' : '',
                                            'tab-pane',
                                            'fade'
                                        )}>
                                        {tabRender
                                                ? tabRender(tab, this.props)
                                                : render(`tab/${index}`, tab.tab || tab.body || '')}
                                    </div>
                                )
                            }}
                        </Transition>
                        ) : null)
                    }
                </div>
            </div>
        );
    }
}

@Renderer({
    test: /(^|\/)tabs$/,
    name: 'tabs',
})
export class TabsRenderer extends Tabs {}
