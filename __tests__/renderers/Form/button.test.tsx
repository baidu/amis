import React = require('react');
import {render, cleanup, fireEvent} from '@testing-library/react';
import '../../../src/themes/default';
import {render as amisRender} from '../../../src/index';
import {makeEnv} from '../../helper';
import {clearStoresCache} from '../../../src/factory';

afterEach(() => {
  cleanup();
  clearStoresCache();
});

test('Renderer:button', async () => {
  const {getByText, container}: any = render(
    amisRender(
      {
        type: 'form',
        title: 'The form',
        controls: [
          {
            type: 'button',
            name: 'test',
            label: 'Text',
            icon: 'fa fa-plus'
          },
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
            level: 'primary',
            label: 'Submit'
          },
          {
            type: 'reset',
            label: 'Reset',
            level: 'danger',
            size: 'sm',
            className: 'r-2x'
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
  expect(container).toMatchSnapshot();
});
