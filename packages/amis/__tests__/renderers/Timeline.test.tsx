import React = require('react');
import {render, cleanup} from '@testing-library/react';
import '../../src/themes/default';
import {render as amisRender} from '../../src/index';
import {makeEnv} from '../helper';
import {clearStoresCache} from '../../src/factory';

afterEach(() => {
  cleanup();
  clearStoresCache();
});

test('Renderer:timeline', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'timeline',
        items: [
            {
              time: "2019-02-07",
              title: "节点数据",
              color: "#ffb200",
            },
            {
              time: "2019-02-08",
              title: "节点数据",
              color: "#4F86F4",
            },
            {
              time: "2019-02-09",
              title: "节点数据",
              color: "success",
            },
            {
              time: "2019-02-09",
              title: "节点数据",
              color: "warning",
            }
          ]
      },
      {},
      makeEnv()
    )
  );
  expect(container).toMatchSnapshot();
});
