import React from 'react';
import {Renderer, RendererEnv, RendererProps} from '../factory';
import getExprProperties from '../utils/filter-schema';
import {filter, evalExpression} from '../utils/tpl';
import {
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
  render: RendererProps['render']
}

export class Navigation extends React.Component<
  NavigationProps,
  NavigationState
> {
  static defaultProps = {
    indentSize: 24
  };

  @autobind
  handleClick(link: Link) {
    this.props.onSelect?.(link);
  }

  @autobind
  toggleLink(target: Link) {
    this.props.onToggle?.(target);
  }

  renderItem(link: Link, index: number, depth = 1) {
    if (link.hidden === true || link.visible === false) {
      return null;
    }
    const isActive: boolean = !!link.active;
    const {disabled, togglerClassName, classnames: cx, indentSize} = this.props;
    const hasSub =
      (link.defer && !link.loaded) || (link.children && link.children.length);

    return (
      <li
        key={index}
        className={cx('Nav-item', link.className, {
          'is-disabled': disabled || link.disabled || link.loading,
          'is-active': isActive,
          'is-unfolded': link.unfolded,
          'has-sub': hasSub
        })}
      >
        <a
          onClick={this.handleClick.bind(this, link)}
          style={{paddingLeft: depth * (parseInt(indentSize as any, 10) ?? 24)}}
        >
          {generateIcon(cx, link.icon, 'Nav-itemIcon')}
          {
            link.label && (typeof link.label === 'string'
            ? link.label
            : this.props.render('inline', link.label as SchemaCollection))
          }
        </a>

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

        {Array.isArray(link.children) && link.children.length ? (
          <ul className={cx('Nav-subItems')}>
            {link.children.map((link, index) =>
              this.renderItem(link, index, depth + 1)
            )}
          </ul>
        ) : null}
      </li>
    );
  }

  render(): JSX.Element {
    const {className, stacked, classnames: cx, links, loading} = this.props;

    return (
      <ul
        className={cx('Nav', className, stacked ? 'Nav--stacked' : 'Nav--tabs')}
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
        remoteConfigRef={this.remoteConfigRef}
      />
    );
  }
}
