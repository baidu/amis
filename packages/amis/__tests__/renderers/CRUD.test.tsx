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
 * 16. searchable & sortable & filterable
 * 17. api 返回格式支持取对象中的第一个数组
 * 18. CRUD 事件
 * 19. fetchInitData silent 静默请求
 * 20. CRUD表头查询字段更新后严格比较场景
 * 21. 通过reUseRow为false强制清空表格状态
 * 22. reload 后清空选项
 * 23. Nested CRUD change to normal CRUD
 * 24. CRUD toolbar form
 */

import {
  cleanup,
  fireEvent,
  render,
  waitFor,
  screen
} from '@testing-library/react';
import '../../src';
import {clearStoresCache, render as amisRender} from '../../src';
import {makeEnv as makeEnvRaw, replaceReactAriaIds, wait} from '../helper';
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

test('1. Renderer:crud basic interval headerToolbar footerToolbar', async () => {
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
          footerToolbar: [
            'pagination',
            {
              type: 'pagination',
              total: '${count}',
              layout: 'total,perPage,pager,go',
              mode: 'normal',
              activePage: 2,
              perPage: 10,
              maxButtons: 7,
              showPerPage: true,
              perPageAvailable: [10, 20, 50, 100],
              showPageInput: true,
              disabled: false
            },
            'export-excel'
          ],
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
  replaceReactAriaIds(container);

  await waitFor(() => {
    expect(container.querySelectorAll('tbody>tr').length > 5).toBeTruthy();
  });

  replaceReactAriaIds(container);
  expect(container).toMatchSnapshot();

  await wait(1001);
  expect(mockFetcher).toHaveBeenCalledTimes(2);
});

