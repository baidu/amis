import React from 'react';
import Action from '../../src/renderers/Action';
import * as renderer from 'react-test-renderer';
import {
  render,
  fireEvent,
  cleanup,
  screen,
  waitFor,
  within
} from '@testing-library/react';
import {render as amisRender} from '../../src';
import {makeEnv, wait} from '../helper';
import '../../src';

afterEach(cleanup);

// 关联 issue https://github.com/baidu/amis/issues/9564
test('Renderers:App locale', async () => {
  const fetcher = jest.fn().mockImplementation((api, options) => {
    if (api.url.startsWith('/pageList')) {
      return Promise.resolve({
        status: 200,
        data: {
          status: 0,
          msg: '',
          data: {
            pages: [
              {
                children: [
                  {
                    'label': 'Home',
                    'icon': 'fa fa-home',
                    'url': '/admin/page/home',
                    'schemaApi': '/pageDetail',
                    'isDefaultPage': true,
                    'sort': 100,
                    'zh-CN': {
                      label: '首页'
                    }
                  }
                ]
              }
            ]
          }
        }
      });
    } else if (api.url.startsWith('/pageDetail')) {
      return Promise.resolve({
        status: 200,
        data: {
          type: 'page',
          body: [
            {
              'type': 'input-text',
              'name': 'a',
              'label': 'dev',
              'content': 'False',
              'zh-CN': {
                label: '开发环境'
              }
            }
          ]
        }
      });
    }

    return Promise.resolve({
      status: 200,
      data: {
        status: 404,
        msg: 'notFound'
      }
    });
  });

  const {container, getByText} = render(
    amisRender(
      {
        type: 'app',
        api: {
          method: 'get',
          url: '/pageList'
        }
      },
      {
        locale: 'zh-CN'
      },
      makeEnv({
        fetcher
      })
    )
  );

  await wait(500);

  const link = container.querySelector('nav li span');
  expect(link).toBeInTheDocument();
  expect(link!.textContent).toBe('首页');

  const inputLabel = container.querySelector('.cxd-Form-label');
  expect(inputLabel).toBeInTheDocument();
  expect(inputLabel!.textContent).toBe('开发环境');
});
