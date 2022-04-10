import React = require('react');
import {render, fireEvent} from '@testing-library/react';
import '../../../src/themes/default';
import {render as amisRender} from '../../../src/index';
import {makeEnv} from '../../helper';

test('Renderer:range', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'form',
        api: '/api/xxx',
        controls: [
          {
            type: 'input-range',
            name: 'range',
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

  const slider = container.querySelector('.cxd-InputRange-handle')!;
  fireEvent.mouseDown(slider);
  fireEvent.mouseMove(slider, {
    clientX: 400,
    clientY: 400
  });
  fireEvent.mouseUp(slider);

  const input = container.querySelector('.cxd-InputRange-input input');
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
            type: 'input-range',
            name: 'range',
            multiple: true,
            value: [10, 20],
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

  const inputs = container.querySelectorAll('.cxd-InputRange-input input');
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

test('Renderer:range:showSteps', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'form',
        api: '/api/xxx',
        controls: [
          {
            type: 'input-range',
            name: 'range',
            max: 10,
            showSteps: true,
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

  expect(container).toMatchSnapshot();
});

test('Renderer:range:marks', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'form',
        api: '/api/xxx',
        controls: [
          {
            type: 'input-range',
            name: 'range',
            parts: 5,
            marks: {
              '0': '0',
              '20%': '20Mbps',
              '40%': '40Mbps',
              '60%': '60Mbps',
              '80%': '80Mbps',
              '100': '100'
            }
          }
        ],
        title: 'The form',
        actions: []
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});

test('Renderer:range:tooltipVisible', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'form',
        api: '/api/xxx',
        controls: [
          {
            type: 'input-range',
            name: 'range',
            tooltipVisible: true,
            tooltipPlacement: 'right'
          }
        ],
        title: 'The form',
        actions: []
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});
