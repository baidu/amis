import React = require('react');
import {render, cleanup, fireEvent} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv, wait} from '../../helper';
import {clearStoresCache} from 'amis';

afterEach(() => {
  cleanup();
  clearStoresCache();
});

test('Renderer:button-toolbar', async () => {
  const {getByText, container}: any = render(
    amisRender(
      {
        type: 'form',
        title: 'The form',
        controls: [
          {
            type: 'button-toolbar',
            buttons: [
              {
                type: 'button',
                label: 'OpenDialog',
                actionType: 'dialog',
                dialog: {
                  confirmMode: false,
                  title: '提示',
                  body: '对，你刚点击了！'
                }
              },
              {
                type: 'submit',
                label: 'Submit'
              },
              {
                type: 'reset',
                label: 'Reset'
              }
            ]
          }
        ],
        submitText: null,
        actions: []
      },
      {},
      makeEnv({
        getModalContainer: () => container
      })
    )
  );
  expect(container).toMatchSnapshot();
  fireEvent.click(getByText(/OpenDialog/));
  await wait(300);
  expect(container).toMatchSnapshot();
});
