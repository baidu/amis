import React from 'react';
import {findDOMNode} from 'react-dom';
import isEqual from 'lodash/isEqual';
import {
  Renderer,
  RendererEnv,
  RendererProps,
  resolveVariableAndFilter,
  ActionObject,
  getExprProperties,
  buildStyle,
  filter,
  evalExpression,
  insertStyle
} from 'amis-core';
import {
  guid,
  autobind,
  createObject,
  isUnfolded,
  mapTree,
  someTree,
  spliceTree,
  findTreeIndex,
  findTree,
  isObject
} from 'amis-core';
import {generateIcon} from 'amis-core';
import {isEffectiveApi} from 'amis-core';
import {themeable, ThemeProps} from 'amis-core';
import {Icon, getIcon, SpinnerExtraProps} from 'amis-ui';
import {BadgeObject} from 'amis-ui';
import {RemoteOptionsProps, withRemoteConfig} from 'amis-ui';
import {Spinner, Menu} from 'amis-ui';
import {ScopedContext, IScopedContext} from 'amis-core';
import type {NavigationItem} from 'amis-ui/lib/components/menu';
import type {MenuItemProps} from 'amis-ui/lib/components/menu/MenuItem';

import type {Payload} from 'amis-core';
import type {
  BaseSchema,
  SchemaObject,
  SchemaApi,
  SchemaIcon,
  SchemaUrlPath,
  SchemaCollection,
  SchemaClassName
} from '../Schema';

export type IconItemSchema = {
  icon?: SchemaIcon;
  position: string; // before after
};

export type NavItemSchema = {
  /**
   * 文字说明
   */
  label?: string | SchemaCollection;

  /**
   * 图标类名，参考 fontawesome 4。
   */
  icon?: SchemaIcon | Array<IconItemSchema>;

  to?: SchemaUrlPath;

  target?: string;

  unfolded?: boolean;
  active?: boolean;

  defer?: boolean;
  deferApi?: SchemaApi;

  children?: Array<NavItemSchema>;

  key?: string; // 菜单项的唯一标识 事件动作需要使用

  disabled?: boolean; // 菜单禁用

  disabledTip?: string; // 禁用提示文案

  className?: string; // 自定义菜单项样式

  accordion?: boolean; // 手风琴展开 仅垂直inline模式支持

  mode?: string; // 菜单项模式 分组模式：group、divider

  popupClassName?: string; // 子菜单项展开浮层样式
} & Omit<BaseSchema, 'type'>;

export interface NavOverflow {
  /**
   * 是否开启响应式收纳
   */
  enable: boolean;

  /**
   * 菜单触发按钮的文字
   */
  overflowLabel?: string | SchemaObject;

  /**
   * 菜单触发按钮的图标
   * @default "fa fa-ellipsis-h"
   */
  overflowIndicator?: SchemaIcon;

  /**
   * 菜单触发按钮CSS类名
   */
  overflowClassName?: SchemaClassName;

  /**
   * Popover浮层CSS类名
   */
  overflowPopoverClassName?: SchemaClassName;

  /**
   * 菜单外层CSS类名
   */
  overflowListClassName?: SchemaClassName;

  /**
   * 导航横向布局时，开启开启响应式收纳后最大可显示数量，超出此数量的导航将被收纳到下拉菜单中
   */
  maxVisibleCount?: number;

  /**
   * 包裹导航的外层标签名，可以使用其他标签渲染
   * @default "ul"
   */
  wrapperComponent?: string;

  /**
   * 导航项目宽度
   * @default 160
   */
  itemWidth?: number;

  /**
   * 导航列表后缀节点
   */
  overflowSuffix?: SchemaCollection;

  /**
   * 自定义样式
   */
  style?: React.CSSProperties;

  /**
   * 菜单DOM挂载点
   */
  popOverContainer?: any;
}

/**
 * Nav 导航渲染器
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/nav
 */
export interface NavSchema extends BaseSchema {
  /**
   * 指定为 Nav 导航渲染器
   */
  type: 'nav';

  /**
   * 链接地址集合
   */
  links?: Array<NavItemSchema>;

  /**
   * @default 16
   */
  indentSize: number;

  /**
   * 可以通过 API 拉取。
   */
  source?: SchemaApi;

  /**
   * 懒加载 api，如果不配置复用 source 接口。
   */
  deferApi?: SchemaApi;

  /**
   * true 为垂直排列，false 为水平排列类似如 tabs。
   */
  stacked?: true | false;

