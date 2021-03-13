import React from 'react';
import PropTypes from 'prop-types';
import {Renderer, RendererProps} from '../factory';
import {ServiceStore, IServiceStore} from '../store/service';
import cx from 'classnames';
import getExprProperties from '../utils/filter-schema';
import {filter, evalExpression} from '../utils/tpl';
import {createObject, mapTree, someTree} from '../utils/helper';
import {resolveVariable, isPureVariable} from '../utils/tpl-builtin';
import {isApiOutdated, isEffectiveApi} from '../utils/api';
import {ScopedContext, IScopedContext} from '../Scoped';
import {Api} from '../types';
import {ClassNamesFn, themeable, ThemeProps} from '../theme';
import {Icon} from '../components/icons';
import {BaseSchema, SchemaApi, SchemaIcon, SchemaUrlPath} from '../Schema';
import {generateIcon} from '../utils/icon';

export type NavItemSchema = {
  /**
   * 文字说明
   */
  label?: string;

  /**
   * 图标类名，参考 fontawesome 4。
   */
  icon?: SchemaIcon;

  to?: SchemaUrlPath;

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
   * 可以通过 API 拉取。
   */
  source?: SchemaApi;

  /**
   * true 为垂直排列，false 为水平排列类似如 tabs。
   */
  stacked?: boolean;
}

export interface Link {
  className?: string;
  label?: string;
  to?: string;
  icon?: string;
  active?: boolean;
  activeOn?: string;
  unfolded?: boolean;
  children?: Links;
  [propName: string]: any;
}
export interface Links extends Array<Link> {}

export interface NavigationState {
  links: Links;
  error?: string;
}

export interface NavigationProps
  extends RendererProps,
    Omit<ThemeProps, 'className'>,
    Omit<NavSchema, 'type' | 'className'> {
  onSelect?: (item: Link) => any;
}

export class Navigation extends React.Component<
  NavigationProps,
  NavigationState
