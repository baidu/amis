import React = require('react');
import * as renderer from 'react-test-renderer';
import {fireEvent, render, waitFor} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv} from '../../helper';

test('doAction:page reload', async () => {
  const notify = jest.fn();
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          title: 'Test Page Component',
          date: '2017-10-13'
        }
      }
    })
  );
  const {container, getByText} = render(
    amisRender(
      {
        type: 'page',
        initApi: '/api/mock2/page/initData',
        id: 'page_reload',
        body: [
          {
            type: 'button',
            label: '刷新Page数据加载请求',
            level: 'primary',
            className: 'mb-2',
            onEvent: {
              click: {
                actions: [
                  {
                    componentId: 'page_reload',
                    actionType: 'reload'
                  }
                ]
              }
            }
          },
          {
            type: 'input-text',
            label: '我的标题：',
            name: 'title'
          },
          {
            type: 'input-text',
            label: '我的年龄：',
            name: 'age'
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
    expect(getByText('刷新Page数据加载请求')).toBeInTheDocument();
    expect(
      container.querySelector('[name="title"][value="Test Page Component"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[name="age"][value=""]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-testid="spinner"]')
    ).not.toBeInTheDocument();
  });

  expect(container).toMatchSnapshot();

  fireEvent.click(getByText(/刷新Page数据加载请求/));

  await waitFor(() => {
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(fetcher.mock.calls[0][0].url).toEqual('/api/mock2/page/initData');
    expect(fetcher.mock.calls[1][0].url).toEqual('/api/mock2/page/initData');
    expect(
      container.querySelector('[name="title"][value="Test Page Component"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[name="age"][value=""]')
    ).toBeInTheDocument();
  });

  expect(container).toMatchSnapshot();
});

test('doAction:page reload with data', async () => {
  const notify = jest.fn();
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          title: 'Test Page Component',
          date: '2017-10-13'
        }
      }
    })
  );
  const {container, getByText} = render(
    amisRender(
      {
        type: 'page',
        initApi: '/api/mock2/page/initData',
        id: 'page_reload',
        body: [
          {
            type: 'button',
            label: '刷新Page数据加载请求，同时把年龄更新为18',
            level: 'primary',
            className: 'mb-2',
            onEvent: {
              click: {
                actions: [
                  {
                    componentId: 'page_reload',
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
            type: 'input-text',
            label: '我的标题：',
            name: 'title'
          },
          {
            type: 'input-text',
            label: '我的年龄：',
            name: 'age'
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
      getByText('刷新Page数据加载请求，同时把年龄更新为18')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[name="title"][value="Test Page Component"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[name="age"][value=""]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-testid="spinner"]')
    ).not.toBeInTheDocument();
  });

  expect(container).toMatchSnapshot();

  fireEvent.click(getByText(/刷新Page数据加载请求，同时把年龄更新为18/));

  await waitFor(() => {
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(fetcher.mock.calls[0][0].url).toEqual('/api/mock2/page/initData');
    expect(fetcher.mock.calls[1][0].url).toEqual('/api/mock2/page/initData');
    expect(
      container.querySelector('[name="title"][value="Test Page Component"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[name="age"][value="18"]')
    ).toBeInTheDocument();
  });

  expect(container).toMatchSnapshot();
});

test('doAction:page reload with data(same name)', async () => {
  const notify = jest.fn();
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          title: 'Test Page Component',
          date: '2017-10-13'
        }
      }
    })
  );
  const {container, getByText} = render(
    amisRender(
      {
        type: 'page',
        initApi: '/api/mock2/page/initData',
        id: 'page_reload',
        body: [
          {
            type: 'button',
            label: '刷新Page数据加载请求，请求返回的date会覆盖动作传递的date',
            level: 'primary',
            className: 'mb-2',
            onEvent: {
              click: {
                actions: [
                  {
                    componentId: 'page_reload',
                    actionType: 'reload',
                    data: {
                      date: '2023-07-07'
                    }
                  }
                ]
              }
            }
          },
          {
            type: 'input-text',
            label: '我的标题：',
            name: 'title'
          },
          {
            type: 'input-text',
            label: '日期：',
            name: 'date'
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
      getByText('刷新Page数据加载请求，请求返回的date会覆盖动作传递的date')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[name="title"][value="Test Page Component"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[name="date"][value="2017-10-13"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-testid="spinner"]')
    ).not.toBeInTheDocument();
  });

  expect(container).toMatchSnapshot();

  fireEvent.click(
    getByText(/刷新Page数据加载请求，请求返回的date会覆盖动作传递的date/)
  );

  await waitFor(() => {
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(fetcher.mock.calls[0][0].url).toEqual('/api/mock2/page/initData');
    expect(fetcher.mock.calls[1][0].url).toEqual('/api/mock2/page/initData');
    expect(
      container.querySelector('[name="title"][value="Test Page Component"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[name="date"][value="2017-10-13"]')
    ).toBeInTheDocument();
  });

  expect(container).toMatchSnapshot();
});
