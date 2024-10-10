import React = require('react');
import {render, cleanup} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv} from '../../helper';
import {clearStoresCache} from '../../../src';

afterEach(() => {
  cleanup();
  clearStoresCache();
});

test('Renderer:array', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'form',
        title: 'The form',
        controls: [
          {
            name: 'array',
            label: '颜色集合',
            type: 'array',
            addable: true,
            removeable: true,
            minLength: 1,
            maxLength: 4,
            addButtonText: '新增',
            draggable: true,
            draggableTip: '可通过拖动每行中的【交换】按钮进行顺序调整',
            value: ['red'],
            inline: true,
            items: {
              type: 'color'
            }
          }
        ],
        submitText: null,
        actions: []
      },
      {},
      makeEnv()
    )
  );
  expect(container).toMatchSnapshot();
});
