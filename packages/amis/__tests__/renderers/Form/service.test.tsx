import React = require('react');
import {render, cleanup, fireEvent, waitFor} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv, replaceReactAriaIds, wait} from '../../helper';
import {clearStoresCache} from '../../../src';

afterEach(() => {
  cleanup();
  clearStoresCache();
  jest.useRealTimers();
});

test('Renderer:service', async () => {
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          controls: [
            {type: 'text', label: '动态字段1', name: 'dy_1', required: true},
            {type: 'text', label: '动态字段2', name: 'dy_2'}
          ]
        }
      }
    })
  );

  const {container} = render(
    amisRender(
      {
        type: 'form',
        title: 'The form',
        controls: [
          {
            name: 'tpl',
            type: 'select',
            label: '模板',
            inline: true,
            required: true,
            value: 'tpl1',
            options: [
              {
                label: '模板1',
                value: 'tpl1'
              },
              {
                label: '模板2',
                value: 'tpl2'
              },
              {
                label: '模板3',
                value: 'tpl3'
              }
            ]
          },
          {
            type: 'service',
            className: 'm-t',
            initFetchSchemaOn: 'data.tpl',
            schemaApi: '/api/mock2/service/form?tpl=$tpl'
          }
        ],
        submitText: null,
        actions: []
      },
      {},
      makeEnv({
        fetcher
      })
    )
  );

  await waitFor(() => {
    expect(container.querySelector('[name="dy_1"]')).toBeInTheDocument();
    expect(
      container.querySelector('[data-testid="spinner"]')
    ).not.toBeInTheDocument();
  });
  expect(fetcher).toHaveBeenCalled();

  replaceReactAriaIds(container);
  expect(container).toMatchSnapshot();
});

test('form:service:remoteData', async () => {
  const onSubmit = jest.fn();
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          'child-a': '123'
        }
      }
    })
  );

  const {container, getByText} = render(
    amisRender(
      {
        type: 'form',
        title: 'The form',
        onSubmit,
        wrapWithPanel: false,
        controls: [
          {
            type: 'service',
            api: '/api/initData',
            controls: [
              {
                type: 'text',
                name: 'child-a'
              }
            ]
          },

          {
            type: 'submit',
            label: 'Submit'
          }
        ]
      },
      {},
      makeEnv({fetcher})
    )
  );

  await waitFor(() => {
    expect(
      container.querySelector('[name="child-a"][value="123"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-testid="spinner"]')
    ).not.toBeInTheDocument();
  });

  replaceReactAriaIds(container);
  expect(container).toMatchSnapshot();

  fireEvent.click(getByText('Submit'));
  await waitFor(() => {
    expect(onSubmit).toBeCalled();
    expect(onSubmit.mock.calls[0][0]).toMatchObject({
      'child-a': '123'
    });
  });
});

test('form:service:remoteSchmea+data', async () => {
  const onSubmit = jest.fn();
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          data: {
            'child-a': '123'
          },
          controls: [
            {
              type: 'text',
              name: 'child-a'
            },

            {
              type: 'text',
              name: 'child-b',
              value: '344'
            }
          ]
        }
      }
    })
  );

  const {container, getByText} = render(
    amisRender(
      {
        type: 'form',
        title: 'The form',
        onSubmit,
        wrapWithPanel: false,
        controls: [
          {
            type: 'service',
            schemaApi: '/api/schemaApi'
          },

          {
            type: 'submit',
            label: 'Submit'
          }
        ]
      },
      {},
      makeEnv({fetcher})
    )
  );

  await waitFor(() => {
    expect(
      container.querySelector('[name="child-a"][value="123"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-testid="spinner"]')
    ).not.toBeInTheDocument();
  });

  replaceReactAriaIds(container);
  expect(container).toMatchSnapshot();

  fireEvent.click(getByText('Submit'));
  await waitFor(() => {
    expect(onSubmit).toBeCalled();
    expect(onSubmit.mock.calls[0][0]).toMatchObject({
      'child-a': '123',
      'child-b': '344'
    });
  });
});

test('form:service:onChange', async () => {
  const onSubmit = jest.fn();
  const {container, getByText} = render(
    amisRender(
      {
        type: 'form',
        title: 'The form',
        onSubmit,
        wrapWithPanel: false,
        controls: [
          {
            type: 'service',
            api: '/api/initData',
            controls: [
              {
                type: 'text',
                name: 'child-a'
              }
            ]
          },

          {
            type: 'submit',
            label: 'Submit'
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

  const input = container.querySelector('input[name=child-a]');
  expect(input).toBeTruthy();
  fireEvent.change(input!, {
    target: {
      value: '123'
    }
  });
  await waitFor(() => {
    expect(
      container.querySelector('[name="child-a"][value="123"]')
    ).toBeInTheDocument();
  });

  fireEvent.click(getByText('Submit'));

  await waitFor(() => {
    expect(onSubmit).toBeCalled();
    expect(onSubmit.mock.calls[0][0]).toMatchObject({
      'child-a': '123'
    });
  });
});

// Form => service, form 的 initApi 返回新数据，service 下面的 form 是否更新
test('form:service:super-remoteData', async () => {
  const onSubmit = jest.fn();
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          'child-a': '123'
        }
      }
    })
  );

  const {container, getByText} = render(
    amisRender(
      {
        type: 'form',
        title: 'The form',
        onSubmit,
        wrapWithPanel: false,
        initApi: '/api/initData',
        controls: [
          {
            type: 'service',
            controls: [
              {
                type: 'text',
                name: 'child-a'
              }
            ]
          },

          {
            type: 'submit',
            label: 'Submit'
          }
        ]
      },
      {},
      makeEnv({fetcher})
    )
  );

  await waitFor(() => {
    expect(
      container.querySelector('[name="child-a"][value="123"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-testid="spinner"]')
    ).not.toBeInTheDocument();
  });

  replaceReactAriaIds(container);
  expect(container).toMatchSnapshot();
});

test('service init api with interval and concatDataFields', async () => {
  jest.useFakeTimers();
  let times = 0;
  const fetcher = jest.fn().mockImplementation(() => {
    times++;
    return Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          log: `${times}th log`,
          finished: times > 2
        }
      }
    });
  });
  const {container, getByText} = render(
    amisRender(
      {
        type: 'service',
        api: {
          method: 'get',
          url: '/api/initData',
          concatDataFields: 'log'
        },
        interval: 3000,
        stopAutoRefreshWhen: '${finished}',
        body: [
          {
            type: 'tpl',
            tpl: '${log|json}'
          }
        ]
      },
      {},
      makeEnv({
        fetcher: fetcher
      })
    )
  );

  await wait(10, false);
  jest.advanceTimersByTime(3000);

  await wait(10, false);
  jest.advanceTimersByTime(3000);

  await wait(10, false);
  jest.advanceTimersByTime(3000);

  await wait(10, false);
  jest.advanceTimersByTime(3000);

  expect(fetcher).toHaveBeenCalledTimes(3);
  await wait(200, false);
  const span = container.querySelector('.cxd-TplField>span');
  expect(span).toBeTruthy();
  expect(JSON.parse(span?.innerHTML!)).toMatchObject([
    '1th log',
    '2th log',
    '3th log'
  ]);
});
