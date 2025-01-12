import React = require('react');
import {findByText, render, waitFor, screen} from '@testing-library/react';
import '../../src';
import {render as amisRender} from '../../src';
import {makeEnv, wait} from '../helper';

test('Renderer:json', async () => {
  const {findByText} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'json',
          value: {
            aKey: 'aValue'
          }
        }
      },
      {},
      makeEnv({})
    )
  );

  const jsonElement = await findByText('aKey');
  expect(jsonElement).toBeInTheDocument();
});
