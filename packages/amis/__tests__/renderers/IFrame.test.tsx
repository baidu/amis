import React = require('react');
import {render} from '@testing-library/react';
import '../../src/themes/default';
import {render as amisRender} from '../../src/index';
import {makeEnv} from '../helper';

test('Renderer:iframe', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'iframe',
        className: 'b-a',
        src: 'https://www.baidu.com',
        height: 500,
        width: 500
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});

test('Renderer:iframe-var', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        data: {url: 'https://www.baidu.com'},
        body: {
          type: 'iframe',
          className: 'b-a',
          src: '$url',
          height: 500,
          width: 500
        }
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});

test('Renderer:iframe-escape', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'iframe',
        className: 'b-a',
        src: 'https://www.baidu.com/?s=%25f',
        height: 500,
        width: 500
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});
