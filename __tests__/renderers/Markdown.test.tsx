import React = require('react');
import {render} from '@testing-library/react';
import '../../src/themes/default';
import {render as amisRender} from '../../src/index';
import {makeEnv} from '../helper';

test('Renderer:markdown', () => {
  const {container} = render(
    amisRender(
      {
        type: 'markdown',
        value: '# title\n markdown **text**'
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});
