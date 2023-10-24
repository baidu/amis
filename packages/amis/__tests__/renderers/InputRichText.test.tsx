/**
 * 组件名称: InputRichText 富文本组件
 * 
 * 单测内容：
 1. 基础使用
 2. change事件
 */

import {fireEvent, render, waitFor, within} from '@testing-library/react';
import {current} from 'packages/amis-ui/src/components/ModalManager';
import '../../src';
import {render as amisRender} from '../../src';
import {makeEnv, replaceReactAriaIds, wait} from '../helper';

// 1. 基础使用
test('Renderer:InputRichText', () => {
  const schema = {
    type: 'form',
    api: '/api/mock2/form/saveForm',
    body: [
      {
        type: 'input-rich-text',
        name: 'rich',
        label: 'Rich Text'
      }
    ]
  };
  const {container} = render(amisRender(schema, {}, makeEnv({})));
  replaceReactAriaIds(container);
  expect(container).toMatchSnapshot();
});

// 2. change事件
test('2. change event', async () => {
  const mockFn = jest.fn();
  const {container} = render(
    amisRender(
      {
        type: 'input-rich-text',
        name: 'rich',
        label: 'Rich Text',
        onEvent: {
          change: {
            weight: 0,
            actions: [
              {
                actionType: 'custom',
                script: mockFn
              }
            ]
          }
        }
      },
      {}
    )
  );

  const rich = container.querySelector('.cxd-RichTextControl')!;

  fireEvent.change(
    rich
      .querySelector('.tox-edit-area__iframe')
      ?.contentWindow.document.body.querySelector('p'),
    {
      target: {value: 9}
    }
  );

  await wait(500);
  expect(mockFn).toBeCalledTimes(1);
});
