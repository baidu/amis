import React = require('react');
import {render, waitFor} from '@testing-library/react';
import '../../src';
import {render as amisRender} from '../../src';
import {makeEnv, wait} from '../helper';

test('Renderer:json', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'json',
          value: {
            a: 'a',
            b: 'b',
            c: {
              d: 'd'
            }
          }
        }
      },
      {},
      makeEnv({})
    )
  );

  await wait(1000);
  expect(container).toMatchSnapshot();
});
