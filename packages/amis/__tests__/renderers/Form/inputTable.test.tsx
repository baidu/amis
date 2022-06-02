import React = require('react');
import {render, screen, fireEvent} from '@testing-library/react';
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
