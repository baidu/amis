import React = require('react');
import {render} from '@testing-library/react';
import '../../src/themes/default';
import {render as amisRender} from '../../src/index';
import {makeEnv} from '../helper';

test('Renderer:grid2d', () => {
  const {container} = render(
    amisRender(
      {
        type: 'grid-2d',
        grids: [
          {
            x: 1,
            y: 1,
            h: 1,
            w: 6,
            gridClassName: 'bg-green-300',
            type: 'tpl',
            tpl: '[grid-1] x:1 y:1 h:1 w:6'
          },
          {
            x: 7,
            y: 1,
            h: 1,
            w: 6,
            gridClassName: 'bg-blue-300',
            type: 'tpl',
            tpl: '[grid-2] x:7 y:1 h:1 w:6'
          },
          {
            x: 1,
            y: 2,
            h: 2,
            w: 4,
            gridClassName: 'bg-red-300',
            type: 'tpl',
            tpl: '[grid-3] x:1 y:2 h:2 w:4'
          },
          {
            x: 5,
            y: 2,
            h: 1,
            w: 8,
            gridClassName: 'bg-purple-300',
            type: 'tpl',
            tpl: '[grid-4] x:5 y:2 h:1 w:8'
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});
