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

test('Renderer:switch', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'form',
        title: 'The form',
        controls: [
          {
            name: 'switch',
            className: 'block',
            label: '开关',
            type: 'switch',
            addable: true,
            removeable: true,
            minLength: 1,
            maxLength: 4,
            addButtonText: '新增',
            draggable: true,
            draggableTip: '可通过拖动每行中的【交换】按钮进行顺序调整',
            value: true,
            trueValue: true,
            falseValue: false,
            disabled: false,
            option: 'switch',
            optionAtLeft: false
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
