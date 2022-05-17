import React = require('react');
import {render} from '@testing-library/react';
import '../../src/themes/default';
import {render as amisRender} from '../../src/index';
import {makeEnv} from '../helper';

test('Renderer:status', () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: [
          {
            type: 'status',
            value: 0
          },
          {
            type: 'status',
            value: 1
          },
          {
            type: 'status',
            value: 'success'
          },
          {
            type: 'status',
            value: 'pending'
          },
          {
            type: 'status',
            value: 'fail'
          },
          {
            type: 'status',
            value: 'fail'
          },
          {
            type: 'status',
            value: 'queue'
          },
          {
            type: 'status',
            value: 'schedule'
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});
