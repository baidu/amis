/**
 * 组件名称：Nav 导航
 * 单测内容：
 * 1. 基本使用
 * 2. 多层级
 * 3. 横向摆放
 * 4. 响应式收纳
 * 5. 动态导航
 * 6. 懒加载
 * 7. 更多操作
 */

import {render, cleanup, fireEvent, waitFor} from '@testing-library/react';
import '../../src';
import {render as amisRender} from '../../src';
import {makeEnv, wait} from '../helper';

afterEach(cleanup);

// 1. 基本使用
test('Renderer:Nav', () => {
  const {container} = render(
    amisRender(
      {
        type: 'nav',
        stacked: true,
        className: 'w-md',
        itemBadge: {
          mode: 'ribbon',
          text: '${customText}',
          position: 'top-left',
          visibleOn: 'this.customText',
          level: '${customLevel}'
        },
        links: [
          {
            __id: 0,
            label: 'Nav 1',
            to: '/docs/index',
            icon: 'https://suda.cdn.bcebos.com/images%2F2021-01%2Fdiamond.svg',
            active: true
          },
          {
            __id: 1,
            label: 'Nav 2',
            to: '/docs/api',
            customText: 'HOT',
            customLevel: 'danger'
          },
          {
            __id: 2,
            label: 'Nav 3',
            to: '/docs/renderers',
            customText: 'SUC',
            customLevel: 'success'
          },
          {
            __id: 3,
            label: '外部地址',
            to: 'http://www.baidu.com/',
            target: '_blank'
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();

  const items = container.querySelectorAll('.cxd-Nav-Menu-item')!;
  expect(items.length).toBe(4);
  expect(items[0].querySelector('img')).toHaveAttribute(
    'src',
    'https://suda.cdn.bcebos.com/images%2F2021-01%2Fdiamond.svg'
  );
  expect(items[1].firstElementChild?.firstElementChild).toHaveClass(
    'cxd-Badge'
  );
  expect(items[2].querySelector('.cxd-Badge--success')).toHaveTextContent(
    'SUC'
  );
});

// 2. 多层级
test('Renderer:Nav with multi-level', () => {
  const {container} = render(
    amisRender(
      {
        type: 'nav',
        stacked: true,
        className: 'w-md',
        links: [
          {
            __id: 1,
            label: 'Nav 1',
            to: '/docs/index',
            icon: 'fa fa-user',
            active: true
          },
          {
            __id: 2,
            label: 'Nav 2',
            unfolded: true,
            children: [
              {
                __id: 2.1,
                label: 'Nav 2-1',
                children: [
                  {
                    __id: 2.11,
                    label: 'Nav 2-1-1',
                    to: '/docs/api-2-1-1'
                  }
                ]
              },
              {
                __id: 2.2,
                label: 'Nav 2-2',
                to: '/docs/api-2-2'
              }
            ]
          },
          {
            __id: 3,
            label: 'Nav 3',
            to: '/docs/renderers'
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
  expect(container.querySelector('.cxd-Nav-Menu-submenu')!).toBeInTheDocument();
  const menuWrapper = container.querySelector(
    '.cxd-Nav-Menu > .cxd-Nav-Menu-submenu > .cxd-Nav-Menu'
  );
  const children = menuWrapper?.children;
  expect(children?.length).toBe(2);
});

// 3. 横向摆放
test('Renderer:Nav with stacked', () => {
  const {container} = render(
    amisRender(
      {
        type: 'nav',
        stacked: false,
        links: [
          {
            __id: 1,
            label: 'Nav 1',
            to: '/docs/index',
            icon: 'fa fa-user'
          },
          {
            __id: 2,
            label: 'Nav 2',
            to: '/docs/api'
          },
          {
            __id: 3,
            label: 'Nav 3',
            to: '/docs/renderers'
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
  expect(
    container.querySelector('.cxd-Nav-Menu-horizontal')!
  ).toBeInTheDocument();
});

// 4. 响应式收纳
test('Renderer:Nav with overflow', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'nav',
          stacked: false,
          overflow: {
            __id: 'overflowid',
            enable: true,
            overflowLabel: '点击展开',
            overflowIndicator: 'fas fa-angle-double-down',
            maxVisibleCount: 2,
            wrapperComponent: 'section',
            style: {
              color: 'red'
            },
            overflowClassName: 'thisisoverflowClassName',
            overflowPopoverClassName: 'thisisoverflowPopoverClassName',
            overflowListClassName: 'thisisoverflowListClassName'
          },
          links: [
            {
              __id: 1,
              label: 'Nav 1',
              to: '?to=nav1'
            },
            {
              __id: 2,
              label: 'Nav 2',
              to: '?to=nav1'
            },
            {
              __id: 3,
              label: 'Nav 3',
              to: '?to=nav3'
            },
            {
              __id: 4,
              label: 'Nav 4',
              to: '?to=nav4'
            },
            {
              __id: 5,
              label: 'Nav 5',
              to: '?to=nav5'
            },
            {
              __id: 6,
              label: 'Nav 6',
              to: '?to=nav6'
            },
            {
              __id: 7,
              label: 'Nav 7',
              to: '?to=nav7'
            },
            {
              __id: 8,
              label: 'Nav 8',
              to: '?to=nav8'
            }
          ]
        }
      },
      {},
      makeEnv({})
    )
  );

  const wrap = container.querySelector(
    'section.cxd-Nav-Menu.cxd-Nav-Menu-horizontal'
  )!;

  expect(wrap).toBeInTheDocument();
  expect(wrap).toHaveStyle({
    color: 'red'
  });

  const btn = container.querySelector('.cxd-Nav-Menu-overflow-item-rest');
  expect(btn).toBeInTheDocument();
  expect(btn).toHaveTextContent('点击展开');
  expect(btn?.querySelector('.fa-angle-double-down')!).toBeInTheDocument();
  expect(btn?.querySelector('.cxd-Nav-Menu-overflowedIcon')!).toHaveClass(
    'thisisoverflowClassName'
  );

  expect(
    container.querySelectorAll(
      '.cxd-Nav-Menu-item:not(.cxd-Nav-Menu-overflow-item-rest)'
    )!.length
  ).toEqual(2);

  fireEvent.click(btn!);

  await waitFor(() =>
    expect(container.querySelector('.cxd-Spinner')).not.toBeInTheDocument()
  );
  expect(container).toMatchSnapshot();
});

// 5. 动态导航
test('Renderer:Nav with source', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        data: {
          nav: [
            {
              __id: 1,
              label: 'Nav 1',
              to: '/docs/index',
              icon: 'fa fa-user'
            },
            {
              __id: 2,
              label: 'Nav 2',
              to: '/docs/api'
            },
            {
              __id: 3,
              label: 'Nav 3',
              to: '/docs/renderers'
            }
          ]
        },
        body: {
          type: 'nav',
          stacked: true,
          source: '${nav}'
        }
      },
      {},
      makeEnv({})
    )
  );

  expect(container.querySelectorAll('.cxd-Nav-Menu-item').length).toBe(3);
  expect(container).toMatchSnapshot();
});

// 6. 懒加载
test('Renderer:Nav with defer', async () => {
  const fetcher = jest.fn().mockImplementation(
    ({query}) =>
      new Promise((resolve, reject) => {
        if (query?.parentId) {
          resolve({
            status: 0,
            msg: '',
            data: [
              {label: 'Nav 3-1', to: '?cat=3-1', value: '3-1', __id: 3.1},
              {label: 'Nav 3-2', to: '?cat=3-2', value: '3-2', __id: 3.2}
            ]
          });
          return;
        }

        resolve({
          status: 0,
          msg: '',
          data: {
            links: [
              {
                label: 'Nav 1',
                to: '?cat=1',
                value: '1',
                icon: 'fa fa-user',
                __id: 1
              },
              {
                label: 'Nav 2',
                __id: 2,
                unfolded: true,
                children: [
                  {
                    __id: 2.1,
                    label: 'Nav 2-1',
                    children: [
                      {
                        label: 'Nav 2-1-1',
                        to: '?cat=2-1',
                        value: '2-1',
                        __id: 2.11
                      }
                    ]
                  },
                  {label: 'Nav 2-2', to: '?cat=2-2', value: '2-2', __id: 2.2}
                ]
              },
              {label: 'Nav 3', to: '?cat=3', value: '3', defer: true, __id: 3}
            ],
            value: '?cat=1'
          }
        });
      })
  );

  const {container, getByTitle, getByText} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'nav',
          stacked: true,
          source: '/api/options/nav?parentId=${value}'
        }
      },
      {},
      makeEnv({
        fetcher,
        session: 'test-nav-1'
      })
    )
  );

  await wait(200);
  expect(fetcher).toBeCalled();

  const menu = container.querySelector('.cxd-Nav-Menu');
  expect(menu?.children.length).toBe(3);

  // const navThreeHeader = getByTitle('Nav 3');
  // expect(navThreeHeader).toBeInTheDocument();

  // fireEvent.click(
  //   navThreeHeader?.querySelector('.cxd-Nav-Menu-submenu-arrow')!
  // );

  // await wait(200);
  // expect(fetcher).toBeCalledTimes(1);
  // expect(fetcher.mock.calls[0][0]).toEqual({
  //   config: {},
  //   method: 'get',
  //   query: {parentId: '3'},
  //   url: '/api/options/nav?parentId=3'
  // });

  // await wait(200);
  // const navThree = container.querySelector(
  //   '.cxd-Menu > .cxd-Menu-submenu:last-of-type'
  // );

  // expect(navThree!.querySelector('.cxd-Menu-sub')?.children.length).toBe(2);
  // expect(getByText('Nav 3-2')).not.toBeNull();

  // expect(container).toMatchSnapshot();
});

// 7. 更多操作
test('Renderer:Nav with itemActions', async () => {
  const {container, getByTitle, getByText} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'nav',
          stacked: true,
          className: 'w-md',
          draggable: true,
          saveOrderApi: '/api/options/nav',
          source: '/api/options/nav?parentId=${value}',
          itemActions: [
            {
              type: 'icon',
              icon: 'cloud',
              visibleOn: "this.to === '?cat=1'"
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
          ],
          links: [
            {
              label: 'Nav 1',
              to: '?cat=1',
              value: '1',
              icon: 'fa fa-user',
              __id: 1
            },
            {
              label: 'Nav 2',
              __id: 2,
              unfolded: true,
              children: [
                {
                  __id: 2.1,
                  label: 'Nav 2-1',
                  children: [
                    {
                      label: 'Nav 2-1-1',
                      to: '?cat=2-1',
                      value: '2-1',
                      __id: 2.11
                    }
                  ]
                },
                {label: 'Nav 2-2', to: '?cat=2-2', value: '2-2', __id: 2.2}
              ]
            },
            {label: 'Nav 3', to: '?cat=3', value: '3', defer: true, __id: 3}
          ]
        }
      },
      {},
      makeEnv({})
    )
  );
  expect(container).toMatchSnapshot();

  expect(container.querySelectorAll('.fa-cloud').length).toBe(1);
  fireEvent.click(
    container.querySelector('.cxd-Nav-Menu-item-extra .cxd-Button')!
  );

  await waitFor(() =>
    expect(container.querySelector('.cxd-Spinner')).not.toBeInTheDocument()
  );
  expect(container).toMatchSnapshot();
  expect(getByText('编辑')).toBeInTheDocument();
});

