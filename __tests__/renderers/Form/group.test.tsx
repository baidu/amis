import React = require('react');
import {render, cleanup} from '@testing-library/react';
import '../../../src/themes/default';
import {render as amisRender} from '../../../src/index';
import {makeEnv} from '../../helper';
import {clearStoresCache} from '../../../src/factory';

afterEach(() => {
  cleanup();
  clearStoresCache();
});

test('Renderer:group', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'form',
        title: 'The form',
        controls: [
          {
            type: 'group',
            mode: 'horizontal',
            className: 'bg-white',
            horizontal: {
              label: 1,
              right: 10,
              offset: 1
            },
            controls: [
              {
                type: 'text',
                name: 'test1',
                label: 'Label',
                placeholder: 'Placeholder'
              },
              {
                type: 'text',
                name: 'test2',
                label: 'Label',
                placeholder: 'Placeholder'
              }
            ]
          },
          {
            type: 'group',
            mode: 'inline',
            className: 'bg-white',
            controls: [
              {
                type: 'text',
                name: 'test1',
                label: 'Label',
                placeholder: 'Placeholder'
              },
              {
                type: 'text',
                name: 'test2',
                label: 'Label',
                placeholder: 'Placeholder'
              }
            ]
          },
          {
            type: 'group',
            direction: 'vertical',
            controls: [
              {
                type: 'text',
                name: 'test1',
                label: 'Label',
                placeholder: 'Placeholder'
              },
              {
                type: 'text',
                name: 'test2',
                label: 'Label',
                placeholder: 'Placeholder'
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
