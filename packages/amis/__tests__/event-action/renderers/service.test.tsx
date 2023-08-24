import React = require('react');
import * as renderer from 'react-test-renderer';
import {fireEvent, render, waitFor} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv, replaceReactAriaIds, wait} from '../../helper';

test('doAction:service reload', async () => {
  const notify = jest.fn();
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          name: 'Amis Renderer',
          author: 'fex',
          date: 1688871102,
          info: ''
        }
      }
    })
  );
  const {container, getByText} = render(
    amisRender(
      {
        type: 'page',
        body: [
          {
            type: 'form',
            body: [
              {
                type: 'input-text',
                label: '名字：',
                name: 'name',
                value: 'amis'
              },
              {
                type: 'input-text',
                label: '年龄：',
                name: 'age',
                value: 18
              },
              {
                type: 'button',
                label: '刷新Service数据加载请求',
                level: 'primary',
                className: 'mb-2',
                onEvent: {
                  click: {
                    actions: [
                      {
                        componentId: 'service_reload',
                        actionType: 'reload'
                      }
                    ]
                  }
                }
              }
            ]
          },
          {
            type: 'service',
            api: '/api/mock2/form/initData',
            body: [
              {
                type: 'input-text',
                label: '我的名字：',
                name: 'name'
              },
              {
                type: 'input-text',
                label: '我的年龄：',
                name: 'age'
              }
            ],
            id: 'service_reload'
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
    expect(getByText('刷新Service数据加载请求')).toBeInTheDocument();
    expect(
      container.querySelector('[name="name"][value="Amis Renderer"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[name="age"][value=""]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-testid="spinner"]')
    ).not.toBeInTheDocument();
  });

  replaceReactAriaIds(container);
  expect(container).toMatchSnapshot();

  fireEvent.click(getByText(/刷新Service数据加载请求/));

  await waitFor(() => {
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(fetcher.mock.calls[0][0].url).toEqual('/api/mock2/form/initData');
    expect(fetcher.mock.calls[1][0].url).toEqual('/api/mock2/form/initData');
    expect(
      container.querySelector('[name="name"][value="Amis Renderer"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[name="age"][value=""]')
    ).toBeInTheDocument();
  });

  expect(container).toMatchSnapshot();
});

test('doAction:service reload with data', async () => {
  const notify = jest.fn();
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          name: 'Amis Renderer',
          author: 'fex',
          date: 1688871102,
          info: ''
        }
      }
    })
  );
  const {container, getByText} = render(
    amisRender(
      {
        type: 'page',
        body: [
          {
            type: 'button',
            label: '刷新Service数据加载请求，同时把年龄更新为18',
            level: 'primary',
            className: 'mb-2',
            onEvent: {
              click: {
                actions: [
                  {
                    componentId: 'service_reload',
                    actionType: 'reload',
                    data: {
                      age: '18'
                    }
                  }
                ]
              }
            }
          },
          {
            type: 'service',
            api: '/api/mock2/form/initData',
            body: [
              {
                type: 'input-text',
                label: '我的名字：',
                name: 'name'
              },
              {
                type: 'input-text',
                label: '我的年龄：',
                name: 'age'
              }
            ],
            id: 'service_reload'
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
      getByText('刷新Service数据加载请求，同时把年龄更新为18')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[name="name"][value="Amis Renderer"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[name="age"][value=""]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-testid="spinner"]')
    ).not.toBeInTheDocument();
  });

  replaceReactAriaIds(container);
  expect(container).toMatchSnapshot();

  fireEvent.click(getByText(/刷新Service数据加载请求，同时把年龄更新为18/));

  await waitFor(() => {
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(fetcher.mock.calls[0][0].url).toEqual('/api/mock2/form/initData');
    expect(fetcher.mock.calls[1][0].url).toEqual('/api/mock2/form/initData');
    expect(
      container.querySelector('[name="name"][value="Amis Renderer"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[name="age"][value="18"]')
    ).toBeInTheDocument();
  });

  expect(container).toMatchSnapshot();
});

