import React from 'react';
import {Renderer, RendererProps} from 'amis-core';
import {Action, Schema, SchemaNode} from 'amis-core';
import find from 'lodash/find';
import {
  isVisible,
  autobind,
  isDisabled,
  isObject,
  createObject,
  getVariable,
  isObjectShallowModified
} from 'amis-core';
import findIndex from 'lodash/findIndex';
import {Tabs as CTabs, Tab} from 'amis-ui';
import {ClassNamesFn} from 'amis-core';
import {
  BaseSchema,
  SchemaClassName,
  SchemaCollection,
  SchemaIcon,
  SchemaExpression
} from '../Schema';
import {ActionSchema} from './Action';
import {filter} from 'amis-core';
import {resolveVariable, tokenize, resolveVariableAndFilter} from 'amis-core';
import {FormHorizontal} from 'amis-core';
import {str2AsyncFunction} from 'amis-core';
import {ScopedContext, IScopedContext} from 'amis-core';
import type {TabsMode} from 'amis-ui/lib/components/Tabs';

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

  /**
   * 配置子表单项默认的展示方式。
   */
  mode?: 'normal' | 'inline' | 'horizontal';
  /**
   * 如果是水平排版，这个属性可以细化水平排版的左右宽度占比。
   */
  horizontal?: FormHorizontal;
  /**
   * 是否可关闭，优先级高于 tabs 的 closable
   */
  closable?: boolean;
  /**
   * 是否禁用
   */
  disabled?: boolean;
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
  tabsMode?: TabsMode;

  /**
   * 内容类名
   */
  contentClassName?: SchemaClassName;

  /**
   * 链接外层类名
   */
  linksClassName?: SchemaClassName;

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

  /**
   * 配置子表单项默认的展示方式。
   */
  subFormMode?: 'normal' | 'inline' | 'horizontal';
  /**
   * 如果是水平排版，这个属性可以细化水平排版的左右宽度占比。
   */
  subFormHorizontal?: FormHorizontal;
  /**
   * 是否支持新增
   */
  addable?: boolean;
  /**
   * 是否支持删除
   */
  closable?: boolean;
  /**
   * 是否支持拖拽
   */
  draggable?: boolean;
  /**
   * 是否显示提示
   */
  showTip?: boolean;
  /**
   * tooltip 提示的类名
   */
  showTipClassName?: string;
  /**
   * 是否可编辑标签名
   */
  editable?: boolean;
  /**
   * 是否导航支持内容溢出滚动。属性废弃，为了兼容暂且保留
   */
  scrollable?: boolean;
  /**
   * 编辑器模式，侧边的位置
   */
  sidePosition?: 'left' | 'right';
  /**
   * 自定义增加按钮文案
   */
  addBtnText?: string;

  /**
   * 默认激活的选项卡，hash值或索引值，支持使用表达式
   */
  activeKey?: SchemaExpression;
}

export interface TabsProps
  extends RendererProps,
    Omit<TabsSchema, 'className' | 'contentClassName' | 'activeKey'> {
  activeKey?: string | number;
  location?: any;
  tabRender?: (tab: TabSchema, props: TabsProps, index: number) => JSX.Element;
}

interface TabSource extends TabSchema {
  ctx?: any;
}

export interface TabsState {
  activeKey: any;
  prevKey: any;
  localTabs: Array<TabSource>;
  isFromSource: boolean;
}

export type TabsRendererEvent = 'change';
export type TabsRendererAction = 'changeActiveKey';

export default class Tabs extends React.Component<TabsProps, TabsState> {
  static defaultProps: Partial<TabsProps> = {
    className: '',
    mode: '',
    mountOnEnter: true,
    unmountOnExit: false
  };

  renderTab?: (tab: TabSchema, props: TabsProps, index: number) => JSX.Element;
  activeKey: any;
  newTabDefaultId: number = 3;

  constructor(props: TabsProps) {
    super(props);

    const location = props.location || window.location;
    const {tabs, source, data} = props;
    let activeKey: any = 0;

    if (typeof props.activeKey !== 'undefined') {
      activeKey = props.activeKey;
    } else if (location && Array.isArray(tabs)) {
      const hash = location.hash.substring(1);
      const tab: TabSource = find(tabs, tab => tab.hash === hash) as TabSource;

      if (tab) {
        activeKey = tab.hash;
      } else if (props.defaultActiveKey) {
        activeKey = tokenize(props.defaultActiveKey, props.data);
      }

      activeKey = activeKey || (tabs[0] && tabs[0].hash) || 0;
    }

    const [localTabs, isFromSource] = this.initTabArray(tabs, source, data);

    this.state = {
      prevKey: undefined,
      activeKey: (this.activeKey = activeKey),
      localTabs,
      isFromSource
    };
  }

