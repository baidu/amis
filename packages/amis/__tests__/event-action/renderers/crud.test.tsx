import React = require('react');
import * as renderer from 'react-test-renderer';
import {fireEvent, render, waitFor} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv, replaceReactAriaIds, wait} from '../../helper';

test('doAction:crud reload', async () => {
  const notify = jest.fn();
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          count: 171,
          rows: [
            {
              engine: 'Trident - pbz7l',
              browser: 'Internet Explorer 4.0',
              platform: 'Win 95+',
              version: '4',
              grade: 'X',
              badgeText: '默认',
              id: 1
            },
            {
              engine: 'Trident - tir4m8',
              browser: 'Internet Explorer 5.0',
              platform: 'Win 95+',
              version: '5',
              grade: 'C',
              badgeText: '危险',
              id: 2
            },
            {
              engine: 'Trident - wcn6f',
              browser: 'Internet Explorer 5.5',
              platform: 'Win 95+',
              version: '5.5',
              grade: 'A',
              id: 3
            },
            {
              engine: 'Trident - uwmcbf',
              browser: 'Internet Explorer 6',
              platform: 'Win 98+',
              version: '6',
              grade: 'A',
              id: 4
            },
            {
              engine: 'Trident - yjgst7',
              browser: 'Internet Explorer 7',
              platform: 'Win XP SP2+',
              version: '7',
              grade: 'A',
              id: 5
            },
            {
              engine: 'Trident - w9ee2k',
              browser: 'AOL browser (AOL desktop)',
              platform: 'Win XP',
              version: '6',
              grade: 'A',
              id: 6
            },
            {
              engine: 'Gecko - hi6cd',
              browser: 'Firefox 1.0',
              platform: 'Win 98+ / OSX.2+',
              version: '1.7',
              grade: 'A',
              id: 7
            },
            {
              engine: 'Gecko - 4kxz6',
              browser: 'Firefox 1.5',
              platform: 'Win 98+ / OSX.2+',
              version: '1.8',
              grade: 'A',
              id: 8
            },
            {
              engine: 'Gecko - x0u91o',
              browser: 'Firefox 2.0',
              platform: 'Win 98+ / OSX.2+',
              version: '1.8',
              grade: 'A',
              id: 9
            },
            {
              engine: 'Gecko - iou01',
              browser: 'Firefox 3.0',
              platform: 'Win 2k+ / OSX.3+',
              version: '1.9',
              grade: 'A',
              id: 10
            }
          ]
        }
      }
    })
  );
  const {container, getByText} = render(
    amisRender(
      {
        type: 'page',
        data: {
          name: 'amis',
          age: 18,
          date: '2023-6-6'
        },
        body: [
          {
            type: 'button',
            label: '刷新CRUD数据加载请求',
            level: 'primary',
            className: 'mb-2',
            onEvent: {
              click: {
                actions: [
                  {
                    componentId: 'crud_reload',
                    actionType: 'reload'
                  }
                ]
              }
            }
          },
          {
            type: 'crud',
            api: '/api/mock2/sample',
            id: 'crud_reload',
            syncLocation: false,
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
                label: 'Engine version'
              },
              {
                name: 'grade',
                label: 'CSS grade'
              },
              {
                type: 'operation',
                label: '操作',
                buttons: [
                  {
                    label: '详情',
                    type: 'button',
                    level: 'link',
                    actionType: 'dialog',
                    dialog: {
                      title: '查看详情',
                      body: {
                        type: 'form',
                        body: [
                          {
                            type: 'input-text',
                            name: 'engine',
                            label: 'Engine'
                          },
                          {
                            type: 'input-text',
                            name: 'browser',
                            label: 'Browser'
                          },
                          {
                            type: 'input-text',
                            name: 'platform',
                            label: 'platform'
                          },
                          {
                            type: 'input-text',
                            name: 'version',
                            label: 'version'
                          },
                          {
                            type: 'control',
                            label: 'grade',
                            body: {
                              type: 'tag',
                              label: '${grade}',
                              displayMode: 'normal',
                              color: 'active'
                            }
                          }
                        ]
                      }
                    }
                  },
                  {
                    label: '删除',
                    type: 'button',
                    level: 'link',
                    className: 'text-danger',
                    disabledOn: "this.grade === 'A'"
                  }
                ]
              }
            ]
          }
        ]
      },
      {},
      makeEnv({
        notify,
        fetcher
      })
    )
  );

  await waitFor(() => {
    expect(getByText('刷新CRUD数据加载请求')).toBeInTheDocument();
  });

  fireEvent.click(getByText(/刷新CRUD数据加载请求/));

  await waitFor(() => {
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(fetcher.mock.calls[0][0].url).toEqual(
      '/api/mock2/sample?page=1&perPage=10'
    );
    expect(fetcher.mock.calls[1][0].url).toEqual(
      '/api/mock2/sample?page=1&perPage=10'
    );
  });

  await wait(500);
  replaceReactAriaIds(container);
  expect(container).toMatchSnapshot();
});

