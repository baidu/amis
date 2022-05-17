import React = require('react');
import {render} from '@testing-library/react';
import '../../src/themes/default';
import {render as amisRender} from '../../src/index';
import {makeEnv} from '../helper';

test('Renderer:tesks', () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'tasks',
          name: 'tasks',
          items: [
            {
              label: 'hive 任务',
              key: 'hive',
              status: 4,
              remark:
                '查看详情<a target="_blank" href="http://www.baidu.com">日志</a>。'
            },
            {
              label: '小流量',
              key: 'partial',
              status: 4
            },
            {
              label: '全量',
              key: 'full',
              status: 4
            }
          ]
        }
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});
