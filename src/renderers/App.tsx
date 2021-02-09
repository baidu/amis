import React from 'react';
import {AsideNav, Html, NotFound, Spinner} from '../components';
import Button from '../components/Button';
import Layout from '../components/Layout';
import {Renderer, RendererProps} from '../factory';
import {
  BaseSchema,
  SchemaApi,
  SchemaClassName,
  SchemaCollection
} from '../Schema';
import {IScopedContext, ScopedContext} from '../Scoped';
import {AppStore, IAppStore} from '../store/app';
import {Api, SchemaNode} from '../types';
import {isApiOutdated, isEffectiveApi} from '../utils/api';
import {autobind} from '../utils/helper';
import {generateIcon} from '../utils/icon';

export interface AppPage {
  /**
   * 菜单文字
   */
  label?: string;

  /**
   * 菜单图标，比如： fa fa-file
   */
  icon?: string;

  /**
   * 路由规则。比如：/banner/:id。当地址以 / 打头，则不继承上层的路径，否则将集成父级页面的路径。
   */
  url?: string;

  /**
   * 当match url 时跳转到目标地址.没有配置 schema 和 shcemaApi  时有效.
   */
  redirect?: string;

  /**
   * 当match url 转成渲染目标地址的页面.没有配置 schema 和 shcemaApi  时有效.
   */
  rewrite?: string;

  /**
   * 不要出现多个，如果出现多个只有第一个有用。在路由找不到的时候作为默认页面。
   */
  isDefaultPage?: boolean;

  /**
   * 二选一，如果配置了 url 一定要配置。否则不知道如何渲染。
   */
  schema?: any;
  schemaApi?: any;

  /**
   * 单纯的地址。可以设置外部链接。
   */
  link?: string;

  /**
   * 支持多层级。
   */
  children?: Array<AppPage>;

  /**
   * 菜单上的类名
   */
  className?: SchemaClassName;

  /**
   * 是否在导航中可见，适合于那种需要携带参数才显示的页面。比如具体某个数据的编辑页面。
   */
  visible?: boolean;

  /**
   * 默认是自动，即：自己选中或者有孩子节点选中则展开。
   * 如果配置成 always 或者配置成 true 则永远展开。
   * 如果配置成 false 则永远不展开。
   */
  // expanded?: 'auto' | 'always' | boolean;
}

/**
 * App 渲染器，适合 JSSDK 用来做多页渲染。
 * 文档：https://baidu.gitee.io/amis/docs/components/app
 */
export interface AppSchema extends BaseSchema {
  /**
   * 指定为 app 类型。
   */
  type: 'app';

  api?: SchemaApi;

  /**
   * 系统名称
   */
  brandName?: string;

  /**
   * logo 图片地址，可以是 svg。
   */
  logo?: string;

  /**
   * 顶部区域
   */
  header?: SchemaCollection;

  /**
   * 边栏菜单前面的区域
   */
  asideBefore?: SchemaCollection;

  /**
   * 边栏菜单后面的区域
   */
  asideAfter?: SchemaCollection;

  /**
   * 页面集合。
   */
  pages?: Array<AppPage> | AppPage;

  /**
   * 底部区域。
   */
  footer?: SchemaCollection;

  /**
   * css 类名。
   */
  className?: SchemaClassName;
}

export interface AppProps
  extends RendererProps,
    Omit<AppSchema, 'type' | 'className'> {
  children?: JSX.Element | ((props?: any) => JSX.Element);
  store: IAppStore;
}

export default class App extends React.Component<AppProps, object> {
  static propsList: Array<string> = [
    'brandName',
    'logo',
    'header',
    'asideBefore',
    'asideAfter',
    'pages',
    'footer'
  ];
  static defaultProps = {};
  unWatchRouteChange?: () => void;

  constructor(props: AppProps) {
    super(props);

    const store = props.store;
    store.syncProps(props, undefined, ['pages']);
    store.updateActivePage(props.env);

    if (props.env.watchRouteChange) {
      this.unWatchRouteChange = props.env.watchRouteChange(() =>
        store.updateActivePage(props.env)
      );
    }
  }

  async componentDidMount() {
    this.reload();
  }

  async componentDidUpdate(prevProps: AppProps) {
    const props = this.props;
    const store = props.store;

    store.syncProps(props, prevProps, ['pages']);

    if (isApiOutdated(prevProps.api, props.api, prevProps.data, props.data)) {
      this.reload();
    } else if (props.location && props.location !== prevProps.location) {
      store.updateActivePage(props.env);
    }
  }

  componentWillUnmount() {
    this.unWatchRouteChange?.();
  }

  async reload(subpath?: any, query?: any, ctx?: any, silent?: boolean) {
    if (query) {
      return this.receive(query);
    }

    const {api, store, env} = this.props;

    if (isEffectiveApi(api, store.data)) {
      const json = await store.fetchInitData(api, store.data, {});
      if (json?.data.pages) {
        store.setPages(json.data.pages);
        store.updateActivePage(env);
      }
    }
  }

