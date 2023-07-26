import React = require('react');
import {render} from '@testing-library/react';
import '../../src';
import {render as amisRender} from '../../src';
import {makeEnv} from '../helper';

test('Renderer:amisRender test', () => {
  const {container} = render(
    amisRender(
      {
        type: 'amis',
        value: {
          type: 'tpl',
          tpl: 'hello world'
        }
      },
      {},
      makeEnv({})
    )
  );
  expect(container).toMatchSnapshot();
});
