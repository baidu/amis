import React = require('react');
import {render} from '@testing-library/react';
import '../../src/themes/default';
import {render as amisRender} from '../../src/index';
import {makeEnv} from '../helper';

test('Renderer:anchorNav', () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'anchor-nav',
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

  expect(container).toMatchSnapshot();
});

test('Renderer:anchorNav horizontal', () => {
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