  receive(values: object) {
    const {store} = this.props;

    store.updateData(values);
    this.reload();
  }

  @autobind
  handleNavClick(e: React.MouseEvent) {
    e.preventDefault();

    const env = this.props.env;
    const link = e.currentTarget.getAttribute('href')!;
    env.jumpTo(link);
  }

  renderHeader() {
    const {classnames: cx, brandName, header, render, store, logo} = this.props;

    return (
      <>
        <div className={cx('Layout-brandBar')}>
          <div
            onClick={store.toggleOffScreen}
            className={cx('Layout-offScreenBtn')}
          >
            <i className="bui-icon iconfont icon-collapse"></i>
          </div>

          <div className={cx('Layout-brand')}>
            {logo && ~logo.indexOf('<svg') ? (
              <Html className={cx('AppLogo-html')} html={logo} />
            ) : logo ? (
              <img className={cx('AppLogo')} src={logo} />
            ) : (
              <i className="fa fa-paw" />
            )}
            <span className="hidden-folded m-l-sm">{brandName}</span>
          </div>
        </div>

        <div className={cx('Layout-headerBar')}>
          <a
            onClick={store.toggleFolded}
            type="button"
            className={cx('AppFoldBtn')}
          >
            <i
              className={`fa fa-${store.folded ? 'indent' : 'dedent'} fa-fw`}
            ></i>
          </a>
          {header ? render('header', header) : null}
        </div>
      </>
    );
  }

  renderAside() {
    const {store, env, asideBefore, asideAfter, render} = this.props;

    return (
      <>
        {asideBefore ? render('aside-before', asideBefore) : null}
        <AsideNav
          navigations={store.navigations}
          renderLink={(
            {link, active, toggleExpand, classnames: cx, depth, subHeader}: any,
            key: any
          ) => {
            let children = [];

            if (link.visible === false) {
              return null;
            }

            if (!subHeader && link.children && link.children.length) {
              children.push(
                <span
                  key="expand-toggle"
                  className={cx('AsideNav-itemArrow')}
                  onClick={e => toggleExpand(link, e)}
                ></span>
              );
            }

            link.badge &&
              children.push(
                <b
                  key="badge"
                  className={cx(
                    `AsideNav-itemBadge`,
                    link.badgeClassName || 'bg-info'
                  )}
                >
                  {link.badge}
                </b>
              );

            if (!subHeader && link.icon) {
              children.push(generateIcon(cx, link.icon, 'AsideNav-itemIcon'));
            } else if (store.folded && depth === 1 && !subHeader) {
              children.push(
                <i
                  key="icon"
                  className={cx(
                    `AsideNav-itemIcon`,
                    link.children ? 'fa fa-folder' : 'fa fa-info'
                  )}
                />
              );
            }

            children.push(
              <span className={cx('AsideNav-itemLabel')} key="label">
                {link.label}
              </span>
            );

            return link.path ? (
              /^https?\:/.test(link.path) ? (
                <a target="_blank" href={link.path} rel="noopener">
                  {children}
                </a>
              ) : (
                <a
                  onClick={this.handleNavClick}
                  href={link.path || (link.children && link.children[0].path)}
                >
                  {children}
                </a>
              )
            ) : (
              <a onClick={link.children ? () => toggleExpand(link) : undefined}>
                {children}
              </a>
            );
          }}
          isActive={(link: any) => !!env.isCurrentUrl(link?.path, link)}
        />
        {asideAfter ? render('aside-before', asideAfter) : null}
      </>
    );
  }

  renderFooter() {
    const {render, footer} = this.props;
    return footer ? render('footer', footer) : null;
  }

  render() {
    const {className, size, classnames: cx, store, render} = this.props;

    return (
      <Layout
        header={this.renderHeader()}
        aside={this.renderAside()}
        footer={this.renderFooter()}
        folded={store.folded}
        offScreen={store.offScreen}
      >
        {store.activePage && store.schema ? (
          <>
            {store.bcn.length ? (
              <ul className={cx('AppBcn')}>
                {store.bcn.map((item: any, index: number) => {
                  return (
                    <li key={index} className={cx('AppBcn-item')}>
                      {item.path ? (
                        <a href={item.path} onClick={this.handleNavClick}>
                          {item.label}
                        </a>
                      ) : (
                        item.label
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : null}

            {render('page', store.schema, {
              key: store.activePage?.id,
              data: store.pageData
            })}
          </>
        ) : store.pages && !store.activePage ? (
          <NotFound>
            <div className="text-center">页面不存在</div>
          </NotFound>
        ) : null}
        <Spinner overlay show={store.loading || !store.pages} size="lg" />
      </Layout>
    );
  }
}

@Renderer({
  test: /(^|\/)app$/,
  name: 'app',
  storeType: AppStore.name
})
export class AppRenderer extends App {
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
