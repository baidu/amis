import React = require('react');
import {render, cleanup} from '@testing-library/react';
import '../../../src/themes/default';
import {render as amisRender} from '../../../src/index';
import {makeEnv} from '../../helper';
import {clearStoresCache} from '../../../src/factory';

afterEach(() => {
  cleanup();
  clearStoresCache();
});

test('Renderer:tabs', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'form',
        title: 'The form',
        controls: [
          {
            type: 'tabs',
            tabClassName: 'bg-info',
            tabs: [
              {
                title: '基本配置',
                body: '<p>tab1 内容</p>'
              },
              {
                title: '其他配置',
                controls: [
                  {
                    name: 'c',
                    type: 'text',
                    label: '文本3'
                  },
                  {
                    name: 'd',
                    type: 'text',
                    label: '文本4'
                  }
                ]
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
