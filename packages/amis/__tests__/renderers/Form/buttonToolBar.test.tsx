/**
 * 组件名称：Button-Toolbar 按钮工具栏
 * 单测内容：
 * 1. 基础使用
 */

import {render, cleanup, fireEvent} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv, wait} from '../../helper';
import {clearStoresCache} from '../../../src';

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
