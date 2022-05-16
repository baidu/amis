import React = require('react');
import {render} from '@testing-library/react';
import '../../src/themes/default';
import {render as amisRender} from '../../src/index';
import {makeEnv} from '../helper';

test('Renderer:button-toolbar', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'button-toolbar',
        name: 'button-toolbar',
        label: 'button-toolbar',
        buttons: [
          {
            type: 'button',
            label: '按钮1'
          },
          {
            type: 'button',
            label: '按钮2'
          }
        ],
        className: 'show'
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});