  // 初始化 tabs 数组，当从 source 获取数据源时
  @autobind
  initTabArray(
    tabs: Array<TabSource>,
    source?: string,
    data?: any
  ): [Array<TabSource>, boolean] {
    if (!tabs) {
      return [[], false];
    }

    const arr = resolveVariableAndFilter(source, data, '| raw');
    if (!Array.isArray(arr)) {
      return [tabs, false];
    }

    tabs = Array.isArray(tabs) ? tabs : [tabs];

    const sourceTabs: Array<TabSource> = [];
    arr.forEach((value, index) => {
      const ctx = createObject(
        data,
        isObject(value) ? {index, ...value} : {item: value, index}
      );

      sourceTabs.push(...tabs.map((tab: TabSource) => ({...tab, ctx})));
    });

    return [sourceTabs, true];
  }

  componentDidMount() {
    this.autoJumpToNeighbour(this.activeKey);

    let {name, value, onChange, source, tabs, data} = this.props;

    const localTabs = this.state.localTabs;

    // 如果没有配置 name ，说明不需要同步表单值
    if (
      !name ||
      typeof onChange !== 'function' ||
      // 如果关联某个变量数据，则不启用
      source
    ) {
      return;
    }

    value = value ?? getVariable(data, name);

    //  如果有值，切到对应的 tab
    if (value && Array.isArray(localTabs)) {
      const key = this.resolveKeyByValue(value);
      key !== undefined && this.handleSelect(key);
    } else {
      const tab = this.resolveTabByKey(this.activeKey);
      if (tab && value !== ((tab as any).value ?? tab.title)) {
        onChange((tab as any).value ?? tab.title, name);
      }
    }
  }

  componentDidUpdate(preProps: TabsProps, prevState: any) {
    const props = this.props;
    let localTabs = this.state.localTabs;
    const prevActiveKey = tokenize(preProps.defaultActiveKey, preProps.data);
    const activeKey = tokenize(props.defaultActiveKey, props.data);

    // 响应外部修改 tabs
    const isTabsModified = isObjectShallowModified(
      {
        tabs: props.tabs,
        source: resolveVariableAndFilter(props.source, props.data, '| raw')
      },
      {
        tabs: preProps.tabs,
        source: resolveVariableAndFilter(
          preProps.source,
          preProps.data,
          '| raw'
        )
      },
      false
    );

    if (isTabsModified) {
      const [newLocalTabs, isFromSource] = this.initTabArray(
        props.tabs,
        props.source,
        props.data
      );

      this.setState({
        localTabs: newLocalTabs,
        isFromSource
      });
      localTabs = newLocalTabs;
    }

    if (
      props.location &&
      preProps.location &&
      props.location.hash !== preProps.location.hash
    ) {
      const hash = props.location.hash.substring(1);
      if (!hash) {
        return;
      }

      const tab: TabSource = find(
        localTabs,
        tab => tab.hash === hash
      ) as TabSource;
      if (tab && tab.hash && tab.hash !== this.state.activeKey) {
        this.setState({
          activeKey: (this.activeKey = tab.hash),
          prevKey: this.state.activeKey
        });
      }
    } else if (
      Array.isArray(localTabs) &&
      Array.isArray(prevState.localTabs) &&
      JSON.stringify(localTabs.map(item => item.hash)) !==
        JSON.stringify(prevState.localTabs.map((item: TabSource) => item.hash))
    ) {
      let activeKey: any = this.state.activeKey;
      const location = props.location;
      let tab: TabSource | null = null;

      if (location && Array.isArray(localTabs)) {
        const hash = location.hash.substring(1);
        tab = find(localTabs, tab => tab.hash === hash) as TabSource;
      }

      if (tab) {
        activeKey = tab.hash;
      } else if (
        !localTabs ||
        !localTabs.some((item, index) =>
          item.hash ? item.hash === activeKey : index === activeKey
        )
      ) {
        activeKey = (localTabs && localTabs[0] && localTabs[0].hash) || 0;
      }

      this.setState({
        prevKey: undefined,
        activeKey: (this.activeKey = activeKey)
      });
    } else if (prevActiveKey !== activeKey) {
      if (activeKey == null) {
        return;
      }

      let newActivedKey = null;
      const tab = find(localTabs, item => item.hash === activeKey);

      if (tab) {
        newActivedKey = tab.hash;
      } else if (typeof activeKey === 'number' && localTabs[activeKey]) {
        newActivedKey = activeKey;
      }

      if (newActivedKey) {
        this.setState({
          prevKey: prevActiveKey,
          activeKey: (this.activeKey = newActivedKey)
        });
      }
    }

    this.autoJumpToNeighbour(this.activeKey);

    let {name, value, onChange, source, data} = this.props;

    // 如果没有配置 name ，说明不需要同步表单值
    if (
      !name ||
      typeof onChange !== 'function' ||
      // 如果关联某个变量数据，则不启用
      source
    ) {
      return;
    }

    let key: any;
    value = value ?? getVariable(data, name);
    const prevValue =
      preProps.value ?? getVariable(preProps.data, preProps.name);
    if (
      value !== prevValue &&
      (key = this.resolveKeyByValue(value)) !== undefined &&
      key !== this.activeKey
    ) {
      this.handleSelect(key);
    } else if (this.activeKey !== prevState.activeKey) {
      const tab = this.resolveTabByKey(this.activeKey);
      if (tab && value !== ((tab as any).value ?? tab.title)) {
        onChange((tab as any).value ?? tab.title, name);
      }
    }
  }

