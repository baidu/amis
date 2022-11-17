import React from 'react';
import {findDOMNode} from 'react-dom';
import Overflow from 'rc-overflow';
import {
  Renderer,
  RendererEnv,
  RendererProps,
  resolveVariableAndFilter,
  ActionObject
} from 'amis-core';
import {getExprProperties} from 'amis-core';
import {filter, evalExpression} from 'amis-core';
import {
  guid,
  autobind,
  createObject,
  isUnfolded,
  mapTree,
  someTree,
  spliceTree,
  findTreeIndex,
  isObject
} from 'amis-core';
import {generateIcon} from 'amis-core';
import {isEffectiveApi} from 'amis-core';
import {themeable} from 'amis-core';
import {Icon, getIcon} from 'amis-ui';
import {Badge, BadgeObject} from 'amis-ui';
import {RemoteOptionsProps, withRemoteConfig} from 'amis-ui';
import {Spinner} from 'amis-ui';
import {PopOverContainer} from 'amis-ui';
import {ScopedContext, IScopedContext} from 'amis-core';
import isEqual from 'lodash/isEqual';

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

export type NavItemSchema = {
  /**
   * 文字说明
   */
  label?: string | SchemaCollection;

  /**
   * 图标类名，参考 fontawesome 4。
   */
  icon?: SchemaIcon;

  to?: SchemaUrlPath;

  target?: string;

  unfolded?: boolean;
  active?: boolean;

  defer?: boolean;
  deferApi?: SchemaApi;

  children?: Array<NavItemSchema>;
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
   * @default "fa fa-ellipsis"
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
 * 文档：https://baidu.gitee.io/amis/docs/components/nav
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
   * @default 24
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
  stacked?: boolean;

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
   * 控制仅展示指定label菜单下的子菜单项
   */
  showLabel?: string;

  /**
   * 控制展开按钮位置 不设置 默认放在前面
   */
  expandPosition?: string; // before、after，不设置默认before
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
  itemBadge?: BadgeObject;
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
}

