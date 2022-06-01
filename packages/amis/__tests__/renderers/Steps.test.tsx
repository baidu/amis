import React = require('react');
import {render} from '@testing-library/react';
import '../../src/themes/default';
import {render as amisRender} from '../../src/index';
import {makeEnv} from '../helper';

test('Renderer:steps', () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: [
          {
            type: 'steps',
            value: 1,
            steps: [
              {
                title: 'First',
                subTitle: 'this is subTitle',
                description: 'this is description'
              },
              {
                title: 'Second'
              },
              {
                title: 'Last'
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
});
