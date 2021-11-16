import React = require('react');
import {render, fireEvent} from '@testing-library/react';
import '../../../src/themes/default';
import {render as amisRender} from '../../../src/index';
import {makeEnv, wait} from '../../helper';

test('Renderer:formula', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'form',
        api: '/api/xxx',
        controls: [
          {
            type: 'number',
            name: 'a',
            label: 'a'
          },
          {
            type: 'number',
            name: 'b',
            label: 'b'
          },
          {
            type: 'number',
            name: 'sum1',
            label: 'sum1'
          },
          {
            type: 'number',
            name: 'sum2',
            label: 'sum2'
          },
          {
            type: 'number',
            name: 'sum3',
            label: 'sum3'
          },
          {
            type: 'formula',
            name: 'sum1',
            value: 0,
            formula: 'a + b'
          },
          {
            type: 'formula',
            name: 'sum2',
            condition: '${b}',
            value: 0,
            formula: 'a + b + 1'
          },
          {
            type: 'formula',
            name: 'sum3',
            condition: 'data.b',
            value: 0,
            formula: 'a + b + 2'
          }
        ],
        title: 'The form',
        actions: []
      },
      {},
      makeEnv({})
    )
  );

  const inputs = document.querySelectorAll('input[role="spinbutton"]') as any;
  fireEvent.change(inputs[0], {
    target: {
      value: 1
    }
  });
  fireEvent.change(inputs[1], {
    target: {
      value: 2
    }
  });
  await wait(100);
  expect(inputs[2].value).toBe('3');
  expect(inputs[3].value).toBe('4');
  expect(inputs[4].value).toBe('5');

  expect(container).toMatchSnapshot();
});
