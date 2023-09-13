import React = require('react');
import {render, fireEvent, cleanup} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {wait, makeEnv} from '../../helper';
import {clearStoresCache} from '../../../src';
import moment from 'moment';

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
  await wait(300);

  expect(container).toMatchSnapshot();
  expect(onSubmit).not.toHaveBeenCalled();

  await wait(300);
  expect(notify).toHaveBeenCalledWith('error', '依赖的部分字段没有通过验证');

  const input = container.querySelector('input[name=a]');
  expect(input).toBeTruthy();
  fireEvent.change(input!, {
    target: {
      value: '123'
    }
  });
  await wait(500); // 有 250 秒左右的节流
  fireEvent.click(getByText('Submit'));
  await wait(300);

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
  await wait(300);

  expect(container).toMatchSnapshot();
  expect(onSubmit).not.toHaveBeenCalled();

  await wait(300);
  expect(notify).toHaveBeenCalledWith('error', '依赖的部分字段没有通过验证');

  const input = container.querySelector('input[name=a]');
  expect(input).toBeTruthy();
  fireEvent.change(input!, {
    target: {
      value: '123'
    }
  });
  await wait(500); // 有 250 秒左右的节流
  fireEvent.click(getByText('Submit'));
  await wait(300);

  expect(onSubmit).not.toHaveBeenCalled();
  expect(container).toMatchSnapshot();
});

test('Renderer:FormItem:extraName', async () => {
  const onSubmit = jest.fn();

  const {container, getByText} = render(
    amisRender(
      {
        type: 'form',
        id: 'theform',
        body: [
          {
            type: 'input-date-range',
            format: 'YYYY-MM-DD',
            name: 'begin',
            extraName: 'end',
            label: 'Label'
          }
        ],
        title: 'The form',
        actions: [
          {
            type: 'button',
            label: 'ChangeValue',
            onEvent: {
              click: {
                actions: [
                  {
                    actionType: 'setValue',
                    componentId: 'theform',
                    args: {
                      value: {
                        end: `${moment().format('YYYY-MM')}-16`
                      }
                    }
                  }
                ]
              }
            }
          },
          {
            type: 'submit',
            label: 'Submit'
          }
        ]
      },
      {
        onSubmit
      },
      makeEnv({})
    )
  );

  // 打开弹框
  fireEvent.click(
    container.querySelector('.cxd-DateRangePicker-input') as HTMLElement
  );
  await wait(200);

  // 点击选择
  fireEvent.click(
    container.querySelector(
      '.cxd-DateRangePicker-popover tr td[data-value="15"]'
    ) as HTMLElement
  );

  // 点击选择
  fireEvent.click(
    container.querySelector(
      '.cxd-DateRangePicker-popover tr td[data-value="15"]'
    ) as HTMLElement
  );

  fireEvent.click(getByText('确认'));

  fireEvent.click(getByText('Submit'));
  await wait(300);

  expect(onSubmit).toBeCalledTimes(1);
  expect(onSubmit.mock.calls[0][0]).toMatchObject({
    begin: `${moment().format('YYYY-MM')}-15`,
    end: `${moment().format('YYYY-MM')}-15`
  });

  fireEvent.click(getByText('ChangeValue'));
  await wait(200);
  expect(
    (container.querySelector('input[placeholder="结束时间"]') as any).value
  ).toBe(`${moment().format('YYYY-MM')}-16`);

  fireEvent.click(getByText('Submit'));
  await wait(300);

  expect(onSubmit).toBeCalledTimes(2);
  expect(onSubmit.mock.calls[1][0]).toMatchObject({
    begin: `${moment().format('YYYY-MM')}-15`,
    end: `${moment().format('YYYY-MM')}-16`
  });
});
