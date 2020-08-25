import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {Action, Schema, SchemaNode} from '../types';
import find from 'lodash/find';
import {isVisible, autobind, isDisabled} from '../utils/helper';
import findIndex from 'lodash/findIndex';
import {Tabs as CTabs, Tab} from '../components/Tabs';
import {ClassNamesFn} from '../theme';

export interface TabProps extends Schema {
  title?: string; // 标题
  icon?: string;
  hash?: string; // 通过 hash 来控制当前选择
  tab?: Schema;
  className?: string;
  classnames: ClassNamesFn;
  eventKey?: string | number;
  activeKey?: string | number;
  reload?: boolean;
  mountOnEnter?: boolean;
  unmountOnExit?: boolean;
  disabled?: string;
  disabledOn?: string;
}

export interface TabsProps extends RendererProps {
  mode?: '' | 'line' | 'card' | 'radio' | 'vertical';
  tabsMode?: '' | 'line' | 'card' | 'radio' | 'vertical';
  activeKey?: string | number;
  contentClassName?: string;
  location?: any;
  mountOnEnter?: boolean;
  unmountOnExit?: boolean;
  tabs?: Array<TabProps>;
  tabRender?: (tab: TabProps, props: TabsProps, index: number) => JSX.Element;
  toolbar?: SchemaNode;
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

  renderTab?: (tab: TabProps, props: TabsProps, index: number) => JSX.Element;

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
      activeKey: activeKey
    };
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

      const tab: TabProps = find(
        nextProps.tabs,
        tab => tab.hash === hash
      ) as TabProps;
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
        activeKey = tab.hash;
      } else if (
        !nextProps.tabs ||
        !nextProps.tabs.some((item, index) =>
          item.hash ? item.hash === activeKey : index === activeKey
        )
      ) {
        activeKey =
          (nextProps.tabs && nextProps.tabs[0] && nextProps.tabs[0].hash) || 0;
      }

      this.setState({
        prevKey: undefined,
        activeKey: activeKey
      });
    }
  }

  componentDidUpdate() {
    this.autoJumpToNeighbour();
  }

  @autobind
  autoJumpToNeighbour() {
    const {tabs, data} = this.props;

    if (!Array.isArray(tabs)) {
      return;
    }

    // 当前 tab 可能不可见，所以需要自动切到一个可见的 tab, 向前找，找一圈
    const tabIndex = findIndex(tabs, (tab: TabProps, index) =>
      tab.hash
        ? tab.hash === this.state.activeKey
        : index === this.state.activeKey
    );

    if (tabs[tabIndex] && !isVisible(tabs[tabIndex], this.props.data)) {
      let len = tabs.length;
      let i = tabIndex - 1 + len;
      let tries = len - 1;

      while (tries--) {
        const index = i-- % len;
        if (isVisible(tabs[index], data)) {
          let activeKey = tabs[index].hash || index;
          this.setState({
            activeKey
          });
          break;
        }
      }
    }
  }

  @autobind
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
      prevKey: this.state.activeKey
    });
  }

  @autobind
  switchTo(index: number) {
    const {tabs} = this.props;

    Array.isArray(tabs) &&
      tabs[index] &&
      this.setState({
        activeKey: tabs[index].hash || index
      });
  }

  @autobind
  currentIndex(): number {
    const {tabs} = this.props;

    return Array.isArray(tabs)
      ? findIndex(tabs, (tab: TabProps, index) =>
          tab.hash
            ? tab.hash === this.state.activeKey
            : index === this.state.activeKey
        )
      : -1;
  }

  renderToolbar() {
    const {
      toolbar,
      render,
      classnames: cx,
      toolbarClassName
    } = this.props;

    return toolbar ? (
      <div className={cx(`Tabs-toolbar`, toolbarClassName)}>
        {render('toolbar', toolbar)}
      </div>
    ) : null;
  }

  renderTabs() {
    const {
      classnames: cx,
      classPrefix: ns,
      contentClassName,
      tabs,
      tabRender,
      className,
      render,
      data,
      mode: dMode,
      tabsMode,
      mountOnEnter,
      unmountOnExit
    } = this.props;

    if (!Array.isArray(tabs)) {
      return null;
    }

    const mode = tabsMode || dMode;

    return (
      <CTabs
        classPrefix={ns}
        classnames={cx}
        mode={mode}
        className={className}
        contentClassName={contentClassName}
        onSelect={this.handleSelect}
        activeKey={this.state.activeKey}
        toolbar={this.renderToolbar()}
      >
        {tabs.map((tab, index) =>
          isVisible(tab, data) ? (
            <Tab
              {...tab}
              disabled={isDisabled(tab, data)}
              key={index}
              eventKey={tab.hash || index}
              mountOnEnter={mountOnEnter}
              unmountOnExit={
                typeof tab.reload === 'boolean'
                  ? tab.reload
                  : typeof tab.unmountOnExit === 'boolean'
                  ? tab.unmountOnExit
                  : unmountOnExit
              }
            >
              {this.renderTab
                ? this.renderTab(tab, this.props, index)
                : tabRender
                ? tabRender(tab, this.props, index)
                : render(`tab/${index}`, tab.tab || tab.body || '')}
            </Tab>
          ) : null
        )}
      </CTabs>
    );
  }

  render() {
    return this.renderTabs();
  }
}

@Renderer({
  test: /(^|\/)tabs$/,
  name: 'tabs'
})
export class TabsRenderer extends Tabs {}
