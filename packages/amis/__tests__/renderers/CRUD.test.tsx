/**
 * 组件名称：CRUD 增删改查
 * 单测内容：
 * 01. interval & headerToolbar & footerToolbar
 * 02. stopAutoRefreshWhen 停止自动刷新条件
 * 03. loadDataOnce 前端分页加载
 * 04. list模式
 * 05. card模式
 * 06. source 数据源 & alwaysShowPagination 总是显示分页
 * 07. filter 过滤器
 * 08. draggable & itemDraggableOn 拖拽
 * 09. quickEdit & quickSaveApi 快速编辑
 * 10. quickSaveItemApi 即时保存
 * 11. bulkActions 批量操作
 * 12. sortable & orderBy & orderDir & orderField 排序
 * 13. keepItemSelectionOnPageChange & maxKeepItemSelectionLength & labelTpl
 * 14. autoGenerateFilter 自动生成查询表单
 * 15. group 分组
 */

import {
  cleanup,
  fireEvent,
  render,
  waitFor,
  waitForElementToBeRemoved
} from '@testing-library/react';
import '../../src';
import {clearStoresCache, render as amisRender} from '../../src';
import {makeEnv as makeEnvRaw, wait} from '../helper';
import rows from '../mockData/rows';
import type {RenderOptions} from '../../src';

afterEach(() => {
  cleanup();
  clearStoresCache();
  jest.useRealTimers();
});

/** 避免updateLocation里的console.error */
const makeEnv = (env?: Partial<RenderOptions>) =>
  makeEnvRaw({updateLocation: () => {}, ...env});

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

  await waitFor(() => {
    expect(container.querySelector('.cxd-Card-title')).toBeInTheDocument();
  });
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

test('Renderer:crud group', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'crud',
        bulkActions: [
          {
            label: '批量删除',
            actionType: 'ajax',
            api: 'delete:/amis/api/mock2/sample/${ids|raw}',
            confirmText: '确定要批量删除?'
          },
          {
            label: '批量修改',
            actionType: 'dialog',
            dialog: {
              title: '批量编辑',
              body: {
                type: 'form',
                api: '/amis/api/mock2/sample/bulkUpdate2',
                body: [
                  {
                    type: 'hidden',
                    name: 'ids'
                  },
                  {
                    type: 'input-text',
                    name: 'engine',
                    label: 'Engine'
                  }
                ]
              }
            }
          }
        ],
        data: {
          items: [
            {
              engine: 'Trident',
              browser: 'Internet Explorer 4.2',
              platform: 'Win 95+',
              version: '4',
              grade: 'A',
              id: 1
            },
            {
              engine: 'Trident',
              browser: 'Internet Explorer 4.2',
              platform: 'Win 95+',
              version: '4',
              grade: 'B',
              id: 2
            },
            {
              engine: 'Trident',
              browser: 'AOL browser (AOL desktop)',
              platform: 'Win 95+',
              version: '4',
              grade: 'C',
              id: 3
            },
            {
              engine: 'Trident',
              browser: 'AOL browser (AOL desktop)',
              platform: 'Win 98',
              version: '3',
              grade: 'A',
              id: 4
            },
            {
              engine: 'Trident',
              browser: 'AOL browser (AOL desktop)',
              platform: 'Win 98',
              version: '4',
              grade: 'A',
              id: 5
            },
            {
              engine: 'Gecko',
              browser: 'Firefox 1.0',
              platform: 'Win 98+ / OSX.2+',
              version: '4',
              grade: 'A',
              id: 6
            },
            {
              engine: 'Gecko',
              browser: 'Firefox 1.0',
              platform: 'Win 98+ / OSX.2+',
              version: '5',
              grade: 'A',
              id: 7
            },
            {
              engine: 'Gecko',
              browser: 'Firefox 2.0',
              platform: 'Win 98+ / OSX.2+',
              version: '5',
              grade: 'B',
              id: 8
            },
            {
              engine: 'Gecko',
              browser: 'Firefox 2.0',
              platform: 'Win 98+ / OSX.2+',
              version: '5',
              grade: 'C',
              id: 9
            },
            {
              engine: 'Gecko',
              browser: 'Firefox 2.0',
              platform: 'Win 98+ / OSX.2+',
              version: '5',
              grade: 'D',
              id: 10
            }
          ]
        },
        columns: [
          {
            name: 'engine',
            label: 'Rendering engine',
            groupName: 'A'
          },
          {
            name: 'browser',
            label: 'Browser',
            groupName: 'A'
          },
          {
            name: 'grade',
            label: 'CSS grade'
          }
        ]
      },
      {},
      makeEnv({fetcher})
    )
  );

  await waitFor(() => {
    expect(container.querySelectorAll('tbody>tr').length > 5).toBeTruthy();
  });
  expect(
    (
      container.querySelector('th.cxd-Table-checkCell') as HTMLElement
    ).getAttribute('rowSpan')
  ).toBe('2');
});

test('Renderer: crud searchable sortable filterable', async () => {
  const mockFetcher = jest.fn(fetcher);
  const {container, debug, getByText} = render(
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
              label: 'Rendering engine',
              quickEdit: true,
              sortable: true,
              searchable: true,
              options: ['1', '2', '3']
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

  expect(container.querySelector('[icon="filter"]')).not.toBeInTheDocument();

  fireEvent.click(container.querySelector('[icon="search"]')!);

  await waitFor(() => {
    expect(container.querySelector('.cxd-PopOver')).toBeInTheDocument();
  });

  // 弹窗中没有 排序
  expect(container.querySelectorAll('[data-role="form-item"]').length).toBe(1);
});
