import React = require('react');
import {render} from '@testing-library/react';
import '../../src/themes/default';
import {render as amisRender} from '../../src/index';
import {makeEnv} from '../helper';

test('Renderer:gridnav', () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        data: {
          items: [
            {
              icon: 'https://internal-amis-res.cdn.bcebos.com/images/icon-1.png',
              text: '导航1'
            },
            {
              icon: 'https://internal-amis-res.cdn.bcebos.com/images/icon-1.png',
              text: '导航2'
            },
            {
              icon: 'https://internal-amis-res.cdn.bcebos.com/images/icon-1.png',
              text: '导航3'
            },
            {
              icon: 'https://internal-amis-res.cdn.bcebos.com/images/icon-1.png',
              text: '导航4'
            }
          ]
        },
        body: [
          {
            type: 'grid-nav',
            source: '${items}'
          },
          {
            type: 'divider'
          },
          {
            type: 'grid-nav',
            name: 'items'
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});