test('doAction:crud reload with data1', async () => {
  const notify = jest.fn();
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          name: 'Amis Renderer',
          author: 'fex',
          date: 1688714086
        }
      }
    })
  );
  const {container, getByText} = render(
    amisRender(
      {
        type: 'page',
        data: {
          name: 'amis',
          age: 18,
          date: '2023-6-6'
        },
        body: [
          {
            type: 'button',
            label: '刷新CRUD数据加载请求，同时追加参数date',
            level: 'primary',
            className: 'mb-2',
            onEvent: {
              click: {
                actions: [
                  {
                    componentId: 'crud_reload',
                    actionType: 'reload',
                    data: {
                      date: '${date}'
                    }
                  }
                ]
              }
            }
          },
          {
            type: 'crud',
            api: '/api/mock2/sample',
            id: 'crud_reload',
            syncLocation: false,
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
                label: 'Engine version'
              },
              {
                name: 'grade',
                label: 'CSS grade'
              },
              {
                type: 'operation',
                label: '操作',
                buttons: [
                  {
                    label: '详情',
                    type: 'button',
                    level: 'link',
                    actionType: 'dialog',
                    dialog: {
                      title: '查看详情',
                      body: {
                        type: 'form',
                        body: [
                          {
                            type: 'input-text',
                            name: 'engine',
                            label: 'Engine'
                          },
                          {
                            type: 'input-text',
                            name: 'browser',
                            label: 'Browser'
                          },
                          {
                            type: 'input-text',
                            name: 'platform',
                            label: 'platform'
                          },
                          {
                            type: 'input-text',
                            name: 'version',
                            label: 'version'
                          },
                          {
                            type: 'control',
                            label: 'grade',
                            body: {
                              type: 'tag',
                              label: '${grade}',
                              displayMode: 'normal',
                              color: 'active'
                            }
                          }
                        ]
                      }
                    }
                  },
                  {
                    label: '删除',
                    type: 'button',
                    level: 'link',
                    className: 'text-danger',
                    disabledOn: "this.grade === 'A'"
                  }
                ]
              }
            ]
          }
        ]
      },
      {},
      makeEnv({
        notify,
        fetcher
      })
    )
  );

  await waitFor(() => {
    expect(
      getByText('刷新CRUD数据加载请求，同时追加参数date')
    ).toBeInTheDocument();
  });

  fireEvent.click(getByText(/刷新CRUD数据加载请求，同时追加参数date/));

  await waitFor(() => {
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(fetcher.mock.calls[0][0].url).toEqual(
      '/api/mock2/sample?page=1&perPage=10'
    );
    expect(fetcher.mock.calls[1][0].url).toEqual(
      '/api/mock2/sample?page=1&date=2023-6-6&perPage=10'
    );
  });

  replaceReactAriaIds(container);
  expect(container).toMatchSnapshot();
});

test('doAction:crud reload with data2', async () => {
  const notify = jest.fn();
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          name: 'Amis Renderer',
          author: 'fex',
          date: 1688714086
        }
      }
    })
  );
  const {container, getByText} = render(
    amisRender(
      {
        type: 'page',
        data: {
          name: 'amis',
          age: 18,
          date: '2023-6-6'
        },
        body: [
          {
            type: 'button',
            label: '刷新CRUD数据加载请求，同时追加按钮所在数据域的所有数据',
            level: 'primary',
            className: 'mb-2',
            onEvent: {
              click: {
                actions: [
                  {
                    componentId: 'crud_reload',
                    actionType: 'reload',
                    data: {
                      '&': '$$',
                      'author': 'fex'
                    }
                  }
                ]
              }
            }
          },
          {
            type: 'crud',
            api: '/api/mock2/sample',
            id: 'crud_reload',
            syncLocation: false,
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
                label: 'Engine version'
              },
              {
                name: 'grade',
                label: 'CSS grade'
              },
              {
                type: 'operation',
                label: '操作',
                buttons: [
                  {
                    label: '详情',
                    type: 'button',
                    level: 'link',
                    actionType: 'dialog',
                    dialog: {
                      title: '查看详情',
                      body: {
                        type: 'form',
                        body: [
                          {
                            type: 'input-text',
                            name: 'engine',
                            label: 'Engine'
                          },
                          {
                            type: 'input-text',
                            name: 'browser',
                            label: 'Browser'
                          },
                          {
                            type: 'input-text',
                            name: 'platform',
                            label: 'platform'
                          },
                          {
                            type: 'input-text',
                            name: 'version',
                            label: 'version'
                          },
                          {
                            type: 'control',
                            label: 'grade',
                            body: {
                              type: 'tag',
                              label: '${grade}',
                              displayMode: 'normal',
                              color: 'active'
                            }
                          }
                        ]
                      }
                    }
                  },
                  {
                    label: '删除',
                    type: 'button',
                    level: 'link',
                    className: 'text-danger',
                    disabledOn: "this.grade === 'A'"
                  }
                ]
              }
            ]
          }
        ]
      },
      {},
      makeEnv({
        notify,
        fetcher
      })
    )
  );

  await waitFor(() => {
    expect(
      getByText('刷新CRUD数据加载请求，同时追加按钮所在数据域的所有数据')
    ).toBeInTheDocument();
  });

  fireEvent.click(
    getByText(/刷新CRUD数据加载请求，同时追加按钮所在数据域的所有数据/)
  );

  await waitFor(() => {
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(fetcher.mock.calls[0][0].url).toEqual(
      '/api/mock2/sample?page=1&perPage=10'
    );
    expect(fetcher.mock.calls[1][0].url).toEqual(
      '/api/mock2/sample?page=1&name=amis&age=18&date=2023-6-6&author=fex&perPage=10'
    );
  });

  replaceReactAriaIds(container);
  expect(container).toMatchSnapshot();
});
