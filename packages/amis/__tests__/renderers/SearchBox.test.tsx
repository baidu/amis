import React = require('react');
import {render} from '@testing-library/react';
import '../../src';
import {render as amisRender} from '../../src';
import {makeEnv} from '../helper';

test('Renderer:searchbox', () => {
  const {container} = render(
    amisRender(
      {
        type: 'search-box',
        name: 'keywords'
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});