  resolveTabByKey(key: any) {
    const localTabs = this.state.localTabs;

    if (!Array.isArray(localTabs)) {
      return;
    }

    return find(localTabs, (tab: TabSource, index) =>
      tab.hash ? tab.hash === key : index === key
    );
  }

  resolveKeyByValue(value: any) {
    const localTabs = this.state.localTabs;

    if (!Array.isArray(localTabs)) {
      return;
    }

    const tab: TabSource = find(
      localTabs,
      tab => ((tab as any).value ?? tab.title) === value
    ) as TabSource;

    return tab && tab.hash ? tab.hash : localTabs.indexOf(tab);
  }

  @autobind
  autoJumpToNeighbour(key: any) {
    const {tabs, data} = this.props;
    const localTabs = this.state.localTabs;

    if (!Array.isArray(localTabs)) {
      return;
    }

    // 当前 tab 可能不可见，所以需要自动切到一个可见的 tab, 向前找，找一圈
    const tabIndex = findIndex(localTabs, (tab: TabSource, index) =>
      tab.hash ? tab.hash === key : index === key
    );

    if (
      localTabs[tabIndex] &&
      !isVisible(localTabs[tabIndex], this.props.data)
    ) {
      let len = localTabs.length;
      let i = tabIndex - 1 + len;
      let tries = len - 1;

      while (tries--) {
        const index = i-- % len;
        if (isVisible(localTabs[index], data)) {
          let activeKey = localTabs[index].hash || index;
          this.setState({
            activeKey: (this.activeKey = activeKey)
          });
          break;
        }
      }
    }
  }

  @autobind
  handleAdd() {
    const localTabs = this.state.localTabs.concat();

    localTabs.push({
      title: `tab${this.newTabDefaultId++}`,
      body: 'tab'
    } as TabSource);

    this.setState(
      {
        localTabs: localTabs
      },
      () => {
        this.switchTo(this.state.localTabs.length - 1);
      }
    );
  }

  @autobind
  handleClose(index: number, key: string | number) {
    const originTabs = this.state.localTabs.concat();

    originTabs.splice(index, 1);

    this.setState({
      localTabs: originTabs
    });
  }

  @autobind
  handleEdit(index: number, text: string) {
    const originTabs = this.state.localTabs.concat();
    originTabs[index].title = text;

    this.setState({
      localTabs: originTabs
    });
  }

  @autobind
  async handleDragChange(e: any) {
    const activeTab = this.resolveTabByKey(this.activeKey);
    const originTabs: TabSource[] = this.state.localTabs.concat();

    originTabs.splice(e.newIndex, 0, originTabs.splice(e.oldIndex, 1)[0]);

    this.setState(
      {
        localTabs: originTabs
      },
      () => {
        if (activeTab) {
          const newActiveTabIndex = originTabs.indexOf(activeTab);
          this.switchTo(newActiveTabIndex);
        }
      }
    );
  }

