import React = require('react');
import {render, fireEvent} from '@testing-library/react';
import '../../../src/themes/default';
import {render as amisRender} from '../../../src/index';
import {makeEnv} from '../../helper';

test('Renderer:textarea', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'form',
        api: '/api/xxx',
        controls: [
          {
            type: 'textarea',
            name: 'a',
            label: 'textarea',
            minRows: 3,
            maxRows: 10,
            trimContents: true,
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

  const textarea = container.querySelector('textarea');
  expect(textarea?.innerHTML).toEqual('123');
  fireEvent.focus(textarea!);
  fireEvent.change(textarea!, {
    target: {
      value: '456'
    }
  });
  fireEvent.blur(textarea!);
  const textareaChanged = container.querySelector('textarea');
  expect(textareaChanged?.innerHTML).toEqual('456');

  expect(container).toMatchSnapshot();
});
