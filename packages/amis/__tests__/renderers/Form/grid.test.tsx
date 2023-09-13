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

test('Renderer:hbox', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'form',
        title: 'The form',
        controls: [
          {
            type: 'grid',
            columns: [
              {
                md: 3,
                mdOffset: 1,
                columnClassName: 'bg-white',
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
                md: 9,
                type: 'tpl',
                tpl: '其他渲染器类型'
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