// 8.各种图标展示
test('Renderer:Nav with icons', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'nav',
          stacked: true,
          links: [
            {
              label: 'Nav 1',
              to: '?cat=1',
              value: '1',
              icon: 'fa fa-user',
              __id: 1
            },
            {
              label: 'Nav 2',
              __id: 2,
              unfolded: true,
              children: [
                {
                  __id: 2.1,
                  label: 'Nav 2-1',
                  icon: [
                    {
                      icon: 'star',
                      position: 'before'
                    },
                    {
                      icon: 'search',
                      position: 'before'
                    },
                    {
                      icon: 'https://suda.cdn.bcebos.com/images%2F2021-01%2Fdiamond.svg',
                      position: 'after'
                    }
                  ],
                  children: [
                    {
                      label: 'Nav 2-1-1',
                      to: '?cat=2-1',
                      value: '2-1',
                      __id: 2.11
                    }
                  ]
                }
              ]
            }
          ]
        }
      },
      {},
      makeEnv({})
    )
  );
  expect(container).toMatchSnapshot();
  expect(container.querySelectorAll('.fa-user').length).toBe(1);
  expect(container.querySelectorAll('[icon=search]').length).toBe(1);
  expect(container.querySelectorAll('img').length).toBe(1);
});

// 9.Nav在Dialog里
test('Renderer:Nav with Dialog', async () => {
  const {container, getByText} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'button',
          label: '点击弹框',
          actionType: 'dialog',
          dialog: {
            title: '弹框',
            body: [
              {
                type: 'nav',
                stacked: true,
                className: 'w-md',
                draggable: true,
                saveOrderApi: '/api/options/nav',
                source: '/api/options/nav?parentId=${value}',
                itemActions: [
                  {
                    type: 'icon',
                    icon: 'cloud',
                    visibleOn: "this.to === '?cat=1'"
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
                ],
                links: [
                  {
                    label: 'Nav 1',
                    to: '?cat=1',
                    value: '1',
                    icon: 'fa fa-user',
                    __id: 1
                  },
                  {
                    label: 'Nav 2',
                    __id: 2,
                    unfolded: true,
                    children: [
                      {
                        __id: 2.1,
                        label: 'Nav 2-1',
                        children: [
                          {
                            label: 'Nav 2-1-1',
                            to: '?cat=2-1',
                            value: '2-1',
                            __id: 2.11
                          }
                        ]
                      },
                      {
                        label: 'Nav 2-2',
                        to: '?cat=2-2',
                        value: '2-2',
                        __id: 2.2
                      }
                    ]
                  },
                  {
                    label: 'Nav 3',
                    to: '?cat=3',
                    value: '3',
                    defer: true,
                    __id: 3
                  }
                ]
              }
            ]
          }
        }
      },
      {},
      makeEnv({
        getModalContainer: () => container
      })
    )
  );
  expect(container).toMatchSnapshot();

  fireEvent.click(getByText('点击弹框'));
  await waitFor(() => {
    expect(container.querySelector('[role="dialog"]')).toBeInTheDocument();
  });

  fireEvent.click(
    container.querySelector(
      '[role="dialog"] .cxd-Nav-Menu-item-extra .cxd-Button'
    )!
  );

  await waitFor(() => {
    expect(
      container.querySelector('[role="dialog"] .cxd-PopOver')
    ).toBeInTheDocument();
  });
});

