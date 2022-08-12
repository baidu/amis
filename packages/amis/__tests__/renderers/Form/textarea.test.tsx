import React = require('react');
import {render, fireEvent, waitFor} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv, wait} from '../../helper';

const setup = async (items: any[] = []) => {
  const util = render(
    amisRender(
      {
        type: 'form',
        api: '/api/xxx',
        controls: items,
        title: 'The form'
      },
      {},
      makeEnv({})
    )
  );

  const textarea = util.container.querySelector(
    '.cxd-TextareaControl > textarea.cxd-TextareaControl-input'
  )!;

  expect(textarea).toBeInTheDocument();

  return {
    ...util,
    textarea
  };
};

test('Renderer:textarea', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'form',
        api: '/api/xxx',
        controls: [
          {
            type: 'textarea',
            name: 'a',
            label: 'textarea',
            minRows: 3,
            maxRows: 10,
            trimContents: true,
            value: '123'
          }
        ],
        title: 'The form',
        actions: []
      },
      {},
      makeEnv({})
    )
  );

  await waitFor(() => {
    expect(container.querySelector('[name="a"]')).toBeInTheDocument();
  });
  const textarea = container.querySelector('textarea');
  expect(textarea?.innerHTML).toEqual('123');

  fireEvent.change(textarea!, {
    target: {
      value: '456'
    }
  });
  await waitFor(() => {
    const textareaChanged = container.querySelector('textarea');
    expect(textareaChanged?.innerHTML).toEqual('456');
  });

  expect(container).toMatchSnapshot();
});

test('Renderer:textarea with trimContents & showCounter', async () => {
  const {container, textarea} = await setup([
    {
      type: 'textarea',
      name: 'text',
      label: 'textarea',
      trimContents: true,
      showCounter: true,
      value: '123'
    }
  ]);

  expect(
    container.querySelector('.cxd-TextareaControl-counter')
  ).toBeInTheDocument();
  expect(
    (container.querySelector('.cxd-TextareaControl-counter') as Element)
      .innerHTML
  ).toBe('3');

  fireEvent.change(textarea, {target: {value: '   12345   '}});
  fireEvent.blur(textarea);
  await wait(500);

  expect(textarea.innerHTML).toBe('12345');
  expect(
    (container.querySelector('.cxd-TextareaControl-counter') as Element)
      .innerHTML
  ).toBe('5');

  expect(container).toMatchSnapshot();
});

test('Renderer:textarea with maxLength & clearable & resetValue', async () => {
  const {container, textarea} = await setup([
    {
      type: 'textarea',
      name: 'text',
      label: 'textarea',
      clearable: true,
      resetValue: 'i am reset value',
      showCounter: true,
      maxLength: 9,
      value: '123'
    }
  ]);

  expect(
    container.querySelector('.cxd-TextareaControl-clear')
  ).toBeInTheDocument();
  expect(
    (container.querySelector('.cxd-TextareaControl-counter') as Element)
      .innerHTML
  ).toBe('3/9');

  fireEvent.click(container.querySelector('.cxd-TextareaControl-clear')!);
  await wait(500);
  expect(textarea.innerHTML).toBe('i am reset value');
  expect(
    (container.querySelector('.cxd-TextareaControl-counter') as Element)
      .innerHTML
  ).toBe('16/9');

  const submitBtn = container.querySelector(
    'button[type="submit"]'
  ) as HTMLElement;

  fireEvent.click(submitBtn);

  await wait(500);
  expect(
    container.querySelector(
      '.cxd-TextareaControl.is-error.has-error--maxLength'
    )
  ).toBeInTheDocument();

  expect(container).toMatchSnapshot();
});

test('Renderer:textarea with  readOnly', async () => {
  const {container, textarea} = await setup([
    {
      type: 'textarea',
      name: 'text',
      label: 'textarea',
      readOnly: true,
      value: '123'
    }
  ]);

  expect(container.querySelector('textarea[readonly]')).toBeInTheDocument();

  expect(container).toMatchSnapshot();
});
