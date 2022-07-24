import React = require('react');
import {render, waitFor} from '@testing-library/react';
import '../../src';
import {render as amisRender} from '../../src';
import {makeEnv, wait} from '../helper';
import rows from '../mockData/rows';

const fetcher = async (config: any) => {
  return {
    status: 200,
    headers: {},
    data: {
      status: 0,
      msg: '',
      data: {
        count: 144,
        rows
      }
    }
  };
};

test('Renderer:crud', async () => {
  const {container, getByText} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'crud',
          api: '/api/mock2/sample',
          syncLocation: false,
          columns: [
            {
              name: '__id',
              label: 'ID'
            },
            {
              name: 'engine',
              label: 'Rendering engine'
            },
            {
              name: 'browser',
              label: 'Browser'
            },
            {
              name: 'platform',
              label: 'Platform(s)'
            },
            {
              name: 'version',
              label: 'Engine version'
            },
            {
              name: 'grade',
              label: 'CSS grade'
            }
          ]
        }
      },
      {},
      makeEnv({fetcher})
    )
  );

  await waitFor(() => {
    expect(getByText('Internet Explorer 4.0')).toBeInTheDocument();
    expect(
      container.querySelector('[data-testid="spinner"]')
    ).not.toBeInTheDocument();
  });
  expect(container).toMatchSnapshot();
});

test('Renderer:crud loadDataOnce', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'crud',
          api: '/api/mock2/sample',
          syncLocation: false,
          loadDataOnce: true,
          columns: [
            {
              name: '__id',
              label: 'ID'
            },
            {
              name: 'engine',
              label: 'Rendering engine'
            },
            {
              name: 'browser',
              label: 'Browser'
            },
            {
              name: 'platform',
              label: 'Platform(s)'
            },
            {
              name: 'version',
              label: 'Engine version'
            },
            {
              name: 'grade',
              label: 'CSS grade'
            }
          ]
        }
      },
      {},
      makeEnv({fetcher})
    )
  );

  await wait(300);
  expect(container.querySelector('.cxd-Crud-pager')).not.toBeInTheDocument();
});

test('Renderer:crud list', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'crud',
          api: '/api/mock2/sample',
          mode: 'list',
          placeholder: '当前组内, 还没有配置任何权限.',
          syncLocation: false,
          title: 'list title',
          listItem: {
            title: '$engine',
            subTitle: '$browser'
          }
        }
      },
      {},
      makeEnv({fetcher})
    )
  );
  expect(container).toMatchSnapshot();
  await wait(300);
  expect(container).toMatchSnapshot();
});

test('Renderer:crud cards', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'crud',
          api: '/api/mock2/sample',
          syncLocation: false,
          mode: 'cards',
          defaultParams: {
            perPage: 6
          },
          switchPerPage: false,
          placeholder: '没有用户信息',
          columnsCount: 2,
          card: {
            header: {
              className: 'bg-white',
              title: '$engine',
              subTitle: '$engine',
              description: '$engine',
              avatar: '${engine | raw}',
              highlight: '${version == "1.9"}',
              avatarClassName: 'pull-left thumb-md avatar b-3x m-r'
            },
            bodyClassName: 'padder',
            body: 'hello'
          }
        }
      },
      {},
      makeEnv({fetcher})
    )
  );

  expect(container).toMatchSnapshot();
  await wait(300);
  expect(container).toMatchSnapshot();
});

test('Renderer:crud [source]', async () => {
  const {container, getByText} = render(
    amisRender(
      {
        type: 'page',
        data: {
          fields: rows
        },
        body: {
          type: 'crud',
          source: 'fields',
          columns: [
            {
              name: '__id',
              label: 'ID'
            },
            {
              name: 'engine',
              label: 'Rendering engine'
            },
            {
              name: 'browser',
              label: 'Browser'
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

test('Renderer:crud filter', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'crud',
          api: '/api/mock2/sample',
          filter: {
            title: '条件搜索',
            body: [
              {
                type: 'input-text',
                name: 'keywords',
                placeholder: '通过关键字搜索',
                value: '123'
              }
            ]
          },
          syncLocation: false,
          columns: [
            {
              name: '__id',
              label: 'ID'
            },
            {
              name: 'engine',
              label: 'Rendering engine'
            },
            {
              name: 'browser',
              label: 'Browser'
            },
            {
              name: 'platform',
              label: 'Platform(s)'
            },
            {
              name: 'version',
              label: 'Engine version'
            },
            {
              name: 'grade',
              label: 'CSS grade'
            }
          ]
        }
      },
      {},
      makeEnv({fetcher})
    )
  );

  // await wait(300);
  await waitFor(() => {
    expect(
      container.querySelector('[data-testid="spinner"]')
    ).not.toBeInTheDocument();
  });
  expect(container).toMatchSnapshot();
});
