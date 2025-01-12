import React = require('react');
import {render, fireEvent, waitFor} from '@testing-library/react';
import '../../src';
import {render as amisRender} from '../../src';
import {makeEnv, wait} from '../helper';
import 'jest-canvas-mock';

test('Renderer:bar-code', async () => {
  const {findByTestId} = render(
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

  const barcodeElement = await findByTestId('barcode');
  expect(barcodeElement).toBeInTheDocument();
});
