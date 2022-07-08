import React = require('react');
import {
  cleanup,
  fireEvent,
  render,
  waitFor,
  screen
} from '@testing-library/react';
import '../../src';
import {clearStoresCache, render as amisRender} from '../../src';
import {makeEnv, wait} from '../helper';
import rows from '../mockData/rows';

afterEach(() => {
  cleanup();
  clearStoresCache();
  jest.useRealTimers();
});

async function fetcher(config: any) {
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
}

test('Renderer:crud basic interval', async () => {
  const mockFetcher = jest.fn(fetcher);
  const {container, getByText} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'crud',
          api: '/api/mock2/sample',
          syncLocation: false,
          interval: 1000,
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
      makeEnv({fetcher: mockFetcher})
    )
  );

  await waitFor(() => {
    expect(getByText('Internet Explorer 4.0')).toBeInTheDocument();
    expect(
      container.querySelector('[data-testid="spinner"]')
    ).not.toBeInTheDocument();
  });
  expect(container).toMatchSnapshot();

  await wait(1001);
  expect(mockFetcher.mock.calls.length).toEqual(2);
});

test('Renderer:crud stopAutoRefreshWhen', async () => {
  const mockFetcher2 = jest.fn(fetcher);
  render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'crud',
          api: '/api/mock2/sample',
          syncLocation: false,
          interval: 1000,
          stopAutoRefreshWhen: 'true',
          columns: [
            {
              name: '__id',
              label: 'ID'
            }
          ]
        }
      },
      {},
      makeEnv({fetcher: mockFetcher2})
    )
  );

  await wait(1500);
  expect(mockFetcher2.mock.calls.length).toEqual(1);
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

test('Renderer:crud filter stopAutoRefreshWhen', async () => {
  const mockFetcher = jest.fn(fetcher);
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
      makeEnv({fetcher: mockFetcher})
    )
  );

  await waitFor(() => {
    expect(
      container.querySelector('[data-testid="spinner"]')
    ).not.toBeInTheDocument();
  });
  expect(container).toMatchSnapshot();
});

test('Renderer:crud draggable & itemDraggableOn', async () => {
  const {container, debug} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'crud',
          api: '/api/mock2/sample',
          syncLocation: false,
          draggable: true,
          itemDraggableOn: '${__id !== 1}',
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
    expect(container.querySelector('[icon="exchange"]')).toBeInTheDocument();
  });
  fireEvent.click(container.querySelector('[icon="exchange"]')!);
  await wait(50);
  expect(container.querySelectorAll('[icon=drag]').length).toBe(9);
});
