import React = require('react');
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup
} from '@testing-library/react';
import '../../../src';
import {render as amisRender, clearStoresCache} from '../../../src';
import {makeEnv, wait} from '../../helper';

afterEach(() => {
  cleanup();
  clearStoresCache();
});

test('Renderer:input table', () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'form',
          debug: 'true',
          data: {
            table: [
              {
                a: 'a1',
                b: 'b1'
              },
              {
                a: 'a2',
                b: 'b2'
              },
              {
                a: 'a3',
                b: 'b3'
              }
            ]
          },
          api: '/api/mock2/form/saveForm',
          body: [
            {
              type: 'input-table',
              name: 'table',
              columns: [
                {
                  name: 'a',
                  label: 'A'
                },
                {
                  name: 'b',
                  label: 'B'
                }
              ]
            }
          ]
        }
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});

test('Renderer: input-table with default value column', async () => {
  const onSubmitCallbackFn = jest
    .fn()
    .mockImplementation((values: any, actions: any) => {
      console.log({values: JSON.stringify(values), actions: actions});
      return true;
    });
  const {container, getByText} = render(
    amisRender(
      {
        type: 'page',
        body: [
          {
            type: 'form',
            api: '/api/mock2/form/saveForm',
            data: {
              table: [
                {a: 'a1', b: 'b1'},
                {a: 'a2', b: 'b2'},
                {a: 'a3', b: 'b3'}
              ]
            },
            actions: [
              {type: 'reset', label: 'Reset'},
              {type: 'submit', label: 'Submit'}
            ],
            body: [
              {
                type: 'input-table',
                name: 'table',
                label: 'Table',
                addable: true,
                needConfirm: false,
                columns: [
                  {
                    label: 'A',
                    name: 'a',
                    type: 'input-text'
                  },
                  {
                    label: 'B',
                    name: 'b',
                    type: 'select',
                    options: ['b1', 'b2', 'b3']
                  },
                  {
                    label: 'C',
                    name: 'c',
                    value: '${a}',
                    type: 'input-text'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        onSubmit: onSubmitCallbackFn
      },
      makeEnv({})
    )
  );

  await wait(1000);

  fireEvent.click(getByText('Submit'));

  waitFor(() => {
    expect(onSubmitCallbackFn).toHaveBeenCalledTimes(1);
    expect(onSubmitCallbackFn.mock.calls[0][0]).toEqual({
      table: [
        {a: 'a1', b: 'b1', c: 'a1'},
        {a: 'a2', b: 'b2', c: 'a2'},
        {a: 'a3', b: 'b3', c: 'a3'}
      ]
    });
  });
});

test('Renderer:input table add', async () => {
  const {container, findByText} = render(
    amisRender(
      {
        type: 'form',
        api: '/api/mock2/form/saveForm',
        debug: true,
        body: [
          {
            type: 'input-table',
            name: 'table',
            addable: true,
            editable: true,
            columns: [
              {
                name: 'a',
                label: 'A'
              },
              {
                name: 'b',
                label: 'B'
              }
            ]
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

  const add = await findByText(/新增/);

  fireEvent.click(add);

  const inputs = document.querySelectorAll('td input');

  fireEvent.change(inputs[0], {target: {value: 'aa'}});

  fireEvent.change(inputs[1], {target: {value: 'bb'}});

  const save = document.querySelector('.cxd-OperationField button');

  fireEvent.click(save!);

  // TODO: 这里不对，难道是点击出错了

  // expect(container).toMatchSnapshot();
});
