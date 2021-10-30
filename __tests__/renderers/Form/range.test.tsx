import React = require('react');
import {render, fireEvent} from '@testing-library/react';
import '../../../src/themes/default';
import {render as amisRender} from '../../../src/index';
import {makeEnv} from '../../helper';

test('Renderer:number', async () => {
  const {container, getByRole} = render(
    amisRender(
      {
        type: 'form',
        api: '/api/xxx',
        controls: [
          {
            type: 'range',
            name: 'a',
            label: 'range',
            min: 0,
            max: 20,
            step: 2,
            value: 10,
            showInput: true
          }
        ],
        title: 'The form',
        actions: []
      },
      {},
      makeEnv({})
    )
  );

  fireEvent.mouseDown(getByRole('slider'));
  fireEvent.mouseMove(getByRole('slider'), {
    clientX: 400,
    clientY: 400
  });
  fireEvent.mouseUp(getByRole('slider'));

  const input = container.querySelector('input[name=a]');
  fireEvent.change(input!, {
    target: {
      value: '7'
    }
  });
  expect(container).toMatchSnapshot();
});

test('Renderer:range:multiple', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'form',
        api: '/api/xxx',
        controls: [
          {
            type: 'range',
            name: 'a',
            label: 'range',
            min: 0,
            max: 20,
            step: 2,
            value: '10,15',
            multiple: true,
            joinValues: true,
            delimiter: ',',
            clearable: true,
            showInput: true
          }
        ],
        title: 'The form',
        actions: []
      },
      {},
      makeEnv({})
    )
  );

  const inputs = container.querySelectorAll('input[name=a]');
  fireEvent.change(inputs[0], {
    target: {
      value: '7'
    }
  });
  fireEvent.blur(inputs[0]);
  fireEvent.change(inputs[1], {
    target: {
      value: '13'
    }
  });
  fireEvent.blur(inputs[1]);
  const close = container.querySelector('a.cxd-InputRange-clear');
  fireEvent.click(close!);

  expect(container).toMatchSnapshot();
});
