import React = require('react');
import {render} from '@testing-library/react';
import '../../src';
import {render as amisRender} from '../../src';
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

test('Renderer:images', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        data: {
          imageList: [
            'https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg,q_80',
            'https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692942/d8e4992057f9.jpeg@s_0,w_216,l_1,f_jpg,q_80',
            'https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693148/1314a2a3d3f6.jpeg@s_0,w_216,l_1,f_jpg,q_80',
            'https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693379/8f2e79f82be0.jpeg@s_0,w_216,l_1,f_jpg,q_80',
            'https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693566/552b175ef11d.jpeg@s_0,w_216,l_1,f_jpg,q_80'
          ]
        },
        body: [
          {
            type: 'images',
            source: '${imageList}'
          },
          {
            type: 'divider'
          },
          {
            type: 'images',
            name: 'imageList'
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});
