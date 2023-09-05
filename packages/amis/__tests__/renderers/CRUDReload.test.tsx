import {
  render,
  fireEvent,
  waitFor,
  cleanup,
  screen
} from '@testing-library/react';
import '../../src';
import {render as amisRender, clearStoresCache} from '../../src';
import {makeEnv, wait} from '../helper';

afterEach(() => {
  cleanup();
  clearStoresCache();
  jest.useRealTimers();
});

// 验证 crud 里面的 ajax 动作，结束后是否刷新 crud
test('CRUD reload ajax1', async () => {
  let listApiCalledCount = 0;
  const mockFetcher = jest.fn().mockImplementation((api: any) => {
    if (/^\/api\/mock2\/sample\/\d+/.test(api.url)) {
      return Promise.resolve({
        data: {
          status: 0
        }
      });
    }

    listApiCalledCount++;
    return Promise.resolve({
      data: {
        status: 0,
        data: {
          items: [{id: 1, a: 'a1', b: 'b1'}]
        }
      }
    });
  });
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'crud',
          api: '/api/mock2/sample',
          columns: [
            {
              name: 'id',
              label: 'ID'
            },
            {
              name: 'a',
              label: 'A'
            },
            {
              name: 'b',
              label: 'B'
            },
            {
              label: '操作',
              type: 'operation',
              buttons: [
                {
                  label: '保存',
                  type: 'button',
                  actionType: 'ajax',
                  api: '/api/mock2/sample/${id}'
                }
              ]
            }
          ]
        }
      },
      {},
      makeEnv({fetcher: mockFetcher})
    )
  );
  await wait(200);
  const saveBtn = container.querySelectorAll('tbody>tr button')[0];
  expect(saveBtn).toBeTruthy();
  fireEvent.click(saveBtn);
  await waitFor(() => {
    expect(mockFetcher).toBeCalledTimes(3);
  });
  expect(listApiCalledCount).toBe(2);
});

// 如果配置了 reload none 则不刷新
test('CRUD reload ajax2', async () => {
  let listApiCalledCount = 0;
  const mockFetcher = jest.fn().mockImplementation((api: any) => {
    if (/^\/api\/mock2\/sample\/\d+/.test(api.url)) {
      return Promise.resolve({
        data: {
          status: 0
        }
      });
    }

    listApiCalledCount++;
    return Promise.resolve({
      data: {
        status: 0,
        data: {
          items: [{id: 1, a: 'a1', b: 'b1'}]
        }
      }
    });
  });
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'crud',
          api: '/api/mock2/sample',
          columns: [
            {
              name: 'id',
              label: 'ID'
            },
            {
              name: 'a',
              label: 'A'
            },
            {
              name: 'b',
              label: 'B'
            },
            {
              label: '操作',
              type: 'operation',
              buttons: [
                {
                  label: '保存',
                  type: 'button',
                  actionType: 'ajax',
                  api: '/api/mock2/sample/${id}'
                },
                {
                  label: '保存2',
                  type: 'button',
                  actionType: 'ajax',
                  api: '/api/mock2/sample/${id}',
                  reload: 'none'
                }
              ]
            }
          ]
        }
      },
      {},
      makeEnv({fetcher: mockFetcher})
    )
  );
  await wait(200);
  const saveBtn1 = container.querySelectorAll('tbody>tr button')[0];
  const saveBtn2 = container.querySelectorAll('tbody>tr button')[1];
  expect(saveBtn1).toBeTruthy();
  expect(saveBtn2).toBeTruthy();
  fireEvent.click(saveBtn2);
  await waitFor(() => {
    expect(mockFetcher).toBeCalledTimes(2);
  });
  expect(listApiCalledCount).toBe(1);
  fireEvent.click(saveBtn1);
  await waitFor(() => {
    expect(mockFetcher).toBeCalledTimes(4);
  });
  expect(listApiCalledCount).toBe(2);
});

