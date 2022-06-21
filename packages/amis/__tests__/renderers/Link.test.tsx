import React = require('react');
import {render} from '@testing-library/react';
import '../../src';
import {render as amisRender} from '../../src';
import {makeEnv} from '../helper';

test('Renderer:link', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'link',
        href: 'https://www.baidu.com',
        placeholder: 'link address',
        className: 'show',
        blank: true
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});
