import React = require('react');
import {render, fireEvent, waitFor} from '@testing-library/react';
import '../../src/themes/default';
import {render as amisRender} from '../../src/index';
import {makeEnv, wait} from '../helper';
import 'jest-canvas-mock';

test('Renderer:bar-code', async () => {
  const {container, getByTestId} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'barcode',
          value: 'amis'
        }
      },
      {},
      makeEnv({})
    )
  );
  await waitFor(() => expect(getByTestId('barcode')).toBeInTheDocument());

  expect(container).toMatchSnapshot();
});