test('2. Renderer:crud stopAutoRefreshWhen', async () => {
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

test('3. Renderer:crud loadDataOnce', async () => {
  const {container, findByRole, findByText} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'crud',
          syncLocation: false,
          api: 'https://aisuda.bce.baidu.com/amis/api/mock2/sample',
          loadDataOnce: true,
          autoGenerateFilter: {
            columnsNum: 4,
            showBtnToolbar: false
          },
          columns: [
            {
              name: 'id',
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
              label: 'Engine version',
              searchable: {
                type: 'select',
                name: 'version',
                label: 'version',
                placeholder: 'version',
                clearable: true,
                multiple: true,
                searchable: true,
                checkAll: true,
                options: ['1', '4', '5'],
                maxTagCount: 10,
                extractValue: true,
                joinValues: false,
                delimiter: ',',
                defaultCheckAll: false,
                checkAllLabel: '全选'
              }
            },
            {
              name: 'grade',
              label: 'CSS grade',
              sortable: true
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

  const select = await findByRole('combobox');
  fireEvent.click(select);
  await wait(300);

  const tem4 = container.querySelector('div[title="4"] label');
  expect(tem4).not.toBeNull();
  const tem5 = container.querySelector('div[title="5"] label');
  expect(tem5).not.toBeNull();
  fireEvent.click(tem4 as Element);
  await wait(300);
  fireEvent.click(tem5 as Element);
  await wait(300);

  fireEvent.click(select);
  await wait(100);

  const searchBtn = await findByText('搜索');
  fireEvent.click(searchBtn);

  await waitFor(() => {
    expect(container.querySelectorAll('tbody>tr').length > 5).toBeTruthy();
  });

  expect(
    container.querySelectorAll('.cxd-Table-tr--1th .cxd-PlainField')[4]
      ?.innerHTML
  ).toEqual('4');
  // 啥意思？为何不能有分页？
  // expect(container.querySelector('.cxd-Crud-pager')).not.toBeInTheDocument();
  // expect(container).toMatchSnapshot();
});

test('4. Renderer:crud list', async () => {
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
  replaceReactAriaIds(container);
  expect(container).toMatchSnapshot();
});

test('5. Renderer:crud cards', async () => {
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
  replaceReactAriaIds(container);
  expect(container).toMatchSnapshot();
});

test('6. Renderer:crud source & alwaysShowPagination', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        data: {
          fields: rows
        },
        body: {
          type: 'crud',
          source: '${fields}',
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
  replaceReactAriaIds(container);
  expect(container).toMatchSnapshot();
});

test('7. Renderer:crud filter', async () => {
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

test('8. Renderer:crud draggable & itemDraggableOn', async () => {
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

test('9. Renderer:crud quickEdit quickSaveApi', async () => {
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

test('10. Renderer:crud quickSaveItemApi saveImmediately', async () => {
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

test('11. Renderer:crud bulkActions', async () => {
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

test('12. Renderer: crud sortable & orderBy & orderDir & orderField', async () => {
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
  // replaceReactAriaIds(container);
  // expect(container).toMatchSnapshot();
});

test('13. enderer: crud keepItemSelectionOnPageChange & maxKeepItemSelectionLength & labelTpl', async () => {
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
  replaceReactAriaIds(container);
  await wait(20);
  expect(container).toMatchSnapshot();
});

test('14. Renderer: crud autoGenerateFilter', async () => {
  const mockFetcher = jest.fn(fetcher);
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'crud',
          api: '/api/mock2/sample',
          syncLocation: false,
          autoGenerateFilter: {
            columnsNum: 4,
            showBtnToolbar: false
          },
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

test('15. Renderer:crud group', async () => {
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

test('16. Renderer: crud searchable sortable filterable', async () => {
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

test('17. should use the first array item in the response if provided', async () => {
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          whateverKey: [
            {
              engine: 'Chrome'
            },
            {
              engine: 'IE'
            }
          ]
        }
      }
    })
  );
  const {container} = render(
    amisRender(
      {
        type: 'crud',
        api: '/api/mock/sample',
        columns: [
          {
            name: 'engine',
            label: 'Rendering engine'
          }
        ]
      },
      {},
      {
        fetcher
      }
    )
  );

  await wait(200);
  expect(container.querySelectorAll('tbody>tr').length).toBe(2);
});

describe('18. inner events', () => {
  test('18-1. should call the callback function if provided while double clicking a row of the crud', async () => {
    const mockFn = jest.fn();
    render(
      amisRender(
        {
          type: 'crud',
          data: {
            items: rows
          },
          columns: [
            {
              name: 'engine',
              label: 'Rendering engine'
            }
          ],
          onEvent: {
            rowDbClick: {
              actions: [
                {
                  actionType: 'custom',
                  script: mockFn
                }
              ]
            }
          }
        },
        {}
      )
    );

    await waitFor(() => {
      const ele = screen.getAllByText('Trident');
      fireEvent.dblClick(ele[0]);
      expect(mockFn).toBeCalledTimes(1);
    });
  });
});

test('19. fetchInitData silent true', async () => {
  const notify = jest.fn();
  const fetcher = jest.fn().mockImplementationOnce(() => {
    return new Promise(resolve =>
      resolve({
        data: {
          status: 500,
          msg: 'Internal Error'
        }
      })
    );
  });
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: [
          {
            type: 'crud',
            api: {
              method: 'get',
              url: '/api/mock/sample',
              silent: true
            },
            columns: [
              {
                name: 'engine',
                label: 'Rendering engine'
              }
            ]
          },
          {
            type: 'crud',
            api: {
              method: 'get',
              url: '/api/mock/sample',
              silent: false
            },
            columns: [
              {
                name: 'engine',
                label: 'Rendering engine'
              }
            ]
          }
        ]
      },
      {},
      {
        fetcher,
        notify
      }
    )
  );

  await waitFor(() => {
    expect(notify).toBeCalledTimes(1);
  });
});

test('20. CRUD filters contain fields that modification inspection should use strict mode', async () => {
  let keyword;
  const mockFetcher = jest.fn().mockImplementation(req => {
    /** mock.calls[0][0]拿不到filter里的参数，先用闭包测试吧 */
    keyword = req.data.version;
    return Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          count: 0,
          items: []
        }
      }
    });
  });
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: [
          {
            type: 'crud',
            name: 'crud',
            syncLocation: false,
            api: {
              method: 'post',
              url: '/api/mock/crud'
            },
            filter: {
              body: [
                {
                  type: 'select',
                  name: 'version',
                  label: 'version',
                  clearable: true,
                  options: [
                    {label: '0', value: 0},
                    {label: '1', value: 1},
                    {label: 'true', value: true},
                    {label: 'false', value: false},
                    {label: 'emptyString', value: ''},
                    {label: 'stringZero', value: '0'},
                    {label: 'stringOne', value: '1'}
                  ]
                }
              ],
              actions: [
                {
                  type: 'submit',
                  label: 'SubmitBtn',
                  primary: true
                }
              ]
            },
            columns: [
              {
                name: 'id',
                label: 'ID'
              },
              {
                name: 'version',
                label: 'Engine version engine'
              }
            ]
          }
        ]
      },
      {},
      makeEnv({fetcher: mockFetcher})
    )
  );

  const select = container.querySelector('.cxd-Select')!;
  const submitBtn = container.querySelector("button[type='submit']")!;

  fireEvent.click(select);
  await wait(200);
  let options = container.querySelectorAll('.cxd-Select-option-content');
  fireEvent.click(options[0]);
  await wait(200);
  fireEvent.click(submitBtn);
  await wait(200);
  expect(keyword).toEqual(0);

  /** 从 0 -> false 查询成功 */
  fireEvent.click(select);
  await wait(200);
  options = container.querySelectorAll('.cxd-Select-option-content');
  fireEvent.click(options[3]);
  await wait(200);
  fireEvent.click(submitBtn);
  await wait(200);
  expect(keyword).toEqual(false);

  /** 从 false -> '' 查询成功 */
  fireEvent.click(select);
  await wait(200);
  options = container.querySelectorAll('.cxd-Select-option-content');
  fireEvent.click(options[4]);
  await wait(200);
  fireEvent.click(submitBtn);
  await wait(200);
  expect(keyword).toEqual('');

  /** 从 '' -> 0 查询成功 */
  fireEvent.click(select);
  await wait(200);
  options = container.querySelectorAll('.cxd-Select-option-content');
  fireEvent.click(options[0]);
  await wait(200);
  fireEvent.click(submitBtn);
  await wait(200);
  expect(keyword).toEqual(0);

  /** 切换到1 */
  fireEvent.click(select);
  await wait(200);
  options = container.querySelectorAll('.cxd-Select-option-content');
  fireEvent.click(options[1]);
  await wait(200);
  fireEvent.click(submitBtn);
  await wait(200);
  expect(keyword).toEqual(1);

  /** 从 1 -> true 查询成功 */
  fireEvent.click(select);
  await wait(200);
  options = container.querySelectorAll('.cxd-Select-option-content');
  fireEvent.click(options[2]);
  await wait(200);
  fireEvent.click(submitBtn);
  await wait(200);
  expect(keyword).toEqual(true);

  /** 从 true -> '1' 查询成功 */
  fireEvent.click(select);
  await wait(200);
  options = container.querySelectorAll('.cxd-Select-option-content');
  fireEvent.click(options[6]);
  await wait(200);
  fireEvent.click(submitBtn);
  await wait(200);
  expect(keyword).toEqual('1');

  /** 切换到false */
  fireEvent.click(select);
  await wait(200);
  options = container.querySelectorAll('.cxd-Select-option-content');
  fireEvent.click(options[3]);
  await wait(200);
  fireEvent.click(submitBtn);
  await wait(200);
  expect(keyword).toEqual(false);

  /** 从 false -> '0' 查询成功 */
  fireEvent.click(select);
  await wait(200);
  options = container.querySelectorAll('.cxd-Select-option-content');
  fireEvent.click(options[5]);
  await wait(200);
  fireEvent.click(submitBtn);
  await wait(200);
  expect(keyword).toEqual('0');
}, 7000);

/**
 * 在reUseRow为false情况下，强制刷新表格行状态
 * case：用户每次刷新，调用接口，返回的数据都是一样的，导致updateRows为false，故针对每次返回数据一致的情况，需要强制表格更新
 */
test('21. CRUD reUseRow set false to reset crud state when api return same data', async () => {
  const mockFetcher = jest.fn().mockImplementation(() => {
    return new Promise(resolve =>
      resolve({
        data: {
          status: 0,
          msg: 'ok',
          data: {
            count: 0,
            items: [
              {
                name: 'name1',
                switch: false
              },
              {
                name: 'name2',
                switch: false
              }
            ]
          }
        }
      })
    );
  });
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: [
          {
            type: 'crud',
            api: '/api/mock/sample',
            headerToolbar: ['reload'],
            reUseRow: false,
            columns: [
              {
                name: 'name',
                label: 'name'
              },
              {
                name: 'switch',
                label: 'switch',
                type: 'switch'
              }
            ]
          }
        ]
      },
      {},
      makeEnv({fetcher: mockFetcher})
    )
  );

  await waitFor(() => {
    expect(container.querySelectorAll('tbody>tr').length >= 2).toBeTruthy();
  });

  // 切换switch
  const switchBtn = container.querySelectorAll('.cxd-Switch');
  fireEvent.click(switchBtn[0]);
  await wait(200);

  const checks1 = container.querySelectorAll('.is-checked');
  expect(checks1.length).toEqual(1);

  // 刷新
  const btn = container.querySelectorAll('.cxd-Button')!;
  fireEvent.click(btn[0]);
  await wait(300);

  const checks2 = container.querySelectorAll('.is-checked');
  expect(checks2.length).toEqual(0);
});

describe('22. CRUD reload and reset selcted rows', () => {
  test('CRUD reload with selection', async () => {
    const mockFetcher = jest.fn().mockImplementation(() => {
      return new Promise(resolve =>
        resolve({
          data: {
            status: 0,
            msg: 'ok',
            data: {
              count: 2,
              items: [
                {
                  engine: 'Trident',
                  browser: 'Internet Explorer 4.0',
                  platform: 'Win 95+',
                  version: '4',
                  grade: 'X',
                  id: 1
                },
                {
                  engine: 'Trident',
                  browser: 'Internet Explorer 5.0',
                  platform: 'Win 95+',
                  version: '5',
                  grade: 'C',
                  id: 2
                }
              ]
            }
          }
        })
      );
    });
    const {container} = render(
      amisRender(
        {
          type: 'page',
          body: [
            {
              type: 'button',
              icon: 'iconfont icon-refresh',
              tooltip: '',
              label: 'CRUD外层按钮',
              level: 'enhance',
              className: 'reload-btn',
              onEvent: {
                click: {
                  weight: 0,
                  actions: [
                    {
                      componentId: 'crudId',
                      ignoreError: false,
                      actionType: 'reload',
                      dataMergeMode: 'override',
                      data: {},
                      args: {
                        resetPage: true
                      }
                    }
                  ]
                }
              }
            },
            {
              type: 'crud',
              name: 'crudName',
              id: 'crudId',
              syncLocation: false,
              api: '/api/mock2/crud/table',
              bulkActions: [
                {
                  label: '批量删除',
                  actionType: 'ajax',
                  api: 'delete:/api/mock2/sample/${ids|raw}',
                  confirmText: '确定要批量删除?'
                },
                {
                  label: '批量修改',
                  actionType: 'dialog',
                  dialog: {
                    title: '批量编辑',
                    body: {
                      type: 'form',
                      api: '/api/mock2/sample/bulkUpdate2',
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
              columns: [
                {
                  name: 'id',
                  label: 'ID'
                },
                {
                  name: 'engine',
                  label: 'Rendering engine'
                }
              ]
            }
          ]
        },
        {},
        makeEnv({fetcher: mockFetcher})
      )
    );

    await wait(300);

    // 全选数据, 选中2条数据
    const checkbox = container.querySelector(
      '.cxd-Table-checkCell input[type="checkbox"]'
    )!;
    fireEvent.click(checkbox);
    expect(
      container.querySelectorAll('.cxd-Table-table-tr.is-checked')?.length
    ).toEqual(2);

    // 刷新数据，选中数据清空
    const reloadBtn = container.querySelector('[type=button].reload-btn')!;
    expect(reloadBtn).toBeInTheDocument();
    fireEvent.click(reloadBtn);
    await wait(200);

    expect(
      container.querySelectorAll('.cxd-Table-table-tr.is-checked')?.length
    ).toEqual(0);
  });

  test('CRUD reload with selection and keepItemSelectionOnPageChange is enabled', async () => {
    const mockFetcher = jest.fn().mockImplementation(() => {
      return new Promise(resolve =>
        resolve({
          data: {
            status: 0,
            msg: 'ok',
            data: {
              count: 2,
              items: [
                {
                  engine: 'Trident',
                  browser: 'Internet Explorer 4.0',
                  platform: 'Win 95+',
                  version: '4',
                  grade: 'X',
                  id: 1
                },
                {
                  engine: 'Trident',
                  browser: 'Internet Explorer 5.0',
                  platform: 'Win 95+',
                  version: '5',
                  grade: 'C',
                  id: 2
                }
              ]
            }
          }
        })
      );
    });
    const {container} = render(
      amisRender(
        {
          type: 'page',
          body: [
            {
              type: 'button',
              icon: 'iconfont icon-refresh',
              tooltip: '',
              label: 'CRUD外层按钮',
              level: 'enhance',
              className: 'reload-btn',
              onEvent: {
                click: {
                  weight: 0,
                  actions: [
                    {
                      componentId: 'crudId',
                      ignoreError: false,
                      actionType: 'reload',
                      dataMergeMode: 'override',
                      data: {},
                      args: {
                        resetPage: true
                      }
                    }
                  ]
                }
              }
            },
            {
              type: 'crud',
              name: 'crudName',
              id: 'crudId',
              syncLocation: false,
              api: '/api/mock2/crud/table',
              keepItemSelectionOnPageChange: true,
              bulkActions: [
                {
                  label: '批量删除',
                  actionType: 'ajax',
                  api: 'delete:/api/mock2/sample/${ids|raw}',
                  confirmText: '确定要批量删除?'
                },
                {
                  label: '批量修改',
                  actionType: 'dialog',
                  dialog: {
                    title: '批量编辑',
                    body: {
                      type: 'form',
                      api: '/api/mock2/sample/bulkUpdate2',
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
              columns: [
                {
                  name: 'id',
                  label: 'ID'
                },
                {
                  name: 'engine',
                  label: 'Rendering engine'
                }
              ]
            }
          ]
        },
        {},
        makeEnv({fetcher: mockFetcher})
      )
    );

    await wait(300);

    // 全选数据, 选中2条数据
    const checkbox = container.querySelector(
      '.cxd-Table-checkCell input[type="checkbox"]'
    )!;
    fireEvent.click(checkbox);
    expect(
      container.querySelectorAll('.cxd-Table-table-tr.is-checked')?.length
    ).toEqual(2);

    // 刷新数据，选中数据清空
    const reloadBtn = container.querySelector('[type=button].reload-btn')!;
    expect(reloadBtn).toBeInTheDocument();
    fireEvent.click(reloadBtn);
    await wait(200);

    expect(
      container.querySelectorAll('.cxd-Table-table-tr.is-checked')?.length
    ).toEqual(0);
  });
});

test('23. Nested CRUD change to normal CRUD', async () => {
  const {container} = render(
    amisRender({
      type: 'page',
      id: 'page',
      data: {
        source: [
          {
            engine: 'Trident',
            browser: 'Internet Explorer 4.0',
            platform: 'Win 95+',
            version: '4',
            grade: 'X',
            id: '1',
            children: [
              {
                engine: 'Trident',
                browser: 'Internet Explorer 5.0',
                platform: 'Win 95+',
                version: '5',
                grade: 'C',
                id: '1-1'
              }
            ]
          },
          {
            engine: 'Trident',
            browser: 'Internet Explorer 5.0',
            platform: 'Win 95+',
            version: '5',
            grade: 'C',
            id: '5'
          }
        ]
      },
      body: [
        {
          type: 'button',
          label: '切换数据源',
          onEvent: {
            click: {
              actions: [
                {
                  actionType: 'setValue',
                  componentId: 'page',
                  args: {
                    value: {
                      source: [
                        {
                          engine: 'Trident',
                          browser: 'Internet Explorer 4.0',
                          platform: 'Win 95+',
                          version: '4',
                          grade: 'X',
                          id: '3'
                        },
                        {
                          engine: 'Trident',
                          browser: 'Internet Explorer 4.0',
                          platform: 'Win 95+',
                          version: '4',
                          grade: 'X',
                          id: '4'
                        }
                      ]
                    }
                  }
                }
              ]
            }
          }
        },
        {
          type: 'crud',
          name: 'crud',
          syncLocation: false,
          source: '${source}',
          draggable: true,
          columns: [
            {
              name: 'id',
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
      ]
    })
  );

  const space = container.querySelectorAll('.cxd-Table-expandSpace');
  const button = container.querySelectorAll('.cxd-Button')[0];
  expect(space.length).toEqual(1);

  fireEvent.click(button);
  await wait(100);

  const newSpace = container.querySelectorAll('.cxd-Table-expandSpace');
  expect(newSpace.length).toEqual(0);
});

// CRUD 列中存在一列 List 组件，List 是带 store 的，crud 的行数据发生切换时，
// 如果 list 关联的数组，从有有成员变成 undefined 时，会出现 List 的数据不更新的问题。
// 原因是 withStore 里面同步逻辑有问题，保留了原来的 store.data
test('25. CRUD Table Cell sync data to store', async () => {
  const {container} = render(
    amisRender({
      type: 'page',
      id: 'page',
      data: {
        source: [
          {
            engine: 'Trident',
            browser: 'Internet Explorer 5.0',
            platform: 'Win 95+',
            version: '5',
            grade: 'C',
            id: '1-1',
            list: [{id: '1-1-1', name: '1-1-1'}]
          },
          {
            engine: 'Trident',
            browser: 'Internet Explorer 5.0',
            platform: 'Win 95+',
            version: '5',
            grade: 'C',
            id: '5'
          }
        ]
      },
      body: [
        {
          type: 'button',
          label: '切换数据源',
          onEvent: {
            click: {
              actions: [
                {
                  actionType: 'setValue',
                  componentId: 'page',
                  args: {
                    value: {
                      source: [
                        {
                          engine: 'Trident',
                          browser: 'Internet Explorer 4.0',
                          platform: 'Win 95+',
                          version: '4',
                          grade: 'X',
                          id: '3'
                        },
                        {
                          engine: 'Trident',
                          browser: 'Internet Explorer 4.0',
                          platform: 'Win 95+',
                          version: '4',
                          grade: 'X',
                          id: '4'
                        }
                      ]
                    }
                  }
                }
              ]
            }
          }
        },
        {
          type: 'crud',
          name: 'crud',
          syncLocation: false,
          source: '${source}',
          draggable: true,
          columns: [
            {
              name: 'id',
              label: 'ID'
            },
            {
              name: 'engine',
              label: 'Rendering engine'
            },
            {
              name: 'list',
              label: 'List',
              type: 'list',
              source: '${list}',
              listItem: {
                title: '${id}-${name}'
              }
            }
          ]
        }
      ]
    })
  );

  await wait(300);

  const button = container.querySelectorAll('.cxd-Button')[0];

  // 刚开始存在 list 字段，所以是 1
  const listDoms = container.querySelectorAll('.cxd-ListItem-title');
  expect(listDoms.length).toEqual(1);

  fireEvent.click(button);
  await wait(300);

  // 切换后 list 字段是 undefined 了，所以应该不显示了
  const listDoms2 = container.querySelectorAll('.cxd-ListItem-title');
  expect(listDoms2.length).toEqual(0);
});
