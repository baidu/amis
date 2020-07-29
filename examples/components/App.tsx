import React from 'react';
import NotFound from '../../src/components/404';
import Layout from '../../src/components/Layout';
import AsideNav from '../../src/components/AsideNav';
import {AlertComponent, ToastComponent} from '../../src/components/index';
import {mapTree} from '../../src/utils/helper';
import {Icon} from '../../src/components/icons';
import '../../src/locale/en';
import {
  Router,
  Route,
  IndexRoute,
  browserHistory,
  hashHistory,
  Link,
  Redirect,
  withRouter
} from 'react-router';
import Select from '../../src/components/Select';
import DocSearch from './DocSearch';
import {groupBy} from 'lodash';
import classnames from 'classnames';
import Doc, {docs} from './Doc';
import Example, {examples} from './Example';

let PathPrefix = '/examples';
let ContextPath = '';

if (process.env.NODE_ENV === 'production') {
  PathPrefix = '';
  ContextPath = '/amis';
}

const themes = [
  {
    label: '默认主题',
    ns: 'a-',
    value: 'default'
  },

  {
    label: '百度云舍',
    ns: 'cxd-',
    value: 'cxd'
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
    value: 'zh-cn'
  },

  {
    label: 'English',
    value: 'en'
  }
];

@withRouter
export class App extends React.PureComponent {
  state = {
    asideFolded: localStorage.getItem('asideFolded') === 'true',
    offScreen: false,
    headerVisible: true,
    themeIndex: 0,
    themes: themes,
    theme: themes[localStorage.getItem('themeIndex') || 0],
    locale: localStorage.getItem('locale') || '',
    navigations: [],
    scrollTop: 0
  };

  constructor(props) {
    super(props);

    this.toggleAside = this.toggleAside.bind(this);
    this.setAsideFolded = this.setAsideFolded.bind(this);
    this.setHeaderVisible = this.setHeaderVisible.bind(this);
    this.setNavigations = this.setNavigations.bind(this);
  }

  componentDidMount() {
    if (this.state.theme.value !== 'default') {
      document.querySelectorAll('link[title]').forEach(item => {
        item.disabled = true;
      });
      document.querySelector(
        `link[title=${this.state.theme.value}]`
      ).disabled = false;
    }
    document.addEventListener('scroll', this.handleScroll.bind(this));
  }

  componentDidUpdate(preProps, preState) {
    const props = this.props;

    if (preState.theme.value !== this.state.theme.value) {
      document.querySelector(
        `link[title=${preState.theme.value}]`
      ).disabled = true;
      document.querySelector(
        `link[title=${this.state.theme.value}]`
      ).disabled = false;
    }

    if (props.location.pathname !== preProps.location.pathname) {
      this.setState(
        {
          offScreen: false
        },
        () => window.scrollTo(0, 0)
      );

      const pageURL = props.location.pathname;
      _hmt && _hmt.push(['_trackPageview', pageURL]);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.handleScroll.bind(this));
  }

  handleScroll(e) {
    this.setState({
      scrollTop: e.target.scrollingElement.scrollTop
    });
  }

  toggleAside() {
    this.setAsideFolded(!this.state.asideFolded);
  }

  setAsideFolded(folded = false) {
    localStorage.setItem('asideFolded', JSON.stringify(folded));
    this.setState({
      asideFolded: folded
    });
  }

  setHeaderVisible(visible = false) {
    this.setState({
      headerVisible: visible
    });
  }

  renderAside() {
    return (
      <AsideNav
        renderLink={() => {
          return null;
        }}
      />
    );
  }

  setNavigations(items) {
    this.setState({
      navigations: items
    });
  }

  toggleOpen(e, item) {
    e.stopPropagation();
    e.preventDefault();

    const navigations = mapTree(this.state.navigations, i => {
      const defaultOpen =
        i.isOpen ??
        (Array.isArray(i.children) &&
          i.children.length &&
          !!~i.children.findIndex(item => item.path === location.pathname));
      return {
        ...i,
        isOpen: item.label === i.label ? !defaultOpen : defaultOpen
      };
    });

    this.setState({
      navigations
    });
  }

  renderHeader() {
    const location = this.props.location;
    const theme = this.state.theme;

    if (location.pathname === '/edit') {
      return (
        <div id="headerBar" className="box-shadow bg-dark">
          <div className={`${theme.ns}Layout-brand`}>AMis 可视化编辑器</div>
        </div>
      );
    }

    return (
      <>
        <div className={`${theme.ns}Layout-brandBar`}>
          <button
            onClick={() => this.setState({offScreen: !this.state.offScreen})}
            className="pull-right visible-xs"
          >
            <i className="glyphicon glyphicon-align-justify" />
          </button>

          <div className={`${theme.ns}Layout-brand`}>
            <i className="fa fa-paw" />
            <span className="hidden-folded m-l-sm">AMIS</span>
          </div>
        </div>

        <div className={`${theme.ns}Layout-headerBar`}>
          <ul className={`${theme.ns}Layout-headerBar-links pull-left`}>
            <Link to="/docs" activeClassName="is-active">
              文档
            </Link>
            <Link to="/examples" activeClassName="is-active">
              示例
            </Link>
          </ul>

          <div className="hidden-xs p-t pull-right m-l-sm">
            <Select
              clearable={false}
              theme={this.state.theme.value}
              value={this.state.locale || 'zh-cn'}
              options={locales}
              onChange={locale => {
                this.setState({locale: locale.value});
                localStorage.setItem('locale', locale.value);
              }}
            />
          </div>

          <div className="hidden-xs p-t pull-right">
            <Select
              clearable={false}
              theme={this.state.theme.value}
              value={this.state.theme}
              options={this.state.themes}
              onChange={theme => {
                this.setState({theme});
                localStorage.setItem(
                  'themeIndex',
                  this.state.themes.indexOf(theme)
                );
              }}
            />
          </div>

          <DocSearch theme={this.state.theme.value} />
        </div>
      </>
    );
  }

