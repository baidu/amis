import React = require('react');
import {render, fireEvent, cleanup} from '@testing-library/react';
import '../../../src/themes/default';
import {render as amisRender} from '../../../src/index';
import {wait, makeEnv} from '../../helper';
import {clearStoresCache} from '../../../src/factory';

afterEach(() => {
  cleanup();
  clearStoresCache();
});

test('Renderer:FormItem:validateApi:success', async () => {
  const notify = jest.fn();
  const onSubmit = jest.fn();

  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0
      }
    })
  );

  const {container, getByText} = render(
    amisRender(
      {
        type: 'form',
        controls: [
          {
            type: 'text',
            name: 'a',
            required: true,
            label: 'Label',
            validateApi: '/api/xxx'
          }
        ],
        title: 'The form',
        actions: [
          {
            type: 'submit',
            label: 'Submit'
          }
        ]
      },
      {
        onSubmit
      },
      makeEnv({
        notify,
        fetcher
      })
    )
  );

  fireEvent.click(getByText('Submit'));
  await wait(100);

  expect(container).toMatchSnapshot();
  expect(onSubmit).not.toHaveBeenCalled();

  await wait(100);
  expect(notify).toHaveBeenCalledWith(
    'error',
    '依赖的部分字段没有通过验证\n这是必填项'
  );

  const input = container.querySelector('input[name=a]');
  expect(input).toBeTruthy();
  fireEvent.change(input!, {
    target: {
      value: '123'
    }
  });
  await wait(300); // 有 250 秒左右的节流
  fireEvent.click(getByText('Submit'));
  await wait(100);

  expect(onSubmit).toHaveBeenCalled();
  expect(onSubmit.mock.calls[0][0]).toMatchSnapshot();
});

test('Renderer:FormItem:validateApi:failed', async () => {
  const notify = jest.fn();
  const onSubmit = jest.fn();

  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 422,
        msg: '',
        errors: '用户名已存在'
      }
    })
  );

  const {container, getByText} = render(
    amisRender(
      {
        type: 'form',
        controls: [
          {
            type: 'text',
            name: 'a',
            required: true,
            label: 'Label',
            validateApi: '/api/xxx'
          }
        ],
        title: 'The form',
        actions: [
          {
            type: 'submit',
            label: 'Submit'
          }
        ]
      },
      {
        onSubmit
      },
      makeEnv({
        notify,
        fetcher
      })
    )
  );

  fireEvent.click(getByText('Submit'));
  await wait(100);

  expect(container).toMatchSnapshot();
  expect(onSubmit).not.toHaveBeenCalled();

  await wait(100);
  expect(notify).toHaveBeenCalledWith(
    'error',
    '依赖的部分字段没有通过验证\n这是必填项'
  );

  const input = container.querySelector('input[name=a]');
  expect(input).toBeTruthy();
  fireEvent.change(input!, {
    target: {
      value: '123'
    }
  });
  await wait(300); // 有 250 秒左右的节流
  fireEvent.click(getByText('Submit'));
  await wait(100);

  expect(onSubmit).not.toHaveBeenCalled();
  expect(container).toMatchSnapshot();
});