test('doAction:service(schemaApi) reload', async () => {
  const notify = jest.fn();
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          controls: [
            {
              type: 'input-text',
              label: '我的名字：',
              name: 'name'
            },
            {
              type: 'input-text',
              label: '我的年龄：',
              name: 'age'
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
        body: [
          {
            type: 'button',
            label: '刷新Service数据加载请求',
            level: 'primary',
            className: 'mb-2',
            onEvent: {
              click: {
                actions: [
                  {
                    componentId: 'service_reload',
                    actionType: 'reload'
                  }
                ]
              }
            }
          },
          {
            type: 'service',
            schemaApi: '/api/schemaApi',
            id: 'service_reload'
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
    expect(getByText('刷新Service数据加载请求')).toBeInTheDocument();
    expect(
      container.querySelector('[name="name"][value=""]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[name="age"][value=""]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-testid="spinner"]')
    ).not.toBeInTheDocument();
  });

  replaceReactAriaIds(container);
  expect(container).toMatchSnapshot();

  fireEvent.click(getByText(/刷新Service数据加载请求/));

  await waitFor(() => {
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(fetcher.mock.calls[0][0].url).toEqual('/api/schemaApi?_replace=1');
    expect(fetcher.mock.calls[1][0].url).toEqual('/api/schemaApi?_replace=1');
    expect(
      container.querySelector('[name="name"][value=""]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[name="age"][value=""]')
    ).toBeInTheDocument();
  });

  expect(container).toMatchSnapshot();
});

test('doAction:service(schemaApi) reload with data', async () => {
  const notify = jest.fn();
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          controls: [
            {
              type: 'input-text',
              label: '我的名字：',
              name: 'name'
            },
            {
              type: 'input-text',
              label: '我的年龄：',
              name: 'age'
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
        body: [
          {
            type: 'button',
            label: '刷新Service数据加载请求，同时把年龄更新为18',
            level: 'primary',
            className: 'mb-2',
            onEvent: {
              click: {
                actions: [
                  {
                    componentId: 'service_reload',
                    actionType: 'reload',
                    data: {
                      age: '18'
                    }
                  }
                ]
              }
            }
          },
          {
            type: 'service',
            schemaApi: '/api/schemaApi',
            id: 'service_reload'
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
      getByText('刷新Service数据加载请求，同时把年龄更新为18')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[name="name"][value=""]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[name="age"][value=""]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-testid="spinner"]')
    ).not.toBeInTheDocument();
  });

  replaceReactAriaIds(container);
  expect(container).toMatchSnapshot();

  fireEvent.click(getByText(/刷新Service数据加载请求，同时把年龄更新为18/));

  await waitFor(() => {
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(fetcher.mock.calls[0][0].url).toEqual('/api/schemaApi?_replace=1');
    expect(fetcher.mock.calls[1][0].url).toEqual('/api/schemaApi?_replace=1');
    expect(
      container.querySelector('[name="name"][value=""]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[name="age"][value="18"]')
    ).toBeInTheDocument();
  });

  expect(container).toMatchSnapshot();
});

test('doAction:service(schemaApi+data) reload with data', async () => {
  const notify = jest.fn();
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          data: {
            name: 'amis',
            age: 20
          },
          controls: [
            {
              type: 'input-text',
              label: '我的名字：',
              name: 'name'
            },
            {
              type: 'input-text',
              label: '我的年龄：',
              name: 'age'
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
        body: [
          {
            type: 'button',
            label: '刷新Service数据加载请求，同时把年龄更新为18',
            level: 'primary',
            className: 'mb-2',
            onEvent: {
              click: {
                actions: [
                  {
                    componentId: 'service_reload',
                    actionType: 'reload',
                    data: {
                      age: '18'
                    }
                  }
                ]
              }
            }
          },
          {
            type: 'service',
            schemaApi: '/api/schemaApi',
            id: 'service_reload'
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
      getByText('刷新Service数据加载请求，同时把年龄更新为18')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[name="name"][value="amis"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[name="age"][value="20"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-testid="spinner"]')
    ).not.toBeInTheDocument();
  });

  replaceReactAriaIds(container);
  expect(container).toMatchSnapshot();

  fireEvent.click(getByText(/刷新Service数据加载请求，同时把年龄更新为18/));

  await waitFor(() => {
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(fetcher.mock.calls[0][0].url).toEqual('/api/schemaApi?_replace=1');
    expect(fetcher.mock.calls[1][0].url).toEqual('/api/schemaApi?_replace=1');
    expect(
      container.querySelector('[name="name"][value="amis"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[name="age"][value="18"]')
    ).toBeInTheDocument();
  });

  expect(container).toMatchSnapshot();
});
