import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {Action, Schema, SchemaNode} from '../types';
import find from 'lodash/find';
import {
  isVisible,
  autobind,
  isDisabled,
  isObject,
  createObject
} from '../utils/helper';
import findIndex from 'lodash/findIndex';
import {Tabs as CTabs, Tab} from '../components/Tabs';
import {ClassNamesFn} from '../theme';
import {
  BaseSchema,
  SchemaClassName,
  SchemaCollection,
  SchemaIcon
} from '../Schema';
import {ActionSchema} from './Action';
import {filter} from '../utils/tpl';
import {resolveVariable} from '../utils/tpl-builtin';

export interface TabSchema extends Omit<BaseSchema, 'type'> {
  /**
   * Tab 标题
   */
  title?: string;

  /**
   * 内容
   * @deprecated 用 body 属性
   */
  tab?: SchemaCollection;

  /**
   * 内容
   */
  body?: SchemaCollection;

  /**
   * 徽标
   */
  badge?: number;

  /**
   * 设置以后将跟url的hash对应
   */
  hash?: string;

  /**
   * 按钮图标
   */
  icon?: SchemaIcon;

  iconPosition?: 'left' | 'right';

  /**
   * 设置以后内容每次都会重新渲染
   */
  reload?: boolean;

  /**
   * 点开时才加载卡片内容
   */
  mountOnEnter?: boolean;

  /**
   * 卡片隐藏就销毁卡片节点。
   */
  unmountOnExit?: boolean;
}

/**
 * 选项卡控件。
 * 文档：https://baidu.gitee.io/amis/docs/components/tabs
 */
export interface TabsSchema extends BaseSchema {
  type: 'tabs';

  /**
   * 选项卡成员。当配置了 source 时，选项卡成员，将会根据目标数据进行重复。
   */
  tabs: Array<TabSchema>;

  /**
   * 关联已有数据，选项卡直接根据目标数据重复。
   */
  source?: string;

  /**
   * 类名
   */
  tabsClassName?: SchemaClassName;

  /**
   * 展示形式
   */
  tabsMode?: '' | 'line' | 'card' | 'radio' | 'vertical' | 'tiled';

  /**
   * 内容类名
   */
  contentClassName?: SchemaClassName;

  /**
   * 卡片是否只有在点开的时候加载？
   */
  mountOnEnter?: boolean;

  /**
   * 卡片隐藏的时候是否销毁卡片内容
   */
  unmountOnExit?: boolean;

  /**
   * 可以在右侧配置点其他功能按钮。
   */
  toolbar?: ActionSchema;
}

