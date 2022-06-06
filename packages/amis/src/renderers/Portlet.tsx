import React from 'react';
import mapValues from 'lodash/mapValues';

import {Tabs as CTabs, Tab} from 'amis-ui';
import {Renderer, RendererProps} from 'amis-core';
import {resolveVariable} from 'amis-core';
import {str2AsyncFunction} from 'amis-core';
import {
  isVisible,
  autobind,
  isDisabled,
  isObject,
  createObject
} from 'amis-core';

import {filter} from 'amis-core';
import {
  SchemaTpl,
  SchemaClassName,
  BaseSchema,
  SchemaCollection,
  SchemaIcon
} from '../Schema';

import {ActionSchema} from './Action';

/**
 * 栏目容器渲染器。
 * 文档：https://baidu.gitee.io/amis/docs/components/portlet
 */
export interface PortletTabSchema extends Omit<BaseSchema, 'type'> {
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
   * 可以在右侧配置点其他功能按钮，随着tab切换而切换
   */
  toolbar?: Array<ActionSchema>;

  /**
   * 内容
   */
  body?: SchemaCollection;

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

export interface PortletSchema extends Omit<BaseSchema, 'type'> {
  /**
   * 指定为 portlet 类型
   */
  type: 'portlet';

  tabs: Array<PortletTabSchema>;

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
   * 可以在右侧配置点其他功能按钮。不会随着tab切换
   */
  toolbar?: Array<ActionSchema>;

  /**
   * 是否支持溢出滚动
   */
  scrollable?: boolean;

  /**
   * header和内容是否展示分割线
   */
  divider?: boolean;

  /**
   * 标题右侧的描述
   */
  description?: SchemaTpl;

  /**
   * 隐藏头部
   */
  hideHeader?: boolean;

  /**
   * 自定义样式
   */
  style?:
    | string
    | {
        [propName: string]: any;
      };
}

export interface PortletProps
  extends RendererProps,
    Omit<PortletSchema, 'className' | 'contentClassName'> {
  activeKey?: number;
  tabRender?: (
    tab: PortletTabSchema,
    props: PortletProps,
    index: number
  ) => JSX.Element;
}

export interface PortletState {
  activeKey?: number;
}

export class Portlet extends React.Component<PortletProps, PortletState> {
  static defaultProps: Partial<PortletProps> = {
    className: '',
    mode: 'line',
    divider: true
  };
  renderTab?: (
    tab: PortletTabSchema,
    props: PortletProps,
    index: number
  ) => JSX.Element;
  constructor(props: PortletProps) {
    super(props);

    const activeKey = props.activeKey || 0;

    this.state = {
      activeKey
    };
  }

  @autobind
  handleSelect(key: number) {
    const {onSelect, tabs} = this.props;
    if (typeof key === 'number' && key < tabs.length) {
      this.setState({
        activeKey: key
      });
    }

    if (typeof onSelect === 'string') {
      const selectFunc = str2AsyncFunction(onSelect, 'key', 'props');
      selectFunc && selectFunc(key, this.props);
    } else if (typeof onSelect === 'function') {
      onSelect(key, this.props);
    }
  }

  renderToolbarItem(toolbar: Array<ActionSchema>) {
    const {render} = this.props;
    let actions: Array<JSX.Element> = [];
    if (Array.isArray(toolbar)) {
      toolbar.forEach((action, index) =>
        actions.push(
          render(
            `toolbar/${index}`,
            {
              type: 'button',
              level: 'link',
              size: 'sm',
              ...(action as any)
            },
            {
              key: index
            }
          )
        )
      );
    }
    return actions;
  }

  renderToolbar() {
    const {toolbar, classnames: cx, classPrefix: ns, tabs} = this.props;
    const activeKey = this.state.activeKey;
    let tabToolbar = null;
    let tabToolbarTpl = null;
    // tabs里的toolbar
    const toolbarTpl = toolbar ? (
      <div className={cx(`${ns}toolbar`)}>
        {this.renderToolbarItem(toolbar)}
      </div>
    ) : null;

    // tab里的toolbar
    if (typeof activeKey !== 'undefined') {
      tabToolbar = tabs[activeKey]!.toolbar;
      tabToolbarTpl = tabToolbar ? (
        <div className={cx(`${ns}tab-toolbar`)}>
          {this.renderToolbarItem(tabToolbar)}
        </div>
      ) : null;
    }

    return toolbarTpl || tabToolbarTpl ? (
      <div className={cx(`${ns}Portlet-toolbar`)}>
        {toolbarTpl}
        {tabToolbarTpl}
      </div>
    ) : null;
  }

  renderDesc() {
    const {
      description: descTpl,
      render,
      classnames: cx,
      classPrefix: ns,
      data
    } = this.props;
    const desc = filter(descTpl, data);
    return desc ? (
      <span className={cx(`${ns}Portlet-header-desc`)}>{desc}</span>
    ) : null;
  }

  renderTabs() {
    const {
      classnames: cx,
      classPrefix: ns,
      tabsClassName,
      contentClassName,
      linksClassName,
      tabRender,
      render,
      data,
      mode: dMode,
      tabsMode,
      unmountOnExit,
      source,
      mountOnEnter,
      scrollable,
      translate: __,
      addBtnText,
      divider
    } = this.props;
    const mode = tabsMode || dMode;
    const arr = resolveVariable(source, data);

    let tabs = this.props.tabs;
    if (!tabs) {
      return null;
    }

    tabs = Array.isArray(tabs) ? tabs : [tabs];
    let children: Array<JSX.Element | null> = [];

    const tabClassname = cx(`${ns}Portlet-tab`, tabsClassName, {
      ['unactive-select']: tabs.length <= 1,
      ['no-divider']: !divider
    });
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
                  (tab as any)?.type ? (tab as any) : tab.tab || tab.body,
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
            {this.renderTab
              ? this.renderTab(tab, this.props, index)
              : tabRender
              ? tabRender(tab, this.props, index)
              : render(
                  `tab/${index}`,
                  (tab as any)?.type ? (tab as any) : tab.tab || tab.body
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
        className={tabClassname}
        contentClassName={contentClassName}
        linksClassName={linksClassName}
        activeKey={this.state.activeKey}
        onSelect={this.handleSelect}
        toolbar={this.renderToolbar()}
        additionBtns={this.renderDesc()}
        scrollable={scrollable}
      >
        {children}
      </CTabs>
    );
  }

  render() {
    const {
      className,
      data,
      classnames: cx,
      classPrefix: ns,
      style,
      hideHeader
    } = this.props;
    const portletClassname = cx(`${ns}Portlet`, className, {
      ['no-header']: hideHeader
    });
    const styleVar =
      typeof style === 'string'
        ? resolveVariable(style, data) || {}
        : mapValues(style, s => resolveVariable(s, data) || s);

    return (
      <div className={portletClassname} style={styleVar}>
        {this.renderTabs()}
      </div>
    );
  }
}

@Renderer({
  type: 'portlet'
})
export class PortletRenderer extends Portlet {}
