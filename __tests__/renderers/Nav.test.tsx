import React = require('react');
import {render} from '@testing-library/react';
import '../../src/themes/default';
import {render as amisRender} from '../../src/index';
import {makeEnv} from '../helper';

test('Renderer:nav', () => {
  const {container} = render(
    amisRender(
      {
        type: 'nav',
        stacked: true,
        className: 'w-md',
        itemBadge: {
          mode: 'ribbon',
          text: '${customText}',
          position: 'top-left',
          visibleOn: 'this.customText',
          level: '${customLevel}'
        },
        links: [
          {
            id: 0,
            label: 'Nav 1',
            to: '/docs/index',
            icon: 'https://suda.cdn.bcebos.com/images%2F2021-01%2Fdiamond.svg',
            active: true
          },
          {
            id: 1,
            label: 'Nav 2',
            to: '/docs/api',
            customText: 'HOT',
            customLevel: 'danger'
          },
          {
            id: 2,
            label: 'Nav 3',
            to: '/docs/renderers',
            customText: 'SUC',
            customLevel: 'success'
          },
          {
            id: 3,
            label: '外部地址',
            to: 'http://www.baidu.com/',
            target: '_blank'
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});