// dialog 提交后应该刷新 crud
test('CRUD reload dialog1', async () => {
  let listApiCalledCount = 0;
  const mockFetcher = jest.fn().mockImplementation((api: any) => {
    if (/^\/api\/mock2\/sample\/\d+/.test(api.url)) {
      return Promise.resolve({
        data: {
          status: 0
        }
      });
    }

    listApiCalledCount++;
    return Promise.resolve({
      data: {
        status: 0,
        data: {
          items: [{id: 1, a: 'a1', b: 'b1'}]
        }
      }
    });
  });
  const {container, getByText}: any = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'crud',
          api: '/api/mock2/sample',
          columns: [
            {
              name: 'id',
              label: 'ID'
            },
            {
              name: 'a',
              label: 'A'
            },
            {
              name: 'b',
              label: 'B'
            },
            {
              label: '操作',
              type: 'operation',
              buttons: [
                {
                  label: 'OpenDialog',
                  type: 'button',
                  actionType: 'dialog',
                  dialog: {
                    body: {
                      type: 'form',
                      api: '/api/mock2/sample/${id}',
                      body: [
                        {
                          type: 'input-text',
                          name: 'a',
                          label: 'A'
                        }
                      ]
                    }
                  }
                }
              ]
            }
          ]
        }
      },
      {},
      makeEnv({fetcher: mockFetcher, getModalContainer: () => container})
    )
  );
  await wait(200);
  const saveBtn = container.querySelectorAll('tbody>tr button')[0];
  expect(saveBtn).toBeTruthy();
  fireEvent.click(saveBtn);
  await wait(300);

  expect(getByText('确认')).toBeInTheDocument();
  fireEvent.click(getByText('取消'));
  await wait(300);

  fireEvent.click(saveBtn);
  await wait(300);
  expect(getByText('确认')).toBeInTheDocument();

  fireEvent.click(getByText('确认'));
  await wait(500);

  expect(mockFetcher).toBeCalledTimes(3);
  expect(listApiCalledCount).toBe(2);
});

// dialog 提交后如果配置列不刷新，则不刷新
test('CRUD reload dialog2', async () => {
  let listApiCalledCount = 0;
  const mockFetcher = jest.fn().mockImplementation((api: any) => {
    if (/^\/api\/mock2\/sample\/\d+/.test(api.url)) {
      return Promise.resolve({
        data: {
          status: 0
        }
      });
    }

    listApiCalledCount++;
    return Promise.resolve({
      data: {
        status: 0,
        data: {
          items: [{id: 1, a: 'a1', b: 'b1'}]
        }
      }
    });
  });
  const {container, getByText}: any = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'crud',
          api: '/api/mock2/sample',
          columns: [
            {
              name: 'id',
              label: 'ID'
            },
            {
              name: 'a',
              label: 'A'
            },
            {
              name: 'b',
              label: 'B'
            },
            {
              label: '操作',
              type: 'operation',
              buttons: [
                {
                  label: 'OpenDialog',
                  type: 'button',
                  actionType: 'dialog',
                  reload: 'none',
                  dialog: {
                    body: {
                      type: 'form',
                      api: '/api/mock2/sample/${id}',
                      body: [
                        {
                          type: 'input-text',
                          name: 'a',
                          label: 'A'
                        }
                      ]
                    }
                  }
                }
              ]
            }
          ]
        }
      },
      {},
      makeEnv({fetcher: mockFetcher, getModalContainer: () => container})
    )
  );
  await wait(200);
  const saveBtn = container.querySelectorAll('tbody>tr button')[0];
  expect(saveBtn).toBeTruthy();
  fireEvent.click(saveBtn);
  await wait(300);

  fireEvent.click(saveBtn);
  await wait(300);
  expect(getByText('确认')).toBeInTheDocument();

  fireEvent.click(getByText('确认'));
  await wait(500);

  expect(mockFetcher).toBeCalledTimes(2);
  expect(listApiCalledCount).toBe(1);
});

// drawer 提交后应该刷新 crud
test('CRUD reload drawer1', async () => {
  let listApiCalledCount = 0;
  const mockFetcher = jest.fn().mockImplementation((api: any) => {
    if (/^\/api\/mock2\/sample\/\d+/.test(api.url)) {
      return Promise.resolve({
        data: {
          status: 0
        }
      });
    }

    listApiCalledCount++;
    return Promise.resolve({
      data: {
        status: 0,
        data: {
          items: [{id: 1, a: 'a1', b: 'b1'}]
        }
      }
    });
  });
  const {container, getByText}: any = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'crud',
          api: '/api/mock2/sample',
          columns: [
            {
              name: 'id',
              label: 'ID'
            },
            {
              name: 'a',
              label: 'A'
            },
            {
              name: 'b',
              label: 'B'
            },
            {
              label: '操作',
              type: 'operation',
              buttons: [
                {
                  label: 'openDrawer',
                  type: 'button',
                  actionType: 'drawer',
                  drawer: {
                    body: {
                      type: 'form',
                      api: '/api/mock2/sample/${id}',
                      body: [
                        {
                          type: 'input-text',
                          name: 'a',
                          label: 'A'
                        }
                      ]
                    }
                  }
                }
              ]
            }
          ]
        }
      },
      {},
      makeEnv({fetcher: mockFetcher, getModalContainer: () => container})
    )
  );
  await wait(200);
  const saveBtn = container.querySelectorAll('tbody>tr button')[0];
  expect(saveBtn).toBeTruthy();
  fireEvent.click(saveBtn);
  await wait(300);

  expect(getByText('确认')).toBeInTheDocument();
  fireEvent.click(getByText('取消'));
  await wait(300);

  fireEvent.click(saveBtn);
  await wait(300);
  expect(getByText('确认')).toBeInTheDocument();

  fireEvent.click(getByText('确认'));
  await wait(500);

  expect(mockFetcher).toBeCalledTimes(3);
  expect(listApiCalledCount).toBe(2);
});