> {
  static defaultProps: Partial<NavigationProps> = {};

  mounted: boolean = true;
  constructor(props: NavigationProps) {
    super(props);

    this.renderItem = this.renderItem.bind(this);

    this.state = {
      links: this.syncLinks(
        props,
        (props.source &&
          typeof props.source === 'string' &&
          isPureVariable(props.source) &&
          resolveVariable(props.source, props.data)) ||
          props.links
      )
    };
  }

  componentDidMount() {
    const {source} = this.props;

    if (source && !isPureVariable(source as string)) {
      this.reload();
    }
  }

  componentWillReceiveProps(nextProps: NavigationProps) {
    const props = this.props;

    if (nextProps.source && isPureVariable(nextProps.source as string)) {
      if (nextProps.source !== props.source) {
        this.setState({
          links: this.syncLinks(nextProps)
        });
      } else {
        const links = resolveVariable(
          nextProps.source as string,
          nextProps.data
        );
        const prevLinks = resolveVariable(props.source as string, props.data);

        if (links !== prevLinks) {
          this.setState({
            links: this.syncLinks(nextProps, links)
          });
        }
      }
    } else if (props.links !== nextProps.links) {
      this.setState({
        links: this.syncLinks(nextProps)
      });
    } else if (nextProps.location && props.location !== nextProps.location) {
      this.setState({
        links: this.syncLinks(nextProps, this.state.links, true)
      });
    }
  }

  componentDidUpdate(prevProps: NavigationProps) {
    const props = this.props;

    if (props.source && !isPureVariable(props.source as string)) {
      isApiOutdated(
        prevProps.source,
        props.source,
        prevProps.data,
        props.data
      ) && this.reload();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  reload(target?: string, query?: any, values?: object) {
    if (query) {
      return this.receive(query);
    }

    const {data, env, source, translate: __} = this.props;
    const finalData = values ? createObject(data, values) : data;

    if (!isEffectiveApi(source, data)) {
      return;
    }

    env
      .fetcher(source as Api, finalData)
      .then(payload => {
        if (!this.mounted) {
          return;
        }

        if (!payload.ok) {
          this.setState({
            error: payload.msg || __('Nav.sourceError')
          });
        } else {
          const links = Array.isArray(payload.data)
            ? payload.data
            : payload.data.links ||
              payload.data.options ||
              payload.data.items ||
              payload.data.rows;

          if (!Array.isArray(links)) {
            throw new Error('payload.data.options is not array.');
          }

          this.setState(
            {
              links: this.syncLinks(this.props, links)
            },
            () => {
              if (
                payload.data &&
                payload.data.value &&
                !someTree(this.state.links, (item: any) => item.active)
              ) {
                env.jumpTo(filter(payload.data.value as string, data));
              }
            }
          );
        }
      })
      .catch(
        e =>
          this.mounted &&
          this.setState({
            error: e.message
          })
      );
  }

  receive(values: object) {
    const {store, initApi} = this.props;

    this.reload(undefined, undefined, values);
  }

  syncLinks(
    props: NavigationProps,
    links = props.links,
    clearActive?: boolean
  ): Links {
    const {data, env} = props;

    if (!Array.isArray(links) || !links.length) {
      return [];
    }

    return mapTree(
      links,
      (link: Link) => {
        return {
          ...link,
          ...getExprProperties(link, data as object),
          active:
            (!clearActive && link.active) ||
            (link.activeOn
              ? evalExpression(link.activeOn as string, data)
              : !!(
                  link.hasOwnProperty('to') &&
                  env &&
                  env.isCurrentUrl(filter(link.to as string, data))
                )),
          unfolded:
            link.unfolded ||
            (link.children && link.children.some(link => !!link.active))
        };
      },
      1,
      true
    );
  }

  handleClick(link: {
    label?: string;
    to?: string;
    icon?: string;
    children?: Links;
  }) {
    const {env, data, onSelect} = this.props;

    if (onSelect && onSelect(link) === false) {
      return;
    }

    if (!link.to) {
      link.children && link.children.length && this.toggleLink(link);
      return;
    }

    env && env.jumpTo(filter(link.to as string, data), link as any);
  }

  toggleLink(target: Link) {
    this.setState({
      links: mapTree(this.state.links, (link: Link) =>
        target === link
          ? {
              ...link,
              unfolded: !link.unfolded
            }
          : link
      )
    });
  }

  renderItem(link: Link, index: number) {
    if (link.hidden === true || link.visible === false) {
      return null;
    }
    const isActive: boolean = !!link.active;
    const {disabled, togglerClassName, classnames: cx} = this.props;

    return (
      <li
        key={index}
        className={cx('Nav-item', link.className, {
          'is-disabled': disabled || link.disabled,
          'is-active': isActive,
          'is-unfolded': link.unfolded
        })}
      >
        <a onClick={this.handleClick.bind(this, link)}>
          {generateIcon(cx, link.icon, 'Nav-itemIcon')}
          {link.label}
        </a>

        {link.children && link.children.length ? (
          <span
            onClick={() => this.toggleLink(link)}
            className={cx('Nav-itemToggler', togglerClassName)}
          >
            <Icon icon="caret" className="icon" />
          </span>
        ) : null}

        {link.children && link.children.length ? (
          <ul className={cx('Nav-subItems')}>
            {link.children.map((link, index) => this.renderItem(link, index))}
          </ul>
        ) : null}
      </li>
    );
  }

  render(): JSX.Element {
    const {className, stacked, classnames: cx} = this.props;

    const links = this.state.links;

    return (
      <ul
        className={cx('Nav', className, stacked ? 'Nav--stacked' : 'Nav--tabs')}
      >
        {links.map(this.renderItem)}
      </ul>
    );
  }
}

export default themeable(Navigation);

@Renderer({
  test: /(^|\/)(?:nav|navigation)$/,
  name: 'nav'
})
export class NavigationRenderer extends Navigation {
  static contextType = ScopedContext;

  componentWillMount() {
    const scoped = this.context as IScopedContext;
    scoped.registerComponent(this);
  }

  componentWillUnmount() {
    const scoped = this.context as IScopedContext;
    scoped.unRegisterComponent(this);
    super.componentWillUnmount();
  }
}
