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

test('Renderer:button-group', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'form',
        title: 'The form',
        controls: [
          {
            type: 'button-group',
            name: 'select',
            label: '单选',
            options: [
              {
                label: 'Option A',
                value: 'a'
              },
              {
                label: 'Option B',
                value: 'b'
              }
            ]
          },
          {
            type: 'static',
            name: 'select',
            label: '当前值'
          }
        ],
        submitText: null,
        actions: []
      },
      {},
      makeEnv()
    )
  );
  expect(container).toMatchSnapshot();
});

test('Renderer:button-group:multiple clearable', async () => {
  const {getByText, container} = render(
    amisRender(
      {
        type: 'form',
        title: 'The form',
        controls: [
          {
            type: 'button-group',
            name: 'select',
            label: '多选',
            multiple: true,
            clearable: true,
            options: [
              {
                label: 'Option A',
                value: 'a'
              },
              {
                label: 'Option B',
                value: 'b'
              }
            ]
          },
          {
            type: 'static',
            name: 'select',
            label: '当前值'
          }
        ],
        submitText: null,
        actions: []
      },
      {},
      makeEnv()
    )
  );
  await wait(100);
  fireEvent.click(getByText(/Option A/));
  await wait(100);
  fireEvent.click(getByText(/Option B/));
  await wait(300);
  expect(container).toMatchSnapshot();
  await wait(100);
  fireEvent.click(getByText(/Option B/));
  await wait(300);
  expect(container).toMatchSnapshot();
});