// dialog 提交后如果配置列不刷新，则不刷新
test('CRUD reload drawer2', async () => {
  let listApiCalledCount = 0;
  const mockFetcher = jest.fn().mockImplementation((api: any) => {
    if (/^\/api\/mock2\/sample\/\d+/.test(api.url)) {
      return Promise.resolve({
        data: {
          status: 0
        }
      });
    }

    listApiCalledCount++;
    return Promise.resolve({
      data: {
        status: 0,
        data: {
          items: [{id: 1, a: 'a1', b: 'b1'}]
        }
      }
    });
  });
  const {container, getByText}: any = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'crud',
          api: '/api/mock2/sample',
          columns: [
            {
              name: 'id',
              label: 'ID'
            },
            {
              name: 'a',
              label: 'A'
            },
            {
              name: 'b',
              label: 'B'
            },
            {
              label: '操作',
              type: 'operation',
              buttons: [
                {
                  label: 'openDrawer',
                  type: 'button',
                  actionType: 'drawer',
                  reload: 'none',
                  drawer: {
                    body: {
                      type: 'form',
                      api: '/api/mock2/sample/${id}',
                      body: [
                        {
                          type: 'input-text',
                          name: 'a',
                          label: 'A'
                        }
                      ]
                    }
                  }
                }
              ]
            }
          ]
        }
      },
      {},
      makeEnv({fetcher: mockFetcher, getModalContainer: () => container})
    )
  );
  await wait(200);
  const saveBtn = container.querySelectorAll('tbody>tr button')[0];
  expect(saveBtn).toBeTruthy();
  fireEvent.click(saveBtn);
  await wait(300);

  fireEvent.click(saveBtn);
  await wait(300);
  expect(getByText('确认')).toBeInTheDocument();

  fireEvent.click(getByText('确认'));
  await wait(500);

  expect(mockFetcher).toBeCalledTimes(2);
  expect(listApiCalledCount).toBe(1);
});

test.only('reload event triggered and clear selectedItems & unselectedItems', async () => {
  const mockFetcher = jest.fn(async function fetcher(config: any) {
    return {
      status: 200,
      headers: {},
      data: {
        status: 0,
        msg: '',
        data: {
          count: 3,
          items: [
            {id: 1, name: 'amis1'},
            {id: 2, name: 'amis2'},
            {id: 3, name: 'amis3'}
          ]
        }
      }
    };
  });

  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'crud',
          id: 'crud',
          api: '/api/mock2/sample',
          syncLocation: false,
          keepItemSelectionOnPageChange: true,
          bulkActions: [
            {
              type: 'action',
              align: 'right',
              icon: 'iconfont icon-refresh',
              label: '刷新(actionType)',
              tooltip: '',
              level: 'primary',
              actionType: 'reload',
              target: 'crud'
            }
          ],
          columns: [
            {
              name: 'id',
              label: 'ID'
            },
            {
              name: 'name',
              label: 'name'
            },
            {
              type: 'container',
              label: '操作',
              body: [
                {
                  label: '删除',
                  type: 'action',
                  level: 'danger',
                  className: 'deleteBtn',
                  onEvent: {
                    click: {
                      actions: [
                        {
                          actionType: 'ajax',
                          args: {
                            api: '/api/mock2/sample' /** mock */
                          }
                        },
                        {
                          actionType: 'reload',
                          componentId: 'crud',
                          dataMergeMode: 'override'
                        }
                      ]
                    }
                  }
                }
              ]
            }
          ]
        }
      },
      {},
      makeEnv({fetcher: mockFetcher})
    )
  );

  await waitFor(() => {
    expect(container.querySelectorAll('tbody>tr').length).toEqual(3);
    expect(container.querySelectorAll('tbody>tr.is-checked').length).toEqual(0);
  });

  fireEvent.click(
    container.querySelector('.cxd-Table-checkCell input[type="checkbox"]')!
  );
  await wait(200);
  expect(container.querySelectorAll('tbody>tr.is-checked').length).toEqual(3);

  /** 触发reload后勾选项清空 */
  const deleteBtn = container.querySelector('.cxd-Button.deleteBtn');
  expect(deleteBtn).toBeInTheDocument();
  fireEvent.click(deleteBtn!);
  await wait(500);
  expect(container.querySelectorAll('tbody>tr.is-checked').length).toEqual(0);
});
