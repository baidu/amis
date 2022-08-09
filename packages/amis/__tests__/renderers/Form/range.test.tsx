import React = require('react');
import {render, fireEvent, screen, waitFor} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv, wait} from '../../helper';

test('Renderer:range with showInput', async () => {
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

  expect(
    container.querySelector('.cxd-InputRange-input') as Element
  ).toBeInTheDocument();

  const input = container.querySelector('.cxd-InputRange-input input');
  fireEvent.change(input!, {
    target: {
      value: '7'
    }
  });
  await wait(200);

  expect(
    (
      container.querySelector('.cxd-InputRange-track-active') as Element
    ).getAttribute('style')
  ).toContain('width: 7%');

  expect(container).toMatchSnapshot();
});

test('Renderer:range with multiple & clearable & delimiter', async () => {
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
            delimiter: '--',
            value: '10--20',
            showInput: true,
            clearable: false
          },
          {
            type: 'static',
            name: 'range'
          }
        ],
        title: 'The form',
        actions: []
      },
      {},
      makeEnv({})
    )
  );

  expect(
    container.querySelector('.cxd-InputRange-clear')
  ).not.toBeInTheDocument();

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

  await wait(200);
  expect(
    (
      container.querySelector('.cxd-InputRange-track-active') as Element
    ).getAttribute('style')
  ).toBe('width: 6%; left: 7%;');

  const icons = container.querySelectorAll('.cxd-InputRange-handle');
  expect(icons[0].getAttribute('style')).toContain('left: 7%;');
  expect(icons[1].getAttribute('style')).toContain('left: 13%;');

  expect(
    (container.querySelector('.cxd-PlainField') as Element).innerHTML
  ).toBe('7--13');

  expect(container).toMatchSnapshot();
});

test('Renderer:range with showSteps', async () => {
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

  await wait(200);

  const dots = container.querySelectorAll('.cxd-InputRange-track-dot');

  expect(dots.length).toBe(9);
  expect(dots[8].getAttribute('style')).toContain('left: 90%;');

  expect(container).toMatchSnapshot();
});

test('Renderer:range with marks', async () => {
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
              '100%': '100'
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

  await wait(200);

  const marks = container.querySelectorAll('.cxd-InputRange-marks > div');

  expect(marks.length).toBe(6);
  expect(marks[3].innerHTML).toBe('<span>60Mbps</span>');
  expect(marks[3].getAttribute('style')).toContain('left: 60%;');

  expect(container).toMatchSnapshot();
});

test('Renderer:range with tooltipVisible & tooltipPlacement', async () => {
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
            tooltipPlacement: 'right',
            value: 41
          }
        ],
        title: 'The form',
        actions: []
      },
      {},
      makeEnv({})
    )
  );

  await wait(200);

  expect(
    container.querySelector(
      '.cxd-InputRange-label.pos-right.cxd-InputRange-label-visible'
    )
  ).toBeInTheDocument();

  const labelSpan = container.querySelector('.cxd-InputRange-label span');
  expect(labelSpan).toBeI;

  expect(labelSpan!.innerHTML).toBe('41');

  expect(container).toMatchSnapshot();
});

test('Renderer:range with min & max & step & joinValues', async () => {
  const onSubmit = jest.fn();
  const submitBtnText = 'Submit';
  const {container} = render(
    amisRender(
      {
        type: 'form',
        submitText: submitBtnText,
        api: '/api/mock/saveForm?waitSeconds=1',
        body: [
          {
            type: 'input-range',
            name: 'range',
            min: 0,
            max: 1,
            step: 0.1,
            multiple: true,
            showInput: true,
            joinValues: false
          }
        ]
      },
      {onSubmit},
      makeEnv({})
    )
  );

  const inputs = container.querySelectorAll('.cxd-InputRange-input input');
  fireEvent.change(inputs[0], {
    target: {
      value: '0.2'
    }
  });
  fireEvent.blur(inputs[0]);
  fireEvent.change(inputs[1], {
    target: {
      value: '0.8'
    }
  });
  fireEvent.blur(inputs[1]);

  await wait(200);
  expect(
    (
      container.querySelector('.cxd-InputRange-track-active') as Element
    ).getAttribute('style')
  ).toContain('width: 60%; left: 20%;');

  await wait(500);
  const submitBtn = screen.getByRole('button', {name: submitBtnText});

  await waitFor(() => {
    expect(submitBtn).toBeInTheDocument();
  });
  fireEvent.click(submitBtn);

  await wait(500);
  const formData = onSubmit.mock.calls[0][0];
  expect(onSubmit).toHaveBeenCalled();
  expect(formData).toEqual({
    range: {
      min: 0.2,
      max: 0.8
    }
  });

  expect(container).toMatchSnapshot();
});
