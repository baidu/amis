import React = require('react');
import {render} from '@testing-library/react';
import '../../../src/themes/default';
import {render as amisRender} from '../../../src/index';
import {makeEnv} from '../../helper';

test('Renderer:combo', () => {
  const {container} = render(
    amisRender(
      {
        type: 'form',
        mode: 'horizontal',
        api: '/api/mock2/form/saveForm',
        body: [
          {
            type: 'combo',
            name: 'combo1',
            label: 'Combo 单行展示',
            items: [
              {
                name: 'text',
                label: '文本',
                type: 'input-text'
              },
              {
                name: 'select',
                label: '选项',
                type: 'select',
                options: ['a', 'b', 'c']
              }
            ]
          },
          {
            type: 'divider'
          },
          {
            type: 'combo',
            name: 'combo2',
            label: 'Combo 多行展示',
            multiLine: true,
            items: [
              {
                name: 'text',
                label: '文本',
                type: 'input-text'
              },
              {
                name: 'select',
                label: '选项',
                type: 'select',
                options: ['a', 'b', 'c']
              }
            ]
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});
