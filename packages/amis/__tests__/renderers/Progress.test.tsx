import React = require('react');
import {render} from '@testing-library/react';
import '../../src';
import {render as amisRender} from '../../src';
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