  renderNavigation(navs, parent?: any) {
    const pathname = location.pathname;
    return navs.map(nav => {
      const path = nav.path;
      const hasChildren = Array.isArray(nav.children) && nav.children.length;
      const isOpen =
        nav.isOpen ||
        (nav.isOpen !== false &&
          hasChildren &&
          !!~nav.children.findIndex(item => item.path === pathname));

      return (
        <div
          key={nav.label}
          className={classnames('Doc-navigation-item', {
            'is-active': path === location.pathname,
            'is-top': !parent,
            'is-open': isOpen
          })}
        >
          <Link
            onClick={e => {
              browserHistory.push(
                `${path || (hasChildren && nav.children[0].path)}`
              );
              !isOpen && this.toggleOpen(e, nav);
            }}
            // to={`${path || (hasChildren && nav.children[0].path)}`}
          >
            {nav.label}
            {hasChildren ? (
              <i
                className={`iconfont icon-down-arrow ${
                  isOpen ? '' : 'is-flipped'
                }`}
                onClick={e => this.toggleOpen(e, nav)}
              ></i>
            ) : null}
          </Link>

          {isOpen
            ? this.renderNavigation(nav.children || [], {
                ...nav,
                path
              })
            : null}
        </div>
      );
    });
  }

  render() {
    const theme = this.state.theme;
    const navigations = this.state.navigations;

    return (
      <Layout
        theme={theme.value}
        boxed={true}
        offScreen={this.state.offScreen}
        header={this.state.headerVisible ? this.renderHeader() : null}
        // folded={this.state.asideFolded}
        // aside={this.renderAside()}
      >
        <ToastComponent theme={theme.value} locale={this.state.locale} />
        <AlertComponent theme={theme.value} locale={this.state.locale} />

        <div className="Doc">
          <div className="Doc-nav">
            <div className="Doc-navigation">
              {navigations.map(item => (
                <div className="Doc-navigationGroup" key={item.label}>
                  <div className="Doc-navigationGroup-name">
                    {item.label || '其他'}
                  </div>
                  {this.renderNavigation(item.children)}
                </div>
              ))}
            </div>
          </div>

          {/* 完了加个动画吧 */}
          <div
            className={`Backtop ${this.state.scrollTop > 450 ? 'visible' : ''}`}
            onClick={() => scrollTo({top: 0})}
          >
            <i className="fa fa-rocket"></i>
          </div>

          {React.cloneElement(this.props.children, {
            ...this.props.children.props,
            setNavigations: this.setNavigations,
            setAsideFolded: this.setAsideFolded,
            setHeaderVisible: this.setHeaderVisible,
            theme: theme.value,
            classPrefix: theme.ns,
            locale: this.state.locale
          })}
        </div>
      </Layout>
    );
  }
}

function navigations2route(pathPrefix = PathPrefix, navigations) {
  let routes = [];

  navigations.forEach(root => {
    root.children &&
      mapTree(root.children, item => {
        if (item.path && item.component) {
          routes.push(
            <Route
              key={routes.length + 1}
              path={
                item.path[0] === '/'
                  ? ContextPath + item.path
                  : `${ContextPath}${pathPrefix}/${item.path}`
              }
              component={item.component}
            />
          );
        } else if (item.path && item.getComponent) {
          routes.push(
            <Route
              key={routes.length + 1}
              path={
                item.path[0] === '/'
                  ? ContextPath + item.path
                  : `${ContextPath}${pathPrefix}/${item.path}`
              }
              getComponent={item.getComponent}
            />
          );
        }
      });
  });

  return routes;
}

export default function entry({pathPrefix}) {
  PathPrefix = pathPrefix || PathPrefix;
  return (
    <Router history={browserHistory}>
      <Route component={App}>
        <Redirect from={`${ContextPath}/`} to={`${ContextPath}/docs/index`} />
        <Redirect from={`/examples`} to={`/examples/pages/simple`} />
        <Redirect from={`/docs`} to={`/docs/index`} />

        <Route path="/docs" component={Doc}>
          {navigations2route('/docs', docs)}
        </Route>
        <Route path="/examples" component={Example}>
          {navigations2route('/examples', examples)}
        </Route>
      </Route>

      <Route path="*" component={NotFound} />
    </Router>
  );
}
