import React from 'react';
import {findDOMNode} from 'react-dom';
import {Renderer, RendererEnv, RendererProps} from '../factory';
import getExprProperties from '../utils/filter-schema';
import {filter, evalExpression} from '../utils/tpl';
import {
  guid,
  autobind,
  createObject,
  findTree,
  isUnfolded,
  mapTree,
  someTree,
  spliceTree,
  findTreeIndex
} from '../utils/helper';
import {ScopedContext, IScopedContext} from '../Scoped';
import {themeable, ThemeProps} from '../theme';
import {Icon} from '../components/icons';
import {BaseSchema, SchemaApi, SchemaIcon, SchemaUrlPath, SchemaCollection} from '../Schema';
import {generateIcon} from '../utils/icon';
import {
  RemoteOptionsProps,
  withRemoteConfig
} from '../components/WithRemoteConfig';
import {Payload} from '../types';
import Spinner from '../components/Spinner';
import {isEffectiveApi} from '../utils/api';
import {Badge, BadgeSchema} from '../components/Badge';

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
   itemBadge?: BadgeSchema;

  /**
   * 仅允许同层级拖拽
   */
   dragOnSameLevel?: boolean;
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
  itemBadge?: BadgeSchema;
}
export interface Links extends Array<Link> {}

export interface NavigationState {
  links?: Links;
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
  extends ThemeProps,
    Omit<NavSchema, 'type' | 'className'> {
  onSelect?: (item: Link) => void | false;
  onToggle?: (item: Link, forceFold?: boolean) => void;
  onDragUpdate?: (dropInfo: IDropInfo) => void;
  togglerClassName?: string;
  links?: Array<Link>;
  loading?: boolean;
  render: RendererProps['render'];
  env: RendererEnv;
  data: Object;
  reload?: any;
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
  static defaultProps = {
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
    this.props.onSelect?.(link);
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
    const deltaX = left + width * .2;
    let position;
    if (clientY >= top + height / 2 ) {
      position = 'bottom';
    } else {
      position = 'top';
    }
    if (!dragOnSameLevel && position === 'bottom' && clientX >= this.startPoint.x + deltaX) {
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
    if (dragOnSameLevel
      && this.dragNode?.node.parentElement !== target.parentElement?.parentElement
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
          opacity: .2
        }
      });
    } else {
      this.setState({
        dropIndicator: {
          top: (position === 'bottom' ? rect.top + rect.height : rect.top) - ul.getBoundingClientRect().top,
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
    const isActive: boolean = !!link.active;
    const {
      disabled,
      togglerClassName,
      classnames: cx,
      indentSize,
      render,
      itemActions,
      draggable,
      links,
      itemBadge,
      data: defaultData
    } = this.props;
    const hasSub =
      (link.defer && !link.loaded) || (link.children && link.children.length);
    return (
      <li
        key={link.__id}
        data-id={link.__id}
        className={cx('Nav-item', link.className, {
          'is-disabled': disabled || link.disabled || link.loading,
          'is-active': isActive,
          'is-unfolded': link.unfolded,
          'has-sub': hasSub
        })}
        onDragStart={this.handleDragStart(link)}
      >
        <Badge classnames={cx} badge={itemBadge} data={createObject(defaultData, link)}>
          <a
            data-id={link.__id}
            data-depth={depth}
            onClick={this.handleClick.bind(this, link)}
            style={{paddingLeft: depth * (parseInt(indentSize as any, 10) ?? 24)}}
          >
            {!disabled && draggable && links && links.length > 1 ? (
            <div className={cx('Nav-itemDrager')}
              draggable
              onMouseDown={e => {this.toggleLink(link, true); e.stopPropagation()}}
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
            ) : hasSub ? (
              <span
                onClick={() => this.toggleLink(link)}
                className={cx('Nav-itemToggler', togglerClassName)}
              >
                <Icon icon="caret" className="icon" />
              </span>
            ) : null}
            {generateIcon(cx, link.icon, 'Nav-itemIcon')}
            {
              link.label && (typeof link.label === 'string'
              ? link.label
              : render('inline', link.label as SchemaCollection))
            }
          </a>
          {
            // 更多操作
            itemActions
            ? <div className={cx('Nav-item-atcions')}>
              {
                render('inline', itemActions, {data: createObject(defaultData, link)})
              }
            </div> : null
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

  render(): JSX.Element {
    const {className, stacked, classnames: cx, links, loading} = this.props;
    const {dropIndicator} = this.state;
    return (
      <div className={cx('Nav')}>
        <ul className={cx('Nav-list', className, stacked ? 'Nav-list--stacked' : 'Nav-list--tabs')}>
          {Array.isArray(links)
            ? links.map((item, index) => this.renderItem(item, index))
            : null}

          <Spinner show={!!loading} overlay icon="reload" />
        </ul>
        {(dropIndicator
          ? <div className={cx('Nav-dropIndicator')} style={dropIndicator} />
          : null
        )}
      </div>
    );
  }
}

const ThemedNavigation = themeable(Navigation);

const ConditionBuilderWithRemoteOptions = withRemoteConfig({
  adaptor: (config: any, props: any) => {
    const links = Array.isArray(config)
      ? config
      : config.links || config.options || config.items || config.rows;

    if (!Array.isArray(links)) {
      throw new Error('payload.data.options is not array.');
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
      const {data, env, unfoldedField, foldedField} = props;

      links = mapTree(
        links,
        (link: Link) => {
          const item: any = {
            ...link,
            ...getExprProperties(link, data as object),
            active:
              (motivation !== 'location-change' && link.active) ||
              (link.activeOn
                ? evalExpression(link.activeOn as string, data)
                : !!(
                    link.hasOwnProperty('to') &&
                    env &&
                    env.isCurrentUrl(filter(link.to as string, data))
                  )),
            __id: guid()
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
    }

    componentDidMount() {
      if (Array.isArray(this.props.links)) {
        this.props.updateConfig(this.props.links, 'mount');
      }
    }

    componentDidUpdate(prevProps: any) {
      if (this.props.location !== prevProps.location) {
        this.props.updateConfig(this.props.config, 'location-change');
      } else if (this.props.links !== prevProps.links) {
        this.props.updateConfig(this.props.links, 'update');
      }
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
        const sourceIdx = findTreeIndex(links, link => link.__id === dragLink.__id) as number[];
        links = spliceTree(links, sourceIdx, 1);

        if (position === 'self') {
          // 插入到对应节点的children中
          mapTree(links, (link) => {
            if (link.__id === nodeId) {
              if (!link.children) {
                link.children = [];
              }
              link.children.push(dragLink);
            }
            return link;
          })
        } else {
          // 找到需要插入的节点
          const idx = findTreeIndex(links, link => link.__id === nodeId) as number[];
          // 插入节点之后
          if (position === 'bottom') {
            idx.push(idx.pop() as number + 1);
          }
          links = spliceTree(links, idx, 0, dragLink);
        }
      }
      this.props.updateConfig(links, 'update');
      await this.saveOrder(mapTree(links, (link: Link) => {
        // 清除内部加的字段
        for (let key in link) {
          if (/^__.*$/.test(key)) {
            delete link[key];
          }
        }
        return link;
      }));
    }

    async saveOrder(links: Links) {
      const {saveOrderApi, env, data, reload} = this.props;
      if (saveOrderApi && isEffectiveApi(saveOrderApi)) {
        await env.fetcher(saveOrderApi as SchemaApi,
          createObject(data, {data: links}),
          {method: 'post'}
        );
        reload();
      } else {
        env.alert('NAV saveOrderApi is required!');
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
          links={config || rest.links || []}
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

  constructor(props: RendererProps, context: IScopedContext) {
    super(props);

    const scoped = context;
    scoped.registerComponent(this);
  }

  componentWillUnmount() {
    const scoped = this.context as IScopedContext;
    scoped.unRegisterComponent(this);
  }

  @autobind
  reload(target?: string, query?: any, values?: object) {
    if (query) {
      return this.receive(query);
    }

    const {data, env, source, translate: __} = this.props;
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
        reload={this.reload}
        remoteConfigRef={this.remoteConfigRef}
      />
    );
  }
}
