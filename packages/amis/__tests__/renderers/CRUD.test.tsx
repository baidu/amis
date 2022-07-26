import React = require('react');
import {cleanup, fireEvent, render, waitFor} from '@testing-library/react';
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

test('Renderer:crud basic interval headerToolbar footerToolbar', async () => {
  const mockFetcher = jest.fn(fetcher);
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'crud',
          api: '/api/mock2/sample',
          syncLocation: false,
          interval: 1000,
          perPage: 2,
          headerToolbar: ['export-excel', 'statistics'],
          footerToolbar: ['pagination', 'export-excel'],
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
      makeEnv({fetcher: mockFetcher})
    )
  );

  await waitFor(() => {
    expect(container.querySelectorAll('tbody>tr').length > 5).toBeTruthy();
  });

  expect(container).toMatchSnapshot();

  await wait(1001);
  expect(mockFetcher).toHaveBeenCalledTimes(2);
});

test('Renderer:crud stopAutoRefreshWhen', async () => {
  const mockFetcher = jest.fn(fetcher);
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
      makeEnv({fetcher: mockFetcher})
    )
  );

  await wait(1001);
  expect(mockFetcher).toHaveBeenCalledTimes(1);
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

  await waitFor(() => {
    expect(container.querySelectorAll('tbody>tr').length > 5).toBeTruthy();
  });
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
  await waitFor(() => {
    expect(container.querySelectorAll('.cxd-ListItem').length > 5).toBeTruthy();
  });
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
  await waitFor(() =>
    expect(container.querySelector('.cxd-Card-title')).toBeInTheDocument()
  );
  expect(container).toMatchSnapshot();
});

test('Renderer:crud source & alwaysShowPagination', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        data: {
          fields: rows
        },
        body: {
          type: 'crud',
          source: 'fields',
          alwaysShowPagination: true,
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
  const mockFetcher = jest.fn(fetcher);
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'crud',
          api: '/api/mock2/sample',
          defaultParams: {defaultValue: 'defaultValue'},
          pageField: 'customPageField',
          perPageField: 'customPerPageField',
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
    expect(container.querySelectorAll('tbody>tr').length > 5).toBeTruthy();
  });

  const {query} = mockFetcher.mock.calls[0][0];
  expect(query.defaultValue).toBe('defaultValue');
  expect(query.keywords).toBe('123');
  expect(query.customPageField).toBe(1);
  expect(query.customPerPageField).toBe(10);
});

test('Renderer:crud draggable & itemDraggableOn', async () => {
  const {container} = render(
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
  await waitFor(() => {
    expect(container.querySelector('[icon=drag]')).toBeInTheDocument();
  });
  expect(container.querySelectorAll('[icon=drag]').length).toBe(9);
});

test('Renderer:crud quickEdit quickSaveApi', async () => {
  const mockFetcher = jest.fn(fetcher);
  const {container, getAllByText} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'crud',
          api: '/api/mock2/sample',
          syncLocation: false,
          stopAutoRefreshWhen: 'true',
          quickSaveApi: '/api/mock2/sample/bulkUpdate',
          columns: [
            {
              name: '__id',
              label: 'ID'
            },
            {
              name: 'engine',
              label: 'Rendering engine',
              quickEdit: true
            },
            {
              name: 'browser',
              label: 'Browser',
              quickEdit: {
                saveImmediately: true
              }
            }
          ]
        }
      },
      {},
      makeEnv({fetcher: mockFetcher})
    )
  );

  await waitFor(() => {
    expect(container.querySelectorAll('tbody>tr').length > 5).toBeTruthy();
  });
  fireEvent.click(container.querySelector('.cxd-Field-quickEditBtn')!);
  await waitFor(() => {
    expect(container.querySelector('input[name="engine"]')).toBeInTheDocument();
  });
  fireEvent.change(container.querySelector('input[name="engine"]')!, {
    target: {value: 'xxx'}
  });
  fireEvent.click(container.querySelector('button[type="submit"]')!);
  await waitFor(() => {
    expect(
      container.querySelector('input[name="engine"]')
    ).not.toBeInTheDocument();
  });
  fireEvent.click(getAllByText('提交')[0]!);
  await wait(10);
  // * 提交后会调用一次  quickSaveApi 和 api
  expect(mockFetcher).toBeCalledTimes(3);
});

test('Renderer:crud quickSaveItemApi saveImmediately', async () => {
  const mockFetcher = jest.fn(fetcher);
  const {container, getAllByText} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'crud',
          api: '/api/mock2/sample',
          syncLocation: false,
          stopAutoRefreshWhen: 'true',
          quickSaveItemApi: '/api/mock2/sample/$id',
          hideQuickSaveBtn: true,
          columns: [
            {
              name: '__id',
              label: 'ID'
            },
            {
              name: 'browser',
              label: 'Browser',
              quickEdit: {
                saveImmediately: true
              }
            }
          ]
        }
      },
      {},
      makeEnv({fetcher: mockFetcher})
    )
  );

  await waitFor(() => {
    expect(container.querySelectorAll('tbody>tr').length > 5).toBeTruthy();
  });
  fireEvent.click(container.querySelector('.cxd-Field-quickEditBtn')!);
  await waitFor(() => {
    expect(
      container.querySelector('input[name="browser"]')
    ).toBeInTheDocument();
  });
  fireEvent.change(container.querySelector('input[name="browser"]')!, {
    target: {value: 'xxx'}
  });
  fireEvent.click(container.querySelector('button[type="submit"]')!);
  await waitFor(() => {
    expect(
      container.querySelector('input[name="browser"]')
    ).not.toBeInTheDocument();
  });

  // * 提交后会调用一次  quickSaveItemApi 和 api
  expect(mockFetcher.mock.calls[1][0].url).toBe('/api/mock2/sample/');
  expect(mockFetcher).toBeCalledTimes(3);
});

