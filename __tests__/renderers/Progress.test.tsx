import React = require('react');
import {render} from '@testing-library/react';
import '../../src/themes/default';
import {render as amisRender} from '../../src/index';
import {makeEnv} from '../helper';

test('Renderer:progress', () => {
  const {container} = render(
    amisRender(
      {
        type: 'progress',
        value: 60
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});
