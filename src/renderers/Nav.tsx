import React from 'react';
import Sortable from 'sortablejs';
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
  spliceTree
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
import cloneDeep from 'lodash/cloneDeep';
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

  /**
   * 角标
   */
  badge?: BadgeSchema
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
   badge?: BadgeSchema;
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
  badge?: BadgeSchema
}
export interface Links extends Array<Link> {}

export interface NavigationState {
  links: Links;
  error?: string;
}

export interface NavigationProps
  extends ThemeProps,
    Omit<NavSchema, 'type' | 'className'> {
  onSelect?: (item: Link) => void | false;
  onToggle?: (item: Link) => void;
  togglerClassName?: string;
  links?: Array<Link>;
  loading?: boolean;
  render: RendererProps['render'];
  env: RendererEnv;
  reload?: any;
}

export class Navigation extends React.Component<
  NavigationProps,
  NavigationState
> {
  static defaultProps = {
    indentSize: 24
  };
  sortable: Sortable[] = [];
  id: string;
  dragRef?: HTMLElement;

  @autobind
  handleClick(link: Link) {
    this.props.onSelect?.(link);
  }

  @autobind
  toggleLink(target: Link) {
    this.props.onToggle?.(target);
  }

  @autobind
  dragRefFn(ref: any) {
    const {draggable} = this.props;
    if (ref && draggable) {
      this.id = guid();
      this.initDragging(ref);
    }
  }

  initDragging(ref: HTMLElement) {
    const ns = this.props.classPrefix;
    this.sortable.push(new Sortable(
      ref,
      {
        group: `nav-${this.id}`,
        animation: 150,
        handle: `.${ns}Nav-itemDrager`,
        ghostClass: `${ns}Nav-item--dragging`,
        onEnd: async (e: any) => {
          // 没有移动
          if (e.newIndex === e.oldIndex) {
            return;
          }
          const id = e.item.getAttribute('data-id');
          const parentNode = e.to
          if (
            e.newIndex < e.oldIndex &&
            e.oldIndex < parentNode.childNodes.length - 1
          ) {
            parentNode.insertBefore(e.item, parentNode.childNodes[e.oldIndex + 1]);
          } else if (e.oldIndex < parentNode.childNodes.length - 1) {
            parentNode.insertBefore(e.item, parentNode.childNodes[e.oldIndex]);
          } else {
            parentNode.appendChild(e.item);
          }
          const links = cloneDeep(this.props.links) as Link[];
          let parent = links;
          someTree(links, (item: Link, key, level, paths: Link[]) => {
            if (item.id === id) {
              const len = paths.length - 1;
              parent = (~len ? paths[len].children : links) as Link[];
              return true;
            }
            return false;
          });
          parent.splice(e.newIndex, 0, parent.splice(e.oldIndex, 1)[0]);
          const {saveOrderApi, env} = this.props;
          if (saveOrderApi && isEffectiveApi(saveOrderApi)) {
            await env.fetcher(saveOrderApi as SchemaApi, {data: links}, {method: 'post'});
            this.props.reload();
          } else {
            console.warn('请配置saveOrderApi');
          }
        }
      }
    ));
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
      badge: defaultBadge
    } = this.props;
    const hasSub =
      (link.defer && !link.loaded) || (link.children && link.children.length);
    const id = guid();
    link.id = id;
    const badge = defaultBadge ? Object.assign(defaultBadge, link.badge) : link.badge;
    return (
      <li
        key={index}
        className={cx('Nav-item', link.className, {
          'is-disabled': disabled || link.disabled || link.loading,
          'is-active': isActive,
          'is-unfolded': link.unfolded,
          'has-sub': hasSub
        })}
        data-id={id}
      >
        <Badge classnames={cx} badge={badge} data={link}>
          <a
            onClick={this.handleClick.bind(this, link)}
            style={{paddingLeft: depth * (parseInt(indentSize as any, 10) ?? 24)}}
          >
            {!disabled && draggable && links && links.length > 1 ? (
            <div className={cx('Nav-itemDrager')} >
              <a
                key="drag"
                data-position="bottom"
              >
                <Icon icon="drag-bar" className="icon" />
              </a>
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
                render('inline', itemActions, {data: link})
              }
            </div> : null
          }
          {Array.isArray(link.children) && link.children.length ? (
            <ul className={cx('Nav-subItems')} ref={this.dragRefFn}>
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

    return (
      <ul
        className={cx('Nav', className, stacked ? 'Nav--stacked' : 'Nav--tabs')}
        ref={this.dragRefFn}
      >
        {Array.isArray(links)
          ? links.map((item, index) => this.renderItem(item, index))
          : null}

        <Spinner show={!!loading} overlay icon="reload" />
      </ul>
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
                  ))
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

    toggleLink(target: Link) {
      const {config, updateConfig, deferLoad} = this.props;

      if (target.defer && !target.loaded) {
        deferLoad(target);
      } else {
        updateConfig(
          mapTree(config, (link: Link) =>
            target === link
              ? {
                  ...link,
                  unfolded: !link.unfolded
                }
              : link
          ),
          'toggle'
        );
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
