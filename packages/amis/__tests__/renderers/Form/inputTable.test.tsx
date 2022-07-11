import React = require('react');
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv} from '../../helper';

test('Renderer:input table', () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'form',
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
  // TODO: data.table 渲染不出来？
  expect(container).toMatchSnapshot();
});

test('Renderer:input table add', async () => {
  const {container, findByText} = render(
    amisRender(
      {
        type: 'form',
        api: '/api/mock2/form/saveForm',
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

  fireEvent.click(document.querySelector('.cxd-OperationField button')!);

  // TODO: 没保存成功，可能是change改变了 input 却没改变form数据?
  // expect(container).toMatchSnapshot();

  await waitFor(() => {
    container.querySelector('[icon="plus"]');
  });

  fireEvent.click(container.querySelector('[icon="plus"]')!);

  expect(container.querySelectorAll('td.cxd-Table-expandCell').length).toBe(2);
});
