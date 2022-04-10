import React = require('react');
import {render} from '@testing-library/react';
import '../../src/themes/default';
import {render as amisRender} from '../../src/index';
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
