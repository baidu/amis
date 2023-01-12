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
        label: {
          type: 'tpl',
          tpl: 'Nav1-1'
        },
        to: '#/',
        icon: [
          {
            icon: 'https://suda.cdn.bcebos.com/images%2F2021-01%2Fdiamond.svg',
            position: 'before'
          },
          {
            icon: 'fa fa-user',
            position: 'after'
          }
        ]
      },
      {
        label: 'Nav 1-2',
        to: '#/test1',
        customText: 'HOT',
        customLevel: 'danger',
        children: [
          {
            label: 'Nav 1-2-1',
            to: '#/test4',
            children: [
              {
                label: 'Nav 1-2-1-1',
                to: '#/test5'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    label: 'Nav2',
    children: [
      {
        label: 'Nav 2-1',
        to: '#/test2',
        children: [
          {
            label: 'Nav 2-1-1',
            to: '#/test3'
          }
        ]
      },
      {
        label: 'Nav 2-2',
        to: '#/test3'
      }
    ]
  }
];

const schema2 = [
  {
    label: 'Nav1',
    to: '#/',
    icon: 'fa fa-user'
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
        to: '#/test3',
        disabled: true,
        disabledTip: '禁用提示文案'
      }
    ]
  }
];

const schema3 = [
  {
    label: 'Nav1',
    to: '#/',
    icon: 'fa fa-user',
    disabled: true,
    disabledTip: '禁用提示文案'
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
        to: '#/test3',
        disabled: true,
        disabledTip: '禁用提示文案'
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
    //         links: schema
    //         level: 1,
    //         onEvent: {
    //           change: {
    //             actions: [
    //               {
    //                 actionType: 'updateItems',
    //                 componentId: 'asideNav',
    //                 args: {
    //                   value: '${activeItems}'
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
    const active =
      location.pathname === '/test2' || location.pathname === '/test3'
        ? 'Nav2'
        : 'Nav1';

    return (
      <div>
        {/* <div style={{marginBottom: '20px'}}>
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
            },
            {data: {active}}
          )}
        </div> */}
        <div>
          {render(
            {
              type: 'nav',
              id: 'asideNav',
              stacked: true,
              // showKey: '${active}',
              // links: schema
              source: '${schema}',
              itemBadge: {
                mode: 'ribbon',
                text: '${customText}',
                position: 'top-left',
                visibleOn: 'this.customText',
                level: '${customLevel}'
              },
              itemActions: [
                {
                  type: 'icon',
                  icon: 'cloud',
                  visibleOn: "this.label === 'Nav 1-2'"
                },
                {
                  type: 'dropdown-button',
                  level: 'link',
                  icon: 'fa fa-ellipsis-h',
                  hideCaret: true,
                  buttons: [
                    {
                      type: 'button',
                      label: '编辑'
                    },
                    {
                      type: 'button',
                      label: '删除'
                    }
                  ]
                }
              ]
            },
            {data: {schema, active}, location}
          )}
          {/* {render(
            {
              type: 'nav',
              id: 'asideNav2',
              stacked: true,
              source: '${schema2}',
              collapsed: true,
              onEvent: {
                collapsed: {
                  actions: [
                    {
                      actionType: 'toast',
                      args: {
                        msgType: 'info',
                        msg: '是否展开${collapsed}'
                      }
                    }
                  ]
                }
              }
            },
            {data: {schema2}, location}
          )}
          {render({
            type: 'button',
            label: '展开/收起',
            onEvent: {
              click: {
                actions: [
                  {
                    actionType: 'collapse',
                    componentId: 'asideNav2'
                  }
                ]
              }
            }
          })}
          {render(
            {
              type: 'nav',
              id: 'asideNav3',
              stacked: true,
              source: '${schema3}',
              mode: 'float'
            },
            {data: {schema3}, location}
          )} */}
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
              render={(props: any) => (
                <div style={{padding: '20px'}}>
                  {render({
                    type: 'nav',
                    stacked: true,
                    expandPosition: 'after',
                    links: [
                      {
                        label: 'Nav1',
                        to: '#/'
                      },
                      {
                        label: 'Nav2',
                        overflow: {
                          enable: true
                        },
                        children: [
                          {
                            label: 'Nav 2-1',
                            to: '#/test2'
                          },
                          {
                            label: 'Nav 2-2',
                            to: '#/test3'
                          },
                          {
                            label: 'Nav 2-3',
                            to: '#/test1'
                          },
                          {
                            label: 'Nav 2-4',
                            to: '#/test4'
                          },
                          {
                            label: 'Nav 2-5',
                            to: '#/test5'
                          }
                        ]
                      }
                    ]
                  })}
                  {render(
                    {
                      type: 'nav',
                      id: 'asideNav',
                      stacked: true,
                      links: [
                        {
                          label: 'Nav1',
                          children: [
                            {
                              label: {
                                type: 'tpl',
                                tpl: 'Nav1-1'
                              },
                              to: '#/',
                              icon: [
                                {
                                  icon: 'https://suda.cdn.bcebos.com/images%2F2021-01%2Fdiamond.svg',
                                  position: 'before'
                                },
                                {
                                  icon: 'fa fa-user',
                                  position: 'after'
                                }
                              ]
                            },
                            {
                              label: 'Nav 1-2',
                              to: '#/test1',
                              customText: 'HOT',
                              customLevel: 'danger',
                              children: [
                                {
                                  label: 'Nav 1-2-1',
                                  to: '#/test4',
                                  children: [
                                    {
                                      label: 'Nav 1-2-1-1',
                                      to: '#/test5'
                                    }
                                  ]
                                }
                              ]
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
                        },
                        {
                          label: 'Nav3',
                          to: '#/test4',
                          children: [
                            {
                              label: 'Nav 2-2'
                              // to: '#/test3'
                            }
                          ]
                        }
                      ],
                      accordion: true,
                      onEvent: {
                        click: {
                          actions: [
                            {
                              actionType: 'toast',
                              args: {
                                msgType: 'info',
                                msg: '节点label${item.label}'
                              }
                            }
                          ]
                        },
                        toggled: {
                          actions: [
                            {
                              actionType: 'toast',
                              args: {
                                msgType: 'info',
                                msg: '是否展开${open}'
                              }
                            }
                          ]
                        }
                      }
                    },
                    {data: {schema}}
                  )}
                </div>
              )}
            />
            <Route
              path="/test3"
              render={(props: any) => (
                <div>
                  {render(
                    {
                      type: 'nav',
                      id: 'asideNav',
                      stacked: true,
                      draggable: true,
                      links: [
                        {
                          label: 'Nav1',
                          children: [
                            {
                              label: {
                                type: 'tpl',
                                tpl: 'Nav1-1'
                              },
                              to: '#/',
                              icon: [
                                {
                                  icon: 'https://suda.cdn.bcebos.com/images%2F2021-01%2Fdiamond.svg',
                                  position: 'before'
                                },
                                {
                                  icon: 'fa fa-user',
                                  position: 'after'
                                }
                              ]
                            },
                            {
                              label: 'Nav 1-2',
                              to: '#/test1',
                              customText: 'HOT',
                              customLevel: 'danger',
                              children: [
                                {
                                  label: 'Nav 1-2-1',
                                  to: '#/test4',
                                  children: [
                                    {
                                      label: 'Nav 1-2-1-1',
                                      to: '#/test5'
                                    }
                                  ]
                                }
                              ]
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
                        },
                        {
                          label: 'Nav3',
                          to: '#/test4'
                        },
                        {
                          label: 'Nav 4',
                          to: '#/test3'
                        }
                      ]
                    },
                    {data: {schema}}
                  )}
                </div>
              )}
            />
            <Route
              path="/test4"
              render={(props: any) => (
                <div>测试测试测试测试测试测试测试测试4444444</div>
              )}
            />
            <Route
              path="/test5"
              render={(props: any) => (
                <div>测试测试测试测试测试测试测试aaaaaa5555</div>
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