  /**
   * 更多操作菜单列表
   */
  itemActions?: SchemaCollection;

  /**
   * 可拖拽
   */
  draggable?: boolean;

  /**
   * 保存排序的 api
   */
  saveOrderApi?: SchemaApi;

  /**
   * 角标
   */
  itemBadge?: BadgeObject;

  /**
   * 角标
   */
  badge?: BadgeObject;

  /**
   * 仅允许同层级拖拽
   */
  dragOnSameLevel?: boolean;

  /**
   * 横向导航时自动收纳配置
   */
  overflow?: NavOverflow;

  /**
   * 最多展示多少层级
   */
  level?: number;

  /**
   * 默认展开层级 小于等于该层数的节点默认全部打开
   */
  defaultOpenLevel?: number;

  /**
   * 控制仅展示指定key菜单下的子菜单项
   */
  showKey?: string;

  /**
   * 控制仅展示指定key菜单下的子菜单项
   */
  collapsed?: boolean;

  /**
   * 垂直模式 非折叠状态下 控制菜单打开方式
   */
  mode?: 'float' | 'inline'; // float（悬浮）inline（内联） 默认inline

  /**
   * 自定义展开图标
   */
  expandIcon?: string | SchemaObject;

  /**
   * 自定义展开图标位置 默认在前面 before after
   */
  expandPosition?: string;

  /**
   * 主题配色 默认light
   */
  themeColor?: 'light' | 'dark';
}

export interface Link {
  className?: string;
  label?: string | SchemaCollection;
  to?: string;
  target?: string;
  icon?: string;
  active?: boolean;
  activeOn?: string;
  unfolded?: boolean;
  children?: Links;
  defer?: boolean;
  loading?: boolean;
  loaded?: boolean;
  [propName: string]: any;
  disabled?: boolean;
  disabledTip?: string;
}
export interface Links extends Array<Link> {}

export interface NavigationState {
  error?: string;
  dropIndicator?: {
    top: number;
    left: number;
    width: number;
    height?: number;
    opacity?: number;
  };
  collapsed?: boolean;
}

export interface NavigationProps
  extends ThemeProps,
    Omit<RendererProps, 'className'>,
    Omit<NavSchema, 'type' | 'className'>,
    SpinnerExtraProps {
  onSelect?: (item: Link, depth: number) => void | false;
  onToggle?: (item: Link, depth: number, forceFold?: boolean) => void;
  onDragUpdate?: (dropInfo: IDropInfo) => void;
  onOrderChange?: (res: Link[]) => void;
  togglerClassName?: string;
  links?: Array<Link>;
  loading?: boolean;
  render: RendererProps['render'];
  env: RendererEnv;
  data: Object;
  reload?: any;
  overflow?: NavOverflow;
}

export interface IDropInfo {
  dragLink: Link | null;
  nodeId: string;
  position: string;
  rect: DOMRect;
  height: number;
  left: number;
}

export class Navigation extends React.Component<
  NavigationProps,
  NavigationState
