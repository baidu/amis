/**
 * @file 导航示例
 */

import React from 'react';
import {withRouter} from 'react-router';
import {HashRouter as Router, Route, Switch} from 'react-router-dom';
import {createRoot} from 'react-dom/client';
import {Layout, NotFound, Spinner, render} from 'amis';

// const schema = [
//   {
//     label: 'Nav 1',
//     to: '#/',
//     activeOn:
//       'data.pathname === "/" || data.pathname === "/test1" || data.pathname === "/test3"',
//     children: [
//       {
//         label: 'Nav 1-1',
//         to: '#/'
//       },
//       {
//         label: 'Nav 1-2',
//         children: [
//           {
//             label: 'Nav 1-2-1',
//             to: '#/test3'
//           },
//           {
//             label: 'Nav 1-2-2',
//             to: '#/test1'
//           }
//         ]
//       }
//     ]
//   },
//   {
//     label: 'Nav 2',
//     to: '#/test2',
//     children: [
//       {
//         label: 'Nav 2-1',
//         to: '#/test2'
//       }
//     ]
//   }
// ];

const schema = [
  {
    label: 'Nav1',
    children: [
      {
        label: 'Nav 1-1',
        to: '#/'
      },
      {
        label: 'Nav 1-2',
        to: '#/test1'
      }
    ]
  },
  {
    label: 'Nav2',
    children: [
      {
        label: 'Nav 2-1',
        to: '#/test2'
      },
      {
        label: 'Nav 2-2',
        to: '#/test3'
      }
    ]
  }
];

@withRouter // @ts-ignore
export class App extends React.PureComponent<{
  location: Location;
}> {
  renderHeader() {
    const {location} = this.props;

    // return (
    //   <div>
    //     {render(
    //       {
    //         type: 'nav',
    //         links: schema,
    //         level: 1,
    //         onEvent: {
    //           selected: {
    //             actions: [
    //               {
    //                 actionType: 'updateItems',
    //                 componentId: 'asideNav',
    //                 args: {
    //                   value: '${avtiveItems}'
    //                 }
    //               }
    //             ]
    //           }
    //         }
    //       },
    //       {location}
    //     )}
    //   </div>
    // );
    return <div>Header</div>;
  }

  renderAsideNav() {
    const {location} = this.props;
    // return (
    //   <div>
    //     {render(
    //       {
    //         type: 'nav',
    //         id: 'asideNav',
    //         stacked: true,
    //         links: schema
    //       },
    //       {location}
    //     )}
    //   </div>
    // );
    // const active =
    //   location.pathname === '/test2' || location.pathname === '/test3'
    //     ? 'Nav2'
    //     : 'Nav1';

    return (
      <div>
        <div style={{marginBottom: '20px'}}>
          {render(
            {
              type: 'select',
              name: 'type',
              value: '${active}',
              options: [
                {
                  label: '共享版',
                  value: 'Nav1' // 对应一级label
                },
                {
                  label: '企业版',
                  value: 'Nav2'
                }
              ],
              onEvent: {
                change: {
                  actions: [
                    {
                      actionType: 'updateItems',
                      componentId: 'asideNav',
                      args: {
                        value: '${value}'
                      }
                    }
                  ]
                }
              }
            }
            // {data: {active}}
          )}
        </div>
        <div>
          {render(
            {
              type: 'nav',
              id: 'asideNav',
              stacked: true,
              showLabel: '${active}',
              // links: schema
              source: '${schema}',
              expandPosition: 'after'
            },
            {data: {schema}}
          )}
        </div>
      </div>
    );
  }

  render() {
    return (
      <Layout header={this.renderHeader()} aside={this.renderAsideNav()}>
        <React.Suspense
          fallback={<Spinner overlay spinnerClassName="m-t-lg" size="lg" />}
        >
          <Switch>
            <Route
              path="/"
              exact
              render={(props: any) => (
                <div>
                  {render({
                    type: 'page',
                    body: '这是一个首页',
                    data: {
                      active: 'Nav1'
                    }
                  })}
                </div>
              )}
            />
            <Route
              path="/test1"
              render={(props: any) => <div>测试测试1</div>}
            />
            <Route
              path="/test2"
              render={(props: any) => <div>测试测试测试测试2</div>}
            />
            <Route
              path="/test3"
              render={(props: any) => (
                <div>
                  测试测试测试测试测试测试测试测试2测试测试测试测试23332
                </div>
              )}
            />
          </Switch>
        </React.Suspense>
      </Layout>
    );
  }
}

export function bootstrap(mountTo: Element | DocumentFragment) {
  const root = createRoot(mountTo);
  root.render(
    <Router>
      <Switch>
        <Route component={App}></Route>
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}
