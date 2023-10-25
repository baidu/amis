/**
 * 组件名称: InputRichText 富文本组件
 * 
 * 单测内容：
 1. 基础使用
 */

import {fireEvent, render} from '@testing-library/react';
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