> {
  static defaultProps: Pick<NavigationProps, 'indentSize'> = {
    indentSize: 16
  };

  dragNode: {
    node: HTMLElement;
    link: Link | null;
  } | null;
  dropInfo: IDropInfo | null;
  startPoint: {
    y: number;
    x: number;
  } = {
    y: 0,
    x: 0
  };
  state: NavigationState = {};

  @autobind
  async handleClick(link: Link, depth: number) {
    const {env, onSelect} = this.props;
    // 和 action 里命名一致方便分析
    if (link && link.to) {
      env?.tracker({
        eventType: 'link',
        eventData: {
          label: link.label,
          link: link.to
        }
      });
    }

    await onSelect?.(link, depth);
    return false;
  }

  @autobind
  toggleLink(target: Link, depth: number, forceFold?: boolean) {
    this.props.onToggle?.(target, depth, forceFold);
  }

  @autobind
  getDropInfo(e: DragEvent, id: string, depth: number): IDropInfo {
    const {dragOnSameLevel, indentSize} = this.props;
    let rect = (e.target as HTMLElement).getBoundingClientRect();
    const dragLink = this.dragNode?.link as Link;
    const {top, height, width} = rect;
    let {clientY, clientX} = e;
    const left = depth * (parseInt(indentSize as any, 10) ?? 16);
    const deltaX = left + width * 0.2;
    let position;
    if (clientY >= top + height / 2) {
      position = 'bottom';
    } else {
      position = 'top';
    }
    if (
      !dragOnSameLevel &&
      position === 'bottom' &&
      clientX >= this.startPoint.x + deltaX
    ) {
      position = 'self';
    }
    return {
      nodeId: id,
      dragLink,
      position,
      rect,
      height,
      left
    };
  }
  @autobind
  updateDropIndicator(e: DragEvent) {
    const {dragOnSameLevel, overflow} = this.props;
    // 因为使用了rc-menu 因此拖拽事件拿到的rc-menu的li
    // id和depth在li里的a标签上
    const target = (e.target as HTMLElement).querySelector('a');
    const targetId = target?.getAttribute('data-id') as string;
    const targetDepth = Number(target?.getAttribute('data-depth'));

    const wrapperComponent =
      overflow && overflow.enable ? overflow.wrapperComponent || 'ul' : 'ul';
    if (
      dragOnSameLevel &&
      // menu里原来menuItem套了一层div 后来改成了ul 这里的判断条件需要加限制
      // 否则始终不相等
      this.dragNode?.node.closest(`${wrapperComponent}[role="menu"]`) !==
        target?.closest(`${wrapperComponent}[role="menu"]`)
    ) {
      this.setState({dropIndicator: undefined});
      this.dropInfo = null;
      return;
    }
    this.dropInfo = this.getDropInfo(e, targetId, targetDepth);
    let {position, rect, dragLink, height, left} = this.dropInfo;
    if (targetId === dragLink?.__id) {
      this.setState({dropIndicator: undefined});
      this.dropInfo = null;
      return;
    }
    const ul = (findDOMNode(this) as HTMLElement).firstChild as HTMLElement;
    if (position === 'self') {
      const dropIndicator = {
        top: rect.top - ul.getBoundingClientRect().top,
        left,
        width: ul.getBoundingClientRect().width - left,
        height,
        opacity: 0.2
      };
      // 尽量减少dropIndicator的更新 否则到saas里会比较卡
      if (
        !this.state.dropIndicator ||
        (this.state.dropIndicator &&
          !isEqual(this.state.dropIndicator, dropIndicator))
      ) {
        this.setState({
          dropIndicator
        });
      }
    } else {
      const dropIndicator = {
        top:
          (position === 'bottom' ? rect.top + rect.height : rect.top) -
          ul.getBoundingClientRect().top,
        left,
        width: ul.getBoundingClientRect().width - left
      };
      if (
        !this.state.dropIndicator ||
        (this.state.dropIndicator &&
          !isEqual(this.state.dropIndicator, dropIndicator))
      ) {
        this.setState({
          dropIndicator
        });
      }
    }
  }

  @autobind
  handleDragStart(link: Link) {
    return (e: React.DragEvent) => {
      e.stopPropagation();
      const currentTarget = e.currentTarget as HTMLElement;
      e.dataTransfer.effectAllowed = 'copyMove';
      e.dataTransfer.setDragImage(currentTarget, 0, 0);
      this.dragNode = {
        node: currentTarget,
        link
      };
      this.dropInfo = null;
      this.startPoint = {
        x: e.clientX,
        y: e.clientY
      };
      currentTarget.addEventListener('dragend', this.handleDragEnd);
      document.body.addEventListener('dragover', this.handleDragOver);
    };
  }

  @autobind
  handleDragOver(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!this.dragNode) {
      return;
    }
    const target = (e.target as HTMLElement).querySelector('a');
    const id = target?.getAttribute('data-id');
    if (!id) {
      return;
    }
    this.updateDropIndicator(e);
  }

  @autobind
  handleDragEnd(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      dropIndicator: undefined
    });
    const currentTarget = e.currentTarget as HTMLElement;
    let id = currentTarget.getAttribute('data-id');
    if (!id) {
      const a = currentTarget.querySelector('a');
      if (a) {
        id = a.getAttribute('data-id');
      }
    }
    let nodeId = this.dropInfo?.nodeId;
    if (!this.dropInfo || !nodeId || id === nodeId) {
      return;
    }
    currentTarget.removeEventListener('dragend', this.handleDragEnd);
    document.body.removeEventListener('dragover', this.handleDragOver);

    this.props.onDragUpdate?.(this.dropInfo);
    this.dragNode = null;
    this.dropInfo = null;
  }

  normalizeNavigations(links: Links, depth: number): Array<NavigationItem> {
    const {
      level,
      stacked,
      mode,
      itemActions,
      render,
      classnames: cx,
      data
    } = this.props;

    if (!links) {
      return [];
    }
    if (level && depth > level) {
      return [];
    }

    return links.map((link: Link) => {
      let beforeIcon = null;
      let afterIcon = null;
      if (Array.isArray(link.icon)) {
        beforeIcon = link.icon
          .filter(item => item.position === 'before')
          .map(item => {
            if (React.isValidElement(item)) {
              return item;
            }
            return generateIcon(cx, item.icon);
          });
        afterIcon = link.icon
          .filter(item => item.position === 'after')
          .map(item => {
            if (React.isValidElement(item)) {
              return item;
            }
            return generateIcon(cx, item.icon);
          });
      } else if (link.icon) {
        if (React.isValidElement(link.icon)) {
          beforeIcon = link.icon;
        } else {
          beforeIcon = generateIcon(cx, link.icon);
        }
      }

      const label =
        typeof link.label === 'string'
          ? link.label
          : React.isValidElement(link.label)
          ? React.cloneElement(link.label)
          : render('inline', link.label as SchemaCollection);

      // 仅垂直内联模式支持
      const isOverflow =
        stacked &&
        mode !== 'float' &&
        !link.expanded &&
        link.overflow &&
        isObject(link.overflow) &&
        link.overflow.enable;
      let children = link.children;
      if (isOverflow) {
        const {
          maxVisibleCount,
          overflowIndicator = 'fa fa-ellipsis-h',
          overflowLabel,
          overflowClassName
        } = link.overflow;
        // 默认展示5个
        const maxCount = maxVisibleCount || 2;
        if (maxCount < (children?.length || 0)) {
          children = children?.map((child: Link, index: number) => {
            return {
              ...child,
              label:
                index === maxCount ? (
                  <span className={cx(overflowClassName)}>
                    {getIcon(overflowIndicator!) ? (
                      <Icon icon={overflowIndicator} className="icon" />
                    ) : (
                      generateIcon(cx, overflowIndicator, 'Nav-item-icon')
                    )}
                    {overflowLabel && isObject(overflowLabel)
                      ? render('nav-overflow-label', overflowLabel)
                      : overflowLabel}
                  </span>
                ) : (
                  child.label
                ),
              hidden: index > maxCount ? true : link.hidden,
              expandMore: index === maxCount
            };
          });
        }
      }

      return {
        link,
        label,
        labelExtra: afterIcon ? (
          <i className={cx('Nav-Menu-item-icon-after')}>{afterIcon}</i>
        ) : null,
        icon: beforeIcon ? <i>{beforeIcon}</i> : null,
        children: children
          ? this.normalizeNavigations(children, depth + 1)
          : [],
        path: link.to,
        open: link.unfolded,
        extra: itemActions
          ? render('inline', itemActions, {
              data: createObject(data, link),
              popOverContainer: () => document.body,
              // 点击操作之后 就关闭 因为close方法里执行了preventDefault
              closeOnClick: true
            })
          : null,
        disabled: !!link.disabled,
        disabledTip: link.disabledTip,
        hidden: link.hidden,
        className: link.className,
        mode: link.mode
      };
    });
  }

  render(): JSX.Element {
    const {
      className,
      style,
      stacked,
      mode,
      classnames: cx,
      links,
      loading,
      overflow,
      loadingConfig,
      itemBadge,
      badge,
      data,
      location,
      collapsed,
      expandIcon,
      indentSize,
      accordion,
      draggable,
      themeColor,
      expandPosition,
      popupClassName,
      disabled,
      id,
      render
    } = this.props;
    const {dropIndicator} = this.state;

    let overflowedIndicator = null;
    if (overflow && isObject(overflow) && overflow.enable) {
      const {
        overflowIndicator = 'fa fa-ellipsis-h',
        overflowLabel,
        overflowClassName
      } = overflow;
      overflowedIndicator = (
        <span className={cx(overflowClassName)}>
          <>
            {getIcon(overflowIndicator!) ? (
              <Icon icon={overflowIndicator} className="icon" />
            ) : (
              generateIcon(cx, overflowIndicator, 'Nav-item-icon')
            )}
            {overflowLabel && isObject(overflowLabel)
              ? render('nav-overflow-label', overflowLabel)
              : overflowLabel}
          </>
        </span>
      );
    }

    let styleConfig = null;
    let classNameId = '';
    if (style) {
      try {
        styleConfig = buildStyle(style, data);
        // 格式转换
        // {"color": "red", "lineHeight": "52px"}
        const styleText = JSON.stringify(styleConfig)
          .replace(/\,/g, ';')
          .replace(/\"/g, '')
          .replace(/[A-Z]/g, s => '-' + s.toLowerCase());
        // 一个nav对应一个classNameId 避免重复
        classNameId = cx(`Nav-PopupClassName-${id}`);
        if (!document.getElementById(classNameId)) {
          // rc-menu的浮层只支持配置popupClassName 因此需要将配置的style插入到页面 然后将className赋值给浮层
          insertStyle(`.${classNameId} ${styleText}`, classNameId);
        }
      } catch (e) {}
    }

    return (
      <div
        className={cx('Nav', className, {
          ['Nav-horizontal']: !stacked
        })}
        style={styleConfig}
      >
        <>
          {Array.isArray(links) ? (
            <Menu
              navigations={this.normalizeNavigations(links, 1)}
              isActive={(link: NavigationItem, prefix: string = '') => {
                if (link.link && typeof link.link.active !== 'undefined') {
                  return link.link.active;
                }
                const path = link.path;
                const ret = location.pathname === path;

                return !!ret;
              }}
              isOpen={(item: NavigationItem) => !!item.open}
              stacked={!!stacked}
              mode={mode}
              themeColor={themeColor}
              onSelect={this.handleClick}
              onToggle={this.toggleLink}
              renderLink={(link: MenuItemProps) => link.link}
              badge={itemBadge || badge}
              collapsed={collapsed}
              overflowedIndicator={overflowedIndicator}
              overflowMaxCount={overflow?.maxVisibleCount}
              overflowedIndicatorPopupClassName={cx(
                overflow?.overflowPopoverClassName
              )}
              overflowSuffix={
                overflow?.overflowSuffix
                  ? render('nav-overflow-suffix', overflow?.overflowSuffix)
                  : null
              }
              overflowItemWidth={overflow?.itemWidth}
              overflowComponent={overflow?.wrapperComponent}
              overflowStyle={overflow?.style}
              popupClassName={`${popupClassName || ''}${
                classNameId ? ` ${classNameId}` : ''
              }`}
              expandIcon={
                expandIcon
                  ? typeof expandIcon === 'string'
                    ? expandIcon
                    : render('expand-icon', expandIcon)
                  : null
              }
              expandBefore={expandPosition === 'after' ? false : true}
              inlineIndent={indentSize}
              accordion={accordion}
              draggable={draggable}
              data={data}
              disabled={disabled}
              onDragStart={this.handleDragStart}
            ></Menu>
          ) : null}
          <Spinner show={!!loading} overlay loadingConfig={loadingConfig} />
        </>
        {dropIndicator ? (
          <div className={cx('Nav-dropIndicator')} style={dropIndicator} />
        ) : null}
      </div>
    );
  }
}