  @autobind
  async handleSelect(key: any) {
    const {dispatchEvent, data, env, onSelect, id} = this.props;
    const {localTabs} = this.state;

    env.tracker?.({
      eventType: 'tabChange',
      eventData: {
        id,
        key
      }
    });
    // 获取激活元素项
    const tab = localTabs?.find(
      (item, index) => key === (item.hash ? item.hash : index)
    );

    const rendererEvent = await dispatchEvent(
      'change',
      createObject(data, {
        value: tab?.hash ? tab?.hash : key + 1
      })
    );
    if (rendererEvent?.prevented) {
      return;
    }

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

    if (typeof onSelect === 'string') {
      const selectFunc = str2AsyncFunction(onSelect, 'key', 'props');
      selectFunc && selectFunc(key, this.props);
    } else if (typeof onSelect === 'function') {
      onSelect(key, this.props);
    }
  }

  /**
   * 动作处理
   */
  doAction(action: Action, args: any) {
    const actionType = action?.actionType as string;
    let activeKey = args?.activeKey as number;
    // 处理非用户自定义key
    if (typeof args?.activeKey !== 'string') {
      activeKey--;
    }
    if (actionType === 'changeActiveKey') {
      this.handleSelect(activeKey);
    }
  }

  @autobind
  switchTo(index: number) {
    const localTabs = this.state.localTabs;

    Array.isArray(localTabs) &&
      localTabs[index] &&
      this.setState({
        activeKey: (this.activeKey = localTabs[index].hash || index)
      });
  }

  @autobind
  currentIndex(): number {
    // const {tabs} = this.props;
    const localTabs = this.state.localTabs;

    return Array.isArray(localTabs)
      ? findIndex(localTabs, (tab: TabSource, index) =>
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
      linksClassName,
      tabRender,
      className,
      render,
      data,
      mode: dMode,
      tabsMode,
      unmountOnExit,
      source,
      formStore,
      formMode,
      formHorizontal,
      subFormMode,
      subFormHorizontal,
      addable,
      closable,
      draggable,
      showTip,
      showTipClassName,
      editable,
      sidePosition,
      translate: __,
      addBtnText
    } = this.props;

    const mode = tabsMode || dMode;
    let mountOnEnter = this.props.mountOnEnter;

    // 如果在form下面，其他tabs默认需要渲染出来
    // 否则在其他 tab 下面的必填项检测不到
    if (formStore) {
      mountOnEnter = false;
    }

    const {localTabs: tabs, isFromSource} = this.state;
    let children: Array<JSX.Element | null> = [];

    // 是否从 source 数据中生成
    if (isFromSource) {
      children = tabs.map((tab: TabSource, index: number) =>
        isVisible(tab, tab.ctx) ? (
          <Tab
            {...(tab as any)}
            title={filter(tab.title, tab.ctx)}
            disabled={isDisabled(tab, tab.ctx)}
            key={index}
            eventKey={index}
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
              `item/${index}`,
              (tab as any)?.type ? (tab as any) : tab.tab || tab.body,
              {
                data: tab.ctx,
                formMode: tab.mode || subFormMode || formMode,
                formHorizontal:
                  tab.horizontal || subFormHorizontal || formHorizontal
              }
            )}
          </Tab>
        ) : null
      );
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
              : render(
                  `tab/${index}`,
                  (tab as any)?.type ? (tab as any) : tab.tab || tab.body,
                  {
                    formMode: tab.mode || subFormMode || formMode,
                    formHorizontal:
                      tab.horizontal || subFormHorizontal || formHorizontal
                  }
                )}
          </Tab>
        ) : null
      );
    }

    return (
      <CTabs
        addBtnText={__(addBtnText || 'add')}
        classPrefix={ns}
        classnames={cx}
        mode={mode}
        closable={closable}
        className={className}
        contentClassName={contentClassName}
        linksClassName={linksClassName}
        onSelect={this.handleSelect}
        activeKey={this.state.activeKey}
        toolbar={this.renderToolbar()}
        addable={addable}
        onAdd={this.handleAdd}
        onClose={this.handleClose}
        draggable={draggable}
        onDragChange={this.handleDragChange}
        showTip={showTip}
        showTipClassName={showTipClassName}
        editable={editable}
        onEdit={this.handleEdit}
        sidePosition={sidePosition}
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
  type: 'tabs'
})
export class TabsRenderer extends Tabs {
  static contextType = ScopedContext;

  constructor(props: TabsProps, context: IScopedContext) {
    super(props);

    const scoped = context;
    scoped.registerComponent(this);
  }

  componentWillUnmount() {
    super.componentWillUnmount?.();
    const scoped = this.context as IScopedContext;
    scoped.unRegisterComponent(this);
  }
}
