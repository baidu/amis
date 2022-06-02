import React = require('react');
import {render, cleanup, fireEvent} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv, wait} from '../../helper';
import {clearStoresCache} from 'amis';

afterEach(() => {
  cleanup();
  clearStoresCache();
});

test('options:linkage', async () => {
  const onSubmit = jest.fn();
  const {container, getByText} = render(
    amisRender(
      {
        type: 'form',
        wrapWithPanel: false,
        controls: [
          {
            label: '选项x',
            type: 'list',
            multiple: false,
            labelClassName: 'text-muted',
            name: 'a',
            inline: true,
            options: [
              {
                label: '选项1',
                value: 1
              },
              {
                label: '选项2',
                value: 2
              },
              {
                label: '选项3',
                value: 3
              }
            ]
          },
          {
            label: '选项y',
            type: 'radios',
            labelClassName: 'text-muted',
            name: 'b',
            inline: true,
            options: [
              {
                label: '选项a',
                value: 1,
                disabledOn: 'data.a == 1'
              },
              {
                label: '选项b',
                value: 2,
                hiddenOn: 'data.a == 2'
              },
              {
                label: '选项c',
                value: 3,
                visibleOn: 'data.a == 3'
              }
            ]
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
  fireEvent.click(getByText('选项1'));
  await wait(600);

  expect(container).toMatchSnapshot();

  fireEvent.click(getByText('选项2'));
  await wait(600);

  expect(container).toMatchSnapshot();

  fireEvent.click(getByText('选项3'));
  await wait(600);

  expect(container).toMatchSnapshot();
});
