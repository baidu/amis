import React = require('react');
import {render, cleanup} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv} from '../../helper';
import {clearStoresCache} from 'amis';

afterEach(() => {
  cleanup();
  clearStoresCache();
});

test('Renderer:hbox', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'form',
        title: 'The form',
        controls: [
          {
            type: 'hbox',
            columns: [
              {
                columnClassName: 'w-sm',
                controls: [
                  {
                    name: 'text',
                    type: 'text',
                    label: false,
                    placeholder: 'Text'
                  }
                ]
              },
              {
                type: 'tpl',
                tpl: '其他类型的渲染器'
              }
            ]
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
