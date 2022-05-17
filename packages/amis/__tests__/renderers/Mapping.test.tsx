import React = require('react');
import {render} from '@testing-library/react';
import '../../src/themes/default';
import {render as amisRender} from '../../src/index';
import {makeEnv} from '../helper';

test('Renderer:mapping', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'mapping',
        mapping: {
          1: "<span class='label label-info'>漂亮</span>",
          2: "<span class='label label-success'>开心</span>",
          3: "<span class='label label-danger'>惊吓</span>",
          4: "<span class='label label-warning'>紧张</span>",
          '*': '其他：${type}'
        }
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});