// 10.Nav配置reload动作
test('Renderer:Nav with reload1', async () => {
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: ''
      }
    })
  );
  const {container}: any = render(
    amisRender(
      {
        type: 'page',
        data: {
          nav: [
            {
              label: 'Nav 1',
              to: '/docs/index',
              icon: 'fa fa-user'
            },
            {
              label: 'Nav 2',
              to: '/docs/api'
            },
            {
              label: 'Nav 3',
              to: '/docs/renderers'
            }
          ]
        },
        body: [
          {
            type: 'nav',
            stacked: true,
            id: 'xxNav',
            source: '${nav}'
          },
          {
            type: 'button',
            level: 'primary',
            className: 'mr-4',
            label: 'reload',
            onEvent: {
              click: {
                actions: [
                  {
                    componentId: 'xxNav',
                    actionType: 'reload'
                  }
                ]
              }
            }
          }
        ]
      },
      {},
      makeEnv({
        session: 'test-case-action-no',
        fetcher
      })
    )
  );
  fireEvent.click(container.querySelector('.cxd-Button'));
  await wait(500);
  expect(fetcher).not.toBeCalled();
});

// 11.Nav配置reload动作
test('Renderer:Nav with reload2', async () => {
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          links: [
            {
              label: 'Nav 1',
              to: '?cat=1',
              value: '1',
              icon: 'fa fa-user'
            },
            {
              label: 'Nav 2',
              unfolded: true,
              children: [
                {
                  label: 'Nav 2-1',
                  children: [
                    {
                      label: 'Nav 2-1-1',
                      to: '?cat=2-1',
                      value: '2-1'
                    }
                  ]
                },
                {
                  label: 'Nav 2-2',
                  to: '?cat=2-2',
                  value: '2-2'
                }
              ]
            },
            {
              label: 'Nav 3',
              to: '?cat=3',
              value: '3',
              defer: true
            }
          ],
          value: '?cat=1'
        }
      }
    })
  );
  const {container}: any = render(
    amisRender(
      {
        type: 'page',
        data: {
          url: '/api/options/nav'
        },
        body: [
          {
            type: 'nav',
            stacked: true,
            id: 'xxNav',
            source: '${url}'
          },
          {
            type: 'button',
            level: 'primary',
            className: 'mr-4',
            label: 'reload',
            onEvent: {
              click: {
                actions: [
                  {
                    componentId: 'xxNav',
                    actionType: 'reload'
                  }
                ]
              }
            }
          }
        ]
      },
      {},
      makeEnv({
        session: 'test-case-action-no',
        fetcher
      })
    )
  );
  await wait(500);
  const navItem = container.querySelector('.cxd-Nav-Menu-item');
  expect(navItem).toBeInTheDocument();
  fireEvent.click(container.querySelector('.cxd-Button'));
  await wait(500);
  expect(fetcher).toBeCalled();
});
