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

import React from 'react';
import {render, cleanup, fireEvent, getByText} from '@testing-library/react';
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

  const items = container.querySelectorAll('.cxd-Nav-item')!;
  expect(items.length).toBe(4);
  expect(items[0].querySelector('.cxd-Nav-itemIcon')).toHaveAttribute(
    'src',
    'https://suda.cdn.bcebos.com/images%2F2021-01%2Fdiamond.svg'
  );
  expect(items[1].firstElementChild).toHaveClass('cxd-Badge');
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
  expect(container.querySelector('.cxd-Nav-item.has-sub')!).toBeInTheDocument();
  expect(
    container.querySelectorAll(
      '.cxd-Nav-list > .cxd-Nav-item.has-sub > .cxd-Nav-subItems > .cxd-Nav-item'
    )!.length
  ).toBe(2);
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
  expect(container.querySelector('.cxd-Nav-list--tabs')!).toBeInTheDocument();
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
    'section.cxd-Nav-list.cxd-Nav-list--tabs'
  )!;

  expect(wrap).toBeInTheDocument();
  expect(wrap).toHaveStyle({
    color: 'red'
  });

  const btn = container.querySelector('.cxd-Nav-item.cxd-Nav-item-overflow');
  expect(btn).toBeInTheDocument();
  expect(btn).toHaveTextContent('点击展开');
  expect(btn?.querySelector('.fa-angle-double-down')!).toBeInTheDocument();
  expect(btn).toHaveClass('thisisoverflowClassName');

  expect(
    container.querySelectorAll('.cxd-Nav-item:not(.cxd-Nav-item-overflow)')!
      .length
  ).toEqual(2);

  fireEvent.click(btn!);

  await wait(200);
  expect(container).toMatchSnapshot();
  expect(
    container.querySelectorAll('.cxd-Nav-item:not(.cxd-Nav-item-overflow)')!
      .length
  ).toEqual(8);

  const popOver = container.querySelector('.cxd-PopOver')!;
  expect(popOver).toHaveClass('thisisoverflowPopoverClassName');
  expect(popOver.querySelector('.cxd-Nav-list')!).toHaveClass(
    'thisisoverflowListClassName'
  );
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

  expect(container.querySelectorAll('.cxd-Nav-item').length).toBe(3);
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

  expect(
    container.querySelectorAll('.cxd-Nav-list > .cxd-Nav-item').length
  ).toBe(3);

  const navThreeHeader = getByTitle('Nav 3');
  expect(navThreeHeader).toBeInTheDocument();

  fireEvent.click(navThreeHeader?.querySelector('.cxd-Nav-itemToggler')!);

  await wait(200);
  expect(fetcher).toBeCalledTimes(2);
  expect(fetcher.mock.calls[1][0]).toEqual({
    config: {},
    method: 'get',
    query: {parentId: '3'},
    url: '/api/options/nav?parentId=3'
  });

  await wait(200);
  const navThree = container.querySelector(
    '.cxd-Nav-list > .cxd-Nav-item:last-of-type'
  );

  expect(
    navThree!.querySelectorAll('.cxd-Nav-subItems > .cxd-Nav-item').length
  ).toBe(2);
  expect(getByText('Nav 3-2')).not.toBeNull();
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
    container.querySelector('.cxd-Nav-item-atcions .cxd-Button')!
  );

  await wait(200);
  expect(container).toMatchSnapshot();
  expect(getByText('编辑')).toBeInTheDocument();
});