test('Renderer:crud bulkActions', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'crud',
          api: '/api/mock2/sample',
          syncLocation: false,
          bulkActions: [
            {
              label: '批量删除',
              actionType: 'ajax',
              api: 'delete:/amis/api/mock2/sample/${ids|raw}',
              confirmText: '确定要批量删除?'
            }
          ],
          columns: [
            {
              name: '__id',
              label: 'ID'
            },
            {
              name: 'engine',
              label: 'Rendering engine',
              quickEdit: true
            },
            {
              name: 'browser',
              label: 'Browser',
              quickEdit: {
                saveImmediately: true
              }
            }
          ]
        }
      },
      {},
      makeEnv({fetcher})
    )
  );

  await waitFor(() => {
    expect(container.querySelectorAll('tbody>tr').length > 5).toBeTruthy();
  });
  expect(
    container.querySelector('.cxd-Button.is-disabled')
  ).toBeInTheDocument();
  fireEvent.click(
    container.querySelector('.cxd-Table-checkCell input[type="checkbox"]')!
  );
  await waitFor(() => {
    expect(
      container.querySelector('.cxd-Button.is-disabled')
    ).not.toBeInTheDocument();
  });
});

test('Renderer: crud sortable & orderBy & orderDir & orderField', async () => {
  const mockFetcher = jest.fn(fetcher);
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'crud',
          api: '/api/mock2/sample',
          orderBy: 'id',
          orderDir: 'desc',
          syncLocation: false,
          orderField: 'xxx',
          columns: [
            {
              name: '__id',
              label: 'ID',
              sortable: true
            },
            {
              name: 'engine',
              label: 'Rendering engine',
              quickEdit: true
            }
          ]
        }
      },
      {},
      makeEnv({fetcher: mockFetcher})
    )
  );

  await waitFor(() => {
    expect(container.querySelectorAll('tbody>tr').length > 5).toBeTruthy();
  });
  expect(mockFetcher.mock.calls[0][0].query).toEqual({
    orderBy: 'id',
    orderDir: 'desc',
    page: 1,
    perPage: 10
  });
  expect(container).toMatchSnapshot();
});

test('Renderer: crud keepItemSelectionOnPageChange & maxKeepItemSelectionLength & labelTpl', async () => {
  const mockFetcher = jest.fn(fetcher);
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'crud',
          api: '/api/mock2/sample',
          syncLocation: false,
          keepItemSelectionOnPageChange: true,
          maxKeepItemSelectionLength: 4,
          labelTpl: '${id}${engine}',
          bulkActions: [
            {
              label: '批量删除',
              actionType: 'ajax',
              api: ''
            }
          ],
          columns: [
            {
              name: '__id',
              label: 'ID',
              sortable: true
            },
            {
              name: 'engine',
              label: 'Rendering engine',
              quickEdit: true
            }
          ]
        }
      },
      {},
      makeEnv({fetcher: mockFetcher})
    )
  );

  await waitFor(() => {
    expect(container.querySelectorAll('tbody>tr').length > 5).toBeTruthy();
  });
  // 点击全部
  fireEvent.click(container.querySelector('th input[type="checkbox"]')!);
  await waitFor(() => {
    expect(
      container.querySelectorAll('.cxd-Crud-selection>.cxd-Crud-value').length
    ).toBe(4);
  });
  expect(container).toMatchSnapshot();
});

test('Renderer: crud autoGenerateFilter', async () => {
  const mockFetcher = jest.fn(fetcher);
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'crud',
          api: '/api/mock2/sample',
          syncLocation: false,
          autoGenerateFilter: true,
          bulkActions: [
            {
              label: '批量删除',
              actionType: 'ajax',
              api: ''
            }
          ],
          columns: [
            {
              name: '__id',
              label: 'ID',
              sortable: true,
              searchable: {
                type: 'input-text',
                name: 'id',
                label: '主键',
                placeholder: '输入id'
              }
            },
            {
              name: 'engine',
              label: 'Rendering engine',
              quickEdit: true
            }
          ]
        }
      },
      {},
      makeEnv({fetcher: mockFetcher})
    )
  );

  await waitFor(() => {
    expect(container.querySelectorAll('tbody>tr').length > 5).toBeTruthy();
  });

  expect(
    container.querySelector('input[name="id"][placeholder="输入id"]')
  ).toBeInTheDocument();
});
