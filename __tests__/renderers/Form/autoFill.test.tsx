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

test('Form:options:autoFill', async () => {
  const {container, getByText} = render(
    amisRender(
      {
        type: 'form',
        title: 'The form',
        body: [
          {
            type: 'radios',
            name: 'a',
            autoFill: {
              aValue: '${value}',
              aLabel: '${label}',
              aId: '${id}'
            },
            options: [
              {
                label: 'OptionA',
                value: 'a',
                id: 233
              },
              {
                label: 'OptionB',
                value: 'b'
              }
            ]
          },
          {
            type: 'input-text',
            name: 'a'
          },
          {
            type: 'input-text',
            name: 'aValue'
          },
          {
            type: 'input-text',
            name: 'aLabel'
          },
          {
            type: 'input-text',
            name: 'aId'
          }
        ],
        submitText: null,
        actions: []
      },
      {},
      makeEnv()
    )
  );

  // expect(container).toMatchSnapshot();
  fireEvent.click(getByText(/OptionA/));
  await wait(500);

  expect(container.querySelector('input[name=a]')?.getAttribute('value')).toBe(
    'a'
  );
  expect(
    container.querySelector('input[name=aValue]')?.getAttribute('value')
  ).toBe('a');
  expect(
    container.querySelector('input[name=aLabel]')?.getAttribute('value')
  ).toBe('OptionA');
  expect(
    container.querySelector('input[name=aId]')?.getAttribute('value')
  ).toBe('233');

  fireEvent.click(getByText(/OptionB/));
  await wait(1000);

  expect(container.querySelector('input[name=a]')?.getAttribute('value')).toBe(
    'b'
  );
  expect(
    container.querySelector('input[name=aValue]')?.getAttribute('value')
  ).toBe('b');
  expect(
    container.querySelector('input[name=aLabel]')?.getAttribute('value')
  ).toBe('OptionB');
  expect(
    container.querySelector('input[name=aId]')?.getAttribute('value')
  ).toBe('');
});

test('Form:options:autoFill:data', async () => {
  const onSubmit = jest.fn();
  const {container, getByText} = render(
    amisRender(
      {
        type: 'form',
        title: 'The form',
        controls: [
          {
            type: 'radios',
            name: 'a',
            autoFill: {
              aValue: '${value}',
              aLabel: '${label}',
              aId: '${id}'
            },
            options: [
              {
                label: 'OptionA',
                value: 'a',
                id: 233
              },
              {
                label: 'OptionB',
                value: 'b'
              }
            ]
          }
        ],
        submitText: 'Submit'
      },
      {
        onSubmit: onSubmit
      },
      makeEnv()
    )
  );

  fireEvent.click(getByText(/OptionA/));
  fireEvent.click(getByText(/Submit/));
  await wait(500);

  expect(onSubmit).toBeCalled();
  expect(onSubmit.mock.calls[0][0]).toMatchSnapshot();

  fireEvent.click(getByText(/OptionB/));
  fireEvent.click(getByText(/Submit/));
  await wait(500);

  expect(onSubmit).toBeCalledTimes(2);
  expect(onSubmit.mock.calls[1][0]).toMatchSnapshot();
});

test('Form:options:autoFill:multiple:data', async () => {
  const onSubmit = jest.fn();
  const {container, getByText} = render(
    amisRender(
      {
        type: 'form',
        title: 'The form',
        controls: [
          {
            type: 'radios',
            name: 'a',
            multiple: true,
            autoFill: {
              aValues: '${items|pick:value}',
              aLabels: '${items|pick:label}',
              aIds: '${items|pick:id}'
            },
            options: [
              {
                label: 'OptionA',
                value: 'a',
                id: 233
              },
              {
                label: 'OptionB',
                value: 'b'
              }
            ]
          }
        ],
        submitText: 'Submit'
      },
      {
        onSubmit: onSubmit
      },
      makeEnv()
    )
  );

  fireEvent.click(getByText(/OptionA/));
  fireEvent.click(getByText(/Submit/));
  await wait(500);

  expect(onSubmit).toBeCalled();
  expect(onSubmit.mock.calls[0][0]).toMatchSnapshot();

  fireEvent.click(getByText(/OptionB/));
  fireEvent.click(getByText(/Submit/));
  await wait(500);

  expect(onSubmit).toBeCalledTimes(2);
  expect(onSubmit.mock.calls[1][0]).toMatchSnapshot();
});