const ThemedNavigation = themeable(Navigation);

function getActiveItems(config: Array<any>, depth: number, level: number) {
  if (depth > level) {
    return [];
  }
  let activeItems: Array<any> = [];
  config &&
    config.forEach(item => {
      if (item.active) {
        activeItems.push(item);
      }
      if (item.children) {
        activeItems = activeItems.concat(
          getActiveItems(item.children, depth + 1, level)
        );
      }
    });
  return activeItems;
}

const ConditionBuilderWithRemoteOptions = withRemoteConfig({
  adaptor: (config: any, props: any) => {
    const links = Array.isArray(config)
      ? config
      : config.links || config.options || config.items || config.rows;

    if (!Array.isArray(links)) {
      throw new Error('payload.data.options is not array.');
    }

    return links;
  },
  afterLoad: async (response: any, config: any, props: any) => {
    const {dispatchEvent} = props;

    const rendererEvent = await dispatchEvent('loaded', {
      data: response.value
    });

    if (rendererEvent?.prevented) {
      return;
    }

    if (response.value && !someTree(config, item => item.active)) {
      const {env} = props;

      env.jumpTo(filter(response.value as string, props.data));
    }
  },
  normalizeConfig(
    links: Array<Link>,
    origin: Array<Link> | undefined,
    props: any,
    motivation?: string
  ) {
    if (Array.isArray(links) && motivation !== 'toggle') {
      const {
        data,
        env,
        unfoldedField,
        foldedField,
        location,
        level,
        defaultOpenLevel,
        dispatchEvent,
        disabled,
        store
      } = props;

      const isActive = (link: Link, depth: number) => {
        if (disabled) {
          return false;
        }
        if (!!link.disabled) {
          return false;
        }
        return motivation !== 'location-change' &&
          typeof link.active !== 'undefined'
          ? link.active
          : (depth === level
              ? !!findTree(
                  link.children || [],
                  l =>
                    !!(
                      l.hasOwnProperty('to') &&
                      env &&
                      env.isCurrentUrl(filter(l.to as string, data), link)
                    )
                )
              : false) ||
              (link.activeOn
                ? evalExpression(link.activeOn as string, data) ||
                  evalExpression(link.activeOn as string, location)
                : !!(
                    link.hasOwnProperty('to') &&
                    link.to !== null && // 也可能出现{to: null}的情况（独立应用）filter会把null处理成'' 那默认首页会选中很多菜单项 {to: ''}认为是有效配置
                    env &&
                    env.isCurrentUrl(filter(link.to as string, data), link)
                  ));
      };

      links = mapTree(
        links,
        (link: Link, index: number, depth: number) => {
          const item: any = {
            ...link,
            ...getExprProperties(link, data as object),
            active: isActive(link, depth),
            __id: link.__id ?? guid()
          };

          // defaultOpenLevel depth <= defaultOpenLevel的默认全部展开
          // 优先级比unfolded属性低 如果用户配置了unfolded为false 那么默认不展开
          item.unfolded =
            typeof link.unfolded !== 'undefined'
              ? isUnfolded(item, {unfoldedField, foldedField})
              : defaultOpenLevel && depth <= defaultOpenLevel
              ? true
              : link.children &&
                !!findTree(link.children, (child, i, d) =>
                  isActive(child, depth + d)
                );

          return item;
        },
        1,
        true
      );

      const currentActiveItems = getActiveItems(links, 1, level);
      const prevActiveItems = getActiveItems(store.config, 1, level);
      setTimeout(() => {
        if (!isEqual(currentActiveItems, prevActiveItems)) {
          dispatchEvent('change', {value: currentActiveItems});
        }
      }, 0);
    }

    return links;
  },

  beforeDeferLoad(item: Link, indexes: Array<number>, links: Array<Link>) {
    return spliceTree(links, indexes, 1, {
      ...item,
      loading: true
    });
  },

  async afterDeferLoad(
    item: Link,
    indexes: Array<number>,
    ret: Payload,
    links: Array<Link>,
    props: any
  ) {
    const {dispatchEvent} = props;

    const rendererEvent = await dispatchEvent('loaded', {
      data: ret.data,
      item: {...item}
    });

    if (rendererEvent?.prevented) {
      return;
    }

    const newItem = {
      ...item,
      loading: false,
      loaded: true,
      error: ret.ok ? undefined : ret.msg
    };

    const children = Array.isArray(ret.data)
      ? ret.data
      : ret.data.links || ret.data.options || ret.data.items || ret.data.rows;

    if (Array.isArray(children)) {
      newItem.children = children.concat();
      newItem.unfolded = true;
    }

    return spliceTree(links, indexes, 1, newItem);
  }
})(
  class extends React.Component<
    RemoteOptionsProps &
      React.ComponentProps<typeof ThemedNavigation> & {
        location?: any;
        env?: RendererEnv;
        data?: any;
        unfoldedField?: string;
        foldedField?: string;
        reload?: any;
      },
    {currentKey: string; collapsed: boolean}
  > {
    constructor(props: any) {
      super(props);

      this.state = {
        currentKey: props.showKey || '', // 记录当前筛选的菜单label 如果有重复的 那只显示第一个
        collapsed: props.collapsed || false
      };

      this.toggleLink = this.toggleLink.bind(this);
      this.handleSelect = this.handleSelect.bind(this);
      this.dragUpdate = this.dragUpdate.bind(this);

      props?.onRef(this);
    }

    componentDidMount() {
      if (Array.isArray(this.props.links)) {
        this.props.updateConfig(this.props.links, 'mount');
      }
    }

    componentDidUpdate(prevProps: any, prevState: any) {
      if (!isEqual(this.props.location, prevProps.location)) {
        this.props.updateConfig(this.props.config, 'location-change');
      } else if (!isEqual(this.props.links, prevProps.links)) {
        this.props.updateConfig(this.props.links, 'update');
      }

      // 外部修改defaultOpenLevel 会影响菜单的unfolded属性
      if (prevProps.defaultOpenLevel !== this.props.defaultOpenLevel) {
        this.props.updateConfig(this.props.config, 'update');
      }

      if (prevProps.collapsed !== this.props.collapsed) {
        this.setState({collapsed: this.props.collapsed});
      }

      if (prevState.collapsed !== this.state.collapsed) {
        this.props.dispatchEvent('collapsed', {
          collapsed: this.state.collapsed
        });
      }
    }

    getCurrentLink(key: string) {
      let link = null;
      const {config, data} = this.props;
      const id = resolveVariableAndFilter(key, data, '| raw');
      if (key) {
        link = findTree(config, item => item.label == id || item.key == id);
      }
      return link;
    }

    async toggleLink(target: Link, depth: number, forceFold?: boolean) {
      const {
        config,
        updateConfig,
        deferLoad,
        dispatchEvent,
        stacked,
        mode,
        accordion
      } = this.props;

      const isAccordion = stacked && mode !== 'float' && accordion;

      const rendererEvent = await dispatchEvent('toggled', {
        item: {...target},
        open: typeof forceFold !== 'undefined' ? !forceFold : !target.unfolded
      });

      if (rendererEvent?.prevented) {
        return;
      }

      if (target.defer && !target.loaded) {
        deferLoad(target);
      } else {
        updateConfig(
          mapTree(config, (link: Link) =>
            target.__id === link.__id
              ? {
                  ...link,
                  unfolded:
                    typeof forceFold !== 'undefined'
                      ? !forceFold
                      : !link.unfolded
                }
              : {
                  ...link,
                  unfolded: isAccordion
                    ? !!findTree(link.children || [], item => item === target)
                    : link.unfolded
                }
          ),
          'toggle'
        );
      }
    }

    async dragUpdate(dropInfo: IDropInfo) {
      let links = this.props.config;
      const {nodeId, dragLink, position} = dropInfo;
      if (dragLink) {
        // 删除原节点
        const sourceIdx = findTreeIndex(
          links,
          link => link.__id === dragLink.__id
        ) as number[];
        links = spliceTree(links, sourceIdx, 1);

        if (position === 'self') {
          // 插入到对应节点的children中
          mapTree(links, link => {
            if (link.__id === nodeId) {
              if (!link.children) {
                link.children = [];
              }
              link.children.push(dragLink);
            }
            return link;
          });
        } else {
          // 找到需要插入的节点
          const idx = findTreeIndex(
            links,
            link => link.__id === nodeId
          ) as number[];
          // 插入节点之后
          if (position === 'bottom') {
            idx && idx.push((idx.pop() as number) + 1);
          }
          links = spliceTree(links, idx, 0, dragLink);
        }
      }
      this.props.updateConfig(links, 'update');
      this.props.onOrderChange?.(links);
      await this.saveOrder(
        mapTree(links, (link: Link) => {
          // 清除内部加的字段
          for (let key in link) {
            if (/^__.*$/.test(key)) {
              delete link[key];
            }
          }
          return link;
        })
      );
    }

    /**
     * @description 在接口存在的时候，调用接口保存排序结果
     * @param links 排序后的结果
     */
    async saveOrder(links: Links) {
      const {saveOrderApi, env, data, reload} = this.props;
      if (saveOrderApi && isEffectiveApi(saveOrderApi)) {
        await env?.fetcher(
          saveOrderApi as SchemaApi,
          createObject(data, {data: links}),
          {method: 'post'}
        );
        reload();
      } else if (!this.props.onOrderChange) {
        env?.alert('NAV saveOrderApi is required!');
      }
    }

    expandLink(target: Link) {
      const {config, updateConfig} = this.props;
      updateConfig(
        mapTree(config, (link: Link) => {
          if (
            findTree(
              link?.children || [],
              (item: any) => item.__id === target.__id
            )
          ) {
            return {
              ...link,
              expanded: true
            };
          }
          return {...link};
        }),
        'expand'
      );
    }

    async handleSelect(link: Link, depth: number) {
      const {onSelect, env, data, level, dispatchEvent, updateConfig, config} =
        this.props;

      const rendererEvent = await dispatchEvent('click', {
        item: {...link}
      });

      if (rendererEvent?.prevented) {
        return;
      }

      if (onSelect && onSelect(link) === false) {
        return;
      }

      // 叶子节点点击也会默认选中
      if (depth === level) {
        updateConfig(
          mapTree(config, (target: Link) => {
            return {
              ...target,
              active: target.__id === link.__id
            };
          }),
          'select'
        );
        return;
      }

      if (link.expandMore) {
        this.expandLink(link);
        return;
      }

      if (!link.to) {
        return;
      }
      env?.jumpTo(filter(link.to as string, data), link as any);
    }

    render() {
      const {disabled, loading, config, deferLoad, updateConfig, ...rest} =
        this.props;
      const currentLink = this.getCurrentLink(this.state.currentKey);

      return (
        <ThemedNavigation
          {...rest}
          loading={loading}
          links={currentLink?.children || config}
          collapsed={this.state.collapsed}
          disabled={disabled || loading}
          onSelect={this.handleSelect}
          onToggle={this.toggleLink}
          onDragUpdate={this.dragUpdate}
        />
      );
    }
  }
);

