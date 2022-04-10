import React from 'react';
import NotFound from '../../src/components/404';
import Layout from '../../src/components/Layout';
import AsideNav from '../../src/components/AsideNav';
import {
  AlertComponent,
  Button,
  Drawer,
  Spinner,
  ToastComponent
} from '../../src/components/index';
import {eachTree, mapTree} from '../../src/utils/helper';
import {Icon} from '../../src/components/icons';
import '../../src/locale/en-US';
import {withRouter} from 'react-router';
import Select from '../../src/components/Select';
import InputBox from '../../src/components/InputBox';
import DocSearch from './DocSearch';
import Doc from './Doc';
import DocNavCN from './DocNavCN';
import Example, {examples} from './Example';
import CSSDocs, {cssDocs} from './CssDocs';
import Components, {components} from './Components';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link,
  NavLink
} from 'react-router-dom';
declare const _hmt: any;

let ContextPath = '';

if (process.env.NODE_ENV === 'production') {
  ContextPath = '/amis';
}

export function getContextPath() {
  return ContextPath;
}

const themes = [
  {
    label: '云舍',
    ns: 'cxd-',
    value: 'cxd'
  },
  {
    label: '仿 AntD',
    ns: 'antd-',
    value: 'antd'
  },
  {
    label: 'ang',
    ns: 'a-',
    value: 'ang'
  },
  {
    label: 'Dark',
    ns: 'dark-',
    value: 'dark'
  }
];

const locales = [
  {
    label: '中文',
    value: 'zh-CN'
  },

  {
    label: 'English',
    value: 'en-US'
  }
];

const viewModes = [
  {
    label: '桌面端',
    value: 'pc'
  },

  {
    label: '移动端',
    value: 'mobile'
  }
];

const docVersions = [
  {
    label: '主干版本',
    value: '',
    url: '/zh-CN/docs/index'
  },
  {
    label: '1.1.x 文档',
    value: '1.1.7',
    url: 'https://aisuda.github.io/amis-1.1.7/zh-CN/docs/index'
  }
];

function getPath(path: string) {
  return path
    ? path[0] === '/'
      ? ContextPath + path
      : `${ContextPath}/${path}`
    : '';
}

class BackTop extends React.PureComponent {
  state = {
    show: false
  };

