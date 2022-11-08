import React from 'react';
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

const pages: TreeArray = [
  {
    label: '常规',
    children: [
      {
        label: '按钮',
        path: '/basic/button',
        component: React.lazy(() => import('./basic/Button'))
      }
    ]
  },

  {
    label: '表单',
    children: [
      {
        label: 'InputTable',
        path: '/form/input-table',
        component: React.lazy(() => import('./form/InputTable'))
      },

      {
        label: 'Combo',
        path: '/form/combo',
        component: React.lazy(() => import('./form/Combo'))
      }
    ]
  },

  {
    label: '弹框',
    children: [
      {
        label: 'PickContainer',
        path: '/modal/pick-conatiner',
        component: React.lazy(() => import('./modal/PickerContainer'))
      },

      {
        label: 'ConfirmBox',
        path: '/modal/confirm-box',
        component: React.lazy(() => import('./modal/ConfirmBox'))
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

export default function App() {
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
      <Layout
        header={
          <div id="headerBar" className="box-shadow bg-dark">
            <div className={`cxd-Layout-brand`}>amis-ui 示例</div>
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
    </Router>
  );
}
