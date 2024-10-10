import React = require('react');
import {render} from '@testing-library/react';
import '../../src';
import {render as amisRender} from '../../src';
import {makeEnv} from '../helper';

test('Renderer:container', () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'container',
          className: 'bg-white',
          body: [
            {
              type: 'tpl',
              tpl: '内容1'
            },
            {
              type: 'plain',
              tpl: '内容2'
            }
          ]
        }
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});