  componentDidMount() {
    document.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = (e: any) => {
    this.setState({
      show: e.target.scrollingElement?.scrollTop > 350
    });
  };

  render() {
    return (
      <div
        className={`Backtop ${this.state.show ? 'visible' : ''}`}
        onClick={() => scrollTo({top: 0})}
      >
        <i className="fa fa-rocket"></i>
      </div>
    );
  }
}
// @ts-ignore
@withRouter // @ts-ignore
export class App extends React.PureComponent<{
  location: Location;
}> {
  state = {
    viewMode: localStorage.getItem('amis-viewMode') || 'pc',
    offScreen: false,
    folded: false,
    headerVisible: true,
    themes: themes,
    theme:
      themes.find(item => item?.value === localStorage.getItem('amis-theme')) ||
      themes[0],
    locale: localStorage.getItem('amis-locale')
      ? localStorage.getItem('amis-locale')?.replace('zh-cn', 'zh-CN')
      : '',
    navigations: [],
    filter: '' // 导航过滤，方便找组件
  };

  constructor(props: any) {
    super(props);
    this.setNavigations = this.setNavigations.bind(this);
    this.setNavigationFilter = this.setNavigationFilter.bind(this);
    document.querySelector('body')?.classList.add(this.state.theme.value);
  }

  componentDidUpdate(preProps: any, preState: any) {
    const props = this.props;

    if (preState.theme.value !== this.state.theme.value) {
      [].slice
        .call(document.querySelectorAll('link[title]'))
        .forEach((item: HTMLLinkElement) => {
          const theme = item.getAttribute('title');
          item.disabled = theme !== this.state.theme.value;
        });
      const body = document.body;
      body.classList.remove(preState.theme.value);
      body.classList.add(this.state.theme.value);
    }

    if (props.location.pathname !== preProps.location.pathname) {
      this.setState(
        {
          offScreen: false
        },
        () => window.scrollTo(0, 0)
      );

      _hmt && _hmt.push(['_trackPageview', props.location.pathname]);
    }
  }

  setNavigations(items: any, resetFilter = true) {
    this.setState({
      navigations: items,
      filter: resetFilter ? '' : this.state.filter
    });
  }

  renderHeader(docPage = true) {
    const location = this.props.location;
    const theme = this.state.theme;

    if (location.pathname === '/edit') {
      return (
        <div id="headerBar" className="box-shadow bg-dark">
          <div className={`${theme.ns}Layout-brand`}>amis 可视化编辑器</div>
        </div>
      );
    }

    return (
      <>
        <div
          className={`${theme.ns}Layout-brandBar ${
            docPage ? 'DocLayout-brandBar' : ''
          }`}
        >
          <div
            onClick={() => this.setState({offScreen: !this.state.offScreen})}
            className={`${theme.ns}Layout-offScreen-btn ${
              docPage ? 'DocLayout-offScreen-btn' : ''
            } pull-right visible-xs`}
          >
            <i className="bui-icon iconfont icon-collapse"></i>
          </div>

          {docPage ? (
            <div
              className={`${theme.ns}Layout-brand  ${
                docPage ? 'DocLayout-brand' : ''
              }`}
            >
              <Link to={`${ContextPath}/docs`}>
                <div className="logo"></div>
              </Link>
            </div>
          ) : (
            <div className={`${theme.ns}Layout-brand text-ellipsis`}>
              <i className="fa fa-paw" />
              <span className="hidden-folded m-l-sm">AMIS 示例</span>
            </div>
          )}
        </div>

        <div
          className={`${theme.ns}Layout-headerBar ${
            docPage ? 'DocLayout-headerBar pc:inline-flex' : 'pc:flex'
          } items-center`}
        >
          {docPage ? null : (
            <Button
              onClick={() => this.setState({folded: !this.state.folded})}
              type="button"
              level="link"
              className="navbar-btn"
            >
              <i
                className={`fa fa-${
                  this.state.folded ? 'indent' : 'dedent'
                } fa-fw`}
              ></i>
            </Button>
          )}

          <ul className={`HeaderLinks`}>
            <NavLink
              to={`${ContextPath}/zh-CN/docs`}
              activeClassName="is-active"
            >
              文档
            </NavLink>

            <NavLink
              to={`${ContextPath}/zh-CN/components`}
              activeClassName="is-active"
            >
              组件
            </NavLink>
            <NavLink
              to={`${ContextPath}/zh-CN/style`}
              activeClassName="is-active"
            >
              样式
            </NavLink>
            <NavLink
              to={`${ContextPath}/examples/index`}
              activeClassName="is-active"
            >
              示例
            </NavLink>
            <a
              href="https://github.com/fex-team/amis-editor-demo"
              target="_blank"
            >
              编辑器
            </a>
            {/* <a href="https://suda.bce.baidu.com" target="_blank">
              爱速搭
            </a> */}
          </ul>

          <div className="hidden-xs ml-auto">
            <Select
              overlayPlacement="right-bottom-right-top"
              clearable={false}
              theme={this.state.theme.value}
              value={this.state.locale || 'zh-CN'}
              options={locales}
              onChange={locale => {
                this.setState({locale: (locale as any).value});
                localStorage.setItem('amis-locale', (locale as any).value);
                window.location.reload();
              }}
            />
          </div>

          <div className="hidden-xs ml-2">
            <Select
              overlayPlacement="right-bottom-right-top"
              clearable={false}
              theme={this.state.theme.value}
              value={this.state.theme}
              options={this.state.themes}
              onChange={theme => {
                this.setState({theme});
                localStorage.setItem('amis-theme', `${(theme as any).value}`);
                document
                  .querySelector('body')
                  ?.classList[
                    (theme as any).value === 'dark' ? 'add' : 'remove'
                  ]('dark');
              }}
            />
          </div>

          <div className="hidden-xs ml-2">
            <Select
              overlayPlacement="right-bottom-right-top"
              clearable={false}
              theme={this.state.theme.value}
              value={this.state.viewMode || 'pc'}
              options={viewModes}
              onChange={viewMode => {
                this.setState({viewMode: (viewMode as any).value});
                localStorage.setItem('amis-viewMode', (viewMode as any).value);
                window.location.reload();
              }}
            />
          </div>

          <div className="hidden-xs ml-2">
            <Select
              overlayPlacement="right-bottom-right-top"
              clearable={false}
              theme={this.state.theme.value}
              value={docVersions[0].value}
              options={docVersions}
              onChange={(doc: any) => {
                if (doc.url && /^https?\:\/\//.test(doc.url)) {
                  window.open(doc.url);
                } else {
                  window.location.href = doc.url;
                }
              }}
            />
          </div>

          <div id="Header-toolbar"></div>
        </div>

        {docPage ? (
          <>
            <div
              className={`${theme.ns}Layout-searchBar ${
                docPage ? 'DocLayout-searchBar' : ''
              } hidden-xs hidden-sm`}
            >
              <DocSearch theme={theme} />
            </div>
            <a
              className="gh-icon"
              href="https://github.com/baidu/amis"
              target="_blank"
            >
              <i className="fa fa-github" />
            </a>
          </>
        ) : null}
      </>
    );
  }

  setNavigationFilter(value: string) {
    this.setState({
      filter: value
    });
  }

  renderNavigation() {
    return (
      <div className="Doc-navigation">
        <InputBox
          theme={this.state.theme.value}
          placeholder={'过滤...'}
          value={this.state.filter || ''}
          onChange={this.setNavigationFilter}
          className="m-b m-r-md"
          clearable={false}
        />
        {this.renderAsideNav()}
      </div>
    );
  }

  renderAsideNav() {
    const filterReg = new RegExp(
      this.state.filter.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&'),
      'i'
    );

    return (
      <AsideNav
        navigations={this.state.navigations.map((item: any) => ({
          ...item,
          children: item.children
            ? item.children
                .filter((item: any) => {
                  if (item.label) {
                    return filterReg.exec(item.label);
                  }
                  return true;
                })
                .map((item: any) => ({
                  ...item,
                  className: 'is-top'
                }))
            : []
        }))}
        renderLink={({
          link,
          active,
          toggleExpand,
          classnames: cx,
          depth
        }: any) => {
          let children = [];

          if (link.children && link.children.length) {
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

          if (link.icon) {
            children.push(
              <i key="icon" className={cx(`AsideNav-itemIcon`, link.icon)} />
            );
          } else if (this.state.folded && depth === 1) {
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
              <Link
                to={
                  getPath(link.path) ||
                  (link.children && getPath(link.children[0].path))
                }
              >
                {children}
              </Link>
            )
          ) : (
            <a onClick={link.children ? () => toggleExpand(link) : undefined}>
              {children}
            </a>
          );
        }}
        isActive={(link: any) => isActive(link, location)}
      />
    );
  }

  renderExamples() {
    const theme = this.state.theme;

    return (
      <Layout
        theme={theme.value}
        offScreen={this.state.offScreen}
        folded={this.state.folded}
        header={this.renderHeader(false)}
        aside={this.renderAsideNav()}
      >
        <ToastComponent theme={theme.value} locale={this.state.locale} />
        <AlertComponent theme={theme.value} locale={this.state.locale} />

        {/* {React.cloneElement(this.props.children as any, {
          key: theme.value,
          ...(this.props.children as any).props,
          setNavigations: this.setNavigations,
          theme: theme.value,
          classPrefix: theme.ns,
          viewMode: this.state.viewMode,
          locale: this.state.locale,
          offScreen: this.state.offScreen,
          ContextPath
        })} */}
        {this.renderContent()}
      </Layout>
    );
  }

  renderContent() {
    const locale = 'zh-CN'; // 暂时不支持切换，因为目前只有中文文档
    const theme = this.state.theme;

    return (
      <React.Suspense
        fallback={<Spinner overlay spinnerClassName="m-t-lg" size="lg" />}
      >
        <Switch>
          <Redirect
            from={`${ContextPath}/`}
            to={`${ContextPath}/${locale}/docs/index`}
            exact
          />

          {/* docs */}
          <Redirect
            from={`${ContextPath}/docs`}
            to={`${ContextPath}/${locale}/docs/index`}
            exact
          />
          <Redirect
            from={`${ContextPath}/docs/index`}
            to={`${ContextPath}/${locale}/docs/index`}
            exact
          />
          <Redirect
            from={`${ContextPath}/docs/*`}
            to={`${ContextPath}/${locale}/docs/*`}
          />
          <Redirect
            from={`${ContextPath}/${locale}/docs`}
            to={`${ContextPath}/${locale}/docs/index`}
            exact
          />

          {/* components */}
          <Redirect
            from={`${ContextPath}/components`}
            to={`${ContextPath}/${locale}/components/page`}
            exact
          />
          <Redirect
            from={`${ContextPath}/components/page`}
            to={`${ContextPath}/${locale}/components/page`}
            exact
          />
          <Redirect
            from={`${ContextPath}/components/*`}
            to={`${ContextPath}/${locale}/components/*`}
            exact
          />
          <Redirect
            from={`${ContextPath}/${locale}/components`}
            to={`${ContextPath}/${locale}/components/page`}
            exact
          />

          {/* expamles */}
          <Redirect
            from={`${ContextPath}/examples`}
            to={`${ContextPath}/examples/index`}
            exact
          />
          <Redirect
            from={`${ContextPath}/${locale}/style`}
            to={`${ContextPath}/${locale}/style/index`}
            exact
          />
          <Route
            path={`${ContextPath}/${locale}/docs`}
            render={(props: any) => (
              <Doc
                {...{
                  setNavigations: this.setNavigations,
                  theme: theme.value,
                  classPrefix: theme.ns,
                  viewMode: this.state.viewMode,
                  locale: this.state.locale,
                  offScreen: this.state.offScreen,
                  ContextPath,
                  showCode: false
                }}
                {...props}
              />
            )}
          />
          <Route
            path={`${ContextPath}/${locale}/components`}
            render={(props: any) => (
              <Components
                {...{
                  setNavigations: this.setNavigations,
                  theme: theme.value,
                  classPrefix: theme.ns,
                  viewMode: this.state.viewMode,
                  locale: this.state.locale,
                  offScreen: this.state.offScreen,
                  ContextPath,
                  showCode: false
                }}
                {...props}
              />
            )}
          />
          <Route
            path={`${ContextPath}/examples`}
            render={(props: any) => (
              <Example
                {...{
                  setNavigations: this.setNavigations,
                  theme: theme.value,
                  classPrefix: theme.ns,
                  viewMode: this.state.viewMode,
                  locale: this.state.locale,
                  offScreen: this.state.offScreen,
                  ContextPath,
                  showCode: false
                }}
                {...props}
              />
            )}
          />
          <Route
            path={`${ContextPath}/${locale}/style`}
            render={(props: any) => (
              <CSSDocs
                {...{
                  setNavigations: this.setNavigations,
                  theme: theme.value,
                  classPrefix: theme.ns,
                  viewMode: this.state.viewMode,
                  locale: this.state.locale,
                  offScreen: this.state.offScreen,
                  ContextPath,
                  showCode: false
                }}
                {...props}
              />
            )}
          />
          <Route
            render={() => (
              <div className="Doc-content">
                <NotFound />
              </div>
            )}
          />
        </Switch>
      </React.Suspense>
    );
  }

  render() {
    const theme = this.state.theme;
    const location = this.props.location;

    if (/examples\/app/.test(location.pathname)) {
      return (
        <>
          <ToastComponent theme={theme.value} locale={this.state.locale} />
          <AlertComponent theme={theme.value} locale={this.state.locale} />
          {/* {React.cloneElement(this.props.children as any, {
            key: theme.value,
            ...(this.props.children as any).props,
            setNavigations: this.setNavigations,
            theme: theme.value,
            classPrefix: theme.ns,
            viewMode: this.state.viewMode,
            locale: this.state.locale,
            offScreen: this.state.offScreen,
            ContextPath,
            showCode: false
          })} */}
          {this.renderContent()}
        </>
      );
    } else if (/examples/.test(location.pathname)) {
      return this.renderExamples();
    }

    return (
      <Layout
        className={':DocLayout'}
        theme={theme.value}
        boxed={true}
        offScreen={this.state.offScreen}
        header={this.state.headerVisible ? this.renderHeader() : null}
        headerClassName={':DocLayout-header'}
      >
        <ToastComponent theme={theme.value} locale={this.state.locale} />
        <AlertComponent theme={theme.value} locale={this.state.locale} />

        <div className="Doc">
          <div className="Doc-nav hidden-xs hidden-sm">
            {this.renderNavigation()}
          </div>

          <Drawer
            size="xs"
            className="Doc-navDrawer"
            overlay
            closeOnOutside
            onHide={() => this.setState({offScreen: false})}
            show={this.state.offScreen}
            position="left"
          >
            <ul className={`HeaderLinks`}>
              <NavLink
                to={`${ContextPath}/zh-CN/docs`}
                activeClassName="is-active"
              >
                文档
              </NavLink>

              <NavLink
                to={`${ContextPath}/zh-CN/components`}
                activeClassName="is-active"
              >
                组件
              </NavLink>
              <NavLink
                to={`${ContextPath}/zh-CN/style`}
                activeClassName="is-active"
              >
                样式
              </NavLink>
            </ul>
            {this.renderNavigation()}
          </Drawer>

          <BackTop />

          {/* {React.cloneElement(this.props.children as any, {
            key: theme.value,
            ...(this.props.children as any).props,
            setNavigations: this.setNavigations,
            theme: theme.value,
            classPrefix: theme.ns,
            viewMode: this.state.viewMode,
            locale: this.state.locale,
            offScreen: this.state.offScreen,
            ContextPath
          })} */}
          {this.renderContent()}
        </div>
      </Layout>
    );
  }
}

function isActive(link: any, location: any) {
  return !!(link.path && getPath(link.path) === location.pathname);
}

export function navigations2route(
  navigations: any,
  additionalProperties?: any
) {
  let routes: any = [];

  navigations.forEach((root: any) => {
    root.children &&
      eachTree(root.children, (item: any) => {
        if (item.path && item.component) {
          routes.push(
            additionalProperties ? (
              <Route
                key={routes.length + 1}
                path={
                  item.path[0] === '/'
                    ? ContextPath + item.path
                    : `${ContextPath}/${item.path}`
                }
                render={(props: any) => (
                  <item.component {...additionalProperties} {...props} />
                )}
              />
            ) : (
              <Route
                key={routes.length + 1}
                path={
                  item.path[0] === '/'
                    ? ContextPath + item.path
                    : `${ContextPath}/${item.path}`
                }
                component={item.component}
              />
            )
          );
        }
      });
  });

  return routes;
}

export default function entry() {
  // PathPrefix = pathPrefix || DocPathPrefix;

  return (
    <Router>
      <Switch>
        <Route component={App}></Route>
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}
