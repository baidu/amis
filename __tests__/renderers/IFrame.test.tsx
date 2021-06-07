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
