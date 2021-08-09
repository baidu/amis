import React = require('react');
import {render, cleanup, fireEvent} from '@testing-library/react';
import '../../../src/themes/default';
import {render as amisRender} from '../../../src/index';
import {makeEnv, wait} from '../../helper';
import {clearStoresCache} from '../../../src/factory';

afterEach(() => {
  cleanup();
  clearStoresCache();
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

  await wait(100);
  expect(fetcher).toHaveBeenCalled();
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

  await wait(300);

  expect(container).toMatchSnapshot();
  fireEvent.click(getByText('Submit'));
  await wait(300);
  expect(onSubmit).toBeCalled();
  expect(onSubmit.mock.calls[0][0]).toMatchObject({
    'child-a': '123'
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

  await wait(300);

  expect(container).toMatchSnapshot();
  fireEvent.click(getByText('Submit'));
  await wait(300);
  expect(onSubmit).toBeCalled();
  expect(onSubmit.mock.calls[0][0]).toMatchObject({
    'child-a': '123',
    'child-b': '344'
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

  fireEvent.click(getByText('Submit'));
  await wait(300);
  expect(onSubmit).toBeCalled();
  expect(onSubmit.mock.calls[0][0]).toMatchObject({
    'child-a': '123'
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

  await wait(300);

  expect(container).toMatchSnapshot();
});
