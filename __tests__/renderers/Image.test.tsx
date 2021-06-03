import React = require('react');
import {render} from '@testing-library/react';
import '../../src/themes/default';
import {render as amisRender} from '../../src/index';
import {makeEnv} from '../helper';

test('Renderer:image', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'image',
        defaultImage: 'https://www.baidu.com/img/bd_logo1.png',
        title: '图片',
        description: '图片描述',
        imageClassName: 'b',
        className: 'show'
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});
