import React = require('react');
import {render} from '@testing-library/react';
import '../../src/themes/default';
import {render as amisRender} from '../../src/index';
import {makeEnv} from '../helper';

test('Renderer:breadcrumb', () => {
  const {container} = render(
    amisRender(
      {
        type: 'breadcrumb',
        items: [
          {
            label: '首页',
            href: 'https://baidu.gitee.com/',
            icon: 'fa fa-home'
          },
          {
            label: '上级页面'
          },
          {
            label: '<b>当前页面</b>'
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});

test('Renderer:breadcrumb var', () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        data: {
          breadcrumb: [
            {
              label: '首页',
              href: 'https://baidu.gitee.com/'
            },
            {
              label: '上级页面'
            },
            {
              label: '<b>当前页面</b>'
            }
          ]
        },
        body: {
          type: 'breadcrumb',
          source: '${breadcrumb}'
        }
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});

test('Renderer:breadcrumb separator', () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'breadcrumb',
          separator: '>',
          separatorClassName: 'text-black',
          items: [
            {
              label: '首页',
              href: 'https://baidu.gitee.com/',
              icon: 'fa fa-home'
            },
            {
              label: '上级页面'
            },
            {
              label: '<b>当前页面</b>'
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

test('Renderer:breadcrumb dropdown', () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'breadcrumb',
          items: [
            {
              label: '首页',
              href: 'https://baidu.gitee.com/',
              icon: 'fa fa-home'
            },
            {
              label: '上级页面',
              dropdown: [
                {
                  label: '选项一',
                  href: 'https://baidu.gitee.com/',
                },
                {
                  label: '选项二',
                }
              ]
            },
            {
              label: '<b>当前页面</b>'
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
