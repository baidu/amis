import React = require('react');
import {render} from '@testing-library/react';
import '../../src/themes/default';
import {render as amisRender} from '../../src/index';
import {makeEnv} from '../helper';

test('Renderer:each', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'each',
        items: {
          type: 'tpl',
          tpl: '<%= data.name %>'
        },
        value: [{name: 'jack'}, {name: 'martin'}],
        className: 'show'
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});
