import React = require('react');
import {render, cleanup, fireEvent, waitFor} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv, wait} from '../../helper';
import {clearStoresCache} from '../../../src';

afterEach(() => {
  cleanup();
  clearStoresCache();
});

test('Renderer:list', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'form',
        title: 'The form',
        controls: [
          {
            type: 'list',
            name: 'select',
            label: '单选',
            clearable: true,
            options: [
              {
                label: 'Option A',
                value: 'a'
              },
              {
                label: 'Option B',
                value: 'b'
              },
              {
                label: 'OptionC',
                value: 'c',
                image:
                  'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893101144,2877209892&fm=23&gp=0.jpg'
              }
            ]
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

test('Renderer:list:multiple clearable', async () => {
  const {debug, container, findByText} = render(
    amisRender(
      {
        type: 'form',
        title: 'The form',
        controls: [
          {
            type: 'list',
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