export interface TabsProps
  extends RendererProps,
    Omit<TabsSchema, 'className' | 'contentClassName'> {
  activeKey?: string | number;
  location?: any;
  tabRender?: (tab: TabSchema, props: TabsProps, index: number) => JSX.Element;
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

  renderTab?: (tab: TabSchema, props: TabsProps, index: number) => JSX.Element;
  activeKey: any;

  constructor(props: TabsProps) {
    super(props);

    const location = props.location || window.location;
    const tabs = props.tabs;
    let activeKey: any = 0;

    if (typeof props.activeKey !== 'undefined') {
      activeKey = props.activeKey;
    } else if (location && Array.isArray(tabs)) {
      const hash = location.hash.substring(1);
      const tab: TabSchema = find(tabs, tab => tab.hash === hash) as TabSchema;
      activeKey = tab && tab.hash ? tab.hash : (tabs[0] && tabs[0].hash) || 0;
    }

    this.state = {
      prevKey: undefined,
      activeKey: (this.activeKey = activeKey)
    };
  }

  componentDidMount() {
    this.autoJumpToNeighbour(this.activeKey);
  }

  componentDidUpdate(preProps: TabsProps, prevState: any) {
    const props = this.props;

    if (props.location && props.location.hash !== preProps.location.hash) {
      const hash = props.location.hash.substring(1);
      if (!hash) {
        return;
      }

      const tab: TabSchema = find(
        props.tabs,
        tab => tab.hash === hash
      ) as TabSchema;
      if (tab && tab.hash && tab.hash !== this.state.activeKey) {
        this.setState({
          activeKey: (this.activeKey = tab.hash),
          prevKey: this.state.activeKey
        });
      }
    } else if (preProps.tabs !== props.tabs) {
      let activeKey: any = this.state.activeKey;
      const location = props.location;
      let tab: TabSchema | null = null;

      if (location && Array.isArray(props.tabs)) {
        const hash = location.hash.substring(1);
        tab = find(props.tabs, tab => tab.hash === hash) as TabSchema;
      }

      if (tab) {
        activeKey = tab.hash;
      } else if (
        !props.tabs ||
        !props.tabs.some((item, index) =>
          item.hash ? item.hash === activeKey : index === activeKey
        )
      ) {
        activeKey = (props.tabs && props.tabs[0] && props.tabs[0].hash) || 0;
      }

      this.setState({
        prevKey: undefined,
        activeKey: (this.activeKey = activeKey)
      });
    }

    this.autoJumpToNeighbour(this.activeKey);
  }

  @autobind
  autoJumpToNeighbour(key: any) {
    const {tabs, data} = this.props;

    if (!Array.isArray(tabs)) {
      return;
    }

    // 当前 tab 可能不可见，所以需要自动切到一个可见的 tab, 向前找，找一圈
    const tabIndex = findIndex(tabs, (tab: TabSchema, index) =>
      tab.hash ? tab.hash === key : index === key
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
            activeKey: (this.activeKey = activeKey)
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
      activeKey: (this.activeKey = key),
      prevKey: this.state.activeKey
    });
  }

  @autobind
  switchTo(index: number) {
    const {tabs} = this.props;

    Array.isArray(tabs) &&
      tabs[index] &&
      this.setState({
        activeKey: (this.activeKey = tabs[index].hash || index)
      });
  }

  @autobind
  currentIndex(): number {
    const {tabs} = this.props;

    return Array.isArray(tabs)
      ? findIndex(tabs, (tab: TabSchema, index) =>
          tab.hash
            ? tab.hash === this.state.activeKey
            : index === this.state.activeKey
        )
      : -1;
  }

  renderToolbar() {
    const {toolbar, render, classnames: cx, toolbarClassName} = this.props;

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
      tabRender,
      className,
      render,
      data,
      mode: dMode,
      tabsMode,
      mountOnEnter,
      unmountOnExit,
      source
    } = this.props;

    const mode = tabsMode || dMode;
    const arr = resolveVariable(source, data);

    let tabs = this.props.tabs;
    if (!tabs) {
      return null;
    }

    tabs = Array.isArray(tabs) ? tabs : [tabs];
    let children: Array<JSX.Element | null> = [];

    if (Array.isArray(arr)) {
      arr.forEach((value, index) => {
        const ctx = createObject(
          data,
          isObject(value) ? {index, ...value} : {item: value, index}
        );

        children.push(
          ...tabs.map((tab, tabIndex) =>
            isVisible(tab, ctx) ? (
              <Tab
                {...(tab as any)}
                title={filter(tab.title, ctx)}
                disabled={isDisabled(tab, ctx)}
                key={`${index * 1000 + tabIndex}`}
                eventKey={index * 1000 + tabIndex}
                mountOnEnter={mountOnEnter}
                unmountOnExit={
                  typeof tab.reload === 'boolean'
                    ? tab.reload
                    : typeof tab.unmountOnExit === 'boolean'
                    ? tab.unmountOnExit
                    : unmountOnExit
                }
              >
                {render(
                  `item/${index}/${tabIndex}`,
                  tab.tab || tab.body || '',
                  {
                    data: ctx
                  }
                )}
              </Tab>
            ) : null
          )
        );
      });
    } else {
      children = tabs.map((tab, index) =>
        isVisible(tab, data) ? (
          <Tab
            {...(tab as any)}
            title={filter(tab.title, data)}
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
      );
    }

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
        {children}
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