export interface NavigationProps
  extends RendererProps,
    Omit<NavSchema, 'type' | 'className'> {
  onSelect?: (item: Link) => void | false;
  onToggle?: (item: Link, forceFold?: boolean) => void;
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
    indentSize: 24
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
  handleClick(link: Link) {
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

    onSelect?.(link);
  }

  @autobind
  toggleLink(target: Link, forceFold?: boolean) {
    this.props.onToggle?.(target, forceFold);
  }

  @autobind
  getDropInfo(e: DragEvent, id: string, depth: number): IDropInfo {
    const {dragOnSameLevel, indentSize} = this.props;
    let rect = (e.target as HTMLElement).getBoundingClientRect();
    const dragLink = this.dragNode?.link as Link;
    const {top, height, width} = rect;
    let {clientY, clientX} = e;
    const left = depth * (parseInt(indentSize as any, 10) ?? 24);
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
    const {dragOnSameLevel} = this.props;
    const target = e.target as HTMLElement; // a标签
    const targetId = target.getAttribute('data-id') as string;
    const targetDepth = Number(target.getAttribute('data-depth'));
    if (
      dragOnSameLevel &&
      this.dragNode?.node.parentElement !== target.parentElement?.parentElement
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
      this.setState({
        dropIndicator: {
          top: rect.top - ul.getBoundingClientRect().top,
          left,
          width: ul.getBoundingClientRect().width - left,
          height,
          opacity: 0.2
        }
      });
    } else {
      this.setState({
        dropIndicator: {
          top:
            (position === 'bottom' ? rect.top + rect.height : rect.top) -
            ul.getBoundingClientRect().top,
          left,
          width: ul.getBoundingClientRect().width - left
        }
      });
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
        link: link
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
    const target = e.target as HTMLElement;
    const id = target.getAttribute('data-id');
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
    const id = currentTarget.getAttribute('data-id');
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

  renderItem(link: Link, index: number, depth = 1) {
    if (link.hidden === true || link.visible === false) {
      return null;
    }
    if (this.props.level && this.props.level < depth) {
      return null;
    }
    const isActive: boolean = !!link.active;
    const {
      disabled,
      togglerClassName,
      classnames: cx,
      indentSize,
      render,
      itemActions,
      draggable,
      itemBadge,
      level,
      stacked,
      expandPosition,
      data: defaultData
    } = this.props;
    let hasSub = !!(
      (link.defer && !link.loaded) ||
      (link.children && link.children.length)
    );

    if (level) {
      hasSub = !!(depth + 1 < level);
    }

    // padding-left只有stacked模式下才设置
    const linkStyle = stacked
      ? {paddingLeft: depth * (parseInt(indentSize as any, 10) ?? 24)}
      : {};

    const togglerIcon = hasSub ? (
      <span
        onClick={e => {
          this.toggleLink(link);
          e.stopPropagation();
        }}
        className={cx('Nav-itemToggler', togglerClassName)}
      >
        <Icon icon="caret" className="icon" />
      </span>
    ) : null;
    const expandAfter = expandPosition === 'after';

    return (
      <li
        key={link.__id ?? index}
        data-id={link.__id}
        className={cx('Nav-item', link.className, {
          'is-disabled': disabled || link.disabled || link.loading,
          'is-active': isActive,
          'is-unfolded': link.unfolded,
          'is-after': expandAfter,
          'has-sub': hasSub
        })}
        onDragStart={this.handleDragStart(link)}
      >
        <Badge
          classnames={cx}
          badge={itemBadge}
          data={createObject(defaultData, link)}
        >
          <a
            data-id={link.__id}
            data-depth={depth}
            title={typeof link?.label === 'string' ? link?.label : undefined}
            onClick={this.handleClick.bind(this, link)}
            style={linkStyle}
          >
            {!disabled && draggable ? (
              <div
                className={cx('Nav-itemDrager')}
                draggable
                onMouseDown={e => {
                  this.toggleLink(link, true);
                  e.stopPropagation();
                }}
              >
                <Icon icon="drag-bar" className="icon" />
              </div>
            ) : null}
            {link.loading ? (
              <Spinner
                size="sm"
                show
                icon="reload"
                spinnerClassName={cx('Nav-spinner')}
              />
            ) : !expandAfter ? (
              togglerIcon
            ) : null}
            {generateIcon(cx, link.icon, 'Nav-itemIcon')}
            {link.label &&
              (typeof link.label === 'string'
                ? link.label
                : render('inline', link.label as SchemaCollection))}
            {expandAfter ? togglerIcon : null}
          </a>
          {
            // 更多操作
            itemActions ? (
              <div className={cx('Nav-item-atcions')}>
                {render('inline', itemActions, {
                  data: createObject(defaultData, link)
                })}
              </div>
            ) : null
          }
          {Array.isArray(link.children) && link.children.length ? (
            <ul className={cx('Nav-subItems')}>
              {link.children.map((link, index) =>
                this.renderItem(link, index, depth + 1)
              )}
            </ul>
          ) : null}
        </Badge>
      </li>
    );
  }

  renderOverflowNavs(overflowConfig: NavOverflow) {
    const {render, classnames: cx, className, loading, links = []} = this.props;
    const {
      overflowClassName,
      overflowPopoverClassName,
      overflowListClassName,
      overflowLabel,
      overflowIndicator,
      itemWidth = 160,
      overflowSuffix,
      popOverContainer,
      style,
      maxVisibleCount,
      wrapperComponent = 'ul'
    } = overflowConfig;

    return (
      <>
        <Spinner show={!!loading} overlay />

        <Overflow<Link>
          className={cx('Nav-list--tabs', className)}
          prefixCls={cx('Nav-list')}
          itemWidth={itemWidth}
          style={style}
          component={wrapperComponent as any}
          data={links}
          suffix={
            overflowSuffix
              ? render('nav-overflow-suffix', overflowSuffix)
              : null
          }
          renderRawItem={(item, index) =>
            this.renderItem(item, index) as JSX.Element
          }
          renderRawRest={overFlowedItems => {
            return (
              <PopOverContainer
                popOverContainer={popOverContainer}
                popOverClassName={cx(
                  'Nav-item-overflow-popover',
                  overflowPopoverClassName
                )}
                popOverRender={({onClose}) => (
                  <div
                    className={cx(
                      'Nav-list',
                      'Nav-list--stacked', // 浮层菜单为垂直布局
                      'Nav-list-overflow',
                      overflowListClassName
                    )}
                  >
                    {overFlowedItems.map((item, index) =>
                      React.cloneElement(
                        this.renderItem(item, index) as JSX.Element,
                        {
                          onClick: onClose
                        }
                      )
                    )}
                  </div>
                )}
              >
                {({onClick, ref, isOpened}) => (
                  <li
                    ref={ref}
                    className={cx(
                      'Nav-item',
                      'Nav-item-overflow',
                      {
                        'is-overflow-opened': isOpened
                      },
                      overflowClassName
                    )}
                    onClick={onClick}
                  >
                    <a data-id={guid()} data-depth={1}>
                      {getIcon(overflowIndicator!) ? (
                        <Icon icon={overflowIndicator} className="icon" />
                      ) : (
                        generateIcon(cx, overflowIndicator, 'Nav-itemIcon')
                      )}
                      {overflowLabel && isObject(overflowLabel)
                        ? render('nav-overflow-label', overflowLabel)
                        : overflowLabel}
                    </a>
                  </li>
                )}
              </PopOverContainer>
            );
          }}
          maxCount={
            maxVisibleCount && Number.isInteger(maxVisibleCount)
              ? maxVisibleCount
              : 'responsive'
          }
        />
      </>
    );
  }

  render(): JSX.Element {
    const {
      className,
      stacked,
      classnames: cx,
      links,
      loading,
      overflow
    } = this.props;
    const {dropIndicator} = this.state;

    return (
      <div className={cx('Nav')}>
        {overflow && isObject(overflow) && overflow.enable ? (
          this.renderOverflowNavs({
            overflowIndicator: 'fa fa-ellipsis',
            wrapperComponent: 'ul',
            itemWidth: 160,
            ...overflow
          })
        ) : (
          <>
            <ul
              className={cx(
                'Nav-list',
                className,
                stacked ? 'Nav-list--stacked' : 'Nav-list--tabs'
              )}
            >
              {Array.isArray(links)
                ? links.map((item, index) => this.renderItem(item, index))
                : null}

              <Spinner show={!!loading} overlay />
            </ul>
            {dropIndicator ? (
              <div className={cx('Nav-dropIndicator')} style={dropIndicator} />
            ) : null}
          </>
        )}
      </div>
    );
  }
}

const ThemedNavigation = themeable(Navigation);

// 如果设置了重复的label，那么默认取第一个找到的
function findSelectedLink(links: Array<Link>, key: string): any {
  let result = null;
  if (links && links.length) {
    for (let i = 0; i < links.length; i++) {
      const item = links[i];
      if (item.label === key) {
        result = item;
        break;
      } else if (item.children) {
        result = findSelectedLink(item.children, key);
      }
    }
  }
  return result;
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
  afterLoad: (response: any, config: any, props: any) => {
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
      const {data, env, unfoldedField, foldedField, location} = props;

      links = mapTree(
        links,
        (link: Link) => {
          const item: any = {
            ...link,
            ...getExprProperties(link, data as object),
            active:
              (motivation !== 'location-change' && link.active) ||
              (link.activeOn
                ? evalExpression(link.activeOn as string, data) ||
                  evalExpression(link.activeOn as string, location)
                : !!(
                    link.hasOwnProperty('to') &&
                    env &&
                    env.isCurrentUrl(filter(link.to as string, data))
                  )),
            __id: link.__id ?? guid()
          };

          item.unfolded =
            isUnfolded(item, {unfoldedField, foldedField}) ||
            (link.children && link.children.some(link => !!link.active));

          return item;
        },
        1,
        true
      );
    }

    return links;
  },

  beforeDeferLoad(item: Link, indexes: Array<number>, links: Array<Link>) {
    return spliceTree(links, indexes, 1, {
      ...item,
      loading: true
    });
  },

  afterDeferLoad(
    item: Link,
    indexes: Array<number>,
    ret: Payload,
    links: Array<Link>
  ) {
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
      }
  > {
    constructor(props: any) {
      super(props);
      this.toggleLink = this.toggleLink.bind(this);
      this.handleSelect = this.handleSelect.bind(this);
      this.dragUpdate = this.dragUpdate.bind(this);

      props?.onRef(this);
    }

    componentDidMount() {
      if (Array.isArray(this.props.links)) {
        this.props.updateConfig(this.props.links, 'mount');
        this.props.setOriginConfig(this.props.links);
      }

      const showLabel = this.props.showLabel;
      if (showLabel) {
        const children = this.updateSelectedConfig(showLabel);
        this.props.updateConfig(children, 'update');
      }

      // hahs history 切换路由 自动选中
      window.addEventListener('popstate', this.updateConfig, false);
    }

    getActiveItems(config: Array<any>) {
      let activeItems: Array<any> = [];
      config &&
        config.forEach(item => {
          if (item.active) {
            activeItems.push(item);
          }
          if (item.children) {
            activeItems = activeItems.concat(
              this.getActiveItems(item.children)
            );
          }
        });
      return activeItems;
    }

    componentDidUpdate(prevProps: any) {
      if (this.props.location !== prevProps.location) {
        this.props.updateConfig(this.props.config, 'location-change');
      } else if (this.props.links !== prevProps.links) {
        this.props.updateConfig(this.props.links, 'update');
        this.props.setOriginConfig(this.props.links);
      }

      const currentActiveItems = this.getActiveItems(this.props.config);
      const prevActiveItems = this.getActiveItems(prevProps.config);

      if (!isEqual(currentActiveItems, prevActiveItems)) {
        this.props.dispatchEvent('selected', {avtiveItems: currentActiveItems});
      }
    }

    componentWillUnmount() {
      window.removeEventListener('popstate', this.updateConfig, false);
    }

    updateConfig = () => {
      this.props.updateConfig(this.props.config, 'location-change');
    };

    updateSelectedConfig(key: string) {
      const {originConfig, data} = this.props;
      const label = resolveVariableAndFilter(key, data, '| raw');
      if (!label) {
        return [...originConfig];
      }
      const item = findSelectedLink(originConfig, label);
      let children: Array<Link> = [];
      if (item && item.children) {
        children = children.concat(item.children);
      }

      return children;
    }

    toggleLink(target: Link, forceFold?: boolean) {
      const {config, updateConfig, deferLoad} = this.props;

      if (target.defer && !target.loaded) {
        deferLoad(target);
      } else {
        updateConfig(
          mapTree(config, (link: Link) =>
            target === link
              ? {
                  ...link,
                  unfolded: forceFold ? false : !link.unfolded
                }
              : link
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
            idx.push((idx.pop() as number) + 1);
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

    handleSelect(link: Link) {
      const {onSelect, env, data} = this.props;
      if (onSelect && onSelect(link) === false) {
        return;
      }

      if (
        !link.to &&
        ((link.children && link.children.length) ||
          (link.defer && !link.loaded))
      ) {
        this.toggleLink(link);
        return;
      }

      env?.jumpTo(filter(link.to as string, data), link as any);
    }

    render() {
      const {loading, config, deferLoad, updateConfig, ...rest} = this.props;
      return (
        <ThemedNavigation
          {...rest}
          loading={loading}
          links={config || []}
          disabled={loading}
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
    if (actionType === 'updateItems') {
      let children: Array<Link> = [];
      if (args.value) {
        if (Array.isArray(args.value)) {
          // 只展示触发项的children属性
          args.value.forEach((item: Link) => {
            if (item.children) {
              children = children.concat(item.children);
            }
          });
        } else if (typeof args.value === 'string') {
          children = this.navRef.updateSelectedConfig(args.value);
          if (children.length > 0) {
            const {env, data} = this.props;
            env?.jumpTo(filter(children[0].to as string, data));
          }
        }
      }

      this.remoteRef?.setConfig(children);
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
    const {...rest} = this.props;
    return (
      <ConditionBuilderWithRemoteOptions
        {...rest}
        onRef={this.getRef}
        reload={this.reload}
        remoteConfigRef={this.remoteConfigRef}
      />
    );
  }
}