export default ThemedNavigation;
@Renderer({
  test: /(^|\/)(?:nav|navigation)$/,
  name: 'nav'
})
export class NavigationRenderer extends React.Component<RendererProps> {
  static contextType = ScopedContext;

  navRef: any;

  remoteRef:
    | {
        loadConfig: (ctx?: any) => Promise<any> | void;
        setConfig: (value: any) => void;
        syncConfig: () => void;
      }
    | undefined = undefined;

  @autobind
  remoteConfigRef(ref: any) {
    this.remoteRef = ref;
  }

  @autobind
  getRef(ref: any) {
    this.navRef = ref;
  }

  constructor(props: RendererProps, context: IScopedContext) {
    super(props);

    const scoped = context;
    scoped.registerComponent(this);
  }

  componentDidUpdate(prevProps: any) {
    // 在saas中 source可能切换 需要实时更新source数据源
    // 仅支持source为变量情况下自动更新 如果source配置了api 需要配置trackExpression
    if (this.remoteRef && this.props.source !== prevProps.source) {
      this.remoteRef.syncConfig();
    }
  }

  componentWillUnmount() {
    const scoped = this.context as IScopedContext;
    scoped.unRegisterComponent(this);
  }

  doAction(
    action: ActionObject,
    args: {
      value?: string | {[key: string]: string};
    }
  ) {
    const actionType = action?.actionType as any;
    const value = args?.value || action?.data?.value;
    if (actionType === 'updateItems') {
      let children: Array<Link> = [];
      if (value) {
        if (Array.isArray(value)) {
          // 只展示触发项的children属性
          // 多个的话 默认只展示第一个
          if (value.length > 0) {
            const item = value.find(
              item => item.children && item.children.length
            );
            if (item) {
              const key = item?.key || item?.label;
              if (this.navRef.state.currentKey !== key) {
                this.navRef.setState({currentKey: item?.key || item?.label});
                children = item.children;
              }
            }
          }
        } else if (typeof value === 'string') {
          const currentLink = this.navRef.getCurrentLink(value);
          this.navRef.setState({
            currentKey: currentLink.key || currentLink.label
          });

          children = currentLink?.children;
        }
      }
      if (children.length > 0) {
        const {env, data} = this.props;
        const child = findTree(
          children,
          item => env && env.isCurrentUrl(filter(item.to as string, data), item)
        );

        env?.jumpTo(
          filter(child ? child.to : (children[0].to as string), data)
        );
      }
    } else if (actionType === 'collapse') {
      const collapsed =
        typeof value !== 'undefined' ? value : !this.navRef.state.collapsed;

      this.navRef.setState({collapsed});
    } else if (actionType === 'reset') {
      this.navRef.setState({currentKey: ''});
    }
  }

  @autobind
  reload(target?: string, query?: any, values?: object) {
    if (query) {
      return this.receive(query);
    }

    const {data, translate: __} = this.props;
    const finalData = values ? createObject(data, values) : data;

    this.remoteRef?.loadConfig(finalData);
  }

  @autobind
  receive(values: object) {
    this.reload(undefined, undefined, values);
  }

  render() {
    const {id, ...rest} = this.props;
    return (
      <ConditionBuilderWithRemoteOptions
        {...rest}
        id={id || guid()} // id要么从editor传递过来 要么一个nav随机生成1个
        onRef={this.getRef}
        reload={this.reload}
        remoteConfigRef={this.remoteConfigRef}
      />
    );
  }
}
