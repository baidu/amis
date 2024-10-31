/**
 * 组件名称：AnchorNav 锚点导航
 * 单测内容：
 * 1. 基本使用
 * 2. 水平模式
 * 3. 默认定位到某个区域
 */

import React from 'react';
import {render} from '@testing-library/react';
import '../../src';
import {render as amisRender} from '../../src';
import {makeEnv, wait} from '../helper';

const defaultLinks = [
  {
    title: '基本信息',
    body: [
      {
        type: 'form',
        title: '基本信息',
        body: [
          {
            type: 'input-text',
            name: 'name',
            label: '姓名：'
          },
          {
            name: 'email',
            type: 'input-email',
            label: '邮箱：'
          }
        ]
      }
    ]
  },
  {
    title: '工作信息',
    body: [
      {
        type: 'form',
        title: '工作信息',
        body: [
          {
            type: 'input-text',
            name: 'cname',
            label: '公司名称：'
          },
          {
            name: 'caddress',
            type: 'input-text',
            label: '公司地址：'
          }
        ]
      }
    ]
  },
  {
    title: '兴趣爱好',
    body: [
      {
        type: 'form',
        title: '兴趣爱好',
        body: [
          {
            type: 'input-text',
            name: 'interest1',
            label: '兴趣爱好1：'
          },
          {
            name: 'interest2',
            type: 'input-text',
            label: '兴趣爱好2：'
          },
          {
            name: 'interest3',
            type: 'input-text',
            label: '兴趣爱好3：'
          },
          {
            name: 'interest4',
            type: 'input-text',
            label: '兴趣爱好4：'
          },
          {
            name: 'interest5',
            type: 'input-text',
            label: '兴趣爱好5：'
          },
          {
            name: 'interest6',
            type: 'input-text',
            label: '兴趣爱好6：'
          }
        ]
      }
    ]
  }
];

// 1. 基本使用
test('Renderer:anchorNav', () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'anchor-nav',
          links: defaultLinks,
          linkClassName: 'linksWrap',
          sectionClassName: 'sectionsWrap'
        }
      },
      {},
      makeEnv({})
    )
  );

  expect(container.querySelector('.cxd-AnchorNav-link-wrap')).toHaveClass(
    'linksWrap'
  );
  expect(container.querySelector('.cxd-AnchorNav-section-wrap')).toHaveClass(
    'sectionsWrap'
  );

  expect(container).toMatchSnapshot();
});

// 2. 水平模式
test('Renderer:anchorNav with horizontal', () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'anchor-nav',
          direction: 'horizontal',
          links: [
            {
              title: '基本信息',
              body: [
                {
                  type: 'form',
                  title: '基本信息',
                  body: [
                    {
                      type: 'input-text',
                      name: 'name',
                      label: '姓名：'
                    },
                    {
                      name: 'email',
                      type: 'input-email',
                      label: '邮箱：'
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
});

// 3.默认定位到某个区域
test('Renderer:anchorNav with active by index', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: [
          {
            type: 'anchor-nav',
            className: 'one',
            active: 2,
            links: defaultLinks
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

  await wait(500);

  expect(
    container.querySelector('.one .cxd-AnchorNav-link.is-active')
  ).toHaveTextContent('兴趣爱好');
});

test('Renderer:anchorNav with active by href', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: [
          {
            type: 'anchor-nav',
            className: 'two',
            active: 'work',
            links: defaultLinks.map((item, index) => ({
              ...item,
              href: ['base', 'work', 'interest'][index]
            }))
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

  await wait(500);

  expect(
    container.querySelector('.two .cxd-AnchorNav-link.is-active')
  ).toHaveTextContent('工作信息');
});

// 4. 子菜单
test('Renderer:anchorNav with children', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'anchor-nav',
          direction: 'horizontal',
          links: [
            {
              title: '基本信息',
              body: [
                {
                  type: 'form',
                  title: '基本信息',
                  body: [
                    {
                      type: 'input-text',
                      name: 'name',
                      label: '姓名：'
                    },
                    {
                      name: 'email',
                      type: 'input-email',
                      label: '邮箱：'
                    }
                  ]
                }
              ],
              children: [
                {
                  title: '基本信息1-1',
                  body: [
                    {
                      type: 'form',
                      title: '基本信息1-1',
                      body: [
                        {
                          type: 'input-text',
                          name: 'cname1',
                          label: 'cname1'
                        },
                        {
                          name: 'caddress1',
                          type: 'input-text',
                          label: 'caddress1'
                        }
                      ]
                    }
                  ]
                },
                {
                  title: '基本信息1-2',
                  body: [
                    {
                      type: 'form',
                      title: '基本信息1-2',
                      body: [
                        {
                          type: 'input-text',
                          name: 'cname2',
                          label: 'cname2'
                        },
                        {
                          name: 'caddress2',
                          type: 'input-text',
                          label: 'caddress2'
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              title: '工作信息',
              body: [
                {
                  type: 'form',
                  title: '工作信息',
                  body: [
                    {
                      type: 'input-text',
                      name: 'cname',
                      label: '公司名称：'
                    },
                    {
                      name: 'caddress',
                      type: 'input-text',
                      label: '公司地址：'
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

  await wait(500);

  expect(
    container.querySelector('.cxd-AnchorNav-link-child')
  ).toHaveTextContent('基本信息1-1');

  expect(
    container.querySelector('.cxd-AnchorNav-link.is-active')
  ).toHaveTextContent('基本信息');

  expect(container).toMatchSnapshot();
});
