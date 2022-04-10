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

test('Control:onChange', async () => {
  const onChange = jest
    .fn()
    .mockImplementation((value: any, oldValue: any, model: any, form: any) => {
      form.setValueByName('b', 2);
    });
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
            type: 'text',
            name: 'a',
            onChange: onChange
          },

          {
            type: 'text',
            name: 'b'
          },

          {
            type: 'submit',
            label: 'Submit'
          }
        ]
      },
      {},
      makeEnv()
    )
  );

  // expect(container).toMatchSnapshot();
  const input = container.querySelector('input[name=a]');
  expect(input).toBeTruthy();
  fireEvent.change(input!, {
    target: {
      value: '123'
    }
  });
  await wait(300);
  expect(onChange).toBeCalledTimes(1);

  fireEvent.click(getByText('Submit'));
  await wait(500);
  expect(onSubmit).toBeCalled();
  expect(onSubmit.mock.calls[0][0]).toMatchObject({
    a: '123',
    b: 2
  });
});

test('Control:formItem:reload', async () => {
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          options: [
            {
              label: 'A',
              value: 'a'
            },

            {
              label: 'B',
              value: 'b'
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
            type: 'form',
            name: 'xForm',
            wrapWithPanel: false,
            controls: [
              {
                type: 'select',
                name: 'a',
                source: '/api/source'
              }
            ],
            submitText: null,
            actions: []
          },

          {
            type: 'button',
            label: 'Reload',
            actionType: 'reload',
            target: 'xForm.a'
          }
        ]
      },
      {},
      makeEnv({
        fetcher
      })
    )
  );

  await wait(300);
  expect(fetcher).toHaveBeenCalled();

  fireEvent.click(getByText('Reload'));
  await wait(500);

  expect(fetcher).toBeCalledTimes(2);
});

test('options:clearValueOnHidden ', async () => {
  const onSubmit = jest.fn();
  const {container, getByText} = render(
    amisRender(
      {
        type: 'form',
        wrapWithPanel: false,
        onSubmit,
        controls: [
          {
            label: '选项x',
            type: 'list',
            name: 'a',
            autoFill: {
              b: '${label}'
            },
            options: [
              {
                label: '选项1',
                value: 1
              },
              {
                label: '选项2',
                value: 2
              }
            ]
          },
          {
            type: 'text',
            name: 'b',
            clearValueOnHidden: true,
            visibleOn: 'data.a !== 2'
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

  fireEvent.click(getByText('选项1'));
  await wait(500);

  fireEvent.click(getByText('Submit'));
  await wait(500);
  expect(onSubmit).toBeCalledTimes(1);
  expect(onSubmit.mock.calls[0][0]).toMatchObject({
    a: 1,
    b: '选项1'
  });

  fireEvent.click(getByText('选项2'));
  await wait(500);

  fireEvent.click(getByText('Submit'));
  await wait(500);
  expect(onSubmit).toBeCalledTimes(2);
  expect(onSubmit.mock.calls[1][0]).toMatchObject({
    a: 2
  });
});
