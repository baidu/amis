import * as React from 'react';
import {
    Renderer,
    RendererProps
} from '../factory';
import { ServiceStore, IServiceStore } from '../store/service';
import {
    Api,
    SchemaNode,
    Schema,
    Action
} from '../types';
import {
    filter,
    evalExpression
} from '../utils/tpl';
import {
    Tabs as BsTabs,
    TabContainer,
    TabContent,
    TabPane,
    NavItem,
    Nav,
    Tab
} from 'react-bootstrap';
import cx = require('classnames');
import find = require('lodash/find');
import { isVisible } from '../utils/helper';
import findIndex = require('lodash/findIndex');

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

    static defaultProps: Partial<TabsProps> = {
        className: '',
        mode: '',
        mountOnEnter: true,
        unmountOnExit: false
    };

    id = Date.now() + '';
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
            activeKey = tab && tab.hash ? tab.hash : (tabs[0] && tabs[0].hash || 0);
        }

        this.state = {
            prevKey: undefined,
            activeKey: activeKey
        }

        this.handleSelect = this.handleSelect.bind(this);
        this.currentIndex = this.currentIndex.bind(this);
        this.switchTo = this.switchTo.bind(this);
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
                    prevKey: this.state.activeKey
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
                activeKey = tab.hash
            } else if (!nextProps.tabs || !nextProps.tabs.some((item, index) => item.hash ? item.hash === activeKey : index === activeKey)) {
                activeKey = nextProps.tabs && nextProps.tabs[0] && nextProps.tabs[0].hash || 0;
            }

            this.setState({
                prevKey: undefined,
                activeKey: activeKey
            });
        }
    }

    handleSelect(key: any) {
        const {
            env
        } = this.props;

        // 是 hash，需要更新到地址栏
        if (typeof key === 'string' && env) {
            env.updateLocation(`#${key}`)
        } else if (typeof this.state.prevKey === 'string' && env) {
            env.updateLocation(`#`);
        }

        this.setState({
            activeKey: key,
            prevKey: this.state.activeKey
        });
    }

    switchTo(index: number) {
        const {
            tabs
        } = this.props;

        Array.isArray(tabs) && tabs[index] && this.setState({
            activeKey: tabs[index].hash || index
        })
    }

    currentIndex(): number {
        const {
            tabs
        } = this.props;

        return Array.isArray(tabs)
            ? findIndex(tabs, (tab: TabProps, index) => tab.hash ? tab.hash === this.state.activeKey : index === this.state.activeKey)
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
            tabsMode
        } = this.props;

        if (!Array.isArray(tabs)) {
            return null;
        }

        const mode = tabsMode || dMode;
        const visibleTabs = tabs.filter(tab => isVisible(tab, data));

        return (
            <TabContainer
                id={this.id}
                className={cx(`Tabs`, {
                    [`Tabs--${mode}`]: mode
                }, className)}
                activeKey={this.state.activeKey}
                onSelect={this.handleSelect}
            >
                <div>
                    <Nav className={cx('Tabs-links')} role="tablist">
                        {visibleTabs.map((tab, index) => (
                            <NavItem
                                className={cx('Tabs-link')}
                                key={index}
                                eventKey={tab.hash || index}
                                disabled={tab.disabled || tab.disabledOn && evalExpression(tab.disabledOn, data)}
                            >
                                {tab.icon ? (<div><i className={tab.icon} /> {tab.title}</div>) : tab.title}
                            </NavItem>
                        ))}
                    </Nav>

                    <TabContent
                        className={cx('Tabs-content', contentClassName)}
                        mountOnEnter={mountOnEnter}
                        unmountOnExit={unmountOnExit}
                    >
                        {visibleTabs.map((tab, index) => (
                            <TabPane
                                key={index}
                                eventKey={tab.hash || index}
                                mountOnEnter={mountOnEnter}
                                unmountOnExit={typeof tab.reload === 'boolean' ? tab.reload : tab.unmountOnExit}
                            >
                                {tabRender ? tabRender(tab, this.props) : render(`tab/${index}`, tab.tab || tab.body || '')}
                            </TabPane>
                        ))}
                    </TabContent>
                </div>
            </TabContainer>
        );
    }
}

@Renderer({
    test: /(^|\/)tabs$/,
    name: 'tabs'
})
export class TabsRenderer extends Tabs { }
