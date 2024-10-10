/**
 * @file entry of this example.
 * @author fex
 */
import React from 'react';
import {createRoot} from 'react-dom/client';

import {Layout, AsideNav, Spinner, NotFound} from 'amis-ui';
import {eachTree, TreeArray, TreeItem} from 'amis-core';
import {
  HashRouter as Router,
  Route,
  Redirect,
  Switch,
  Link,
  NavLink
} from 'react-router-dom';
import Doc from './examples/component/Doc';

function MDComponent(fN: () => Promise<{default: {raw: string}}>) {
  return React.lazy(() =>
    fN().then(ret => ({default: () => <Doc children={ret.default.raw} />}))
  );
}

const pages: TreeArray = [
  {
    label: '面板模版',
    children: [
      {
        label: '基础',
        path: '/basic',
        component: MDComponent(() => import('./examples/route/Basic.md'))
      },

      {
        label: '公式',
        path: '/formula',
        component: MDComponent(() => import('./examples/route/Formula.md'))
      }
    ]
  }
];

function getPath(path: string) {
  return path ? (path[0] === '/' ? path : `/${path}`) : '';
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
                path={item.path[0] === '/' ? item.path : `/${item.path}`}
                render={(props: any) => (
                  <item.component {...additionalProperties} {...props} />
                )}
              />
            ) : (
              <Route
                key={routes.length + 1}
                path={item.path[0] === '/' ? item.path : `/${item.path}`}
                component={item.component}
              />
            )
          );
        }
      });
  });

  return routes;
}

export function Main() {
  function renderAside() {
    return (
      <AsideNav
        navigations={pages.map((item: any) => ({
          ...item,
          children: item.children
            ? item.children.map((item: any) => ({
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
          let children: any[] = [];

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

  return (
    <Router>
      <React.Suspense
        fallback={<Spinner overlay spinnerClassName="m-t-lg" size="lg" />}
      >
        <Switch>
          <Route
            component={React.lazy(() => import('./examples/App'))}
            exact
            path="/"
          />
          <Layout
            header={
              <div id="headerBar" className="box-shadow bg-dark">
                <div className={`cxd-Layout-brand`}>编辑器面板示例</div>
                <Link to="/">回到编辑器</Link>
              </div>
            }
            aside={renderAside()}
          >
            <React.Suspense
              fallback={<Spinner overlay spinnerClassName="m-t-lg" size="lg" />}
            >
              <Switch>
                {navigations2route(pages)}
                <Route render={() => <NotFound description="Not found" />} />
              </Switch>
            </React.Suspense>
          </Layout>
        </Switch>
      </React.Suspense>
    </Router>
  );
}

export function bootstrap(mountTo: HTMLElement, initalState: any) {
  const root = createRoot(mountTo);
  root.render(<Main />);
}
