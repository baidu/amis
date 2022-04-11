import React = require('react');
import {render, cleanup, fireEvent, waitFor} from '@testing-library/react';
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
  const {getByText, container, findByText} = render(
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
  // 这个是为了用于监视值是否变更完成
  const refDom = container.querySelector('.cxd-PlainField') as Element;

  fireEvent.click(await findByText(/Option A/));
  await waitFor(() => expect(refDom.innerHTML).toBe('a'));
  expect(container).toMatchSnapshot();

  fireEvent.click(await findByText(/Option B/));
  await waitFor(() => expect(refDom.innerHTML).toBe('a,b'));
  expect(container).toMatchSnapshot();

  fireEvent.click(await findByText(/Option B/));
  await waitFor(() => expect(refDom.innerHTML).toBe('a'));
  expect(container).toMatchSnapshot();
});
