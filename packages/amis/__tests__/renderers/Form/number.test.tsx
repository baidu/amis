import React = require('react');
import {render, fireEvent} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv, wait} from '../../helper';

test('Renderer:number', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'form',
        api: '/api/xxx',
        controls: [
          {
            type: 'number',
            name: 'a',
            label: 'number',
            value: '123'
          }
        ],
        title: 'The form',
        actions: []
      },
      {},
      makeEnv({})
    )
  );

  const input = container.querySelector('input[step="1"]') as any;
  expect(input?.value).toEqual('123');
  fireEvent.change(input!, {
    target: {
      value: '456'
    }
  });
  await wait(300);
  expect(input?.value).toEqual('456');

  expect(container).toMatchSnapshot();
});
